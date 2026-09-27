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
    md += `**Reward:** ${state.reward || 'N/A'}\n\n`;

    md += `## Daily Plan\n\n`;
    daysInfo.forEach((info, idx) => {
      const plan = state.days[idx] || state.days.find((d) => d.date === info.dateStr);
      md += `### ${info.dayName} (${info.formattedDate})\n`;
      if (plan?.note) md += `*Note: ${plan.note}*\n`;
      if (!plan || plan.tasks.length === 0) {
        md += `- (No tasks)\n`;
      } else {
        plan.tasks.forEach((t) => {
          md += `- [${t.completed ? 'x' : ' '}] ${t.priority === 'high' ? '★ ' : ''}${t.title}\n`;
        });
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
      <div className="bg-white border border-[#E5E7EB] rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#111111] text-white rounded-md">
              <Printer className="w-4 h-4" />
            </span>
            <div>
              <h3 id="print-dialog-title" className="text-sm font-bold text-[#111111]">
                Print & PDF Export
              </h3>
              <p className="text-[11px] text-[#71717A]">
                Save as clean PDF document or print physical A4 planner sheet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#111111] text-white hover:bg-[#27272A] rounded-md transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#E5E7EB] hover:bg-white text-[#111111] rounded-md transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#52525B]" />
              <span className="hidden sm:inline">Print Window</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-[#71717A] hover:text-[#111111] hover:bg-[#E5E7EB] rounded-md transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Helpful Tip / Iframe explanation banner */}
        <div className="bg-[#FEFCE8] border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="font-semibold">💡 Best PDF Way:</span>
            <span>
              Click <strong>"Download PDF/Print File"</strong> and open it. It automatically launches your browser's Print-to-PDF dialog in 1 click!
            </span>
          </div>
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111111] hover:underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>
        </div>

        {iframeBlockedNotice && (
          <div className="bg-[#FEE2E2] px-5 py-2 text-xs text-[#DC2626] border-b border-[#FCA5A5]">
            Embedded iframe blocked direct print dialog. Please click <strong>Download PDF/Print File</strong> above to print cleanly.
          </div>
        )}

        {/* Live Preview Container (Embedded pristine styled view) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#E5E7EB]/40 flex justify-center">
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
                <span className="text-xs font-bold text-[#111111] block mt-0.5">
                  {state.focus || 'No focus set'}
                </span>
                {state.objective && (
                  <span className="text-[10px] text-[#52525B] block mt-0.5 line-clamp-1">
                    {state.objective}
                  </span>
                )}
              </div>

              <div className="border border-[#E5E7EB] p-2.5 rounded bg-[#FAFAFA]">
                <span className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider block">
                  Weekly Reward
                </span>
                <span className="text-xs font-bold text-[#111111] block mt-0.5">
                  {state.reward || 'No reward set'}
                </span>
                <span className="text-[10px] text-[#71717A] block mt-0.5">
                  Earned upon completion
                </span>
              </div>

              <div className="border border-[#E5E7EB] p-2.5 rounded bg-[#FAFAFA]">
                <span className="text-[9px] font-bold text-[#71717A] uppercase tracking-wider block">
                  Status
                </span>
                <span className="text-xs font-bold text-[#111111] block mt-0.5">
                  {daysInfo.filter((d) => d.isToday).length > 0 ? 'Active Week' : 'Planned Week'}
                </span>
                <span className="text-[10px] text-[#71717A] block mt-0.5 font-mono">
                  {state.days.reduce((acc, d) => acc + d.tasks.filter((t) => t.completed).length, 0)} tasks finished
                </span>
              </div>
            </div>

            {/* 7 Days Grid Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {daysInfo.map((info, idx) => {
                const dayPlan = state.days[idx] || state.days.find((d) => d.date === info.dateStr);
                const tasks = dayPlan?.tasks || [];

                return (
                  <div key={info.dayIndex} className="border border-[#E5E7EB] p-2.5 rounded bg-white">
                    <div className="flex items-center justify-between border-b border-[#F4F4F5] pb-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#111111]">{info.dayName}</span>
                        <span className="text-[10px] text-[#71717A]">{info.formattedDate}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#71717A]">
                        {tasks.filter((t) => t.completed).length}/{tasks.length}
                      </span>
                    </div>

                    {dayPlan?.note && (
                      <p className="text-[10px] italic text-[#71717A] mb-1.5 bg-[#F8F9FA] px-1.5 py-0.5 rounded">
                        {dayPlan.note}
                      </p>
                    )}

                    <div className="space-y-1">
                      {tasks.length === 0 ? (
                        <span className="text-[10px] text-[#A1A1AA] italic block py-1">No tasks</span>
                      ) : (
                        tasks.map((t) => (
                          <div key={t.id} className="flex items-start gap-1.5 text-[11px]">
                            <span className="font-mono text-xs">{t.completed ? '☑' : '☐'}</span>
                            <span className={t.completed ? 'line-through text-[#888888]' : 'text-[#111111]'}>
                              {t.priority === 'high' ? '★ ' : ''}
                              {t.title}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Habits Matrix Preview */}
            <div className="border border-[#E5E7EB] p-2.5 rounded mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] block mb-2">
                Habit Matrix
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] text-[#71717A]">
                      <th className="text-left py-1">Habit</th>
                      {daysInfo.map((d) => (
                        <th key={d.dayIndex} className="text-center w-6 py-1">
                          {d.singleLetter}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F4F5]">
                    {state.habits.map((h) => (
                      <tr key={h.id}>
                        <td className="py-1 font-semibold text-[#111111]">{h.name}</td>
                        {h.completed.map((c, i) => (
                          <td key={i} className="text-center font-mono py-1">
                            {c ? '✓' : '·'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reflection Preview */}
            {state.review && (state.review.wentWell || state.review.challenges || state.review.achievement) && (
              <div className="border border-[#E5E7EB] p-2.5 rounded text-[10px] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#111111] block mb-1">
                  Weekly Reflection
                </span>
                {state.review.wentWell && (
                  <p>
                    <strong>Wins:</strong> {state.review.wentWell}
                  </p>
                )}
                {state.review.challenges && (
                  <p>
                    <strong>Challenges:</strong> {state.review.challenges}
                  </p>
                )}
                {state.review.nextWeekPriority && (
                  <p>
                    <strong>Next Priority:</strong> {state.review.nextWeekPriority}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-[#71717A]">
            Generates standardized vector A4/Letter sheet. Ready for paper or digital PDF.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#111111] text-white hover:bg-[#27272A] rounded-md transition-colors cursor-pointer"
            >
              Download PDF/HTML
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-[#52525B] hover:text-[#111111] hover:bg-[#E5E7EB] rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
