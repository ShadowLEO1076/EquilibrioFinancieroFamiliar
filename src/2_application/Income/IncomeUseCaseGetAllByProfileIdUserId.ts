import { IIncomeRepository } from "../../1_domain/Income/IIncomeRepository.js";
import { IProfileRepository } from "../../1_domain/Profile/IProfileRepository.js";

export class IncomeUseCaseGetAllByProfileIdUserId{

    constructor(private readonly incomeRepo: IIncomeRepository,
            private readonly profileRepo:IProfileRepository
    ){}

    async execute(profileId: string){
            //asegurar que existe el perfil
            let profile = await this.profileRepo.findById(profileId);
    
            if(!profile) {throw new Error("Profile not existing.")}
    
            //traer todos los income
            let expenses = await this.incomeRepo.getAllByProfileIdUserId(profileId);

            return expenses;
        }
}
