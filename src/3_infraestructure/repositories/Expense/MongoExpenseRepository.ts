import mongoose from "mongoose";
import { Expense, PaymentMethod } from "../../../1_domain/Expense/Expense.js";
import { ProfileModel } from "../Profiles/MongoProfilesRepository.js";
import { IExpenseRepository } from "../../../1_domain/Expense/IExpenseRepository.js";

const ExpenseSchema = new mongoose.Schema({

    amount: {
        type: Number,
        required: true,
        min: [0.01, "Expense amount must be greater than zero"]
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true
    },

    profileId: {
        type: String,   // id es un string, no un ObjectId de Mongo
        ref: "Profile",
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { 
    timestamps: true
});

export const expenseModel = mongoose.model("Expense", ExpenseSchema, "Expenses");

export class MongoExpenseRepository implements IExpenseRepository{

    async save(input: Expense): Promise<Expense> {
        
        //crear model usando el dato
        let newExpense = new expenseModel(input);
        //salvamos el modelo
        let saved = newExpense.save();
        //regresamos lo salvado
        return this.toDomain(saved);
    }

    async getAllByProfileIdUserId(profileId: string): Promise<Expense[]> {
        
        let data = await expenseModel.find({profileId}).lean();

        return data.map(doc => this.toDomain(doc));
    }

    update(input: Expense): Promise<Expense> {
        throw new Error("Method not implemented.");
    }

    private toDomain(doc: any): Expense{
        return new Expense(
            doc.id,
            doc.amount,
            doc.description,
            doc.categoryId, //solo queremos la id, pero toca ver si esto daña mi populate
            doc.date,
            doc.paymentMethod,
            doc.profileId,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        )
    }
}