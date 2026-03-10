import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Droplets, Home, Flame, CreditCard, ChevronRight, X, ShieldCheck, Hash, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useLanguage } from '@/src/context/LanguageContext';

const utilities = [
  { id: 1, name: 'Electricity', provider: 'State Power Board', amount: 1250, dueDate: '2026-04-01', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800', autoPay: true },
  { id: 2, name: 'Water', provider: 'Municipal Corp', amount: 350, dueDate: '2026-05-01', icon: Droplets, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800', autoPay: false },
  { id: 3, name: 'Property Tax', provider: 'City Council', amount: 4500, dueDate: '2026-04-09', icon: Home, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800', autoPay: false },
  { id: 4, name: 'Piped Gas', provider: 'City Gas Ltd', amount: 850, dueDate: '2026-04-04', icon: Flame, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800', autoPay: true },
];

export function UtilityDashboard() {
  const { t } = useLanguage();
  const [bills, setBills] = useState(utilities);
  const [selectedBill, setSelectedBill] = useState<any | null>(null);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: PIN, 2: Hash, 3: Sign
  const [mockHash, setMockHash] = useState('');
  const [mockSignature, setMockSignature] = useState('');

  const toggleAutoPay = (id: number) => {
    setBills(bills.map(bill => bill.id === id ? { ...bill, autoPay: !bill.autoPay } : bill));
  };

  const handlePayNow = (bill: any) => {
    setSelectedBill(bill);
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

    setTimeout(() => {
      if (pin === '1234') {
        setMockHash(Math.random().toString(16).slice(2, 42));
        setStep(2);
        setIsProcessing(false);
      } else {
        setError('Incorrect PIN. Security Protocol alert triggered.');
        setIsProcessing(false);
      }
    }, 1200);
  };

  const handleGenerateSignature = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setMockSignature(btoa(mockHash + "_RSA_PRIV_KEY").slice(0, 80));
      setStep(3);
      setIsProcessing(false);
    }, 1500);
  };

  const finalizePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setSuccess(true);
      setIsProcessing(false);

      const transactions = JSON.parse(localStorage.getItem('citizenTransactions') || '[]');
      transactions.push({
        id: Math.random().toString(36).slice(2, 9),
        dept: selectedBill.name,
        amount: `₹${selectedBill.amount}`,
        timestamp: new Date().toISOString(),
        txid: `0x${mockHash.slice(0, 15)}...`
      });
      localStorage.setItem('citizenTransactions', JSON.stringify(transactions));

      setTimeout(() => setSelectedBill(null), 2500);
    }, 1800);
  };

  return (
    <Card className="shadow-2xl border-none bg-white dark:bg-zinc-950 overflow-hidden rounded-[2.5rem]">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 p-8">
        <div className="flex items-center justify-end">
          <Button variant="ghost" size="sm" className="hidden sm:flex text-indigo-600 font-semibold uppercase tracking-widest gap-2 hover:bg-indigo-50 px-6 rounded-full">
            {t('History')} <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {bills.map((bill, index) => {
            const Icon = bill.icon;
            return (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-indigo-600"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl border ${bill.bg} ${bill.color} shadow-lg shadow-zinc-100 dark:shadow-none`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl text-zinc-900 dark:text-white leading-tight uppercase tracking-tight">{t(bill.name)}</h4>
                      <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">{t(bill.provider)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/60 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-semibold text-zinc-900 dark:text-white">₹{bill.amount}</p>
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1 mt-1 uppercase tracking-widest">
                      Expires: {bill.dueDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Button
                      size="lg"
                      onClick={() => handlePayNow(bill)}
                      className={`font-semibold uppercase tracking-widest rounded-xl px-6 h-12 transition-all ${bill.autoPay
                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-none shadow-none"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        }`}
                      disabled={bill.autoPay}
                    >
                      {bill.autoPay ? t('Paid') : t('Pay Now')}
                    </Button>
                    <label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-400 cursor-pointer flex items-center gap-2 hover:text-indigo-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={bill.autoPay}
                        onChange={() => toggleAutoPay(bill.id)}
                        className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 h-3 w-3 bg-white dark:bg-zinc-800"
                      />
                      Auto-Settlement
                    </label>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>

      <AnimatePresence>
        {selectedBill && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-white/10 relative overflow-hidden"
            >
              <button
                onClick={() => !isProcessing && setSelectedBill(null)}
                className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                disabled={isProcessing}
              >
                <X className="w-6 h-6" />
              </button>

              {!success ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-8">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-semibold transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                            }`}>
                            {s}
                          </div>
                          {s < 3 && <div className={`w-8 h-1 transition-all ${step > s ? 'bg-indigo-600' : 'bg-zinc-100 dark:bg-zinc-800'}`} />}
                        </div>
                      ))}
                    </div>
                    <h3 className="text-3xl font-semibold text-zinc-900 dark:text-white uppercase tracking-tight italic">
                      {step === 1 ? 'Pin Auth' : step === 2 ? 'Crypt-Hash' : 'Secure Sign'}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {step === 1 && (
                      <div className="space-y-6">
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-2">Transaction Amount</p>
                          <p className="text-4xl font-semibold text-indigo-600">₹{selectedBill.amount}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 ml-2">4-Digit Security PIN</label>
                          <Input
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="••••"
                            className="text-center text-4xl tracking-widest font-semibold h-20 border-2 rounded-[1.5rem] focus:border-indigo-600"
                          />
                        </div>
                        {error && <p className="text-xs font-bold text-rose-500 text-center animate-bounce">{error}</p>}
                        <Button onClick={handleVerifyPin} disabled={isProcessing} className="w-full h-16 rounded-2xl font-semibold uppercase tracking-widest bg-zinc-900 text-white hover:bg-black transition-all">
                          {isProcessing ? "Authenticating..." : "Authorize Identity"}
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                          <Hash className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600 mb-2">SHA-40 Block Hash</p>
                          <p className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 break-all leading-relaxed font-bold">{mockHash}</p>
                        </div>
                        <Button onClick={handleGenerateSignature} disabled={isProcessing} className="w-full h-16 rounded-2xl font-semibold uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700">
                          {isProcessing ? "Processing RSA..." : "Confirm Hashing Step"}
                        </Button>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-800/30 text-center">
                          <Shield className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-600 mb-2">Final RSA-2048 Sign</p>
                          <p className="text-[10px] font-mono text-amber-800 dark:text-amber-300 break-all leading-relaxed font-bold">{mockSignature}</p>
                        </div>
                        <Button onClick={finalizePayment} disabled={isProcessing} className="w-full h-16 rounded-2xl font-semibold uppercase tracking-widest bg-zinc-900 text-white hover:bg-black">
                          {isProcessing ? "Broadcasting Block..." : "Finalize & Pay"}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-zinc-400">
                    <Lock className="w-3 h-3" />
                    <span className="text-[8px] font-semibold uppercase tracking-[0.5em]">Secure Ledger Layer</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-4xl font-semibold text-zinc-900 dark:text-white uppercase tracking-tighter">Paid Successfully</h3>
                  <p className="text-zinc-500 font-bold mt-2">Departmental node updated in real-time.</p>
                  <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Network Receipt</p>
                    <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 break-all font-bold">TX_NODE_VERIFIED_{Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}
