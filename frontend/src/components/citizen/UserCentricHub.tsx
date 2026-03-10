import React from 'react';
import { motion } from 'motion/react';
import {
    Receipt, FileText, Fingerprint, FolderKey, Landmark, Fuel,
    PiggyBank, Wallet, Shield, Globe, BookOpen, HeartPulse,
    ExternalLink, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

const services = [
    {
        title: 'ITR Filing',
        desc: 'Income Tax Return e-Filing portal',
        icon: Receipt,
        color: 'from-blue-500 to-blue-600',
        bgLight: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
        link: 'https://www.incometax.gov.in',
        tag: null,
    },
    {
        title: 'GST Portal',
        desc: 'Goods & Services Tax filings',
        icon: FileText,
        color: 'from-emerald-500 to-emerald-600',
        bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        link: 'https://www.gst.gov.in',
        tag: null,
    },
    {
        title: 'Aadhaar-PAN Link',
        desc: 'Link Aadhaar with PAN card',
        icon: Fingerprint,
        color: 'from-orange-500 to-orange-600',
        bgLight: 'bg-orange-50 dark:bg-orange-900/20',
        textColor: 'text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-200 dark:border-orange-800',
        link: 'https://www.incometax.gov.in/iec/foportal/help/how-to-link-aadhaar',
        tag: 'URGENT',
    },
    {
        title: 'DigiLocker',
        desc: 'Digital document vault by GOI',
        icon: FolderKey,
        color: 'from-violet-500 to-violet-600',
        bgLight: 'bg-violet-50 dark:bg-violet-900/20',
        textColor: 'text-violet-600 dark:text-violet-400',
        borderColor: 'border-violet-200 dark:border-violet-800',
        link: 'https://www.digilocker.gov.in',
        tag: null,
    },
    {
        title: 'DBT Status',
        desc: 'Track Direct Benefit Transfers',
        icon: Landmark,
        color: 'from-cyan-500 to-cyan-600',
        bgLight: 'bg-cyan-50 dark:bg-cyan-900/20',
        textColor: 'text-cyan-600 dark:text-cyan-400',
        borderColor: 'border-cyan-200 dark:border-cyan-800',
        link: 'https://dbtbharat.gov.in',
        tag: 'NEW',
    },
    {
        title: 'Gas Subsidy',
        desc: 'LPG subsidy check & claim',
        icon: Fuel,
        color: 'from-rose-500 to-rose-600',
        bgLight: 'bg-rose-50 dark:bg-rose-900/20',
        textColor: 'text-rose-600 dark:text-rose-400',
        borderColor: 'border-rose-200 dark:border-rose-800',
        link: 'https://www.mylpg.in',
        tag: null,
    },
    {
        title: 'Atal Pension (APY)',
        desc: 'Pension scheme for unorganised sector',
        icon: PiggyBank,
        color: 'from-amber-500 to-amber-600',
        bgLight: 'bg-amber-50 dark:bg-amber-900/20',
        textColor: 'text-amber-600 dark:text-amber-400',
        borderColor: 'border-amber-200 dark:border-amber-800',
        link: 'https://www.npscra.nsdl.co.in/scheme-details.php',
        tag: null,
    },
    {
        title: 'EPF Passbook',
        desc: 'Employee Provident Fund portal',
        icon: Wallet,
        color: 'from-indigo-500 to-indigo-600',
        bgLight: 'bg-indigo-50 dark:bg-indigo-900/20',
        textColor: 'text-indigo-600 dark:text-indigo-400',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
        link: 'https://passbook.epfindia.gov.in',
        tag: null,
    },
    {
        title: 'PM-Kisan Status',
        desc: 'Check PM-Kisan installment status',
        icon: Globe,
        color: 'from-green-500 to-green-600',
        bgLight: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-200 dark:border-green-800',
        link: 'https://pmkisan.gov.in',
        tag: 'NEW',
    },
    {
        title: 'Ayushman Bharat',
        desc: 'Health insurance scheme status',
        icon: HeartPulse,
        color: 'from-pink-500 to-pink-600',
        bgLight: 'bg-pink-50 dark:bg-pink-900/20',
        textColor: 'text-pink-600 dark:text-pink-400',
        borderColor: 'border-pink-200 dark:border-pink-800',
        link: 'https://pmjay.gov.in',
        tag: null,
    },
    {
        title: 'Scholarship Portal',
        desc: 'National Scholarship Portal (NSP)',
        icon: BookOpen,
        color: 'from-teal-500 to-teal-600',
        bgLight: 'bg-teal-50 dark:bg-teal-900/20',
        textColor: 'text-teal-600 dark:text-teal-400',
        borderColor: 'border-teal-200 dark:border-teal-800',
        link: 'https://scholarships.gov.in',
        tag: 'NEW',
    },
    {
        title: 'Cyber Security',
        desc: 'Report cyber fraud & complaints',
        icon: Shield,
        color: 'from-slate-500 to-slate-600',
        bgLight: 'bg-slate-50 dark:bg-slate-900/20',
        textColor: 'text-slate-600 dark:text-slate-400',
        borderColor: 'border-slate-200 dark:border-slate-800',
        link: 'https://cybercrime.gov.in',
        tag: null,
    },
];

export function UserCentricHub() {
    return (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold tracking-tight">User Centric Hub</CardTitle>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Financial E-Governance services at your fingertips</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.a
                                key={service.title}
                                href={service.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04, duration: 0.3 }}
                                className={`relative group flex flex-col items-center text-center p-4 rounded-2xl border ${service.borderColor} ${service.bgLight} hover:shadow-lg hover:scale-[1.03] transition-all duration-200 cursor-pointer`}
                            >
                                {/* Tag */}
                                {service.tag && (
                                    <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm ${service.tag === 'NEW'
                                            ? 'bg-green-500 text-white'
                                            : service.tag === 'URGENT'
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'bg-blue-500 text-white'
                                        }`}>
                                        {service.tag}
                                    </span>
                                )}

                                {/* Icon */}
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md mb-3 group-hover:shadow-lg transition-shadow`}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Title */}
                                <h4 className={`text-sm font-semibold ${service.textColor} leading-tight mb-1`}>
                                    {service.title}
                                </h4>

                                {/* Description */}
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">
                                    {service.desc}
                                </p>

                                {/* External link indicator */}
                                <ExternalLink className="w-3 h-3 text-zinc-300 dark:text-zinc-600 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.a>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
