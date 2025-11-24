import { Request, Response } from "express";
import { BudgetUseCaseSaveBatch } from "../../2_application/Budget/budgetSaveBatch/BudgetUseCaseSaveBatch.js";
import { BudgetUseCaseFindAllByProfile } from "../../2_application/Budget/budgetFindById/BudgetUseCaseFind.js"; // Asumo que este ya lo tienes

export class BudgetController {

    constructor(
        private readonly saveBatchUseCase: BudgetUseCaseSaveBatch,
        private readonly findAllUseCase: BudgetUseCaseFindAllByProfile
    ) { }

    // POST /budgets/ (Recibe el array del Frontend)
    createBatch = async (req: Request, res: Response) => {
        try {
            // Leemos el body que envía el Frontend
            const { profileId, budgets } = req.body;

            // Validaciones básicas
            if (!profileId) {
                return res.status(400).json({ error: "Faltan datos obligatorios: profileId" });
            }
            if (!budgets || !Array.isArray(budgets)) {
                return res.status(400).json({ error: "Faltan datos obligatorios: budgets (debe ser un array)" });
            }

            // Ejecutamos la lógica de lote
            const result = await this.saveBatchUseCase.execute(profileId, budgets);

            return res.status(200).json({ message: "Presupuestos guardados", count: result.length, data: result });

        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    // GET /budgets/:profileId
    getAllByProfile = async (req: Request, res: Response) => {
        try {
            const { profileId } = req.params; // ⚠️ OJO: Params, no Body

            if (!profileId) return res.status(400).json({ error: "Falta profileId" });

            const data = await this.findAllUseCase.execute(profileId);

            return res.status(200).json(data);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    // Aquí puedes agregar getById, update, delete si los necesitas después...
}