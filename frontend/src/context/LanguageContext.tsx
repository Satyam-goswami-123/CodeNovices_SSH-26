import React, { createContext, useContext, useState } from 'react';

export type LangCode = 'EN' | 'HI' | 'MR' | 'TA' | 'BN';

const translations: Record<string, Record<LangCode, string>> = {
    // Navbar
    'Administrator': { EN: 'Administrator', HI: 'प्रशासक', MR: 'प्रशासक', TA: 'நிர்வாகி', BN: 'প্রশাসক' },
    'Citizen': { EN: 'Citizen', HI: 'नागरिक', MR: 'नागरिक', TA: 'குடிமகன்', BN: 'নাগরিক' },
    'Logout': { EN: 'Logout', HI: 'लॉग आउट', MR: 'बाहेर पडा', TA: 'வெளியேறு', BN: 'লগ আউট' },
    'Login': { EN: 'Login', HI: 'लॉग इन', MR: 'लॉग इन', TA: 'உள்நுழை', BN: 'লগ ইন' },
    'Register': { EN: 'Register', HI: 'पंजीकरण', MR: 'नोंदणी', TA: 'பதிவு', BN: 'নিবন্ধন' },

    // Sidebar
    'Dashboard': { EN: 'Dashboard', HI: 'डैशबोर्ड', MR: 'डॅशबोर्ड', TA: 'டாஷ்போர்டு', BN: 'ড্যাশবোর্ড' },
    'Eligibility Engine': { EN: 'Eligibility Engine', HI: 'पात्रता इंजन', MR: 'पात्रता इंजिन', TA: 'தகுதி இயந்திரம்', BN: 'যোগ্যতা ইঞ্জিন' },
    'Smart AI Hub': { EN: 'Smart AI Hub', HI: 'स्मार्ट AI हब', MR: 'स्मार्ट AI हब', TA: 'ஸ்மார்ட் AI ஹப்', BN: 'স্মার্ট AI হাব' },
    'Blockchain Ledger': { EN: 'Blockchain Ledger', HI: 'ब्लॉकचेन लेजर', MR: 'ब्लॉकचेन लेजर', TA: 'பிளாக்செயின் லெட்ஜர்', BN: 'ব্লকচেইন লেজার' },
    'Land Verification': { EN: 'Land Verification', HI: 'भूमि सत्यापन', MR: 'जमीन पडताळणी', TA: 'நில சரிபார்ப்பு', BN: 'জমি যাচাই' },
    'Documents': { EN: 'Documents', HI: 'दस्तावेज़', MR: 'कागदपत्रे', TA: 'ஆவணங்கள்', BN: 'নথিপত্র' },
    'Payments': { EN: 'Payments', HI: 'भुगतान', MR: 'पेमेंट', TA: 'கொடுப்பனவுகள்', BN: 'পেমেন্ট' },
    'Gateway': { EN: 'Gateway', HI: 'गेटवे', MR: 'गेटवे', TA: 'நுழைவாயில்', BN: 'গেটওয়ে' },
    'User Hub': { EN: 'User Hub', HI: 'यूजर हब', MR: 'यूजर हब', TA: 'பயனர் மையம்', BN: 'ইউজার হাব' },

    // Citizen Dashboard
    'Citizen Dashboard': { EN: 'Citizen Dashboard', HI: 'नागरिक डैशबोर्ड', MR: 'नागरिक डॅशबोर्ड', TA: 'குடிமகன் டாஷ்போர்டு', BN: 'নাগরিক ড্যাশবোর্ড' },
    'Welcome back': { EN: 'Welcome back', HI: 'वापस स्वागत है', MR: 'परत स्वागत आहे', TA: 'மீண்டும் வரவேற்கிறோம்', BN: 'স্বাগত ফিরে' },

    // Wallet
    'GovPay Wallet': { EN: 'GovPay Wallet', HI: 'गवपे वॉलेट', MR: 'गवपे वॉलेट', TA: 'கவ்பே வாலட்', BN: 'গভপে ওয়ালেট' },
    'Available Balance': { EN: 'Available Balance', HI: 'उपलब्ध शेष', MR: 'उपलब्ध शिल्लक', TA: 'கிடைக்கும் இருப்பு', BN: 'উপলব্ধ ব্যালেন্স' },
    'Add': { EN: 'Add', HI: 'जोड़ें', MR: 'जोडा', TA: 'சேர்', BN: 'যোগ' },
    'Pay': { EN: 'Pay', HI: 'भुगतान', MR: 'पेमेंट', TA: 'செலுத்து', BN: 'পে' },
    'Receive': { EN: 'Receive', HI: 'प्राप्त करें', MR: 'प्राप्त करा', TA: 'பெறு', BN: 'গ্রহণ' },
    'Add Money': { EN: 'Add Money', HI: 'पैसे जोड़ें', MR: 'पैसे जोडा', TA: 'பணம் சேர்', BN: 'টাকা যোগ করুন' },
    'Send Payment': { EN: 'Send Payment', HI: 'भुगतान भेजें', MR: 'पेमेंट पाठवा', TA: 'பணம் அனுப்பு', BN: 'পেমেন্ট পাঠান' },
    'Receive Money': { EN: 'Receive Money', HI: 'पैसे प्राप्त करें', MR: 'पैसे प्राप्त करा', TA: 'பணம் பெறு', BN: 'টাকা গ্রহণ করুন' },
    'Transaction History': { EN: 'Transaction History', HI: 'लेन-देन इतिहास', MR: 'व्यवहार इतिहास', TA: 'பரிவர்த்தனை வரலாறு', BN: 'লেনদেন ইতিহাস' },
    'No transactions yet': { EN: 'No transactions yet', HI: 'अभी तक कोई लेन-देन नहीं', MR: 'अजून कोणतेही व्यवहार नाहीत', TA: 'இதுவரை பரிவர்த்தனை இல்லை', BN: 'এখনও কোনো লেনদেন নেই' },

    // Utility Dashboard
    'History': { EN: 'History', HI: 'इतिहास', MR: 'इतिहास', TA: 'வரலாறு', BN: 'ইতিহাস' },
    'Pay Now': { EN: 'Pay Now', HI: 'अभी भुगतान करें', MR: 'आता पेमेंट करा', TA: 'இப்போது செலுத்தவும்', BN: 'এখন পে করুন' },
    'Due': { EN: 'Due', HI: 'बकाया', MR: 'देय', TA: 'நிலுவை', BN: 'বকেয়া' },
    'Paid': { EN: 'Paid', HI: 'भुगतान हो गया', MR: 'भरले', TA: 'செலுத்தப்பட்டது', BN: 'পরিশোধিত' },
    'Auto-Pay': { EN: 'Auto-Pay', HI: 'ऑटो-पे', MR: 'ऑटो-पे', TA: 'ஆட்டோ-பே', BN: 'অটো-পে' },

    // Bills
    'Electricity': { EN: 'Electricity', HI: 'बिजली', MR: 'वीज', TA: 'மின்சாரம்', BN: 'বিদ্যুৎ' },
    'Water': { EN: 'Water', HI: 'पानी', MR: 'पाणी', TA: 'தண்ணீர்', BN: 'জল' },
    'Property Tax': { EN: 'Property Tax', HI: 'संपत्ति कर', MR: 'मालमत्ता कर', TA: 'சொத்து வரி', BN: 'সম্পত্তি কর' },
    'Piped Gas': { EN: 'Piped Gas', HI: 'पाइप गैस', MR: 'पाइप गॅस', TA: 'குழாய் எரிவாயு', BN: 'পাইপ গ্যাস' },
    'State Power Board': { EN: 'State Power Board', HI: 'राज्य विद्युत बोर्ड', MR: 'राज्य वीज मंडळ', TA: 'மாநில மின்சார வாரியம்', BN: 'রাজ্য বিদ্যুৎ বোর্ড' },
    'Municipal Corp': { EN: 'Municipal Corp', HI: 'नगर निगम', MR: 'महानगरपालिका', TA: 'நகராட்சி', BN: 'পৌরসভা' },
    'City Council': { EN: 'City Council', HI: 'नगर परिषद', MR: 'नगर परिषद', TA: 'நகர சபை', BN: 'সিটি কাউন্সিল' },
    'City Gas Ltd': { EN: 'City Gas Ltd', HI: 'सिटी गैस लिमिटेड', MR: 'सिटी गॅस लि.', TA: 'சிட்டி காஸ் லிட்', BN: 'সিটি গ্যাস লিমিটেড' },

    // Document Verification
    'AI-OCR Document Verification': { EN: 'AI-OCR Document Verification', HI: 'AI-OCR दस्तावेज़ सत्यापन', MR: 'AI-OCR कागदपत्र पडताळणी', TA: 'AI-OCR ஆவண சரிபார்ப்பு', BN: 'AI-OCR নথি যাচাই' },
    'Upload your ID (Aadhaar/PAN) for automatic detail extraction': { EN: 'Upload your ID (Aadhaar/PAN) for automatic detail extraction', HI: 'स्वचालित विवरण के लिए आईडी अपलोड करें', MR: 'स्वयंचलित तपशीलासाठी ID अपलोड करा', TA: 'தானியங்கி விவரத்திற்கு ID பதிவேற்றவும்', BN: 'স্বয়ংক্রিয় বিবরণের জন্য আইডি আপলোড করুন' },
    'Start AI Verification': { EN: 'Start AI Verification', HI: 'AI सत्यापन शुरू करें', MR: 'AI पडताळणी सुरू करा', TA: 'AI சரிபார்ப்பு தொடங்கு', BN: 'AI যাচাই শুরু করুন' },
    'Verification Successful': { EN: 'Verification Successful', HI: 'सत्यापन सफल', MR: 'पडताळणी यशस्वी', TA: 'சரிபார்ப்பு வெற்றி', BN: 'যাচাই সফল' },
    'Upload Another': { EN: 'Upload Another', HI: 'दूसरा अपलोड करें', MR: 'दुसरा अपलोड करा', TA: 'இன்னொன்று பதிவேற்று', BN: 'আরেকটি আপলোড' },
    'Confirm & Save': { EN: 'Confirm & Save', HI: 'पुष्टि करें और सहेजें', MR: 'पुष्टी करा आणि जतन करा', TA: 'உறுதி செய் & சேமி', BN: 'নিশ্চিত ও সংরক্ষণ' },
    'Click to upload or drag and drop': { EN: 'Click to upload or drag and drop', HI: 'अपलोड करने के लिए क्लिक करें', MR: 'अपलोड करण्यासाठी क्लिक करा', TA: 'பதிவேற்ற கிளிக் செய்யவும்', BN: 'আপলোড করতে ক্লিক করুন' },
    'Uploading document securely...': { EN: 'Uploading document securely...', HI: 'दस्तावेज़ सुरक्षित रूप से अपलोड हो रहा है...', MR: 'कागदपत्र सुरक्षितपणे अपलोड होत आहे...', TA: 'ஆவணம் பாதுகாப்பாக பதிவேற்றம்...', BN: 'নথি সুরক্ষিতভাবে আপলোড হচ্ছে...' },
    'AI is extracting details...': { EN: 'AI is extracting details...', HI: 'AI विवरण निकाल रहा है...', MR: 'AI तपशील काढत आहे...', TA: 'AI விவரங்களை பிரிக்கிறது...', BN: 'AI বিবরণ নিষ্কাশন করছে...' },
    'Document Type': { EN: 'Document Type', HI: 'दस्तावेज़ प्रकार', MR: 'कागदपत्र प्रकार', TA: 'ஆவண வகை', BN: 'নথির ধরন' },
    'Full Name': { EN: 'Full Name', HI: 'पूरा नाम', MR: 'पूर्ण नाव', TA: 'முழு பெயர்', BN: 'পুরো নাম' },
    'Date of Birth': { EN: 'Date of Birth', HI: 'जन्म तिथि', MR: 'जन्म तारीख', TA: 'பிறந்த தேதி', BN: 'জন্ম তারিখ' },
    'ID Number': { EN: 'ID Number', HI: 'आईडी नंबर', MR: 'आयडी क्रमांक', TA: 'அடையாள எண்', BN: 'আইডি নম্বর' },
    'Address': { EN: 'Address', HI: 'पता', MR: 'पत्ता', TA: 'முகவரி', BN: 'ঠিকানা' },
    'Confidence Score': { EN: 'Confidence Score', HI: 'विश्वसनीयता स्कोर', MR: 'विश्वासार्हता स्कोर', TA: 'நம்பகத்தன்மை மதிப்பெண்', BN: 'আত্মবিশ্বাস স্কোর' },

    // Pages
    'Payment & DBT Tracking': { EN: 'Payment & DBT Tracking', HI: 'भुगतान और DBT ट्रैकिंग', MR: 'पेमेंट आणि DBT ट्रॅकिंग', TA: 'பணம் & DBT கண்காணிப்பு', BN: 'পেমেন্ট ও DBT ট্র্যাকিং' },
    'Digital Document Locker': { EN: 'Digital Document Locker', HI: 'डिजिटल दस्तावेज़ लॉकर', MR: 'डिजिटल कागदपत्र लॉकर', TA: 'டிஜிட்டல் ஆவண லாக்கர்', BN: 'ডিজিটাল নথি লকার' },
    'Smart Land Verification': { EN: 'Smart Land Verification', HI: 'स्मार्ट भूमि सत्यापन', MR: 'स्मार्ट जमीन पडताळणी', TA: 'ஸ்மார்ட் நில சரிபார்ப்பு', BN: 'স্মার্ট জমি যাচাই' },
    'Payment Transfer Trends': { EN: 'Payment Transfer Trends', HI: 'भुगतान ट्रांसफर रुझान', MR: 'पेमेंट ट्रान्सफर ट्रेंड', TA: 'பணப் பரிமாற்ற போக்குகள்', BN: 'পেমেন্ট ট্রান্সফার প্রবণতা' },
};

interface LanguageContextType {
    lang: LangCode;
    setLang: (lang: LangCode) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'EN',
    setLang: () => { },
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<LangCode>('EN');

    const t = (key: string): string => {
        if (translations[key] && translations[key][lang]) {
            return translations[key][lang];
        }
        return key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
