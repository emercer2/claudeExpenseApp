"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

type ExportFormat = "csv" | "json" | "pdf";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

interface ExportFilters {
  dateFrom: string;
  dateTo: string;
  categories: ExpenseCategory[];
}

export function ExportModal({ isOpen, onClose, expenses }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [filename, setFilename] = useState(`expenses-${format(new Date(), "yyyy-MM-dd")}`);
  const [filters, setFilters] = useState<ExportFilters>({
    dateFrom: "",
    dateTo: "",
    categories: [],
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Filter expenses based on selected criteria
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
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

  // Calculate export summary
  const exportSummary = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryCount = new Set(filteredExpenses.map((exp) => exp.category)).size;
    return {
      recordCount: filteredExpenses.length,
      totalAmount: total,
      categoryCount,
    };
  }, [filteredExpenses]);

  const toggleCategory = (category: ExpenseCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const selectAllCategories = () => {
    setFilters((prev) => ({
      ...prev,
      categories: Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[],
    }));
  };

  const clearAllCategories = () => {
    setFilters((prev) => ({ ...prev, categories: [] }));
  };

  const resetFilters = () => {
    setFilters({ dateFrom: "", dateTo: "", categories: [] });
  };

  // Export functions
  const exportAsCSV = useCallback(() => {
    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = filteredExpenses.map((expense) => [
      formatDate(expense.date),
      EXPENSE_CATEGORIES[expense.category].label,
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.amount.toFixed(2),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
  }, [filteredExpenses, filename]);

  const exportAsJSON = useCallback(() => {
    const jsonData = filteredExpenses.map((expense) => ({
      date: expense.date,
      category: expense.category,
      categoryLabel: EXPENSE_CATEGORIES[expense.category].label,
      description: expense.description,
      amount: expense.amount,
    }));

    const jsonContent = JSON.stringify(jsonData, null, 2);
    downloadFile(jsonContent, `${filename}.json`, "application/json");
  }, [filteredExpenses, filename]);

  const exportAsPDF = useCallback(() => {
    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Expense Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px; }
            .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .summary-item { display: inline-block; margin-right: 40px; }
            .summary-label { color: #64748b; font-size: 12px; }
            .summary-value { font-size: 24px; font-weight: bold; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #0ea5e9; color: white; padding: 12px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
            .amount { text-align: right; font-weight: 600; }
            .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Expense Report</h1>
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Total Records</div>
              <div class="summary-value">${exportSummary.recordCount}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Amount</div>
              <div class="summary-value">${formatCurrency(exportSummary.totalAmount)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Categories</div>
              <div class="summary-value">${exportSummary.categoryCount}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredExpenses
                .map(
                  (expense) => `
                <tr>
                  <td>${formatDate(expense.date)}</td>
                  <td>${EXPENSE_CATEGORIES[expense.category].icon} ${EXPENSE_CATEGORIES[expense.category].label}</td>
                  <td>${expense.description}</td>
                  <td class="amount">${formatCurrency(expense.amount)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="footer">
            Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")} | Expense Tracker
          </div>
        </body>
      </html>
    `;

    // Open print dialog for PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }, [filteredExpenses, exportSummary]);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) return;

    setIsExporting(true);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    switch (exportFormat) {
      case "csv":
        exportAsCSV();
        break;
      case "json":
        exportAsJSON();
        break;
      case "pdf":
        exportAsPDF();
        break;
    }

    setIsExporting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Export Data</h2>
              <p className="text-primary-100 text-sm mt-0.5">
                Configure and export your expense data
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Filters */}
              <div className="lg:col-span-2 space-y-6">
                {/* Export Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "csv", label: "CSV", icon: "📊", desc: "Spreadsheet" },
                      { value: "json", label: "JSON", icon: "📋", desc: "Data format" },
                      { value: "pdf", label: "PDF", icon: "📄", desc: "Document" },
                    ].map((format) => (
                      <button
                        key={format.value}
                        onClick={() => setExportFormat(format.value as ExportFormat)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          exportFormat === format.value
                            ? "border-primary-500 bg-primary-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-2xl mb-1">{format.icon}</div>
                        <div className="font-semibold text-gray-900">{format.label}</div>
                        <div className="text-xs text-gray-500">{format.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Categories
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllCategories}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={clearAllCategories}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(EXPENSE_CATEGORIES).map(([key, { label, icon, color }]) => {
                      const isSelected = filters.categories.includes(key as ExpenseCategory);
                      return (
                        <button
                          key={key}
                          onClick={() => toggleCategory(key as ExpenseCategory)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          style={isSelected ? { backgroundColor: color } : {}}
                        >
                          <span>{icon}</span>
                          <span>{label}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {filters.categories.length === 0
                      ? "All categories will be exported"
                      : `${filters.categories.length} categor${filters.categories.length === 1 ? "y" : "ies"} selected`}
                  </p>
                </div>

                {/* Filename */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filename
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter filename"
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500 text-sm">
                      .{exportFormat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary & Preview */}
              <div className="space-y-4">
                {/* Export Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Export Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Records</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {exportSummary.recordCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Total Amount</span>
                      <span className="text-lg font-semibold text-primary-600">
                        {formatCurrency(exportSummary.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Categories</span>
                      <span className="text-lg font-semibold text-gray-700">
                        {exportSummary.categoryCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview Toggle */}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showPreview ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>

                {/* Reset Filters */}
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            </div>

            {/* Preview Table */}
            {showPreview && (
              <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Data Preview (showing first 10 records)
                  </h3>
                </div>
                <div className="max-h-64 overflow-auto">
                  {filteredExpenses.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      No records match your filters
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Description
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredExpenses.slice(0, 10).map((expense) => (
                          <tr key={expense.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {formatDate(expense.date)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${EXPENSE_CATEGORIES[expense.category].color}15`,
                                  color: EXPENSE_CATEGORIES[expense.category].color,
                                }}
                              >
                                {EXPENSE_CATEGORIES[expense.category].icon}
                                {EXPENSE_CATEGORIES[expense.category].label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                              {expense.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {filteredExpenses.length > 10 && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
                    + {filteredExpenses.length - 10} more records
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={filteredExpenses.length === 0 || isExporting}
              className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all flex items-center gap-2 ${
                filteredExpenses.length === 0 || isExporting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
              }`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export {exportSummary.recordCount} Records
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
