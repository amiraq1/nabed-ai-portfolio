import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SKILLS } from '../constants';
import type { Skill } from '../types';
import FadeIn from './FadeIn';
import Spinner from './Spinner';

// New Modal Component for displaying skill details
const SkillInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
  info: string;
  isLoading: boolean;
  error: string | null;
}> = ({ isOpen, onClose, skill, info, isLoading, error }) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-modal-title"
    >
      <div
        className="bg-slate-800/90 border border-slate-700 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 w-full max-w-lg m-4 relative animate-scaleIn"
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
        {skill && (
          <div className="flex flex-col items-center text-center">
            {/* FIX: The skill icon is now a component type, so we instantiate it with props instead of cloning an element. This resolves the TypeScript error. */}
            <div className="text-cyan-400 mb-4">{React.createElement(skill.icon, { className: "w-12 h-12" })}</div>
            <h3 id="skill-modal-title" className="text-2xl font-bold text-white mb-4">{skill.name}</h3>
            {isLoading && (
              <div className="flex items-center justify-center p-8 min-h-[100px]">
                <Spinner />
                <p className="mr-4 text-slate-300">جاري توليد الشرح بالذكاء الاصطناعي...</p>
              </div>
            )}
            {error && <p className="text-red-400 min-h-[100px] flex items-center">{error}</p>}
            {info && !isLoading && (
                 <div className="min-h-[100px] flex items-center">
                    <p className="text-slate-300 text-lg leading-relaxed">{info}</p>
                 </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// Updated SkillCard to be a button
const SkillCard: React.FC<{ skill: Skill; onClick: () => void; }> = ({ skill, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-slate-800 p-6 rounded-lg flex flex-col items-center justify-center text-center shadow-md transition-all duration-300 hover:bg-slate-700 hover:shadow-cyan-500/20 group hover:-translate-y-2 hover:scale-105 w-full h-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800/50 focus:-translate-y-2 focus:scale-105"
    >
      <div className="text-cyan-400 mb-4 transition-transform duration-300 ease-in-out group-hover:scale-125">
        {/* FIX: The skill icon is now a component type, so we instantiate it as a component. */}
        {React.createElement(skill.icon)}
      </div>
      <h3 className="text-lg font-bold text-white">{skill.name}</h3>
    </button>
  );
};

const Skills: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillInfo, setSkillInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBodyScroll = (isLocked: boolean) => {
    document.body.style.overflow = isLocked ? 'hidden' : 'unset';
  };

  const handleCloseModal = () => {
    setSelectedSkill(null);
    toggleBodyScroll(false);
  };

  const handleSkillClick = async (skill: Skill) => {
    setSelectedSkill(skill);
    toggleBodyScroll(true);
    setIsLoading(true);
    setSkillInfo('');
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `أنت مساعد ذكاء اصطناعي في موقع "نبض AI" الخاص بعمار محمد، وهو صانع محتوى تقني عربي. قام مستخدم بالضغط على مهارة "${skill.name}".
      
      اكتب فقرة واحدة قصيرة (حوالي 2-3 جمل) تشرح فيها خبرة عمار في هذا المجال وكيف يقدمها في محتواه. استخدم نبرة واثقة وجذابة.
      
      مثال لمهارة "React & TypeScript": "يتمتع عمار بخبرة عميقة في بناء واجهات ويب حديثة وتفاعلية باستخدام React و TypeScript، ويقدم شروحات عملية ومشاريع متكاملة تساعد المطورين على إتقان هذه التقنيات بكفاءة."`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setSkillInfo(response.text);
    } catch (err) {
      console.error(err);
      setError('عذراً، حدث خطأ أثناء جلب المعلومات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <section id="skills" className="py-20 bg-slate-800/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn>
              <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white">المهارات التقنية</h2>
              <p className="text-slate-400 mt-2">أهم التقنيات والأدوات التي أستخدمها. <span className="font-bold text-slate-300">انقر على أي مهارة لمعرفة المزيد!</span></p>
              <div className="w-24 h-1 bg-cyan-400 mx-auto mt-4"></div>
              </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SKILLS.map((skill, index) => (
              <FadeIn key={skill.name} delay={index * 100}>
                  <SkillCard skill={skill} onClick={() => handleSkillClick(skill)} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <SkillInfoModal
        isOpen={!!selectedSkill}
        onClose={handleCloseModal}
        skill={selectedSkill}
        info={skillInfo}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

export default Skills;