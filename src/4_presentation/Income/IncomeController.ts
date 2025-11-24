import { Request, Response } from "express";
import { IncomeUseCaseGetAllByProfileIdUserId } from "../../2_application/Income/IncomeUseCaseGetAllByProfileIdUserId.js";
import { IncomeUseCaseSave } from "../../2_application/Income/IncomeUseCaseSave.js";

export class IncomeController{

    constructor(
        private readonly incomeSave: IncomeUseCaseSave,
        private readonly incomeGetAll: IncomeUseCaseGetAllByProfileIdUserId
    ){}

    Create = async (req:Request, res: Response) =>{
         try{
            //data debe ser la entidad income, se puede omitir createdAt, updatedAt
            let {data} = req.body
            let userId = (req as any).user.userId;

            let income = await this.incomeSave.execute(data, userId);

            res.status(200).json(income);
        }
        catch(err: any){
             res.status(500).json({ error: err.message });
        }
    }

      GetAll = async(req: Request, res: Response) => {

         try{

            //data debe ser la entidad income, se puede omitir createdAt, updatedAt
            let {profileId} = req.body

            let incomes = await this.incomeGetAll.execute(profileId)

            res.status(200).json(incomes);
        }
        catch(err: any){
             res.status(500).json({ error: err.message });
        }
    }
}