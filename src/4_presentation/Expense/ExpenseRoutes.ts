// src/4_presentation/Expense/ExpenseRouter.ts
import { Router } from "express";

// Controladores
import { ExpenseController } from "./ExpenseController.js";

// Casos de Uso
// Asegúrate de que la ruta del archivo 'getAll' esté escrita correctamente (Profle vs Profile) según tu carpeta real
import { ExpenseUseCaseGetAllByProfileIdUserId } from "../../2_application/Expense/getAll/ExpenseUseCaseGetAllByProfleIdUserId.js";
import { ExpenseUseCaseCreate } from "../../2_application/Expense/create/ExpenseUseCaseCreate.js";

// Repositorios de Infraestructura
import { MongoExpenseRepository } from "../../3_infraestructure/repositories/Expense/MongoExpenseRepository.js";
import { MongoBudgetRepository } from "../../3_infraestructure/repositories/Budget/MongoBudgetRepository.js";
import { MongoCategoryRepository } from "../../3_infraestructure/repositories/Category/MongoCategoryRepository.js"; // 🆕 Validacion de seguridad

// 🆕 MIDDLEWARE DE AUTENTICACIÓN
import { authMiddleware } from "../../3_infraestructure/middleware/authMiddleware.js";

// --- 1. INSTANCIAR REPOSITORIOS (La Capa de Datos) ---
const expenseRepo = new MongoExpenseRepository();
const budgetRepo = new MongoBudgetRepository(); // Necesario para lógica de negocio (restar dinero)
const categoryRepo = new MongoCategoryRepository(); // Necesario para validación Mate perdona ya le pongo de nuevo  

// --- 2. INSTANCIAR CASOS DE USO (La Lógica) ---

// Para crear gasto: Necesita los 3 repositorios para validar, guardar y actualizar presupuesto
const expenseServiceSave = new ExpenseUseCaseCreate(
    expenseRepo,
    budgetRepo,
    categoryRepo
);

// Para leer gastos: Solo necesita el repo de gastos (optimizamos quitando profileRepo)
const expenseServiceGetAll = new ExpenseUseCaseGetAllByProfileIdUserId(expenseRepo);

// --- 3. INSTANCIAR CONTROLADOR (El Recepcionista) ---
const expenseController = new ExpenseController(
    expenseServiceSave,
    expenseServiceGetAll
);

// --- 4. DEFINIR RUTAS (El Mapa) ---
const expenseRouter = Router();

// POST /expenses/ -> Crea el gasto (🔒 Protegido con authMiddleware)
expenseRouter.post('/', authMiddleware, expenseController.Create);

// GET /expenses/:profileId -> Trae los gastos de un perfil (🔒 Protegido con authMiddleware)
// Nota: Usamos :profileId para que Express capture el parámetro de la URL
expenseRouter.get("/:profileId", authMiddleware, expenseController.GetAll);

export default expenseRouter;