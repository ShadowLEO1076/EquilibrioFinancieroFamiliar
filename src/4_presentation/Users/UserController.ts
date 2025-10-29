import type { Request, Response } from 'express';
import { UserUseCaseSave } from '../../2_application/Users/userCreate/UserUseCaseSave.js';
import type { UserUseCaseFindById } from '../../2_application/Users/userFindById/UserUseCaseFindById.js';
import { UserUseCaseUpdate } from '../../2_application/Users/userUpdate/UserUseCaseUpdate.js';
import { UserUseCaseDelete } from '../../2_application/Users/userDelete/userUseCaseDelete.js';


export class UserController {

    //irá creciendo con cada nuevo caso de uso
    constructor(
        private saveUser: UserUseCaseSave,
        private findById: UserUseCaseFindById,
        private updateUser: UserUseCaseUpdate,
        private deleteUser: UserUseCaseDelete
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

      Update = async (req: Request, res: Response) =>{

        try{
            let {id} = req.params;
            let userUpdate = req.body;

            if (!id) {
                 return res.status(400).json({ error: "Se requiere un ID" });
             }

             let user = await this.updateUser.execute(id, userUpdate);

             return res.status(203).json({data: user})
        }
        catch(err: any){
            res.status(500).json({ error: err.message});
        }
    }

    Delete = async (req: Request, res: Response) => {
      try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: "Se requiere un ID" });

            const result = await this.deleteUser.execute(id);
            res.status(200).json(result);

         }
         catch(err: any) {
            res.status(500).json({ error: err.message });
        }
    };
}
