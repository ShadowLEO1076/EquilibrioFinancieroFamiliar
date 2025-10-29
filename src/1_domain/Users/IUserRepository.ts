//importe lo que haya en la carpeta
import { User } from "./User.js";

//creación de la interfaz

export interface IUserRepository{

    save(user: User): Promise<User>; // será un método asincrónico de save que devolverá la entidad guardada
    findById(id: string): Promise<User | null>; //buscará una entidad, así que... Necesita solo la id
    update(user: User): Promise<User>; //devolverá el usuario actualizado para leerlo
    delete(id: string): Promise<void>; //se eliminará la entidadd, por tanto necesitamos un void
}
