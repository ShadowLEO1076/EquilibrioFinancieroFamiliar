import { v4 as uuidv4 } from 'uuid';
import { Budget, BudgetPeriod, BudgetAlert } from "../../../1_domain/Budget/Budget.js";
import type { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";

// --- 1. DTO DE ENTRADA (Solo lo necesario) ---
export interface CreateBudgetInput {
    profileId: string;
    categoryId: string;
    amount: number;
    period: BudgetPeriod;
    alerts?: BudgetAlert[]; // Opcional
}

export class BudgetUseCaseCreate {
    
    constructor(private readonly budgetRepo: IBudgetRepository) {}

    async execute(input: CreateBudgetInput): Promise<Budget> {

        // 1. Generamos el ID aquí (Control total)
        const newId = uuidv4();

        // 2. Instanciamos la Entidad
        // Fíjate: spent inicia en 0 y remaining igual al amount.
        const budget = new Budget(
            newId,
            input.profileId,
            input.categoryId,
            input.amount,
            input.period,
            0,              // spent (inicia en 0)
            input.amount,   // remaining (inicia lleno)
            input.alerts || [], // Si no envían alertas, array vacío
            true            // isActive
        );

        // 3. Guardamos usando el método 'save' (estándar)
        return await this.budgetRepo.save(budget);
    }
}