//entidad Users, la interfaz Preferences puede luego traducirse como un json dentro de un json.
//Investigando un poco, no es necesario declarar los datos de la clase pues con el constructor correcto
//estamos asegurando persistencia, nada más.

export interface UserPreferences {
  monthlyBudget: number;
  alertThreshold: number;
  defaultCurrency: string;
  reportsFrequency: 'weekly' | 'monthly';
}


//clase necesaria para que el usuario pueda ser usado.
export class User {
  constructor(
    public id: string, //id de mongo, __id
    public email: string,
    public name: string,
    public currency: string,
    public language: string,
    public timezone: string,
    public preferences: UserPreferences,
    public isActive: boolean = true,
    public familyId?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    if (!email.includes('@')) throw new Error('Email inválido');
    if (!name.trim()) throw new Error('Nombre requerido');
    if (preferences.monthlyBudget < 0) throw new Error('Presupuesto inválido');
  }
}