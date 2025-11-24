import { v4 as uuidv4 } from 'uuid';
import { Income, IncomeType } from "../../1_domain/Income/Income.js";
import { IIncomeRepository } from "../../1_domain/Income/IIncomeRepository.js";
import { ICategoryRepository } from "../../1_domain/Category/ICategoryRepository.js";

// Definimos qué datos esperamos del Frontend (sin IDs ni fechas automáticas)
export interface CreateIncomeInput {
    amount: number;
    description: string;
    categoryId: string;
    date: Date;
    incomeSource: IncomeType; // Usamos el Enum
    profileId: string;
}

export class IncomeUseCaseSave {

    constructor(
        private readonly incomeRepo: IIncomeRepository,
        private readonly categoryRepo: ICategoryRepository // Única dependencia extra necesaria
    ) { }

    async execute(input: CreateIncomeInput, userId: string): Promise<Income> {

        // --- 🛡️ 1. VALIDACIÓN DE SEGURIDAD (Lógica de tu amigo) ---
        // Buscamos las categorías permitidas para este perfil.
        // (Nota: Si el perfil no existiera, esto devolvería array vacío y fallaría abajo, 
        // así que nos ahorramos llamar a ProfileRepo).
        const categories = await this.categoryRepo.findAllAvailableForProfile(input.profileId);

        // Verificamos si la categoría del input es válida
        const catExist = categories.some(cat => cat.id === input.categoryId);

        if (!catExist) {
            throw new Error("Security Error: Category does not belong to this profile or does not exist.");
        }
        // ------------------------------------------------------------

        // 2. Crear la Entidad Income (Generamos ID y fecha aquí)
        const newIncome = new Income(
            uuidv4(),            // ID Automático
            input.amount,
            input.description,
            input.categoryId,
            input.date,
            input.incomeSource,
            input.profileId,
            userId,              //  Inyectamos el usuario del Token
            true                 // isActive
        );

        // 3. Guardar
        const data = await this.incomeRepo.save(newIncome);

        return data;
    }
}