import { v4 as uuidv4 } from 'uuid'; // uuid
import { Category } from "../../../1_domain/Category/Category.js";
import { ICategoryRepository } from "../../../1_domain/Category/ICategoryRepository.js";

// DTO de entrada (Lo que recibes del Controller)
export interface CreateCategoryInput {
    name: string;
    description: string;
    icon: string;
    profileId?: string; // Opcional (si es null es global, pero aquí seguro viene lleno)
    type?: 'income' | 'expense' | 'both';
}

export class CategoryUseCaseSave {

    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(input: CreateCategoryInput): Promise<Category> {

        // 1. Generamos el ID aquí
        const newId = uuidv4();

        // 2. Creamos la Entidad (Validaciones ocurren aquí dentro)
        const category = new Category(
            newId,
            input.name,
            input.description,
            input.icon,
            input.type || 'expense', // Default a expense
            true, // isActive
            input.profileId
        );

        // 3. Guardar
        return await this.categoryRepo.save(category);
    }
}