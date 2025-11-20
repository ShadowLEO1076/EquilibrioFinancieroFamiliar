import type { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";

export class ProfileUseCaseDelete {
    constructor(private readonly profileRepo: IProfileRepository) {}

    async execute(id: string): Promise<void> {
        // Por seguridad, verificamos:
        const exists = await this.profileRepo.findById(id);
        if (!exists) throw new Error("Profile not found to delete");

        await this.profileRepo.delete(id);
    }
}