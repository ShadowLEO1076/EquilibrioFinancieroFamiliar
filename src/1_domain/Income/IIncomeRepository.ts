import { Income } from "./Income.js";

export interface IIncomeRepository {

    save(input: Income): Promise<Income>;
    getAllByProfileIdUserId(profileId: string): Promise<Income[]>; //ver si esto funciona o moverlo a application
    update(input: Income): Promise<Income>; //asegurar que solo ciertos datos puedan actualizarse, NO LA ID NI EL USUARIO
}