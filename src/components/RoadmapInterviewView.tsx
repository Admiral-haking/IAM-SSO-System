import React, { useState } from 'react';
import { ROADMAP_PHASES, INTERVIEW_QUESTIONS } from '../data/roadmapAndSecurity';
import { 
  Compass, 
  Briefcase, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  GraduationCap,
  Globe2
} from 'lucide-react';

export const RoadmapInterviewView: React.FC = () => {
  const [expandedQA, setExpandedQA] = useState<string | null>(INTERVIEW_QUESTIONS[0].id);

  const toggleQA = (id: string) => {
    setExpandedQA(expandedQA === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Career & Migration Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-900/40 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Globe2 className="w-3.5 h-3.5" /> راهنمای طلایی رزومه و مهاجرت کاری (Global Career Blueprint)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            چرا پیاده‌سازی سیستم متمرکز IAM شما را در مصاحبه‌های اروپایی و آمریکایی متمایز می‌کند؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            اکثر برنامه‌نویسان فقط با کتابخانه‌های آماده (مثل NextAuth یا پکیج‌های پیش‌ساخته) کار کرده‌اند و دید عمیقی به RFCهای OAuth2، توزیع کلیدهای JWKS، مدیریت امن نشست‌ها در ردیس و ایزولاسیون چندمستأجری ندارند. وقتی شما توضیح می‌دهید که چگونه یک <strong>Identity Provider سازمانی منطبق بر RFC 7636 و RFC 7519</strong> پیاده کرده‌اید، مستقیماً در رده مهندسان <strong>Senior و Lead Backend / Security</strong> ارزیابی می‌شوید.
          </p>
        </div>
      </div>

      {/* 16-Week Implementation Roadmap */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            نقشه راه ۱۶ هفته‌ای پیاده‌سازی سیستم (Implementation Milestones)
          </h3>
          <p className="text-xs text-slate-400">
            برنامه زمان‌بندی دقیق از MVP تا نسخه آماده تولید با قابلیت Multi-Tenancy و چرخش خودکار کلید.
          </p>
        </div>

        <div className="space-y-6">
          {ROADMAP_PHASES.map((p, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.phase}: {p.titleFa}</h4>
                    <span className="text-[11px] text-indigo-400 font-medium">{p.duration}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <strong>هدف اصلی فاز:</strong> {p.focus}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.deliverables.map((d, dIdx) => (
                  <div key={dIdx} className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <h5 className="text-xs font-bold text-slate-200">{d.title}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pr-6">{d.description}</p>
                    <div className="flex flex-wrap gap-1 pr-6 pt-1">
                      {d.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Senior Backend & Security Interview Masterclass */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            بانک سوالات فنی و تخصصی مصاحبه‌های مهندسی IAM (Senior / Staff Level)
          </h3>
          <p className="text-xs text-slate-400">
            پاسخ‌های عمیق و اصولی به سوالات چالشی که معماران شرکت‌های بین‌المللی درباره این پروژه‌ها می‌پرسند.
          </p>
        </div>

        <div className="space-y-3">
          {INTERVIEW_QUESTIONS.map((qa) => {
            const isExpanded = expandedQA === qa.id;
            return (
              <div
                key={qa.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleQA(qa.id)}
                  className="w-full p-4 text-right flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/50"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{qa.question}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {qa.topic}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          سطح: {qa.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-900 space-y-4 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                      <strong className="text-emerald-400 block mb-1">خلاصه سریع و آماده بیان در مصاحبه (TL;DR):</strong>
                      {qa.answerSummary}
                    </div>

                    <div className="text-slate-300 leading-relaxed space-y-2 whitespace-pre-line bg-slate-950 p-3 rounded border border-slate-900">
                      <strong className="text-indigo-400 block">پاسخ فنی تفصیلی و عمیق:</strong>
                      {qa.deepDive}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-400">کلیدواژه‌های طلایی برای ذکر در مصاحبه:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {qa.keyConcepts.map((kc, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">
                            {kc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
