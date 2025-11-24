import { Request, Response } from "express";
import { CategoryUseCaseGetAll } from "../../2_application/Category/getAll/CategoryUseCaseGetAll.js";
import { CategoryUseCaseSave } from "../../2_application/Category/save/CategoryUseCaseSave.js";

export class CategoryController {

    constructor(
        private readonly getAll: CategoryUseCaseGetAll,
        private readonly save: CategoryUseCaseSave
    ) { }

    Create = async (req: Request, res: Response) => {
        try {
            // 1. Extraemos datos (incluyendo el ICONO que faltaba)
            const { name, description, type, icon, profileId } = req.body;

            // 2. Validamos
            if (!name || !icon || !type) {
                return res.status(400).json({ error: "Faltan datos: name, icon o type" });
            }

            // 3. Ejecutamos
            const created = await this.save.execute({
                name, description, icon, type, profileId
            });

            return res.status(201).json(created);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    GetAll = async (req: Request, res: Response) => {
        try {
            // ⚠️ CORRECCIÓN: GET usa params, no body.
            // Ruta esperada: GET /categories/:profileId
            const { profileId } = req.params;

            if (!profileId) {
                return res.status(400).json({ error: "Falta el profileId en la URL" });
            }

            const data = await this.getAll.execute(profileId);

            return res.status(200).json(data); // 200 OK es mejor para lecturas
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }
}