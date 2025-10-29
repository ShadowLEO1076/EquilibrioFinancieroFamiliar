import { User } from "../../../1_domain/Users/User.js";    
import type { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";


export class UserUseCaseFindById{

    constructor (private readonly userRepo: IUserRepository){}

    async execute (input: string) {
        
            let user = await this.userRepo.findById(input);
            return user;

    }
}