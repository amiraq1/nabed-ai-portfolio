

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import FadeIn from './FadeIn';
import type { GroundingChunk } from '../types';
import Spinner from './Spinner';
import { SOCIAL_LINKS } from '../constants';

const LatestNews: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [news, setNews] = useState<string | null>(null);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        setIsLoading(true);
        setNews(null);
        setSources([]);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "ما هي أحدث الاتجاهات في الذكاء الاصطناعي وصناعة المحتوى الرقمي؟ قدم ملخصًا موجزًا.",
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            setNews(response.text);
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
            setSources(groundingChunks);

        } catch (err) {
            setError('حدث خطأ أثناء جلب الأخبار. يرجى المحاولة مرة أخرى.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-12 p-6 bg-slate-900 rounded-lg border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">آخر أخبار التكنولوجيا</h3>
            <div className="flex justify-center mb-6">
                <button
                    onClick={fetchNews}
                    disabled={isLoading}
                    className="bg-cyan-500 text-white font-bold py-2 px-6 rounded-full hover:bg-cyan-600 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? <Spinner /> : null}
                    {isLoading ? 'جاري التحميل...' : 'احصل على آخر المستجدات'}
                </button>
            </div>
            {error && <p className="text-center text-red-400">{error}</p>}
            {news && (
                <FadeIn>
                    <div className="prose prose-invert prose-p:text-slate-300 max-w-none text-right">
                       <p>{news}</p>
                    </div>
                    {sources.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-bold text-slate-200">المصادر:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                {sources.map((source, index) => (
                                    <li key={index} className="text-sm">
                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                            {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </FadeIn>
            )}
        </div>
    );
};


const About: React.FC = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "عمار محمد",
    "jobTitle": "صانع محتوى تقني",
    "description": "صانع محتوى تقني متخصص في تبسيط مفاهيم الذكاء الاصطناعي، Gemini API، تطوير الويب الحديث، والحوسبة السحابية للجمهور العربي.",
    "url": "https://amiraq.org/",
    "image": "https://picsum.photos/seed/me/500/500",
    "sameAs": SOCIAL_LINKS.map(link => link.url),
    "knowsAbout": ["Artificial Intelligence", "Gemini API", "Web Development", "React", "TypeScript", "Cloud Computing", "Content Creation"]
  };

  return (
    <section id="about" className="py-20 bg-slate-800/50 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">نبذة عني</h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mt-4"></div>
          </div>
        </FadeIn>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <FadeIn direction="right" className="md:w-1/3">
            <img 
              src="https://picsum.photos/seed/me/500/500" 
              alt="عمار محمد"
              className="rounded-full shadow-2xl mx-auto border-4 border-cyan-400"
              loading="lazy"
              decoding="async"
            />
          </FadeIn>
          <FadeIn direction="left" className="md:w-2/3 text-lg text-slate-300 text-center md:text-right">
            <p className="mb-4">
              منذ بداية مسيرتي، كان شغفي هو استكشاف أحدث التقنيات ومشاركتها مع العالم. أؤمن بأن المعرفة قوة، وهدفي هو تمكين المطورين والمتحمسين للتقنية في المنطقة العربية من خلال محتوى عالي الجودة.
            </p>
            <p className="mb-4">
              أنتج محتوى متنوع يشمل مقالات تقنية معمقة، فيديوهات تعليمية على يوتيوب، وورش عمل تفاعلية. أركز على مجالات مثل الذكاء الاصطناعي، تطوير الويب، والحوسبة السحابية.
            </p>
             <p>
              أسعى دائماً لتقديم المعلومة بطريقة واضحة ومباشرة، مع أمثلة عملية تساعد على فهم أعمق وتطبيق أسهل.
            </p>
          </FadeIn>
        </div>
        <FadeIn>
            <LatestNews />
        </FadeIn>
      </div>
    </section>
  );
};

export default About;