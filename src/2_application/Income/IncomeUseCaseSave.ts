import { Console } from "console";
import { ICategoryRepository } from "../../1_domain/Category/ICategoryRepository.js";
import { IIncomeRepository } from "../../1_domain/Income/IIncomeRepository.js";
import { Income } from "../../1_domain/Income/Income.js";
import { IProfileRepository } from "../../1_domain/Profile/IProfileRepository.js";
import { IUserRepository } from "../../1_domain/Users/IUserRepository.js";

export class IncomeUseCaseSave{

    constructor(private readonly incomeRepo: IIncomeRepository,
        private readonly profileRepo:IProfileRepository,
        private readonly userRepo: IUserRepository,
        private readonly categoryRepo: ICategoryRepository
    ){}

    async execute(input: Omit<Income, 'createdAt' | 'updatedAt'>, userId: string){
        //asegurar que existe el perfil
        let profile = await this.profileRepo.findById(input.profileId);

        if(!profile) {throw new Error("Profile not existing.")}

        //asegurar que el usuario existe
        //la validación de usuario se fue al repo, pues sino me tiraba un error de mongoose.
        let user = await this.userRepo.findById(userId);

        //asegurar que el perfil se relaciona al usuario
        if (profile.userId != user?.id){
            throw new Error("Profile not related to user logged in.")
        }

        let categories = await this.categoryRepo.getAllwithProfileEspecific(profile.id);

        let catExist = categories.some( cat => cat.id === input.categoryId);
            
        if (!catExist) {
             throw new Error("Category does not belong to this profile.");
        }

        let newExpense = new Income(
            input.id,
            input.amount,
            input.description,
            input.categoryId,
            input.date,
            input.incomeSource,
            input.profileId,
            true
        )

        let data = this.incomeRepo.save(newExpense);

        return data;
    }
}