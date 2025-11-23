import { IExpenseRepository } from "../../1_domain/Expense/IExpenseRepository.js";
import { IProfileRepository } from "../../1_domain/Profile/IProfileRepository.js";
import { IUserRepository } from "../../1_domain/Users/IUserRepository.js";

export class ExpenseUseCaseGetAllByProfileIdUserId{

    constructor(private readonly expenseRepo: IExpenseRepository,
            private readonly profileRepo:IProfileRepository,
            private readonly userRepo: IUserRepository
    ){}

}