import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Home, FileText, CreditCard, LayoutDashboard, BrainCircuit, Landmark, Search, Database, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '@/src/context/LanguageContext';

export function Sidebar({ userRole }: { userRole: string | null }) {
    const location = useLocation();
    const { t } = useLanguage();

    const citizenLinks = [
        { name: 'Dashboard', href: '/citizen', icon: LayoutDashboard },
        { name: 'Eligibility Engine', href: '/eligibility', icon: Search },
        { name: 'Smart AI Hub', href: '/ai-hub', icon: BrainCircuit },
        { name: 'Blockchain Ledger', href: '/admin/blockchain', icon: Database },
        { name: 'Land Verification', href: '/land-verification', icon: Map },
        { name: 'Documents', href: '/locker', icon: FileText },
        { name: 'Payments', href: '/payments', icon: CreditCard },
        { name: 'Gateway', href: '/gateway', icon: Zap },
        { name: 'User Hub', href: '/user-hub', icon: Sparkles },
    ];

    const adminLinks = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Blockchain Ledger', href: '/admin/blockchain', icon: Database },
    ];

    const links = userRole === 'admin' ? adminLinks : citizenLinks;

    return (
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
            <div className="space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-blue-700 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-500")} />
                            {t(link.name)}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
