import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import FadeIn from './FadeIn';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  imageUrl?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const Blog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);

  useEffect(() => {
    try {
      const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      setPosts(storedPosts);
    } catch (err) {
      console.error('Failed to parse blog posts from localStorage:', err);
      setError('لا يمكن تحميل المقالات السابقة.');
    }
  }, []);

  // Effect to lock body scroll when full-screen preview is open
  useEffect(() => {
    document.body.style.overflow = isPreviewFullScreen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreviewFullScreen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
        // Security Enhancement: Validate file type to prevent malicious file uploads (e.g., SVG with scripts).
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('نوع الملف غير صالح. يرجى اختيار صورة بصيغة (PNG, JPG, GIF, WebP).');
            e.target.value = ''; // Reset the input
            return;
        }

        if (file.size > 2 * 1024 * 1024) { 
            setError('حجم الصورة كبير جداً. الرجاء اختيار صورة أصغر من 2 ميجابايت.');
            e.target.value = ''; // Reset the input
            return;
        }
        setImage(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    // Also reset the file input visually
    const fileInput = document.getElementById('blog-image') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };
  
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('يرجى ملء حقلي العنوان والمحتوى قبل النشر.');
      return;
    }

    try {
      let imageUrl: string | undefined = undefined;
      if (image) {
          imageUrl = await fileToBase64(image);
      }
      
      const newPost: BlogPost = {
        id: Date.now(),
        title,
        content,
        publishedAt: new Date().toISOString(),
        imageUrl,
      };

      const updatedPosts = [newPost, ...posts];
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);

      // Clear the form and show success message
      setTitle('');
      setContent('');
      handleRemoveImage();
      setSuccess('تم نشر مقالك بنجاح!');
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      if (err instanceof DOMException && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        setError('مساحة التخزين ممتلئة. لا يمكن حفظ المقال الجديد. حاول حذف بعض المقالات القديمة.');
      } else {
        setError('حدث خطأ غير متوقع أثناء الحفظ. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleDelete = (postId: number) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المقال؟')) {
        const updatedPosts = posts.filter(post => post.id !== postId);
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
    }
  };


  return (
    <section id="blog" className="py-20 bg-slate-800/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">مدونتي</h2>
            <p className="text-slate-400 mt-2">شارك أفكارك وخبراتك مع العالم.</p>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mt-4"></div>
          </div>
        </FadeIn>
        
        <div className="max-w-4xl mx-auto">
            <FadeIn delay={150}>
                <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 mb-16">
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">إنشاء تدوينة جديدة</h3>
                    <form onSubmit={handlePublish} className="space-y-6">
                        <div>
                            <label htmlFor="blog-title" className="block text-lg font-medium text-slate-200 mb-2">عنوان المقال</label>
                            <input 
                                type="text" 
                                id="blog-title" 
                                name="blog-title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-slate-600 bg-slate-700 rounded-md text-white" 
                                placeholder="أهمية الذكاء الاصطناعي في تطوير الويب"
                                required
                            />
                        </div>
                        <div>
                          <label className="block text-lg font-medium text-slate-200 mb-2">صورة المقال (اختياري)</label>
                          <div className="mt-1 w-full">
                              {imagePreview ? (
                                  <div className="relative w-full">
                                      <img src={imagePreview} alt="معاينة الصورة" className="w-full h-64 object-cover rounded-md" />
                                      <button 
                                          type="button" 
                                          onClick={handleRemoveImage}
                                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-colors"
                                          aria-label="إزالة الصورة"
                                      >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                      </button>
                                  </div>
                              ) : (
                                  <label htmlFor="blog-image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-600 border-dashed rounded-md cursor-pointer hover:bg-slate-800 transition-colors">
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <svg className="w-10 h-10 mb-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                          <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">انقر للتحميل</span> أو اسحب وأفلت</p>
                                          <p className="text-xs text-slate-500">PNG, JPG, GIF, WebP (بحد أقصى 2 ميجابايت)</p>
                                      </div>
                                      <input id="blog-image" type="file" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleImageChange} />
                                  </label>
                              )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="blog-content" className="block text-lg font-medium text-slate-200 mb-2">محتوى المقال (ماركداون)</label>
                                <textarea 
                                    id="blog-content" 
                                    name="blog-content" 
                                    rows={10} 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-slate-600 bg-slate-700 rounded-md text-white font-mono" 
                                    placeholder="اكتب تدوينتك هنا..."
                                    required
                                ></textarea>
                                <p className="text-xs text-slate-500 mt-2">يدعم تنسيق الماركدون (مثل **للخط العريض** أو - للقوائم).</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="block text-lg font-medium text-slate-200">معاينة مباشرة</label>
                                  <button 
                                      type="button" 
                                      onClick={() => setIsPreviewFullScreen(true)}
                                      className="p-1 text-slate-400 hover:text-white transition-colors"
                                      aria-label="توسيع المعاينة"
                                      title="توسيع المعاينة"
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4" />
                                      </svg>
                                  </button>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-md border border-slate-600 min-h-[288px] h-full">
                                    {content ? (
                                        <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-cyan-400 prose-strong:text-white max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500">ستظهر معاينة الماركدون هنا.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-400 text-center animate-fadeIn">{success}</p>}
                        
                        <button 
                            type="submit"
                            className="w-full bg-cyan-600 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-700 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            نشر المقال
                        </button>
                    </form>
                </div>
            </FadeIn>

            <div className="space-y-12">
                <h3 className="text-3xl font-bold text-white text-center mb-6">المقالات المنشورة</h3>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <FadeIn key={post.id} delay={index * 100}>
                            <article className="bg-slate-800/70 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
                                {post.imageUrl && (
                                  <img src={post.imageUrl} alt={post.title} className="w-full h-72 object-cover" />
                                )}
                                <div className="p-8 relative">
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-slate-700/50"
                                        aria-label="حذف المقال"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <h2 className="text-2xl font-extrabold text-white mb-2">{post.title}</h2>
                                    <p className="text-sm text-slate-400 mb-6">
                                        {new Date(post.publishedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                    </p>
                                    <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-cyan-400 prose-strong:text-white max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </article>
                        </FadeIn>
                    ))
                ) : (
                    <FadeIn delay={100}>
                        <p className="text-center text-slate-500 py-10">لم يتم نشر أي مقالات بعد. كن أول من يكتب!</p>
                    </FadeIn>
                )}
            </div>
        </div>
      </div>
      
      {isPreviewFullScreen && (
        <div 
          className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="container mx-auto px-6 py-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h3 className="text-2xl font-bold text-white">معاينة المقال</h3>
                <button 
                    type="button" 
                    onClick={() => setIsPreviewFullScreen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="إغلاق المعاينة"
                    title="إغلاق المعاينة"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 overflow-y-auto flex-grow">
                 {content ? (
                    <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-cyan-400 prose-strong:text-white max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-slate-500">لا يوجد محتوى لعرضه.</p>
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;