// Definimos los Value Objects primero para que el archivo esté ordenado
export interface BudgetPeriod {
    type: 'monthly' | 'weekly' | 'quarterly' | 'yearly';
    startDate: Date;
    endDate: Date;
}

export interface BudgetAlert {
    type: 'percentage' | 'amount';
    threshold: number;
    isTriggered: boolean;
}

export class Budget {
    constructor(
        public id: string,
        public profileId: string,     // Referencia al perfil dueño del presupuesto
        public categoryId: string,    // Ej: "Alimentación"
        public amount: number,        // El límite de gasto
        public period: BudgetPeriod,
        public spent: number = 0,     // Iniciamos en 0 por defecto
        public remaining: number = 0, // Lo calculamos abajo
        public alerts: BudgetAlert[] = [],
        public isActive: boolean = true,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
        // 🛡️ 1. Validaciones de Dominio (Invariantes)
        if (!profileId) {
            throw new Error("Budget must belong to a Profile (profileId is required)");
        }

        if (amount <= 0) {
            throw new Error("Budget amount must be greater than zero");
        }

        if (!period.startDate || !period.endDate) {
            throw new Error("Budget period must have start and end dates");
        }

        if (period.startDate >= period.endDate) {
            throw new Error("Start date must be before end date");
        }

        // . Lógica de Negocio Inicial
        // Si es nuevo, el restante es igual al total. 
        // Si ya venía con datos (desde la BD), respetamos lo que venga o recalculamos.
        if (spent === 0 && remaining === 0) {
            this.remaining = amount;
        } else {
            // Autocorrección por si acaso la BD viene rara
            this.remaining = amount - spent;
        }
    }

    // MÉTODOS DE DOMINIO LOGICA 

    // Registra un nuevo gasto en este presupuestoy actualiza el restante.

    public addExpense(expenseAmount: number): void {
        if (expenseAmount < 0) throw new Error("Cannot add negative expense");

        this.spent += expenseAmount;
        this.remaining = this.amount - this.spent;
        this.checkAlerts(); // Verificamos si saltó alguna alarma
        this.updatedAt = new Date();
    }

    public removeExpense(expenseAmount: number): void {
        if (expenseAmount < 0) throw new Error("Cannot remove negative expense");

        // Evitar números negativos locos
        if (this.spent - expenseAmount < 0) {
            this.spent = 0;
        } else {
            this.spent -= expenseAmount;
        }

        // Recalcular el restante
        this.remaining = this.amount - this.spent;

        // Re-verificar alertas (quizás ya no estamos en rojo)
        this.checkAlerts();
        this.updatedAt = new Date();
    }

    // Verifica si se ha superado algún umbral de alerta

    private checkAlerts(): void {
        const percentageSpent = (this.spent / this.amount) * 100;

        this.alerts.forEach(alert => {
            if (alert.type === 'percentage' && percentageSpent >= alert.threshold) {
                alert.isTriggered = true;
            }
            if (alert.type === 'amount' && this.spent >= alert.threshold) {
                alert.isTriggered = true;
            }
        });
    }
}