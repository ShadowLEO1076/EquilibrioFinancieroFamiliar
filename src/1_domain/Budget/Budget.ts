import { } from "./Budget.js";

export class Budget {
    id: string;
    userId: string;
    categoryId: string;
    amount: number;
    period: BudgetPeriod;
    spent: number;
    remaining: number;
    alerts: BudgetAlert[];
    isActive: boolean;
    createdAt: Date;


  constructor( id: string, userId: string, categoryId: string, amount: number, period: BudgetPeriod,
    spent: number = 0, remaining: number = 0, alerts: BudgetAlert[] = [],
    isActive: boolean = true, createdAt: Date = new Date())
    {
        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.period = period;
        this.spent = spent;
        this.remaining = remaining;
        this.alerts = alerts;
        this.isActive = isActive;
        this.createdAt = createdAt;

    }
  
    // aquí coloca tus validaciones
    // aquí coloca el cálculo de remaining si es necesario
}
  
  // aquí coloca tus métodos de dominio

//lo de abajo es para definir tipos complejos usados en Budget
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