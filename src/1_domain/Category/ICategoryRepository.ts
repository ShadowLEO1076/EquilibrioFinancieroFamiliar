import { Category } from "./Category.js"

export interface ICategoryRepository{

    getAllwithProfileEspecific(profileId: string): Promise<Category[]>; //traer todas las categorías oficiales y las creadas por el perfil
    save(input: Category): Promise<Category>; //guardar... Solo eso
}