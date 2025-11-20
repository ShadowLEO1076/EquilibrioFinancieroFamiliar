// Archivo: src/1_domain/Families/FamilyMembership.ts

export type FamilyRole = 'ADMIN' | 'MEMBER'; 

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
    if (!['ADMIN', 'MEMBER'].includes(role)) {
        throw new Error('Invalid Family Role');
    }
  }
}