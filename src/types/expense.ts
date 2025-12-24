export type ExpenseCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "shopping"
  | "bills"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // ISO date string
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  search: string;
  category: ExpenseCategory | "all";
  dateFrom: string;
  dateTo: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyExpenses: number;
  averageExpense: number;
  expenseCount: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  monthlyTrend: Array<{ month: string; amount: number }>;
}

export const EXPENSE_CATEGORIES: Record<
  ExpenseCategory,
  { label: string; color: string; icon: string }
> = {
  food: { label: "Food", color: "#ef4444", icon: "🍔" },
  transportation: { label: "Transportation", color: "#f59e0b", icon: "🚗" },
  entertainment: { label: "Entertainment", color: "#8b5cf6", icon: "🎬" },
  shopping: { label: "Shopping", color: "#ec4899", icon: "🛍️" },
  bills: { label: "Bills", color: "#0ea5e9", icon: "📄" },
  other: { label: "Other", color: "#6b7280", icon: "📦" },
};
