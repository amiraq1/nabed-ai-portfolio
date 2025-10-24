import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // تحديث الحالة لعرض الواجهة البديلة في العرض التالي.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // تسجيل الخطأ في خدمة تقارير الأخطاء أو في لوحة التحكم.
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // عرض أي واجهة مستخدم بديلة مخصصة.
      return (
        <div className="min-h-screen bg-slate-900 text-slate-300 flex flex-col items-center justify-center text-center p-6" role="alert">
            <div className="max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="text-3xl font-bold text-white mb-2">حدث خطأ ما</h1>
                <p className="text-slate-400 mb-6">
                    عذراً، لقد واجه التطبيق خطأ غير متوقع. يرجى محاولة تحديث الصفحة.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-cyan-500 text-white font-bold py-2 px-6 rounded-full hover:bg-cyan-600 transition-all duration-300"
                >
                    تحديث الصفحة
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
