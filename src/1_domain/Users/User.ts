import validator from "validator";
//entidad Users, la interfaz Preferences puede luego traducirse como un json dentro de un json.
//Investigando un poco, no es necesario declarar los datos de la clase pues con el constructor correcto
//estamos asegurando persistencia, nada más.


// Clase User: Encargada EXCLUSIVAMENTE de la Identidad y Autenticación.
export class User {
  constructor(
    public id: string,       // UUID generado en Aplicación o _id de Mongo stringificado
    public email: string,
    public username: string, // El nombre "de la cuenta" (ej: GuilleAdmin)
    public password: string, // En el registro llega plana, luego se guarda hasheada
    public language: string, // Preferencia global de la cuenta
    public timezone: string, // Preferencia global de la cuenta
    public isActive: boolean = true,
    // public familyId?: string,  <-- ¡ELIMINADO! Esto se mueve a la entidad Profile
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    // 1. Validación de Email (¡Con throw!)
    if (!validator.isEmail(email)) {
        throw new Error('Invalid Email: El formato no es correcto.');
    }

    // 2. Validación de Username
    if (validator.isEmpty(username.trim())) {
        throw new Error('Invalid Username: No puede estar vacío.');
    }

    // 3. Validación de Password
    // OJO: Esta validación es muy estricta. Asegúrate de aplicarla solo
    // antes de hashear. Si pasas un hash de bcrypt aquí, podría fallar.
    // Una opción es validar esto EN EL CASO DE USO (UserRegisterUseCase)
    // y dejar la entidad más flexible. Pero si lo dejas aquí, está bien
    // siempre que sepas que la contraseña plana cumple esto.
     if (!validator.isStrongPassword(password, {
        minLength: 6,
        minUppercase: 1,
        minNumbers: 2,
        minSymbols: 1
      })) {
        throw new Error('Invalid password: 6 chars, 1 upper, 2 numbers, 1 symbol');
    }
  }
}