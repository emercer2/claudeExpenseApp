"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ExpenseCategory, EXPENSE_CATEGORIES } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui";

interface CategoryChartProps {
  data: Record<ExpenseCategory, number>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: EXPENSE_CATEGORIES[category as ExpenseCategory].label,
      value,
      color: EXPENSE_CATEGORIES[category as ExpenseCategory].color,
      icon: EXPENSE_CATEGORIES[category as ExpenseCategory].icon,
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader title="Spending by Category" />
        <div className="h-64 flex items-center justify-center text-gray-400">
          No spending data available
        </div>
      </Card>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader title="Spending by Category" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-600">
                  {entry.payload.icon} {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.icon} {item.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(item.value)}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
