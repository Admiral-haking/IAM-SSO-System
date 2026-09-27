import React from 'react';
import { ROLES_AND_PERMISSIONS_MATRIX } from '../data/roadmapAndSecurity';
import { 
  ShieldAlert, 
  Lock, 
  Key, 
  CheckCircle2, 
  Flame, 
  Users, 
  Activity, 
  FileText,
  AlertOctagon,
  ShieldCheck
} from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  const securityThreats = [
    {
      threat: 'حملات جستجوی فراگیر (Brute-Force & Credential Stuffing)',
      mitigation: 'ترکیب Throttler در لایه Gateway + قفل خودکار حساب کاربری به مدت ۱۵ دقیقه پس از ۵ تلاش ناموفق متوالی در دیتابیس + ثبت در Audit Log.',
      severity: 'HIGH'
    },
    {
      threat: 'شنود کد احراز هویت (Auth Code Interception)',
      mitigation: 'الزام پروتکل PKCE با الگوریتم S256 بر اساس استاندارد OAuth 2.1. سرور اجازه تبادل کد بدون مطابقت هش code_verifier را نمی‌دهد.',
      severity: 'CRITICAL'
    },
    {
      threat: 'سرقت Refresh Token (Token Hijacking)',
      mitigation: 'استفاده از Refresh Token Rotation و ردیابی Family ID. با اولین تلاش برای استفاده مجدد از توکن قبلی، کل زنجیره باطل و سشن کاربر بسته می‌شود.',
      severity: 'CRITICAL'
    },
    {
      threat: 'حملات کرک آفلاین رمزهای عبور نشت‌کرده',
      mitigation: 'استفاده انحصاری از Argon2id (برنده مسابقه Password Hashing Competition) با تخصیص حافظه (Memory Cost 64MB) جهت فلج کردن کرکرهای سخت‌افزاری GPU و ASIC.',
      severity: 'HIGH'
    },
    {
      threat: 'نشت اطلاعات حساس در لاگ‌ها (PII Leakage)',
      mitigation: 'تزریق فیلتر Sanitizer در Logger سرویس جهت ماسک کردن خودکار فیلدهای password, token, client_secret, credit_card قبل از ارسال به Elastic/Loki.',
      severity: 'MEDIUM'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-rose-400" />
              معماری امنیت عمیق، مقابله با تهدیدات و ماتریس دسترسی‌ها (RBAC)
            </h2>
            <p className="text-xs text-slate-400">
              راهکارهای عملیاتی جهت ایمن‌سازی سرور هویت در برابر خطرات مطرح OWASP، حملات نشت توکن و استانداردهای انطباق سازمانی.
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-950/60 border border-rose-800/40 px-3 py-1 rounded-full">
            Zero-Trust Ready
          </span>
        </div>

        {/* Roles and Permissions Matrix */}
        <div className="pt-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            ماتریس دسترسی نقش‌ها در سطح سیستم و چندمستأجری (RBAC Matrix)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES_AND_PERMISSIONS_MATRIX.map((r, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-indigo-300">{r.roleName}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-block">
                    قلمرو: {r.scope}
                  </span>
                  <p className="text-xs text-slate-400 leading-snug">{r.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-900">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">مجوزها (Permissions):</span>
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.map((p, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-900/50 px-1.5 py-0.5 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Threats & Mitigation Table */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            جدول تحلیل تهدیدات امنیتی و مکانیزم‌های دفاعی (Threat Modeling & Mitigations)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-2.5 px-3">بردار حمله / تهدید (Threat)</th>
                  <th className="py-2.5 px-3">شدت خطر</th>
                  <th className="py-2.5 px-3">راهکار دفاعی مهندسی‌شده در بک‌اند</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {securityThreats.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50">
                    <td className="py-3 px-3 font-semibold text-white">{t.threat}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        t.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        t.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 leading-relaxed">{t.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distributed Rate Limiting Box */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" />
              الگوریتم Sliding Window Rate Limiting در ردیس:
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              برخلاف Fixed Window که در مرز هر دقیقه اجازه انفجار ترافیک (Traffic Burst) را می‌دهد، ما با اسکریپت Redis Lua یک <strong>پنجره لغزان دقیق</strong> بر اساس Timestamp میلی‌ثانیه‌ای پیاده می‌کنیم. ریکوئست‌های قدیمی خارج از بازه ۶۰ ثانیه به صورت اتمیک با <code className="text-indigo-300">ZREMRANGEBYSCORE</code> پاک شده و تعداد با <code className="text-indigo-300">ZCARD</code> شمرده می‌شود.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              استانداردهای ثبت لاگ حسابرسی (Audit Log Compliance):
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              برای انطباق با گواهی‌نامه‌های امنیتی SOC2 و ISO 27001، هیچ رکوردی در جدول <code className="text-emerald-300 font-mono">audit_logs</code> نباید قابل ویرایش (UPDATE) یا حذف (DELETE) باشد. دیتابیس با دسترسی Append-Only پیکربندی می‌شود و در صورت دستکاری دیتابیس توسط ادمین، هماهنگی با کَش غیرهمگام لو خواهد رفت.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
