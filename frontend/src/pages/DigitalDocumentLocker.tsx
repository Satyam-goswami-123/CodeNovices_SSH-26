import React from 'react';
import { motion } from 'motion/react';
import { FileText, Shield, FileCheck, FileBadge, Link2, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { DocumentVerification } from '@/src/components/citizen/DocumentVerification';

const savedDocuments = [
    { id: 'DOC-1', name: 'Aadhaar Card', type: 'Identity Proof', date: '12 Jan 2024', status: 'Verified', icon: FileCheck, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800' },
    { id: 'DOC-2', name: 'PAN Card', type: 'Financial Identity', date: '05 Feb 2024', status: 'Verified', icon: FileBadge, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800' },
    { id: 'DOC-3', name: 'Income Certificate', type: 'Govt. Record', date: '18 Mar 2024', status: 'Pending', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800' },
    { id: 'DOC-4', name: 'Land Record (Khata)', type: 'Property', date: '22 Apr 2024', status: 'Verified', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800' },
];

export function DigitalDocumentLocker() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-8 h-8 text-blue-600" /> Digital Document Locker
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Securely store, manage, and verify your legally binding government documents in one place.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Span: Upload & Verification */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <DocumentVerification />
                    </motion.div>

                    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border-indigo-100 dark:border-indigo-900/60">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">DigiLocker Integration</h3>
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">You can auto-import all your issued documents directly from your government DigiLocker account.</p>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm">
                                <Link2 className="w-4 h-4" /> Link DigiLocker
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Span: Saved Documents */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-full border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Your Vault</CardTitle>
                                    <CardDescription>A consolidated list of all your uploaded and verified documents.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hidden sm:flex">Filter by Type</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                                {savedDocuments.map((doc, index) => {
                                    const Icon = doc.icon;
                                    return (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (index * 0.1) }}
                                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl border ${doc.bg} ${doc.color} flex-shrink-0`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                                        {doc.name}
                                                        {doc.status === 'Verified' ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                                Pending
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                                                        <span>{doc.type}</span>
                                                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                                                        <span>Added: {doc.date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 pl-14 sm:pl-0">
                                                <Button variant="ghost" size="sm" className="gap-2 text-zinc-600 dark:text-zinc-300">
                                                    <ExternalLink className="w-4 h-4" /> View
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Download className="w-4 h-4" /> PDF
                                                </Button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
