import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, AlertOctagon, CheckCircle2, Search, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { getGeminiResponse } from '@/src/lib/gemini';

const recentAnalyses = [
    { id: 'APP-8912', type: 'Subsidy Claim', user: 'Rajesh K.', risk: 'High', reason: 'Duplicate Aadhar detected', time: '10 min ago' },
    { id: 'APP-8913', type: 'Loan Request', user: 'Priya M.', risk: 'Low', reason: 'Clean history', time: '25 min ago' },
    { id: 'APP-8914', type: 'Tax Refund', user: 'Amit S.', risk: 'Medium', reason: 'Unusual bank location', time: '1 hr ago' },
    { id: 'APP-8915', type: 'Utility Setup', user: 'Neha V.', risk: 'Low', reason: 'Verified address', time: '2 hrs ago' },
];

export function AIFraudRiskScore() {
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditReport, setAuditReport] = useState<string | null>(null);

    const runDeepAudit = async () => {
        setIsAuditing(true);
        setAuditReport(null);

        const systemPrompt = `You are a Government Financial Auditor. Analyze these suspicious activity cases and provide a 2-sentence tactical summary of risks.
        Input Data: ${JSON.stringify(recentAnalyses)}`;

        try {
            const response = await getGeminiResponse("Please run a deep audit on these flags.", systemPrompt);
            setAuditReport(response);
        } catch (error) {
            console.error("Audit error", error);
            setAuditReport("Error connecting to Audit Intelligence node.");
        } finally {
            setIsAuditing(false);
        }
    };

    return (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
            <CardHeader className="bg-red-50/50 dark:bg-red-900/10 border-b border-zinc-100 dark:border-zinc-800/60 text-zinc-900 dark:text-zinc-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                AI Fraud & Risk Engine
                            </CardTitle>
                            <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1">
                                Real-time ML analysis of incoming applications
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="soft"
                        size="sm"
                        onClick={runDeepAudit}
                        disabled={isAuditing}
                        className="hidden sm:flex gap-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                    >
                        {isAuditing ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                        Deep AI Audit
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-red-800 dark:text-red-400">High Risk Alerts</span>
                            <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-500" />
                        </div>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-500">12</p>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">Action required immediately</p>
                    </div>
                    <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">Medium Risk</span>
                            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">45</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Needs manual review</p>
                    </div>
                    <div className="p-4 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-green-800 dark:text-green-400">Low Risk (Auto-Approved)</span>
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-500">1,204</p>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">Processed today</p>
                    </div>
                </div>

                <AnimatePresence>
                    {auditReport && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 rounded-xl bg-red-900/10 border border-red-500/30 text-red-900 dark:text-red-100 italic text-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                            <strong className="block mb-1 not-italic text-xs uppercase tracking-widest text-red-500">AI Auditor Insights:</strong>
                            "{auditReport}"
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3 text-sm tracking-wide uppercase">Recent Suspicious Activities</h4>
                    <div className="space-y-3">
                        {recentAnalyses.map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                key={item.id}
                                className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${item.risk === 'High' ? 'border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10' :
                                    item.risk === 'Medium' ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10' :
                                        'border-zinc-100 bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-900/50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        {item.risk === 'High' ? <AlertOctagon className="w-5 h-5 text-red-500" /> :
                                            item.risk === 'Medium' ? <ShieldAlert className="w-5 h-5 text-amber-500" /> :
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h5 className="font-medium text-zinc-900 dark:text-zinc-100">{item.id} - {item.type}</h5>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.risk === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                                                item.risk === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                                                    'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                }`}>{item.risk} Mismatch</span>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">User: {item.user} • {item.reason}</p>
                                    </div>
                                </div>
                                <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-none border-zinc-200 dark:border-zinc-800/60">
                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">{item.time}</span>
                                    {item.risk !== 'Low' && (
                                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 mt-1">Review</Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
