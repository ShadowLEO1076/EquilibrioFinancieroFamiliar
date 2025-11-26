import { Router } from 'express';

// 1. REPOSITORIOS (Infraestructura)
import { MongoFamilyRepository } from '../../3_infraestructure/repositories/Family/MongoFamilyRepository.js';
import { MongoFamilyMembershipRepository } from '../../3_infraestructure/repositories/Families/MongoFamilyMembershipRepository.js';
import { MongoProfilesRepository } from '../../3_infraestructure/repositories/Profiles/MongoProfilesRepository.js';
// 🆕 NUEVOS IMPORTS FINANCIEROS
import { MongoBudgetRepository } from '../../3_infraestructure/repositories/Budget/MongoBudgetRepository.js';
import { MongoExpenseRepository } from '../../3_infraestructure/repositories/Expense/MongoExpenseRepository.js';

// 2. CASOS DE USO (Aplicación)
import { FamilyUseCaseCreate } from '../../2_application/Family/familyCreate/FamilyUseCaseCreate.js';
import { FamilyMembershipUseCaseCreate } from '../../2_application/Families/familiesCreate/FamilyMembershipUseCaseCreate.js';
import { FamilyUseCaseFindById } from '../../2_application/Family/familyFindById/FamilyUseCaseFind.js';
import { FamilyMembershipUseCaseFindMyFamilies, FamilyMembershipUseCaseFindMembers } from '../../2_application/Families/familiesFindById/FamilyMembershipUseCaseFind.js';
import { FamilyUseCaseQueries } from '../../2_application/Family/queries/FamilyUseCaseQueries.js';

// 3. CONTROLADOR
import { FamilyController } from '../Family/FamilyController.js';

// --- COMPOSITION ROOT (Inyección de Dependencias) ---

// A. Instanciamos Repositorios
const familyRepo = new MongoFamilyRepository();
const membershipRepo = new MongoFamilyMembershipRepository();
const profileRepo = new MongoProfilesRepository();
// 🆕 INSTANCIAMOS LOS REPOS DE FINANZAS
const budgetRepo = new MongoBudgetRepository();
const expenseRepo = new MongoExpenseRepository();

// B. Instanciamos Casos de Uso
const createFamilyUC = new FamilyUseCaseCreate(familyRepo, membershipRepo);
const joinFamilyUC = new FamilyMembershipUseCaseCreate(membershipRepo, familyRepo, profileRepo);

const findFamilyByIdUC = new FamilyUseCaseFindById(familyRepo);
const findMyFamiliesUC = new FamilyMembershipUseCaseFindMyFamilies(membershipRepo);
const findMembersUC = new FamilyMembershipUseCaseFindMembers(membershipRepo);

// 🆕 INYECCIÓN ACTUALIZADA: Ahora recibe 5 argumentos
const queriesUC = new FamilyUseCaseQueries(
    familyRepo,
    membershipRepo,
    profileRepo,
    budgetRepo,  // 💰 Para sumar presupuestos
    expenseRepo  // 💸 Para sumar gastos
);

// C. Instanciamos Controlador
const controller = new FamilyController(
    createFamilyUC,
    joinFamilyUC,
    findFamilyByIdUC,
    findMyFamiliesUC,
    findMembersUC,
    queriesUC
);

// --- RUTAS ---
const router = Router();

// Crear Familia (POST)
router.post('/', controller.create);

// Unirse a Familia (POST)
router.post('/join', controller.join);

// Ver Familia por ID (GET)
router.get('/:id', controller.getById);

// Ver Detalle Completo para Dashboard (GET)
router.get('/:id/details', controller.getDetails);

// Ver "Mis Familias" de un Perfil (GET)
router.get('/my-families/:profileId', controller.getMyFamilies);

// Ver Miembros de una Familia (GET)
router.get('/:id/members', controller.getMembers);

export default router;