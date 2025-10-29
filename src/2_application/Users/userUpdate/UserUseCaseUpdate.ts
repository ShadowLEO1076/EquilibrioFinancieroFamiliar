import { User } from "../../../1_domain/Users/User.js";
import type { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";

export class UserUseCaseUpdate{

    constructor (private userRepo: IUserRepository){}

    async execute (user: User) {

        return await this.userRepo.update(user);
    }
}