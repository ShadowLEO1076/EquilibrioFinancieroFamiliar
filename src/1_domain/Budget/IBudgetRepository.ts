import { Budget } from "./Budget.js";

export interface IBudgetRepository {
    // Define los métodos que el repositorio de presupuestos debe implementar
    create( buget: Budget): Promise<Budget>;
    getAll(): Promise<Budget[]>;
    getById(id: string): Promise<Budget | null>;
    update(buget: Budget): Promise<void>;
    delete(id: string): Promise<void>;


}