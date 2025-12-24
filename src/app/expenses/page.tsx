"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useExpenses } from "@/context";
import { ExpenseList, ExpenseFilters } from "@/components/expenses";
import { Card, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { exportToCSV } from "@/lib/utils";

export default function ExpensesPage() {
  const {
    expenses,
    filteredExpenses,
    filters,
    setFilters,
    resetFilters,
    updateExpense,
    deleteExpense,
    isLoading,
  } = useExpenses();

  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  const handleExport = () => {
    const toExport = hasActiveFilters ? filteredExpenses : expenses;
    if (toExport.length > 0) {
      exportToCSV(toExport);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-16 bg-gray-200 rounded-xl" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredTotal = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Expenses</h1>
          <p className="text-gray-500 mt-1">
            {filteredExpenses.length} expense
            {filteredExpenses.length !== 1 ? "s" : ""}
            {hasActiveFilters && ` (filtered from ${expenses.length})`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={filteredExpenses.length === 0}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export {hasActiveFilters ? "Filtered" : "All"}
          </Button>
          <Link href="/add">
            <Button>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <ExpenseFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
        />
      </Card>

      {/* Summary Bar */}
      {filteredExpenses.length > 0 && (
        <div className="bg-primary-50 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-primary-700">
            Showing {filteredExpenses.length} expense
            {filteredExpenses.length !== 1 ? "s" : ""}
          </span>
          <span className="text-sm font-semibold text-primary-900">
            Total: {formatCurrency(filteredTotal)}
          </span>
        </div>
      )}

      {/* Expense List */}
      <ExpenseList
        expenses={filteredExpenses}
        onEdit={updateExpense}
        onDelete={deleteExpense}
        isFiltered={hasActiveFilters}
      />
    </div>
  );
}
