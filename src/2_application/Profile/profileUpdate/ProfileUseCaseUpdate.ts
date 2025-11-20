import { Profile, ProfilePreferences } from "../../../1_domain/Profile/Profile.js";
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

// 📦 DTO: Permitimos actualizar nombre y/o preferencias
export interface UpdateProfileInput {
    id: string;
    name?: string;
    preferences?: Partial<ProfilePreferences>; // Partial permite enviar solo lo que cambió
}

export class ProfileUseCaseUpdate {
    constructor(private readonly profileRepo: IProfileRepository) {}

    async execute(input: UpdateProfileInput): Promise<Profile> {
        // 1. Recuperamos la entidad actual
        const profile = await this.profileRepo.findById(input.id);
        if (!profile) {
            throw new Error(`Profile not found`);
        }

        // 2. Modificamos la entidad (Logic de negocio simple aquí)
        if (input.name) {
            profile.name = input.name;
        }

        if (input.preferences) {
            // Fusionamos las preferencias actuales con las nuevas
            profile.preferences = {
                ...profile.preferences,
                ...input.preferences
            };
            
            // Re-validación manual si fuera necesaria (aunque el objeto Profile no tiene setters con validación compleja aún)
            if (profile.preferences.monthlyBudget < 0) throw new Error("Budget cannot be negative");
        }
        
        profile.updatedAt = new Date();

        // 3. Guardamos la entidad modificada
        return await this.profileRepo.update(profile);
    }
}