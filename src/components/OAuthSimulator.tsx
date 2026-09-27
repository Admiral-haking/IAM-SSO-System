import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Key, 
  Terminal, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';

export const OAuthSimulator: React.FC = () => {
  const [activeProtocol, setActiveProtocol] = useState<'pkce' | 'reuse-detection' | 'client-credentials'>('pkce');

  // PKCE State
  const [pkceStep, setPkceStep] = useState<number>(1);
  const [codeVerifier, setCodeVerifier] = useState<string>('dBjftJeZ4CVP-mB92K27uhbUJu1p1r_wW1gFWFOEjXk');
  const [codeChallenge, setCodeChallenge] = useState<string>('E9Mel-2Vp6nwHzWmxWh2vTcuK2B9AqvqMTVU_bzs0bc');
  const [authCode, setAuthCode] = useState<string>('spl9-code-89af41ce99');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Reuse Detection State
  const [reuseStep, setReuseStep] = useState<number>(1);
  const [tokenFamily, setTokenFamily] = useState<{
    id: string;
    tokens: { version: number; token: string; status: 'active' | 'used' | 'revoked' }[];
  }>({
    id: 'fam-uuid-8801',
    tokens: [
      { version: 1, token: 'rft_v1_initial_user_token_99a', status: 'active' }
    ]
  });
  const [reuseAlert, setReuseAlert] = useState<string | null>(null);

  const resetPkce = () => {
    setPkceStep(1);
    setIsVerifying(false);
  };

  const handleRotateLegitToken = () => {
    if (tokenFamily.tokens.length >= 3) return;
    const currentActive = tokenFamily.tokens.find(t => t.status === 'active');
    if (!currentActive) return;

    const nextVersion = currentActive.version + 1;
    const nextTokenStr = `rft_v${nextVersion}_rotated_token_${Math.random().toString(36).substring(2, 8)}`;

    const updatedTokens = tokenFamily.tokens.map(t => 
      t.version === currentActive.version ? { ...t, status: 'used' as const } : t
    );
    updatedTokens.push({ version: nextVersion, token: nextTokenStr, status: 'active' });

    setTokenFamily({ ...tokenFamily, tokens: updatedTokens });
    setReuseStep(2);
    setReuseAlert(null);
  };

  const handleSimulateAttackerReuse = () => {
    // Attacker tries to use Token v1 (which is already 'used')
    const revokedTokens = tokenFamily.tokens.map(t => ({ ...t, status: 'revoked' as const }));
    setTokenFamily({ ...tokenFamily, tokens: revokedTokens });
    setReuseStep(3);
    setReuseAlert('⚠️ هشدار امنیتی فوری: تلاش برای استفاده مجدد از توکن باطل‌شده (Token Reuse)! تمام توکن‌های خانواده fam-uuid-8801 باطل شدند و نشست کاربر مسدود شد.');
  };

  const resetReuseDemo = () => {
    setTokenFamily({
      id: 'fam-uuid-8801',
      tokens: [
        { version: 1, token: 'rft_v1_initial_user_token_99a', status: 'active' }
      ]
    });
    setReuseStep(1);
    setReuseAlert(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-indigo-400" />
              شبیه‌ساز تعاملی پروتکل‌های امنیتی OAuth2.1 و OIDC
            </h2>
            <p className="text-xs text-slate-400">
              فرآیندهای پیچیده رمزنگاری و تبادل توکن را به شکل گام‌به‌گام و زنده تست و درک کنید.
            </p>
          </div>

          {/* Sub-Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveProtocol('pkce')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeProtocol === 'pkce' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Authorization Code + PKCE
            </button>
            <button
              onClick={() => setActiveProtocol('reuse-detection')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeProtocol === 'reuse-detection' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              چرخش توکن و Reuse Detection
            </button>
            <button
              onClick={() => setActiveProtocol('client-credentials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeProtocol === 'client-credentials' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ارتباط سرور با سرور (M2M)
            </button>
          </div>
        </div>

        {/* 1. PKCE Interactive Flow */}
        {activeProtocol === 'pkce' && (
          <div className="pt-6 space-y-6">
            <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-4 text-xs text-indigo-300 leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>چرا PKCE (Proof Key for Code Exchange) الزامی است؟</strong><br />
                در برنامه‌های SPA و موبایل، امکان مخفی کردن <code className="bg-indigo-950 px-1 py-0.5 rounded text-indigo-200">client_secret</code> وجود ندارد. PKCE با تولید یک کلید تصادفی در هر ورود، امکان شنود و استفاده از Authorization Code توسط هکر را به صفر می‌رساند.
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { step: 1, title: '۱. تولید Verifier & Challenge', desc: 'کلاینت رشته تصادفی و هش SHA256 آن را می‌سازد.' },
                { step: 2, title: '۲. هدایت به /authorize', desc: 'کاربر با Challenge به صفحه ورود IdP می‌رود.' },
                { step: 3, title: '۳. بازگشت با Auth Code', desc: 'سرور احراز هویت کرده و کد موقت را صادر می‌کند.' },
                { step: 4, title: '۴. تبادل با /oauth/token', desc: 'کلاینت اصل Verifier را فرستاده و توکن می‌گیرد.' }
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => setPkceStep(s.step)}
                  className={`p-3 rounded-xl border text-right cursor-pointer transition-all ${
                    pkceStep === s.step
                      ? 'bg-indigo-950 border-indigo-500 shadow-md ring-1 ring-indigo-500 text-white'
                      : pkceStep > s.step
                      ? 'bg-slate-950 border-emerald-800/40 text-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{s.title}</span>
                    {pkceStep > s.step && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Step Content Visualizer */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              {pkceStep === 1 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    گام اول: تولید کلید اعتبارسنجی موقت (Code Verifier) و هش عمومی (Code Challenge)
                  </h3>
                  <p className="text-xs text-slate-300">
                    کلاینت (مثلاً برنامه React در مرورگر) در حافظه خود یک رشته امن می‌سازد:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 font-bold block mb-1">code_verifier (محرمانه در مرورگر):</span>
                      <code className="text-amber-300 font-mono text-[11px] break-all">{codeVerifier}</code>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 font-bold block mb-1">code_challenge = BASE64URL(SHA256(verifier)):</span>
                      <code className="text-cyan-300 font-mono text-[11px] break-all">{codeChallenge}</code>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setPkceStep(2)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      مرحله بعد: ارسال به سرور IAM <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {pkceStep === 2 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">
                    گام دوم: ارسال پارامترها به آدرس احراز هویت متمرکز (/oauth/authorize)
                  </h3>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
                    <span className="text-emerald-400">GET</span> /oauth/authorize?<br />
                    &nbsp;&nbsp;response_type=<span className="text-cyan-300">code</span><br />
                    &nbsp;&nbsp;&client_id=<span className="text-amber-300">crm-webapp-9021</span><br />
                    &nbsp;&nbsp;&redirect_uri=<span className="text-indigo-300">https://crm.company.com/callback</span><br />
                    &nbsp;&nbsp;&scope=<span className="text-emerald-300">openid%20profile%20email%20offline_access</span><br />
                    &nbsp;&nbsp;&code_challenge=<span className="text-pink-300">{codeChallenge}</span><br />
                    &nbsp;&nbsp;&code_challenge_method=<span className="text-purple-300">S256</span><br />
                    &nbsp;&nbsp;&state=xyzRandomState99
                  </div>
                  <p className="text-xs text-slate-400">
                    سرور IAM چالش <code className="text-pink-300">{codeChallenge}</code> را در حافظه موقت (یا دیتابیس) ثبت می‌کند.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setPkceStep(1)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                    >
                      قبلی
                    </button>
                    <button
                      onClick={() => setPkceStep(3)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      کاربر لاگین کرد → دریافت کد <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {pkceStep === 3 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">
                    گام سوم: بازگشت به نرم‌افزار کاربر با Authorization Code
                  </h3>
                  <p className="text-xs text-slate-300">
                    مرورگر کاربر با وضعیت <code className="text-indigo-400 font-mono">302 Found</code> به دامنه CRM ریدایرکت می‌شود:
                  </p>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 break-all">
                    https://crm.company.com/callback?code={authCode}&state=xyzRandomState99
                  </div>
                  <div className="p-3 bg-amber-950/30 border border-amber-900/40 rounded-lg text-xs text-amber-300">
                    <strong>نکته امنیتی حیاتی:</strong> اگر هکر حتی این URL را در مرورگر یا لاگ شبکه شنود کند، <strong>نمی‌تواند</strong> آن را نقد کند، چون <code className="text-white font-mono">code_verifier</code> را ندارد!
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setPkceStep(2)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                    >
                      قبلی
                    </button>
                    <button
                      onClick={() => setPkceStep(4)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      تبادل نهایی با /oauth/token <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {pkceStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    گام چهارم: اعتبارسنجی رمزنگاری و صدور Access Token & Refresh Token
                  </h3>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-emerald-400">POST /oauth/token HTTP/1.1</div>
                    <div className="text-slate-400">Host: auth.enterprise-iam.com</div>
                    <div className="text-slate-400">Content-Type: application/x-www-form-urlencoded</div>
                    <div className="text-slate-300 pt-2 text-[11px] leading-relaxed">
                      grant_type=authorization_code<br />
                      &code={authCode}<br />
                      &client_id=crm-webapp-9021<br />
                      &redirect_uri=https://crm.company.com/callback<br />
                      &code_verifier=<span className="text-amber-400">{codeVerifier}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>اعتبارسنجی سرور:</strong> هش SHA-256 رشته <code className="text-white">code_verifier</code> محاسبه شد و دقیقاً با <code className="text-white">code_challenge</code> مرحله قبل تطبیق یافت.
                      کد بلافاصله باطل گردید (تک‌مصرفی) و توکن‌ها با کلید RS256 صادر شدند!
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={resetPkce}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> شروع مجدد
                    </button>
                    <span className="text-xs text-emerald-400 font-mono">
                      ✓ احراز هویت با موفقیت تکمیل شد
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Refresh Token Rotation & Token Reuse Detection */}
        {activeProtocol === 'reuse-detection' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
              <strong className="text-indigo-400">مکانیسم خانواده توکن‌ها (Token Family) و تشخیص سرقت:</strong><br />
              هر زمان که کلاینت درخواست تمدید توکن می‌دهد، Refresh Token قبلی «مصرف‌شده» (used) می‌شود و یک توکن جدید جایگزین می‌شود. اگر هکر توکن قبلی را دزدیده باشد و سعی کند از آن استفاده کند، سیستم فوراً متوجه سرقت شده و <strong>تمام توکن‌های صادرشده برای آن سشن</strong> را باطل می‌نماید!
            </div>

            {/* Visual Token Chain */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 font-mono">
                  Family ID: {tokenFamily.id}
                </span>
                <button
                  onClick={resetReuseDemo}
                  className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> ریست تست
                </button>
              </div>

              <div className="space-y-3">
                {tokenFamily.tokens.map((tok, i) => (
                  <div
                    key={tok.version}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                      tok.status === 'active'
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                        : tok.status === 'used'
                        ? 'bg-slate-900 border-slate-800 text-slate-500'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center font-mono">
                        v{tok.version}
                      </span>
                      <code className="text-xs font-mono">{tok.token}</code>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        tok.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : tok.status === 'used'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {tok.status === 'active' ? '● توکن معتبر فعلی' : tok.status === 'used' ? 'مصرف‌شده (Used)' : 'باطل‌شده امنیتی (Revoked)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleRotateLegitToken}
                  disabled={tokenFamily.tokens.some(t => t.status === 'revoked') || tokenFamily.tokens.length >= 3}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> شبیه‌سازی تمدید طبیعی توسط کاربر قانونی (Rotation)
                </button>

                <button
                  onClick={handleSimulateAttackerReuse}
                  disabled={tokenFamily.tokens.length < 2 || tokenFamily.tokens.some(t => t.status === 'revoked')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> شبیه‌سازی نفوذ هکر با استفاده از توکن مصرف‌شده v1 (Reuse Attack)
                </button>
              </div>

              {/* Alert Banner */}
              {reuseAlert && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-600/50 rounded-xl text-xs text-rose-200 leading-relaxed animate-pulse">
                  {reuseAlert}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Client Credentials M2M Flow */}
        {activeProtocol === 'client-credentials' && (
          <div className="pt-6 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
              <strong>ارتباط سرور به سرور (Machine-to-Machine):</strong><br />
              برای زمان‌هایی که هیچ کاربری پشت سیستم نیست (مانند سرویس صدور صورت‌حساب که می‌خواهد با سرویس گزارش‌گیری تبادل داده کند). در این حالت کلاینت با <code className="text-indigo-400 font-mono">client_id</code> و <code className="text-amber-400 font-mono">client_secret</code> مستقیماً Access Token می‌گیرد.
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">درخواست نمونه cURL:</span>
              <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto">
{`curl -X POST https://auth.enterprise-iam.com/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=billing-service-worker" \\
  -d "client_secret=sec_live_98a72b109cde" \\
  -d "scope=invoices:generate reports:write"`}
              </pre>

              <span className="text-xs font-bold text-slate-400 uppercase">پاسخ سرور هویت (Access Token فاقد کاربر انسانی):</span>
              <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto">
{`{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImlhbS0yMDI2LXEzIn0...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "invoices:generate reports:write"
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
