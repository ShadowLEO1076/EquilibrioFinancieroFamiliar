import { v4 as uuidv4 } from 'uuid';
import { Budget } from "../../../1_domain/Budget/Budget.js"; // Asegúrate de tener la Entidad
import { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";

// DTO de entrada: Lo que viene dentro del array
export interface BudgetBatchItem {
    categoryId: string;
    amount: number;
}

export class BudgetUseCaseSave {

    constructor(
        private readonly budgetRepo: IBudgetRepository
    ) { }

    async execute(profileId: string, budgetsInput: BudgetBatchItem[]) {

        // 1. Traemos los presupuestos que ya existen para no duplicarlos
        const existingBudgets = await this.budgetRepo.findAllByProfileId(profileId);

        const results = [];

        // 2. Procesamos cada ítem del array que envió el frontend
        for (const item of budgetsInput) {

            // Buscamos si ya existe presupuesto para esta categoría
            let budget = existingBudgets.find(b => b.categoryId === item.categoryId);

            if (budget) {
                // A. Si existe -> ACTUALIZAR
                // Nota: Aquí podrías usar un método updateLimit() en tu entidad si lo tienes
                budget.amount = item.amount;
                // Recalculamos restante (Amount - Spent)
                budget.remaining = budget.amount - budget.spent;
                budget.updatedAt = new Date();

                await this.budgetRepo.update(budget);
                results.push(budget);

            } else {
                // B. Si no existe -> CREAR
                const newBudget = new Budget(
                    uuidv4(),
                    profileId,
                    item.categoryId,
                    item.amount,
                    {
                        type: 'monthly',
                        startDate: new Date(), // Deberías calcular el 1er día del mes
                        endDate: new Date()    // Y el último día
                    },
                    0, // spent
                    item.amount, // remaining
                    [], // alerts
                    true // isActive
                );

                await this.budgetRepo.save(newBudget);
                results.push(newBudget);
            }
        }

        return results;
    }
}