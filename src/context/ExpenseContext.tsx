"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Expense,
  ExpenseFormData,
  ExpenseFilters,
  ExpenseSummary,
  ExpenseCategory,
} from "@/types";
import {
  getExpenses,
  saveExpenses,
  deleteExpense as deleteExpenseFromStorage,
} from "@/lib/storage";
import { calculateSummary } from "@/lib/utils";
import { parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  filters: ExpenseFilters;
  summary: ExpenseSummary;
  isLoading: boolean;
  addExpense: (data: ExpenseFormData) => void;
  updateExpense: (id: string, data: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ExpenseFilters = {
  search: "",
  category: "all",
  dateFrom: "",
  dateTo: "",
};

const defaultSummary: ExpenseSummary = {
  totalExpenses: 0,
  monthlyExpenses: 0,
  averageExpense: 0,
  expenseCount: 0,
  categoryBreakdown: {
    food: 0,
    transportation: 0,
    entertainment: 0,
    shopping: 0,
    bills: 0,
    other: 0,
  },
  monthlyTrend: [],
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFiltersState] = useState<ExpenseFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const stored = getExpenses();
    setExpenses(stored);
    setIsLoading(false);
  }, []);

  // Filter expenses based on current filters
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((expense) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== "all" && expense.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const expenseDate = parseISO(expense.date);
        if (filters.dateFrom && filters.dateTo) {
          const start = startOfDay(parseISO(filters.dateFrom));
          const end = endOfDay(parseISO(filters.dateTo));
          if (!isWithinInterval(expenseDate, { start, end })) return false;
        } else if (filters.dateFrom) {
          const start = startOfDay(parseISO(filters.dateFrom));
          if (expenseDate < start) return false;
        } else if (filters.dateTo) {
          const end = endOfDay(parseISO(filters.dateTo));
          if (expenseDate > end) return false;
        }
      }

      return true;
    });
  }, [expenses, filters]);

  // Calculate summary
  const summary = React.useMemo(() => {
    return calculateSummary(expenses);
  }, [expenses]);

  const addExpense = useCallback((data: ExpenseFormData) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: uuidv4(),
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      date: data.date,
      createdAt: now,
      updatedAt: now,
    };

    setExpenses((prev) => {
      const updated = [newExpense, ...prev];
      saveExpenses(updated);
      return updated;
    });
  }, []);

  const updateExpense = useCallback((id: string, data: ExpenseFormData) => {
    setExpenses((prev) => {
      const updated = prev.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              amount: parseFloat(data.amount),
              category: data.category,
              description: data.description,
              date: data.date,
              updatedAt: new Date().toISOString(),
            }
          : expense
      );
      saveExpenses(updated);
      return updated;
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const updated = prev.filter((expense) => expense.id !== id);
      saveExpenses(updated);
      return updated;
    });
  }, []);

  const setFilters = useCallback((newFilters: Partial<ExpenseFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        filters,
        summary,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
