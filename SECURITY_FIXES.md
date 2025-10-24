# إصلاحات الأمان والتوصيات

## ⚠️ مشكلة أمنية خطيرة: تعريض مفتاح API في كود المتصفح

### المشكلة
حاليًا، يتم استخدام `process.env.API_KEY` مباشرة في كود React الذي يعمل في المتصفح. هذا يعني أن مفتاح Gemini API يتم تضمينه في ملفات JavaScript التي يتم إرسالها للمستخدمين، مما يجعله مرئيًا لأي شخص يفتح أدوات المطور في المتصفح.

### المخاطر
1. **سرقة المفتاح**: أي شخص يمكنه رؤية المفتاح واستخدامه
2. **فواتير غير متوقعة**: إساءة استخدام المفتاح قد تؤدي إلى تكاليف كبيرة
3. **انتهاك سياسات الأمان**: معظم مزودي API يمنعون استخدام المفاتيح في كود العميل

### الحل الموصى به: إنشاء Backend API

لحل هذه المشكلة بشكل صحيح، يجب إنشاء خادم وسيط (Backend) يتعامل مع Gemini API.

## خطوات الحل الكامل

### الخطوة 1: إنشاء Backend API

#### 1.1 إنشاء مجلد للخادم

```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv @google/genai
npm install --save-dev typescript @types/express @types/cors @types/node ts-node nodemon
```

#### 1.2 إنشاء ملف `server/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 1.3 إنشاء ملف `server/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY as string 
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Generate content endpoint (for About and Skills sections)
app.post('/api/generate-content', async (req, res) => {
  try {
    const { model, prompt, useSearch } = req.body;

    const config: any = {};
    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: prompt,
      config
    });

    res.json({
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    });
  } catch (error: any) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message 
    });
  }
});

// Generate video endpoint
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType, aspectRatio } = req.body;

    if (!prompt || !imageBase64 || !mimeType) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt, imageBase64, mimeType' 
      });
    }

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: imageBase64,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio || '16:9',
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error('Failed to get video download link');
    }

    // Fetch the video and send it back
    const response = await fetch(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`);
    const videoBuffer = await response.arrayBuffer();

    res.json({
      success: true,
      videoBase64: Buffer.from(videoBuffer).toString('base64')
    });

  } catch (error: any) {
    console.error('Error generating video:', error);
    res.status(500).json({ 
      error: 'Failed to generate video',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

#### 1.4 تحديث `server/package.json`

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

#### 1.5 إنشاء ملف `server/.env`

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### الخطوة 2: تحديث Frontend

#### 2.1 إنشاء ملف `src/services/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface GenerateContentRequest {
  model?: string;
  prompt: string;
  useSearch?: boolean;
}

export interface GenerateContentResponse {
  text: string;
  groundingChunks: any[];
}

export interface GenerateVideoRequest {
  prompt: string;
  imageBase64: string;
  mimeType: string;
  aspectRatio: '16:9' | '9:16';
}

export interface GenerateVideoResponse {
  success: boolean;
  videoBase64: string;
}

export const apiService = {
  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/generate-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    return response.json();
  },

  async generateVideo(request: GenerateVideoRequest): Promise<GenerateVideoResponse> {
    const response = await fetch(`${API_BASE_URL}/api/generate-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate video');
    }

    return response.json();
  },
};
```

#### 2.2 تحديث `About.tsx`

استبدل:
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const response = await ai.models.generateContent({...});
```

بـ:
```typescript
import { apiService } from '../services/api';

const response = await apiService.generateContent({
  prompt: 'ما هي أحدث الاتجاهات في الذكاء الاصطناعي وصناعة المحتوى الرقمي؟ قدم ملخصًا موجزًا.',
  useSearch: true
});

setNews(response.text);
setSources(response.groundingChunks);
```

#### 2.3 تحديث `Skills.tsx`

بنفس الطريقة، استبدل استدعاءات API المباشرة باستخدام `apiService`.

#### 2.4 تحديث `VideoGenerator.tsx`

استبدل:
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
// ... video generation code
```

بـ:
```typescript
import { apiService } from '../services/api';

const imageBase64 = await blobToBase64(imageFile);
const response = await apiService.generateVideo({
  prompt: prompt,
  imageBase64: imageBase64,
  mimeType: imageFile.type,
  aspectRatio: aspectRatio
});

const videoBlob = new Blob(
  [Uint8Array.from(atob(response.videoBase64), c => c.charCodeAt(0))],
  { type: 'video/mp4' }
);
const videoUrl = URL.createObjectURL(videoBlob);
setGeneratedVideoUrl(videoUrl);
```

#### 2.5 إنشاء ملف `.env.local` في الجذر

```env
VITE_API_URL=http://localhost:3001
```

#### 2.6 تحديث `vite.config.ts`

احذف أو علق على الأسطر التالية:
```typescript
// define: {
//   'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
//   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
// },
```

### الخطوة 3: تشغيل المشروع

#### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend:
```bash
npm run dev
```

## فوائد هذا الحل

1. ✅ **الأمان**: مفتاح API محمي على الخادم فقط
2. ✅ **التحكم**: يمكن إضافة معدلات حد (Rate Limiting) ومصادقة
3. ✅ **المرونة**: سهولة إضافة ميزات جديدة
4. ✅ **المراقبة**: يمكن تتبع الاستخدام وتسجيل الأخطاء
5. ✅ **التوافق**: يعمل في أي بيئة استضافة

## ملاحظات إضافية

### للنشر في الإنتاج:

1. **استخدم HTTPS**: تأكد من استخدام اتصال آمن
2. **أضف مصادقة**: استخدم JWT أو OAuth لحماية API
3. **أضف Rate Limiting**: استخدم مكتبات مثل `express-rate-limit`
4. **استخدم متغيرات البيئة**: لا تضع مفاتيح API في الكود
5. **أضف Logging**: استخدم مكتبات مثل `winston` أو `pino`
6. **أضف Monitoring**: استخدم خدمات مثل Sentry أو DataDog

### خدمات الاستضافة الموصى بها:

- **Backend**: Railway, Render, Fly.io, Heroku
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Full-stack**: Railway, Render

## الخلاصة

هذا الحل يوفر بنية آمنة وقابلة للتطوير للمشروع. المفتاح الأساسي هو **عدم تضمين مفاتيح API في كود العميل أبدًا**، واستخدام خادم وسيط للتعامل مع جميع استدعاءات API الحساسة.

