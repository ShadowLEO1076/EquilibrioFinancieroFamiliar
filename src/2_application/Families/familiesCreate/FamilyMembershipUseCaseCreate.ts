// Imports necesarios
import { v4 as uuidv4 } from 'uuid';
//import { FamilyRole, FamilyMembership } from "../../../1_domain/Families/FamilyMembership.js"; temporal
//import type { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js"; TEMPORAL
import type { IFamilyRepository } from "../../../1_domain/Family/IFamilyRepository.js";
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

// --- 1. DTO de Entrada ---
export interface JoinFamilyInput {
    profileId: string;    // El ID del perfil que intenta unirse (quién)
    inviteCode: string;   // El código de la familia (a dónde)
}
/*
export class FamilyMembershipUseCaseCreate {
    
    constructor(
        private readonly membershipRepo: IFamilyMembershipRepository,
        private readonly familyRepo: IFamilyRepository,
        private readonly profileRepo: IProfileRepository // Para validar que el perfil exista
    ){}

    async execute(input: JoinFamilyInput): Promise<FamilyMembership> {

        // 1. Validar Existencia del Perfil
        const joiningProfile = await this.profileRepo.findById(input.profileId);
        if (!joiningProfile) {
            throw new Error('El perfil de usuario que intenta unirse no existe.');
        }

        // 2. Buscar la Familia por Código de Invitación
        // Nota: Asegúrate que findByInviteCode esté en IFamilyRepository
        const familyToJoin = await this.familyRepo.findByInviteCode(input.inviteCode);
        if (!familyToJoin) {
            throw new Error('El código de invitación no es válido o la familia no existe.');
        }

        // 3. Validar que el Perfil NO esté ya en la Familia
        // Nota: Necesitas un método en el repositorio que busque por ambos IDs.
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
            'MEMBER' as FamilyRole // El rol por defecto al unirse por invitación es MEMBER
        );

        // 5. Guardar la nueva Membresía
        return await this.membershipRepo.save(newMembership);
    }
}
    */ //TEMPORAL