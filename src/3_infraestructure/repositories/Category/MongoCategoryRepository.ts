import mongoose, { Schema }  from "mongoose";
import { ICategoryRepository } from "../../../1_domain/Category/ICategoryRepository.js";
import { Category } from "../../../1_domain/Category/Category.js";
import { ProfileModel } from "../Profiles/MongoProfilesRepository.js";

const CategorySchema = new mongoose.Schema({
     id: {type: String},
     name: { type: String, required: true },
     description: { type: String, required: true },
     isActive: { type: Boolean, default: true },
     profileId: { type: String, ref: 'Profile', default: null  },  // Si es null, es categoría oficial
     type: { type: String, enum: ['income', 'expense', 'both'], default: null },
     createdAt: Date,
     updatedAt: Date
}, { timestamps: true });

export const CategoryModel = mongoose.model("Category", CategorySchema, "Categories");


export class MongoCategoryRepository implements ICategoryRepository{

     async getAllwithProfileEspecific(profileId: string): Promise<Category[]> {
           // Buscar todas las categorías oficiales y las del usuario
        const docs = await CategoryModel.find({
            $or: [
                { profileId: null },        // oficiales
                { profileId: profileId }    // del usuario
            ]
        }).exec();

        // Convertir documentos de Mongoose a la clase de dominio Category
        return docs.map(doc => new Category(
            doc._id.toString(),
            doc.name,
            doc.description,
            doc.isActive,
            doc.profileId ? doc.profileId : undefined, // si hay profile
            doc.type ?? undefined,
            doc.createdAt,
            doc.updatedAt
        ));
     }

     async save(input: Category): Promise<Category> {

         const doc = await CategoryModel.create({
            name: input.name,
            description: input.description,
            isActive: input.isActive,
            profileId: input.profileId,
            type: input.type ?? null
        });

        return new Category(
            doc._id.toString(),
            doc.name,
            doc.description,
            doc.isActive,
            doc.profileId ? doc.profileId.toString() : undefined,
            doc.type ?? undefined,
            doc.createdAt,
            doc.updatedAt
        );
    }
}