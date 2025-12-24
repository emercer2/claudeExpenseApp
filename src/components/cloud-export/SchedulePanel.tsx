"use client";

import React, { useState } from "react";
import { format, parseISO, addDays, addWeeks, addMonths } from "date-fns";
import { ExportTemplate, CloudProvider, ScheduledExport } from "./types";

interface SchedulePanelProps {
  templates: ExportTemplate[];
  connectedProviders: string[];
  providers: CloudProvider[];
  scheduledExports: ScheduledExport[];
  onSchedule: (schedule: Omit<ScheduledExport, "id">) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SchedulePanel({
  templates,
  connectedProviders,
  providers,
  scheduledExports,
  onSchedule,
  onToggle,
  onDelete,
}: SchedulePanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    template: "",
    destination: "",
    frequency: "weekly" as "daily" | "weekly" | "monthly",
  });

  const getNextRunDate = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case "daily":
        return addDays(now, 1);
      case "weekly":
        return addWeeks(now, 1);
      case "monthly":
        return addMonths(now, 1);
      default:
        return addWeeks(now, 1);
    }
  };

  const handleCreate = () => {
    if (!newSchedule.template || !newSchedule.destination) return;

    onSchedule({
      template: newSchedule.template,
      destination: newSchedule.destination,
      frequency: newSchedule.frequency,
      nextRun: getNextRunDate(newSchedule.frequency).toISOString(),
      enabled: true,
    });

    setIsCreating(false);
    setNewSchedule({ template: "", destination: "", frequency: "weekly" });
  };

  const availableDestinations = [
    { id: "email", name: "Email", icon: "📧" },
    ...providers
      .filter((p) => connectedProviders.includes(p.id))
      .map((p) => ({ id: p.id, name: p.name, icon: p.icon })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Exports</h3>
          <p className="text-sm text-gray-500 mt-1">
            Set up automatic recurring exports
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Schedule
        </button>
      </div>

      {/* Create New Schedule */}
      {isCreating && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 space-y-4">
          <h4 className="font-semibold text-indigo-900">Create Scheduled Export</h4>

          {/* Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() =>
                    setNewSchedule((prev) => ({ ...prev, template: template.name }))
                  }
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    newSchedule.template === template.name
                      ? "border-indigo-500 bg-white"
                      : "border-transparent bg-white/50 hover:bg-white"
                  }`}
                >
                  <span className="text-lg mr-2">{template.icon}</span>
                  <span className="font-medium text-sm">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            {availableDestinations.length === 0 ? (
              <p className="text-sm text-gray-500 bg-white/50 p-3 rounded-xl">
                Connect a cloud service to enable scheduled exports
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() =>
                      setNewSchedule((prev) => ({ ...prev, destination: dest.name }))
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      newSchedule.destination === dest.name
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {dest.icon} {dest.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "daily", label: "Daily", desc: "Every day at 9 AM" },
                { value: "weekly", label: "Weekly", desc: "Every Monday" },
                { value: "monthly", label: "Monthly", desc: "1st of month" },
              ].map((freq) => (
                <button
                  key={freq.value}
                  onClick={() =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      frequency: freq.value as "daily" | "weekly" | "monthly",
                    }))
                  }
                  className={`p-3 rounded-xl text-left transition-all ${
                    newSchedule.frequency === freq.value
                      ? "bg-white border-2 border-indigo-500"
                      : "bg-white/50 border-2 border-transparent hover:bg-white"
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{freq.label}</div>
                  <div className="text-xs text-gray-500">{freq.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newSchedule.template || !newSchedule.destination}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Schedule
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Exports List */}
      {scheduledExports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="text-6xl mb-4">⏰</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No Scheduled Exports
          </h4>
          <p className="text-gray-500 mb-4">
            Set up automatic exports to keep your data backed up
          </p>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Create First Schedule
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {scheduledExports.map((schedule) => (
            <div
              key={schedule.id}
              className={`p-5 rounded-2xl border-2 transition-all ${
                schedule.enabled
                  ? "border-gray-100 bg-white"
                  : "border-gray-100 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      schedule.enabled ? "bg-indigo-100" : "bg-gray-200"
                    }`}
                  >
                    {schedule.frequency === "daily"
                      ? "📅"
                      : schedule.frequency === "weekly"
                      ? "📆"
                      : "🗓️"}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">{schedule.template}</h4>
                    <p className="text-sm text-gray-500">
                      Export to {schedule.destination} • {schedule.frequency}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">Next run:</span>
                      <span className="text-xs font-medium text-indigo-600">
                        {format(parseISO(schedule.nextRun), "PPP 'at' p")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {/* Toggle */}
                  <button
                    onClick={() => onToggle(schedule.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      schedule.enabled ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        schedule.enabled ? "left-6" : "left-1"
                      }`}
                    />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(schedule.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
      )}

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="text-amber-500 text-xl">⚡</div>
          <div>
            <h4 className="font-medium text-amber-900">Automatic Backups</h4>
            <p className="text-sm text-amber-700 mt-1">
              Scheduled exports run automatically in the background. You'll receive a
              notification when each export completes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
