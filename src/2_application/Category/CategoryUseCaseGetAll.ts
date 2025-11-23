import { ICategoryRepository } from "../../1_domain/Category/ICategoryRepository.js";

export class CategoryUseCaseGetAll{

    constructor(private readonly categoryRepo: ICategoryRepository){}

    async execute(profileId: string){
        // traemos todos los datos
        let data = this.categoryRepo.getAllwithProfileEspecific(profileId);
        //damos los datos
        return data;
    }
}
