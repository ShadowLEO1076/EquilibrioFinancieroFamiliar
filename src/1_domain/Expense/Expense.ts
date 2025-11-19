import { Category } from "../Category/Category.js";

export enum PaymentMethod{

    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    TRANSFER = 'transefer',
    DIGITAL_WALLET = 'digital_wallet'
}

export interface RecurrencePattern{
    type: 'daily'| 'weekly' | 'monthly';
    interval: number;
    endDate?: Date; 
}

export class Expense {

    constructor(
        public id: string, //id único de mongo
        public amount: number, //cantidad del gasto
        public description: string, //qué se hizo para que suceda el gasto
        public category: Category, //categorias de pagos
        public date: Date,
        public paymentMethod: PaymentMethod, //tipo de pago, toca ver si dejamos los de aquí o no.
        public profileId: string, //perfil de un usuario 
        public familyId?: string, //si el perfil es parte de una familia
        public tags: string [] = [], //toca instanciar un array vacio, aquí va algunas tagas... Lo voy a quitar.
        public recurring: boolean = false, //podemos cambairlo, pero no es necesario
        public recurrencePattern?: RecurrencePattern, //mismo principio de antes
        public createdAt?: Date,    
        public updatedAt?: Date
    ){

     if (amount <= 0) throw new Error('Expense amount must be greater than zero');

    this.id = id;
    this.amount = amount;
    this.description = description;
    this.category = category;
    this.date = date;
    this.paymentMethod = paymentMethod;
    this.profileId = profileId;
    this.familyId = familyId;
    this.tags = tags;
    this.recurring = recurring;
    this.recurrencePattern = recurrencePattern;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    }

    //usar para modificar los datos, ¿o lo puedo mandar al servicio?
    updateAmount(newAmount: number) {
    if (newAmount <= 0) throw new Error('New amount must be greater than zero');
    this.amount = newAmount;
    this.updatedAt = new Date();
     }

    //añadir tags, no las elimina, solo añade nuevas.
    addTag(tag: string) {
    if (!this.tags.includes(tag)) this.tags.push(tag);
    this.updatedAt = new Date();
  }

}