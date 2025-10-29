// igual que UserRoutes, pero para budget
import { Router} from "express";
import { BudgetUseCaseSave } from "../../2_application/Budget/budgetCreate/BudgetUseCaseSave.js";
import { BudgetUseCaseFind } from "../../2_application/Budget/budgetGetAll/BudgetUseCaseFind.js";
import { BudgetController } from "./BudgetController.js";
import {MongoBudgetRepository} from "./MongoBudgetRepository.js"


//se instancia el repo
const budgetRepo = new MongoBudgetRepository();
//se instancian los servicios
const budgetSave = new BudgetUseCaseSave(budgetRepo);

const budgetGetAll = new BudgetUseCaseFind(budgetRepo); 
//Se instancia el controlador
const controller = new BudgetController(budgetSave, budgetGetAll);
//se crea el router
const router = Router();

//Se define el tipo de solicitud http, su url, y qué controlador usa
router.post('/save', controller.create);
router.get('/all', controller.getAll);
//Se exporta
export default router;


