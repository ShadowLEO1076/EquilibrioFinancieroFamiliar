import { Profile } from "../../../1_domain/Profile/Profile.js";
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

export class ProfileUseCaseFindById {
    constructor(private readonly profileRepo: IProfileRepository) {}

    async execute(id: string): Promise<Profile> {
        const profile = await this.profileRepo.findById(id);
        
        if (!profile) {
            // Lanzamos error de Dominio/Aplicación si no existe
            throw new Error(`Profile with id ${id} not found`);
        }
        return profile;
    }
}

export class ProfileUseCaseFindAllByUserId {
    constructor(private readonly profileRepo: IProfileRepository) {}

    async execute(userId: string): Promise<Profile[]> {
        // Si no hay perfiles, simplemente devuelve array vacío, no es un error.
        return await this.profileRepo.findAllByUserId(userId);
    }
}