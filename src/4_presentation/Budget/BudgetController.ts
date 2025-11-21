// src/4_presentation/Budget/BudgetController.ts

import type { Request, Response } from 'express';

// Deben apuntar a donde REALMENTE creaste los archivos en el paso anterior.
import { BudgetUseCaseCreate } from '../../2_application/Budget/budgetCreate/BudgetUseCaseCreate.js';
import { BudgetUseCaseFindAllByProfile, BudgetUseCaseFindById } from '../../2_application/Budget/budgetFindById/BudgetUseCaseFind.js';
import { BudgetUseCaseUpdate } from '../../2_application/Budget/budgetUpdate/BudgetUseCaseUpdate.js';
import { BudgetUseCaseDelete } from '../../2_application/Budget/budgetdelete/BudgetUseCaseDelete.js';

export class BudgetController {
    
    // El constructor ahora acepta los 5 casos de uso que le pasas desde las rutas
    constructor(
        private readonly creator: BudgetUseCaseCreate,
        private readonly finderAll: BudgetUseCaseFindAllByProfile,
        private readonly finderById: BudgetUseCaseFindById,
        private readonly updater: BudgetUseCaseUpdate,
        private readonly deleter: BudgetUseCaseDelete
    ) {}

    // --- MÉTODOS ---

    create = async (req: Request, res: Response) => {
        try {
            const { profileId, categoryId, amount, period } = req.body;
            if (!profileId || !amount || !period) {
                res.status(400).json({ error: "Faltan datos obligatorios" });
                return;
            }
            const budget = await this.creator.execute(req.body);
            res.status(201).json(budget);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    getAllByProfile = async (req: Request, res: Response) => {
        try {
            const { profileId } = req.params;
            const budgets = await this.finderAll.execute(profileId);
            res.status(200).json(budgets);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const budget = await this.finderById.execute(id);
            res.status(200).json(budget);
        } catch (err: any) {
            res.status(404).json({ error: "Presupuesto no encontrado" });
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const budget = await this.updater.execute({ id, ...updates });
            res.status(200).json(budget);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.deleter.execute(id);
            res.status(200).json({ message: "Presupuesto eliminado" });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}