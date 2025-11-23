import { Request, Response} from  "express";
import { CategoryUseCaseGetAll } from "../../2_application/Category/CategoryUseCaseGetAll.js";
import { CategoryUseCaseSave } from "../../2_application/Category/CategoryUseCaseSave.js";

export class CategoryController{

    constructor(
        private readonly getAll: CategoryUseCaseGetAll,
        private readonly save: CategoryUseCaseSave
    ){}

    Create = async (req: Request, res: Response) =>{

        try{
            let {name, description, type} = req.body;
            
            if(!name || !description || !type) 
                {res.status(400).json({error: "Campos incompletos: name, description, type" });
            }

            let created = await this.save.execute(req.body)

            return res.status(201).json(created);
        }
        catch(err: any){
            res.status(500).json({ error: err.message });
        }
    }

    GetAll = async(req: Request, res: Response) =>{

        try{
            let {profileId} = req.body;
            
            if(!profileId) 
                {res.status(400).json({error: "Campos incompletos: profileId" });
            }

            let data = await this.getAll.execute(profileId);

            return res.status(201).json(data);
        }
        catch(err: any){
            res.status(500).json({ error: err.message });
        }
    }
}