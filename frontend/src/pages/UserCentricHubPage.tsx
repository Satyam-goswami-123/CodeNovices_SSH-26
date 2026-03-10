import React from 'react';
import { Sparkles } from 'lucide-react';
import { UserCentricHub } from '@/src/components/citizen/UserCentricHub';

export function UserCentricHubPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-purple-500" /> User Centric Hub
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Financial E-Governance tools and services at your fingertips.
                </p>
            </div>

            <UserCentricHub />
        </div>
    );
}
