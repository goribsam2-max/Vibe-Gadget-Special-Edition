import React, { useEffect, useState } from 'react';
import { FacebookIcon } from './ui/BrandIcons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { QrCode, CreditCard, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const [settings, setSettings] = useState<any>({ facebookUrl: '', tiktokUrl: '', footerPaymentLogos: [] });

  useEffect(() => {
    getDoc(doc(db, 'settings', 'payments')).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          facebookUrl: data.facebookUrl || '',
          tiktokUrl: data.tiktokUrl || '',
          footerPaymentLogos: data.footerPaymentLogos || []
        });
      }
    });
  }, []);

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 pb-[90px] md:pb-8 pt-12">
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
          <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#1cdb5e]" /> Accepted Payments
          </p>
          <div className="flex flex-col md:items-end gap-3 text-left md:text-right relative">
            <p className="text-sm text-zinc-500 max-w-sm mb-2">
              We exclusively accept payments via <strong className="text-zinc-900 dark:text-white font-bold">Bangla QR</strong> following Bangladesh Govt rules.
            </p>
            <div className="flex flex-wrap md:justify-end gap-2 w-full max-w-[380px]">
              {settings.footerPaymentLogos?.map((method: any, i: number) => (
                <div key={i} className="px-3 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-2 min-w-[95px] flex-grow justify-center">
                  <img src={method.icon} alt={method.name} className="h-5 md:h-6 w-auto object-contain" />
                  <span className="text-[11px] md:text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">{method.name}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-1.5 mt-1 justify-end text-zinc-500 dark:text-zinc-400">
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
               <span className="text-[10px] font-bold uppercase tracking-wider">More BD Banking systems supported</span>
            </div>

            <div className="flex items-center gap-1.5 mt-2 justify-end opacity-80">
               <ShieldCheck className="w-3.5 h-3.5 text-[#1cdb5e]" />
               <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Verified by Bangla QR</span>
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
