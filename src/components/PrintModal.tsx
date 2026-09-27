import React, { useState, useEffect } from 'react';
import { X, Printer, Download, Copy, Check, FileText, ExternalLink } from 'lucide-react';
import { PlannerState, DayInfo } from '../types/planner';
import { generatePrintableHtml } from '../utils/printHtmlGenerator';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  daysInfo: DayInfo[];
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  state,
  daysInfo,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [iframeBlockedNotice, setIframeBlockedNotice] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const htmlContent = generatePrintableHtml(state, daysInfo);

  const handleDirectPrint = () => {
    try {
      window.print();
    } catch {
      setIframeBlockedNotice(true);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-planner-${state.weekStart}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyMarkdown = () => {
    let md = `# Weekly Life Planner: Week Starting ${daysInfo[0]?.formattedDate}\n\n`;
    md += `**Main Focus:** ${state.focus || 'N/A'}\n`;
    if (state.objective) md += `**Objective:** ${state.objective}\n`;
    if (state.reward) md += `**Reward:** ${state.reward}\n\n`;

    md += `## Daily Plan\n\n`;
    daysInfo.forEach((info) => {
      const plan = state.days[info.dayIndex] || state.days.find((d) => d.date === info.dateStr);
      md += `### ${info.dayName} (${info.formattedDate})\n`;
      if (plan?.note) md += `*Note: ${plan.note}*\n`;
      if (plan?.tasks && plan.tasks.length > 0) {
        plan.tasks.forEach((t) => {
          md += `- [${t.completed ? 'x' : ' '}] ${t.title}${t.priority === 'high' ? ' (HIGH)' : ''}\n`;
        });
      } else {
        md += `*No tasks recorded*\n`;
      }
      md += `\n`;
    });

    md += `## Habit Tracker\n\n`;
    state.habits.forEach((h) => {
      const checks = h.completed.map((c) => (c ? '✓' : '·')).join(' ');
      md += `- ${h.name}: ${checks}\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] dark:border-[#27272A] bg-[#F8F9FA] dark:bg-[#121214]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-md">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <h3 id="print-dialog-title" className="text-sm font-bold text-[#111111] dark:text-white">
                Print & PDF Export
              </h3>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                Save as clean PDF document or print physical A4 planner sheet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#27272A] dark:hover:bg-zinc-200 rounded-md transition-colors cursor-pointer"
              title="Download standalone printable file that opens native PDF print"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF/Print File</span>
                </>
              )}
            </button>

            {/* Direct Print Button */}
            <button
              onClick={handleDirectPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#E5E7EB] dark:border-[#27272A] hover:bg-white dark:hover:bg-[#27272A] text-[#111111] dark:text-white rounded-md transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#52525B] dark:text-zinc-200" />
              <span className="hidden sm:inline">Print Window</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded-md transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Helpful Tip / Iframe explanation banner */}
        <div className="bg-[#FEFCE8] dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/40 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold">💡 Best PDF Way:</span>
            <span>
              Click <strong>"Download PDF/Print File"</strong> and open it. It automatically launches your browser's Print-to-PDF dialog in 1 click!
            </span>
          </div>
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111111] dark:text-amber-200 hover:underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>
        </div>

        {iframeBlockedNotice && (
          <div className="bg-[#FEE2E2] dark:bg-red-950/40 px-5 py-2 text-xs text-[#DC2626] dark:text-red-300 border-b border-[#FCA5A5] dark:border-red-800/40">
            Embedded iframe blocked direct print dialog. Please click <strong>Download PDF/Print File</strong> above to print cleanly.
          </div>
        )}

        {/* Live Preview Container (Pristine styled print sheet) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#E5E7EB]/40 dark:bg-black/50 flex justify-center">
          <div className="bg-white border border-[#D4D4D8] rounded-sm shadow-md w-full max-w-[800px] p-6 sm:p-8 text-[#111111]">
            {/* Header */}
            <div className="border-b-2 border-[#111111] pb-3 mb-4 flex justify-between items-baseline">
              <div>
                <h1 className="text-xl font-extrabold uppercase tracking-tight text-[#111111]">
                  Weekly Life Planner
                </h1>
                <p className="text-[10px] text-[#71717A] uppercase tracking-wider font-semibold">
                  Plan · Track · Reflect · Improve
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#111111] tabular-nums">
                  {daysInfo[0]?.formattedDate} – {daysInfo[6]?.formattedDate} {daysInfo[0]?.fullFormatted.split(' ').pop()}
                </span>
              </div>
            </div>

            {/* Meta Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
              <div className="border border-[#E5E7EB] p-2.5 rounded bg-[#FAFAFA]">
                <span className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider block">
                  Weekly Focus
                </span>
                <span className="text-xs font-bold text-[#111111]">
                  {state.focus || '—'}
                </span>
              </div>
              <div className="border border-[#E5E7EB] p-2.5 rounded bg-[#FAFAFA]">
                <span className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider block">
                  Weekly Objective
                </span>
                <span className="text-xs text-[#111111]">
                  {state.objective || '—'}
                </span>
              </div>
              <div className="border border-[#E5E7EB] p-2.5 rounded bg-[#FAFAFA]">
                <span className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider block">
                  Reward on 80%+
                </span>
                <span className="text-xs font-semibold text-[#111111]">
                  {state.reward || '—'}
                </span>
              </div>
            </div>

            {/* 7 Days Preview Table */}
            <div className="border border-[#E5E7EB] rounded overflow-hidden mb-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F4F5] border-b border-[#E5E7EB] text-[#52525B]">
                    <th className="py-2 px-3 font-bold w-28">Day</th>
                    <th className="py-2 px-3 font-bold">Tasks & Priorities</th>
                    <th className="py-2 px-3 font-bold w-40">Focus Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {daysInfo.map((info) => {
                    const plan = state.days[info.dayIndex] || state.days.find((d) => d.date === info.dateStr);
                    const tasks = plan?.tasks || [];

                    return (
                      <tr key={info.dayIndex} className="hover:bg-[#FAFAFA]">
                        <td className="py-2.5 px-3 font-bold align-top">
                          <div>{info.dayName}</div>
                          <div className="text-[10px] font-normal text-[#71717A]">
                            {info.formattedDate}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          {tasks.length === 0 ? (
                            <span className="text-[#A1A1AA] italic text-[11px]">No tasks</span>
                          ) : (
                            <ul className="space-y-1">
                              {tasks.map((t) => (
                                <li key={t.id} className="flex items-center gap-1.5 text-[11px]">
                                  <span className="font-mono text-xs">
                                    {t.completed ? '☑' : '☐'}
                                  </span>
                                  <span className={t.completed ? 'line-through text-[#71717A]' : 'text-[#111111]'}>
                                    {t.title}
                                  </span>
                                  {t.priority === 'high' && (
                                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded">
                                      HIGH
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td className="py-2.5 px-3 align-top text-[11px] text-[#71717A] italic">
                          {plan?.note || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Habit Tracker Preview */}
            <div className="border border-[#E5E7EB] rounded overflow-hidden mb-4">
              <div className="bg-[#F4F4F5] px-3 py-1.5 border-b border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-[#52525B]">
                Habit Consistency
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[11px] text-[#71717A]">
                    <th className="py-1.5 px-3 font-semibold">Habit</th>
                    {daysInfo.map((d) => (
                      <th key={d.dayIndex} className="py-1.5 px-1 text-center font-bold">
                        {d.singleLetter}
                      </th>
                    ))}
                    <th className="py-1.5 px-2 text-center font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {state.habits.map((h) => {
                    const done = h.completed.filter(Boolean).length;
                    const pct = Math.round((done / 7) * 100);

                    return (
                      <tr key={h.id}>
                        <td className="py-1.5 px-3 font-medium text-[11px]">{h.name}</td>
                        {h.completed.map((isChecked, i) => (
                          <td key={i} className="py-1.5 px-1 text-center font-mono text-xs">
                            {isChecked ? '✓' : '·'}
                          </td>
                        ))}
                        <td className="py-1.5 px-2 text-center font-mono font-bold text-[11px]">
                          {pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Review Section */}
            <div className="border border-[#E5E7EB] rounded p-3 bg-[#FAFAFA]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2 pb-1 border-b border-[#E5E7EB]">
                Weekly Review
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <strong className="block text-[#111111]">Wins:</strong>
                  <span className="text-[#52525B]">{state.review?.wentWell || '—'}</span>
                </div>
                <div>
                  <strong className="block text-[#111111]">Challenges:</strong>
                  <span className="text-[#52525B]">{state.review?.challenges || '—'}</span>
                </div>
                <div>
                  <strong className="block text-[#111111]">Key Lesson:</strong>
                  <span className="text-[#52525B]">{state.review?.lesson || '—'}</span>
                </div>
                <div>
                  <strong className="block text-[#111111]">Next Week Priority:</strong>
                  <span className="text-[#52525B] font-semibold">{state.review?.nextWeekPriority || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
