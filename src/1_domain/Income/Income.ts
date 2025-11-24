export enum IncomeType {
    SALARY = "salary",
    BONUS = "bonus",
    FREELANCE = "freelance",
    BUSINESS = "business",
    DIVIDEND = "dividend",
    INTEREST = "interest",
    RENT = "rent",
    ROYALTY = "royalty",
    OTHER = "other"
}

export class Income {

    constructor(
        public id: string, // id único de mongo
        public amount: number, // cantidad de dinero ingresada
        public description: string, // descripción del ingreso
        public categoryId: string, // categoría de ingresos
        public date: Date, 
        public incomeSource: IncomeType, // tipo de pago o ingreso
        public profileId: string, // perfil del usuario
        public isActive: boolean = true,
        // public recurring: boolean = false, // opcional futuro
        // public recurrencePattern?: RecurrencePattern, // opcional futuro
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
        if (amount <= 0) throw new Error('Income amount must be greater than zero');

        this.id = id;
        this.amount = amount;
        this.description = description;
        this.categoryId = categoryId;
        this.date = date;
        this.incomeSource = incomeSource;
        this.profileId = profileId;
        // this.recurring = recurring;
        // this.recurrencePattern = recurrencePattern;
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
    }

    // Permite actualizar el monto del ingreso
    updateAmount(newAmount: number) {
        if (newAmount <= 0) throw new Error('New amount must be greater than zero');
        this.amount = newAmount;
        this.updatedAt = new Date();
    }
}