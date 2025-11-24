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
        public id: string,           // ID único (UUID)
        public amount: number,       // Cantidad
        public description: string,  // Descripción
        public categoryId: string,   // ID de la Categoría
        public date: Date,           // Fecha
        public incomeSource: IncomeType, // Tipo (Salario, Renta, etc.)
        public profileId: string,    // Perfil dueño (Dashboard)
        public userId: string,       // ¡AGREGADO! Dueño real (Seguridad/BD)
        public isActive: boolean = true,
        // public recurring: boolean = false, 
        // public recurrencePattern?: RecurrencePattern, 
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
        if (amount <= 0) throw new Error('Income amount must be greater than zero');
        if (!description) throw new Error('Description is required');
    }

    // --- MÉTODOS DE DOMINIO ---

    updateAmount(newAmount: number) {
        if (newAmount <= 0) throw new Error('New amount must be greater than zero');
        this.amount = newAmount;
        this.updatedAt = new Date();
    }

    // Método útil para cambiar el origen si te equivocaste
    changeSource(newSource: IncomeType) {
        this.incomeSource = newSource;
        this.updatedAt = new Date();
    }
}