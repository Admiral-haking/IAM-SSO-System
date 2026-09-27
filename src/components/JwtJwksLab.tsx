import React, { useState } from 'react';
import { 
  Key, 
  Shield, 
  Copy, 
  Check, 
  RefreshCw, 
  Info, 
  Layers, 
  Lock, 
  FileText 
} from 'lucide-react';

export const JwtJwksLab: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<'access' | 'id_token'>('access');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sampleHeader = {
    alg: "RS256",
    typ: "JWT",
    kid: "iam-key-2026-q3-primary"
  };

  const sampleAccessTokenPayload = {
    iss: "https://auth.enterprise-iam.com",
    sub: "usr-4921-88ae-99120",
    aud: "https://api.enterprise-iam.com",
    client_id: "crm-webapp-9021",
    tenant_id: "ten-acme-corp-001",
    email: "ali.kheiri@acme.com",
    email_verified: true,
    roles: [
      "TenantAdmin",
      "BillingManager"
    ],
    permissions: [
      "users:create",
      "users:read",
      "users:update",
      "billing:invoices:read",
      "billing:invoices:export"
    ],
    iat: 1758921600,
    exp: 1758922500, // 15 mins TTL
    jti: "jwt-uuid-7719-8921-bcf"
  };

  const sampleIdTokenPayload = {
    iss: "https://auth.enterprise-iam.com",
    sub: "usr-4921-88ae-99120",
    aud: "crm-webapp-9021", // Client ID
    nonce: "xyzNonceRandomString",
    email: "ali.kheiri@acme.com",
    name: "Ali Kheiri",
    given_name: "Ali",
    family_name: "Kheiri",
    picture: "https://auth.enterprise-iam.com/avatars/ali.png",
    iat: 1758921600,
    exp: 1758925200 // 1 hour TTL
  };

  const sampleJwks = {
    keys: [
      {
        kty: "RSA",
        use: "sig",
        kid: "iam-key-2026-q3-primary",
        alg: "RS256",
        n: "t-xZ_v8K9N7eQx1mP2...[2048-bit Modulus Base64URL]...aP4Q",
        e: "AQAB"
      },
      {
        kty: "RSA",
        use: "sig",
        kid: "iam-key-2026-q2-previous",
        alg: "RS256",
        n: "m7bW99_kK2...[کلید دوره فرجه Grace Period جهت عدم قطعی]...zZ9",
        e: "AQAB"
      }
    ]
  };

  const currentPayload = tokenType === 'access' ? sampleAccessTokenPayload : sampleIdTokenPayload;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Key className="w-6 h-6 text-amber-400" />
              آزمایشگاه رمزنگاری، توکن‌های JWT و توزیع کلیدها (JWKS)
            </h2>
            <p className="text-xs text-slate-400">
              بررسی ساختار درونی Access Token، نقش هدر kid در چرخش کلید و نحوه اعتبارسنجی توسط میکروسرویس‌ها بدون بار پردازشی روی دیتابیس.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTokenType('access')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                tokenType === 'access' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Access Token (مجوزدهی و RBAC)
            </button>
            <button
              onClick={() => setTokenType('id_token')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                tokenType === 'id_token' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ID Token (اطلاعات هویتی کاربر OIDC)
            </button>
          </div>
        </div>

        {/* 3-Part JWT Inspector */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              آناتومی توکن استاندارد RFC 7519 ({tokenType === 'access' ? 'Access Token' : 'OIDC ID Token'}):
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded">
              RS256 Asymmetric Signature
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Header (Red/Rose) */}
            <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-400 border-b border-rose-950/80 pb-2">
                  <span>۱. Header (الگوریتم و شناسه کلید)</span>
                  <span className="font-mono text-[10px] bg-rose-950 px-1.5 py-0.5 rounded text-rose-300">JOSE</span>
                </div>
                <pre className="text-xs font-mono text-rose-300 overflow-x-auto p-2 bg-rose-950/20 rounded">
                  {JSON.stringify(sampleHeader, null, 2)}
                </pre>
              </div>
              <div className="pt-3 border-t border-slate-900 text-[11px] text-slate-400 leading-relaxed">
                پارامتر <code className="text-rose-300 font-mono">kid</code> مشخص می‌کند کدام کلید عمومی از لیست JWKS برای اعتبارسنجی امضا استفاده شود.
              </div>
            </div>

            {/* Payload (Purple/Violet) */}
            <div className="bg-slate-950 border border-violet-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-violet-400 border-b border-violet-950/80 pb-2">
                  <span>۲. Payload (کلیم‌ها، نقش‌ها و مجوزها)</span>
                  <span className="font-mono text-[10px] bg-violet-950 px-1.5 py-0.5 rounded text-violet-300">Claims</span>
                </div>
                <pre className="text-xs font-mono text-violet-300 overflow-x-auto p-2 bg-violet-950/20 rounded max-h-56">
                  {JSON.stringify(currentPayload, null, 2)}
                </pre>
              </div>
              <div className="pt-3 border-t border-slate-900 text-[11px] text-slate-400 leading-relaxed">
                حاوی اطلاعات هویتی و دسترسی‌ها؛ نیازی به کوئری زدن دیتابیس در هر ریکوئست نیست (Stateless Authorization).
              </div>
            </div>

            {/* Signature (Cyan/Teal) */}
            <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 border-b border-cyan-950/80 pb-2">
                  <span>۳. Verify Signature (امضای ریاضی)</span>
                  <span className="font-mono text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300">Crypto</span>
                </div>
                <div className="text-xs font-mono text-cyan-300 p-2 bg-cyan-950/20 rounded break-all leading-relaxed">
                  RSASHA256(<br />
                  &nbsp;&nbsp;base64UrlEncode(header) + "." +<br />
                  &nbsp;&nbsp;base64UrlEncode(payload),<br />
                  &nbsp;&nbsp;<span className="text-amber-300">privateKeyRSA2048</span><br />
                  )
                </div>
              </div>
              <div className="pt-3 border-t border-slate-900 text-[11px] text-slate-400 leading-relaxed">
                کلید خصوصی <strong>فقط در اختیار سرور IAM</strong> است و در Vault ذخیره می‌شود. هیچ‌کس نمی‌تواند محتوای توکن را بدون ابطال امضا تغییر دهد.
              </div>
            </div>
          </div>
        </div>

        {/* JWKS Explorer */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                اندپوینت انتشار کلیدهای عمومی (JSON Web Key Set - JWKS)
              </h3>
              <p className="text-xs text-slate-400">
                این خروجی روی آدرس <code className="text-indigo-400 font-mono">/.well-known/jwks.json</code> قرار دارد و توسط Gateway و تمام میکروسرویس‌ها کَش می‌شود.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(JSON.stringify(sampleJwks, null, 2), 'jwks')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSection === 'jwks' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'jwks' ? 'کپی شد' : 'کپی JWKS'}
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(sampleJwks, null, 2)}
            </pre>
          </div>

          {/* Technical Insight Box */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong>چرا کلید قبلی (q2-previous) هنوز در JWKS وجود دارد؟</strong><br />
              این استراتژی <strong>Zero-Downtime Key Rotation</strong> نام دارد. هنگامی که یک کلید جدید فعال می‌شود، توکن‌های صادرشده در روزهای قبل هنوز منقضی نشده‌اند. اگر کلید قبلی فوراً پاک شود، هزاران کاربر لاگین‌شده با خطای ناگهانی 401 Unauthorized مواجه می‌شوند. بنابراین کلید قدیمی تا پایان دوره Grace Period در خروجی نگه داشته می‌شود.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
