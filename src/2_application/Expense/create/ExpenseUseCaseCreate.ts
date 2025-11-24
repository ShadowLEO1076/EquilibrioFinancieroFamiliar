import { v4 as uuidv4 } from 'uuid';
import { Expense, PaymentMethod } from "../../../1_domain/Expense/Expense.js";
import type { IExpenseRepository } from "../../../1_domain/Expense/IExpenseRepository.js";
import type { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";
import type { ICategoryRepository } from "../../../1_domain/Category/ICategoryRepository.js"; // 1. IMPORTAR

export interface CreateExpenseInput {
    amount: number;
    description: string;
    categoryId: string;
    date: Date;
    paymentMethod: PaymentMethod;
    profileId: string;
    userId: string;
}

export class ExpenseUseCaseCreate {

    constructor(
        private readonly expenseRepo: IExpenseRepository,
        private readonly budgetRepo: IBudgetRepository,
        private readonly categoryRepo: ICategoryRepository // 2. INYECTAR
    ) { }

    async execute(input: CreateExpenseInput): Promise<Expense> {

        // --- 🛡️ LÓGICA DE TU AMIGO (ADAPTADA) ---

        // A. Buscamos todas las categorías permitidas para este perfil
        // (Nota: Usamos nuestro nombre de método 'findAllAvailableForProfile')
        const categories = await this.categoryRepo.findAllAvailableForProfile(input.profileId);

        // B. Verificamos si la categoryId que nos mandaron existe en esa lista
        const catExist = categories.some(cat => cat.id === input.categoryId);

        // C. Si no existe o no es mía, lanzamos el error
        if (!catExist) {
            throw new Error("Security Error: Category does not belong to this profile or does not exist.");
        }

        // ----------------------------------------

        // 3. Crear la Entidad Gasto
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

        // 4. Guardar el Gasto
        await this.expenseRepo.save(expense);

        // 5. Afectar el Presupuesto (La lógica que ya teníamos)
        const budgets = await this.budgetRepo.findAllByProfileId(input.profileId);
        const affectedBudget = budgets.find(b => b.categoryId === input.categoryId && b.isActive);

        if (affectedBudget) {
            affectedBudget.addExpense(expense.amount);
            await this.budgetRepo.update(affectedBudget);
        }

        return expense;
    }
}