import { Category } from "../../1_domain/Category/Category.js";
import { ICategoryRepository } from "../../1_domain/Category/ICategoryRepository.js";

export class CategoryUseCaseSave{

    constructor(private readonly categoryRepo: ICategoryRepository){}

    async execute(input: Omit<Category, 'createdAt'| 'UpdatedAt'>){

        let category = new Category(
            input.id,
            input.name,
            input.description,
            input.isActive,
            input.profileId,
            input.type
        )

        // guardar datos
        let data = await this.categoryRepo.save(category);
        //damos los datos
        return data;
    }
}
