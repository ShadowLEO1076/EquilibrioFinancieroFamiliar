import { v4 as uuidv4 } from 'uuid';
import { FamilyMembership, FamilyRole } from "../../../1_domain/Families/FamilyMembership.js";
import type { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js";
import type { IFamilyRepository } from "../../../1_domain/Family/IFamilyRepository.js";
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

// Input para unirse a una familia
export interface JoinFamilyInput {
    profileId: string;
    inviteCode: string;
}

export class FamilyUseCaseJoin {

    constructor(
        private readonly membershipRepo: IFamilyMembershipRepository,
        private readonly familyRepo: IFamilyRepository,
        private readonly profileRepo: IProfileRepository
    ) { }

    async execute(input: JoinFamilyInput): Promise<FamilyMembership> {

        // 1. Validar que el perfil existe
        const profile = await this.profileRepo.findById(input.profileId);
        if (!profile) {
            throw new Error('Profile not found');
        }

        // 2. Buscar la familia por código de invitación
        const family = await this.familyRepo.findByInviteCode(input.inviteCode);
        if (!family) {
            throw new Error('Invalid invite code');
        }

        // 3. Verificar que el perfil no esté ya en la familia
        const existingMembership = await this.membershipRepo.findByProfileAndFamilyId(
            input.profileId,
            family.id
        );
        if (existingMembership) {
            throw new Error('Profile is already a member of this family');
        }

        // 4. Crear la nueva membresía con rol 'MEMBER'
        const newMembershipId = uuidv4();
        const membership = new FamilyMembership(
            newMembershipId,
            input.profileId,
            family.id,
            FamilyRole.MEMBER  // Using enum value
        );

        // 5. Guardar la membresía
        const savedMembership = await this.membershipRepo.save(membership);

        return savedMembership;
    }
}