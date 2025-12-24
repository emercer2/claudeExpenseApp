"use client";

import React from "react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { ExportHistoryItem } from "./types";

interface ExportHistoryProps {
  history: ExportHistoryItem[];
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExportHistory({ history, onRetry, onDelete }: ExportHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Export History</h3>
        <p className="text-gray-500">Your export history will appear here</p>
      </div>
    );
  }

  const getStatusColor = (status: ExportHistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
    }
  };

  const getStatusIcon = (status: ExportHistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return "✓";
      case "pending":
        return "⏳";
      case "failed":
        return "✕";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your previous exports
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{history.length} export{history.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            {history.filter((h) => h.status === "completed").length}
          </div>
          <div className="text-xs text-green-600">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">
            {history.filter((h) => h.status === "pending").length}
          </div>
          <div className="text-xs text-yellow-600">Pending</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700">
            {history.filter((h) => h.status === "failed").length}
          </div>
          <div className="text-xs text-red-600">Failed</div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Status Badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${getStatusColor(
                    item.status
                  )}`}
                >
                  {getStatusIcon(item.status)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{item.template}</h4>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Exported to {item.destination}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{item.recordCount} records</span>
                    <span>•</span>
                    <span>{item.fileSize}</span>
                    <span>•</span>
                    <span title={format(parseISO(item.timestamp), "PPpp")}>
                      {formatDistanceToNow(parseISO(item.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {item.shareLink && (
                  <button
                    onClick={() => navigator.clipboard.writeText(item.shareLink!)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy share link"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                )}
                {item.status === "failed" && (
                  <button
                    onClick={() => onRetry(item.id)}
                    className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Retry export"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clear All */}
      {history.length > 3 && (
        <button className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm font-medium">
          Clear Export History
        </button>
      )}
    </div>
  );
}
