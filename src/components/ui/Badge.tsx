"use client";

import React from "react";
import { ExpenseCategory, EXPENSE_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";

interface BadgeProps {
  category: ExpenseCategory;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "md" }: BadgeProps) {
  const { label, color, icon } = EXPENSE_CATEGORIES[category];

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizes[size]
      )}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
