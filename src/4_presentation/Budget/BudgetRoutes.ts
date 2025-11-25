import { Router } from 'express';
import { MongoBudgetRepository } from '../../3_infraestructure/repositories/Budget/MongoBudgetRepository.js';

// Importamos el NUEVO Caso de Uso de Lote
import { BudgetUseCaseSaveBatch } from '../../2_application/Budget/budgetSaveBatch/BudgetUseCaseSaveBatch.js';
// Importamos el de búsqueda (asegúrate de que la ruta sea correcta en tu proyecto)
import { BudgetUseCaseFindAllByProfile } from '../../2_application/Budget/budgetFindById/BudgetUseCaseFind.js';

import { BudgetController } from '../Budget/BudgetController.js';

// 🆕 MIDDLEWARE DE AUTENTICACIÓN
import { authMiddleware } from '../../3_infraestructure/middleware/authMiddleware.js';

// 1. Instancias
const repo = new MongoBudgetRepository();

// Usamos el de Lote (Batch) para crear/actualizar
const saveBatchUC = new BudgetUseCaseSaveBatch(repo);
const findAllUC = new BudgetUseCaseFindAllByProfile(repo);

// 2. Controlador
const controller = new BudgetController(saveBatchUC, findAllUC);

const router = Router();

// POST /budgets/ -> Usa la lógica de Lote (Batch) (🔒 Protegido con authMiddleware)
router.post('/', authMiddleware, controller.createBatch);

// GET /budgets/:profileId -> Trae los presupuestos (ojo, quité /profile para hacerlo más REST, ajusta tu frontend si es necesario)
// Si tu frontend llama a /budgets/profile/:id, deja la ruta como la tenías abajo: (🔒 Protegido con authMiddleware)
router.get('/:profileId', authMiddleware, controller.getAllByProfile);

export default router;