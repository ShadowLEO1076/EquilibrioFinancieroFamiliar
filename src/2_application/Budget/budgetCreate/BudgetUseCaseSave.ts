import { Budget } from "../../../1_domain/Budget/Budget.js";
import type {IBudgetRepository} from "../../../1_domain/Budget/IBudgetRepository.js";
//import { BudgetCreatedAt } from "../../../2_domain/Budget/BudgetCreatedAt.js";

export class BudgetUseCaseSave{
    
    constructor(private readonly budgetRepo: IBudgetRepository){}
    // metodo para guardar un presupuesto
    async execute(input: Omit<Budget, 'createdAt'>){

        let budget = new Budget(
         input.id,
         input.userId,
         input.categoryId,
         input.amount,
         input.period,
         input.spent,
         input.remaining,
         input.alerts,
         true,  //isActive
         //input.createdAt || new BudgetCreatedAt(new Date()  

        );
          return await this.budgetRepo.create(budget);
    }
      
}