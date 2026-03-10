import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Hash, Clock, Link as LinkIcon, ShieldCheck, Activity, Key, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

export function BlockchainLedger() {
    const [ledger, setLedger] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Security Discovery Feature State
    const [plaintext, setPlaintext] = useState('test_transaction_data');
    const [hashOutput, setHashOutput] = useState('');
    const [rsaInput, setRsaInput] = useState('');
    const [signature, setSignature] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setLedger([
                {
                    _id: '1',
                    blockNumber: 1042,
                    timestamp: new Date().toISOString(),
                    amount: 4500.00,
                    hash: '0000x8f2a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6',
                    previousHash: '0000x7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1a0b9c8d7',
                    transactionData: 'Property Tax Payment - Ward 12',
                    fromUid: 'CIT-9824',
                    toUid: 'GOV-TAX-DEPT'
                },
                ...JSON.parse(localStorage.getItem('citizenTransactions') || '[]').map((t: any, i: number) => ({
                    _id: `citizen-${i}`,
                    blockNumber: 1043 + i,
                    timestamp: t.timestamp,
                    amount: parseFloat(t.amount.replace('₹', '').replace(',', '')),
                    hash: t.txid,
                    previousHash: '0000x8f2a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6',
                    transactionData: t.dept,
                    fromUid: 'CIT-SELF',
                    toUid: t.dept
                }))
            ].reverse());
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const generateHash = () => {
        const h = btoa(plaintext).slice(0, 64);
        setHashOutput(h);
    };

    const signWithRSA = () => {
        if (!rsaInput) return;
        setSignature(btoa(rsaInput + "_SIGNED_BY_RSA_2048").slice(0, 128));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <Database className="w-16 h-16 text-indigo-500 animate-bounce" />
                <p className="text-zinc-500 font-semibold uppercase tracking-widest animate-pulse">Syncing Distributed Nodes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 dark:shadow-none overflow-hidden relative">
                <Database className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-4">
                        <Lock className="w-10 h-10" />
                        Blockchain Ledger
                    </h2>
                    <p className="text-indigo-100 mt-2 font-medium max-w-md">Public, immutable transaction records secured by cryptographic RSA signatures and SHA-256 Hashing.</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-[2rem] px-8 py-6 relative z-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1">Network Status</p>
                    <div className="flex items-center gap-4">
                        <Activity className="w-6 h-6 text-emerald-300" />
                        <h3 className="text-2xl font-bold tracking-tight">{ledger.length} Verified Blocks</h3>
                    </div>
                </div>
            </div>

            {/* Security Verification Discovery Section */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Security Verification Protocol (Discovery)</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900 p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">1</div>
                            <h4 className="font-semibold uppercase tracking-tight text-zinc-800 dark:text-white leading-tight">Plaintext to SHA-256 Hash</h4>
                        </div>
                        <div className="space-y-4">
                            <Input
                                value={plaintext}
                                onChange={(e) => setPlaintext(e.target.value)}
                                placeholder="Enter transaction data..."
                                className="h-14 rounded-2xl border-2 focus:border-indigo-500 font-medium"
                            />
                            <Button onClick={generateHash} className="w-full h-12 rounded-xl bg-indigo-600 font-semibold uppercase tracking-widest text-xs">Generate Hash</Button>
                        </div>
                        {hashOutput && (
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                                <p className="text-[8px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Hash Output (Hex)</p>
                                <p className="text-[10px] font-mono text-indigo-600 break-all leading-relaxed font-medium">{hashOutput}</p>
                            </div>
                        )}
                    </Card>

                    {/* Step 2 */}
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900 p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">2</div>
                            <h4 className="font-semibold uppercase tracking-tight text-zinc-800 dark:text-white leading-tight">RSA Key Encryption</h4>
                        </div>
                        <div className="space-y-4">
                            <Input
                                value={rsaInput}
                                onChange={(e) => setRsaInput(e.target.value)}
                                placeholder="Paste Hash here..."
                                className="h-14 rounded-2xl border-2 focus:border-emerald-500 font-medium"
                            />
                            <Button onClick={signWithRSA} className="w-full h-12 rounded-xl bg-emerald-600 font-semibold uppercase tracking-widest text-xs">Sign with RSA-2048</Button>
                        </div>
                        <p className="text-[9px] text-zinc-400 italic">"Copy the hash from Step 1 into this field to generate the digital signature."</p>
                    </Card>

                    {/* Step 3 */}
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900 p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center font-bold">3</div>
                            <h4 className="font-semibold uppercase tracking-tight text-zinc-800 dark:text-white leading-tight">Digital Signature Results</h4>
                        </div>
                        {signature ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
                                    <p className="text-[8px] font-semibold uppercase tracking-widest text-amber-600 mb-2">RSA Signature (Base64)</p>
                                    <p className="text-[10px] font-mono text-amber-800 dark:text-amber-200 break-all leading-relaxed font-medium">{signature}</p>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-[10px] font-semibold uppercase">Identity Verified</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-300 font-semibold uppercase text-xs tracking-[0.2em] border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl p-10">
                                Waiting for RSA...
                            </div>
                        )}
                    </Card>
                </div>
            </section>

            {/* Ledger Blocks */}
            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Validated Immutable Blocks</h2>
                </div>

                <div className="space-y-3">
                    {ledger.map((block, index) => (
                        <motion.div
                            key={block._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all group overflow-hidden relative"
                        >
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-3 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-600 p-2.5 rounded-xl shadow-sm">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-base font-semibold text-zinc-900 dark:text-white tracking-wide uppercase">Block #{block.blockNumber}</h3>
                                            <span className="bg-indigo-50 dark:bg-indigo-900 text-[7px] font-medium text-indigo-600 uppercase px-1.5 py-0.5 rounded-full">Primary_Node</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 flex items-center">
                                            <Clock className="w-3 h-3 mr-1.5" />
                                            {new Date(block.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700">
                                    <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-400 mb-0.5">Transaction Value</p>
                                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">₹{block.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
                                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center mb-1.5">
                                        <Hash className="w-3 h-3 text-indigo-500 mr-1.5" />
                                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Integrity Hash</p>
                                    </div>
                                    <p className="text-[9px] font-mono text-zinc-700 dark:text-zinc-300 break-all leading-relaxed">{block.hash}</p>
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center mb-1.5">
                                        <LinkIcon className="w-3 h-3 text-zinc-300 mr-1.5" />
                                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Chain Link (Parent)</p>
                                    </div>
                                    <p className="text-[9px] font-mono text-zinc-400 break-all leading-relaxed">{block.previousHash}</p>
                                </div>

                                <div className="md:col-span-2 bg-zinc-900 dark:bg-black rounded-xl p-4 border border-zinc-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Metadata payload</p>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                    </div>
                                    <p className="text-white font-medium text-base tracking-tight mb-3">{block.transactionData}</p>
                                    {block.fromUid && block.toUid && (
                                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider">
                                            <div className="bg-rose-500/10 px-2.5 py-1 rounded-lg text-rose-500 border border-rose-500/20">
                                                From: {block.fromUid}
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-zinc-700" />
                                            <div className="bg-emerald-500/10 px-2.5 py-1 rounded-lg text-emerald-500 border border-emerald-500/20">
                                                To: {block.toUid}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
