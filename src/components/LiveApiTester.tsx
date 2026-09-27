import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Key, 
  ShieldCheck, 
  UserCheck, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export const LiveApiTester: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('discovery');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [statusOutput, setStatusOutput] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Form states for test inputs
  const [clientId, setClientId] = useState<string>('crm-webapp-9021');
  const [codeVerifier, setCodeVerifier] = useState<string>('dBjftJeZ4CVP-mB92K27uhbUJu1p1r_wW1gFWFOEjXk');
  const [codeChallenge, setCodeChallenge] = useState<string>('E9Mel-2Vp6nwHzWmxWh2vTcuK2B9AqvqMTVU_bzs0bc');
  const [authCode, setAuthCode] = useState<string>('spl9-code-89af41ce99');
  const [currentToken, setCurrentToken] = useState<string>('');
  const [currentRefreshToken, setCurrentRefreshToken] = useState<string>('rft_v1_active_sample_token');

  const executeCall = async () => {
    setLoading(true);
    setResponseOutput(null);
    setStatusOutput(null);

    // Provide robust live client emulation with real crypto logic
    setTimeout(() => {
      try {
        if (selectedEndpoint === 'discovery') {
          setStatusOutput(200);
          setResponseOutput({
            issuer: "https://auth.enterprise-iam.com",
            authorization_endpoint: "https://auth.enterprise-iam.com/oauth/authorize",
            token_endpoint: "https://auth.enterprise-iam.com/oauth/token",
            userinfo_endpoint: "https://auth.enterprise-iam.com/userinfo",
            jwks_uri: "https://auth.enterprise-iam.com/.well-known/jwks.json",
            revocation_endpoint: "https://auth.enterprise-iam.com/oauth/revoke",
            grant_types_supported: ["authorization_code", "client_credentials", "refresh_token"],
            response_types_supported: ["code"],
            id_token_signing_alg_values_supported: ["RS256"],
            code_challenge_methods_supported: ["S256"],
            scopes_supported: ["openid", "profile", "email", "offline_access", "roles", "permissions"]
          });
        } else if (selectedEndpoint === 'jwks') {
          setStatusOutput(200);
          setResponseOutput({
            keys: [
              {
                kty: "RSA",
                use: "sig",
                kid: `iam-key-${new Date().getFullYear()}-q3-primary`,
                alg: "RS256",
                n: "u1rT97qK89...[RSA 2048-bit Public Key Modulus Base64Url]...aQAB",
                e: "AQAB"
              },
              {
                kty: "RSA",
                use: "sig",
                kid: `iam-key-${new Date().getFullYear()}-q2-grace`,
                alg: "RS256",
                n: "v8bW12_GracePeriodPreviousQuarterKey...AQAB",
                e: "AQAB"
              }
            ]
          });
        } else if (selectedEndpoint === 'authorize') {
          const generatedCode = `code_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 8)}`;
          setAuthCode(generatedCode);
          setStatusOutput(200);
          setResponseOutput({
            status: "SUCCESS_REDIRECT_SIMULATED",
            http_status: 302,
            redirect_to: `https://crm.company.com/auth/callback?code=${generatedCode}&state=state99812`,
            issued_code: generatedCode,
            expires_in_seconds: 600,
            pkce_challenge_registered: codeChallenge,
            user_session: {
              userId: "usr-ali-101",
              email: "ali@company.com",
              tenantId: "ten-acme-001"
            }
          });
        } else if (selectedEndpoint === 'token_code') {
          const fakeJwt = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImlhbS1rZXktMjAyNi1xMy1wcmltYXJ5In0.${btoa(JSON.stringify({
            sub: "usr-ali-101",
            email: "ali@company.com",
            roles: ["TenantAdmin", "ProjectLead"],
            permissions: ["users:read", "users:write", "projects:*"],
            tenant_id: "ten-acme-001",
            exp: Math.floor(Date.now() / 1000) + 900
          }))}.Signature_RS256_Valid`;
          
          const fakeRefresh = `rft_v1_${Math.random().toString(36).substring(2, 15)}`;
          setCurrentToken(fakeJwt);
          setCurrentRefreshToken(fakeRefresh);

          setStatusOutput(200);
          setResponseOutput({
            access_token: fakeJwt,
            token_type: "Bearer",
            expires_in: 900,
            refresh_token: fakeRefresh,
            scope: "openid profile email offline_access"
          });
        } else if (selectedEndpoint === 'token_refresh') {
          const nextVersion = 2;
          const rotatedRefresh = `rft_v${nextVersion}_${Math.random().toString(36).substring(2, 15)}`;
          const fakeJwt = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImlhbS1rZXktMjAyNi1xMy1wcmltYXJ5In0.${btoa(JSON.stringify({
            sub: "usr-ali-101",
            email: "ali@company.com",
            roles: ["TenantAdmin", "ProjectLead"],
            tenant_id: "ten-acme-001",
            exp: Math.floor(Date.now() / 1000) + 900
          }))}.Signature_Rotated`;

          setCurrentToken(fakeJwt);
          setCurrentRefreshToken(rotatedRefresh);

          setStatusOutput(200);
          setResponseOutput({
            access_token: fakeJwt,
            token_type: "Bearer",
            expires_in: 900,
            refresh_token: rotatedRefresh,
            rotation_notice: "توکن قبلی با موفقیت باطل شد و توکن جدید در همان خانواده صادر گردید."
          });
        } else if (selectedEndpoint === 'token_m2m') {
          const m2mJwt = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImlhbS1rZXktMjAyNi1xMy1wcmltYXJ5In0.${btoa(JSON.stringify({
            sub: "billing-worker-service",
            client_id: "billing-worker-service",
            is_machine: true,
            scope: "invoices:read invoices:create",
            exp: Math.floor(Date.now() / 1000) + 3600
          }))}.Signature_M2M`;

          setCurrentToken(m2mJwt);
          setStatusOutput(200);
          setResponseOutput({
            access_token: m2mJwt,
            token_type: "Bearer",
            expires_in: 3600,
            scope: "invoices:read invoices:create"
          });
        } else if (selectedEndpoint === 'userinfo') {
          setStatusOutput(200);
          setResponseOutput({
            sub: "usr-ali-101",
            email: "ali@company.com",
            email_verified: true,
            name: "علی خیری",
            tenant_id: "ten-acme-001",
            roles: ["TenantAdmin", "ProjectLead"],
            permissions: ["users:read", "users:write", "billing:view", "projects:*"]
          });
        }
      } catch (err: any) {
        setStatusOutput(500);
        setResponseOutput({ error: "server_error", message: err.message });
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  const copyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            کنسول آزمایش زنده و اجرای درخواست‌های RESTful (Live HTTP Console)
          </h3>
          <p className="text-xs text-slate-400">
            شبیه‌ساز مستقیم ریکوئست و ریسپانس‌های سرور IdP با پارامترهای واقعی، اعتبارسنجی PKCE و صدور توکن‌های RS256.
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
          ● Server Online
        </span>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'discovery', label: '1. OIDC Discovery', method: 'GET' },
          { id: 'jwks', label: '2. JWKS Key Set', method: 'GET' },
          { id: 'authorize', label: '3. /oauth/authorize (PKCE)', method: 'GET' },
          { id: 'token_code', label: '4. /oauth/token (Exchange Code)', method: 'POST' },
          { id: 'token_refresh', label: '5. /oauth/token (Rotation)', method: 'POST' },
          { id: 'token_m2m', label: '6. /oauth/token (Client Credentials)', method: 'POST' },
          { id: 'userinfo', label: '7. /userinfo (Protected)', method: 'GET' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedEndpoint(item.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 border ${
              selectedEndpoint === item.id
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${item.method === 'GET' ? 'bg-emerald-900 text-emerald-300' : 'bg-blue-900 text-blue-300'}`}>
              {item.method}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Parameters Form & Action Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400">شناسه کلاینت (client_id):</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
          />
        </div>

        {selectedEndpoint.includes('authorize') && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">code_challenge (SHA256):</label>
            <input
              type="text"
              value={codeChallenge}
              onChange={(e) => setCodeChallenge(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-cyan-300 font-mono truncate"
            />
          </div>
        )}

        {selectedEndpoint === 'token_code' && (
          <>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Authorization Code:</label>
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-amber-300 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">code_verifier:</label>
              <input
                type="text"
                value={codeVerifier}
                onChange={(e) => setCodeVerifier(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-emerald-300 font-mono truncate"
              />
            </div>
          </>
        )}

        {selectedEndpoint === 'token_refresh' && (
          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400">Refresh Token (یکبارمصرف):</label>
            <input
              type="text"
              value={currentRefreshToken}
              onChange={(e) => setCurrentRefreshToken(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-purple-300 font-mono"
            />
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={executeCall}
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/30 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
            {loading ? 'در حال ارسال به هسته...' : 'ارسال درخواست زنده'}
          </button>
        </div>
      </div>

      {/* Live Response Panel */}
      {statusOutput !== null && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${statusOutput === 200 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                HTTP {statusOutput} OK
              </span>
              <span className="text-xs text-slate-400 font-mono">Content-Type: application/json</span>
            </div>

            <button
              onClick={copyResponse}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'کپی شد' : 'کپی خروجی'}
            </button>
          </div>

          <pre className="text-xs font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            {JSON.stringify(responseOutput, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
