'use client';

import React from 'react';
import { MonthlyInsights } from '@/components/dashboard';

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <MonthlyInsights />
      </div>
    </div>
  );
}
