import { User } from "../../../1_domain/Users/User.js";
import type { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";

export class UserUseCaseUpdate{

     constructor (private userRepo: IUserRepository){}

    //la loógica será que, con el id en el url y con el body, podré actaulizar los datos
    async execute (id: string, updatedUser: Partial<User>) {
        //se busca si exsite el registro
        let userFound = await this.userRepo.findById(id);
        //si no, tirar error
        if(!userFound) {
            throw new Error("User not found");
        }
        //aplicar cambios usando el operador de propagación

        let updated = {...userFound, ...updatedUser, updatedAt: new Date()};

        //reglas de dominio adicional si se necesitacen

        return await this.userRepo.update(updated);
    }
}