import React from 'react';
import { motion } from 'motion/react';
import { CitizenWallet } from '@/src/components/citizen/CitizenWallet';
import { UtilityDashboard } from '@/src/components/citizen/UtilityDashboard';
import { FinanceInsights } from '@/src/components/citizen/FinanceInsights';
import { PaymentTransferTrends } from '@/src/components/citizen/DigitalFinancialHealthScore';
import { useLanguage } from '@/src/context/LanguageContext';

export function CitizenDashboard() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <CitizenWallet />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <PaymentTransferTrends />
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <UtilityDashboard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <FinanceInsights />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
