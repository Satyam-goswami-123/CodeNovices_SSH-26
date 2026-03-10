import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, Building2, Banknote, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { getGeminiResponse } from '@/src/lib/gemini';

const dbtSchemes = [
  {
    id: 1,
    name: 'PM Kisan Samman Nidhi',
    amount: 2000,
    date: 'Payment Cycle 15',
    status: 'pending',
    userDetails: {
      aadhaarLinked: false,
      bankVerified: true,
      npciStatus: 'Not mapped',
      kycStatus: 'Incomplete'
    }
  },
  {
    id: 2,
    name: 'LPG Subsidy',
    amount: 300,
    date: '15 Feb 2024',
    status: 'credited',
    userDetails: {
      aadhaarLinked: true,
      bankVerified: true,
      npciStatus: 'Mapped'
    }
  },
  {
    id: 3,
    name: 'Scholarship Payments',
    amount: 5000,
    date: 'Processing',
    status: 'processing',
    userDetails: {
      aadhaarLinked: true,
      bankVerified: true,
      npciStatus: 'Mapped'
    }
  }
];

export function DBTTracker() {
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [aiResponses, setAiResponses] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleGetAiHelp = async (scheme: typeof dbtSchemes[0]) => {
    if (analyzingId === scheme.id) return;

    setAnalyzingId(scheme.id);
    setExpandedId(scheme.id);

    const systemPrompt = `You are a Smart Government Assistant. A user is asking why their DBT payment is pending.
    Based on the provided user data, explain the exact reason and suggest 3-4 specific actions.
    Format your response with a clear 'Reason' and then a bulleted 'Action Required' list. 
    Keep it concise and helpful.`;

    const userInput = `Scheme: ${scheme.name}
    Status: ${scheme.status}
    User Data:
    - Aadhaar Linked: ${scheme.userDetails.aadhaarLinked ? 'Yes' : 'No'}
    - Bank Verified: ${scheme.userDetails.bankVerified ? 'Yes' : 'No'}
    - NPCI Status: ${scheme.userDetails.npciStatus}
    - KYC Status: ${scheme.userDetails.kycStatus || 'Verified'}`;

    try {
      const response = await getGeminiResponse(userInput, systemPrompt);
      setAiResponses(prev => ({ ...prev, [scheme.id]: response }));
    } catch (error) {
      console.error("AI Analysis error", error);
      setAiResponses(prev => ({ ...prev, [scheme.id]: "I'm having trouble connecting to the analysis hub. However, based on my internal rules, it seems your Aadhaar is not linked to your bank account." }));
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Payment & DBT Tracking</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1">
              Intelligent monitoring of your Direct Benefit Transfers and subsidies.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {dbtSchemes.map((scheme) => (
          <div key={scheme.id} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 transition-all hover:border-indigo-300 dark:hover:border-indigo-800">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${scheme.status === 'credited' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    scheme.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                  {scheme.status === 'credited' ? <CheckCircle2 className="w-5 h-5" /> :
                    scheme.status === 'pending' ? <AlertCircle className="w-5 h-5" /> :
                      <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">{scheme.name}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">₹{scheme.amount} • {scheme.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${scheme.status === 'credited' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                    scheme.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                  }`}>
                  {scheme.status}
                </span>

                {scheme.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 border-amber-200 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40"
                    onClick={() => handleGetAiHelp(scheme)}
                    disabled={analyzingId === scheme.id}
                  >
                    {analyzingId === scheme.id ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Explain Status
                  </Button>
                )}

                <button
                  onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {expandedId === scheme.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === scheme.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-4"
                >
                  {scheme.status === 'pending' && aiResponses[scheme.id] ? (
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 font-bold" />
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Smart Assistant Explanation</span>
                      </div>
                      <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                        {aiResponses[scheme.id]}
                      </div>
                      <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-800/60 flex justify-between items-center">
                        <span className="text-[10px] text-indigo-500 font-medium">Nearest Help: Common Service Center (CSC)</span>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] text-indigo-600 hover:bg-indigo-100">Locate CSC</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-200 dark:bg-zinc-700 -z-10"></div>
                        <div className="flex justify-between">
                          {[
                            { label: 'Approved', date: 'Step 1', done: true },
                            { label: 'Bank Verified', date: 'Step 2', done: scheme.status !== 'pending' },
                            { label: 'NPCI Mapping', date: 'Step 3', done: scheme.status === 'credited' },
                            { label: 'Funds Disbursed', date: 'Step 4', done: scheme.status === 'credited' }
                          ].map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500 text-white shadow-sm shadow-green-200' :
                                  'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                                }`}>
                                {step.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                              </div>
                              <div className="text-center">
                                <p className={`text-[10px] font-bold ${step.done ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>{step.label}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
