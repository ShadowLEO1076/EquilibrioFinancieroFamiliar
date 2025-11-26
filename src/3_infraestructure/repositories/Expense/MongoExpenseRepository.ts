import mongoose from "mongoose";
import { Expense, PaymentMethod } from "../../../1_domain/Expense/Expense.js";
import { IExpenseRepository } from "../../../1_domain/Expense/IExpenseRepository.js";

const ExpenseSchema = new mongoose.Schema({
    _id: { type: String }, // Para aceptar tus UUIDs manuales
    amount: { type: Number, required: true },
    description: { type: String, required: true },

    // CAMBIO IMPORTANTE: String en lugar de ObjectId para evitar errores con UUIDs
    categoryId: { type: String, ref: "Category", required: true },

    date: { type: Date, required: true },
    paymentMethod: { type: String, required: true },

    profileId: { type: String, required: true },
    userId: { type: String, required: true },

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const expenseModel = mongoose.model("Expense", ExpenseSchema, "Expenses");

export class MongoExpenseRepository implements IExpenseRepository {

    async save(input: Expense): Promise<Expense> {
        // Creamos la instancia
        const newExpense = new expenseModel({
            _id: input.id, // Guardamos tu UUID
            amount: input.amount,
            description: input.description,
            categoryId: input.categoryId,
            date: input.date,
            paymentMethod: input.paymentMethod,
            profileId: input.profileId,
            userId: input.userId, // 🆕
            isActive: input.isActive
        });


        const saved = await newExpense.save();

        return this.toDomain(saved);
    }

    async findAllByProfileId(profileId: string): Promise<Expense[]> {
        const data = await expenseModel.find({ profileId }).lean().exec();
        return data.map(doc => this.toDomain(doc));
    }

    // Implementación necesaria para el update del budget
    async findById(id: string): Promise<Expense | null> {
        const doc = await expenseModel.findById(id).lean().exec();
        return doc ? this.toDomain(doc) : null;
    }

    async delete(id: string): Promise<void> {
        await expenseModel.deleteOne({ _id: id }).exec();
    }

    async update(input: Expense): Promise<Expense> {
        const updated = await expenseModel.findByIdAndUpdate(
            input.id,
            {
                amount: input.amount,
                description: input.description,
                categoryId: input.categoryId,
                date: input.date,
                // ... otros campos actualizables
            },
            { new: true } // Devuelve el nuevo documento
        ).lean().exec();

        if (!updated) throw new Error("Expense not found to update");
        return this.toDomain(updated);
    }
    async sumCurrentMonthExpenses(profileId: string): Promise<number> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Buscamos gastos de este perfil en este rango de fechas
        const expenses = await expenseModel.find({
            profileId: profileId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).lean();

        // Sumamos el monto total
        return expenses.reduce((acc, curr) => acc + curr.amount, 0);


    }

    private toDomain(doc: any): Expense {
        return new Expense(
            doc._id.toString(),
            doc.amount,
            doc.description,
            doc.categoryId.toString(), // Aseguramos string
            doc.date,
            doc.paymentMethod as PaymentMethod,
            doc.profileId,
            doc.userId, // se le agrega porque es un campo nuevo
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        )
    }
}