import React from 'react';
import { SmartEligibilityEngine } from '@/src/components/citizen/SmartEligibilityEngine';
import { Search } from 'lucide-react';

export function EligibilityEnginePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <Search className="w-8 h-8 text-blue-600" /> Eligibility Engine
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Discover government schemes tailored exactly to your profile using AI.
                </p>
            </div>

            <div className="max-w-4xl">
                <SmartEligibilityEngine />
            </div>
        </div>
    );
}
