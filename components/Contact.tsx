

import React, { useState } from 'react';
import { SOCIAL_LINKS, WalletIcon, CardIcon, QrCodeIcon, CopyIcon, CheckIcon } from '../constants';
import FadeIn from './FadeIn';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="bg-slate-800/90 border border-slate-700 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 w-full max-w-md m-4 text-center relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 id="payment-modal-title" className="text-2xl font-bold text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};


const Contact: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'zain' | 'qi' | null>(null);
  const [copied, setCopied] = useState(false);
  const QI_CARD_NUMBER = '7139804996';

  const toggleBodyScroll = (isLocked: boolean) => {
    document.body.style.overflow = isLocked ? 'hidden' : 'unset';
  };
  
  const openModal = (modal: 'zain' | 'qi') => {
    setActiveModal(modal);
    toggleBodyScroll(true);
  };
  
  const closeModal = () => {
    setActiveModal(null);
    toggleBodyScroll(false);
    setCopied(false); // Reset copy state when any modal closes
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(QI_CARD_NUMBER).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const getModalProps = () => {
    switch (activeModal) {
      case 'zain':
        return {
          title: 'الدفع عبر زين كاش',
          content: (
            <>
              <p className="text-slate-400 mb-6">امسح الرمز أدناه أو استخدم رقم المحفظة لإتمام الدفع.</p>
              <div className="text-cyan-400 mx-auto w-48 h-48 mb-6 bg-white p-2 rounded-lg">
                <QrCodeIcon />
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <p className="text-slate-300">رقم المحفظة:</p>
                <p className="text-2xl font-bold text-white tracking-widest" dir="ltr">0783 096 0059</p>
              </div>
            </>
          ),
        };
      case 'qi':
        return {
          title: 'الدفع عبر كي كارد',
          content: (
            <>
              <p className="text-slate-400 mb-6">استخدم رقم البطاقة أدناه لإتمام عملية الدفع.</p>
              <div className="bg-slate-900/50 p-4 rounded-lg relative flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-right">رقم البطاقة:</p>
                  <p className="text-2xl font-bold text-white tracking-widest" dir="ltr">{QI_CARD_NUMBER.replace(/(\d{4})(\d{4})(\d{2})/, '$1 $2 $3')}</p>
                </div>
                <button onClick={handleCopy} className="text-slate-400 hover:text-cyan-400 transition-colors p-2" aria-label="نسخ رقم البطاقة">
                   { copied ? <CheckIcon /> : <CopyIcon /> }
                </button>
              </div>
              {copied && <p className="text-green-400 text-sm mt-3 animate-fadeIn">تم النسخ بنجاح!</p>}
            </>
          ),
        };
      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getModalProps();

  return (
    <>
      <footer id="contact" className="py-20 bg-slate-900/70 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-4">لنبقى على تواصل</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              تابعني على منصات التواصل الاجتماعي للاطلاع على آخر المستجدات والمحتوى التقني الذي أقدمه.
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-12">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-slate-400 hover:text-cyan-400 p-2 rounded-full transition-colors duration-300 hover:bg-slate-800"
                >
                  {/* FIX: Changed from React.cloneElement to React.createElement to correctly instantiate the icon component and pass props, resolving the TypeScript error. */}
                  {React.createElement(link.icon, { className: "w-7 h-7" })}
                </a>
              ))}
            </div>
          </FadeIn>
          
          <FadeIn delay={150}>
            <div className="mt-8 mb-12">
              <h3 className="text-xl font-bold text-white mb-6">وسائل الدفع المعتمدة</h3>
              <div className="flex justify-center items-center flex-wrap gap-6">
                <button
                  onClick={() => openModal('zain')}
                  className="flex items-center gap-3 bg-slate-800/50 py-3 px-5 rounded-xl border border-slate-700 transition-all hover:border-cyan-400/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="الدفع عبر زين كاش"
                >
                  <WalletIcon />
                  <span className="font-semibold text-slate-200 text-lg">زين كاش</span>
                </button>
                <button
                  onClick={() => openModal('qi')}
                  className="flex items-center gap-3 bg-slate-800/50 py-3 px-5 rounded-xl border border-slate-700 transition-all hover:border-cyan-400/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="الدفع عبر كي كارد"
                >
                  <CardIcon />
                  <span className="font-semibold text-slate-200 text-lg">كي كارد</span>
                </button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-slate-500">
                &copy; {new Date().getFullYear()} عمار محمد. جميع الحقوق محفوظة. تصميم وتطوير بواسطة <a href="https://amiraq.org" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 transition-colors font-semibold">AMIRAQ.ORG</a>
            </p>
          </FadeIn>
        </div>
      </footer>

      <PaymentModal isOpen={activeModal !== null} onClose={closeModal} title={title}>
        {content}
      </PaymentModal>
    </>
  );
};

export default Contact;
