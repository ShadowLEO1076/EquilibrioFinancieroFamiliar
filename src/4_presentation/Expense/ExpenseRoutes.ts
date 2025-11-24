import { Router } from "express";
import { ExpenseUseCaseGetAllByProfileIdUserId } from "../../2_application/Expense/ExpenseUseCaseGetAllByProfleIdUserId.js";
import { ExpenseUseCaseSave } from "../../2_application/Expense/ExpenseUseCaseSave.js";
import { MongoExpenseRepository } from "../../3_infraestructure/repositories/Expense/MongoExpenseRepository.js";
import { MongoProfilesRepository } from "../../3_infraestructure/repositories/Profiles/MongoProfilesRepository.js";
import { MongoUserRepository } from "../../3_infraestructure/repositories/Users/MongoUserRepository.js";
import { ExpenseController } from "./ExpenseController.js";
import { MongoCategoryRepository } from "../../3_infraestructure/repositories/Category/MongoCategoryRepository.js";
import { JwtAuthTokenService } from "../../2_application/JwtAuthTokenService/JwtAuthTokenService.js";
import { authMiddleware } from '../../3_infraestructure/middleware/authMiddleware.js';

//Repositorios
const authToken = new JwtAuthTokenService(process.env.SECRET_JWT!);

const expenseRepo = new MongoExpenseRepository();
const userRepoInExpense = new MongoUserRepository();
const profileRepoInExpense = new MongoProfilesRepository();
const categoryRepoInExpense = new MongoCategoryRepository();
//instanciar servicios

const expenseServiceGetAll = new ExpenseUseCaseGetAllByProfileIdUserId(expenseRepo, profileRepoInExpense);
const expenseServiceSave = new ExpenseUseCaseSave(expenseRepo, profileRepoInExpense, userRepoInExpense, categoryRepoInExpense)

//controladores

const expenseController = new ExpenseController(expenseServiceSave, expenseServiceGetAll);
// crear router

const expenseRouter = Router();

expenseRouter.post('/', authMiddleware, expenseController.Create);
expenseRouter.get("/getAll", expenseController.GetAll);

export default expenseRouter;