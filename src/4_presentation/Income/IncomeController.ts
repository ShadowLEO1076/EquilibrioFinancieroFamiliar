import { Request, Response } from "express";
import { IncomeUseCaseGetAllByProfileIdUserId } from "../../2_application/Income/IncomeUseCaseGetAllByProfileIdUserId.js"; // Verifica la ruta
import { IncomeUseCaseSave } from "../../2_application/Income/IncomeUseCaseSave.js";

export class IncomeController {

    constructor(
        private readonly incomeSave: IncomeUseCaseSave,
        private readonly incomeGetAll: IncomeUseCaseGetAllByProfileIdUserId
    ) { }

    Create = async (req: Request, res: Response) => {
        try {
            // 1. Extraemos el usuario del Token (inyectado por authMiddleware)
            // Nota: Verifica si tu token guarda el id como 'id', '_id' o 'userId'
            const userFromToken = (req as any).user;
            const userId = userFromToken.id || userFromToken._id || userFromToken.userId;

            if (!userId) return res.status(401).json({ error: "Usuario no identificado" });

            // 2. Extraemos los datos del body (directamente, sin objeto 'data' anidado)
            // El frontend enviará: { amount: 100, description: "...", ... }
            const { amount, description, categoryId, date, incomeSource, profileId } = req.body;

            // 3. Ejecutamos el Caso de Uso
            const income = await this.incomeSave.execute({
                amount, description, categoryId, date, incomeSource, profileId
            }, userId);

            // 4. Retornamos 201 (Created)
            res.status(201).json(income);
        }
        catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    GetAll = async (req: Request, res: Response) => {
        try {
            // ⚠️ CORRECCIÓN: GET lee de la URL (params), nunca del body
            const { profileId } = req.params;

            if (!profileId) {
                return res.status(400).json({ error: "Falta el profileId en la URL" });
            }

            const incomes = await this.incomeGetAll.execute(profileId);

            res.status(200).json(incomes);
        }
        catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}