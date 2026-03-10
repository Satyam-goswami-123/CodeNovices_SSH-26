import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Zap, Home, Receipt, ShieldCheck, X, CheckCircle2, Lock, Hash, Shield, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const departments = [
    { id: 'water', name: 'Water Department', icon: Droplet, color: 'bg-blue-500', amount: '₹450.00', status: 'Due' },
    { id: 'electric', name: 'Electric Department', icon: Zap, color: 'bg-amber-500', amount: '₹1,200.00', status: 'Due' },
    { id: 'property', name: 'Property Tax', icon: Home, color: 'bg-emerald-500', amount: '₹4,500.00', status: 'Due' },
    { id: 'paped', name: 'Paped AGS Dept', icon: Receipt, color: 'bg-rose-500', amount: '₹300.00', status: 'Due' }
];

export function DepartmentPayments() {
    const [selectedDept, setSelectedDept] = useState<any | null>(null);
    const [pin, setPin] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: PIN, 2: Hash, 3: RSA/Sign
    const [mockHash, setMockHash] = useState('');
    const [mockSignature, setMockSignature] = useState('');

    const handlePayNow = (dept: any) => {
        setSelectedDept(dept);
        setPin('');
        setSuccess(false);
        setError('');
        setStep(1);
    };

    const handleVerifyPin = () => {
        if (pin.length !== 4) {
            setError('Please enter a valid 4-digit PIN');
            return;
        }

        setIsProcessing(true);
        setError('');

        // Simulate secure verification
        setTimeout(() => {
            if (pin === '1234') { // Mock PIN
                setMockHash(Math.random().toString(16).slice(2, 66));
                setStep(2);
                setIsProcessing(false);
            } else {
                setError('Incorrect Security PIN. Please try again.');
                setIsProcessing(false);
            }
        }, 1200);
    };

    const handleGenerateSignature = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setMockSignature(btoa(mockHash).slice(0, 128));
            setStep(3);
            setIsProcessing(false);
        }, 1500);
    };

    const handleFinalizePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setSuccess(true);
            setIsProcessing(false);

            // Store transaction for admin dashboard
            const transactions = JSON.parse(localStorage.getItem('citizenTransactions') || '[]');
            transactions.push({
                id: Math.random().toString(36).slice(2, 9),
                dept: selectedDept.name,
                amount: selectedDept.amount,
                timestamp: new Date().toISOString(),
                txid: `0x${mockHash.slice(0, 10)}...${mockHash.slice(-8)}`
            });
            localStorage.setItem('citizenTransactions', JSON.stringify(transactions));

            setTimeout(() => setSelectedDept(null), 2500);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {departments.map((dept, index) => {
                    const Icon = dept.icon;
                    return (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all shadow-lg cursor-default group bg-white dark:bg-zinc-900">
                                <div className={`${dept.color} p-6 flex justify-between items-center text-white relative overflow-hidden`}>
                                    <Icon className="w-10 h-10 opacity-20 absolute -right-2 -bottom-2 group-hover:scale-150 transition-transform duration-500" />
                                    <Icon className="w-8 h-8 relative z-10" />
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded-full relative z-10">{dept.status}</span>
                                </div>
                                <CardContent className="p-5">
                                    <h3 className="font-black text-zinc-900 dark:text-white uppercase tracking-tighter text-lg leading-tight mb-2">{dept.name}</h3>
                                    <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 flex items-baseline gap-1">
                                        {dept.amount}
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Invoiced</span>
                                    </p>
                                    <Button
                                        onClick={() => handlePayNow(dept)}
                                        className={`w-full mt-4 h-12 font-black uppercase tracking-widest ${dept.color} hover:opacity-90 text-white border-none rounded-xl shadow-lg`}
                                    >
                                        Direct Pay
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedDept && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 40 }}
                            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] border border-indigo-500/20 relative"
                        >
                            <button
                                onClick={() => !isProcessing && setSelectedDept(null)}
                                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {!success ? (
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <div className="flex justify-center mb-6">
                                            {[1, 2, 3].map((s) => (
                                                <div key={s} className="flex items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= s ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                                        }`}>
                                                        {s}
                                                    </div>
                                                    {s < 3 && <div className={`w-8 h-1 transition-all ${step > s ? 'bg-indigo-600' : 'bg-zinc-100 dark:bg-zinc-800'}`} />}
                                                </div>
                                            ))}
                                        </div>
                                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                            {step === 1 ? 'Verify Identity' : step === 2 ? 'Cryptographic Hash' : 'Digital Signature'}
                                        </h3>
                                        <p className="text-zinc-500 font-medium mt-2">Securing payment for {selectedDept.name}</p>
                                    </div>

                                    <div className="space-y-6">
                                        {step === 1 && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                                                    <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">Paying To:</span>
                                                    <span className="font-bold text-zinc-900 dark:text-white">{selectedDept.name}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Enter 4-Digit Security PIN</label>
                                                    <Input
                                                        type="password"
                                                        maxLength={4}
                                                        value={pin}
                                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="••••"
                                                        className="text-center text-4xl tracking-[0.8em] font-black h-20 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:border-indigo-600"
                                                    />
                                                </div>
                                                {error && <p className="text-xs font-bold text-rose-500 text-center animate-shake">{error}</p>}
                                                <Button onClick={handleVerifyPin} disabled={isProcessing} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100">
                                                    {isProcessing ? "Verifying..." : "Verify Identity"}
                                                </Button>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className="space-y-4">
                                                <div className="text-center space-y-2">
                                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                                                        <Hash className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Generated SHA-256 Hash</label>
                                                        <p className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 break-all mt-1">{mockHash}</p>
                                                    </div>
                                                </div>
                                                <Button onClick={handleGenerateSignature} disabled={isProcessing} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700">
                                                    {isProcessing ? "Encrypting..." : "Sign with RSA Key"}
                                                </Button>
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800">
                                                    <Shield className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Final Digital Signature</label>
                                                    <p className="text-[10px] font-mono text-amber-800 dark:text-amber-300 break-all mt-1">{mockSignature}</p>
                                                </div>
                                                <Button onClick={handleFinalizePayment} disabled={isProcessing} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                                                    {isProcessing ? "Broadcasting Block..." : "Finalize Transaction"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-zinc-400">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">End-to-End Encrypted Node</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-300"
                                    >
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <h3 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Verified!</h3>
                                    <p className="text-zinc-500 font-bold mt-2">Payment recorded on Blockchain.</p>
                                    <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Blockchain Receipt</p>
                                        <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 break-all">TXID: 0x{mockHash.slice(0, 32)}...</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
