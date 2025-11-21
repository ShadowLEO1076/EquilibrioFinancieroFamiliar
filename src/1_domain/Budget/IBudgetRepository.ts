import { Budget } from "./Budget.js";

export interface IBudgetRepository {
    
    // Guardar un nuevo presupuesto
    save(budget: Budget): Promise<Budget>; 

    // Buscar uno específico (por ID)
    findById(id: string): Promise<Budget | null>;

    // ¡VITAL! Buscar todos los presupuestos de UN perfil específico
    findAllByProfileId(profileId: string): Promise<Budget[]>;

    // Actualizar (y devolver la entidad actualizada es buena práctica)
    update(budget: Budget): Promise<Budget>;

    // Borrar
    delete(id: string): Promise<void>;
}