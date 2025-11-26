import { IFamilyRepository } from "../../../1_domain/Family/IFamilyRepository.js";
import { IFamilyMembershipRepository } from "../../../1_domain/Families/IFamilyMembershipRepository.js";
import { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";
// AÑADIDO: Interfaces para cálculos financieros
import { IBudgetRepository } from "../../../1_domain/Budget/IBudgetRepository.js";
import { IExpenseRepository } from "../../../1_domain/Expense/IExpenseRepository.js";

export class FamilyUseCaseQueries {

    constructor(
        private readonly familyRepo: IFamilyRepository,
        private readonly membershipRepo: IFamilyMembershipRepository,
        private readonly profileRepo: IProfileRepository,
        // AÑADIDO: Inyectamos los repositorios financieros
        private readonly budgetRepo: IBudgetRepository,
        private readonly expenseRepo: IExpenseRepository
    ) { }

    // --- A. Para la pantalla "Mis Familias" ---
    async getMyFamilies(profileId: string) {
        // 1. Traer membresías
        const memberships = await this.membershipRepo.findAllByProfileId(profileId);

        // 2. Buscar info de cada familia
        const familiesData = await Promise.all(memberships.map(async (m) => {
            const family = await this.familyRepo.findById(m.familyId);
            if (!family) return null;

            // Opcional: Contar miembros (haciendo otro query pequeño)
            const allMembers = await this.membershipRepo.findAllByFamilyId(family.id);

            return {
                id: family.id,
                name: family.name,
                inviteCode: family.inviteCode, // Added inviteCode
                role: m.role, // Para saber si soy admin en la tarjeta
                isAdmin: m.role === 'admin',
                membersCount: allMembers.length
            };
        }));

        return familiesData.filter(f => f !== null);
    }

    // --- B. Para la pantalla "Detalle de Familia" (Dashboard) ---
    async getFamilyDetailsComplete(familyId: string) {
        console.log("Queries.getFamilyDetailsComplete ID:", familyId); // LOGGING

        // 1. Info Familia
        const family = await this.familyRepo.findById(familyId);
        console.log("Queries.getFamilyDetailsComplete Family Found:", family); // LOGGING

        if (!family) throw new Error("Familia no encontrada");

        // 2. Miembros
        const memberships = await this.membershipRepo.findAllByFamilyId(familyId);

        // 3. Enriquecer con Nombres de Perfil Y DATOS FINANCIEROS
        const membersDetails = await Promise.all(memberships.map(async (m) => {

            // Buscamos el perfil
            const profile = await this.profileRepo.findById(m.profileId);

            // AÑADIDO: Cálculos reales en paralelo
            const [totalBudget, totalSpent] = await Promise.all([
                this.budgetRepo.sumTotalBudget(m.profileId),          // Suma de presupuestos
                this.expenseRepo.sumCurrentMonthExpenses(m.profileId) // Suma de gastos del mes
            ]);

            return {
                id: m.profileId,        // ID visual para la lista
                profileId: m.profileId, // ID real
                name: profile ? profile.name : "Usuario Desconocido",
                role: m.role,
                joinedAt: m.joinedAt,

                // ACTUALIZADO: Datos reales
                budget: totalBudget || 0,
                spent: totalSpent || 0
            };
        }));

        return {
            id: family.id,
            name: family.name,
            inviteCode: family.inviteCode,
            adminProfileId: family.adminProfileId,
            members: membersDetails
        };
    }
}