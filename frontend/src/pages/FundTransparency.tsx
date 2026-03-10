import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IndianRupee, PieChart as PieChartIcon, TrendingUp, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';

const totalBudget = 50000;
const amountDistributed = 34500;
const remainingFunds = totalBudget - amountDistributed;

const allocationData = [
    { name: 'Infrastructure', value: 15000, color: '#3b82f6' },
    { name: 'Education', value: 12000, color: '#10b981' },
    { name: 'Healthcare', value: 10000, color: '#f59e0b' },
    { name: 'Agriculture', value: 8000, color: '#6366f1' },
    { name: 'Others', value: 5000, color: '#8b5cf6' },
];

const distributionTimeline = [
    { month: 'Apr', amount: 4000 },
    { month: 'May', amount: 5500 },
    { month: 'Jun', amount: 4800 },
    { month: 'Jul', amount: 6200 },
    { month: 'Aug', amount: 7500 },
    { month: 'Sep', amount: 6500 },
];

export function FundTransparency() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <Landmark className="w-8 h-8 text-blue-600" /> Public Fund Transparency
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Track real-time government budget allocations, distributions, and remaining funds across various sectors.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-900/40">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <IndianRupee className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Total Allocated Budget</h3>
                            </div>
                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-4">₹{totalBudget.toLocaleString()} Cr</p>
                            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Financial Year 2026-27</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-900/40">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-600 rounded-lg text-white">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-green-900 dark:text-green-100">Amount Distributed</h3>
                            </div>
                            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-4">₹{amountDistributed.toLocaleString()} Cr</p>
                            <div className="w-full bg-green-200 dark:bg-green-900/40 rounded-full h-1.5 mt-2">
                                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${(amountDistributed / totalBudget) * 100}%` }}></div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-900/40">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-600 rounded-lg text-white">
                                    <PieChartIcon className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Remaining Funds</h3>
                            </div>
                            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-4">₹{remainingFunds.toLocaleString()} Cr</p>
                            <div className="w-full bg-amber-200 dark:bg-amber-900/40 rounded-full h-1.5 mt-2">
                                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${(remainingFunds / totalBudget) * 100}%` }}></div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Sector-wise Allocation</CardTitle>
                            <CardDescription>Distribution of total budget across different departments</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => `₹${value} Cr`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-col justify-center gap-3 w-48">
                                {allocationData.map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.name}</div>
                                        <div className="text-sm font-bold text-zinc-900 dark:text-white">{(item.value / totalBudget * 100).toFixed(0)}%</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Distribution Timeline</CardTitle>
                            <CardDescription>Monthly fund clearance from central reserve</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={distributionTimeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        cursor={{ fill: '#f4f4f5' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number) => [`₹${value} Cr`, 'Distributed']}
                                    />
                                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
