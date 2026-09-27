import React, { useState } from 'react';
import { PRISMA_SCHEMA_CODE } from '../data/iamDocumentation';
import { 
  Database, 
  Copy, 
  Check, 
  Table, 
  Key, 
  Link2, 
  Shield, 
  Code,
  FileCode2,
  CheckCircle2
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<string>('users');

  const copyPrisma = () => {
    navigator.clipboard.writeText(PRISMA_SCHEMA_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tablesMeta = [
    {
      name: 'tenants',
      nameFa: 'مستأجرین / سازمان‌ها (Tenants)',
      descFa: 'تفکیک داده‌ها در سطح هر سازمان برای ارائه قابلیت Multi-Tenancy و دامنه‌های سفارشی (Custom Domains).',
      columns: [
        { name: 'id', type: 'String (UUID)', key: 'PK', desc: 'شناسه یکتا' },
        { name: 'slug', type: 'String', key: 'UNIQUE', desc: 'نام یکتا در آدرس (مثلاً acme-corp)' },
        { name: 'customDomain', type: 'String?', key: 'UNIQUE', desc: 'دامنه اختصاصی SSO مستأجر' },
        { name: 'settings', type: 'Json?', key: '', desc: 'تنظیمات سیاست رمز عبور، محدودیت نشست‌ها' }
      ]
    },
    {
      name: 'users',
      nameFa: 'کاربران و هویت‌ها (Users)',
      descFa: 'مخزن اصلی کاربران، اطلاعات هویتی، وضعیت حساب و هش پسورد با الگوریتم مدرن Argon2id.',
      columns: [
        { name: 'id', type: 'String (UUID)', key: 'PK', desc: 'شناسه یکتا' },
        { name: 'tenantId', type: 'String', key: 'FK', desc: 'ارجاع به جدول tenants' },
        { name: 'email', type: 'String', key: 'UNIQUE_COMPOSITE', desc: 'ایمیل (ترکیب با tenantId یکتا است)' },
        { name: 'passwordHash', type: 'String?', key: '', desc: 'هش Argon2id (برای کاربران SSO خالی است)' },
        { name: 'status', type: 'Enum (ACTIVE, LOCKED, ...)', key: '', desc: 'وضعیت فعال‌بودن حساب' },
        { name: 'failedLoginAttempts', type: 'Int', key: '', desc: 'شمارنده تلاش ناموفق برای مسدودسازی' },
        { name: 'mfaType', type: 'Enum (NONE, TOTP, ...)', key: '', desc: 'نوع ورود دو مرحله‌ای کاربر' }
      ]
    },
    {
      name: 'roles_permissions',
      nameFa: 'نقش‌ها و دسترسی‌های گرانولار (RBAC)',
      descFa: 'جداول roles, permissions, user_roles و role_permissions برای مدل دسترسی بسیار منعطف سازمانی.',
      columns: [
        { name: 'role.id', type: 'String (UUID)', key: 'PK', desc: 'شناسه نقش' },
        { name: 'role.name', type: 'String', key: 'COMPOSITE', desc: 'نام نقش در مستأجر (مثلاً BillingAdmin)' },
        { name: 'permission.resource', type: 'String', key: 'COMPOSITE', desc: 'منبع هدف (مثلاً invoices)' },
        { name: 'permission.action', type: 'String', key: 'COMPOSITE', desc: 'عملیات مجاز (مثلاً read, write)' }
      ]
    },
    {
      name: 'clients',
      nameFa: 'کلاینت‌ها و برنامه‌های متصل (OAuth2 Clients)',
      descFa: 'ثبت و مدیریت تمام برنامه‌های وب، موبایل و سرویس‌هایی که به عنوان کلاینت به این IdP متصل هستند.',
      columns: [
        { name: 'id', type: 'String (UUID)', key: 'PK', desc: 'شناسه یکتا' },
        { name: 'clientId', type: 'String', key: 'UNIQUE', desc: 'شناسه کلاینت برای پروتکل OAuth2' },
        { name: 'clientSecretHash', type: 'String?', key: '', desc: 'هش رمز کلاینت (برای Public کلاینت‌ها null است)' },
        { name: 'clientType', type: 'Enum (CONFIDENTIAL, PUBLIC)', key: '', desc: 'نوع کلاینت (Backend یا SPA/Mobile)' },
        { name: 'redirectUris', type: 'String[]', key: '', desc: 'آدرس‌های معتبر مجاز برای هدایت بعد از لاگین' },
        { name: 'requirePkce', type: 'Boolean', key: '', desc: 'الزام استفاده از PKCE برای این کلاینت' }
      ]
    },
    {
      name: 'sessions_tokens',
      nameFa: 'نشست‌ها و چرخش توکن (Sessions & Refresh Tokens)',
      descFa: 'ردگیری دستگاه‌های فعال، آی‌پی، توکن‌های یکبارمصرف چرخان و شناسه خانواده جهت کشف سرقت.',
      columns: [
        { name: 'session.id', type: 'String (UUID)', key: 'PK', desc: 'شناسه نشست فعال' },
        { name: 'session.deviceModel / ipAddress', type: 'String?', key: '', desc: 'ردگیری دستگاه و مشخصات جغرافیایی' },
        { name: 'refreshToken.tokenHash', type: 'String', key: 'UNIQUE', desc: 'هش SHA-256 توکن تجدید در دیتابیس' },
        { name: 'refreshToken.familyId', type: 'String (UUID)', key: 'INDEX', desc: 'شناسه زنجیره جهت تشخیص Token Reuse' },
        { name: 'refreshToken.isRevoked', type: 'Boolean', key: '', desc: 'وضعیت ابطال توکن' }
      ]
    },
    {
      name: 'signing_keys',
      nameFa: 'کلیدهای امضای JWT (JWKS)',
      descFa: 'نگهداری کلیدهای عمومی و خصوصی RSA/ECDSA برای چرخش بدون قطعی (Zero-Downtime Key Rotation).',
      columns: [
        { name: 'kid', type: 'String', key: 'UNIQUE', desc: 'شناسه کلید منتشرشده در JWKS' },
        { name: 'algorithm', type: 'String', key: '', desc: 'الگوریتم امضا (RS256 یا ES256)' },
        { name: 'publicKey', type: 'Text', key: '', desc: 'کلید عمومی با فرمت PEM' },
        { name: 'privateKey', type: 'Text (Encrypted)', key: '', desc: 'کلید خصوصی رمزگذاری‌شده با Master Key' },
        { name: 'isActive', type: 'Boolean', key: 'INDEX', desc: 'کلید فعال جاری برای امضای توکن‌های جدید' }
      ]
    },
    {
      name: 'audit_logs',
      nameFa: 'لاگ‌های حسابرسی تغییرناپذیر (Audit Log)',
      descFa: 'ثبت تمام وقایع مهم با استاندارد انطباق امنیتی SOC2 / ISO 27001.',
      columns: [
        { name: 'id', type: 'String (UUID)', key: 'PK', desc: 'شناسه یکتا' },
        { name: 'action', type: 'String', key: 'INDEX', desc: 'نوع اقدام هویتی (مانند AUTH.LOGIN_SUCCESS)' },
        { name: 'severity', type: 'Enum (INFO, WARN, HIGH, CRITICAL)', key: '', desc: 'سطح خطر رویداد' },
        { name: 'metadata', type: 'Json?', key: '', desc: 'جزئیات تغییرات و پارامترهای درخواست' }
      ]
    }
  ];

  const currentTable = tablesMeta.find(t => t.name === selectedTable) || tablesMeta[1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-400" />
              طراحی دیتابیس رابطه‌ای، ERD و اسکیمای رسمی Prisma
            </h2>
            <p className="text-xs text-slate-400">
              طراحی پایگاه داده PostgreSQL سازمانی با رعایت اصول نرمال‌سازی، ایزولاسیون Multi-Tenancy، قیدهای جامعیت ارجاعی و ایندکس‌های بهینه.
            </p>
          </div>

          <button
            onClick={copyPrisma}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'اسکیما کپی شد!' : 'کپی کامل schema.prisma'}
          </button>
        </div>

        {/* Table Selector Pills */}
        <div className="pt-6">
          <span className="text-xs font-bold text-slate-400 block mb-2">انتخاب موجودیت برای بررسی ساختار و روابط:</span>
          <div className="flex flex-wrap gap-2">
            {tablesMeta.map((t) => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t.name)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  selectedTable === t.name
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.nameFa.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Table Details */}
        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-400" />
              {currentTable.nameFa}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{currentTable.descFa}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">نام ستون (Column)</th>
                  <th className="py-2.5 px-3">نوع داده (Data Type)</th>
                  <th className="py-2.5 px-3">کلید / ایندکس</th>
                  <th className="py-2.5 px-3">توضیحات و نقش مهندسی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {currentTable.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-mono text-indigo-300">{col.name}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400">{col.type}</td>
                    <td className="py-2.5 px-3">
                      {col.key ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          col.key.includes('PK') ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          col.key.includes('FK') ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {col.key}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Prisma Schema Code Display */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              کد کامل فایل <code className="text-emerald-400 font-mono">prisma/schema.prisma</code>
            </h3>
            <span className="text-xs text-slate-400 font-mono">PostgreSQL Provider</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden relative">
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
              {PRISMA_SCHEMA_CODE}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
