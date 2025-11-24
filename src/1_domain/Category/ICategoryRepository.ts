import { Category } from "./Category.js";

export interface ICategoryRepository {
    // Guardar (Crear o Editar)
    save(category: Category): Promise<Category>;

    // Traer categorías del sistema (Globales) + las de mi perfil
    findAllAvailableForProfile(profileId: string): Promise<Category[]>;

    // Buscar por ID (necesario para validar antes de usarla)
    findById(id: string): Promise<Category | null>;

    // Borrar
    delete(id: string): Promise<void>;
}