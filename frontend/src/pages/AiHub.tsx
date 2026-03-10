import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Sparkles, AlertTriangle, Lightbulb, FileSearch, Send, Bot, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { getGeminiResponse } from '@/src/lib/gemini';
import Markdown from 'markdown-to-jsx';

export function AiHub() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<'scan' | 'chat'>('scan');

    // Chatbot State
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
        { role: 'ai', content: 'Hello! I am your Government AI Assistant. I have access to your governance profile. You can ask me about schemes you are eligible for, tax calculations, or how to resolve document discrepancies.' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const runAnalysis = () => {
        setIsAnalyzing(true);
        setResults(false);
        setActiveView('scan');
        setTimeout(() => setIsAnalyzing(false), 2500);
        setTimeout(() => setResults(true), 2500);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInputMessage('');
        setIsTyping(true);

        // System Context given to Gemini
        const systemPrompt = `You are the official AI Assistant for the Fintech-Enabled E-Governance Portal of India. 
        Your job is to assist citizens with government services, schemes, subsidies, property taxes, documents (Aadhaar, PAN), and DBT payments.
        You are professional, concise, and helpful. Use simple terms. Format output in brief paragraphs.
        
        The user's known profile data: 
        - Name: Rahul
        - Location: Tier-2 City Address
        - Upcoming Bill: Property Tax ₹4,500 due Dec 31
        - Eligibility: PM Solar Subsidy, Education Loan Subsidy
        - Warnings: Discrepancy between Aadhaar address and Electricity bill address.`;

        // Fetch AI Response via Gemini SDK
        const responseData = await getGeminiResponse(userMsg, systemPrompt);

        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'ai', content: responseData }]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <BrainCircuit className="w-8 h-8 text-indigo-600" /> AI Hub (Smart Analysis Center)
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Your personal AI assistant to analyze records, detect risks, and answer governance queries.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                                <FileSearch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                Profile Scan
                            </CardTitle>
                            <CardDescription>
                                Run a complete scan across all your linked government databases.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pb-8 pt-4">
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-full bg-indigo-600 opacity-20 blur-xl transition-all duration-1000 ${isAnalyzing ? 'scale-150 animate-pulse' : 'scale-100'}`}></div>
                                <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 relative z-10 transition-colors ${isAnalyzing ? 'border-indigo-500 text-indigo-600 bg-white' : 'border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600'}`}>
                                    <BrainCircuit className={`w-12 h-12 ${isAnalyzing ? 'animate-bounce' : ''}`} />
                                </div>
                            </div>
                            <Button
                                className="mt-8 w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <><Sparkles className="w-4 h-4 animate-spin" /> Processing Data...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4" /> Start AI Analysis</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardContent className="p-4">
                            <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg flex">
                                <button
                                    onClick={() => setActiveView('scan')}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeView === 'scan' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                >
                                    Scan Results
                                </button>
                                <button
                                    onClick={() => setActiveView('chat')}
                                    className={`flex-1 flex justify-center items-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${activeView === 'chat' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                >
                                    <MessageSquare className="w-4 h-4" /> Ask AI
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-2 space-y-6 flex flex-col h-[calc(100vh-14rem)] min-h-[600px]">

                    {activeView === 'scan' && (
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-6">
                            {!results && !isAnalyzing && (
                                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center bg-white/50 dark:bg-zinc-950/50 min-h-[400px]">
                                    <BrainCircuit className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Ready to Analyze</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 max-w-md">Click the "Start AI Analysis" button to scan your profile for scheme recommendations, financial insights, and potential data risks.</p>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="h-full flex flex-col justify-center space-y-8 p-8 max-w-lg mx-auto w-full min-h-[400px]">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-indigo-700 dark:text-indigo-400">
                                            <span>Analyzing Income Records...</span>
                                            <span className="animate-pulse">Loading</span>
                                        </div>
                                        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.8 }} className="h-full bg-indigo-500"></motion.div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-indigo-700 dark:text-indigo-400">
                                            <span>Cross-checking Subsidies...</span>
                                            <span className="animate-pulse">Loading</span>
                                        </div>
                                        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-indigo-500"></motion.div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-indigo-700 dark:text-indigo-400">
                                            <span>Detecting Discrepancies...</span>
                                            <span className="animate-pulse">Loading</span>
                                        </div>
                                        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.2, delay: 0.4 }} className="h-full bg-indigo-500"></motion.div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {results && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 h-full">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg">
                                                        <Sparkles className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="font-semibold text-green-900 dark:text-green-100 text-lg">Recommended Schemes (2)</h3>
                                                </div>
                                                <ul className="space-y-3">
                                                    <li className="flex gap-2">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                                                        <p className="text-sm font-medium text-green-800 dark:text-green-300">You are highly eligible for the 'PM Solar Subsidy'. Applying now could save you 40% on installation.</p>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                                                        <p className="text-sm font-medium text-green-800 dark:text-green-300">Your income matches criteria for Education Loan Interest Subsidy.</p>
                                                    </li>
                                                </ul>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 h-full">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg">
                                                        <AlertTriangle className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-lg">Action Needed (1)</h3>
                                                </div>
                                                <ul className="space-y-3">
                                                    <li className="flex gap-2">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></div>
                                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Your address on Aadhaar does not match your electricity bill profile. Please update to avoid subsidy delays.</p>
                                                    </li>
                                                </ul>
                                                <Button size="sm" className="mt-4 bg-amber-600 hover:bg-amber-700 text-white shadow-none">Update Records Now</Button>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card className="border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
                                                    <Lightbulb className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">Smart Insights</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                                                    Based on your historical spending and utility consumption, our ML model predicts a <strong className="font-extrabold text-blue-900 dark:text-blue-100">12% increase</strong> in water utility costs next quarter. Switching to the 'Jal Jeevan Micro-Meter' tier can offset this completely.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-white/60 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">Subsidy Optimization</span>
                                                    <span className="px-3 py-1 bg-white/60 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800">Cost Prediction</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {activeView === 'chat' && (
                        <Card className="flex-1 flex flex-col border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
                            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Bot className="w-5 h-5 text-indigo-600" />
                                    Ask AI Anything
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/20">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {msg.role === 'ai' && (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center flex-shrink-0">
                                                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                            )}
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm'
                                                }`}>
                                                <div className="text-sm leading-relaxed prose dark:prose-invert prose-sm max-w-none">
                                                    {msg.role === 'ai' ? (
                                                        <Markdown options={{
                                                            overrides: {
                                                                a: { props: { className: 'text-indigo-600 dark:text-indigo-400 hover:underline' } },
                                                                p: { props: { className: 'mb-2 last:mb-0' } },
                                                                ul: { props: { className: 'list-disc pl-4 mb-2' } },
                                                                ol: { props: { className: 'list-decimal pl-4 mb-2' } },
                                                                strong: { props: { className: 'font-semibold text-zinc-900 dark:text-white' } },
                                                            }
                                                        }}>
                                                            {msg.content}
                                                        </Markdown>
                                                    ) : (
                                                        msg.content
                                                    )}
                                                </div>
                                            </div>
                                            {msg.role === 'user' && (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </AnimatePresence>
                            </CardContent>
                            <CardFooter className="p-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
                                <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Ask about schemes, bills, or documents..."
                                        className="flex-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                                    />
                                    <Button type="submit" size="icon" disabled={!inputMessage.trim() || isTyping} className="rounded-full bg-indigo-600 hover:bg-indigo-700 shrink-0">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
