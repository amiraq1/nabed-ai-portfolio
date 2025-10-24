
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import FadeIn from './FadeIn';
import Spinner from './Spinner';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const VideoGenerator: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkApiKey = async () => {
            // Check if running in AI Studio environment
            if (typeof window !== 'undefined' && window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            } else {
                // If not in AI Studio, assume API key is set via environment
                setApiKeySelected(!!process.env.API_KEY);
            }
        };
        checkApiKey();
    }, []);

    const handleSelectKey = async () => {
        if (typeof window !== 'undefined' && window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume key selection is successful to avoid race conditions.
            setApiKeySelected(true);
        } else {
            // Fallback: show error message if not in AI Studio
            setError('هذه الميزة متاحة فقط في بيئة AI Studio. يرجى التأكد من تعيين GEMINI_API_KEY في ملف .env.local');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const generateVideo = async () => {
        if (!imageFile || !prompt) {
            setError('يرجى تحميل صورة وكتابة وصف.');
            return;
        }

        setIsLoading(true);
        setGeneratedVideoUrl(null);
        setError(null);
        setLoadingMessage('بدء عملية إنشاء الفيديو...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imageBase64 = await blobToBase64(imageFile);

            setLoadingMessage('يتم الآن إرسال الطلب إلى النموذج...');
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: {
                    imageBytes: imageBase64,
                    mimeType: imageFile.type,
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio,
                }
            });

            setLoadingMessage('تم استلام الطلب. قد تستغرق هذه العملية بضع دقائق...');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            setLoadingMessage('الفيديو جاهز! جاري التحميل...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                 const videoBlob = await response.blob();
                 const videoUrl = URL.createObjectURL(videoBlob);
                 setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error('فشل في الحصول على رابط تحميل الفيديو.');
            }

        } catch (err: any) {
            console.error(err);
            let errorMessage = 'حدث خطأ غير متوقع أثناء إنشاء الفيديو.';
            if (err.message && err.message.includes('Requested entity was not found')) {
                errorMessage = 'فشل التحقق من مفتاح API. يرجى تحديده مرة أخرى.';
                setApiKeySelected(false);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <section id="video-generator" className="py-20 bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-white">صانع الفيديو بالذكاء الاصطناعي</h2>
                        <p className="text-slate-400 mt-2">حوّل صورتك الثابتة إلى فيديو مذهل باستخدام نموذج Veo.</p>
                        <div className="w-24 h-1 bg-cyan-400 mx-auto mt-4"></div>
                    </div>
                </FadeIn>

                {!apiKeySelected ? (
                    <FadeIn className="text-center bg-slate-800 p-8 rounded-lg max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-4">مطلوب مفتاح API</h3>
                        <p className="text-slate-400 mb-6">
                            لإستخدام هذه الميزة، يجب عليك تحديد مفتاح API الخاص بك. هذا الإجراء مطلوب للامتثال لمتطلبات الفوترة.
                             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                 اعرف المزيد عن الفوترة
                             </a>.
                        </p>
                        <button onClick={handleSelectKey} className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300">
                            حدد مفتاح API
                        </button>
                    </FadeIn>
                ) : (
                    <FadeIn>
                        <div className="max-w-3xl mx-auto bg-slate-800/50 p-8 rounded-lg border border-slate-700">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="file-upload" className="block text-lg font-medium text-slate-200 mb-2">1. حمّل صورة</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md"/>
                                            ) : (
                                                <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                            <div className="flex text-sm text-slate-400">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-cyan-500 px-3 py-1">
                                                    <span>اختر ملفًا</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                                <p className="pr-1">أو اسحبه وأفلته هنا</p>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="prompt" className="block text-lg font-medium text-slate-200 mb-2">2. اكتب وصفاً للفيديو</label>
                                    <textarea id="prompt" name="prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-slate-600 bg-slate-700 rounded-md text-white" placeholder="مثال: قطة ترتدي نظارات شمسية وتقود سيارة رياضية"></textarea>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-slate-200 mb-2">3. اختر أبعاد الفيديو</h3>
                                    <div className="flex gap-4">
                                        <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-3 px-4 rounded-md font-semibold transition-colors ${aspectRatio === '16:9' ? 'bg-cyan-500 text-white ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                            أفقي (16:9)
                                        </button>
                                        <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-3 px-4 rounded-md font-semibold transition-colors ${aspectRatio === '9:16' ? 'bg-cyan-500 text-white ring-2 ring-offset-2 ring-offset-slate-800 ring-cyan-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                            عمودي (9:16)
                                        </button>
                                    </div>
                                </div>
                                <button onClick={generateVideo} disabled={isLoading || !imageFile || !prompt} className="w-full bg-cyan-600 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-700 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                                    {isLoading && <Spinner />}
                                    {isLoading ? 'جاري الإنشاء...' : 'أنشئ الفيديو'}
                                </button>
                            </div>
                           
                            {isLoading && (
                                <div className="mt-6 text-center text-cyan-300">
                                    <p>{loadingMessage}</p>
                                </div>
                            )}

                             {error && (
                                <div className="mt-6 text-center text-red-400 bg-red-900/50 p-4 rounded-md">
                                    <p>{error}</p>
                                </div>
                            )}

                            {generatedVideoUrl && (
                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold text-white text-center mb-4">الفيديو الخاص بك جاهز!</h3>
                                    <video controls autoPlay loop src={generatedVideoUrl} className="w-full rounded-lg shadow-2xl"></video>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                )}
            </div>
        </section>
    );
};

export default VideoGenerator;