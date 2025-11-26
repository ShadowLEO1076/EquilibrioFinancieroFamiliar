import { Family } from "./Family.js";

export interface IFamilyRepository {

    // 1. Guardar una familia nueva
    save(family: Family): Promise<Family>;

    // 2. Buscar por ID (Solo devuelve datos de la familia: nombre, código...)
    findById(id: string): Promise<Family | null>;

    // 3. Buscar por Código (Para validar invitaciones)
    findByInviteCode(inviteCode: string): Promise<Family | null>;

    // 4. Actualizar (Por si cambian el nombre de la familia)
    update(family: Family): Promise<Family>;

    // 5. Eliminar la familia entera
    delete(id: string): Promise<void>;
}