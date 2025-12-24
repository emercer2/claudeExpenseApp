"use client";

import React from "react";
import { Expense, ExpenseFormData } from "@/types";
import { ExpenseItem } from "./ExpenseItem";
import { EmptyState, Button } from "@/components/ui";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string, data: ExpenseFormData) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void;
  isFiltered?: boolean;
}

export function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  onAddNew,
  isFiltered = false,
}: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title={isFiltered ? "No matching expenses" : "No expenses yet"}
        description={
          isFiltered
            ? "Try adjusting your filters to see more results."
            : "Start tracking your spending by adding your first expense."
        }
        icon={
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
        }
        action={
          !isFiltered && onAddNew ? (
            <Button onClick={onAddNew}>Add Your First Expense</Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
