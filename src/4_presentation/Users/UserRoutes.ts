import { Router } from 'express';
import { UserUseCaseSave } from '../../2_application/Users/userCreate/UserUseCaseSave.js';
import { UserController } from './UserController.js';
import { MongoUserRepository } from '../../3_infraestructure/repositories/Users/MongoUserRepository.js';
import { UserUseCaseFindById } from '../../2_application/Users/userFindById/UserUseCaseFindById.js';
import { UserUseCaseUpdate } from '../../2_application/Users/userUpdate/UserUseCaseUpdate.js';
import { UserUseCaseDelete } from '../../2_application/Users/userDelete/userUseCaseDelete.js';
import { UserUseCaseFindByEmail } from '../../2_application/Users/userUseCaseFindByEmail/UserUseCaseFindByEmail.js';
import { UserUseCaseLogin } from '../../2_application/Users/userLogin/UserUseCaseLogin.js';
import { JwtAuthTokenService } from '../../2_application/JwtAuthTokenService/JwtAuthTokenService.js';
import { authMiddleware } from '../../3_infraestructure/middleware/authMiddleware.js';
import dotenv from 'dotenv';

//se instancia el repo
const userRepo = new MongoUserRepository();
const authToken = new JwtAuthTokenService(process.env.SECRET_JWT!);

//se instancian los servicios
const userSave = new UserUseCaseSave(userRepo);
const userFindId = new UserUseCaseFindById(userRepo);
const userUpdateCont = new UserUseCaseUpdate(userRepo);
const userDeleteCont = new UserUseCaseDelete(userRepo);
const userFindEmail = new UserUseCaseFindByEmail(userRepo);
const userLogin = new UserUseCaseLogin(userRepo, authToken);

//Se instancia el controlador, crece con cada nuevo servicio.
const controller = new UserController
                (userSave,
                 userFindId, 
                 userUpdateCont, 
                 userDeleteCont,
                 userFindEmail,
                userLogin);
//se crea el router
const router = Router();
//Se define el tipo de solicitud http, su url, y qué controlador usa
router.post('/login', controller.Login);
router.post('/save', controller.Create);
router.post('/email', controller.FindByEmail);
router.get('/:id', authMiddleware, controller.FindById);
router.put('/update/:id', controller.Update);
router.delete('/:id', controller.Delete)
//Se exporta
export default router;