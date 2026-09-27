import React, { useState } from 'react';
import { 
  ARCHITECTURE_COMPONENTS, 
  ArchitectureComponent 
} from '../data/iamDocumentation';
import { 
  Server, 
  Database, 
  Key, 
  ShieldCheck, 
  ArrowLeftRight, 
  Cpu, 
  Lock, 
  Share2, 
  Boxes,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>('oauth-engine');
  const [activeFlow, setActiveFlow] = useState<'auth-code' | 'm2m' | 'token-verify'>('auth-code');

  const selectedComponent = ARCHITECTURE_COMPONENTS.find(c => c.id === selectedCompId) || ARCHITECTURE_COMPONENTS[1];

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-indigo-900/30 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Boxes className="w-3.5 h-3.5" /> معماری مرجع زیرساختی (Infrastructure Architecture)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            سیستم مدیریت هویت و دسترسی متمرکز (Centralized IAM / SSO)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            این سیستم به عنوان یک <strong>Identity Provider (IdP) مستقل</strong> عمل می‌کند. برنامه‌های کاربر نهایی (مانند CRM، اپ موبایل، پنل‌های ادمین و وب‌سرویس‌ها) هیچ‌گونه منطق یا جدول کاربری مجزا ندارند و با استانداردهای بین‌المللی <strong>OAuth 2.1</strong> و <strong>OpenID Connect</strong> به این زیرساخت متصل می‌شوند.
          </p>
        </div>
      </div>

      {/* Interactive Topology Diagram */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              توپولوژی سطح بالای اجزای سیستم (High-Level System Topology)
            </h2>
            <p className="text-xs text-slate-400">
              روی هر کامپوننت کلیک کنید تا مشخصات مهندسی، وظایف، پروتکل‌ها و Best Practiceها را مشاهده کنید.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
            ● Single Sign-On Ready
          </span>
        </div>

        {/* Visual Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Column 1: Clients */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
              کلاینت‌ها و برنامه‌های مصرف‌کننده
            </span>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="p-2.5 bg-slate-800/70 rounded-lg text-xs font-medium text-slate-200 border border-slate-700/50 flex items-center justify-between">
                <span>📱 اپ موبایل (Flutter / iOS)</span>
                <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Public + PKCE</span>
              </div>
              <div className="p-2.5 bg-slate-800/70 rounded-lg text-xs font-medium text-slate-200 border border-slate-700/50 flex items-center justify-between">
                <span>💻 وب تک‌صفحه‌ای (React / Vue)</span>
                <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Public + PKCE</span>
              </div>
              <div className="p-2.5 bg-slate-800/70 rounded-lg text-xs font-medium text-slate-200 border border-slate-700/50 flex items-center justify-between">
                <span>🏢 پنل‌های درون‌سازمانی (CRM / ERP)</span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded">Confidential</span>
              </div>
              <div className="p-2.5 bg-slate-800/70 rounded-lg text-xs font-medium text-slate-200 border border-slate-700/50 flex items-center justify-between">
                <span>⚙️ سرویس‌های پس‌زمینه (M2M)</span>
                <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded">Client Credentials</span>
              </div>
            </div>
          </div>

          {/* Column 2: Edge & Core IAM (Clickable) */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block text-center">
              سرویس مرکزی هویت (Central IAM Core)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARCHITECTURE_COMPONENTS.slice(0, 4).map((comp) => {
                const isSelected = selectedCompId === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{comp.nameFa.split('(')[0]}</span>
                      {comp.id === 'oauth-engine' ? <Share2 className="w-3.5 h-3.5 text-indigo-400" /> : <Server className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <p className="text-[11px] font-mono text-indigo-300 truncate">{comp.tech}</p>
                    <span className="text-[10px] text-slate-400 block mt-1 line-clamp-1">{comp.roleFa}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARCHITECTURE_COMPONENTS.slice(4, 6).map((comp) => {
                const isSelected = selectedCompId === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{comp.nameFa.split('(')[0]}</span>
                      {comp.id === 'key-management' ? <Key className="w-3.5 h-3.5 text-amber-400" /> : <Database className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <p className="text-[11px] font-mono text-indigo-300 truncate">{comp.tech}</p>
                    <span className="text-[10px] text-slate-400 block mt-1 line-clamp-1">{comp.roleFa}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 3: Persistence & Async Infrastructure */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
              زیرساخت ذخیره‌سازی و کش
            </span>
            <div className="space-y-2">
              {ARCHITECTURE_COMPONENTS.slice(6, 8).map((comp) => {
                const isSelected = selectedCompId === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`w-full p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{comp.nameFa.split('(')[0]}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] font-mono text-indigo-300 truncate">{comp.tech}</p>
                    <span className="text-[10px] text-slate-400 block mt-1 line-clamp-2">{comp.roleFa}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Component Deep Dive Inspector */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                بررسی جزئیات ماژول انتخابی:
              </span>
              <h3 className="text-lg font-bold text-white">{selectedComponent.nameFa}</h3>
              <p className="text-xs font-mono text-slate-400">{selectedComponent.nameEn} • {selectedComponent.tech}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedComponent.protocols.map((proto, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-mono rounded border border-slate-700">
                  {proto}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> وظایف کلیدی و Responsibilities:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {selectedComponent.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/50">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> الزامات امنیتی و استانداردهای تولید (Best Practices):
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {selectedComponent.bestPractices.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-950/20 p-2 rounded border border-emerald-900/30 text-emerald-200/90">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Decision Comparison: Modular Monolith vs Microservices */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-indigo-400" />
          تصمیم‌گیری معماری: مونولیت ماژولار (Modular Monolith) در برابر میکروسرویس
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          یکی از مهم‌ترین سوالات در طراحی سیستم‌های IAM این است که آیا از روز اول باید سیستم را به ۵ میکروسرویس مجزا (Auth Service, Token Service, Audit Service, ...) خرد کرد یا خیر؟
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 relative">
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              توصیه استاندارد معماران
            </span>
            <h3 className="text-sm font-bold text-indigo-300 mb-2">گزینه ۱: مونولیت ماژولار با NestJS (توصیه‌شده برای فاز ۱ و ۲)</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span><strong>تراکنش‌های ACID بی‌درنگ:</strong> برای تغییر رمز، ثبت سشن و نوشتن لاگ، به پروتکل‌های پیچیده 2PC یا Saga نیازی ندارید.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span><strong>تأخیر (Latency) صفر درون‌برنامه‌ای:</strong> تبادل اطلاعات بین ماژول احراز هویت و ماژول نقش‌ها بدون Network Overhead صورت می‌گیرد.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span><strong>توسعه سریع و دیباگ یکپارچه:</strong> تمام پروژه با یک داکر و یک محیط تست بالا می‌آید.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 mb-2">گزینه ۲: میکروسرویس‌های کاملاً مستقل (مناسب شرکت‌های بالای ۱۰۰ مهندس)</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">!</span>
                <span><strong>سربار شبکه و امنیت بین‌سرویسی:</strong> هر تماس نیازمند mTLS و اعتبارسنجی مجدد است.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">!</span>
                <span><strong>پیچیدگی هماهنگی کلیدها:</strong> چرخش کلید و همگام‌سازی Redis در چند سرویس نیازمند مانیتورینگ بسیار پیچیده است.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span><strong>مزیت تنها زمانی که:</strong> تیم‌های مجزا برای مدیریت کاربران و مدیریت سرور OAuth داشته باشید.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
