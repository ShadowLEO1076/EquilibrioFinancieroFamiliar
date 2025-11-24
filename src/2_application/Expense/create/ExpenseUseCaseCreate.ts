import { v4 as uuidv4 } from 'uuid';
import { Expense, PaymentMethod } from "../../1_domain/Expense/Expense.js";
import type { IExpenseRepository } from "../../1_domain/Expense/IExpenseRepository.js";
import type { IBudgetRepository } from "../../1_domain/Budget/IBudgetRepository.js"; // 👈 ¡DOBLE INYECCIÓN!

export interface CreateExpenseInput {
    amount: number;
    description: string;
    categoryId: string;
    date: Date;
    paymentMethod: PaymentMethod;
    profileId: string;
    userId: string; // Pacto con tu amigo
}

export class ExpenseUseCaseCreate {

    constructor(
        private readonly expenseRepo: IExpenseRepository,
        private readonly budgetRepo: IBudgetRepository // 👈 Inyectamos el repo de presupuestos
    ) { }

    async execute(input: CreateExpenseInput): Promise<Expense> {

        // 1. Crear la Entidad Gasto
        const expense = new Expense(
            uuidv4(),
            input.amount,
            input.description,
            input.categoryId,
            input.date,
            input.paymentMethod,
            input.profileId,
            input.userId
        );

        // 2. Guardar el Gasto (Primer Impacto)
        await this.expenseRepo.save(expense);

        // --- 🧠 LÓGICA MAESTRA: Afectar el Presupuesto ---

        // 3. Buscamos TODOS los presupuestos de este perfil
        const budgets = await this.budgetRepo.findAllByProfileId(input.profileId);

        // 4. Filtramos: ¿Existe un presupuesto activo para ESTA categoría?
        const affectedBudget = budgets.find(b => b.categoryId === input.categoryId && b.isActive);

        if (affectedBudget) {
            // 5. ¡Sí existe! Usamos el método de dominio para restar dinero
            affectedBudget.addExpense(expense.amount);

            // 6. Guardamos el presupuesto actualizado (Segundo Impacto)
            await this.budgetRepo.update(affectedBudget);
        }

        return expense;
    }
}