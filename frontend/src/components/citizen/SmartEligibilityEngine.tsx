import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, UserCheck, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { getGeminiResponse } from '@/src/lib/gemini';

export function SmartEligibilityEngine() {
    const [formData, setFormData] = useState({
        income: '',
        age: '',
        category: 'General',
        location: ''
    });

    const [schemes, setSchemes] = useState<any[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [notEligible, setNotEligible] = useState(false);

    const handleAnalyze = async () => {
        // Age validation — must be 18+
        const age = parseInt(formData.age);
        if (!formData.age || isNaN(age)) {
            alert('Please enter a valid age.');
            return;
        }

        if (age < 18) {
            setNotEligible(true);
            setSchemes([]);
            return;
        }

        setNotEligible(false);
        setIsAnalyzing(true);

        const systemPrompt = `You are a Government Scheme Expert. Based on user details, suggest 3 real Indian government schemes.
        Output ONLY a JSON array of objects with keys: id, name, amount, match. 
        Example format: [{"id": 1, "name": "Scheme Name", "amount": "₹ Grant Amt", "match": "95%"}]`;

        const userInput = `Income: ${formData.income}, Age: ${formData.age}, Category: ${formData.category}, Location: ${formData.location}`;

        try {
            const response = await getGeminiResponse(userInput, systemPrompt);
            const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            setSchemes(parsed);
        } catch (error) {
            console.error("Eligibility analysis error", error);
            setSchemes([
                { id: 1, name: 'PM Kisan Samman Nidhi', amount: '₹6,000/year', match: '92%' },
                { id: 2, name: 'Ayushman Bharat Yojana', amount: '₹5,00,000 health cover', match: '88%' },
                { id: 3, name: 'PM Awas Yojana', amount: '₹2.67 Lakh subsidy', match: '75%' }
            ]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setSchemes([]);
        setNotEligible(false);
        setFormData({ income: '', age: '', category: 'General', location: '' });
    };

    return (
        <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white shadow-sm">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">Smart Eligibility Engine</CardTitle>
                        <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1">AI-powered scheme recommendations based on your profile.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {/* Not Eligible Popup */}
                <AnimatePresence>
                    {notEligible && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mb-6 p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-center"
                        >
                            <div className="flex justify-center mb-3">
                                <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full">
                                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Not Eligible</h3>
                            <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                                You must be 18 years or older to be eligible for government schemes.
                            </p>
                            <p className="text-xs text-red-500 dark:text-red-500 mb-4">
                                Your entered age: {formData.age} years — Minimum required: 18 years
                            </p>
                            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                                    Some schemes like scholarships may be available for minors. Contact your nearest Common Service Centre (CSC).
                                </span>
                            </div>
                            <Button onClick={handleReset} variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30">
                                Try Again
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!schemes.length && !notEligible ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Annual Income (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 250000"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.income}
                                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Age</label>
                            <input
                                type="number"
                                placeholder="e.g. 35"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>General</option>
                                <option>OBC</option>
                                <option>SC/ST</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location Details</label>
                            <input
                                type="text"
                                placeholder="State / District"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2 mt-4">
                            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full gap-2 text-white bg-blue-600 hover:bg-blue-700">
                                {isAnalyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                {isAnalyzing ? 'Analyzing Profile...' : 'Find Eligible Schemes'}
                            </Button>
                        </div>
                    </div>
                ) : schemes.length > 0 ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" /> Top Matches Found
                            </h3>
                            <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
                        </div>
                        {schemes.map((scheme, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                key={scheme.id} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">{scheme.name}</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{scheme.amount}</p>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs font-bold tracking-wide">
                                        {scheme.match} Match
                                    </div>
                                    <div className="mt-2">
                                        <Button size="sm" className="h-7 text-xs px-3">Apply Now</Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : null}
            </CardContent>
        </Card>
    );
}

