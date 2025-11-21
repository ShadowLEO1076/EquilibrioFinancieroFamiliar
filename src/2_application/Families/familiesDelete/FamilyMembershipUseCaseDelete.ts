// src/2_application/Families/FamilyMembershipUseCaseDelete.ts

import type { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js";

export class FamilyMembershipUseCaseLeave {
    constructor(private readonly membershipRepo: IFamilyMembershipRepository) {}

    async execute(id: string): Promise<void> {
        // Aquí podrías validar si es el último admin antes de borrar
        await this.membershipRepo.delete(id);
    }
}


