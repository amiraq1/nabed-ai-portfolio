# نبض AI - مشروع الموقع الشخصي التفاعلي

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 📋 نظرة عامة

موقع شخصي تفاعلي لصانع محتوى تقني متخصص في الذكاء الاصطناعي وتطوير الويب. المشروع مبني باستخدام **React**، **TypeScript**، و**Vite**، ويستخدم **Gemini API** من Google لتوفير ميزات ذكاء اصطناعي متقدمة.

## ✨ الميزات

- 🎨 **تصميم حديث وجذاب** باستخدام Tailwind CSS
- 🤖 **تكامل مع Gemini API** لتوليد المحتوى والفيديو
- 📱 **تصميم متجاوب** يعمل على جميع الأجهزة
- ⚡ **أداء عالي** مع Lazy Loading و Code Splitting
- 🌐 **دعم اللغة العربية** بالكامل مع RTL
- 🎬 **مولد فيديو بالذكاء الاصطناعي** باستخدام Veo
- 📝 **نظام مدونة** مع دعم Markdown
- 🔗 **تكامل مع GitHub** لعرض المستودعات

## 🏗️ البنية التقنية

### Frontend
- **React 19.2.0** - مكتبة UI
- **TypeScript 5.8.2** - لغة البرمجة
- **Vite 6.2.0** - أداة البناء
- **Tailwind CSS** - إطار عمل CSS
- **React Markdown** - عرض Markdown

### APIs
- **Gemini API** - توليد المحتوى والفيديو
- **GitHub API** - عرض المستودعات

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js (الإصدار 18 أو أحدث)
- npm أو pnpm

### خطوات التثبيت

1. **استنساخ المستودع**
   ```bash
   git clone <repository-url>
   cd nabed-ai
   ```

2. **تثبيت الحزم**
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة**
   
   أنشئ ملف `.env.local` في الجذر:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   احصل على مفتاح API من: https://ai.google.dev/

4. **تشغيل المشروع**
   ```bash
   npm run dev
   ```
   
   افتح المتصفح على: http://localhost:3000

5. **بناء للإنتاج**
   ```bash
   npm run build
   npm run preview
   ```

## ⚠️ تحذيرات أمنية مهمة

### 🔴 مشكلة أمنية حرجة

**المشروع الحالي يحتوي على مشكلة أمنية خطيرة**: مفتاح Gemini API يتم تضمينه في كود JavaScript الذي يُرسل للمتصفح، مما يجعله مرئيًا لأي شخص.

### ✅ الحل الموصى به

**لا تنشر هذا المشروع في الإنتاج** قبل تطبيق الحل الأمني الكامل:

1. إنشاء Backend API (Express.js) للتعامل مع Gemini API
2. نقل جميع استدعاءات API من Frontend إلى Backend
3. حماية مفتاح API على الخادم فقط

**راجع الملفات التالية للحصول على دليل كامل**:
- 📄 `SECURITY_FIXES.md` - دليل شامل لحل المشكلة الأمنية
- 📄 `FIXES_APPLIED.md` - ملخص الإصلاحات المطبقة
- 📄 `analysis_report.md` - تقرير تحليل كامل للمشاكل

## 📁 هيكل المشروع

```
nabed-ai/
├── components/           # مكونات React
│   ├── About.tsx        # قسم "عني" مع أخبار تقنية
│   ├── Blog.tsx         # قسم المدونة
│   ├── Contact.tsx      # قسم التواصل
│   ├── ErrorBoundary.tsx # معالج الأخطاء
│   ├── FadeIn.tsx       # مكون الحركة
│   ├── GitHub.tsx       # عرض مستودعات GitHub
│   ├── Header.tsx       # رأس الصفحة
│   ├── Hero.tsx         # قسم البطل
│   ├── Portfolio.tsx    # قسم المحفظة
│   ├── Skills.tsx       # قسم المهارات
│   ├── Spinner.tsx      # مؤشر التحميل
│   └── VideoGenerator.tsx # مولد الفيديو بالذكاء الاصطناعي
├── App.tsx              # المكون الرئيسي
├── index.tsx            # نقطة الدخول
├── constants.tsx        # الثوابت والبيانات
├── types.ts             # تعريفات TypeScript
├── global.d.ts          # تعريفات عامة
├── index.html           # ملف HTML الرئيسي
├── index.css            # أنماط إضافية
├── vite.config.ts       # إعدادات Vite
├── tsconfig.json        # إعدادات TypeScript
└── package.json         # حزم npm

# ملفات التوثيق
├── README.md            # الملف الأصلي
├── README_UPDATED.md    # هذا الملف (محدث)
├── analysis_report.md   # تقرير تحليل المشاكل
├── SECURITY_FIXES.md    # دليل الحلول الأمنية
└── FIXES_APPLIED.md     # ملخص الإصلاحات
```

## 🔧 الإصلاحات المطبقة

### ✅ تم الحل
1. **ملف CSS المفقود** - تم إنشاء `index.css`
2. **تعريف `window.aistudio`** - تم إضافة تعريفات TypeScript وفحص الوجود

### ⚠️ يتطلب إجراءات إضافية
3. **مشكلة الأمان** - يتطلب إنشاء Backend API (موثق في `SECURITY_FIXES.md`)
4. **معالجة الأخطاء** - يحتاج تحسينات
5. **بنية المشروع** - تحسينات معمارية للمستقبل

راجع `FIXES_APPLIED.md` للتفاصيل الكاملة.

## 🎯 الأقسام الرئيسية

### 1. Hero Section
قسم الترحيب الرئيسي مع عنوان جذاب وتأثيرات بصرية.

### 2. About Section
نبذة عن صانع المحتوى مع ميزة "آخر أخبار التكنولوجيا" التي تستخدم Gemini API مع Google Search.

### 3. Skills Section
عرض المهارات التقنية مع إمكانية الحصول على معلومات تفصيلية باستخدام AI.

### 4. Portfolio Section
عرض المشاريع السابقة مع صور ووصف وتقنيات مستخدمة.

### 5. GitHub Section
عرض المستودعات من GitHub مع معلومات النجوم والفروع.

### 6. Video Generator Section
مولد فيديو بالذكاء الاصطناعي يحول الصور الثابتة إلى فيديو باستخدام Veo.

### 7. Blog Section
نظام مدونة بسيط مع دعم Markdown وتخزين محلي.

### 8. Contact Section
نموذج تواصل مع روابط وسائل التواصل الاجتماعي.

## 🛠️ التطوير

### إضافة مكون جديد
```bash
# أنشئ ملف في مجلد components
touch components/NewComponent.tsx
```

### تحديث الأنماط
الأنماط تستخدم Tailwind CSS مباشرة في المكونات. للأنماط المخصصة، استخدم `index.css`.

### إضافة ميزة جديدة
1. أنشئ المكون في `components/`
2. أضف الأنواع في `types.ts` إذا لزم الأمر
3. استورد المكون في `App.tsx`
4. أضف lazy loading إذا كان المكون كبيرًا

## 📦 البناء للإنتاج

```bash
# بناء المشروع
npm run build

# معاينة البناء
npm run preview
```

الملفات المبنية ستكون في مجلد `dist/`.

## 🌐 النشر

### خيارات الاستضافة

#### Frontend (بعد حل مشكلة الأمان):
- **Vercel** - موصى به لمشاريع React
- **Netlify** - سهل الاستخدام
- **Cloudflare Pages** - أداء عالي

#### Backend (مطلوب لحل مشكلة الأمان):
- **Railway** - سهل ومرن
- **Render** - خيار مجاني جيد
- **Fly.io** - أداء عالي

### خطوات النشر على Vercel

1. **ربط المستودع**
   ```bash
   # ادفع الكود إلى GitHub
   git push origin main
   ```

2. **استيراد في Vercel**
   - اذهب إلى vercel.com
   - انقر "Import Project"
   - اختر المستودع

3. **إعداد متغيرات البيئة**
   - أضف `GEMINI_API_KEY` في إعدادات Vercel
   - ⚠️ تذكر: هذا غير آمن، استخدم Backend API

4. **نشر**
   - Vercel سينشر تلقائيًا

## 🔐 أفضل الممارسات الأمنية

1. ✅ **لا تضع مفاتيح API في الكود**
2. ✅ **استخدم متغيرات البيئة** على الخادم فقط
3. ✅ **أضف `.env.local` إلى `.gitignore`**
4. ✅ **استخدم HTTPS** في الإنتاج
5. ✅ **أضف Rate Limiting** لحماية API
6. ✅ **راقب الاستخدام** لتجنب الفواتير غير المتوقعة

## 📚 الموارد المفيدة

- [Gemini API Documentation](https://ai.google.dev/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:
1. Fork المستودع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مفتوح المصدر ومتاح تحت ترخيص MIT.

## 👨‍💻 المطور

**عمار محمد (نبض AI)**
- الموقع: https://amiraq.org/
- GitHub: [@amiraq](https://github.com/amiraq)

## 🙏 شكر وتقدير

- Google AI Studio لتوفير Gemini API
- مجتمع React ومطوري المكتبات مفتوحة المصدر

---

## ⚡ البدء السريع

```bash
# استنساخ المستودع
git clone <repository-url>

# الدخول إلى المجلد
cd nabed-ai

# تثبيت الحزم
npm install

# إنشاء ملف .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

# تشغيل المشروع
npm run dev
```

**ملاحظة مهمة**: قبل النشر في الإنتاج، راجع `SECURITY_FIXES.md` لحل المشكلة الأمنية.

---

<div align="center">
  <p>صُنع بـ ❤️ باستخدام React و TypeScript</p>
  <p>مدعوم بـ Gemini API من Google</p>
</div>

