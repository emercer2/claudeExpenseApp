'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useExpenses } from '@/context/ExpenseContext';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, startOfDay } from 'date-fns';

interface CategoryData {
  category: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
  amount: number;
}

export function MonthlyInsights() {
  const { expenses } = useExpenses();

  // Get current month's expenses
  const monthlyData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });

    // Calculate category totals
    const categoryTotals: Record<ExpenseCategory, number> = {
      food: 0,
      transportation: 0,
      entertainment: 0,
      shopping: 0,
      bills: 0,
      other: 0,
    };

    monthlyExpenses.forEach((expense) => {
      categoryTotals[expense.category] += expense.amount;
    });

    // Convert to array and sort by amount
    const categoryData: CategoryData[] = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        label: EXPENSE_CATEGORIES[category as ExpenseCategory].label,
        icon: EXPENSE_CATEGORIES[category as ExpenseCategory].icon,
        color: EXPENSE_CATEGORIES[category as ExpenseCategory].color,
        amount,
      }))
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    return {
      categories: categoryData,
      top3: categoryData.slice(0, 3),
      total: categoryData.reduce((sum, item) => sum + item.amount, 0),
    };
  }, [expenses]);

  // Calculate budget streak (days without exceeding daily average)
  const budgetStreak = useMemo(() => {
    if (expenses.length === 0) return 0;

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Calculate average daily spending over last 30 days
    const recentExpenses = expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      return expenseDate >= thirtyDaysAgo && expenseDate <= now;
    });

    if (recentExpenses.length === 0) return 0;

    const totalRecent = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgDaily = totalRecent / 30;

    // Count consecutive days under budget
    let streak = 0;
    const today = startOfDay(now);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dayStart = startOfDay(checkDate);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayExpenses = expenses.filter((expense) => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= dayStart && expenseDate < dayEnd;
      });

      const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      if (dayTotal <= avgDaily * 1.2) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [expenses]);

  // Chart data for donut
  const chartData = monthlyData.categories.map((item) => ({
    name: item.label,
    value: item.amount,
    color: item.color,
    icon: item.icon,
  }));

  if (monthlyData.categories.length === 0) {
    return (
      <Card>
        <CardHeader title="Monthly Insights" subtitle="This month's spending breakdown" />
        <div className="h-64 flex items-center justify-center text-gray-400">
          No spending data this month
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Monthly Insights" subtitle="This month's spending breakdown" />

      {/* Donut Chart */}
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
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 Categories */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Top Categories</h4>
        <div className="space-y-2">
          {monthlyData.top3.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.icon} {item.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  ({((item.amount / monthlyData.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Streak */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Budget Streak</p>
            <p className="text-xs text-gray-400 mt-0.5">Days under daily average</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-success-600">{budgetStreak}</span>
            <span className="text-sm text-gray-500">days</span>
            {budgetStreak >= 7 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-700">
                Great!
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
