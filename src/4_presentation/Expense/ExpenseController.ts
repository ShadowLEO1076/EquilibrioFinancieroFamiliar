import { Request, Response } from "express";
import { ExpenseUseCaseGetAllByProfileIdUserId } from "../../2_application/Expense/getAll/ExpenseUseCaseGetAllByProfleIdUserId.js"; // Ojo con el nombre del archivo
import { ExpenseUseCaseCreate } from "../../2_application/Expense/create/ExpenseUseCaseCreate.js"; // Asumo que cambiaste el nombre a Create

export class ExpenseController {

    constructor(
        private readonly saveUseCase: ExpenseUseCaseCreate,
        private readonly getAllUseCase: ExpenseUseCaseGetAllByProfileIdUserId
    ) { }

    Create = async (req: Request, res: Response) => {
        try {
            // SEGURIDAD: la ia me sugirio que el userId viene del Token (Middleware), no del body
            // Asumo que tu authMiddleware pone el payload en req.user
            const userFromToken = (req as any).user;
            const userId = userFromToken.id || userFromToken._id || userFromToken.userId;

            if (!userId) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            // El body trae los datos del gasto limpios, sin anidar en "data"
            const { amount, description, categoryId, date, paymentMethod, profileId } = req.body;

            // Ejecutamos mezclando los datos del body + el ID seguro del token
            const expense = await this.saveUseCase.execute({
                amount,
                description,
                categoryId,
                date,
                paymentMethod,
                profileId,
                userId // 👈 Inyectado seguro
            });

            return res.status(201).json(expense);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    GetAll = async (req: Request, res: Response) => {
        try {
            // le quite tambien sjsj el body  para que funcione el frontend
            // Ruta esperada: GET /expenses/profile/:profileId
            const { profileId } = req.params;

            if (!profileId) return res.status(400).json({ error: "Falta profileId" });

            const expenses = await this.getAllUseCase.execute(profileId);

            return res.status(200).json(expenses);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }
}