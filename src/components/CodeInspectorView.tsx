import React, { useState } from 'react';
import { NESTJS_CODE_SAMPLES } from '../data/iamDocumentation';
import { 
  Code2, 
  Copy, 
  Check, 
  FolderTree, 
  FileCode, 
  Terminal, 
  Server, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CodeInspectorView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'controller' | 'jwtGuard' | 'permGuard' | 'jwks' | 'docker'>('controller');
  const [copied, setCopied] = useState<boolean>(false);

  const dockerComposeCode = `# docker-compose.yml
version: '3.8'

services:
  # 1. سرویس اصلی هسته IAM (NestJS)
  iam-core:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: iam_central_core
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://iam_user:SecureIamPass992@postgres:5432/central_iam?schema=public
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=SecureRedisClusterPass99
      - JWT_MASTER_SECRET=vault_master_k2991024_symmetric_key
    depends_on:
      - postgres
      - redis
    networks:
      - iam_network

  # 2. پایگاه داده PostgreSQL 16
  postgres:
    image: postgres:16-alpine
    container_name: iam_postgres_db
    restart: always
    environment:
      POSTGRES_USER: iam_user
      POSTGRES_PASSWORD: SecureIamPass992
      POSTGRES_DB: central_iam
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - iam_network

  # 3. کَش توزیع‌شده Redis 7 (نشست‌ها، بلک‌لیست توکن و Rate Limit)
  redis:
    image: redis:7-alpine
    container_name: iam_redis_cache
    restart: always
    command: ["redis-server", "--requirepass", "SecureRedisClusterPass99", "--maxmemory", "512mb", "--maxmemory-policy", "volatile-lru"]
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - iam_network

networks:
  iam_network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
`;

  const folderStructureText = `central-iam-service/
├── src/
│   ├── main.ts                       # بوت‌استرپ اپ، فعال‌سازی Helmet، ValidationPipe و Swagger
│   ├── app.module.ts                 # ماژول ریشه و اتصال به Throttler و Config
│   ├── oauth/                        # سرور OAuth 2.1 و OIDC
│   │   ├── oauth.controller.ts       # اندپوینت‌های /authorize, /token, /revoke
│   │   ├── oauth2.service.ts         # تبادل کد PKCE، چرخش Refresh Token و تولید توکن‌ها
│   │   ├── dto/                      # کلاس‌های اعتبارسنجی ورودی DTO
│   │   └── oauth.module.ts
│   ├── auth/                         # احراز هویت اولیه کاربران
│   │   ├── auth.controller.ts        # ثبت‌نام، ورود، خروج، بازیابی رمز عبور
│   │   ├── auth.service.ts           # هش Argon2id، قفل حساب پس از شکست متوالی
│   │   └── mfa/                      # ورود دو مرحله‌ای TOTP و WebAuthn
│   ├── crypto/                       # مدیریت کلیدهای نامتقارن و امضا
│   │   ├── jwks.service.ts           # تولید خودکار کلیدهای RS256/ES256، kid و کش JWKS
│   │   └── jwks.controller.ts        # انتشار اندپوینت /.well-known/jwks.json
│   ├── tenants/                      # چندمستأجری و دامنه‌های اختصاصی
│   │   ├── tenants.service.ts
│   │   └── tenant.middleware.ts      # تشخیص مستأجر از روی هدر یا Subdomain
│   ├── rbac/                         # نقش‌ها، مجوزها و دسترسی‌ها
│   │   ├── roles.service.ts
│   │   └── permissions.service.ts
│   ├── sessions/                     # مدیریت نشست‌های فعال و توکن‌ها
│   │   ├── sessions.service.ts       # ثبت متادیتا (دستگاه، IP) و ابطال همگانی
│   │   └── token-cleanup.cron.ts     # جاب خودکار پاک‌سازی توکن‌های منقضی
│   ├── audit/                        # ثبت لاگ‌های حسابرسی
│   │   ├── audit.service.ts          # ذخیره تغییرناپذیر رویدادها در دیتابیس/Elastic
│   │   └── audit.interceptor.ts      # اینترسپتور ثبت خودکار تغییرات در کنترلرها
│   ├── common/                       # پایپ‌ها، فیلترها و گاردهای سراسری
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts     # بررسی امضا با JWKS و بررسی ابطال در ردیس
│   │   │   ├── permissions.guard.ts  # بررسی وجود دسترسی‌های لازم با Reflector
│   │   │   └── tenant-scope.guard.ts
│   │   ├── decorators/               # @RequirePermissions, @CurrentUser, @CurrentTenant
│   │   └── filters/                  # OidcExceptionFilter (تبدیل خطا به استاندارد OAuth2)
│   ├── redis/                        # کلاینت Redis Cluster و توابع کمکی
│   └── prisma/                       # سرویس ORM و تراکنش‌ها
├── prisma/
│   ├── schema.prisma                 # تعاریف دیتابیس و روابط رابطه‌ای
│   └── migrations/
├── docker-compose.yml                # زیرساخت آماده اجرای محلی با یک دستور
├── Dockerfile                        # Multi-stage build سبک برای پروداکشن
└── package.json`;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'controller':
        return NESTJS_CODE_SAMPLES.oauthController;
      case 'jwtGuard':
        return NESTJS_CODE_SAMPLES.jwtGuard;
      case 'permGuard':
        return NESTJS_CODE_SAMPLES.permissionsGuard;
      case 'jwks':
        return NESTJS_CODE_SAMPLES.jwksService;
      case 'docker':
        return dockerComposeCode;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-indigo-400" />
              کدهای پروداکشن بک‌اند (NestJS + TypeScript) و ساختار پوشه‌ها
            </h2>
            <p className="text-xs text-slate-400">
              پیاده‌سازی تمیز، تایپ‌سیف و قابل استقرار صنعتی از ماژول‌های حیاتی کنترلر، گاردها، سرویس چرخش کلید و داکر.
            </p>
          </div>

          <button
            onClick={copyCode}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'کد کپی شد!' : 'کپی این فایل'}
          </button>
        </div>

        {/* Folder Structure Preview Accordion */}
        <div className="pt-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              ساختار استاندارد پوشه‌بندی و معماری ماژولار در پروژه NestJS:
            </div>
            <pre className="text-xs font-mono text-slate-400 overflow-x-auto max-h-56 leading-relaxed">
              {folderStructureText}
            </pre>
          </div>
        </div>

        {/* Code Tabs */}
        <div className="pt-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'controller', label: 'OAuthController.ts', desc: 'مدیریت /authorize, /token' },
              { id: 'jwtGuard', label: 'JwtAuthGuard.ts', desc: 'گارد JWT با چک ردیس' },
              { id: 'permGuard', label: 'PermissionsGuard.ts', desc: 'گارد RBAC گرانولار' },
              { id: 'jwks', label: 'JwksService.ts', desc: 'چرخش کلید RS256' },
              { id: 'docker', label: 'docker-compose.yml', desc: 'زیرساخت کانتینری' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id as any)}
                className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCodeTab === tab.id
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden">
            <pre className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[550px] leading-relaxed">
              {getActiveCode()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
