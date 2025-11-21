// src/4_presentation/Controllers/FamilyController.ts

import type { Request, Response } from 'express';

// Importamos TODOS los casos de uso necesarios (Escritura y Lectura)
import { FamilyUseCaseCreate } from '../../2_application/Family/familyCreate/FamilyUseCaseCreate.js';
import { FamilyMembershipUseCaseCreate } from '../../2_application/Families/familiesCreate/FamilyMembershipUseCaseCreate.js'; // Unirse
import { FamilyUseCaseFindById } from '../../2_application/Family/familyFindById/FamilyUseCaseFind.js';
import { FamilyMembershipUseCaseFindMyFamilies, FamilyMembershipUseCaseFindMembers } from '../../2_application/Families/familiesFindById/FamilyMembershipUseCaseFind.js';

export class FamilyController {

    constructor(
        // Escritura (Mutations)
        private readonly creator: FamilyUseCaseCreate,
        private readonly joiner: FamilyMembershipUseCaseCreate,
        
        // Lectura (Queries)
        private readonly finderById: FamilyUseCaseFindById,
        private readonly finderMyFamilies: FamilyMembershipUseCaseFindMyFamilies,
        private readonly finderMembers: FamilyMembershipUseCaseFindMembers
    ) {}

    /**
     * POST /families
     * Crea una familia y hace Admin al creador (Doble Impacto)
     */
    create = async (req: Request, res: Response) => {
        try {
            const { name, adminProfileId } = req.body;
            
            // Validación básica de entrada
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
            res.status(201).json(membership); // 201 Created (la membresía)

        } catch (err: any) {
            // Manejo de errores específicos de negocio
            if (err.message.includes("ya es miembro") || err.message.includes("no existe")) {
                res.status(400).json({ error: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    }

    /**
     * GET /families/:id
     * Obtiene detalles de una familia (Nombre, Código, etc.)
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
     * Lista todas las familias a las que pertenece un perfil (Dashboard)
     */
    getMyFamilies = async (req: Request, res: Response) => {
        try {
            const { profileId } = req.params;
            const memberships = await this.finderMyFamilies.execute(profileId);
            // Nota: Aquí devolvemos las membresías. 
            // En el futuro, el Frontend usará los familyId de aquí para pedir los nombres de las familias.
            res.status(200).json(memberships);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * GET /families/:id/members
     * Lista todos los miembros de una familia específica
     */
    getMembers = async (req: Request, res: Response) => {
        try {
            const { id } = req.params; // ID de la familia
            const members = await this.finderMembers.execute(id);
            res.status(200).json(members);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}