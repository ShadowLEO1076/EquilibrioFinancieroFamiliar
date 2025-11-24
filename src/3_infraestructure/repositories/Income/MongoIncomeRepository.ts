import mongoose from "mongoose";
import { Income, IncomeType } from "../../../1_domain/Income/Income.js";
import { ProfileModel } from "../Profiles/MongoProfilesRepository.js";
import { IIncomeRepository } from "../../../1_domain/Income/IIncomeRepository.js";

const IncomeSchema = new mongoose.Schema({

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

    incomeSource: {
        type: String,
        enum: Object.values(IncomeType),
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

export const incomeModel = mongoose.model("Income", IncomeSchema, "Incomes");

export class MongoIncomeRepository implements IIncomeRepository{

        async save(input: Income): Promise<Income> {
            
            //crear model usando el dato
            let newIncome = new incomeModel(input);
            //salvamos el modelo
            let saved = newIncome.save();
            //regresamos lo salvado
            return this.toDomain(saved);
        }
    
        async getAllByProfileIdUserId(profileId: string): Promise<Income[]> {
            
            let data = await incomeModel.find({profileId}).lean();
    
            return data.map(doc => this.toDomain(doc));
        }
    
        update(input: Income): Promise<Income> {
            throw new Error("Method not implemented.");
        }
    
        private toDomain(doc: any): Income{
            return new Income(
                doc.id,
                doc.amount,
                doc.description,
                doc.categoryId, //solo queremos la id, pero toca ver si esto daña mi populate
                doc.date,
                doc.incomeSource,
                doc.profileId,
                doc.isActive,
                doc.createdAt,
                doc.updatedAt
            )
        }
}
