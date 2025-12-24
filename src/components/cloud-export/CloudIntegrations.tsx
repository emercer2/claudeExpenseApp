"use client";

import React from "react";
import { CloudProvider } from "./types";

interface CloudIntegrationsProps {
  providers: CloudProvider[];
  connectedProviders: string[];
  onConnect: (providerId: string) => void;
  isConnecting: boolean;
}

export function CloudIntegrations({
  providers,
  connectedProviders,
  onConnect,
  isConnecting,
}: CloudIntegrationsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Cloud Integrations</h3>
        <p className="text-sm text-gray-500 mt-1">
          Connect your favorite cloud services for seamless export and sync
        </p>
      </div>

      {/* Connected Services */}
      {connectedProviders.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-800">
              {connectedProviders.length} service{connectedProviders.length > 1 ? "s" : ""} connected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {connectedProviders.map((id) => {
              const provider = providers.find((p) => p.id === id);
              if (!provider) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
                >
                  {provider.icon} {provider.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Provider Grid */}
      <div className="grid gap-4">
        {providers.map((provider) => {
          const isConnected = connectedProviders.includes(provider.id);

          return (
            <div
              key={provider.id}
              className={`p-5 rounded-2xl border-2 transition-all ${
                isConnected
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: `${provider.color}15` }}
                  >
                    {provider.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-500">
                      {isConnected ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Connected
                        </span>
                      ) : (
                        "Not connected"
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onConnect(provider.id)}
                  disabled={isConnecting}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                    isConnected
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25"
                  }`}
                >
                  {isConnecting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Connecting...
                    </span>
                  ) : isConnected ? (
                    "Disconnect"
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>

              {/* Features */}
              {!isConnected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      Auto-sync
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      Real-time backup
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      Scheduled exports
                    </span>
                  </div>
                </div>
              )}

              {isConnected && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last sync</span>
                    <span className="text-gray-700">Just now</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="text-blue-500 text-xl">💡</div>
          <div>
            <h4 className="font-medium text-blue-900">Pro Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              Connect multiple services to keep your expense data backed up across platforms.
              Changes sync automatically in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
