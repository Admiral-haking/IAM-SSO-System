import React, { useState } from 'react';
import { API_ENDPOINTS, ApiEndpoint } from '../data/iamDocumentation';
import { LiveApiTester } from './LiveApiTester';
import { 
  FileCheck2, 
  Search, 
  Copy, 
  Check, 
  Lock, 
  Globe, 
  ArrowUpRight, 
  SlidersHorizontal 
} from 'lucide-react';

export const ApiCatalogView: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(API_ENDPOINTS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['All', 'OAuth2/OIDC', 'Admin & Management', 'User & Profile', 'Tenant & Keys'];

  const filteredEndpoints = API_ENDPOINTS.filter((ep) => {
    const matchesCategory = selectedCategory === 'All' || ep.category === selectedCategory;
    const matchesSearch = 
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentEp = API_ENDPOINTS.find(e => e.id === selectedEndpointId) || API_ENDPOINTS[0];

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text);
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
              <FileCheck2 className="w-6 h-6 text-indigo-400" />
              کاتالوگ جامع و استاندارد RESTful Endpoints & OIDC
            </h2>
            <p className="text-xs text-slate-400">
              مشخصات کامل تمام اندپوینت‌های استاندارد RFC 6749، RFC 7009، OIDC Core 1.0 و وب‌سرویس‌های مدیریتی ادمین.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
            REST API v1.0
          </span>
        </div>

        {/* Live Interactive API Tester */}
        <div className="pt-6">
          <LiveApiTester />
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در اندپوینت‌ها (مثلاً /oauth/token یا authorize)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? 'همه اندپوینت‌ها' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Catalog Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          {/* Endpoint List Sidebar */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold text-slate-400 block mb-1">
              اندپوینت‌های منطبق ({filteredEndpoints.length}):
            </span>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredEndpoints.map((ep) => {
                const isSelected = ep.id === currentEp.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpointId(ep.id)}
                    className={`w-full p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        ep.method === 'GET' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        ep.method === 'POST' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        ep.method === 'DELETE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="text-xs font-mono text-slate-300 font-semibold truncate" dir="ltr">
                        {ep.path}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate text-right">
                      {ep.summary}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Endpoint Detail Inspector */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    currentEp.method === 'GET' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    currentEp.method === 'POST' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                    'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {currentEp.method}
                  </span>
                  <span className="text-sm font-mono font-bold text-white" dir="ltr">
                    {currentEp.path}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-indigo-400">{currentEp.summary}</h3>
              </div>

              <div className="flex items-center gap-2">
                {currentEp.authRequired ? (
                  <span className="text-[10px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" /> نیازمند احراز هویت
                  </span>
                ) : (
                  <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <Globe className="w-3 h-3" /> عمومی (Public)
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentEp.description}
            </p>

            {/* Headers & Scopes */}
            {currentEp.requiredScopes && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">مجوزها و Scopeهای الزامی:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentEp.requiredScopes.map((sc, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded">
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body / Payload */}
            {currentEp.requestBody && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">بدنه درخواست نمونه (Request Body):</span>
                <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
                  {currentEp.requestBody}
                </pre>
              </div>
            )}

            {/* Response 200 OK */}
            {currentEp.response200 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 block">پاسخ موفق (HTTP 200 OK):</span>
                  <button
                    onClick={() => copyContent(currentEp.response200!)}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'کپی شد' : 'کپی پاسخ'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                  {currentEp.response200}
                </pre>
              </div>
            )}

            {/* Error Response */}
            {currentEp.responseError && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-rose-400 block">پاسخ خطا نمونه (HTTP {currentEp.responseError.status}):</span>
                <pre className="p-3 bg-rose-950/20 rounded-lg text-xs font-mono text-rose-300 overflow-x-auto leading-relaxed border border-rose-900/30">
                  {currentEp.responseError.body}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
