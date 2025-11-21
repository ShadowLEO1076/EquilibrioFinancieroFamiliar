// src/4_presentation/routes/FamilyRoutes.ts

import { Router } from 'express';

// 1. REPOSITORIOS (Infraestructura)
import { MongoFamilyRepository } from '../../3_infraestructure/repositories/Family/MongoFamilyRepository.js';
import { MongoFamilyMembershipRepository } from '../../3_infraestructure/repositories/Families/MongoFamilyMembershipRepository.js';
import { MongoProfilesRepository } from '../../3_infraestructure/repositories/Profiles/MongoProfilesRepository.js'; // ¡Necesario para validar al unirse!

// 2. CASOS DE USO (Aplicación)
import { FamilyUseCaseCreate } from '../../2_application/Family/familyCreate/FamilyUseCaseCreate.js';
import { FamilyMembershipUseCaseCreate } from '../../2_application/Families/familiesCreate/FamilyMembershipUseCaseCreate.js'; // Unirse
import { FamilyUseCaseFindById } from '../../2_application/Family/familyFindById/FamilyUseCaseFind.js';
import { FamilyMembershipUseCaseFindMyFamilies, FamilyMembershipUseCaseFindMembers } from '../../2_application/Families/familiesFindById/FamilyMembershipUseCaseFind.js';   

// 3. CONTROLADOR
import { FamilyController } from '../Family/FamilyController.js';

// --- COMPOSITION ROOT (Inyección) ---

// A. Instanciamos Repositorios
const familyRepo = new MongoFamilyRepository();
const membershipRepo = new MongoFamilyMembershipRepository();
const profileRepo = new MongoProfilesRepository();

// B. Instanciamos Casos de Uso
// Crear Familia (Doble Impacto)
const createFamilyUC = new FamilyUseCaseCreate(familyRepo, membershipRepo);
// Unirse a Familia (Necesita validar perfil, familia y duplicados)
const joinFamilyUC = new FamilyMembershipUseCaseCreate(membershipRepo, familyRepo, profileRepo);

// Lecturas
const findFamilyByIdUC = new FamilyUseCaseFindById(familyRepo);
const findMyFamiliesUC = new FamilyMembershipUseCaseFindMyFamilies(membershipRepo);
const findMembersUC = new FamilyMembershipUseCaseFindMembers(membershipRepo);

// C. Instanciamos Controlador
const controller = new FamilyController(
    createFamilyUC,
    joinFamilyUC,
    findFamilyByIdUC,
    findMyFamiliesUC,
    findMembersUC
);

// --- RUTAS ---
const router = Router();

// Crear Familia (POST)
router.post('/', controller.create);

// Unirse a Familia (POST) - La acción es "join"
router.post('/join', controller.join);

// Ver Familia por ID (GET)
router.get('/:id', controller.getById);

// Ver "Mis Familias" de un Perfil (GET)
router.get('/my-families/:profileId', controller.getMyFamilies);

// Ver Miembros de una Familia (GET)
router.get('/:id/members', controller.getMembers);

export default router;