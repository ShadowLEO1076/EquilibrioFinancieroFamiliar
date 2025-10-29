//aquí tendremos los esquemas y las implementaciones de los repositorio,
//primero importamos todo lo necesario
import mongoose from "mongoose";
import type {IUserRepository} from "../../../1_domain/Users/IUserRepository.js";
import {User} from "../../../1_domain/Users/User.js";

//schema de preferencias
const userPreferenceSchema = new mongoose.Schema({
  monthlyBudget: Number,
  alertThreshold: Number,
  defaultCurrency: String,
  reportsFrequency: String
});

//schema de usuario
const userSchema = new mongoose.Schema({

    id: String,
    email: String,
    name: String,
    currency: String,
    language: String,
    timezone: String,
    preferences: userPreferenceSchema,
    isActive: Boolean,
    familyId: String,
    createdAt: Date,
    updatedAt: Date
});

//creamos un modelo, según la documentación de Mongo, un modelo compila un esquema
//el primer parámetro busca en la base de datos, el segundo se encarga debe de asegurar
//la integridad del archivo,el tercer parámetro crea la coleción en la base de datos.
const userModel = mongoose.model('User', userSchema, 'users');

export class MongoUserRepository implements IUserRepository{

    async save(user: User): Promise<User> {
        //creo mi modelo
        const newUser = new userModel(user);
        //llamamos a save
        const saved = await newUser.save();
        //retornamos la entidad guardada
        return this.toDomain(saved);
    }

    //busca por Id, pero no el _id de Mongo, nuestro id.
    async findById(id: string): Promise<User | null> {

      //halla un dato usando una de las variables del esquema
      //lean permite convertir el modelo en un objeto TS/Js
        const userFound = await userModel.findOne({id}).lean();

        return this.toDomain(userFound);
    }

    async update(user: User): Promise<User> {
      //busca el objeto: por id, el nuevo objeto se llama user/o usa user, y nos devuelve
      //la nueva versión del objeto
       let update = await userModel.
       findOneAndUpdate({id: user.id}, user, {new: true})
       .lean();

       return this.toDomain(update);
    }

    async delete(id: string): Promise<void> {
      //eliminar, pero usando la id perosnal, no la de mongo
        let deleted = await userModel.deleteOne({id}).lean();

         if (deleted.deletedCount === 0) {
             throw new Error('Usuario con id ${id} no encontrado');
         }
    }

    //función que transforma de nuestro Model a la entidad User
     private toDomain(doc: any): User {
      return new User(
      doc.id,
      doc.email,
      doc.name,
      doc.currency,
      doc.language,
      doc.timezone,
      doc.preferences,
      doc.isActive,
      doc.familyId,
      doc.createdAt,
      doc.updatedAt
    );
  }
}