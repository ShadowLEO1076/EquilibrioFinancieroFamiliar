// src/2_application/Family/familyFindById/FamilyUseCaseFind.ts 

import { Family } from "../../../1_domain/Family/Family.js";
import type { IFamilyRepository } from "../../../1_domain/Family/IFamilyRepository.js";

export class FamilyUseCaseFindById {
    constructor(private readonly familyRepo: IFamilyRepository) {}

    async execute(id: string): Promise<Family> {
        const family = await this.familyRepo.findById(id);
        if (!family) throw new Error("Family not found");
        return family;
    }
}

export class FamilyUseCaseFindByInviteCode {
    constructor(private readonly familyRepo: IFamilyRepository) {}

    async execute(code: string): Promise<Family> {
        const family = await this.familyRepo.findByInviteCode(code);
        if (!family) throw new Error("Invalid invite code");
        return family;
    }
}

