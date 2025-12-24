"use client";

import React, { useState } from "react";
import { Expense, ExpenseFormData } from "@/types";
import { Button, CategoryBadge, Modal } from "@/components/ui";
import { ExpenseForm } from "./ExpenseForm";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (id: string, data: ExpenseFormData) => void;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (data: ExpenseFormData) => {
    onEdit(expense.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(expense.id);
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="hidden sm:block">
            <CategoryBadge category={expense.category} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-900 font-medium truncate">
              {expense.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                {formatDate(expense.date)}
              </span>
              <span className="sm:hidden">
                <CategoryBadge category={expense.category} size="sm" />
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(expense.amount)}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              aria-label="Edit expense"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleting(true)}
              aria-label="Delete expense"
            >
              <svg
                className="w-4 h-4 text-danger-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Expense"
      >
        <ExpenseForm
          initialData={expense}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Expense"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </p>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium text-gray-900">{expense.description}</p>
            <p className="text-sm text-gray-500">
              {formatCurrency(expense.amount)} on {formatDate(expense.date)}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
