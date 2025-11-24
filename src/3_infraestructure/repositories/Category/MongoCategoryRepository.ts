import mongoose from "mongoose";
import { ICategoryRepository } from "../../../1_domain/Category/ICategoryRepository.js";
import { Category } from "../../../1_domain/Category/Category.js";

const CategorySchema = new mongoose.Schema({
    // id: {type: String}, // Mongoose crea _id solo, no hace falta duplicarlo aqui
    name: { type: String, required: true },
    description: { type: String, required: false }, // A veces es opcional
    icon: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    profileId: { type: String, default: null },
    type: { type: String, enum: ['income', 'expense', 'both'], default: 'expense' },
}, { timestamps: true });

export const CategoryModel = mongoose.model("Category", CategorySchema, "Categories");

export class MongoCategoryRepository implements ICategoryRepository {


    async findAllAvailableForProfile(profileId: string): Promise<Category[]> {
        const docs = await CategoryModel.find({
            $or: [
                { profileId: null },          // Oficiales
                { profileId: { $exists: false } },
                { profileId: profileId }      // Del usuario
            ]
        }).lean().exec();

        return docs.map(doc => this.toDomain(doc));
    }

    async save(input: Category): Promise<Category> {
        // Usamos create, que guarda y devuelve el documento
        const doc = await CategoryModel.create({
            _id: input.id, // Forzamos el UUID que generaste en el Caso de Uso
            name: input.name,
            description: input.description,
            icon: input.icon,
            isActive: input.isActive,
            profileId: input.profileId ?? null,
            type: input.type
        });

        return this.toDomain(doc);
    }

    async findById(id: string): Promise<Category | null> {
        const doc = await CategoryModel.findById(id).lean().exec();
        return doc ? this.toDomain(doc) : null;
    }

    async delete(id: string): Promise<void> {
        await CategoryModel.findByIdAndDelete(id).exec();
    }

    // Helper privado para no repetir código
    private toDomain(doc: any): Category {
        return new Category(
            doc._id.toString(),
            doc.name,
            doc.description,
            doc.icon,
            doc.type,
            doc.isActive,
            doc.profileId,
            doc.createdAt,
            doc.updatedAt
        );
    }
}