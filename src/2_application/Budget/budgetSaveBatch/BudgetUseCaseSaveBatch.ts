import { v4 as uuidv4 } from 'uuid';
import { Budget } from "../../../1_domain/Budget/Budget.js";
import { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";

export interface BudgetBatchItem {
    categoryId: string;
    amount: number;
}

export class BudgetUseCaseSaveBatch {

    constructor(
        private readonly budgetRepo: IBudgetRepository
    ) { }

    async execute(profileId: string, budgetsInput: BudgetBatchItem[]) {

        // 1. Traemos los presupuestos que ya existen de este perfil
        const existingBudgets = await this.budgetRepo.findAllByProfileId(profileId);

        const results = [];

        // 2. Procesamos la lista que llegó del Frontend
        for (const item of budgetsInput) {

            // Buscamos si ya existe presupuesto para esta categoría
            let budget = existingBudgets.find(b => b.categoryId === item.categoryId);

            if (budget) {
                // A. Si existe -> ACTUALIZAR MONTO
                budget.amount = item.amount;
                // Recalculamos el restante: (Nuevo Monto - Lo que ya gasté)
                budget.remaining = budget.amount - budget.spent;
                budget.updatedAt = new Date();

                await this.budgetRepo.update(budget);
                results.push(budget);

            } else {
                // B. Si no existe -> CREAR NUEVO
                const now = new Date();
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                // Aseguramos que si hoy es el último día, al menos tenga 1 día de validez o manejamos la lógica
                if (now >= endOfMonth) {
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                }

                const newBudget = new Budget(
                    uuidv4(),
                    profileId,
                    item.categoryId,
                    item.amount,
                    {
                        type: 'monthly',
                        startDate: now,
                        endDate: endOfMonth
                    },
                    0, // spent
                    item.amount, // remaining (igual al amount inicial)
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