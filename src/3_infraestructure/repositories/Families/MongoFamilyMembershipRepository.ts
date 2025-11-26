import mongoose, { Schema, Document } from 'mongoose';
import { FamilyMembership } from '../../../1_domain/Families/FamilyMembership.js';
import { IFamilyMembershipRepository } from '../../../1_domain/Families/IFamilyMembershipRepository.js';

// --- 1. DEFINICIÓN DE MONGOOSE (Schema) ---

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
    profileId: { type: String, required: true, index: true }, // Indexado para búsquedas rápidas
    familyId: { type: String, required: true, index: true },  // Indexado para búsquedas rápidas
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    isActive: { type: Boolean, default: true },
    joinedAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    timestamps: false
});

// Índice compuesto único: Un perfil no puede estar duplicado en la misma familia
FamilyMembershipSchema.index({ profileId: 1, familyId: 1 }, { unique: true });

const FamilyMembershipModel = mongoose.model<FamilyMembershipDocument>('FamilyMembership', FamilyMembershipSchema, 'family_memberships');


// --- 2. IMPLEMENTACIÓN (Cumpliendo tu Interfaz) ---

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

    async update(membership: FamilyMembership): Promise<FamilyMembership> {
        const data = this.mapToPersistence(membership);
        const updatedDoc = await FamilyMembershipModel.findByIdAndUpdate(
            membership.id,
            data,
            { new: true }
        ).lean<FamilyMembershipDocument>();

        if (!updatedDoc) throw new Error("Membership not found");
        return this.mapToDomain(updatedDoc);
    }

    async delete(id: string): Promise<void> {
        await FamilyMembershipModel.deleteOne({ _id: id });
    }

    //  Validar relación específica
    async findByProfileAndFamilyId(profileId: string, familyId: string): Promise<FamilyMembership | null> {
        const doc = await FamilyMembershipModel.findOne({ profileId, familyId }).lean<FamilyMembershipDocument>();
        return doc ? this.mapToDomain(doc) : null;
    }

    //  Listar mis familias
    async findAllByProfileId(profileId: string): Promise<FamilyMembership[]> {
        const docs = await FamilyMembershipModel.find({ profileId, isActive: true }).lean<FamilyMembershipDocument[]>();
        return docs.map(doc => this.mapToDomain(doc));
    }

    //  Listar miembros de una familia
    async findAllByFamilyId(familyId: string): Promise<FamilyMembership[]> {
        const docs = await FamilyMembershipModel.find({ familyId, isActive: true }).lean<FamilyMembershipDocument[]>();
        return docs.map(doc => this.mapToDomain(doc));
    }

    // --- MAPPERS (Traducción) ---

    private mapToDomain(doc: FamilyMembershipDocument): FamilyMembership {
        // Asumiendo que tu entidad FamilyMembership tiene este constructor
        return new FamilyMembership(
            doc._id,
            doc.profileId,
            doc.familyId,
            doc.role as any, // 'admin' | 'member'
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