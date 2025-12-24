"use client";

import React from "react";
import { Input, Select, Button } from "@/components/ui";
import { ExpenseFilters as FiltersType, EXPENSE_CATEGORIES } from "@/types";

interface ExpenseFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: Partial<FiltersType>) => void;
  onReset: () => void;
}

const categoryOptions = [
  { value: "all", label: "All Categories" },
  ...Object.entries(EXPENSE_CATEGORIES).map(([value, { label, icon }]) => ({
    value,
    label: `${icon} ${label}`,
  })),
];

export function ExpenseFilters({
  filters,
  onFilterChange,
  onReset,
}: ExpenseFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />

        <Select
          value={filters.category}
          onChange={(e) =>
            onFilterChange({ category: e.target.value as FiltersType["category"] })
          }
          options={categoryOptions}
        />

        <Input
          type="date"
          placeholder="From date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
        />

        <Input
          type="date"
          placeholder="To date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange({ dateTo: e.target.value })}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onReset}>
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
