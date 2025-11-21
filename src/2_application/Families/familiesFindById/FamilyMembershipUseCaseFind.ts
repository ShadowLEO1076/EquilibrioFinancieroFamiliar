// src/2_application/Families/FamilyMembershipUseCaseFind.ts

import { FamilyMembership } from "../../../1_domain/Families/FamilyMembership.js";
import type { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js";

export class FamilyMembershipUseCaseFindMyFamilies {
    constructor(private readonly membershipRepo: IFamilyMembershipRepository) {}

    // Este caso de uso devolverá todas las membresías de un perfil
    // (Luego en el frontend usaremos esto para buscar los nombres de las familias)
    async execute(profileId: string): Promise<FamilyMembership[]> {
        return await this.membershipRepo.findAllByProfileId(profileId);
    }
}

export class FamilyMembershipUseCaseFindMembers {
    constructor(private readonly membershipRepo: IFamilyMembershipRepository) {}

    // Ver todos los miembros de una familia
    async execute(familyId: string): Promise<FamilyMembership[]> {
        return await this.membershipRepo.findAllByFamilyId(familyId);
    }
}