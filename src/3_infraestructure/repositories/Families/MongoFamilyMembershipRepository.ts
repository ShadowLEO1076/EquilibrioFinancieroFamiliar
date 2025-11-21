// src/3_infraestructure/repositories/Families/MongoFamilyMembershipRepository.ts

import mongoose, { Schema, Document } from 'mongoose';
import { FamilyMembership, FamilyRole } from '../../../1_domain/Families/FamilyMembership.js';
import type { IFamilyMembershipRepository } from '../../../1_domain/Families/IFamilyMembershipRepository.js';


// ESQUEMA Y MODELO (Mongoose)


interface FamilyMembershipDocument extends Document {
    _id: string;
    profileId: string;
    familyId: string;
    role: string;
    isActive: boolean;
    joinedAt: Date;
}

const FamilyMembershipSchema = new Schema({
    _id: { type: String, required: true },
    profileId: { type: String, required: true, index: true }, // Indexado: "Mis Familias"
    familyId: { type: String, required: true, index: true },  // Indexado: "Miembros de esta Familia"
    role: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' },
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    timestamps: false
});

// Índice compuesto opcional: evitar duplicados a nivel de BD
FamilyMembershipSchema.index({ profileId: 1, familyId: 1 }, { unique: true });

const FamilyMembershipModel = mongoose.model<FamilyMembershipDocument>('FamilyMembership', FamilyMembershipSchema, 'family_memberships');


//IMPLEMENTACIÓN DEL REPOSITORIO


export class MongoFamilyMembershipRepository implements IFamilyMembershipRepository {

    async save(membership: FamilyMembership): Promise<FamilyMembership> {
        const data = this.mapToPersistence(membership);
        await FamilyMembershipModel.create(data);
        return membership;
    }

    async findById(id: string): Promise<FamilyMembership | null> {
        const doc = await FamilyMembershipModel.findById(id).lean<FamilyMembershipDocument>();
        return doc ? this.mapToDomain(doc) : null;
    }

    // Validar si YA existe la relación (evitar duplicados)
    async findByProfileAndFamilyId(profileId: string, familyId: string): Promise<FamilyMembership | null> {
        const doc = await FamilyMembershipModel.findOne({ profileId, familyId }).lean<FamilyMembershipDocument>();
        return doc ? this.mapToDomain(doc) : null;
    }

    // Listar "Mis Familias" (Dashboard)
    async findAllByProfileId(profileId: string): Promise<FamilyMembership[]> {
        const docs = await FamilyMembershipModel.find({ profileId }).lean<FamilyMembershipDocument[]>();
        return docs.map(doc => this.mapToDomain(doc));
    }

    // Listar "Miembros de la Familia" (Configuración)
    async findAllByFamilyId(familyId: string): Promise<FamilyMembership[]> {
        const docs = await FamilyMembershipModel.find({ familyId }).lean<FamilyMembershipDocument[]>();
        return docs.map(doc => this.mapToDomain(doc));
    }

    async update(membership: FamilyMembership): Promise<FamilyMembership> {
        const data = this.mapToPersistence(membership);
        const updatedDoc = await FamilyMembershipModel.findByIdAndUpdate(
            membership.id, data, { new: true }
        ).lean<FamilyMembershipDocument>();
        
        if (!updatedDoc) throw new Error("Membership not found");
        return this.mapToDomain(updatedDoc);
    }

    async delete(id: string): Promise<void> {
        await FamilyMembershipModel.deleteOne({ _id: id });
    }

    //  MAPPERS PRIVADOS 

    private mapToDomain(doc: FamilyMembershipDocument): FamilyMembership {
        return new FamilyMembership(
            doc._id,
            doc.profileId,
            doc.familyId,
            doc.role as FamilyRole, // Casting seguro gracias al Enum del Schema
            doc.isActive,
            doc.joinedAt
        );
    }

    private mapToPersistence(entity: FamilyMembership): any {
        return {
            _id: entity.id,
            profileId: entity.profileId,
            familyId: entity.familyId,
            role: entity.role,
            isActive: entity.isActive,
            joinedAt: entity.joinedAt
        };
    }
}