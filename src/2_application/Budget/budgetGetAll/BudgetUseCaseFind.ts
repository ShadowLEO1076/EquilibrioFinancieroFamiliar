// Sirve para get all budgets
import { Budget } from "../../../1_domain/Budget/Budget.js";
import type { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";
export class BudgetUseCaseFind {
    constructor(private readonly budgetRepo: IBudgetRepository) {}
    // metodo para obtener todos los presupuestos
    async execute(): Promise<Budget[]> {
        return await this.budgetRepo.getAll();
    }
}

//# sourceMappingURL=BudgetUseCaseFind.d.ts.map