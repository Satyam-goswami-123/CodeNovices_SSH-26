import React from 'react';
import { CreditCard } from 'lucide-react';
import { DBTTracker } from '@/src/components/citizen/DBTTracker';

export function PaymentTrackingPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-8 h-8 text-blue-600" /> Payment & DBT Tracking
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Track the real-time status of your Direct Benefit Transfers (DBT) and subsidy payments.
                </p>
            </div>

            <div className="max-w-4xl">
                <DBTTracker />
            </div>
        </div>
    );
}
