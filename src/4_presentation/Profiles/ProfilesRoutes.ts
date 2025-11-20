// 4_presentation/routes/ProfileRoutes.ts

import { Router } from 'express';

// 1. Importamos Repositorio (Infraestructura)
import { MongoProfilesRepository } from '../../3_infraestructure/repositories/Profiles/MongoProfilesRepository.js';

// 2. Importamos Casos de Uso (Aplicación)
import { ProfileUseCaseCreate } from '../../2_application/Profile/profileCreate/ProfileUseCaseCreate.js';
import { ProfileUseCaseFindAllByUserId } from '../../2_application/Profile/profileFindAllByUserId/ProfileUseCaseFindAllByUserId.js';

// 3. Importamos el Controlador (Presentación)
import { ProfileController } from './ProfilesController.js';
//  BIEN (Apuntando a la carpeta 'routes')
//  INYECCIÓN DE DEPENDENCIAS 

// A. Instanciamos el Repositorio
const profileRepo = new MongoProfilesRepository();

// B. Instanciamos los Casos de Uso (inyectando el repo)
const createUseCase = new ProfileUseCaseCreate(profileRepo);
const findAllByUserUseCase = new ProfileUseCaseFindAllByUserId(profileRepo);

// C. Instanciamos el Controlador (inyectando los casos de uso)
const controller = new ProfileController(createUseCase, findAllByUserUseCase);

// --- DEFINICIÓN DE RUTAS ---
const router = Router();

// POST http://localhost:3000/api/profiles/
router.post('/', controller.create);

// GET http://localhost:3000/api/profiles/user/1234-5678
router.get('/user/:userId', controller.getAllByUser);

export default router;