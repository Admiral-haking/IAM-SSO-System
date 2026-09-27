import React from 'react';
import { 
  Shield, 
  Layers, 
  Terminal, 
  Key, 
  Database, 
  Code2, 
  FileCheck2, 
  Lock, 
  Compass,
  CheckCircle2
} from 'lucide-react';

export type ActiveTab = 
  | 'architecture' 
  | 'oauth-simulator' 
  | 'jwt-jwks-lab' 
  | 'database-erd' 
  | 'api-catalog' 
  | 'code-inspector' 
  | 'security-audit' 
  | 'roadmap-interview';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'architecture', labelFa: 'معماری و توپولوژی', icon: Layers },
    { id: 'oauth-simulator', labelFa: 'شبیه‌ساز زنده OAuth2/PKCE', icon: Terminal },
    { id: 'jwt-jwks-lab', labelFa: 'آزمایشگاه JWT و JWKS', icon: Key },
    { id: 'database-erd', labelFa: 'دیتابیس و Prisma ERD', icon: Database },
    { id: 'api-catalog', labelFa: 'کاتالوگ API و OIDC', icon: FileCheck2 },
    { id: 'code-inspector', labelFa: 'کدهای پروداکشن NestJS', icon: Code2 },
    { id: 'security-audit', labelFa: 'امنیت عمیق و OWASP', icon: Lock },
    { id: 'roadmap-interview', labelFa: 'نقشه راه و مصاحبه مهاجرت', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">Centralized IAM & SSO</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Production Spec
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">سرویس زیرساختی مدیریت هویت، نشست‌ها و دسترسی متمرکز</p>
            </div>
          </div>

          {/* Quick Info Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono">
              RFC 6749 / 7636 / 7519
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 font-mono">
              OIDC Core 1.0
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 space-x-reverse overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.labelFa}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
