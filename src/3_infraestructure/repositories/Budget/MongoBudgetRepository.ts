// src/3_infraestructure/repositories/Budgets/MongoBudgetRepository.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Budget, BudgetPeriod, BudgetAlert } from '../../../1_domain/Budget/Budget.js';
import type { IBudgetRepository } from '../../../1_domain/Budget/IBudgetRepository.js';

// --- 1. SCHEMA Y MODELO ---

interface BudgetDocument extends Document {
    _id: string;
    profileId: string;
    categoryId: string;
    amount: number;
    spent: number;
    remaining: number;
    period: BudgetPeriod;
    alerts: BudgetAlert[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BudgetSchema = new Schema({
    _id: { type: String, required: true },
    profileId: { type: String, required: true, index: true }, // Indexado para dashboard rápido
    categoryId: { type: String, required: true },
    amount: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    remaining: { type: Number, required: true },

    // Sub-objeto Periodo
    period: {
        type: { type: String, enum: ['monthly', 'weekly', 'quarterly', 'yearly'] },
        startDate: Date,
        endDate: Date
    },

    // Array de Alertas
    alerts: [{
        _id: false, // No queremos IDs internos para las alertas
        type: { type: String, enum: ['percentage', 'amount'] },
        threshold: Number,
        isTriggered: { type: Boolean, default: false }
    }],

    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { versionKey: false, timestamps: false });

const BudgetModel = mongoose.model<BudgetDocument>('Budget', BudgetSchema, 'budgets');

// --- 2. IMPLEMENTACIÓN ---

export class MongoBudgetRepository implements IBudgetRepository {

    async save(budget: Budget): Promise<Budget> {
        const data = this.mapToPersistence(budget);
        await BudgetModel.create(data);
        return budget;
    }

    async findById(id: string): Promise<Budget | null> {
        const doc = await BudgetModel.findById(id).lean<BudgetDocument>();
        return doc ? this.mapToDomain(doc) : null;
    }

    async findAllByProfileId(profileId: string): Promise<Budget[]> {
        const docs = await BudgetModel.find({ profileId }).lean<BudgetDocument[]>();
        return docs.map(doc => this.mapToDomain(doc));
    }

    async update(budget: Budget): Promise<Budget> {
        const data = this.mapToPersistence(budget);
        const updatedDoc = await BudgetModel.findByIdAndUpdate(
            budget.id, data, { new: true }
        ).lean<BudgetDocument>();

        if (!updatedDoc) throw new Error("Budget not found update");
        return this.mapToDomain(updatedDoc);
    }

    async delete(id: string): Promise<void> {
        await BudgetModel.deleteOne({ _id: id });
    }


    // src/3_infraestructure/repositories/Budget/MongoBudgetRepository.ts

    // ... dentro de la clase ...
    async sumTotalBudget(profileId: string): Promise<number> {
        // Asumimos que los presupuestos son mensuales y están activos
        const budgets = await BudgetModel.find({ profileId: profileId }).lean();

        // Sumamos el monto total planificado
        return budgets.reduce((acc, curr) => acc + curr.amount, 0);
    }

    // --- MAPPERS ---

    private mapToDomain(doc: BudgetDocument): Budget {
        return new Budget(
            doc._id,
            doc.profileId,
            doc.categoryId,
            doc.amount,
            doc.period,
            doc.spent,
            doc.remaining,
            doc.alerts,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt
        );
    }

    private mapToPersistence(entity: Budget): any {
        return {
            _id: entity.id,
            profileId: entity.profileId,
            categoryId: entity.categoryId,
            amount: entity.amount,
            spent: entity.spent,
            remaining: entity.remaining,
            period: entity.period,
            alerts: entity.alerts,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}