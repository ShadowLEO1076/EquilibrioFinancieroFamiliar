import { Router } from 'express';
import { UserUseCaseSave } from '../../2_application/Users/userCreate/UserUseCaseSave.js';
import { UserController } from './UserController.js';
import { MongoUserRepository } from '../../3_infraestructure/repositories/Users/MongoUserRepository.js';
import { UserUseCaseFindById } from '../../2_application/Users/userFindById/UserUseCaseFindById.js';

//se instancia el repo
const userRepo = new MongoUserRepository();
//se instancian los servicios
const userSave = new UserUseCaseSave(userRepo);
const userFindId = new UserUseCaseFindById(userRepo);
//Se instancia el controlador
const controller = new UserController(userSave, userFindId);
//se crea el router
const router = Router();
//Se define el tipo de solicitud http, su url, y qué controlador usa
router.post('/save', controller.Create);
router.get('/:id', controller.FindById);
//Se exporta
export default router;