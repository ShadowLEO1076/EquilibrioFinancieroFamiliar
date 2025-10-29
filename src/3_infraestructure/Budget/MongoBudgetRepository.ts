//aquí tendremos los esquemas y las implementaciones de los repositorio,
//primero importamos todo lo necesario
import mongoose from "mongoose";
import type {IBudgetRepository} from "../../1_domain/Budget/IBudgetRepository.js";
import {Budget} from "../../1_domain/Budget/Budget.js";

//schema de presupuesto
const budgetSchema = new mongoose.Schema({
    id: String,
    userId: String,
    categoryId: String, 
    amount: Number,
    period: String,
    spent: Number,
    remaining: Number,
    alerts: [String],
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
});
//creamos un modelo, según la documentación de Mongo, un modelo compila un esquema
const budgetModel = mongoose.model('Budget', budgetSchema,'Budgets');
export class MongoBudgetRepository implements IBudgetRepository{
    async create(budget: Budget): Promise<Budget> {
        //creo mi modelo
        const newBudget = new budgetModel(budget);
        //llamamos a save
        const saved = await newBudget.save();
        //retornamos la entidad guardada
        return this.toDomain(saved);
    }
    //por implementar
    async getAll(): Promise<Budget[]> {
        const docs = await budgetModel.find();
        return docs.map(doc => this.toDomain(doc));
    }


    getById(id: string): Promise<Budget | null> {


        throw new Error("Method not implemented.");
    }
    update(budget: Budget): Promise<void> {
        throw new Error("Method not implemented.");
    }   
    delete(id: string): Promise<void> {     
        throw new Error("Method not implemented.");
    }
    //función que transforma de nuestro Model a la entidad Budget
        private toDomain(doc: any): Budget {    
        return new Budget(
            doc.id,
            doc.userId,
            doc.categoryId, 
            doc.amount,
            doc.period,
            doc.spent,
            doc.remaining,
            doc.alerts,
            doc.isActive,
            doc.createdAt,
            //doc.updatedAt
        );
    }
}

