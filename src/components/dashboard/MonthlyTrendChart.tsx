"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui";

interface MonthlyTrendChartProps {
  data: Array<{ month: string; amount: number }>;
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const hasData = data.some((item) => item.amount > 0);

  if (!hasData) {
    return (
      <Card>
        <CardHeader title="Monthly Spending Trend" subtitle="Last 6 months" />
        <div className="h-64 flex items-center justify-center text-gray-400">
          No spending data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Monthly Spending Trend" subtitle="Last 6 months" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Spending"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Bar
              dataKey="amount"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
