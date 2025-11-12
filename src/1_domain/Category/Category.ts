// domain/entities/Category.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  budgetLimit?: number;
  userId: string;
  parentCategoryId?: string;
  isActive: boolean;
  type: 'income' | 'expense';
  createdAt: Date;
}