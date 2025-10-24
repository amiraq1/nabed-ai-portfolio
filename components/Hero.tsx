import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center bg-slate-900 relative overflow-hidden">
       <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-30%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] left-[-30%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>
      <div className="container mx-auto px-6 py-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
            صناعة المحتوى الرقمي <span className="text-cyan-400">بأسلوب عصري</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            مرحباً، أنا عمار محمد. صانع محتوى تقني متخصص في تبسيط المفاهيم المعقدة وتقديمها للجمهور العربي بأسلوب شيق ومبتكر.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <a href="#about" className="w-full sm:w-auto bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105">
              اعرف المزيد عني
            </a>
            <a href="#portfolio" className="w-full sm:w-auto bg-transparent border-2 border-slate-500 text-slate-300 font-bold py-3 px-8 rounded-full hover:bg-slate-700 hover:border-slate-700 transition-all duration-300">
              اكتشف أعمالي
            </a>
            <a href="#contact" className="w-full sm:w-auto bg-slate-700 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-600 transition-all duration-300 transform hover:scale-105">
              تواصل معي
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;