# Centralized IAM & SSO System (Identity & Access Management)

سیستم جامع، متمرکز و سازمانی مدیریت هویت، نشست‌ها و کنترل دسترسی بر پایه پروتکل‌های استاندارد **OAuth 2.1** و **OpenID Connect (OIDC Core 1.0)** پیاده‌سازی شده با **NestJS**، **PostgreSQL** و **Redis**.

---

## 🌟 مشخصات کلیدی و ارزش پروژه
- **یکپارچه‌سازی کامل احراز هویت (Single Sign-On):** پایان پراکندگی دیتابیس کاربران بین سامانه‌های مختلف (CRM, WebApp, Mobile, Background Services).
- **امنیت مدرن منطبق بر آخرین استانداردها:**
  - الزام **PKCE (Proof Key for Code Exchange)** بر اساس استاندارد OAuth 2.1
  - هش کلمات عبور با الگوریتم حافظه‌محور **Argon2id** (مقاوم در برابر حملات کرک سخت‌افزاری GPU/ASIC)
  - مکانیزم چرخش خودکار کلیدهای امضا بدون قطعی (**Zero-Downtime RS256 Key Rotation**) و انتشار خودکار اندپوینت **JWKS**
  - استراتژی **Refresh Token Rotation** به همراه تشخیص هوشمند بازاستفاده (**Token Reuse Detection**) جهت ابطال بلادرنگ زنجیره توکن‌های به سرقت رفته
- **طراحی مقیاس‌پذیر و چندمستأجری (Multi-Tenancy):** ایزولاسیون کامل داده‌های سازمان‌ها، دامنه‌های اختصاصی و پشتیبانی از پایگاه داده‌های رابطه‌ای با **Prisma ORM**.
- **مانیتورینگ و ثبت حسابرسی:** لاگ‌های تغییرناپذیر (Immutable Audit Log) جهت انطباق با الزامات استانداردهای **SOC2** و **ISO 27001**.
- **سهمیه‌بندی دقیق ترافیک:** مهار حملات انکار سرویس (DDoS) و Brute-Force با الگوریتم **Sliding Window Rate Limiter** در حافظه **Redis**.

---

## 🏗️ ساختار پوشه‌بندی پروژه (Folder Structure)

```text
central-iam-service/
├── src/
│   ├── main.ts                       # نقطه ورود و راه‌اندازی سرور، پایپ‌ها، فیلترها و Swagger
│   ├── app.module.ts                 # ماژول اصلی و تزریق وابستگی‌های مرکزی
│   ├── oauth/                        # سرور OAuth 2.1 و OIDC
│   │   ├── oauth.controller.ts       # مدیریت اندپوینت‌های /oauth/authorize, /oauth/token, /oauth/revoke
│   │   ├── oauth2.service.ts         # تبادل کد PKCE، چرخش Refresh Token و امضای توکن‌ها
│   │   └── dto/                      # کلاس‌های اعتبارسنجی ورودی DTO
│   ├── auth/                         # احراز هویت مستقیم کاربران
│   │   ├── auth.controller.ts        # ورود، ثبت‌نام، بازیابی رمز و MFA
│   │   └── auth.service.ts           # هشینگ با Argon2id و محافظت در برابر Brute-force
│   ├── crypto/                       # مدیریت کلیدهای نامتقارن RSA/ECDSA
│   │   ├── jwks.service.ts           # تولید کلید، شناسه kid، کَشینگ و چرخش بدون قطعی
│   │   └── jwks.controller.ts        # اندپوینت عمومی /.well-known/jwks.json
│   ├── tenants/                      # مدیریت مستأجرین و ایزولاسیون داده‌ها
│   ├── rbac/                         # نقش‌ها، مجوزها و دسترسی‌های گرانولار
│   ├── sessions/                     # ردگیری نشست‌های فعال در ردیس و ابطال همگانی
│   ├── audit/                        # ثبت وقایع امنیتی با فیلتر پاک‌سازی داده‌های حساس
│   └── common/                       # گاردها (JwtAuthGuard, PermissionsGuard)، فیلترها و دکوراتورها
├── prisma/
│   ├── schema.prisma                 # تعاریف دیتابیس رابطه‌ای و ایندکس‌های بهینه
│   └── migrations/                   # تاریخچه مایگریشن‌های پایگاه داده
├── docker-compose.yml                # زیرساخت کامل کانتینری (PostgreSQL 16, Redis 7, App)
├── Dockerfile                        # ایمیج بهینه Multi-Stage Production
├── .env.example                      # نمونه متغیرهای محیطی بدون افشای سکرت‌ها
└── package.json
```

---

## 🚀 راه‌اندازی سریع در محیط توسعه (Local Setup)

### پیش‌نیازها
- **Node.js** نسخه 20 یا بالاتر
- **Docker** و **Docker Compose**
- **Git**

### ۱. کلون کردن ریپازیتوری
```bash
git clone https://github.com/<YOUR_USERNAME>/centralized-iam-sso.git
cd centralized-iam-sso
```

### ۲. نصب پکیج‌ها
```bash
npm install
```

### ۳. تنظیم متغیرهای محیطی
یک کپی از فایل نمونه ایجاد نمایید:
```bash
cp .env.example .env
```

### ۴. بالا آوردن دیتابیس و کَش با داکر
```bash
docker compose up -d postgres redis
```

### ۵. اعمال مایگریشن‌های Prisma
```bash
npx prisma migrate dev --name init
```

### ۶. اجرای سرور
```bash
npm run dev
```
سرویس روی آدرس `http://localhost:3000` در دسترس خواهد بود.

---

## 📡 اندپوینت‌های استاندارد OAuth 2.1 / OIDC

| مسیر (Path) | متد | شرح عملکرد | دسترسی |
| :--- | :--- | :--- | :--- |
| `/.well-known/openid-configuration` | GET | کشف خودکار پیکربندی سرور OIDC | عمومی |
| `/.well-known/jwks.json` | GET | کاتالوگ کلیدهای عمومی امضا (RS256) | عمومی (قابل کَش) |
| `/oauth/authorize` | GET | شروع جریان احراز هویت با چالش PKCE | عمومی |
| `/oauth/token` | POST | تبادل کد با توکن، تمدید نشست و M2M | بر اساس Grant |
| `/oauth/revoke` | POST | ابطال آنی توکن بر اساس RFC 7009 | کلاینت مجاز |
| `/userinfo` | GET | دریافت مشخصات کاربر احراز هویت‌شده | با Bearer Token |

---

## 🧪 تست‌ها و اعتبارسنجی کیفیت

```bash
# اجرای تست‌های واحد (Unit Tests)
npm run test

# اجرای تست‌های سرتاسری (E2E Tests)
npm run test:e2e

# تست مهار بار با k6 (۵۰۰۰ ریکوئست در ثانیه)
k6 run tests/load/token-benchmark.js
```

---

## 🛡️ استانداردهای امنیتی اعمال‌شده
- **Zero-Trust Token Validation:** بدون اتکا به کلید متقارن روی کلاینت؛ اعتبارسنجی با کلید عمومی از طریق اندپوینت JWKS.
- **Single-use Auth Codes & Rotating Refresh Tokens:** ابطال بلافاصله کدها پس از اولین مصرف.
- **IP & User-Agent Fingerprinting:** شناسایی رفتارهای نامتعارف و دسترسی‌های غیرمجاز همزمان.
- **Append-Only Audit Logs:** جلوگیری از دستکاری تاریخچه رویدادهای ورود و خروج توسط ادمین‌های سیستم.

---

## 📄 لایسنس
این پروژه تحت پروانه [MIT License](LICENSE) منتشر شده است.
