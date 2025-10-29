import type { Request, Response } from 'express';
import { UserUseCaseSave } from '../../2_application/Users/userCreate/UserUseCaseSave.js';
import type { UserUseCaseFindById } from '../../2_application/Users/userFindById/UserUseCaseFindById.js';


export class UserController {

    //irá creciendo con cada nuevo caso de uso
    constructor(
        private saveUser: UserUseCaseSave,
        private findById: UserUseCaseFindById 
    ) {}

    //método crear
    Create = async (req: Request, res: Response) => { 
        try{
            //le decimos a la solicitud que, a tavés del caso de uso, inicie el método del repositorio
            //que deba
            let user = await this.saveUser.execute(req.body);
            res.status(201).json(user)
        }
        catch(err: any){
            res.status(500).json({ error: err.message });
        }
    }

    FindById = async (req: Request, res: Response) => {

        try{
            //parámetro dinámico del url, asegurar que la ruta sea /:<elemento dinámico>
             const { id } = req.params;
            //verificación en URL
        if (!id) {
            return res.status(400).json({ error: "Se requiere un ID" });
        }
        //con la verificación previa podemos enviar el dato
        const user = await this.findById.execute(id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(user); 
        }
        catch(err: any){
            res.status(500).json({error: err.message});
        }
    }
}