"use client";

import React from "react";
import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ExportTemplate } from "./types";

interface TemplateSelectorProps {
  templates: ExportTemplate[];
  selectedTemplate: ExportTemplate | null;
  onSelect: (template: ExportTemplate) => void;
  onExport: (destination: string) => void;
  isExporting: boolean;
  connectedProviders: string[];
  expenses: Expense[];
}

export function TemplateSelector({
  templates,
  selectedTemplate,
  onSelect,
  onExport,
  isExporting,
  connectedProviders,
  expenses,
}: TemplateSelectorProps) {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Template Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Choose Export Template
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${
                selectedTemplate?.id === template.id
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              {/* Template Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ backgroundColor: `${template.color}15` }}
              >
                {template.icon}
              </div>

              <h4 className="font-semibold text-gray-900">{template.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {template.includeCharts && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Charts
                  </span>
                )}
                {template.groupBy && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Grouped
                  </span>
                )}
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {template.fields.length} fields
                </span>
              </div>

              {/* Selected indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Export Preview */}
      {selectedTemplate && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-xl">{selectedTemplate.icon}</span>
                {selectedTemplate.name}
              </h4>
              <p className="text-sm text-gray-500 mt-1">Ready to export</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{expenses.length}</div>
              <div className="text-xs text-gray-500">records</div>
            </div>
          </div>

          {/* Export Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-xs text-gray-500">Total Amount</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-lg font-semibold text-gray-900">
                {selectedTemplate.fields.length}
              </div>
              <div className="text-xs text-gray-500">Data Fields</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="text-lg font-semibold text-gray-900">
                ~{Math.round(expenses.length * 0.3)}KB
              </div>
              <div className="text-xs text-gray-500">File Size</div>
            </div>
          </div>

          {/* Quick Export Options */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Quick Export
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onExport("Download")}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={() => onExport("Clipboard")}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy to Clipboard
              </button>
            </div>

            {connectedProviders.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide pt-2">
                  Cloud Export
                </p>
                <div className="flex flex-wrap gap-2">
                  {connectedProviders.includes("google-drive") && (
                    <button
                      onClick={() => onExport("Google Drive")}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      🔷 Google Drive
                    </button>
                  )}
                  {connectedProviders.includes("google-sheets") && (
                    <button
                      onClick={() => onExport("Google Sheets")}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      📗 Google Sheets
                    </button>
                  )}
                  {connectedProviders.includes("dropbox") && (
                    <button
                      onClick={() => onExport("Dropbox")}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      📦 Dropbox
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Loading Overlay */}
          {isExporting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Exporting...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedTemplate && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-3">👆</div>
          <p>Select a template to get started</p>
        </div>
      )}
    </div>
  );
}
