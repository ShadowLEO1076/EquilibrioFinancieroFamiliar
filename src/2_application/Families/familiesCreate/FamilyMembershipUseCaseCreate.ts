// src/2_application/Families/FamilyMembershipUseCaseCreate.ts

import { v4 as uuidv4 } from 'uuid';

//  ¡DESCOMENTAMOS ESTO! Son vitales para que funcione
import { FamilyRole, FamilyMembership } from "../../../1_domain/Families/FamilyMembership.js";
import type { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js";

import type { IFamilyRepository } from "../../../1_domain/Family/IFamilyRepository.js";
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

// --- DTO de Entrada ---
export interface JoinFamilyInput {
    profileId: string;    // El ID del perfil que intenta unirse (quién)
    inviteCode: string;   // El código de la familia (a dónde)
}

export class FamilyMembershipUseCaseCreate {
    
    constructor(
        private readonly membershipRepo: IFamilyMembershipRepository,
        private readonly familyRepo: IFamilyRepository,
        private readonly profileRepo: IProfileRepository 
    ){}

    async execute(input: JoinFamilyInput): Promise<FamilyMembership> {

        // 1. Validar Existencia del Perfil (Actor)
        const joiningProfile = await this.profileRepo.findById(input.profileId);
        if (!joiningProfile) {
            throw new Error('El perfil de usuario que intenta unirse no existe.');
        }

        // 2. Buscar la Familia por Código de Invitación (Destino)
        const familyToJoin = await this.familyRepo.findByInviteCode(input.inviteCode);
        if (!familyToJoin) {
            throw new Error('El código de invitación no es válido o la familia no existe.');
        }

        // 3. Validar que el Perfil NO esté ya en la Familia (Duplicidad)
        const existingMembership = await this.membershipRepo.findByProfileAndFamilyId(
            input.profileId, 
            familyToJoin.id
        );
        if (existingMembership) {
            throw new Error('Este perfil ya es miembro de la familia.');
        }

        // 4. Generar ID y Crear la Entidad de Membresía (Role MEMBER)
        const newMembershipId = uuidv4();
        
        let newMembership = new FamilyMembership(
            newMembershipId,
            input.profileId,
            familyToJoin.id,
            'MEMBER' as FamilyRole // El rol por defecto al unirse por invitación
        );

        // 5. Guardar la nueva Membresía
        return await this.membershipRepo.save(newMembership);
    }
}