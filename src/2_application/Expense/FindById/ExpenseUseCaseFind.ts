// src/2_application/Expense/ExpenseUseCaseFind.ts
import { Expense } from "../../1_domain/Expense/Expense.js";
import type { IExpenseRepository } from "../../1_domain/Expense/IExpenseRepository.js";

export class ExpenseUseCaseGetAllByProfileIdUserId { // Puedes mantener este nombre de clase largo si quieres

    constructor(private readonly expenseRepo: IExpenseRepository) { }

    async execute(profileId: string): Promise<Expense[]> {
        // AQUÍ ESTÁ EL CAMBIO. Llama al método tal cual lo definiste en la interfaz.
        return await this.expenseRepo.findAllByProfileId(profileId);
    }
}