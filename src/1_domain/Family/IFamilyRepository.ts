//importe lo que haya en la carpeta
import { Family } from "./Family.js";

//creación de la interfaz

export interface IFamilyRepository{

    save(family: Family): Promise<Family>; // será un método asincrónico de save que devolverá la entidad guardada
    findById(id: string): Promise<Family | null>; //buscará una entidad, así que... Necesita solo la id
    update(family: Family): Promise<Family>; //devolverá el usuario actualizado para leerlo
    delete(id: string): Promise<void>; //se eliminará la entidadd, por tanto necesitamos un void
    findByInviteCode(inviteCode: string): Promise<Family | null>; //buscará una entidad por código de invitación    
    // ... métodos anteriores ...

}

