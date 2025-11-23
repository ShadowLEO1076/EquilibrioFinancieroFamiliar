import { IExpenseRepository } from "../../1_domain/Expense/IExpenseRepository.js";
import { IProfileRepository } from "../../1_domain/Profile/IProfileRepository.js";
import { IUserRepository } from "../../1_domain/Users/IUserRepository.js";

export class ExpenseUseCaseGetAllByProfileIdUserId{

    constructor(private readonly expenseRepo: IExpenseRepository,
            private readonly profileRepo:IProfileRepository
    ){}

    async execute(profileId: string){
            //asegurar que existe el perfil
            let profile = await this.profileRepo.findById(profileId);
    
            if(!profile) {throw new Error("Profile not existing.")}
    
            //traer todos los gastos
            let expenses = await this.expenseRepo.getAllByProfileIdUserId(profileId);

            return expenses;
        }
}
