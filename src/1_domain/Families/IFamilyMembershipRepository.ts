//importe lo que haya en la carpeta
import { FamilyMembership } from "./FamilyMembership.js";

//creación de la interfaz

export interface IFamilyMembershipRepository{

    save(familymembership: FamilyMembership): Promise<FamilyMembership>; // será un método asincrónico de save que devolverá la entidad guardada
    findById(id: string): Promise<FamilyMembership | null>; //buscará una entidad, así que... Necesita solo la id
    update(familymembership: FamilyMembership): Promise<FamilyMembership>; //devolverá el usuario actualizado para leerlo
    delete(id: string): Promise<void>; //se eliminará la entidadd, por tanto necesitamos un void
    findByProfileAndFamilyId(profileId: string, familyId: string): Promise<FamilyMembership | null>; //buscará una entidad por profileId y familyId 
    
}
