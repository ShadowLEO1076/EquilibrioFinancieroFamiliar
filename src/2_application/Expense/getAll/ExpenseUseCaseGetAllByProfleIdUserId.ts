import { Expense } from "../../../1_domain/Expense/Expense.js";
import type { IExpenseRepository } from "../../../1_domain/Expense/IExpenseRepository.js";

// Borramos IProfileRepository, no lo necesitamos aquí.

export class ExpenseUseCaseGetAllByProfileIdUserId {

        // Solo necesitamos el repositorio de gastos.
        constructor(
                private readonly expenseRepo: IExpenseRepository
        ) { }

        async execute(profileId: string): Promise<Expense[]> {
                // Directo al grano: Buscamos gastos por profileId
                return await this.expenseRepo.findAllByProfileId(profileId);
        }
}