import { Request, Response } from "express";
import { ExpenseUseCaseGetAllByProfileIdUserId } from "../../2_application/Expense/ExpenseUseCaseGetAllByProfleIdUserId.js";
import { ExpenseUseCaseSave } from "../../2_application/Expense/ExpenseUseCaseSave.js";

export class ExpenseController{

    constructor(
        private readonly saveUseCase: ExpenseUseCaseSave,
        private readonly getAllUseCase: ExpenseUseCaseGetAllByProfileIdUserId
    ){}

    Create = async(req: Request, res:Response) =>{

        try{
            //data debe ser la entidad expense, se puede omitir createdAt, updatedAt
            let {userId, data} = req.body

            let expense = await this.saveUseCase.execute(data, userId);

            res.status(200).json(data);
        }
        catch(err: any){
             res.status(500).json({ error: err.message });
        }
    }
}