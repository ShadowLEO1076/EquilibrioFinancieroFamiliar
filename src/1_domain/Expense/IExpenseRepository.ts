import { Expense } from "./Expense.js";

export interface IExpenseRepository{

    save(input: Expense): Promise<Expense>;
    getAllByProfileIdUserId(profileId: string): Promise<Expense[]>; //ver si esto funciona o moverlo a application
    update(input: Expense): Promise<Expense>; //asegurar que solo ciertos datos puedan actualizarse, NO LA ID NI EL USUARIO
}