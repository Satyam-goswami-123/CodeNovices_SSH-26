import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '@/src/context/LanguageContext';

const basePaymentData = [
    { month: 'Jan', amount: 2000 },
    { month: 'Feb', amount: 3000 },
    { month: 'Mar', amount: 1500 },
    { month: 'Apr', amount: 4000 },
    { month: 'May', amount: 5500 },
    { month: 'Jun', amount: 8500 },
    { month: 'Jul', amount: 5000 },
    { month: 'Aug', amount: 3200 },
    { month: 'Sep', amount: 4800 },
    { month: 'Oct', amount: 5200 },
    { month: 'Nov', amount: 6000 },
    { month: 'Dec', amount: 7200 },
];

const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

export function PaymentTransferTrends() {
    const { t } = useLanguage();
    const [paymentData, setPaymentData] = useState(basePaymentData);
    const [totalYTD, setTotalYTD] = useState(55900);
    const [highest, setHighest] = useState({ amount: 8500, month: 'Jun' });

    // Update chart from real transactions
    useEffect(() => {
        const updateFromTransactions = () => {
            const txs = JSON.parse(localStorage.getItem('citizenTransactions') || '[]');

            // Start from base data
            const updatedData = basePaymentData.map(d => ({ ...d }));

            // Add real transaction amounts to the correct month
            txs.forEach((tx: any) => {
                const amount = parseFloat(tx.amount?.replace(/[₹,]/g, '') || '0');
                const date = new Date(tx.timestamp);
                const monthIdx = date.getMonth();
                if (monthIdx >= 0 && monthIdx < 12) {
                    updatedData[monthIdx].amount += amount;
                }
            });

            // Find highest
            let maxEntry = updatedData[0];
            let total = 0;
            updatedData.forEach(d => {
                total += d.amount;
                if (d.amount > maxEntry.amount) maxEntry = d;
            });

            setPaymentData(updatedData);
            setTotalYTD(total);
            setHighest({ amount: maxEntry.amount, month: maxEntry.month });
        };

        updateFromTransactions();
        window.addEventListener('storage', updateFromTransactions);
        const interval = setInterval(updateFromTransactions, 3000);

        return () => {
            window.removeEventListener('storage', updateFromTransactions);
            clearInterval(interval);
        };
    }, []);

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-4 bg-indigo-50/30 dark:bg-indigo-900/10 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight">{t('Payment Transfer Trends')}</CardTitle>
                        <CardDescription className="text-zinc-500 dark:text-zinc-400">Monthly subsidy & DBT disbursement analysis</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-1">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Highest Disbursement</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">₹{highest.amount.toLocaleString()}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-bold">{highest.month.toUpperCase()} PEAK</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total YTD</p>
                        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">₹{totalYTD.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={paymentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-zinc-800/60" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 600 }}
                                className="text-zinc-400"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 600 }}
                                className="text-zinc-400"
                            />
                            <Tooltip
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e5e5',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                                itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                                labelStyle={{ fontWeight: 'bold', fontSize: '10px', color: '#6366f1', marginBottom: '4px', textTransform: 'uppercase' as const }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#4f46e5"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Next expected: March Cycle</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Wallet className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">+₹2,500 Estim.</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
