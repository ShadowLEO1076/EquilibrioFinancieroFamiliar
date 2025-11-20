// 1_domain/Profile/IProfileRepository.ts

import { Profile } from "./Profile.js";

export interface IProfileRepository {
    save(profile: Profile): Promise<Profile>; 
    findById(id: string): Promise<Profile | null>; 
    findAllByUserId(userId: string): Promise<Profile[]>; // Crucial para tu dashboard inicial
    update(profile: Profile): Promise<Profile>; 
    delete(id: string): Promise<void>; 
}