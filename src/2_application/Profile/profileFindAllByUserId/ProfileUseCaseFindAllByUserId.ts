import { Profile } from "../../../1_domain/Profile/Profile.js";
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

// El DTO de entrada es simple: solo el ID del usuario
export interface FindProfilesByUserInput {
    userId: string;
}

/* ojito Este Caso de Uso es el puente perfecto entre la Capa de Presentación
 (que obtiene el userId del token JWT) y la Capa de Infraestructura (el repositorio).*/ 
export class ProfileUseCaseFindAllByUserId {

     constructor(private readonly profileRepo: IProfileRepository){}

    /** 
     * Ejecuta el caso de uso para encontrar todos los perfiles asociados a un usuario.
     * @param input Contiene el ID de la cuenta del usuario.
     * @returns Una promesa que resuelve con un array de entidades Profile.
     */
    /*
    async execute(input: FindProfilesByUserInput): Promise<Profile[]> {
        
        // 1. Validación de Dominio (mínima, asegura que el ID no esté vacío)
        if (!input.userId) {
            throw new Error('El ID de usuario es requerido para buscar perfiles.');
        }

        // 2. Consulta al Repositorio
        // Llama al método que definiste en IProfileRepository
        //return await this.profileRepo.findAllByUserId(input.userId);
 }
*/ // TEMPORAL
}