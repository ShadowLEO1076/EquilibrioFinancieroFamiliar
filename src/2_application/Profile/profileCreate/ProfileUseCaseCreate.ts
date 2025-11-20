import { v4 as uuidv4 } from 'uuid';
import { Profile, ProfilePreferences } from "../../../1_domain/Profile/Profile.js";
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

//  DTO de Entrada: Solo lo necesario para crear
export interface CreateProfileInput {
    userId: string;
    name: string;
    preferences: ProfilePreferences;
}

export class ProfileUseCaseCreate {
    constructor(private readonly profileRepo: IProfileRepository) {}

    async execute(input: CreateProfileInput): Promise<Profile> {
        // 1. Generamos identidad aquí (Aplicación manda)
        const newId = uuidv4();

        // 2. Creamos la entidad (Dominio valida reglas)
        const profile = new Profile(
            newId,
            input.userId,
            input.name,
            input.preferences
        );

        // 3. Persistimos
        return await this.profileRepo.save(profile);
    }
}