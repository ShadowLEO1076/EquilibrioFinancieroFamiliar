import { Category } from "./Category.js"

export interface ICategoryRepository{

    getAllwithProfileEspecific(profileId: string): Promise<Category[]>; //traer todas las categorías oficiales
    save(input: Category): Promise<Category>;
}