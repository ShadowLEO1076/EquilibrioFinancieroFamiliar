import { v4 as uuidv4 } from 'uuid';
import { Profile } from "../../../1_domain/Profile/Profile.js";    
import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";
// Asegúrate de importar ProfilePreferences si vas a manejar valores por defecto en la capa de Aplicación.


export class ProfileUseCaseCreate {
    constructor(private readonly profileRepo: IProfileRepository){}

    // Omitimos 'createdAt' ya que lo genera por defecto la entidad o la BD
    async execute(input: Omit<Profile, 'createdAt'>): Promise<Profile> {

    // NOTA: Aquí debes usar la estructura de ProfilePreferences correcta.
    // ... comentarios eliminados para limpieza ...
      
    // 1. Generamos el ID único (UUID)
    const newId = uuidv4(); // <--- ¡Esta línea faltaba! Genera el código y lo asigna a newId

    // 2. Creamos la Entidad de Dominio Profile
    let profile = new Profile(
     newId, // <--- ¡UUID ya tiene valor!
     input.userId,
     input.name,
     input.preferences, // Asumimos que tiene la estructura ProfilePreferences correcta
     input.avatar // Opcional
        // Las fechas de creación y actualización se establecen por defecto en el constructor
    );

    // 3. Guardar y retornar la entidad
     return await this.profileRepo.save(profile);
    }
}