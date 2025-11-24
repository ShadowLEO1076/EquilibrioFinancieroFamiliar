import { Router } from "express";
// Asegúrate de importar los nombres correctos de tus casos de uso (Create vs Save)
import { ExpenseUseCaseGetAllByProfileIdUserId } from "../../2_application/Expense/getAll/ExpenseUseCaseGetAllByProfleIdUserId.js";
import { ExpenseUseCaseCreate } from "../../2_application/Expense/create/ExpenseUseCaseCreate.js"; // Usamos Create para la lógica de presupuesto
import { MongoExpenseRepository } from "../../3_infraestructure/repositories/Expense/MongoExpenseRepository.js";
import { MongoBudgetRepository } from "../../3_infraestructure/repositories/Budget/MongoBudgetRepository.js";

import { ExpenseController } from "./ExpenseController.js";

// Repositorios
const expenseRepo = new MongoExpenseRepository();
const budgetRepo = new MongoBudgetRepository(); // me deja la barra de progreso

// Instanciar Servicios
const expenseServiceGetAll = new ExpenseUseCaseGetAllByProfileIdUserId(expenseRepo);


// Solo inyectamos lo que el Caso de Uso REALMENTE usa. 
// User, Profile y Category se validan por ID, no necesitan el repo entero aquí.
// Pero Budget SÍ se necesita para la lógica de negocio.
const expenseServiceSave = new ExpenseUseCaseCreate(expenseRepo, budgetRepo);

// Controladores
const expenseController = new ExpenseController(expenseServiceSave, expenseServiceGetAll);

// Router
const expenseRouter = Router();

expenseRouter.post('/', expenseController.Create);

//  Parametro en la URL no me acostumbre con el body me perdi ahi perdon mate 
expenseRouter.get("/:profileId", expenseController.GetAll);

export default expenseRouter;