import type { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";


export class UserUseCaseFindByEmail{

    constructor (private readonly userRepo: IUserRepository){}

    async execute (input: string) {
        
            let user = await this.userRepo.findByEmail(input);
            return user;

    }
}