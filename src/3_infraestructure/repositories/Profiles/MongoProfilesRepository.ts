// 3_infraestructure/repositories/Profiles/MongoProfilesRepository.ts

import mongoose, { Schema, Document } from 'mongoose';
import { Profile } from '../../../1_domain/Profile/Profile.js';
import type { IProfileRepository } from '../../../1_domain/Profile/IProfileRepository.js';


//  DEFINICIÓN DE ESQUEMA Y MODELO 


// lo que Mongo guarda
interface ProfileDocument extends Document {
  _id: string; 
  userId: string;
  name: string;
  preferences: {
    currency: string;
    monthlyBudget: number;
    alertThreshold: number;
    reportsFrequency: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Esquema de Mongoose
const ProfileSchema = new Schema({
  _id: { type: String, required: true }, // UUID manual
  userId: { type: String, required: true, index: true }, // Índice para búsquedas rápidas
  name: { type: String, required: true },
  preferences: { 
    type: new Schema({
        currency: String,
        monthlyBudget: Number,
        alertThreshold: Number,
        reportsFrequency: String
    }, { _id: false }), // Sin ID para el subdocumento
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  versionKey: false, 
  timestamps: false // Manejamos fechas manualmente desde dominio
});

// El Modelo Compilado
const ProfileModel = mongoose.model<ProfileDocument>('Profile', ProfileSchema, 'profiles');



// 2. CLASE REPOSITORIO (Implementación)


export class MongoProfilesRepository implements IProfileRepository {
    
    // --- Implementación de la Interfaz ---

    async save(profile: Profile): Promise<Profile> {
        // Convertimos Dominio -> Mongo
        const persistenceData = this.mapToPersistence(profile);
        
        // Guardamos
        await ProfileModel.create(persistenceData);
        return profile;
    }

    async findById(id: string): Promise<Profile | null> {
        const doc = await ProfileModel.findById(id).lean<ProfileDocument>();
        if (!doc) return null;
        
        // Convertimos Mongo -> Dominio
        return this.mapToDomain(doc);
    }

    async findAllByUserId(userId: string): Promise<Profile[]> {
        console.log(" --- DEBUG SENPAI START --- ");
        console.log(`1. ID que llega al repositorio: '${userId}'`); // Las comillas simples revelarán espacios
        console.log(`2. Longitud del ID: ${userId.length}`); // Debería ser 24. Si es 25, ¡hay un espacio!

        // Búsqueda explícita
        const docs = await ProfileModel.find({ userId: userId }).lean<ProfileDocument[]>();
        
        console.log(`3. Documentos encontrados en Mongo: ${docs.length}`);
        console.log(" --- DEBUG SENPAI END --- ");

        return docs.map(doc => this.mapToDomain(doc));
    }

    async update(profile: Profile): Promise<Profile> {
        const persistenceData = this.mapToPersistence(profile);
        
        const updatedDoc = await ProfileModel.findByIdAndUpdate(
            profile.id, 
            persistenceData, 
            { new: true }
        ).lean<ProfileDocument>();

        if (!updatedDoc) throw new Error("Profile not found for update");
        
        return this.mapToDomain(updatedDoc);
    }

    async delete(id: string): Promise<void> {
        await ProfileModel.deleteOne({ _id: id });
    }

    // --- Métodos Privados de Ayuda (Mappers internos) ---

    private mapToDomain(doc: ProfileDocument): Profile {
        return new Profile(
            doc._id, // Mongo usa _id, nosotros lo pasamos como id
            doc.userId,
            doc.name,
            {
                currency: doc.preferences.currency,
                monthlyBudget: doc.preferences.monthlyBudget,
                alertThreshold: doc.preferences.alertThreshold,
                reportsFrequency: doc.preferences.reportsFrequency as 'weekly' | 'monthly'
            },
            doc.createdAt,
            doc.updatedAt
        );
    }

    private mapToPersistence(entity: Profile): any {
        return {
            _id: entity.id,
            userId: entity.userId,
            name: entity.name,
            preferences: { ...entity.preferences },
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}