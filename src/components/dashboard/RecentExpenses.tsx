"use client";

import React from "react";
import Link from "next/link";
import { Expense } from "@/types";
import { Card, CardHeader, CategoryBadge, Button } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = expenses.slice(0, 5);

  return (
    <Card>
      <CardHeader
        title="Recent Expenses"
        action={
          expenses.length > 5 ? (
            <Link href="/expenses">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          ) : null
        }
      />
      {recentExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No recent expenses
        </div>
      ) : (
        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CategoryBadge category={expense.category} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {expense.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(expense.date)}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 ml-4">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
