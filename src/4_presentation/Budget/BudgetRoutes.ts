// src/4_presentation/routes/BudgetRoutes.ts
import { Router } from 'express';
import { MongoBudgetRepository } from '../../3_infraestructure/repositories/Budget/MongoBudgetRepository.js';
import { BudgetUseCaseCreate } from '../../2_application/Budget/budgetCreate/BudgetUseCaseCreate.js';   
import { BudgetUseCaseFindAllByProfile, BudgetUseCaseFindById } from '../../2_application/Budget/budgetFindById/BudgetUseCaseFind.js'; 
import { BudgetUseCaseUpdate } from '../../2_application/Budget/budgetUpdate/BudgetUseCaseUpdate.js';
import { BudgetUseCaseDelete } from  '../../2_application/Budget/budgetdelete/BudgetUseCaseDelete.js';
import { BudgetController } from '../Budget/BudgetController.js';   

// Inyección
const repo = new MongoBudgetRepository();
const createUC = new BudgetUseCaseCreate(repo);
const findAllUC = new BudgetUseCaseFindAllByProfile(repo);
const findByIdUC = new BudgetUseCaseFindById(repo);
const updateUC = new BudgetUseCaseUpdate(repo);
const deleteUC = new BudgetUseCaseDelete(repo);

const controller = new BudgetController(createUC, findAllUC, findByIdUC, updateUC, deleteUC);

const router = Router();

// POST /budgets/
router.post('/', controller.create);

// GET /budgets/profile/:profileId (Dashboard)
router.get('/profile/:profileId', controller.getAllByProfile);

// GET /budgets/:id (Detalle)
router.get('/:id', controller.getById);

// PUT /budgets/:id (Actualizar)
router.put('/:id', controller.update);

// DELETE /budgets/:id
router.delete('/:id', controller.delete);

export default router;