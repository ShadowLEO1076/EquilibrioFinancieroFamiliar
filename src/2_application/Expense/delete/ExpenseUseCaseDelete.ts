import type { IExpenseRepository } from "../../../1_domain/Expense/IExpenseRepository.js";
import type { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";

export class ExpenseUseCaseDelete {

    constructor(
        private readonly expenseRepo: IExpenseRepository,
        private readonly budgetRepo: IBudgetRepository
    ) { }

    async execute(expenseId: string): Promise<void> {
        // 1. Primero necesitamos saber cuánto era el gasto y de qué categoría
        const expense = await this.expenseRepo.findById(expenseId);
        if (!expense) throw new Error("Expense not found");

        // 2. Borramos el gasto
        await this.expenseRepo.delete(expenseId);

        // 3. --- REEMBOLSAR AL PRESUPUESTO ---
        const budgets = await this.budgetRepo.findAllByProfileId(expense.profileId);
        const affectedBudget = budgets.find(b => b.categoryId === expense.categoryId && b.isActive);

        if (affectedBudget) {
            // Usamos el método removeExpense que te sugerí agregar a la Entidad Budget
            // (Si no lo agregaste, tendrás que restar manualmente aquí, pero mejor hazlo en la entidad)
            affectedBudget.removeExpense(expense.amount);
            await this.budgetRepo.update(affectedBudget);
        }
    }
}