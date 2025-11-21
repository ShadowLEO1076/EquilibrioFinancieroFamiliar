import type { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";

export class BudgetUseCaseDelete {
    constructor(private readonly budgetRepo: IBudgetRepository) {}

    async execute(id: string): Promise<void> {
        await this.budgetRepo.delete(id);
    }
}