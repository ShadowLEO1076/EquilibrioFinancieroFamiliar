import type { Request, Response } from 'express';
import { BudgetUseCaseSave } from '../../2_application/Budget/budgetCreate/BudgetUseCaseSave.js';
import type { BudgetUseCaseFind } from '../../2_application/Budget/budgetGetAll/BudgetUseCaseFind.js';
import { ALL } from 'dns';

export class BudgetController {
    constructor(
        private saveBudget: BudgetUseCaseSave,
        private getAllBudgets: BudgetUseCaseFind
    ) {}

    create = async (req: Request, res: Response) => { 
        try {
            const budget = await this.saveBudget.execute(req.body);
            res.status(201).json(budget);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await this.getAllBudgets.execute();
            res.status(200).json(budgets);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
