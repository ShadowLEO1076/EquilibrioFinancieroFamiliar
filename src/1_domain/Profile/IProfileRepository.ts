//importe lo que haya en la carpeta
import { Profile } from "./Profile.js";

//creación de la interfaz

export interface IProfileRepository{

    save(profile: Profile): Promise<Profile>; // será un método asincrónico de save que devolverá la entidad guardada
    findById(id: string): Promise<Profile | null>; //buscará una entidad, así que... Necesita solo la id
    update(profile: Profile): Promise<Profile>; //devolverá el usuario actualizado para leerlo
    delete(id: string): Promise<void>; //se eliminará la entidadd, por tanto necesitamos un void
    
}
