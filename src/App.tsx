/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ArchitectureView } from './components/ArchitectureView';
import { OAuthSimulator } from './components/OAuthSimulator';
import { JwtJwksLab } from './components/JwtJwksLab';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { ApiCatalogView } from './components/ApiCatalogView';
import { CodeInspectorView } from './components/CodeInspectorView';
import { SecurityAuditView } from './components/SecurityAuditView';
import { RoadmapInterviewView } from './components/RoadmapInterviewView';
import { Shield, Sparkles, Server, Terminal, Github, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('architecture');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'architecture':
        return <ArchitectureView />;
      case 'oauth-simulator':
        return <OAuthSimulator />;
      case 'jwt-jwks-lab':
        return <JwtJwksLab />;
      case 'database-erd':
        return <DatabaseSchemaView />;
      case 'api-catalog':
        return <ApiCatalogView />;
      case 'code-inspector':
        return <CodeInspectorView />;
      case 'security-audit':
        return <SecurityAuditView />;
      case 'roadmap-interview':
        return <RoadmapInterviewView />;
      default:
        return <ArchitectureView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">
              سیستم مدیریت متمرکز هویت، دسترسی و نشست‌ها (Centralized IAM / SSO)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>NestJS 10+</span>
            <span>•</span>
            <span>PostgreSQL 16 + Prisma</span>
            <span>•</span>
            <span>Redis 7 Cluster</span>
            <span>•</span>
            <span>RFC 7636 (PKCE)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
