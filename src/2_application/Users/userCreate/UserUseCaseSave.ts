import { User } from "../../../1_domain/Users/User.js";    
import type { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";



//aquí vamos a poner el primer caso de uso
//añadir verifiación considerando que todo no puede compartir mail
export class UserUseCaseSave{
    
    constructor(private readonly userRepo: IUserRepository){}

    //Omit permite crear o ingrear la entidad omitiendo los datos que pasemos tras la coma, cool
    async execute(input: Omit<User, 'updatedAt'>){

        let user = new User(
         input.id,
         input.email,
         input.username,  // MATE DEVERIAMOS HASHEAR LA CONTRASEÑA ANTES DE GUARDARLA
         input.password,  // ANTES DE HACER NEW USER AQUÍ
        
         input.language,
         input.timezone,
        // input.preferences,
         true,  //isActive
        );

        return await this.userRepo.save(user);
    }
}