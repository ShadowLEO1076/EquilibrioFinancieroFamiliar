// src/3_infraestructure/repositories/Families/MongoFamilyRepository.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Family } from '../../../1_domain/Family/Family.js';
import type { IFamilyRepository } from '../../../1_domain/Family/IFamilyRepository.js';


//  ESQUEMA Y MODELO (Mongoose)


interface FamilyDocument extends Document {
    _id: string;
    name: string;
    inviteCode: string;
    adminProfileId: string;
    createdAt: Date;
    updatedAt: Date;
}

const FamilySchema = new Schema({
    _id: { type: String, required: true }, // UUID manual
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true, index: true }, // Único e Indexado
    adminProfileId: { type: String, required: true, index: true }, // Indexado para saber qué familias creó
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    timestamps: false
});

const FamilyModel = mongoose.model<FamilyDocument>('Family', FamilySchema, 'families');


//  IMPLEMENTACIÓN DEL REPOSITORIO


export class MongoFamilyRepository implements IFamilyRepository {

    async save(family: Family): Promise<Family> {
        const data = this.mapToPersistence(family);
        await FamilyModel.create(data);
        return family;
    }

    async findById(id: string): Promise<Family | null> {
        const doc = await FamilyModel.findById(id).lean<FamilyDocument>();
        return doc ? this.mapToDomain(doc) : null;
    }

    async findByInviteCode(inviteCode: string): Promise<Family | null> {
        const doc = await FamilyModel.findOne({ inviteCode }).lean<FamilyDocument>();
        return doc ? this.mapToDomain(doc) : null;
    }

    async update(family: Family): Promise<Family> {
        const data = this.mapToPersistence(family);
        const updatedDoc = await FamilyModel.findByIdAndUpdate(
            family.id, 
            data, 
            { new: true }
        ).lean<FamilyDocument>();

        if (!updatedDoc) throw new Error("Family not found for update");
        return this.mapToDomain(updatedDoc);
    }

    async delete(id: string): Promise<void> {
        await FamilyModel.deleteOne({ _id: id });
    }

    // MAPPERS PRIVADOS 

    private mapToDomain(doc: FamilyDocument): Family {
        return new Family(
            doc._id,
            doc.name,
            doc.inviteCode,
            doc.adminProfileId,
            doc.createdAt,
            doc.updatedAt
        );
    }

    private mapToPersistence(entity: Family): any {
        return {
            _id: entity.id,
            name: entity.name,
            inviteCode: entity.inviteCode,
            adminProfileId: entity.adminProfileId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}