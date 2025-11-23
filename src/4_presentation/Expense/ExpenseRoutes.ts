import { Router } from "express";
import { ExpenseUseCaseGetAllByProfileIdUserId } from "../../2_application/Expense/ExpenseUseCaseGetAllByProfleIdUserId.js";
import { ExpenseUseCaseSave } from "../../2_application/Expense/ExpenseUseCaseSave.js";
import { MongoExpenseRepository } from "../../3_infraestructure/repositories/Expense/MongoExpenseRepository.js";
import { MongoProfilesRepository } from "../../3_infraestructure/repositories/Profiles/MongoProfilesRepository.js";
import { MongoUserRepository } from "../../3_infraestructure/repositories/Users/MongoUserRepository.js";
import { ExpenseController } from "./ExpenseController.js";
import { MongoCategoryRepository } from "../../3_infraestructure/repositories/Category/MongoCategoryRepository.js";

//Repositorios
const expenseRepo = new MongoExpenseRepository();
const userRepoInExpense = new MongoUserRepository();
const profileRepoInExpense = new MongoProfilesRepository();
const categoryRepoInExpense = new MongoCategoryRepository();
//instanciar servicios

const expenseServiceGetAll = new ExpenseUseCaseGetAllByProfileIdUserId(expenseRepo, profileRepoInExpense, userRepoInExpense);
const expenseServiceSave = new ExpenseUseCaseSave(expenseRepo, profileRepoInExpense, userRepoInExpense, categoryRepoInExpense)

//controladores

const expenseController = new ExpenseController(expenseServiceSave, expenseServiceGetAll);

// crear router

const expenseRouter = Router();

expenseRouter.post('/', expenseController.Create);

export default expenseRouter;