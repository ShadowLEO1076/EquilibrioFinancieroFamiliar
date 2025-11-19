//caso de login que nos dará el token y el user... Vamos a ver
import { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";
import { AuthTokenService } from "../../../1_domain/AuthTokenService/AuthTokenService.js";


export class UserUseCaseLogin{

    constructor(
        private readonly userRepo: IUserRepository,
        private readonly authToken: AuthTokenService
    ) {}

    async execute(email: string, password: string){

        let user = await this.userRepo.findByEmail(email);
        if(!user) throw new Error ("User not found");

        //comparar password

        if (user.password != password)
            throw new Error ("Incorrect password");

        let token = this.authToken.generateToken({userId: user.id, userUsername: user.username, userEmail: user.email});

        return {user, token};
    }
}