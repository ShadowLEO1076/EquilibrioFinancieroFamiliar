export class Family {
  constructor(
    public id: string,              // UUID o _id
    public name: string,            // Ej: 
    public inviteCode: string,      // Ej: "FAM-8899" (Único)
    public adminProfileId: string,  // <--- El Perfil Creador (Dueño Original)
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    // 1. Validaciones
    if (!name || name.trim().length < 3) {
        throw new Error('Family name must be at least 3 characters long');
    }
    
    if (!inviteCode || inviteCode.length < 4) {
        throw new Error('Invite code is too short');
    }
    
    if (!adminProfileId) {
        throw new Error('A Family must have an Admin Profile');
    }
  }
}