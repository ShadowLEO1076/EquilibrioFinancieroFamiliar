import { Budget } from "../../../1_domain/Budget/Budget.js";
import type { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";

// DTO parcial: Solo enviamos lo que queremos cambiar
export interface UpdateBudgetInput {
    id: string;
    amount?: number;
    isActive?: boolean;
    // Podríamos añadir alerts, period, etc.
}

export class BudgetUseCaseUpdate {
    constructor(private readonly budgetRepo: IBudgetRepository) {}

    async execute(input: UpdateBudgetInput): Promise<Budget> {
        // 1. Buscamos el actual
        const budget = await this.budgetRepo.findById(input.id);
        if (!budget) throw new Error("Budget not found");

        // 2. Aplicamos cambios
        if (input.isActive !== undefined) {
            budget.isActive = input.isActive;
        }

        if (input.amount) {
            if (input.amount <= 0) throw new Error("Amount must be positive");
            budget.amount = input.amount;
            //  RECALCULO AUTOMÁTICO
            budget.remaining = budget.amount - budget.spent;
        }
        
        budget.updatedAt = new Date();

        // 3. Guardamos
        return await this.budgetRepo.update(budget);
    }
}