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
        public id: string,
        public amount: number,
        public description: string,
        public category: Category,
        public date: Date,
        public paymentMethod: PaymentMethod,
        public userId: string, //usuario 
        public familyId?: string,
        public tags: string [] = [], //toca instanciar un array vacio
        public recurring: boolean = false,
        public recurrencePattern?: RecurrencePattern,
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
    this.userId = userId;
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