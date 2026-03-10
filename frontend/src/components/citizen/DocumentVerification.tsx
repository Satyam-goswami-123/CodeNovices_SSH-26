import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useLanguage } from '@/src/context/LanguageContext';

export function DocumentVerification() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setExtractedData(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setStatus('uploading');

    // Simulate upload and OCR processing
    setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setStatus('success');
        setExtractedData({
          name: 'Suman bhai',
          dob: '01/01/1953',
          idNumber: 'XXXX-XXXX-1234',
          address: 'ghoghalgoav ,punasa,khandwa,madhya pradesh 451001',
          documentType: 'Aadhaar Card',
          confidenceScore: '98.5%'
        });
      }, 2000);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('AI-OCR Document Verification')}</CardTitle>
        <CardDescription>{t('Upload your ID (Aadhaar/PAN) for automatic detail extraction')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf"
          />

          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-12 h-12 text-blue-500" />
              <p className="font-medium text-zinc-900 dark:text-white">{file.name}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <UploadCloud className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{t('Click to upload or drag and drop')}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
              </div>
            </div>
          )}
        </div>

        {file && status === 'idle' && (
          <Button onClick={handleUpload} className="w-full">
            {t('Start AI Verification')}
          </Button>
        )}

        {status === 'uploading' && (
          <div className="flex items-center justify-center gap-3 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{t('Uploading document securely...')}</span>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex items-center justify-center gap-3 text-indigo-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{t('AI is extracting details...')}</span>
          </div>
        )}

        <AnimatePresence>
          {status === 'success' && extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4 text-green-700 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
                <h4 className="font-semibold text-lg">{t('Verification Successful')}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('Document Type')}</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{extractedData.documentType}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('Confidence Score')}</p>
                  <p className="font-medium text-green-600 dark:text-green-400">{extractedData.confidenceScore}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('Full Name')}</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{extractedData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('Date of Birth')}</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{extractedData.dob}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('ID Number')}</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{extractedData.idNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('Address')}</p>
                  <p className="font-medium text-zinc-900 dark:text-white">{extractedData.address}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="w-full" onClick={() => { setFile(null); setStatus('idle'); setExtractedData(null); }}>
                  {t('Upload Another')}
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {t('Confirm & Save')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
