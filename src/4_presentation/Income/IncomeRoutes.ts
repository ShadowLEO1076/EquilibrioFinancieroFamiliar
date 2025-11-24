import { Router } from "express";
import { MongoIncomeRepository } from "../../3_infraestructure/repositories/Income/MongoIncomeRepository.js";
import { MongoCategoryRepository } from "../../3_infraestructure/repositories/Category/MongoCategoryRepository.js";
import { MongoProfilesRepository } from "../../3_infraestructure/repositories/Profiles/MongoProfilesRepository.js";
import { IncomeUseCaseSave } from "../../2_application/Income/IncomeUseCaseSave.js";
import { IncomeUseCaseGetAllByProfileIdUserId } from "../../2_application/Income/IncomeUseCaseGetAllByProfileIdUserId.js"; // Verifica ruta
import { IncomeController } from "./IncomeController.js";

// --- 1. REPOSITORIOS ---
const incomeRepo = new MongoIncomeRepository();
const categoryRepo = new MongoCategoryRepository(); // Necesario para validar seguridad
const profileRepo = new MongoProfilesRepository();

// (Nota: userRepo y profileRepo YA NO SE USAN aquí, los quitamos para optimizar)

// --- 2. SERVICIOS (Casos de Uso) ---

// Inyección Limpia: Solo lo necesario
const incomeServiceSave = new IncomeUseCaseSave(
    incomeRepo,
    categoryRepo
);

// Solo el repo de ingresos
const incomeServiceGetAll = new IncomeUseCaseGetAllByProfileIdUserId(incomeRepo, profileRepo);

// --- 3. CONTROLADOR ---
const incomeController = new IncomeController(incomeServiceSave, incomeServiceGetAll);

// --- 4. RUTAS ---
const incomeRouter = Router();

// POST /incomes/
incomeRouter.post('/', incomeController.Create);

// GET /incomes/:profileId (Parametro en URL)
incomeRouter.get("/:profileId", incomeController.GetAll);

export default incomeRouter;