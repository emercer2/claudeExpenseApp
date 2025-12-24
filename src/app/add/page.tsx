"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useExpenses } from "@/context";
import { ExpenseForm } from "@/components/expenses";
import { Card, CardHeader } from "@/components/ui";
import { ExpenseFormData } from "@/types";

export default function AddExpensePage() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (data: ExpenseFormData) => {
    setIsSubmitting(true);

    // Simulate a slight delay for UX
    setTimeout(() => {
      addExpense(data);
      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset success message and redirect after a short delay
      setTimeout(() => {
        router.push("/expenses");
      }, 1500);
    }, 300);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
        <p className="text-gray-500 mt-1">
          Record a new expense to track your spending
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-success-50 border border-success-500/20 rounded-lg px-4 py-3 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-success-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-success-600 font-medium">
            Expense added successfully! Redirecting...
          </span>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader
          title="Expense Details"
          subtitle="Fill in the information below"
        />
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>

      {/* Tips */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>
              Use descriptive names to easily find expenses later
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>
              Categorize expenses to get insights on your spending patterns
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>
              Record expenses as soon as possible to keep accurate records
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
