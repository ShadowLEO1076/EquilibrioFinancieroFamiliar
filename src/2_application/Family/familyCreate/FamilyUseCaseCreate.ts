import { v4 as uuidv4 } from 'uuid';
// Importamos Entidades y Repositorios de Familia y Membresía
import { Family } from "../../../1_domain/Family/Family.js";
import type { IFamilyRepository } from "../../../1_domain/Family/IFamilyRepository.js";
import { FamilyMembership, FamilyRole } from "../../../1_domain/Families/FamilyMembership.js";
import type { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js";

// Definimos el Input específico.
// NO usamos Omit<Family> porque 'inviteCode' es obligatorio en la Entidad
// pero NO debe venir en el input (lo generamos nosotros).
export interface CreateFamilyInput {
    name: string;
    adminProfileId: string; // El ID del perfil que está creando la familia
}

export class FamilyUseCaseCreate {
    
    // Inyectamos DOS repositorios: uno para la familia, otro para unir al admin
    constructor(
        private readonly familyRepo: IFamilyRepository,
        private readonly membershipRepo: IFamilyMembershipRepository
    ){}

    async execute(input: CreateFamilyInput): Promise<Family> {

        // 1. LÓGICA EXTRA: Generación de Código de Invitación Único
        let inviteCode = '';
        let isUnique = false;
        
        // Bucle simple para asegurar unicidad (reintenta si el código ya existe)
        while (!isUnique) {
            inviteCode = this.generateCode();
            const existing = await this.familyRepo.findByInviteCode(inviteCode);
            if (!existing) isUnique = true;
        }

        // 2. Generamos ID para la Familia
        const newFamilyId = uuidv4();

        // 3. Creamos la Entidad Familia
        let family = new Family(
            newFamilyId,
            input.name,
            inviteCode,          // El código generado
            input.adminProfileId // Referencia al creador
        );

        // 4. Guardamos la Familia
        const savedFamily = await this.familyRepo.save(family);


        // 5. LÓGICA EXTRA CRUCIAL: Crear la Membresía del Admin
        // El perfil creador se une automáticamente con rol 'ADMIN'
        const newMembershipId = uuidv4();

        let adminMembership = new FamilyMembership(
            newMembershipId,
            input.adminProfileId, // El perfil del input
            savedFamily.id,       // La familia recién creada
            'ADMIN' as FamilyRole // ¡Aquí definimos el poder!
        );

        // 6. Guardamos la Membresía
        await this.membershipRepo.save(adminMembership);


        // 7. Retornamos la familia creada
        return savedFamily;
    }

    // Helper privado para generar códigos alfanuméricos (ej: "K8J2P1")
    private generateCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}