import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ArrowUpRight, ArrowDownLeft, QrCode, Plus, X, CheckCircle2, Copy, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useLanguage } from '@/src/context/LanguageContext';

const WALLET_BALANCE_KEY = 'govpay_wallet_balance';
const WALLET_TRANSACTIONS_KEY = 'govpay_wallet_transactions';
const INITIAL_BALANCE = 12500.50;
const QR_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg';

function getBalance(): number {
  const stored = localStorage.getItem(WALLET_BALANCE_KEY);
  return stored ? parseFloat(stored) : INITIAL_BALANCE;
}

function setStoredBalance(val: number) {
  localStorage.setItem(WALLET_BALANCE_KEY, val.toFixed(2));
}

function getTransactions(): any[] {
  return JSON.parse(localStorage.getItem(WALLET_TRANSACTIONS_KEY) || '[]');
}

function addTransaction(tx: any) {
  const txs = getTransactions();
  txs.unshift(tx);
  localStorage.setItem(WALLET_TRANSACTIONS_KEY, JSON.stringify(txs.slice(0, 50)));
}

export function CitizenWallet() {
  const { t } = useLanguage();
  const [balance, setBalance] = useState(getBalance());
  const [modal, setModal] = useState<'add' | 'pay' | 'receive' | 'qr' | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactions, setTransactions] = useState<any[]>(getTransactions());
  const [copied, setCopied] = useState(false);

  // Sync balance from localStorage (in case utility payments change it)
  useEffect(() => {
    const interval = setInterval(() => {
      const citizenTxs = JSON.parse(localStorage.getItem('citizenTransactions') || '[]');
      const lastSyncCount = parseInt(localStorage.getItem('govpay_synced_count') || '0');
      if (citizenTxs.length > lastSyncCount) {
        const newTxs = citizenTxs.slice(lastSyncCount);
        let currentBal = getBalance();
        newTxs.forEach((tx: any) => {
          const amt = parseFloat(tx.amount.replace('₹', '').replace(',', ''));
          if (!isNaN(amt)) {
            currentBal -= amt;
            addTransaction({
              id: tx.id,
              type: 'debit',
              label: `Dept: ${tx.dept}`,
              amount: amt,
              time: tx.timestamp
            });
          }
        });
        setStoredBalance(Math.max(0, currentBal));
        setBalance(Math.max(0, currentBal));
        setTransactions(getTransactions());
        localStorage.setItem('govpay_synced_count', citizenTxs.length.toString());
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const walletAddress = 'GOVPAY-CIT-RAHUL-9824';

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      const newBal = balance + amt;
      setBalance(newBal);
      setStoredBalance(newBal);
      addTransaction({
        id: Math.random().toString(36).slice(2, 8),
        type: 'credit',
        label: 'Added via UPI/QR',
        amount: amt,
        time: new Date().toISOString()
      });
      setTransactions(getTransactions());
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => { setModal(null); setSuccess(false); setAmount(''); }, 2000);
    }, 1500);
  };

  const handlePay = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || amt > balance) return;
    setProcessing(true);
    setTimeout(() => {
      const newBal = balance - amt;
      setBalance(newBal);
      setStoredBalance(newBal);
      addTransaction({
        id: Math.random().toString(36).slice(2, 8),
        type: 'debit',
        label: recipient || 'QR Payment',
        amount: amt,
        time: new Date().toISOString()
      });
      const citizenTxs = JSON.parse(localStorage.getItem('citizenTransactions') || '[]');
      citizenTxs.push({
        id: Math.random().toString(36).slice(2, 9),
        dept: recipient || 'QR Payment',
        amount: `₹${amt}`,
        timestamp: new Date().toISOString(),
        txid: `0x${Math.random().toString(16).slice(2, 17)}...`
      });
      localStorage.setItem('citizenTransactions', JSON.stringify(citizenTxs));
      const syncCount = parseInt(localStorage.getItem('govpay_synced_count') || '0');
      localStorage.setItem('govpay_synced_count', (syncCount + 1).toString());

      setTransactions(getTransactions());
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => { setModal(null); setSuccess(false); setAmount(''); setRecipient(''); }, 2000);
    }, 1500);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-100 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              {t('GovPay Wallet')}
            </CardTitle>
            <button onClick={() => setModal('qr')} className="hover:opacity-80 transition-opacity">
              <QrCode className="h-6 w-6 text-blue-200 cursor-pointer hover:text-white transition-colors" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-blue-200 mb-1">{t('Available Balance')}</p>
            <h2 className="text-4xl font-bold tracking-tight">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button onClick={() => { setModal('add'); setSuccess(false); setAmount(''); }} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
              <Plus className="h-4 w-4 mr-2" />
              {t('Add')}
            </Button>
            <Button onClick={() => { setModal('pay'); setSuccess(false); setAmount(''); setRecipient(''); }} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              {t('Pay')}
            </Button>
            <Button onClick={() => setModal('receive')} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              {t('Receive')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setModal(null); setSuccess(false); }}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* ADD MONEY */}
              {modal === 'add' && !success && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Add Money</h3>
                    <p className="text-zinc-500 text-sm mt-1">Top up your GovPay Wallet via UPI</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                      <img src={QR_IMAGE_URL} alt="Scan QR to Pay" className="w-[160px] h-[160px] object-contain rounded-lg" />
                      <p className="text-xs text-center text-zinc-400 font-medium mt-3">Scan to Pay via UPI</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickAmounts.map(qa => (
                        <button key={qa} onClick={() => setAmount(qa.toString())} className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${amount === qa.toString() ? 'bg-blue-600 text-white border-blue-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-blue-400'}`}>
                          ₹{qa}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount (₹)"
                      className="text-center text-xl font-bold h-14 rounded-lg border focus:border-emerald-500"
                    />
                    <Button onClick={handleAdd} disabled={processing || !amount || parseFloat(amount) <= 0} className="w-full h-12 rounded-md font-medium bg-emerald-600 hover:bg-emerald-700 text-white">
                      {processing ? "Processing..." : `Add ₹${amount || '0'} to Wallet`}
                    </Button>
                  </div>
                </div>
              )}

              {/* PAY */}
              {modal === 'pay' && !success && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ArrowUpRight className="w-7 h-7 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Send Payment</h3>
                    <p className="text-zinc-500 text-sm mt-1">Pay via QR Code or direct transfer</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                      <img src={QR_IMAGE_URL} alt="Payment QR" className="w-[140px] h-[140px] object-contain rounded-lg" />
                      <p className="text-xs text-center text-zinc-400 font-medium mt-3">Payment QR Preview</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Recipient Name / UPI ID"
                      className="text-center font-medium h-12 rounded-lg border focus:border-rose-500"
                    />
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount (₹)"
                      className="text-center text-xl font-bold h-14 rounded-lg border focus:border-rose-500"
                    />
                    <div className="text-center">
                      <p className="text-xs font-medium text-zinc-400">Available: ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <Button onClick={handlePay} disabled={processing || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance} className="w-full h-12 rounded-md font-medium bg-rose-600 hover:bg-rose-700 text-white">
                      {processing ? "Sending..." : `Pay ₹${amount || '0'}`}
                    </Button>
                  </div>
                </div>
              )}

              {/* RECEIVE */}
              {modal === 'receive' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ArrowDownLeft className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Receive Money</h3>
                    <p className="text-zinc-500 text-sm mt-1">Share QR or Wallet ID to receive</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                      <img src={QR_IMAGE_URL} alt="Your QR Code" className="w-[180px] h-[180px] object-contain rounded-lg" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <p className="flex-1 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300 truncate">{walletAddress}</p>
                    <button onClick={copyAddress} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors">
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-zinc-500">Transaction History</h4>
                    {transactions.length === 0 ? (
                      <div className="text-center py-6 text-zinc-400">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-medium text-sm">No transactions yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {transactions.map((tx: any, i: number) => (
                          <div key={tx.id || i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-700">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'}`}>
                                {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{tx.label}</p>
                                <p className="text-[10px] text-zinc-400">{new Date(tx.time).toLocaleString()}</p>
                              </div>
                            </div>
                            <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* QR CODE VIEW */}
              {modal === 'qr' && (
                <div className="space-y-6 text-center">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Your Wallet QR</h3>
                    <p className="text-zinc-500 text-sm mt-1">Let others scan to pay you</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                      <img src={QR_IMAGE_URL} alt="Wallet QR Code" className="w-[220px] h-[220px] object-contain rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{walletAddress}</p>
                    <p className="text-xs text-zinc-400">GovPay UPI • Citizen Rahul</p>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {success && (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Transaction Successful!</h3>
                  <p className="text-zinc-500 mt-2">Updated Balance:</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
