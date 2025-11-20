// 4_presentation/controllers/ProfileController.ts

import type { Request, Response } from 'express';
import { ProfileUseCaseCreate } from '../../2_application/Profile/profileCreate/ProfileUseCaseCreate.js';
import { ProfileUseCaseFindAllByUserId } from '../../2_application/Profile/profileFindAllByUserId/ProfileUseCaseFindAllByUserId.js'; // Asumiendo que lo guardaste aquí

export class ProfileController {

    // Inyectamos los casos de uso que necesitamos
    constructor(
        private readonly creator: ProfileUseCaseCreate,
        private readonly finderByUser: ProfileUseCaseFindAllByUserId
    ) {}    

    /**
     * POST /profiles
     * Crea un nuevo perfil financiero
     */
    create = async (req: Request, res: Response) => {
        try {
            // 1. Extraemos datos seguros (Evitamos "Mass Assignment")
            const { userId, name, preferences } = req.body;

            // 2. Validamos input básico HTTP (opcional, pero recomendado)
            if (!userId || !name || !preferences) {
                res.status(400).json({ error: "Faltan campos obligatorios (userId, name, preferences)" });
                return; // Importante: detener la ejecución
            }

            // 3. Ejecutamos el Caso de Uso
            const profile = await this.creator.execute({ userId, name, preferences });

            // 4. Respuesta exitosa (201 Created)
            res.status(201).json(profile);

        } catch (err: any) {
            // Si el error viene de nuestras validaciones de dominio (ej: presupuesto negativo)
            if (err.message.includes("negative") || err.message.includes("required")) {
                 res.status(400).json({ error: err.message });
            } else {
                 console.error(err); // Log interno
                 res.status(500).json({ error: "Error interno del servidor" });
            }
        }
    }

    /**
     * GET /profiles/user/:userId
     * Obtiene todos los perfiles de un usuario
     */
    getAllByUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                res.status(400).json({ error: "UserId es requerido en la URL" });
                return;
            }

            const profiles = await this.finderByUser.execute(userId);
            res.status(200).json(profiles);

        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}