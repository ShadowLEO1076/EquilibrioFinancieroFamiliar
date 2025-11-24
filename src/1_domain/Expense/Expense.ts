import { Category } from "../Category/Category.js"; // Asumo la ruta

export enum PaymentMethod {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    TRANSFER = 'transfer',
    DIGITAL_WALLET = 'digital_wallet'
}

// USABLE A FUTURO
export interface RecurrencePattern {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
}

export class Expense {

    constructor(
        public id: string,            // Mongo ID
        public amount: number,
        public description: string,
        public categoryId: string,
        public date: Date,
        public paymentMethod: PaymentMethod,
        public profileId: string,
        public userId: string,        //AGREADO EL USERID MATE
        public isActive: boolean = true,
        // public recurring: boolean = false, 
        // public recurrencePattern?: RecurrencePattern,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
        // Validaciones de Dominio (Invariantes)
        if (amount <= 0) throw new Error('Expense amount must be greater than zero');
        if (!description) throw new Error('Description is required');

    }

    // --- MÉTODOS DE DOMINIO ---

    updateAmount(newAmount: number) {
        if (newAmount <= 0) throw new Error('New amount must be greater than zero');
        this.amount = newAmount;
        this.updatedAt = new Date();
    }

    // Método útil para corregir si te equivocaste de categoría
    changeCategory(newCategoryId: string) {
        this.categoryId = newCategoryId;
        this.updatedAt = new Date();
    }
}