import { v4 as uuidv4 } from 'uuid';
import { Expense, PaymentMethod } from "../../../1_domain/Expense/Expense.js";
import { IExpenseRepository } from "../../../1_domain/Expense/IExpenseRepository.js";
import { IProfileRepository } from "../../../1_domain/Profile/IProfileRepository.js";
import { IUserRepository } from "../../../1_domain/Users/IUserRepository.js";
import { ICategoryRepository } from "../../../1_domain/Category/ICategoryRepository.js";

export interface CreateExpenseInput {
    amount: number;
    description: string;
    categoryId: string;
    date: Date;
    paymentMethod: PaymentMethod;
    profileId: string;
    // userId se pasa aparte en el execute o puede venir aquí, 
    // pero en el controller lo pasas como segundo argumento.
    // Ajustaré el execute para recibir userId.
}

export class ExpenseUseCaseSave {

    constructor(
        private readonly expenseRepo: IExpenseRepository,
        private readonly profileRepo: IProfileRepository,
        private readonly userRepo: IUserRepository,
        private readonly categoryRepo: ICategoryRepository
    ) { }

    async execute(input: CreateExpenseInput, userId: string): Promise<Expense> {

        // 1. Validar existencias
        const profile = await this.profileRepo.findById(input.profileId);
        if (!profile) throw new Error("Profile not found");

        const user = await this.userRepo.findById(userId);
        if (!user) throw new Error("User not found");

        const category = await this.categoryRepo.findById(input.categoryId);
        if (!category) throw new Error("Category not found");

        // 2. Generar ID
        const newId = uuidv4();

        // 3. Crear Entidad
        const expense = new Expense(
            newId,
            input.amount,
            input.description,
            input.categoryId,
            input.date,
            input.paymentMethod,
            input.profileId,
            userId
        );

        // 4. Guardar
        return await this.expenseRepo.save(expense);
    }
}