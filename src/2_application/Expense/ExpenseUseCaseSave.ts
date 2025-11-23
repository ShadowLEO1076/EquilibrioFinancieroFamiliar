import { ICategoryRepository } from "../../1_domain/Category/ICategoryRepository.js";
import { Expense } from "../../1_domain/Expense/Expense.js";
import { IExpenseRepository } from "../../1_domain/Expense/IExpenseRepository.js";
import { IProfileRepository } from "../../1_domain/Profile/IProfileRepository.js";
import { IUserRepository } from "../../1_domain/Users/IUserRepository.js";

export class ExpenseUseCaseSave{

    constructor(private readonly expenseRepo: IExpenseRepository,
        private readonly profileRepo:IProfileRepository,
        private readonly userRepo: IUserRepository,
        private readonly categoryRepo: ICategoryRepository
    ){}

    async execute(input: Omit<Expense, 'createdAt' | 'updatedAt'>, userId: string){
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

        let categories = await this.categoryRepo.getAllwithProfileEspecific(input.id);

        let catExist = categories.some( cat => cat.id == input.categoryId);

        if (!catExist) {
             throw new Error("Category does not belong to this profile.");
        }

        let newExpense = new Expense(
            input.id,
            input.amount,
            input.description,
            input.categoryId,
            input.date,
            input.paymentMethod,
            input.profileId,
            true
        )

        let data = this.expenseRepo.save(newExpense);

        return data;
    }
}