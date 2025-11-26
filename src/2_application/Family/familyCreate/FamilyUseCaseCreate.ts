import { v4 as uuidv4 } from 'uuid';
import { Family } from "../../../1_domain/Family/Family.js";
import type { IFamilyRepository } from "../../../1_domain/Family/IFamilyRepository.js";
import { FamilyMembership, FamilyRole } from "../../../1_domain/Families/FamilyMembership.js";
import type { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js";

export interface CreateFamilyInput {
    name: string;
    adminProfileId: string;
}

export class FamilyUseCaseCreate {

    constructor(
        private readonly familyRepo: IFamilyRepository,
        private readonly membershipRepo: IFamilyMembershipRepository
    ) { }

    async execute(input: CreateFamilyInput): Promise<Family> {

        // 1. Generar Código Único
        let inviteCode = '';
        let isUnique = false;

        while (!isUnique) {
            inviteCode = this.generateCode();
            const existing = await this.familyRepo.findByInviteCode(inviteCode);
            if (!existing) isUnique = true;
        }

        // 2. Crear la Familia
        const newFamilyId = uuidv4();
        const now = new Date(); // Usamos la misma fecha para todo

        let family = new Family(
            newFamilyId,
            input.name,
            inviteCode,
            input.adminProfileId,
            now, // CreatedAt
            now  // UpdatedAt
        );

        // 3. Guardar la Familia (Esto funciona bien)
        const savedFamily = await this.familyRepo.save(family);

        // 4. Crear la Membresía del Admin
        const newMembershipId = uuidv4();

        // ⚠️ CORRECCIÓN IMPORTANTE AQUÍ 👇
        // Faltaban 'isActive' y 'joinedAt' en tu código anterior
        let adminMembership = new FamilyMembership(
            newMembershipId,
            input.adminProfileId,
            savedFamily.id,
            // Asegúrate de que FamilyRole.ADMIN sea 'admin' (minúscula) en tu archivo de Dominio
            FamilyRole.ADMIN,
            true,       // isActive (FALTABA ESTO)
            now         // joinedAt (FALTABA ESTO)
        );

        // 5. Guardar la Membresía
        // Si esto falla por validación, revisa que FamilyRole.ADMIN = 'admin'
        await this.membershipRepo.save(adminMembership);

        return savedFamily;
    }

    private generateCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}