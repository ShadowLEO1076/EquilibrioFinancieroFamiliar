// objeto de valor para el identificador único de un presupuesto
export class BudgetId {
    private readonly id: string;   
    constructor(id: string) {
        this.id = id;
    }

    toString(): string {
        return this.id;
    }
    // aquí puedes agregar más métodos relacionados con la lógica del identificador si es necesario
}