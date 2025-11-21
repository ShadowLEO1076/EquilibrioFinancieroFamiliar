import { Budget } from "../../../1_domain/Budget/Budget.js";
import type { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";

// Ver un presupuesto específico
export class BudgetUseCaseFindById {
    constructor(private readonly budgetRepo: IBudgetRepository) {}

    async execute(id: string): Promise<Budget> {
        const budget = await this.budgetRepo.findById(id);
        if (!budget) throw new Error("Budget not found");
        return budget;
    }
}

// Ver todos los presupuestos de un perfil (Dashboard)
export class BudgetUseCaseFindAllByProfile {
    constructor(private readonly budgetRepo: IBudgetRepository) {}

    async execute(profileId: string): Promise<Budget[]> {
        return await this.budgetRepo.findAllByProfileId(profileId);
    }
}