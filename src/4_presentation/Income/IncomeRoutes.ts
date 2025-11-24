import { Router } from "express";
import { JwtAuthTokenService } from "../../2_application/JwtAuthTokenService/JwtAuthTokenService.js";
import { authMiddleware } from '../../3_infraestructure/middleware/authMiddleware.js';
import { MongoIncomeRepository } from "../../3_infraestructure/repositories/Income/MongoIncomeRepository.js";
import { MongoUserRepository } from "../../3_infraestructure/repositories/Users/MongoUserRepository.js";
import { MongoProfilesRepository } from "../../3_infraestructure/repositories/Profiles/MongoProfilesRepository.js";
import { MongoCategoryRepository } from "../../3_infraestructure/repositories/Category/MongoCategoryRepository.js";
import { IncomeUseCaseSave } from "../../2_application/Income/IncomeUseCaseSave.js";
import { IncomeUseCaseGetAllByProfileIdUserId } from "../../2_application/Income/IncomeUseCaseGetAllByProfileIdUserId.js";
import { IncomeController } from "./IncomeController.js";

//Repositorios
const authToken = new JwtAuthTokenService(process.env.SECRET_JWT!);

const incomeRepo = new MongoIncomeRepository();
const userRepoInIncome = new MongoUserRepository();
const profileRepoInIncome = new MongoProfilesRepository();
const categoryRepoInIncome = new MongoCategoryRepository();
//instanciar servicios

const incomeServiceSave = new IncomeUseCaseSave (incomeRepo, profileRepoInIncome, userRepoInIncome, categoryRepoInIncome);
const incomeServiceGetAll = new IncomeUseCaseGetAllByProfileIdUserId (incomeRepo, profileRepoInIncome);

//controladores

const incomeController = new IncomeController(incomeServiceSave, incomeServiceGetAll);
// crear router

const incomeRouter = Router();

incomeRouter.post('/', authMiddleware, incomeController.Create);
incomeRouter.get("/getAll", incomeController.GetAll);

export default incomeRouter;