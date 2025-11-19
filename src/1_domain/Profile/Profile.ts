export interface ProfilePreferences {
  currency: string;        // 'USD', 'EUR'
  monthlyBudget: number;   // El presupuesto base
  alertThreshold: number;  // % de alerta (ej: 80)
  reportsFrequency: 'weekly' | 'monthly';
}

export class Profile {
  constructor(
    public id: string,              // UUID o _id
    public userId: string,          // <--- Conexión con la Cuenta (User)
    public name: string,            // Ej: "Guille Personal", "Casa"
    public preferences: ProfilePreferences, // <--- Lógica Financiera
    public avatar?: string,         // Opcional: Para el futuro
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    // 1. Validaciones de Dominio
    if (!userId) {
        throw new Error('Profile must belong to a User');
    }
    
    if (!name || name.trim().length === 0) {
        throw new Error('Profile name is required');
    }

    // 2. Validación de Lógica de Negocio
    if (preferences.monthlyBudget < 0) {
        throw new Error('Budget cannot be negative'); // ¡Tu regla de oro!
    }
  }
}