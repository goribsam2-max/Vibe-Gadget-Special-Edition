import React, { useEffect, useState } from 'react';
import { FacebookIcon } from './ui/BrandIcons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { QrCode, CreditCard } from 'lucide-react';

export const Footer = () => {
  const [settings, setSettings] = useState({ facebookUrl: '', tiktokUrl: '' });

  useEffect(() => {
    getDoc(doc(db, 'settings', 'payments')).then(snap => {
      if (snap.exists()) {
        setSettings({
          facebookUrl: snap.data().facebookUrl || '',
          tiktokUrl: snap.data().tiktokUrl || ''
        });
      }
    });
  }, []);

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 pb-24 md:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start gap-12">
        
        {/* Brand Side */}
        <div className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">VibeGadgets</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Your destination for premium tech, gadgets, and accessories. Experience the best gadgets delivered right to you.
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            {settings.facebookUrl && (
              <a 
                href={settings.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            )}
            {settings.tiktokUrl && (
              <a 
                href={settings.tiktokUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col md:items-end gap-5">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#1cdb5e]" /> Accepted Payments
          </p>
          <div className="flex flex-col md:items-end gap-3 text-left md:text-right">
            <p className="text-sm text-zinc-500 max-w-sm">
              We exclusively accept payments via <strong className="text-zinc-900 dark:text-white font-bold">Bangla QR</strong> following Bangladesh Govt rules.
            </p>
            <div className="flex flex-wrap md:justify-end gap-2 mt-2 w-full max-w-[340px]">
              {['bKash', 'Nagad', 'Rocket', 'Upay', 'Tap', 'Nexus', 'QCash', 'Pathao Pay', 'IBBL', 'VISA', 'Mastercard', 'Amex'].map((method) => (
                <div key={method} className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center min-w-[75px] flex-grow">
                  <span className="text-[11px] md:text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">{method}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 bg-[#1cdb5e]/10 px-4 py-2 rounded-full border border-[#1cdb5e]/20">
               <QrCode className="w-4 h-4 text-[#1cdb5e]" />
               <span className="text-xs font-black text-[#17ba4f] uppercase tracking-widest">Verified by Bangla QR</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
         <p className="text-xs text-zinc-500 font-medium">© {new Date().getFullYear()} VibeGadgets. All rights reserved.</p>
         <div className="flex items-center gap-6 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
           <a href="/policies" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</a>
           <a href="/policies" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</a>
         </div>
      </div>
    </footer>
  );
};
