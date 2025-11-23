import { Category } from "../Category/Category.js";

export enum PaymentMethod{
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    TRANSFER = 'transefer',
    DIGITAL_WALLET = 'digital_wallet'
}

//USABLE A FUTURO, no implmentar
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
        public recurring: boolean = false, //podemos cambairlo, pero no es necesario
        //public recurrencePattern?: RecurrencePattern, //POR AHORA, NO PONERLO
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
    this.recurring = recurring;
    //this.recurrencePattern = recurrencePattern;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    }

    //usar para modificar los datos, ¿o lo puedo mandar al servicio?
    updateAmount(newAmount: number) {
    if (newAmount <= 0) throw new Error('New amount must be greater than zero');
    this.amount = newAmount;
    this.updatedAt = new Date();
     }
 }
