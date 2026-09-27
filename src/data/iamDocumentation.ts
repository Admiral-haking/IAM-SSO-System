export interface ApiEndpoint {
  id: string;
  category: 'OAuth2/OIDC' | 'Admin & Management' | 'User & Profile' | 'Tenant & Keys';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  description: string;
  authRequired: boolean;
  requiredScopes?: string[];
  headers?: Record<string, string>;
  requestBody?: string;
  response200?: string;
  responseError?: {
    status: number;
    body: string;
  };
}

export interface ArchitectureComponent {
  id: string;
  nameFa: string;
  nameEn: string;
  category: 'Edge & Gateway' | 'Core IAM Services' | 'Persistence & Cache' | 'Security & Secrets' | 'Integration & Federation';
  tech: string;
  roleFa: string;
  responsibilities: string[];
  protocols: string[];
  bestPractices: string[];
}

export const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: 'api-gateway',
    nameFa: 'دروازه سرویس و مدیریت ترافیک (API Gateway)',
    nameEn: 'API Gateway & Reverse Proxy',
    category: 'Edge & Gateway',
    tech: 'Envoy / NGINX / Cloudflare',
    roleFa: 'دروازه ورودی امن برای تمام کلاینت‌ها، مدیریت SSL Termination، مسدودسازی حملات DDoS و Rate Limiting توزیع‌شده.',
    responsibilities: [
      'اعمال مهار بار ترافیک اولیه (L7 Rate Limiting)',
      'تزریق هدرهای امنیتی (HSTS, CSP, X-Frame-Options)',
      'مسیریابی هوشمند به سرویس IAM بر اساس دامنه مستأجر (Tenant Custom Domain)',
      'مدیریت گواهی‌نامه‌های TLS 1.3'
    ],
    protocols: ['HTTPS / TLS 1.3', 'HTTP/2', 'gRPC'],
    bestPractices: [
      'جلوگیری از نشت هدرهای داخلی X-Forwarded-* از سمت کلاینت ناشناس',
      'پیکربندی زمان‌بندی تایم‌اوت سخت‌گیرانه برای جلوگیری از حملات Slowloris'
    ]
  },
  {
    id: 'oauth-engine',
    nameFa: 'موتور پروتکل OAuth2.1 و OpenID Connect',
    nameEn: 'OAuth 2.1 & OIDC Engine',
    category: 'Core IAM Services',
    tech: 'NestJS + Passport / Custom RFC compliant engine',
    roleFa: 'هسته پیاده‌سازی استانداردهای جهانی تبادل هویت، صدور توکن، کدهای احراز هویت و بررسی رضایت کاربر (Consent).',
    responsibilities: [
      'پیاده‌سازی Authorization Code Flow همراه با PKCE اجباری (RFC 7636)',
      'پشتیبانی از Client Credentials Flow برای ارتباطات سرویس به سرویس (M2M)',
      'تولید و اعتبارسنجی ID Token منطبق بر OIDC Core 1.0',
      'مدیریت Consent Screen و Scopeهای درخواست‌شده (openid, profile, email, offline_access)'
    ],
    protocols: ['OAuth 2.1', 'OpenID Connect Core 1.0', 'RFC 8414 (OAuth 2.0 Authorization Server Metadata)'],
    bestPractices: [
      'غیرفعال‌سازی دائمی Implicit Grant و Resource Owner Password Credentials (ROPC) بر اساس آخرین رهنمودهای امنیتی IETF',
      'استفاده اجباری از PKCE با روش S256 حتی برای کلاینت‌های Confidential'
    ]
  },
  {
    id: 'token-session-mgr',
    nameFa: 'سیستم چرخش توکن و مدیریت نشست‌ها',
    nameEn: 'Token & Session Lifecycle Manager',
    category: 'Core IAM Services',
    tech: 'NestJS + Redis Cluster',
    roleFa: 'تولید Access Tokenهای کوتاه‌مدت، Refresh Tokenهای رمزگذاری‌شده یکبار مصرف و ردگیری فعال سشن‌های کاربران.',
    responsibilities: [
      'پیاده‌سازی Refresh Token Rotation با قابلیت تشخیص بازاستفاده مشکوک (Token Reuse Detection)',
      'ردگیری دستگاه‌های فعال (Device & Fingerprint Tracking: IP, User-Agent, GEO)',
      'خروج فوری از تمام نشست‌ها (Global Logout / Revoke All Sessions)',
      'مدیریت لیست توکن‌های باطل‌شده (Token Blacklist / Bloom Filter)'
    ],
    protocols: ['JWT (RFC 7519)', 'JWE (RFC 7516)', 'Redis RESP'],
    bestPractices: [
      'طول عمر کوتاه Access Token حداکثر ۱۰ تا ۱۵ دقیقه',
      'استفاده از پایگاه داده حافظه‌ای با Replication فعال برای اطمینان از Zero-Downtime در ابطال توکن'
    ]
  },
  {
    id: 'rbac-abac-engine',
    nameFa: 'موتور کنترل دسترسی و احراز مجوز (RBAC / PBAC)',
    nameEn: 'Authorization & Policy Engine',
    category: 'Core IAM Services',
    tech: 'NestJS Guards + CASL / Open Policy Agent (OPA)',
    roleFa: 'ارزیابی بی‌درنگ دسترسی‌ها بر اساس نقش‌ها، مجوزهای دانه‌ای (Granular Permissions) و ویژگی‌های مستأجر.',
    responsibilities: [
      'ارزیابی دسترسی فرمولی: Resource + Action + TenantId',
      'تخصیص چندگانه نقش‌ها به کاربران (Multi-role assignment)',
      'پشتیبانی از ارث‌بری دسترسی‌ها (Hierarchical Roles)',
      'تولید کلیم‌های فشرده شده permissions درون Access Token'
    ],
    protocols: ['RBAC (NIST standard)', 'ReBAC / ABAC'],
    bestPractices: [
      'کَش‌سازی سلسله مراتب مجوزها با TTL متناسب در Redis',
      'عدم اتکای صرف به کلیم نقش؛ تمرکز روی مجوزهای عملکردی (Permissions)'
    ]
  },
  {
    id: 'key-management',
    nameFa: 'ماژول مدیریت و چرخش کلیدها (JWKS / KMS)',
    nameEn: 'Cryptographic Key Manager & JWKS',
    category: 'Security & Secrets',
    tech: 'HashiCorp Vault / AWS KMS / Node.js crypto (RSA / ECDSA)',
    roleFa: 'تولید، نگهداری امن، چرخش بدون قطعی کلیدهای امضای JWT و ارائه Endpoint عمومی JWKS.',
    responsibilities: [
      'تولید جفت کلید نامتقارن (RS256 با کلید ۲۰۴۸ بیتی یا ES256 با منحنی P-256)',
      'چرخش خودکار کلیدها هر ۹۰ روز با حفظ کلید قبلی جهت اعتبارسنجی توکن‌های جاری (Grace Period)',
      'انتشار کلیدهای عمومی از طریق اندپوینت استاندارد `/.well-known/jwks.json` با شناسه یکتای `kid`'
    ],
    protocols: ['RFC 7517 (JSON Web Key)', 'RFC 7518 (JWA)'],
    bestPractices: [
      'کلید خصوصی هرگز روی هارد دیسک به شکل Plaintext ذخیره نشود',
      'سرویس‌های دیگر (Resource Servers) باید JWKS را محلی کَش کرده و با تغییر `kid` مجدداً فراخوانی کنند'
    ]
  },
  {
    id: 'database-cluster',
    nameFa: 'پایگاه داده اصلی رابطه‌ای و چندمستأجری',
    nameEn: 'Relational Database (Multi-Tenant)',
    category: 'Persistence & Cache',
    tech: 'PostgreSQL 16+ با Prisma ORM',
    roleFa: 'منبع واحد حقیقت (Single Source of Truth) برای ذخیره ساختار مستأجرها، کاربران، نقش‌ها و کلاینت‌ها.',
    responsibilities: [
      'جداسازی چندمستأجری بر اساس ستون tenant_id با ایندکس‌های کامپوزیت',
      'اعمال قیدهای جامعیت ارجاعی (ACID Transactions)',
      'ذخیره اعتبارسنجی رمزهای عبور با الگوریتم مدرن Argon2id',
      'پشتیبانی از Read Replicas جهت پاسخگویی به بارهای خواندن سنگین'
    ],
    protocols: ['PostgreSQL Wire Protocol', 'Prisma Engine'],
    bestPractices: [
      'استفاده از Connection Pooling (PgBouncer) برای جلوگیری از اشباع منابع در ترافیک بالا',
      'رمزنگاری ستون‌های حساس نظیر client_secret با pgcrypto یا در سطح لایه سرویس'
    ]
  },
  {
    id: 'cache-queue',
    nameFa: 'لایه کَش توزیع‌شده و صف پیام پس‌زمینه',
    nameEn: 'Distributed Cache & Async Queue',
    category: 'Persistence & Cache',
    tech: 'Redis 7+ & BullMQ',
    roleFa: 'پاسخ‌دهی زیرمیلی‌ثانیه‌ای به بررسی وضعیت نشست‌ها و پردازش غیرهمگام رویدادهای سنگین.',
    responsibilities: [
      'اعمال الگوریتم Sliding Window Rate Limiter در سطح IP و ClientId',
      'صف‌بندی ارسال کدهای تأیید ایمیل و پیامک (MFA & Password Reset)',
      'ارسال وب‌هوک‌های امنیتی به سرویس‌های متصل (Event Webhooks)',
      'پاک‌سازی خودکار نشست‌ها و کدهای موقت منقضی‌شده'
    ],
    protocols: ['Redis RESP', 'AMQP / BullMQ Streams'],
    bestPractices: [
      'تعیین حداکثر حافظه (maxmemory) با استراتژی volatile-lru برای جلوگیری از OOM',
      'رمزنگاری داده‌های حساس ذخیره‌شده در Redis'
    ]
  },
  {
    id: 'audit-security',
    nameFa: 'سامانه ثبت رویدادهای امنیتی (Audit Logging & IDS)',
    nameEn: 'Security Audit Log & Anomaly Detection',
    category: 'Security & Secrets',
    tech: 'Elasticsearch / OpenSearch + Winston / Pino',
    roleFa: 'ثبت تغییرناپذیر تمام فعالیت‌های حیاتی سامانه جهت انطباق با استانداردهای SOC2 و ISO 27001.',
    responsibilities: [
      'ثبت وقایع ورود، عدم موفقیت در احراز هویت، تغییر نقش، صدور توکن و خروج',
      'شناسایی الگوهای مشکوک (مانند ورود همزمان از دو کشور ناممکن - Impossible Travel)',
      'هشدار خودکار و قفل موقت حساب کاربری پس از ۵ تلاش ناموفق (Brute-Force Protection)',
      'ارائه گزارش‌های مانیتورینگ برای بازرسان امنیت سازمان'
    ],
    protocols: ['Syslog', 'Elasticsearch REST API'],
    bestPractices: [
      'ماسک‌گذاری داده‌های PII (اطلاعات هویتی حساس و رمزهای عبور) قبل از نوشتن در لاگ',
      'استفاده از معماری Write-Once جهت تضمین عدم دستکاری لاگ‌ها'
    ]
  }
];

export const PRISMA_SCHEMA_CODE = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  PENDING_VERIFICATION
  LOCKED
}

enum ClientType {
  CONFIDENTIAL // Server-side apps (Next.js backend, Go/Java services)
  PUBLIC       // SPA (React, Vue) or Mobile apps (Flutter, Swift)
}

enum MfaType {
  NONE
  TOTP
  WEBAUTHN
  SMS
}

enum AuditSeverity {
  INFO
  WARN
  HIGH
  CRITICAL
}

// -------------------------------------------------------------
// 1. سازمان‌ها و مستأجرین (Tenants)
// -------------------------------------------------------------
model Tenant {
  id              String         @id @default(uuid())
  slug            String         @unique // e.g. "acme-corp"
  name            String
  customDomain    String?        @unique
  logoUrl         String?
  settings        Json?          // Password policy, session limits, branding
  isActive        Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  users           User[]
  roles           Role[]
  clients         Client[]
  signingKeys     SigningKey[]
  auditLogs       AuditLog[]

  @@map("tenants")
}

// -------------------------------------------------------------
// 2. کاربران و پروفایل هویتی (Users)
// -------------------------------------------------------------
model User {
  id                   String        @id @default(uuid())
  tenantId             String
  email                String
  emailVerified        Boolean       @default(false)
  phone                String?
  phoneVerified        Boolean       @default(false)
  passwordHash         String?       // Argon2id hash (null for SSO-only users)
  firstName            String?
  lastName             String?
  status               UserStatus    @default(PENDING_VERIFICATION)
  mfaType              MfaType       @default(NONE)
  failedLoginAttempts  Int           @default(0)
  lockedUntil          DateTime?
  lastLoginAt          DateTime?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  tenant               Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userRoles            UserRole[]
  sessions             Session[]
  refreshTokens        RefreshToken[]
  mfaCredentials       MfaCredential[]
  identities           SocialIdentity[]
  auditLogs            AuditLog[]

  @@unique([tenantId, email])
  @@index([tenantId, status])
  @@map("users")
}

// -------------------------------------------------------------
// 3. نقش‌ها و دسترسی‌های گرانولار (RBAC)
// -------------------------------------------------------------
model Role {
  id          String           @id @default(uuid())
  tenantId    String
  name        String           // e.g. "BillingAdmin", "Viewer"
  description String?
  isSystem    Boolean          @default(false)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  tenant      Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userRoles   UserRole[]
  permissions RolePermission[]

  @@unique([tenantId, name])
  @@map("roles")
}

model Permission {
  id          String           @id @default(uuid())
  resource    String           // e.g. "users", "invoices", "settings"
  action      String           // e.g. "create", "read", "update", "delete", "execute"
  description String?

  roles       RolePermission[]

  @@unique([resource, action])
  @@map("permissions")
}

model UserRole {
  userId      String
  roleId      String
  assignedAt  DateTime         @default(now())

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  role        Role             @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@map("user_roles")
}

model RolePermission {
  roleId       String
  permissionId String

  role         Role            @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission      @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId])
  @@map("role_permissions")
}

// -------------------------------------------------------------
// 4. کلاینت‌های OAuth2 و اپلیکیشن‌ها (Clients)
// -------------------------------------------------------------
model Client {
  id                    String        @id @default(uuid())
  tenantId              String
  clientId              String        @unique @default(uuid())
  clientSecretHash      String?       // Argon2id (null for Public SPA clients)
  name                  String
  clientType            ClientType    @default(CONFIDENTIAL)
  redirectUris          String[]      // Allowed OAuth callback URLs
  postLogoutUris        String[]
  allowedGrantTypes     String[]      // "authorization_code", "client_credentials", "refresh_token"
  allowedScopes         String[]      // "openid", "profile", "email", "api.read", "api.write"
  accessTokenTtlSeconds Int           @default(900)  // 15 mins
  refreshTokenTtlDays   Int           @default(30)   // 30 days
  requirePkce           Boolean       @default(true)
  isActive              Boolean       @default(true)
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  tenant                Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sessions              Session[]
  refreshTokens         RefreshToken[]
  authCodes             AuthCode[]

  @@index([tenantId, clientId])
  @@map("clients")
}

// -------------------------------------------------------------
// 5. کدهای موقت Authorization Code با PKCE
// -------------------------------------------------------------
model AuthCode {
  id                  String        @id @default(uuid())
  code                String        @unique
  clientId            String
  userId              String
  redirectUri         String
  codeChallenge       String        // S256 hash from PKCE
  codeChallengeMethod String        // "S256"
  scopes              String[]
  nonce               String?
  expiresAt           DateTime
  used                Boolean       @default(false)
  createdAt           DateTime      @default(now())

  client              Client        @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([code, used])
  @@map("auth_codes")
}

// -------------------------------------------------------------
// 6. نشست‌ها و توکن‌های Refresh با استراتژی Rotation
// -------------------------------------------------------------
model Session {
  id             String         @id @default(uuid())
  userId         String
  clientId       String?
  ipAddress      String?
  userAgent      String?
  deviceModel    String?
  location       String?
  lastActivityAt DateTime       @default(now())
  expiresAt      DateTime
  isRevoked      Boolean        @default(false)
  createdAt      DateTime       @default(now())

  user           User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  client         Client?        @relation(fields: [clientId], references: [id], onDelete: SetNull)
  refreshTokens  RefreshToken[]

  @@index([userId, isRevoked])
  @@map("sessions")
}

model RefreshToken {
  id          String        @id @default(uuid())
  tokenHash   String        @unique // SHA-256 of the token string
  sessionId   String
  userId      String
  clientId    String
  familyId    String        // UUID identifying the token family for Reuse Detection
  isRevoked   Boolean       @default(false)
  expiresAt   DateTime
  createdAt   DateTime      @default(now())

  session     Session       @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  client      Client        @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([familyId, isRevoked])
  @@map("refresh_tokens")
}

// -------------------------------------------------------------
// 7. مدیریت کلیدهای امضای JWT (JWKS)
// -------------------------------------------------------------
model SigningKey {
  id          String        @id @default(uuid())
  tenantId    String?       // null for Global System Key
  kid         String        @unique // Key ID exposed in JWKS
  algorithm   String        @default("RS256") // "RS256" or "ES256"
  publicKey   String        @db.Text
  privateKey  String        @db.Text // Encrypted using Master Key / KMS
  isActive    Boolean       @default(true) // Currently used for signing
  isRevoked   Boolean       @default(false)
  expiresAt   DateTime
  createdAt   DateTime      @default(now())

  tenant      Tenant?       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([kid, isActive])
  @@map("signing_keys")
}

// -------------------------------------------------------------
// 8. ورود دو مرحله‌ای (MFA Credentials)
// -------------------------------------------------------------
model MfaCredential {
  id          String        @id @default(uuid())
  userId      String
  type        MfaType
  secretKey   String        // Encrypted TOTP secret / WebAuthn Public Key
  backupCodes String[]      // Hashed one-time recovery codes
  isVerified  Boolean       @default(false)
  createdAt   DateTime      @default(now())

  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, type])
  @@map("mfa_credentials")
}

// -------------------------------------------------------------
// 9. اتصال به تأمین‌کنندگان خارجی (SSO & Social Providers)
// -------------------------------------------------------------
model SocialIdentity {
  id             String      @id @default(uuid())
  userId         String
  provider       String      // "google", "github", "microsoft", "saml"
  providerUserId String      // External sub ID
  profileData    Json?
  createdAt      DateTime    @default(now())

  user           User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerUserId])
  @@map("social_identities")
}

// -------------------------------------------------------------
// 10. لاگ‌های امنیتی و حسابرسی تغییرناپذیر (Audit Log)
// -------------------------------------------------------------
model AuditLog {
  id         String         @id @default(uuid())
  tenantId   String
  userId     String?
  action     String         // "AUTH.LOGIN_SUCCESS", "ROLE.ASSIGNED", "TOKEN.REVOKED"
  severity   AuditSeverity  @default(INFO)
  resource   String         // e.g. "users/uuid-123"
  ipAddress  String?
  userAgent  String?
  metadata   Json?          // Detailed diff or event parameters
  createdAt  DateTime       @default(now())

  tenant     Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user       User?          @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([tenantId, createdAt])
  @@index([action, severity])
  @@map("audit_logs")
}
`;

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'openid-config',
    category: 'OAuth2/OIDC',
    method: 'GET',
    path: '/.well-known/openid-configuration',
    summary: 'دیسکاوری پیکربندی سرور احراز هویت (OIDC Discovery)',
    description: 'کاتالوگ استانداردی که کلاینت‌ها و سرویس‌ها برای یافتن تمام Endpointها، الگوریتم‌ها و Scopeهای پشتیبانی‌شده استفاده می‌کنند.',
    authRequired: false,
    response200: JSON.stringify({
      issuer: "https://auth.enterprise-iam.com",
      authorization_endpoint: "https://auth.enterprise-iam.com/oauth/authorize",
      token_endpoint: "https://auth.enterprise-iam.com/oauth/token",
      userinfo_endpoint: "https://auth.enterprise-iam.com/userinfo",
      jwks_uri: "https://auth.enterprise-iam.com/.well-known/jwks.json",
      revocation_endpoint: "https://auth.enterprise-iam.com/oauth/revoke",
      introspection_endpoint: "https://auth.enterprise-iam.com/oauth/introspect",
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "client_credentials", "refresh_token"],
      subject_types_supported: ["public", "pairwise"],
      id_token_signing_alg_values_supported: ["RS256", "ES256"],
      scopes_supported: ["openid", "profile", "email", "offline_access", "roles", "permissions"],
      code_challenge_methods_supported: ["S256"]
    }, null, 2)
  },
  {
    id: 'jwks-endpoint',
    category: 'OAuth2/OIDC',
    method: 'GET',
    path: '/.well-known/jwks.json',
    summary: 'دریافت کلیدهای عمومی جهت اعتبارسنجی JWT (JWKS)',
    description: 'تمام میکروسرویس‌ها بدون نیاز به فراخوانی دیتابیس یا سرویس هویت، این کلیدها را دریافت و کَش می‌کنند تا توکن‌های کاربر را در کمتر از ۱ میلی‌ثانیه اعتبارسنجی نمایند.',
    authRequired: false,
    response200: JSON.stringify({
      keys: [
        {
          kty: "RSA",
          use: "sig",
          kid: "iam-key-2026-q3-primary",
          alg: "RS256",
          n: "u1rT97...[RSA Modulus 2048-bit base64url]...",
          e: "AQAB"
        },
        {
          kty: "RSA",
          use: "sig",
          kid: "iam-key-2026-q2-previous",
          alg: "RS256",
          n: "v8bW12...[RSA Modulus for Grace Period validation]...",
          e: "AQAB"
        }
      ]
    }, null, 2)
  },
  {
    id: 'oauth-authorize',
    category: 'OAuth2/OIDC',
    method: 'GET',
    path: '/oauth/authorize',
    summary: 'شروع جریان احراز هویت با کد و PKCE',
    description: 'کلاینت کاربر را به این آدرس هدایت می‌کند. در صورت عدم احراز هویت، فرم لاگین نمایش داده شده و پس از تأیید، یک کد موقت به redirect_uri ارسال می‌شود.',
    authRequired: false,
    headers: {
      "Accept": "text/html"
    },
    requestBody: "GET /oauth/authorize?response_type=code&client_id=crm-webapp-9021&redirect_uri=https://crm.company.com/auth/callback&scope=openid%20profile%20email%20offline_access&state=xyzRandomState99&code_challenge=E9Mel-2Vp6...&code_challenge_method=S256",
    response200: "HTTP/1.1 302 Found\nLocation: https://crm.company.com/auth/callback?code=spl9-code-89af41&state=xyzRandomState99"
  },
  {
    id: 'oauth-token',
    category: 'OAuth2/OIDC',
    method: 'POST',
    path: '/oauth/token',
    summary: 'تبادل کد با Access Token و Refresh Token',
    description: 'پشتیبانی از سه Grant استاندارد: authorization_code (همراه با code_verifier جهت تکمیل PKCE)، refresh_token، و client_credentials برای سرویس‌ها.',
    authRequired: false,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic [Base64(client_id:client_secret)] (اختیاری برای کلاینت‌های عمومی)"
    },
    requestBody: "grant_type=authorization_code\n&code=spl9-code-89af41\n&redirect_uri=https://crm.company.com/auth/callback\n&client_id=crm-webapp-9021\n&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJu1p1r_wW1gFWFOEjXk",
    response200: JSON.stringify({
      access_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImlhbS1rZXktMjAyNi1xMy1wcmltYXJ5In0.eyJzdWIiOiJ1c3ItYWJjLTEyMyIsImVtYWlsIjoiYWxpQGNvbXBhbnkuY29tIiwicm9sZXMiOlsicHJvamVjdF9tYW5hZ2VyIl0sInBlcm1pc3Npb25zIjpbInByb2plY3RzOnJlYWQiLCJwcm9qZWN0czp3cml0ZSJdLCJ0ZW5hbnRfaWQiOiJ0ZW4tMDA3IiwiZXhwIjoxNzU4OTIyMjAwfQ.Signature...",
      token_type: "Bearer",
      expires_in: 900,
      refresh_token: "rft_991823abfd9012cd_secure_rotating_token",
      id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImlhbS1rZXktMjAyNi1xMy1wcmltYXJ5In0.eyJpc3MiOiJodHRwczovL2F1dGguZW50ZXJwcmlzZS1pYW0uY29tIiwic3ViIjoidXNyLWFiYy0xMjMiLCJhdWQiOiJjcm0td2ViYXBwLTkwMjEiLCJlbWFpbCI6ImFsaUBjb21wYW55LmNvbSIsImZpcnN0X25hbWUiOiJBbGkiLCJleHAiOjE3NTg5MjIyMDB9...",
      scope: "openid profile email offline_access"
    }, null, 2),
    responseError: {
      status: 400,
      body: JSON.stringify({
        error: "invalid_grant",
        error_description: "Code verifier does not match the registered code challenge or the authorization code has expired."
      }, null, 2)
    }
  },
  {
    id: 'userinfo-endpoint',
    category: 'User & Profile',
    method: 'GET',
    path: '/userinfo',
    summary: 'دریافت مشخصات کاربر با توکن معتبر (OIDC UserInfo)',
    description: 'کلاینت با ارائه Access Token در هدر Authorization، اطلاعات هویتی مجاز را بر اساس Scopeهای تأییدشده دریافت می‌نماید.',
    authRequired: true,
    headers: {
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI..."
    },
    response200: JSON.stringify({
      sub: "usr-abc-123",
      email: "ali@company.com",
      email_verified: true,
      name: "Ali Kheiri",
      given_name: "Ali",
      family_name: "Kheiri",
      tenant_id: "ten-007",
      tenant_slug: "acme-corp",
      roles: ["project_manager"],
      permissions: ["projects:read", "projects:write", "reports:export"]
    }, null, 2)
  },
  {
    id: 'revoke-token',
    category: 'OAuth2/OIDC',
    method: 'POST',
    path: '/oauth/revoke',
    summary: 'ابطال دستی توکن (RFC 7009 Token Revocation)',
    description: 'امکان ابطال فوری یک Refresh Token یا Access Token خاص به درخواست کلاینت یا کاربر هنگام خروج از سیستم.',
    authRequired: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    requestBody: "token=rft_991823abfd9012cd_secure_rotating_token&token_type_hint=refresh_token",
    response200: "HTTP/1.1 200 OK\n(محتوای خالی منطبق بر استاندارد RFC 7009)"
  },
  {
    id: 'admin-users-list',
    category: 'Admin & Management',
    method: 'GET',
    path: '/api/v1/admin/users',
    summary: 'لیست کاربران مستأجر با فیلتر، صفحه‌بندی و نقش‌ها',
    description: 'دریافت کاربران متعلق به مستأجر با امکان جستجو بر اساس ایمیل، وضعیت حساب و نقش‌ها.',
    authRequired: true,
    requiredScopes: ['iam:users:read'],
    headers: {
      "Authorization": "Bearer eyJhbGciOiJSUzI1Ni..."
    },
    response200: JSON.stringify({
      data: [
        {
          id: "usr-abc-123",
          email: "ali@company.com",
          firstName: "Ali",
          lastName: "Kheiri",
          status: "ACTIVE",
          mfaType: "TOTP",
          roles: ["project_manager"],
          createdAt: "2026-01-15T08:30:00Z",
          lastLoginAt: "2026-09-26T14:12:00Z"
        }
      ],
      meta: {
        page: 1,
        limit: 20,
        totalItems: 142,
        totalPages: 8
      }
    }, null, 2)
  },
  {
    id: 'admin-revoke-all-sessions',
    category: 'Admin & Management',
    method: 'POST',
    path: '/api/v1/admin/users/{userId}/revoke-sessions',
    summary: 'خروج اجباری کاربر از تمام دستگاه‌ها (Global Revoke)',
    description: 'ابطال بلافاصله تمام نشست‌ها و توکن‌های تجدید صادرشده برای یک کاربر خاص توسط ادمین در صورت نشت اطلاعات.',
    authRequired: true,
    requiredScopes: ['iam:users:manage_sessions'],
    response200: JSON.stringify({
      success: true,
      message: "تمام ۴ نشست فعال کاربر باطل شد و کلیدهای مربوطه در ردیس مسدود شدند.",
      revokedSessionsCount: 4
    }, null, 2)
  }
];

export const NESTJS_CODE_SAMPLES = {
  oauthController: `// src/oauth/oauth.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Query, 
  Body, 
  Req, 
  Res, 
  UseGuards, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OAuth2Service } from './oauth2.service';
import { AuthorizeQueryDto } from './dto/authorize-query.dto';
import { TokenRequestDto } from './dto/token-request.dto';
import { RevokeTokenDto } from './dto/revoke-token.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuth2Service) {}

  /**
   * 1. GET /oauth/authorize
   * ورود به فرآیند صدور مجوز با پروتکل کد و اعتبارسنجی PKCE
   */
  @Get('authorize')
  async authorize(
    @Query() query: AuthorizeQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // اعتبارسنجی کلاینت و ریدایرکت مجاز
    const client = await this.oauthService.validateClientAndRedirectUri(
      query.client_id,
      query.redirect_uri,
    );

    // بررسی نشست فعال کاربر در سامانه SSO
    const sessionUser = req.user;
    if (!sessionUser) {
      // هدایت به صفحه لاگین با حفظ پارامترهای اصلی
      const returnUrl = encodeURIComponent(req.originalUrl);
      return res.redirect(\`/auth/login?returnUrl=\${returnUrl}\`);
    }

    // تولید کد احراز هویت موقت ۱۰ دقیقه‌ای به همراه PKCE challenge
    const authCode = await this.oauthService.createAuthorizationCode({
      userId: sessionUser.id,
      clientId: client.id,
      redirectUri: query.redirect_uri,
      scopes: query.scope ? query.scope.split(' ') : ['openid'],
      codeChallenge: query.code_challenge,
      codeChallengeMethod: query.code_challenge_method || 'S256',
      nonce: query.nonce,
    });

    const targetUrl = new URL(query.redirect_uri);
    targetUrl.searchParams.set('code', authCode.code);
    if (query.state) {
      targetUrl.searchParams.set('state', query.state);
    }

    return res.redirect(targetUrl.toString());
  }

  /**
   * 2. POST /oauth/token
   * تبادل کد یا Refresh Token با Access Token نهایی
   */
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // محدودسازی تلاش‌های Brute-Force
  async exchangeToken(@Body() body: TokenRequestDto, @Req() req: Request) {
    const clientAuthHeader = req.headers['authorization'];

    switch (body.grant_type) {
      case 'authorization_code':
        return await this.oauthService.exchangeAuthorizationCode({
          code: body.code,
          clientId: body.client_id,
          redirectUri: body.redirect_uri,
          codeVerifier: body.code_verifier, // اعتبارسنجی ریاضی SHA256 PKCE
          clientAuthHeader,
        });

      case 'refresh_token':
        return await this.oauthService.rotateRefreshToken({
          refreshToken: body.refresh_token,
          clientId: body.client_id,
          clientAuthHeader,
        });

      case 'client_credentials':
        return await this.oauthService.exchangeClientCredentials({
          clientId: body.client_id,
          scope: body.scope,
          clientAuthHeader,
        });

      default:
        throw new Error('grant_type نامعتبر است.');
    }
  }

  /**
   * 3. POST /oauth/revoke
   * ابطال توکن بر اساس RFC 7009
   */
  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  async revokeToken(@Body() body: RevokeTokenDto) {
    await this.oauthService.revokeToken(body.token, body.token_type_hint);
    return; // بر اساس RFC 7009 همیشه وضعیت 200 برمی‌گرداند
  }
}
`,

  jwtGuard: `// src/common/guards/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwksService } from '../../crypto/jwks.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwksService: JwksService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('هدر Authorization با فرمت Bearer یافت نشد.');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. اعتبارسنجی امضای رمزنگاری با کلید عمومی منطبق بر kid
      const payload = await this.jwksService.verifyToken(token);

      // 2. بررسی مسدود بودن توکن (Token Blacklist / Global Revocation) در کَش توزیع‌شده Redis
      const isRevoked = await this.redisService.isTokenRevoked(payload.jti, payload.sub);
      if (isRevoked) {
        throw new UnauthorizedException('این نشست یا توکن باطل شده است.');
      }

      // 3. قرار دادن آبجکت کاربر درون Request
      request['user'] = {
        id: payload.sub,
        email: payload.email,
        tenantId: payload.tenant_id,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است: ' + (err as Error).message);
    }
  }
}
`,

  permissionsGuard: `// src/common/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // اگر مجوزی اعلام نشده باشد عبور مجاز است
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('دسترسی غیرمجاز: کاربر هیچ مجوزی ندارد.');
    }

    // بررسی وجود تمامی مجوزهای لازم (AND Logic) یا مجوزی مانند wildcard (*)
    const hasAll = requiredPermissions.every((perm) => {
      return user.permissions.includes(perm) || user.permissions.includes('*');
    });

    if (!hasAll) {
      throw new ForbiddenException(
        \`دسترسی رد شد: مجوزهای مورد نیاز: [\${requiredPermissions.join(', ')}]\`
      );
    }

    return true;
  }
}
`,

  jwksService: `// src/crypto/jwks.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwksService implements OnModuleInit {
  private readonly logger = new Logger(JwksService.name);
  private activeKeyId: string;
  private activePrivateKey: string;
  private jwksCache: any = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureActiveSigningKey();
  }

  /**
   * چرخش کلید بدون قطعی (Zero-Downtime Key Rotation):
   * کلیدهای قبلی تا زمان منقضی شدن توکن‌های صادرشده (مثلاً ۷ روز) در JWKS باقی می‌مانند
   */
  async ensureActiveSigningKey() {
    let currentKey = await this.prisma.signingKey.findFirst({
      where: { isActive: true, isRevoked: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!currentKey) {
      this.logger.log('هیچ کلید فعالی یافت نشد. در حال ساخت جفت کلید RSA-2048 جدید...');
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      const kid = \`iam-key-\${new Date().getFullYear()}-q\${Math.ceil((new Date().getMonth() + 1) / 3)}-\${crypto.randomBytes(4).toString('hex')}\`;

      currentKey = await this.prisma.signingKey.create({
        data: {
          kid,
          algorithm: 'RS256',
          publicKey,
          privateKey, // در محیط Production باید با Master Key در Vault رمزگذاری شود
          isActive: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // ۹۰ روز اعتبار
        },
      });
    }

    this.activeKeyId = currentKey.kid;
    this.activePrivateKey = currentKey.privateKey;
    await this.refreshJwksCache();
  }

  async getJwks() {
    if (!this.jwksCache) {
      await this.refreshJwksCache();
    }
    return this.jwksCache;
  }

  private async refreshJwksCache() {
    // کلیدهای فعال و کلیدهای آرشیوی که هنوز در فرجه زمانی (Grace Period) هستند
    const validKeys = await this.prisma.signingKey.findMany({
      where: { isRevoked: false, expiresAt: { gt: new Date() } },
    });

    const keys = validKeys.map((k) => {
      const pubKey = crypto.createPublicKey(k.publicKey);
      const exported = pubKey.export({ format: 'jwk' });
      return {
        ...exported,
        kid: k.kid,
        use: 'sig',
        alg: k.algorithm,
      };
    });

    this.jwksCache = { keys };
  }

  signJwt(payload: object, expiresInSeconds = 900): string {
    return jwt.sign(payload, this.activePrivateKey, {
      algorithm: 'RS256',
      keyid: this.activeKeyId,
      expiresIn: expiresInSeconds,
    });
  }

  async verifyToken(token: string): Promise<any> {
    const decodedHeader: any = jwt.decode(token, { complete: true });
    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
      throw new Error('هدر توکن ساختار معتبری ندارد یا فاقد kid است.');
    }

    const keyRecord = await this.prisma.signingKey.findUnique({
      where: { kid: decodedHeader.header.kid },
    });

    if (!keyRecord || keyRecord.isRevoked) {
      throw new Error('کلید عمومی امضاکننده یافت نشد یا لغو شده است.');
    }

    return jwt.verify(token, keyRecord.publicKey, {
      algorithms: ['RS256'],
    });
  }
}
`
};
