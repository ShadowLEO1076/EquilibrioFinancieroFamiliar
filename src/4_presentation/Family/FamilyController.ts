import type { Request, Response } from 'express';

// Importamos TODOS los casos de uso necesarios (Escritura y Lectura)
import { FamilyUseCaseCreate } from '../../2_application/Family/familyCreate/FamilyUseCaseCreate.js';
import { FamilyMembershipUseCaseCreate } from '../../2_application/Families/familiesCreate/FamilyMembershipUseCaseCreate.js';
import { FamilyUseCaseFindById } from '../../2_application/Family/familyFindById/FamilyUseCaseFind.js';
import { FamilyMembershipUseCaseFindMyFamilies, FamilyMembershipUseCaseFindMembers } from '../../2_application/Families/familiesFindById/FamilyMembershipUseCaseFind.js';
// IMPORT NUEVO (El pegamento)
import { FamilyUseCaseQueries } from '../../2_application/Family/queries/FamilyUseCaseQueries.js';

export class FamilyController {

    constructor(
        // Escritura (Mutations)
        private readonly creator: FamilyUseCaseCreate,
        private readonly joiner: FamilyMembershipUseCaseCreate,

        // Lectura (Queries Básicos)
        private readonly finderById: FamilyUseCaseFindById,
        private readonly finderMyFamilies: FamilyMembershipUseCaseFindMyFamilies,
        private readonly finderMembers: FamilyMembershipUseCaseFindMembers,

        // Lectura Avanzada (Queries Complejos)
        private readonly queries: FamilyUseCaseQueries
    ) { }

    /**
     * POST /families
     * Crea una familia y hace Admin al creador
     */
    create = async (req: Request, res: Response) => {
        try {
            const { name, adminProfileId } = req.body;

            if (!name || !adminProfileId) {
                res.status(400).json({ error: "Nombre y adminProfileId son requeridos" });
                return;
            }

            const family = await this.creator.execute({ name, adminProfileId });
            res.status(201).json(family);

        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * POST /families/join
     * Un perfil se une a una familia existente vía código
     */
    join = async (req: Request, res: Response) => {
        try {
            const { profileId, inviteCode } = req.body;

            if (!profileId || !inviteCode) {
                res.status(400).json({ error: "ProfileId e inviteCode son requeridos" });
                return;
            }

            const membership = await this.joiner.execute({ profileId, inviteCode });
            res.status(201).json(membership);

        } catch (err: any) {
            if (err.message.includes("ya es miembro") || err.message.includes("no existe")) {
                res.status(400).json({ error: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    }

    /**
     * GET /families/:id
     * Obtiene detalles básicos de una familia
     */
    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const family = await this.finderById.execute(id);
            res.status(200).json(family);
        } catch (err: any) {
            res.status(404).json({ error: "Familia no encontrada" });
        }
    }

    /**
     * GET /families/my-families/:profileId
     * Lista todas las familias a las que pertenece un perfil
     */
    getMyFamilies = async (req: Request, res: Response) => {
        try {
            const { profileId } = req.params;

            // USAMOS QUERIES: Trae nombres y roles (Ideal para tarjetas)
            const families = await this.queries.getMyFamilies(profileId);


            res.status(200).json(families);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * GET /families/:id/members
     * Lista IDs de miembros
     */
    getMembers = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const members = await this.finderMembers.execute(id);
            res.status(200).json(members);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * GET /families/:id/details
     * Devuelve TODO: Familia + Miembros con NOMBRES REALES (Para el Dashboard Familiar)
     */
    getDetails = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            console.log("FamilyController.getDetails ID:", id); // LOGGING

            // 🚨 Asegúrate de que tu FamilyUseCaseQueries tenga este método
            const data = await this.queries.getFamilyDetailsComplete(id);
            console.log("FamilyController.getDetails Data:", data); // LOGGING

            res.status(200).json(data);
        } catch (err: any) {
            console.error("Error en getDetails:", err);
            res.status(500).json({ error: err.message });
        }
    }
}