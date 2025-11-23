//aquí tendremos los esquemas y las implementaciones de los repositorio,
//primero importamos todo lo necesario
import mongoose from "mongoose";
import type {IUserRepository} from "../../../1_domain/Users/IUserRepository.js";
import {User} from "../../../1_domain/Users/User.js";

//schema de preferencias
//pasar a PROFILE
/*
const userPreferenceSchema = new mongoose.Schema({
  monthlyBudget: Number,
  alertThreshold: Number,
  defaultCurrency: String,
  reportsFrequency: String
});
*/
//schema de usuario
const userSchema = new mongoose.Schema({

    id: String,
    email: {
      type: String,
      unique: true
    },
    username:{
      type: String,
      unique: true
    },
    password: String,
    //currency: String,
    language: String,
    timezone: String,
   // preferences: userPreferenceSchema,
    isActive: Boolean,
    //familyId: String,
    createdAt: Date,
    updatedAt: Date
});

//creamos un modelo, según la documentación de Mongo, un modelo compila un esquema
//el primer parámetro busca en la base de datos, el segundo se encarga debe de asegurar
//la integridad del archivo,el tercer parámetro crea la colección en la base de datos.
const userModel = mongoose.model('User', userSchema, 'users');

export class MongoUserRepository implements IUserRepository{

    async findByEmail(userEmail: string): Promise<User | null> {
    
      let user = await userModel.findOne({email: userEmail}).lean();
      if(!user) return null;

      return this.toDomain(user);
   }

    async save(user: User): Promise<User> {

        //todo: asegurar que el correo y el nombre de usuario no este siendo usado al crear un nuevo usuario usuario.--COMPLETADO
        //tod: crear verificaciones separas, el usuario o nosotros queremos saber si el usuario o el correo está en uso.
        let verificarEmailNameUser = await userModel.findOne({
          $or: [{
            email: user.email,
            name: user.username
            }
          ],
        })

        if(verificarEmailNameUser){
          throw new Error ("El correo o el nombre de usuario ya están en uso.");
        }

        //creo mi modelo
        const newUser = new userModel(user);
        //llamamos a save
        const saved = await newUser.save();
        //retornamos la entidad guardada
        return this.toDomain(saved);
    }

    //buscar por id de mongo, es sencillo y seguro.
    async findById(id: string): Promise<User | null> {

      //halla un dato usando una de las variables del esquema
      //lean permite convertir el modelo en un objeto TS/Js
      try{
        const userFound = await userModel.findOne({ _id: id }).lean().exec();

        return this.toDomain(userFound);
      }
      catch{
        throw new Error("User not found.")
      }
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
      doc._id.toString(),
      doc.email,
      doc.username,
      doc.password,
      //doc.currency,
      doc.language,
      doc.timezone,
      //doc.preferences,
      doc.isActive,
     // doc.familyId,
      doc.createdAt,
      doc.updatedAt
    );
  }
}