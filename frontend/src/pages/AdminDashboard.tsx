import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, IndianRupee, FileWarning, Clock, History, Search, ArrowRight, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';

export function AdminDashboard() {
  const [citizenPayments, setCitizenPayments] = useState<any[]>([]);
  const adminDept = localStorage.getItem('adminDept') || 'electric';

  useEffect(() => {
    const payments = JSON.parse(localStorage.getItem('citizenTransactions') || '[]');
    setCitizenPayments(payments);
  }, []);

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ];

  const grievanceData = [
    { name: 'Week 1', resolved: 400, pending: 240 },
    { name: 'Week 2', resolved: 300, pending: 139 },
    { name: 'Week 3', resolved: 200, pending: 980 },
    { name: 'Week 4', resolved: 278, pending: 390 },
  ];

  const getDeptName = (id: string) => {
    if (id === 'water') return 'Water Utility Board';
    if (id === 'electric') return 'Electric Department (HQ)';
    if (id === 'tax') return 'Municipal Property Tax';
    return 'Paped AGS Department';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-100 dark:shadow-none">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Live Terminal Active</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
            {getDeptName(adminDept)}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Administrator Oversight • System Node #0042</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Session Status</p>
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Admin_Root_Auth</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">Recent Citizen Inbound Payments</h2>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all">
                View Blockchain Log <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {citizenPayments.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No incoming transfers detected</h3>
                <p className="text-zinc-500 font-medium mt-1">Real-time payment data will appear here once citizens authorize via RSA.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {citizenPayments.map((payment, i) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">{payment.dept}</p>
                        <h4 className="font-black text-zinc-900 dark:text-white">Payment Received</h4>
                      </div>
                      <span className="text-lg font-black text-emerald-600">{payment.amount}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono text-zinc-400 break-all">{payment.txid}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500">
                        <span>{new Date(payment.timestamp).toLocaleTimeString()}</span>
                        <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-2 py-0.5 rounded-full">Blockchain Verified</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[2rem] border-none shadow-xl shadow-zinc-100 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Revenue Collection</CardTitle>
              </CardHeader>
              <CardContent className="h-64 cursor-crosshair">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold' }} />
                    <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl shadow-zinc-100 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent className="h-64 cursor-crosshair">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={grievanceData}>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold' }} />
                    <Line type="stepAfter" dataKey="resolved" stroke="#10b981" strokeWidth={4} dot={false} />
                    <Line type="stepAfter" dataKey="pending" stroke="#ef4444" strokeWidth={4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-indigo-600 border-none text-white rounded-[2rem] p-6 relative overflow-hidden group">
              <IndianRupee className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cumulative Treasury</p>
              <h3 className="text-3xl font-black mt-1">₹4.2 Cr</h3>
              <p className="text-xs font-bold mt-4 flex items-center gap-1">
                <span className="text-emerald-300">+12%</span> vs last month
              </p>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-none rounded-[2rem] p-6 shadow-xl shadow-zinc-100 dark:shadow-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Integrity</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-xl">99.9%</h4>
                  <p className="text-xs font-bold text-zinc-500">Nodes Synchronized</p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
