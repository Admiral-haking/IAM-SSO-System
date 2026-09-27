import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory mock database for live demonstrations
interface Tenant {
  id: string;
  slug: string;
  name: string;
  customDomain?: string;
  isActive: boolean;
}

interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  passwordHash: string;
  failedAttempts: number;
  lockedUntil?: Date | null;
  mfaEnabled: boolean;
}

interface OAuthClient {
  id: string;
  clientId: string;
  clientSecret: string;
  name: string;
  clientType: 'CONFIDENTIAL' | 'PUBLIC';
  redirectUris: string[];
  allowedGrantTypes: string[];
  allowedScopes: string[];
}

interface AuthCodeRecord {
  code: string;
  clientId: string;
  userId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  scopes: string[];
  expiresAt: Date;
  used: boolean;
}

interface TokenRecord {
  token: string;
  tokenHash: string;
  userId: string;
  clientId: string;
  familyId: string;
  version: number;
  isRevoked: boolean;
  expiresAt: Date;
}

// Key pair management (RSA-2048)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const currentKid = `iam-key-${new Date().getFullYear()}-q3-primary`;
const previousKid = `iam-key-${new Date().getFullYear()}-q2-grace`;

// Mock Storage
const tenants: Tenant[] = [
  { id: 'ten-acme-001', slug: 'acme-corp', name: 'Acme International', customDomain: 'auth.acme.com', isActive: true },
  { id: 'ten-fintech-002', slug: 'fintech-plus', name: 'FinTech Plus Ltd', isActive: true },
];

const users: User[] = [
  {
    id: 'usr-ali-101',
    tenantId: 'ten-acme-001',
    email: 'ali@company.com',
    name: 'علی خیری',
    roles: ['TenantAdmin', 'ProjectLead'],
    permissions: ['users:read', 'users:write', 'billing:view', 'iam:keys:view', 'projects:*'],
    passwordHash: 'argon2id$mock_hash_ali_pass',
    failedAttempts: 0,
    mfaEnabled: true,
  },
  {
    id: 'usr-sara-102',
    tenantId: 'ten-acme-001',
    email: 'sara@company.com',
    name: 'سارا محمدی',
    roles: ['SecurityAuditor'],
    permissions: ['iam:audit:read', 'users:read', 'sessions:read'],
    passwordHash: 'argon2id$mock_hash_sara_pass',
    failedAttempts: 0,
    mfaEnabled: false,
  }
];

const clients: OAuthClient[] = [
  {
    id: 'cl-crm-web',
    clientId: 'crm-webapp-9021',
    clientSecret: 'crm_sec_live_9921_secret',
    name: 'سامانه یکپارچه CRM و فروش',
    clientType: 'PUBLIC',
    redirectUris: ['https://crm.company.com/auth/callback', 'http://localhost:3000/callback'],
    allowedGrantTypes: ['authorization_code', 'refresh_token'],
    allowedScopes: ['openid', 'profile', 'email', 'offline_access', 'crm:read', 'crm:write']
  },
  {
    id: 'cl-billing-srv',
    clientId: 'billing-worker-service',
    clientSecret: 'srv_sec_m2m_token_48102',
    name: 'میکروسرویس صورت‌حساب مالی (M2M)',
    clientType: 'CONFIDENTIAL',
    redirectUris: [],
    allowedGrantTypes: ['client_credentials'],
    allowedScopes: ['invoices:read', 'invoices:create', 'ledger:write']
  }
];

const authCodes: Map<string, AuthCodeRecord> = new Map();
const refreshTokens: Map<string, TokenRecord> = new Map();
const revokedJtis = new Set<string>();
const auditLogs: any[] = [];

// Helper to log audit event
function recordAudit(action: string, severity: 'INFO' | 'WARN' | 'CRITICAL', metadata: any, userId?: string) {
  auditLogs.unshift({
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    severity,
    userId: userId || 'anonymous',
    metadata
  });
  if (auditLogs.length > 50) auditLogs.pop();
}

// ---------------------------------------------------------------------------
// 1. OIDC Discovery & JWKS
// ---------------------------------------------------------------------------
app.get('/.well-known/openid-configuration', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    userinfo_endpoint: `${baseUrl}/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    revocation_endpoint: `${baseUrl}/oauth/revoke`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'client_credentials', 'refresh_token'],
    subject_types_supported: ['public', 'pairwise'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'profile', 'email', 'offline_access', 'roles', 'permissions'],
    code_challenge_methods_supported: ['S256']
  });
});

app.get('/.well-known/jwks.json', (req, res) => {
  const pubKeyObj = crypto.createPublicKey(publicKey);
  const jwk = pubKeyObj.export({ format: 'jwk' });

  res.json({
    keys: [
      {
        ...jwk,
        kid: currentKid,
        use: 'sig',
        alg: 'RS256'
      },
      {
        kty: 'RSA',
        use: 'sig',
        kid: previousKid,
        alg: 'RS256',
        n: 'm7bW99_kK2_GracePeriodPreviousKeySampleModulusAQAB',
        e: 'AQAB'
      }
    ]
  });
});

// ---------------------------------------------------------------------------
// 2. OAuth2 /oauth/authorize (Simulated)
// ---------------------------------------------------------------------------
app.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, response_type, scope, code_challenge, code_challenge_method, state } = req.query;

  const client = clients.find(c => c.clientId === client_id);
  if (!client) {
    return res.status(400).json({ error: 'invalid_client', error_description: 'کلاینت مورد نظر یافت نشد.' });
  }

  if (response_type !== 'code') {
    return res.status(400).json({ error: 'unsupported_response_type', error_description: 'فقط نوع code پشتیبانی می‌شود.' });
  }

  // Issue Authorization Code
  const code = `code_${crypto.randomBytes(16).toString('hex')}`;
  authCodes.set(code, {
    code,
    clientId: client.clientId,
    userId: 'usr-ali-101',
    redirectUri: String(redirect_uri),
    codeChallenge: String(code_challenge || ''),
    codeChallengeMethod: String(code_challenge_method || 'S256'),
    scopes: scope ? String(scope).split(' ') : ['openid'],
    expiresAt: new Date(Date.now() + 600000), // 10 minutes
    used: false
  });

  recordAudit('AUTH.AUTHORIZATION_CODE_ISSUED', 'INFO', { clientId: client_id, codePrefix: code.substring(0, 10) }, 'usr-ali-101');

  res.json({
    success: true,
    message: 'کد احراز هویت با موفقیت صادر شد.',
    code,
    state,
    redirectUrl: `${redirect_uri}?code=${code}${state ? `&state=${state}` : ''}`
  });
});

// ---------------------------------------------------------------------------
// 3. OAuth2 /oauth/token (Exchange Code, Refresh, or M2M)
// ---------------------------------------------------------------------------
app.post('/oauth/token', (req, res) => {
  const { grant_type, code, client_id, client_secret, redirect_uri, code_verifier, refresh_token, scope } = req.body;

  // Authorization Code Flow with PKCE
  if (grant_type === 'authorization_code') {
    const authCodeRecord = authCodes.get(code);
    if (!authCodeRecord || authCodeRecord.used || authCodeRecord.expiresAt < new Date()) {
      recordAudit('AUTH.INVALID_GRANT_ATTEMPT', 'WARN', { code, reason: 'Expired or used' });
      return res.status(400).json({ error: 'invalid_grant', error_description: 'کد نامعتبر، منقضی‌شده یا قبلاً استفاده‌شده است.' });
    }

    // Verify PKCE if present
    if (authCodeRecord.codeChallenge) {
      if (!code_verifier) {
        return res.status(400).json({ error: 'invalid_request', error_description: 'پارامتر code_verifier برای این کلاینت الزامی است.' });
      }
      const calculatedChallenge = crypto
        .createHash('sha256')
        .update(code_verifier)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      if (calculatedChallenge !== authCodeRecord.codeChallenge) {
        recordAudit('SECURITY.PKCE_VERIFICATION_FAILED', 'CRITICAL', { clientId: client_id });
        return res.status(400).json({ error: 'invalid_grant', error_description: 'مقدار code_verifier با چالش اولیه مطابقت ندارد!' });
      }
    }

    authCodeRecord.used = true;
    const user = users.find(u => u.id === authCodeRecord.userId)!;

    // Issue RS256 Tokens
    const jti = `jwt_${crypto.randomBytes(12).toString('hex')}`;
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        tenant_id: user.tenantId,
        roles: user.roles,
        permissions: user.permissions,
        client_id: authCodeRecord.clientId,
        scope: authCodeRecord.scopes.join(' '),
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: currentKid,
        expiresIn: '15m',
        jwtid: jti
      }
    );

    const idToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        aud: authCodeRecord.clientId
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: currentKid,
        expiresIn: '1h'
      }
    );

    // Refresh Token with Family Tracking
    const familyId = `fam_${crypto.randomBytes(8).toString('hex')}`;
    const newRefreshToken = `rft_v1_${crypto.randomBytes(24).toString('hex')}`;
    refreshTokens.set(newRefreshToken, {
      token: newRefreshToken,
      tokenHash: crypto.createHash('sha256').update(newRefreshToken).digest('hex'),
      userId: user.id,
      clientId: authCodeRecord.clientId,
      familyId,
      version: 1,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
    });

    recordAudit('TOKEN.ISSUED_SUCCESS', 'INFO', { userId: user.id, clientId: client_id, jti }, user.id);

    return res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: newRefreshToken,
      id_token: idToken,
      scope: authCodeRecord.scopes.join(' ')
    });
  }

  // Refresh Token Rotation Flow
  if (grant_type === 'refresh_token') {
    const existing = refreshTokens.get(refresh_token);
    if (!existing) {
      recordAudit('SECURITY.UNKNOWN_REFRESH_TOKEN', 'WARN', { tokenPrefix: String(refresh_token).substring(0, 10) });
      return res.status(400).json({ error: 'invalid_grant', error_description: 'توکن تجدید یافت نشد.' });
    }

    // Reuse Detection Check
    if (existing.isRevoked) {
      // Attacker tried to use an already revoked token! Revoke entire family!
      for (const [k, v] of refreshTokens.entries()) {
        if (v.familyId === existing.familyId) {
          v.isRevoked = true;
        }
      }
      recordAudit('SECURITY.TOKEN_REUSE_DETECTED_FAMILY_REVOKED', 'CRITICAL', { familyId: existing.familyId, userId: existing.userId });
      return res.status(400).json({
        error: 'invalid_grant',
        error_description: 'هشدار امنیتی: تلاش برای استفاده مجدد از توکن قبلاً باطل‌شده! کلیه نشست‌های مرتبط با این توکن برای حفظ امنیت باطل شدند.'
      });
    }

    // Mark current as revoked/used
    existing.isRevoked = true;

    // Issue Next Token in Family
    const user = users.find(u => u.id === existing.userId)!;
    const nextVersion = existing.version + 1;
    const nextTokenStr = `rft_v${nextVersion}_${crypto.randomBytes(24).toString('hex')}`;
    refreshTokens.set(nextTokenStr, {
      token: nextTokenStr,
      tokenHash: crypto.createHash('sha256').update(nextTokenStr).digest('hex'),
      userId: user.id,
      clientId: existing.clientId,
      familyId: existing.familyId,
      version: nextVersion,
      isRevoked: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
    });

    const jti = `jwt_${crypto.randomBytes(12).toString('hex')}`;
    const newAccessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        tenant_id: user.tenantId,
        roles: user.roles,
        permissions: user.permissions,
        client_id: existing.clientId
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: currentKid,
        expiresIn: '15m',
        jwtid: jti
      }
    );

    recordAudit('TOKEN.ROTATED_SUCCESS', 'INFO', { userId: user.id, nextVersion, familyId: existing.familyId }, user.id);

    return res.json({
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: nextTokenStr
    });
  }

  // Client Credentials Flow (M2M)
  if (grant_type === 'client_credentials') {
    const client = clients.find(c => c.clientId === client_id && c.clientSecret === client_secret);
    if (!client) {
      recordAudit('SECURITY.M2M_AUTH_FAILED', 'WARN', { clientId: client_id });
      return res.status(401).json({ error: 'invalid_client', error_description: 'شناسه یا رمز کلاینت نامعتبر است.' });
    }

    const jti = `jwt_m2m_${crypto.randomBytes(10).toString('hex')}`;
    const m2mToken = jwt.sign(
      {
        sub: client.clientId,
        client_id: client.clientId,
        is_machine: true,
        scope: scope || client.allowedScopes.join(' ')
      },
      privateKey,
      {
        algorithm: 'RS256',
        keyid: currentKid,
        expiresIn: '1h',
        jwtid: jti
      }
    );

    recordAudit('M2M.TOKEN_ISSUED', 'INFO', { clientId: client.clientId, jti });

    return res.json({
      access_token: m2mToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: scope || client.allowedScopes.join(' ')
    });
  }

  res.status(400).json({ error: 'unsupported_grant_type', error_description: 'نوع grant_type پشتیبانی نمی‌شود.' });
});

// ---------------------------------------------------------------------------
// 4. UserInfo Endpoint (Protected)
// ---------------------------------------------------------------------------
app.get('/userinfo', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized', message: 'هدر توکن Bearer الزامی است.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload: any = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    if (revokedJtis.has(payload.jti)) {
      return res.status(401).json({ error: 'token_revoked', message: 'این توکن باطل شده است.' });
    }

    const user = users.find(u => u.id === payload.sub);
    if (!user) {
      return res.status(404).json({ error: 'user_not_found', message: 'کاربر یافت نشد.' });
    }

    res.json({
      sub: user.id,
      email: user.email,
      name: user.name,
      tenant_id: user.tenantId,
      roles: user.roles,
      permissions: user.permissions
    });
  } catch (err: any) {
    res.status(401).json({ error: 'invalid_token', message: err.message });
  }
});

// ---------------------------------------------------------------------------
// 5. Token Revocation
// ---------------------------------------------------------------------------
app.post('/oauth/revoke', (req, res) => {
  const { token } = req.body;
  if (token) {
    if (token.startsWith('rft_')) {
      const rt = refreshTokens.get(token);
      if (rt) rt.isRevoked = true;
    } else {
      // Decode JWT unverified to get jti
      const decoded: any = jwt.decode(token);
      if (decoded && decoded.jti) {
        revokedJtis.add(decoded.jti);
      }
    }
  }
  recordAudit('TOKEN.REVOCATION_CALLED', 'INFO', { tokenSnippet: String(token).substring(0, 10) });
  res.status(200).send();
});

// ---------------------------------------------------------------------------
// 6. Admin & Health Endpoints
// ---------------------------------------------------------------------------
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    tenantsCount: tenants.length,
    usersCount: users.length,
    activeRefreshTokens: Array.from(refreshTokens.values()).filter(t => !t.isRevoked).length,
    revokedTokensCount: Array.from(refreshTokens.values()).filter(t => t.isRevoked).length,
    activeSigningKeyKid: currentKid,
    auditLogsCount: auditLogs.length,
    uptimeSeconds: Math.floor(process.uptime()),
    status: 'HEALTHY'
  });
});

app.get('/api/admin/audit-logs', (req, res) => {
  res.json({ data: auditLogs });
});

app.get('/api/admin/users', (req, res) => {
  res.json({ data: users.map(u => ({ id: u.id, email: u.email, name: u.name, roles: u.roles, permissions: u.permissions, mfa: u.mfaEnabled })) });
});

app.get('/api/admin/clients', (req, res) => {
  res.json({ data: clients });
});

export default app;
