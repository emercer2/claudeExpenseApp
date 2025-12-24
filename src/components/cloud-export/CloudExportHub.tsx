"use client";

import React, { useState, useEffect } from "react";
import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  EXPORT_TEMPLATES,
  CLOUD_PROVIDERS,
  ExportTemplate,
  CloudProvider,
  ExportHistoryItem,
  ScheduledExport,
} from "./types";
import { TemplateSelector } from "./TemplateSelector";
import { CloudIntegrations } from "./CloudIntegrations";
import { SharePanel } from "./SharePanel";
import { ExportHistory } from "./ExportHistory";
import { SchedulePanel } from "./SchedulePanel";
import { EmailExport } from "./EmailExport";

type Tab = "templates" | "integrations" | "share" | "history" | "schedule" | "email";

interface CloudExportHubProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export function CloudExportHub({ isOpen, onClose, expenses }: CloudExportHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([]);
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Load mock data on mount
  useEffect(() => {
    // Simulate some connected providers
    setConnectedProviders(["google-drive"]);

    // Simulate export history
    setExportHistory([
      {
        id: "1",
        template: "Monthly Summary",
        destination: "Google Drive",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        recordCount: 45,
        fileSize: "12 KB",
        status: "completed",
        shareLink: "https://share.expense-tracker.app/abc123",
      },
      {
        id: "2",
        template: "Tax Report",
        destination: "Email",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        recordCount: 120,
        fileSize: "28 KB",
        status: "completed",
      },
      {
        id: "3",
        template: "Full Export",
        destination: "Dropbox",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        recordCount: 89,
        fileSize: "18 KB",
        status: "failed",
      },
    ]);

    // Simulate scheduled exports
    setScheduledExports([
      {
        id: "1",
        template: "Monthly Summary",
        destination: "Google Drive",
        frequency: "monthly",
        nextRun: new Date(Date.now() + 604800000).toISOString(),
        enabled: true,
      },
    ]);
  }, []);

  const handleConnectProvider = (providerId: string) => {
    // Simulate OAuth flow
    setIsExporting(true);
    setTimeout(() => {
      setConnectedProviders((prev) =>
        prev.includes(providerId)
          ? prev.filter((p) => p !== providerId)
          : [...prev, providerId]
      );
      setIsExporting(false);
      setExportSuccess(
        connectedProviders.includes(providerId)
          ? `Disconnected from ${CLOUD_PROVIDERS.find((p) => p.id === providerId)?.name}`
          : `Connected to ${CLOUD_PROVIDERS.find((p) => p.id === providerId)?.name}!`
      );
      setTimeout(() => setExportSuccess(null), 3000);
    }, 1500);
  };

  const handleExport = (destination: string) => {
    if (!selectedTemplate) return;

    setIsExporting(true);
    setTimeout(() => {
      const newExport: ExportHistoryItem = {
        id: Date.now().toString(),
        template: selectedTemplate.name,
        destination,
        timestamp: new Date().toISOString(),
        recordCount: expenses.length,
        fileSize: `${Math.round(expenses.length * 0.3)} KB`,
        status: "completed",
        shareLink: `https://share.expense-tracker.app/${Math.random().toString(36).slice(2, 10)}`,
      };
      setExportHistory((prev) => [newExport, ...prev]);
      setIsExporting(false);
      setExportSuccess(`Exported to ${destination} successfully!`);
      setTimeout(() => setExportSuccess(null), 3000);
    }, 2000);
  };

  const handleScheduleExport = (schedule: Omit<ScheduledExport, "id">) => {
    const newSchedule: ScheduledExport = {
      ...schedule,
      id: Date.now().toString(),
    };
    setScheduledExports((prev) => [...prev, newSchedule]);
    setExportSuccess("Export scheduled successfully!");
    setTimeout(() => setExportSuccess(null), 3000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "templates", label: "Templates", icon: "📋" },
    { id: "integrations", label: "Integrations", icon: "🔗" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "share", label: "Share", icon: "🔗" },
    { id: "schedule", label: "Schedule", icon: "⏰" },
    { id: "history", label: "History", icon: "📜" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl transform transition-transform duration-500 ease-out">
          <div className="flex h-full flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-8">
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        ☁️
                      </span>
                      Cloud Export Hub
                    </h2>
                    <p className="mt-2 text-white/80 text-sm">
                      Export, share, and sync your expense data anywhere
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{expenses.length}</div>
                    <div className="text-xs text-white/70">Records</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{connectedProviders.length}</div>
                    <div className="text-xs text-white/70">Connected</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{exportHistory.length}</div>
                    <div className="text-xs text-white/70">Exports</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Toast */}
            {exportSuccess && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {exportSuccess}
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-gray-100 px-6">
              <nav className="flex gap-1 -mb-px overflow-x-auto py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.id === "history" && exportHistory.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                        {exportHistory.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "templates" && (
                <TemplateSelector
                  templates={EXPORT_TEMPLATES}
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                  onExport={handleExport}
                  isExporting={isExporting}
                  connectedProviders={connectedProviders}
                  expenses={expenses}
                />
              )}

              {activeTab === "integrations" && (
                <CloudIntegrations
                  providers={CLOUD_PROVIDERS}
                  connectedProviders={connectedProviders}
                  onConnect={handleConnectProvider}
                  isConnecting={isExporting}
                />
              )}

              {activeTab === "email" && (
                <EmailExport
                  selectedTemplate={selectedTemplate}
                  templates={EXPORT_TEMPLATES}
                  onSelectTemplate={setSelectedTemplate}
                  onSend={(email) => handleExport(`Email (${email})`)}
                  isExporting={isExporting}
                  expenses={expenses}
                />
              )}

              {activeTab === "share" && (
                <SharePanel
                  expenses={expenses}
                  selectedTemplate={selectedTemplate}
                  templates={EXPORT_TEMPLATES}
                  onSelectTemplate={setSelectedTemplate}
                />
              )}

              {activeTab === "schedule" && (
                <SchedulePanel
                  templates={EXPORT_TEMPLATES}
                  connectedProviders={connectedProviders}
                  providers={CLOUD_PROVIDERS}
                  scheduledExports={scheduledExports}
                  onSchedule={handleScheduleExport}
                  onToggle={(id) => {
                    setScheduledExports((prev) =>
                      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
                    );
                  }}
                  onDelete={(id) => {
                    setScheduledExports((prev) => prev.filter((s) => s.id !== id));
                  }}
                />
              )}

              {activeTab === "history" && (
                <ExportHistory
                  history={exportHistory}
                  onRetry={(id) => {
                    const item = exportHistory.find((h) => h.id === id);
                    if (item) {
                      handleExport(item.destination);
                    }
                  }}
                  onDelete={(id) => {
                    setExportHistory((prev) => prev.filter((h) => h.id !== id));
                  }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Cloud sync active</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    Last sync: Just now
                  </span>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
