"use client";

import React, { useState } from "react";
import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ExportTemplate } from "./types";

interface EmailExportProps {
  selectedTemplate: ExportTemplate | null;
  templates: ExportTemplate[];
  onSelectTemplate: (template: ExportTemplate) => void;
  onSend: (email: string) => void;
  isExporting: boolean;
  expenses: Expense[];
}

export function EmailExport({
  selectedTemplate,
  templates,
  onSelectTemplate,
  onSend,
  isExporting,
  expenses,
}: EmailExportProps) {
  const [email, setEmail] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState("Expense Report");
  const [message, setMessage] = useState(
    "Please find attached the expense report as requested."
  );
  const [includeAttachment, setIncludeAttachment] = useState(true);
  const [format, setFormat] = useState<"pdf" | "csv" | "xlsx">("pdf");

  const addRecipient = () => {
    if (email && email.includes("@") && !recipients.includes(email)) {
      setRecipients([...recipients, email]);
      setEmail("");
    }
  };

  const removeRecipient = (emailToRemove: string) => {
    setRecipients(recipients.filter((e) => e !== emailToRemove));
  };

  const handleSend = () => {
    if (recipients.length === 0 && email) {
      addRecipient();
    }
    const allRecipients = [...recipients, email].filter(Boolean);
    if (allRecipients.length > 0) {
      onSend(allRecipients.join(", "));
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Email Export</h3>
        <p className="text-sm text-gray-500 mt-1">
          Send expense reports directly to email
        </p>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Template
        </label>
        <div className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedTemplate?.id === template.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {template.icon} {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipients
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRecipient()}
            placeholder="Enter email address"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={addRecipient}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Add
          </button>
        </div>
        {recipients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {recipients.map((recipientEmail) => (
              <span
                key={recipientEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
              >
                {recipientEmail}
                <button
                  onClick={() => removeRecipient(recipientEmail)}
                  className="hover:bg-indigo-100 rounded-full p-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
      </div>

      {/* Attachment Options */}
      <div className="space-y-4 bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Include Attachment</div>
            <div className="text-sm text-gray-500">Attach the expense report file</div>
          </div>
          <button
            onClick={() => setIncludeAttachment(!includeAttachment)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              includeAttachment ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                includeAttachment ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {includeAttachment && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Attachment Format
            </label>
            <div className="flex gap-2">
              {[
                { value: "pdf", label: "PDF", icon: "📄" },
                { value: "csv", label: "CSV", icon: "📊" },
                { value: "xlsx", label: "Excel", icon: "📗" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value as "pdf" | "csv" | "xlsx")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    format === f.value
                      ? "bg-white border-2 border-indigo-500 text-indigo-700"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Preview */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Email Preview</span>
        </div>
        <div className="p-4 bg-white">
          <div className="text-sm space-y-2">
            <div className="flex">
              <span className="text-gray-500 w-16">To:</span>
              <span className="text-gray-900">
                {[...recipients, email].filter(Boolean).join(", ") || "No recipients"}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-16">Subject:</span>
              <span className="text-gray-900">{subject || "(No subject)"}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-700">{message}</p>
            {includeAttachment && (
              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg w-fit">
                <span className="text-xl">
                  {format === "pdf" ? "📄" : format === "csv" ? "📊" : "📗"}
                </span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    expense-report.{format}
                  </div>
                  <div className="text-xs text-gray-500">
                    {expenses.length} records • {formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={
          isExporting ||
          !selectedTemplate ||
          (recipients.length === 0 && !email.includes("@"))
        }
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </>
        )}
      </button>
    </div>
  );
}
