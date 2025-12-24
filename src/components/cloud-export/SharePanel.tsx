"use client";

import React, { useState, useEffect } from "react";
import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ExportTemplate } from "./types";

interface SharePanelProps {
  expenses: Expense[];
  selectedTemplate: ExportTemplate | null;
  templates: ExportTemplate[];
  onSelectTemplate: (template: ExportTemplate) => void;
}

export function SharePanel({
  expenses,
  selectedTemplate,
  templates,
  onSelectTemplate,
}: SharePanelProps) {
  const [shareLink, setShareLink] = useState("");
  const [expiresIn, setExpiresIn] = useState("7");
  const [isPublic, setIsPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateShareLink = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const id = Math.random().toString(36).slice(2, 10);
      setShareLink(`https://share.expense-tracker.app/${id}`);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Share & Collaborate</h3>
        <p className="text-sm text-gray-500 mt-1">
          Generate shareable links or QR codes for your expense reports
        </p>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Template
        </label>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                selectedTemplate?.id === template.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{template.icon}</span>
                <span className="font-medium text-sm text-gray-900">{template.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Share Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link Expires In
          </label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <div className="font-medium text-gray-900">Public Access</div>
            <div className="text-sm text-gray-500">Anyone with the link can view</div>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isPublic ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isPublic ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg">Expense Report</h4>
            <p className="text-white/80 text-sm">
              {selectedTemplate?.name || "Select a template"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{expenses.length}</div>
            <div className="text-white/70 text-xs">records</div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <div className="text-white/70 text-xs">Total Amount</div>
            <div className="font-bold text-lg">{formatCurrency(totalAmount)}</div>
          </div>
          <div className="text-right">
            <div className="text-white/70 text-xs">Created</div>
            <div className="font-medium">Today</div>
          </div>
        </div>
      </div>

      {/* Generate Link */}
      {!shareLink ? (
        <button
          onClick={generateShareLink}
          disabled={isGenerating || !selectedTemplate}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating Link...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Generate Share Link
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          {/* Link Display */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-green-700">Link Active</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-600"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">📱</span>
              <span className="text-xs font-medium text-gray-700">QR Code</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-2xl">📧</span>
              <span className="text-xs font-medium text-gray-700">Email</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-2xl">💬</span>
              <span className="text-xs font-medium text-gray-700">Slack</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-2xl">📋</span>
              <span className="text-xs font-medium text-gray-700">Embed</span>
            </button>
          </div>

          {/* QR Code Display */}
          {showQR && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                {/* Simulated QR Code */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${
                        Math.random() > 0.5 ? "bg-gray-900" : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">Scan to view expense report</p>
            </div>
          )}

          {/* New Link Button */}
          <button
            onClick={() => setShareLink("")}
            className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Generate New Link
          </button>
        </div>
      )}
    </div>
  );
}
