// src/1_domain/Expense/IExpenseRepository.ts
import { Expense } from "./Expense.js";

export interface IExpenseRepository {
    save(expense: Expense): Promise<Expense>;

    //ESTA ES LA LÍNEA QUE TE FALTA O TIENE OTRO NOMBRE
    // Puedes llamarla getAllByProfileIdUserId si quieres, pero findAllByProfileId es más limpio.
    findAllByProfileId(profileId: string): Promise<Expense[]>;

    update(expense: Expense): Promise<Expense>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Expense | null>;
}