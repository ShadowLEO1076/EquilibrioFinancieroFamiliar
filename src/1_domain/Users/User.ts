import validator from "validator";
//entidad Users, la interfaz Preferences puede luego traducirse como un json dentro de un json.
//Investigando un poco, no es necesario declarar los datos de la clase pues con el constructor correcto
//estamos asegurando persistencia, nada más.

/* PASAR A PERFILES/PROFILE
export interface UserPreferences {
  monthlyBudget: number;
  alertThreshold: number;
  defaultCurrency: string;
  reportsFrequency: 'weekly' | 'monthly';
}
*/

//clase necesaria para que el usuario pueda ser usado.
export class User {
  constructor(
    public id: string, //id de mongo, __id
    public email: string,
    public username: string,
    public password: string,
  //public currency: string, PASAR A PROFILE
    public language: string,
    public timezone: string, 
  //public preferences: UserPreferences, PASAR A PROFILE
    public isActive: boolean = true,
    public familyId?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    if (!validator.isEmail(email)) new Error('Invalid Email');
    if (!username.trim()) throw new Error('Invalid Username');
    if (!validator.isStrongPassword(password, 
      {
        minLength: 6,
        minUppercase: 1,
        minNumbers: 2,
        minSymbols: 1
      })) throw new Error ('Invalid password: 6 minimum characters, 1 uppercase letter, 2 numbers');
  }
}