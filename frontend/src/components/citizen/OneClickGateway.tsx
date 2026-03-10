import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

const platforms = [
    {
        name: 'DigiLocker',
        desc: 'Digital Documents',
        url: 'https://www.digilocker.gov.in',
        gradient: 'from-blue-600 to-blue-800',
        hoverGlow: 'hover:shadow-blue-500/30',
        icon: '📁',
    },
    {
        name: 'UMANG',
        desc: 'Mobile Services',
        url: 'https://web.umang.gov.in',
        gradient: 'from-orange-500 to-red-600',
        hoverGlow: 'hover:shadow-orange-500/30',
        icon: '📱',
    },
    {
        name: 'MyGov',
        desc: 'Citizen Engagement',
        url: 'https://www.mygov.in',
        gradient: 'from-emerald-500 to-teal-700',
        hoverGlow: 'hover:shadow-emerald-500/30',
        icon: '🏛️',
    },
    {
        name: 'Income Tax',
        desc: 'Tax Filing & PAN',
        url: 'https://www.incometax.gov.in',
        gradient: 'from-indigo-600 to-violet-800',
        hoverGlow: 'hover:shadow-indigo-500/30',
        icon: '💰',
    },
    {
        name: 'PM-Kisan',
        desc: 'Farmer Schemes',
        url: 'https://pmkisan.gov.in',
        gradient: 'from-green-500 to-green-700',
        hoverGlow: 'hover:shadow-green-500/30',
        icon: '🌾',
    },
    {
        name: 'Scholarship',
        desc: 'NSP for Students',
        url: 'https://scholarships.gov.in',
        gradient: 'from-purple-500 to-purple-800',
        hoverGlow: 'hover:shadow-purple-500/30',
        icon: '🎓',
    },
    {
        name: 'Parivahan',
        desc: 'DL & RC Services',
        url: 'https://parivahan.gov.in',
        gradient: 'from-cyan-500 to-sky-700',
        hoverGlow: 'hover:shadow-cyan-500/30',
        icon: '🚗',
    },
];

export function OneClickGateway() {
    return (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-md">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold tracking-tight">One-Click Gateway</CardTitle>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Single window access to top government platforms</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                    {platforms.map((platform, index) => (
                        <motion.a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.35 }}
                            className={`group relative flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br ${platform.gradient} text-white shadow-md ${platform.hoverGlow} hover:shadow-xl hover:scale-[1.05] active:scale-[0.97] transition-all duration-200 cursor-pointer min-h-[130px]`}
                        >
                            {/* Glow overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />

                            {/* Icon */}
                            <span className="text-3xl mb-2 drop-shadow-md relative z-10">{platform.icon}</span>

                            {/* Title */}
                            <h4 className="text-sm font-semibold leading-tight relative z-10 mb-0.5">
                                {platform.name}
                            </h4>

                            {/* Description */}
                            <p className="text-[10px] text-white/70 leading-snug relative z-10">
                                {platform.desc}
                            </p>

                            {/* External link */}
                            <ExternalLink className="w-3.5 h-3.5 absolute top-2.5 right-2.5 text-white/30 group-hover:text-white/70 transition-colors z-10" />
                        </motion.a>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
