export interface RoadmapPhase {
  phase: string;
  duration: string;
  titleFa: string;
  focus: string;
  deliverables: {
    title: string;
    description: string;
    tags: string[];
  }[];
}

export interface InterviewQA {
  id: string;
  question: string;
  topic: 'OAuth2/OIDC' | 'Cryptography & Keys' | 'Scaling & Cache' | 'Security & OWASP' | 'Architecture';
  difficulty: 'Senior' | 'Staff / Principal';
  answerSummary: string;
  deepDive: string;
  keyConcepts: string[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 'فاز اول (MVP هسته)',
    duration: 'هفته ۱ تا ۷ (حدود ۲ ماه)',
    titleFa: 'راه‌اندازی موتور هویتی پایه، استاندارد OAuth2.1 و دیتابیس',
    focus: 'ایجاد پایه استوار برای ذخیره کاربران، هش رمز عبور با Argon2id، پیاده‌سازی کامل Authorization Code Flow با PKCE، صدور Access/Refresh توکن و مدل RBAC پایه.',
    deliverables: [
      {
        title: 'طراحی زیرساخت و مهاجرت دیتابیس (Prisma + PostgreSQL)',
        description: 'ایجاد اسکیماهای هسته (Tenants, Users, Roles, Permissions, Clients, Sessions, Tokens) با ایندکس‌های بهینه.',
        tags: ['PostgreSQL', 'Prisma', 'Migrations']
      },
      {
        title: 'پیاده‌سازی احراز هویت با Argon2id و محافظت در برابر Brute-force',
        description: 'ماژول ورود و ثبت‌نام با ایمیل، هش فوق‌امن، قفل ۵ دقیقه‌ای حساب پس از ۵ تلاش ناموفق متوالی.',
        tags: ['Argon2id', 'Security', 'Anti-BruteForce']
      },
      {
        title: 'سرور OAuth2.1 با Authorization Code Flow و اجبار PKCE',
        description: 'اندپوینت‌های استاندارد `/oauth/authorize` و `/oauth/token` با پشتیبانی از S256 Code Challenge.',
        tags: ['OAuth2.1', 'PKCE (RFC 7636)', 'OIDC Core']
      },
      {
        title: 'مدیریت کلید RS256 و ارائه اندپوینت JWKS',
        description: 'تولید جفت کلید RSA-2048، امضای توکن‌ها با شناسه `kid` و انتشار `/.well-known/jwks.json`.',
        tags: ['RS256', 'JWKS', 'Cryptography']
      },
      {
        title: 'Refresh Token Rotation و مدیریت نشست‌ها در Redis',
        description: 'تولید توکن‌های تجدید یکبارمصرف با شناسه FamilyId و ابطال کل زنجیره در صورت تشخیص سرقت یا بازاستفاده.',
        tags: ['Redis', 'Token Rotation', 'Session Tracking']
      }
    ]
  },
  {
    phase: 'فاز دوم (ویژگی‌های پیشرفته)',
    duration: 'هفته ۸ تا ۱۲ (حدود ۱ ماه)',
    titleFa: 'ورود دو مرحله‌ای (MFA)، لاگ حسابرسی، سهمیه‌بندی و API مدیریت',
    focus: 'ارتقای امنیت به سطوح سازمانی با ورود دو مرحله‌ای، Audit Log جامع، Rate Limiting پیشرفته و داشبورد مدیریتی ادمین.',
    deliverables: [
      {
        title: 'ورود دومرحله‌ای (TOTP با Google Authenticator و کدهای پشتیبان)',
        description: 'تولید QR Code بر اساس RFC 6238، اعتبارسنجی رمزهای یکبارمصرف با انحراف زمانی ±30 ثانیه و تولید ۸ کد بازیابی یکبارمصرف هش‌شده.',
        tags: ['MFA', 'TOTP', 'RFC 6238']
      },
      {
        title: 'سیستم ثبت لاگ حسابرسی (Immutable Security Audit Log)',
        description: 'ثبت تمام اقدامات حساس با جزئیات IP، UserAgent، تغییرات داده‌ای (Diff) و درجه حساسیت رویداد.',
        tags: ['Audit Log', 'Compliance', 'Winston/ELK']
      },
      {
        title: 'سیستم سهمیه‌بندی توزیع‌شده (Sliding Window Rate Limiter)',
        description: 'مهار حملات انکار سرویس (DoS) و Brute-Force روی اندپوینت‌های حساس با استفاده از الگوریتم Sliding Window در Redis.',
        tags: ['Redis', 'Rate Limiting', 'DDoS Protection']
      },
      {
        title: 'سیستم وب‌هوک رویدادهای هویتی (Event Webhooks با BullMQ)',
        description: 'ارسال غیرهمگام رویدادها (مانند حذف کاربر، تغییر نقش، ورود مشکوک) به سایر میکروسرویس‌ها همراه با امضای دیجیتال HMAC-SHA256.',
        tags: ['Webhooks', 'BullMQ', 'Event-Driven']
      }
    ]
  },
  {
    phase: 'فاز سوم (سازمانی و Federation)',
    duration: 'هفته ۱۳ تا ۱۶ (حدود ۱ ماه)',
    titleFa: 'SSO سازمانی، چرخش خودکار کلید، اتصال به Google/GitHub و داکر/CI-CD',
    focus: 'آماده‌سازی برای محیط‌های تولیدی در مقیاس بزرگ، چندمستأجری کامل، چرخش کلید بدون قطعی و مانیتورینگ بلادرنگ.',
    deliverables: [
      {
        title: 'ورود یکپارچه سازمانی (Social & Enterprise SSO: Google, GitHub, SAML 2.0)',
        description: 'امکان اتصال حساب‌های کاربری به سرویس‌های هویت خارجی و نگاشت خودکار نقش‌ها بر اساس کلیم‌های دریافتی.',
        tags: ['Social SSO', 'SAML 2.0', 'Federation']
      },
      {
        title: 'سیستم چرخش خودکار کلید بدون قطعی (Zero-Downtime Key Rotation)',
        description: 'جاب دوره‌ای خودکار جهت ساخت کلید جدید و حفظ کلید قبلی در JWKS تا پایان Grace Period جهت جلوگیری از خطای ۴۰۱.',
        tags: ['Zero-Downtime', 'Vault/KMS', 'Crypto Rotation']
      },
      {
        title: 'کانتینری‌سازی و پیکربندی استقرار ابری (Docker, Docker-Compose, CI/CD)',
        description: 'پیکربندی Multi-Stage Dockerfile بهینه، Docker-Compose برای Redis, Postgres, Mailhog و پایپ‌لاین تست خودکار GitHub Actions.',
        tags: ['Docker', 'CI/CD', 'DevOps']
      },
      {
        title: 'مانیتورینگ و مشاهده‌پذیری سازمانی (Prometheus Metrics & Health Checks)',
        description: 'اندازه‌گیری نرخ صدور توکن، زمان پاسخ دیتابیس، وضعیت اتصال ردیس و تست‌های بار با ابزار k6 تا ۵۰۰۰ درخواست بر ثانیه.',
        tags: ['Prometheus', 'Grafana', 'k6 Load Testing']
      }
    ]
  }
];

export const INTERVIEW_QUESTIONS: InterviewQA[] = [
  {
    id: 'pkce-deep-dive',
    question: 'چرا در OAuth 2.1 پروتکل PKCE برای تمام کلاینت‌ها (به‌ویژه SPA و موبایل) اجباری شده است؟',
    topic: 'OAuth2/OIDC',
    difficulty: 'Senior',
    answerSummary: 'برای جلوگیری از حمله سرقت کد احراز هویت (Authorization Code Interception Attack). کلاینت‌های عمومی نمی‌توانند client_secret را محرمانه نگه دارند؛ با PKCE یک راز پویا (code_verifier) به ازای هر لاگین تولید و با هش SHA-256 (code_challenge) تأیید می‌شود.',
    deepDive: `در برنامه‌های تک‌صفحه‌ای (SPA) و اپ‌های موبایل، سورس کد در دسترس کاربر است و ذخیره کردن client_secret در آن‌ها بی‌فایده است. در گذشته در صورت رهگیری کد احراز هویت (مثلاً از طریق Custom URI Scheme در اندروید/iOS)، مهاجم می‌توانست کد را مستقیماً به /oauth/token ارسال کرده و توکن دریافت کند.
با PKCE:
۱. کلاینت یک رشته تصادفی ۴۳ تا ۱۲۸ کاراکتری رمزنگاری‌شده به نام code_verifier می‌سازد.
۲. هش SHA-256 آن را به صورت base64url کدگذاری کرده و به عنوان code_challenge به همراه پارامتر code_challenge_method=S256 به سرور IAM می‌فرستد.
۳. سرور کد احراز هویت را در دیتابیس ذخیره کرده و به همان challenge متصل می‌کند.
۴. در مرحله تبادل توکن، کلاینت اصل code_verifier را ارسال می‌کند. سرور خودش آن را هش کرده و با challenge ذخیره‌شده تطبیق می‌دهد. مهاجمی که فقط کد را شنود کرده باشد، اصل verifier را ندارد و درخواستش با خطای invalid_grant مواجه می‌شود.`,
    keyConcepts: ['RFC 7636', 'Code Challenge S256', 'Public Clients', 'Code Interception Attack']
  },
  {
    id: 'token-revocation-scale',
    question: 'چگونه ابطال فوری توکن‌های JWT (که ذاتا Stateless هستند) را در مقیاس میلیون‌ها درخواست بر ثانیه بدون افت کارایی دیتابیس پیاده‌سازی کنیم؟',
    topic: 'Scaling & Cache',
    difficulty: 'Staff / Principal',
    answerSummary: 'استفاده از معماری دولایه: ۱. نگهداری طول عمر Access Token در حداقل ممکن (۱۰ تا ۱۵ دقیقه). ۲. استفاده از Redis با ساختار داده Set یا Bloom Filter برای ذخیره شناسه‌های یکتای باطل‌شده (jti) یا حداقل زمان مجاز توکن کاربر (min_iat_timestamp) با انقضای خودکار برابر با انقضای توکن.',
    deepDive: `چالش اصلی توکن‌های JWT این است که تا زمان رسیدن به تاریخ انقضا (exp) معتبر تلقی می‌شوند. اگر کاربر لاگ‌آوت کند یا دسترسی‌اش لغو شود، دو استراتژی مدرن وجود دارد:
۱. رویکرد jti Blacklist در Redis: به ازای هر توکن باطل‌شده، کلید \`revoked:jti:{jti}\` با TTL برابر با زمان باقی‌مانده تا انقضا در Redis ذخیره می‌شود. میکروسرویس‌ها قبل از تأیید توکن، وجود این کلید را بررسی می‌کنند. از آنجا که Redis در حافظه است، پاسخ در ۰.۱ میلی‌ثانیه برمی‌گردد و با اتمام exp، کلید خودبه‌خود از ردیس حذف می‌شود.
۲. رویکرد کاربرمحور (User-level Invalidation): هنگام تغییر نقش، تغییر رمز یا دکمه «خروج از تمام دستگاه‌ها»، یک کلید \`user:revoked_before:{userId}\` با مقدار زمان جاری (timestamp) در Redis ثبت می‌شود. هر توکنی که تاریخ صدور آن (iat) قبل از این تاریخ باشد، بی‌درنگ رد می‌شود. این تکنیک بدون نیاز به ذخیره تک‌تک توکن‌ها، صدها توکن فعال کاربر را یکجا باطل می‌کند!`,
    keyConcepts: ['jti Blacklisting', 'min_iat Invalidation', 'Redis TTL Auto-expiry', 'Stateless vs Stateful Hybrid']
  },
  {
    id: 'refresh-token-reuse-detection',
    question: 'مکانیسم Refresh Token Rotation با قابلیت تشخیص بازاستفاده (Reuse Detection) چگونه کار می‌کند و در چه سناریویی تمام توکن‌ها باید بسوزند؟',
    topic: 'Security & OWASP',
    difficulty: 'Senior',
    answerSummary: 'هر بار که Refresh Token برای دریافت Access Token جدید استفاده می‌شود، باطل شده و یک توکن جدید صادر می‌گردد. تمام توکن‌های زنجیره به یک شناسه خانواده (familyId) تعلق دارند. اگر یک توکنِ قبلاً مصرف‌شده مجدداً ارسال شود، سیستم متوجه سرقت توکن شده و تمام توکن‌های آن خانواده را بلافاصله ابطال می‌کند.',
    deepDive: `سناریوی حمله:
۱. کاربر قانونی توکن Refresh ۱ را دارد. مهاجم توکن ۱ را به سرقت می‌برد.
۲. کاربر قانونی با توکن ۱ درخواست تمدید می‌دهد؛ سیستم توکن ۱ را باطل کرده و توکن ۲ را تحویل کاربر قانونی می‌دهد.
۳. حالا مهاجم سعی می‌کند از توکن ۱ سرقت‌شده استفاده کند.
۴. سیستم می‌بیند که توکن ۱ وضعیت \`used: true\` یا \`isRevoked: true\` دارد.
۵. پاسخ امنیتی فوری: سیستم متوجه می‌شود که دزدی رخ داده است. فوراً تمام توکن‌های هم‌خانواده با \`familyId\` مربوطه و تمام نشست‌های متصل را ابطال کرده، به کاربر ایمیل هشدار امنیتی می‌فرستد و او را ملزم به ورود مجدد و تغییر رمز عبور می‌کند.`,
    keyConcepts: ['Token Families', 'One-time Refresh Token', 'Compromise Mitigation', 'RFC 6749 Best Practices']
  },
  {
    id: 'zero-downtime-key-rotation',
    question: 'چگونه چرخش کلیدهای رمزنگاری JWT را بدون اینکه هیچ کاربری با خطای ۴۰۱ مواجه شود یا سرویسی دچار اختلال گردد پیاده‌سازی کنیم؟',
    topic: 'Cryptography & Keys',
    difficulty: 'Senior',
    answerSummary: 'استفاده از الگوی چندکلیدی با شناسه kid در هدر توکن و انتشار تمام کلیدهای جاری و در فرجه زمانی در اندپوینت JWKS. میکروسرویس‌ها با کَش هوشمند JWKS بر اساس kid کلید جدید را دریافت و بدون نیاز به ریستارت کار می‌کنند.',
    deepDive: `فرآیند چرخش بدون قطعی در ۴ مرحله اجرا می‌شود:
۱. تولید کلید آینده: سیستم در دیتابیس کلید جدید (مثلاً kid: iam-2026-q4) را می‌سازد و به لیست کلیدهای JWKS اضافه می‌کند، اما فعلاً توکن‌های جدید همچنان با کلید قبلی (iam-2026-q3) امضا می‌شوند.
۲. تغییر کلید فعال امضاکننده: متغیر فعال سیستم به کلید جدید سوئیچ می‌کند. از این لحظه تمام توکن‌های جدید با کلید q4 امضا می‌شوند.
۳. دوره فرجه (Grace Period): کلید قبلی (q3) تا حداکثر طول عمر Refresh Token یا Access Token منقضی‌نشده (مثلاً ۷ تا ۳۰ روز) همچنان در خروجی JWKS باقی می‌ماند تا سرویس‌های دیگر بتوانند توکن‌های صادرشده قبلی را اعتبارسنجی کنند.
۴. بازنشستگی نهایی: پس از اطمینان از منقضی شدن تمامی توکن‌های تحت کلید q3، کلید قدیمی آرشیو شده و از خروجی JWKS حذف می‌گردد.`,
    keyConcepts: ['JWKS (RFC 7517)', 'Key ID (kid)', 'Grace Period', 'Stale-While-Revalidate Caching']
  }
];

export const ROLES_AND_PERMISSIONS_MATRIX = [
  {
    roleName: 'SuperAdmin (مالک کل پلتفرم IAM)',
    scope: 'سراسری (Cross-Tenant)',
    description: 'دسترسی کامل به ساخت مستأجرین، پیکربندی سرورهای امضا، مدیریت دامنه‌های سفارشی و لاگ‌های سطح زیرساخت.',
    permissions: ['tenants:*', 'system:keys:rotate', 'system:metrics:view', 'system:audit:read_all']
  },
  {
    roleName: 'TenantAdmin (ادمین ارشد سازمان / مستأجر)',
    scope: 'محدود به Tenant جاری',
    description: 'مدیریت کاربران، نقش‌ها، کلاینت‌های OAuth2، تنظیمات سیاست رمز عبور و مشاهده گزارش‌های ورود و لاگ‌های همان سازمان.',
    permissions: ['iam:users:*', 'iam:roles:*', 'iam:clients:*', 'iam:audit:read', 'iam:sessions:revoke_all']
  },
  {
    roleName: 'SecurityAuditor (بازرس امنیت و انطباق)',
    scope: 'محدود به Tenant جاری (Read-Only)',
    description: 'دسترسی فقط‌خواندنی به لاگ‌های حسابرسی، نشست‌های فعال، گزارش‌های تلاش‌های ناموفق و وضعیت پیکربندی‌های امنیتی.',
    permissions: ['iam:audit:read', 'iam:users:read', 'iam:sessions:read', 'iam:metrics:read']
  },
  {
    roleName: 'EndUser (کاربر عادی سازمان)',
    scope: 'فقط داده‌های شخصی خود',
    description: 'امکان ورود، مدیریت نشست‌های فعال دستگاه‌های خود، فعال‌سازی ورود دو مرحله‌ای و بازیابی رمز عبور.',
    permissions: ['profile:read', 'profile:update', 'mfa:manage', 'sessions:self_revoke']
  },
  {
    roleName: 'ServiceAccount / M2M Client (سرویس‌های پس‌زمینه)',
    scope: 'ماشین به ماشین بر اساس Scopeهای مجاز',
    description: 'برای احراز هویت میکروسرویس‌ها بدون حضور کاربر انسانی (Client Credentials Grant).',
    permissions: ['services:billing:read', 'services:notifications:send']
  }
];
