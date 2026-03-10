import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Lightbulb, TrendingUp, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useLanguage } from '@/src/context/LanguageContext';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

export function FinanceInsights() {
  const { t } = useLanguage();
  const [data, setData] = useState([
    { name: 'Utilities', value: 4500 },
    { name: 'Taxes', value: 12000 },
    { name: 'Fees', value: 1500 },
    { name: 'Fines', value: 500 },
  ]);

  // Update pie chart from real transactions in localStorage
  useEffect(() => {
    const updateFromTransactions = () => {
      const txs = JSON.parse(localStorage.getItem('citizenTransactions') || '[]');
      if (txs.length === 0) return;

      let utilities = 0, taxes = 0, fees = 0, fines = 0;

      txs.forEach((tx: any) => {
        const amount = parseFloat(tx.amount?.replace(/[₹,]/g, '') || '0');
        const dept = (tx.dept || '').toLowerCase();

        if (dept.includes('electric') || dept.includes('water') || dept.includes('gas')) {
          utilities += amount;
        } else if (dept.includes('tax') || dept.includes('property')) {
          taxes += amount;
        } else if (dept.includes('fee') || dept.includes('document')) {
          fees += amount;
        } else {
          fines += amount;
        }
      });

      // Only update if we have real data, add base values for visual
      setData([
        { name: t('Electricity') + ' / ' + t('Water'), value: 4500 + utilities },
        { name: t('Property Tax'), value: 12000 + taxes },
        { name: 'Fees', value: 1500 + fees },
        { name: 'Fines', value: 500 + fines },
      ]);
    };

    updateFromTransactions();
    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', updateFromTransactions);
    // Also poll every 3s for same-tab updates
    const interval = setInterval(updateFromTransactions, 3000);

    return () => {
      window.removeEventListener('storage', updateFromTransactions);
      clearInterval(interval);
    };
  }, [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Citizen Dashboard')} - Finance</CardTitle>
        <CardDescription>{t('Payment & DBT Tracking')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 text-center">Expenditure Breakdown (YTD)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${Number(value).toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">AI Recommendations</h4>

            <div className="flex gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Tax Saving Tip</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Invest ₹50,000 in NPS to save up to ₹15,600 in taxes under section 80CCD(1B).</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">Eligible Scheme</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">Based on your profile, you are eligible for the PM Awas Yojana subsidy.</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
              <ShieldAlert className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Action Required</p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Link your PAN with Aadhaar before March 31st to avoid penalties.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
