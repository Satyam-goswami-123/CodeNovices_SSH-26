import React from 'react';
import { Zap } from 'lucide-react';
import { OneClickGateway } from '@/src/components/citizen/OneClickGateway';

export function GatewayPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-8 h-8 text-amber-500" /> One-Click Gateway
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Single window access to all major government platforms — click any tile to visit directly.
                </p>
            </div>

            <OneClickGateway />
        </div>
    );
}
