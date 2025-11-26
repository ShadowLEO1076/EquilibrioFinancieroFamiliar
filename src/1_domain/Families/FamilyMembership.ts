// Archivo: src/1_domain/Families/FamilyMembership.ts

export enum FamilyRole {
  // El nombre es MAYÚSCULA (para usarlo en código), 
  // pero el valor es minúscula (para la base de datos).
  ADMIN = 'admin',
  MEMBER = 'member'
}

export class FamilyMembership {
  constructor(
    public id: string,
    public profileId: string,
    public familyId: string,
    public role: FamilyRole,
    public isActive: boolean = true,
    public joinedAt: Date = new Date()
  ) {
    if (!profileId) throw new Error('Membership requires a Profile ID');
    if (!familyId) throw new Error('Membership requires a Family ID');
    if (![FamilyRole.ADMIN, FamilyRole.MEMBER].includes(role)) {
      throw new Error('Invalid Family Role');
    }
  }
}