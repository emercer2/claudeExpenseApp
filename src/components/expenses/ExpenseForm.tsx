"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "@/components/ui";
import { Expense, ExpenseFormData, ExpenseCategory, EXPENSE_CATEGORIES } from "@/types";
import { formatDateInput } from "@/lib/utils";

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  initialData?: Expense;
  isSubmitting?: boolean;
}

const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(
  ([value, { label, icon }]) => ({
    value,
    label: `${icon} ${label}`,
  })
);

interface FormErrors {
  amount?: string;
  category?: string;
  description?: string;
  date?: string;
}

export function ExpenseForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: "",
    category: "food",
    description: "",
    date: formatDateInput(new Date()),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        category: initialData.category,
        description: initialData.description,
        date: initialData.date,
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = "Amount must be a positive number";
    } else if (amount > 1000000) {
      newErrors.amount = "Amount cannot exceed $1,000,000";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = "Date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      amount: true,
      category: true,
      description: true,
      date: true,
    });

    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.amount ? errors.amount : undefined}
          icon={
            <span className="text-gray-500 font-medium">$</span>
          }
        />

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.date ? errors.date : undefined}
          max={formatDateInput(new Date())}
        />
      </div>

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        onBlur={handleBlur}
        options={categoryOptions}
        error={touched.category ? errors.category : undefined}
      />

      <Input
        label="Description"
        name="description"
        type="text"
        placeholder="What did you spend on?"
        value={formData.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description ? errors.description : undefined}
      />

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
