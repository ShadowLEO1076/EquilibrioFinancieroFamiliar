import {User} from "../../../1_domain/Users/User.js";
import { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";

export class UserUseCaseDelete{

    constructor (private userRepo: IUserRepository){}

    //la loógica será que, con el id en el url y con el body, podré actaulizar los datos
    async execute (id: string) {
        //se busca si existe el registro
        let userFound = await this.userRepo.findById(id);
        //si no, tirar error
        if(!userFound) {
            throw new Error("User not found");
        }
        //llamado al eliminar dentro del repo

        await this.userRepo.delete(id);

        return {message: "Usuario eliminado satisfactoriamente."};
    }
}