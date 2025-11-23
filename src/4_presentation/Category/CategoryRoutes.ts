import { Router } from "express";
import { CategoryController } from "./CategoryController.js";
import { CategoryUseCaseGetAll } from "../../2_application/Category/CategoryUseCaseGetAll.js";
import { CategoryUseCaseSave } from "../../2_application/Category/CategoryUseCaseSave.js";
import { MongoCategoryRepository } from "../../3_infraestructure/repositories/Category/MongoCategoryRepository.js";

const repoCategory = new MongoCategoryRepository();

const categoryGetAll = new CategoryUseCaseGetAll(repoCategory);
const categorySave = new CategoryUseCaseSave(repoCategory);

const categoryController = new CategoryController
                            (categoryGetAll, 
                            categorySave);

const categoryRouter = Router();

categoryRouter.get("/getAll", categoryController.GetAll);
categoryRouter.post("/", categoryController.Create);

export default categoryRouter;