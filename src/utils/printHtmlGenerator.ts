import { PlannerState, DayInfo } from '../types/planner';
import { calculateHabitProgress, calculateDailyProgress, calculateWeeklyProgress, calculateOverallHabitProgress } from './calculations';

export function generatePrintableHtml(state: PlannerState, daysInfo: DayInfo[]): string {
  const weeklyTask = calculateWeeklyProgress(state.days);
  const weeklyHabit = calculateOverallHabitProgress(state.habits);

  const startDay = daysInfo[0];
  const endDay = daysInfo[6];
  const weekTitle = `${startDay.formattedDate} – ${endDay.formattedDate} ${startDay.fullFormatted.split(' ').pop()}`;

  const daysHtml = daysInfo
    .map((info, idx) => {
      const dayPlan = state.days[idx] || state.days.find((d) => d.date === info.dateStr);
      const tasks = dayPlan?.tasks || [];
      const pct = calculateDailyProgress(dayPlan);

      const tasksList =
        tasks.length === 0
          ? '<div class="empty-task">No tasks planned</div>'
          : tasks
              .map(
                (t) => `
          <div class="task-item ${t.completed ? 'completed' : ''}">
            <span class="box">${t.completed ? '&#9745;' : '&#9633;'}</span>
            <span class="title">${t.priority === 'high' ? '&#9733; ' : ''}${t.title}</span>
          </div>`
              )
              .join('');

      return `
        <div class="day-card">
          <div class="day-header">
            <div>
              <span class="day-name">${info.dayName}</span>
              <span class="day-date">${info.formattedDate}</span>
            </div>
            <span class="day-pct">${pct}%</span>
          </div>
          ${dayPlan?.note ? `<div class="day-note">${dayPlan.note}</div>` : ''}
          <div class="task-list">
            ${tasksList}
          </div>
        </div>
      `;
    })
    .join('');

  const habitsRows = state.habits
    .map((h) => {
      const pct = calculateHabitProgress(h.completed);
      const checks = h.completed
        .map((c) => `<td class="center">${c ? '&#10003;' : '&middot;'}</td>`)
        .join('');
      return `
        <tr>
          <td class="habit-name">${h.name}</td>
          ${checks}
          <td class="right font-mono">${pct}%</td>
        </tr>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Weekly Life Planner - ${weekTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111111;
      background: #FFFFFF;
      margin: 0;
      padding: 20px;
      font-size: 11px;
      line-height: 1.4;
    }
    .header {
      border-bottom: 2px solid #111111;
      padding-bottom: 8px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; }
    .subtitle { font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 1px; }
    .week-label { font-size: 13px; font-weight: 700; text-align: right; }
    
    .meta-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
    }
    .meta-box {
      border: 1px solid #DDDDDD;
      padding: 8px 10px;
      border-radius: 4px;
    }
    .meta-title { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #666666; letter-spacing: 0.5px; }
    .meta-val { font-size: 12px; font-weight: 700; margin-top: 2px; }
    .meta-sub { font-size: 10px; color: #555555; }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .day-card {
      border: 1px solid #CCCCCC;
      border-radius: 4px;
      padding: 8px 10px;
      page-break-inside: avoid;
    }
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #EEEEEE;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .day-name { font-weight: 800; font-size: 12px; }
    .day-date { color: #666666; font-size: 10px; margin-left: 6px; }
    .day-pct { font-family: monospace; font-weight: 700; font-size: 11px; }
    .day-note { font-style: italic; font-size: 9.5px; color: #666666; margin-bottom: 6px; padding: 2px 4px; background: #F8F8F8; border-radius: 2px; }

    .task-list { min-height: 50px; }
    .task-item { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 4px; font-size: 10.5px; }
    .task-item.completed .title { text-decoration: line-through; color: #888888; }
    .box { font-size: 12px; line-height: 1; font-family: monospace; }
    .empty-task { color: #AAAAAA; font-style: italic; font-size: 9.5px; padding: 10px 0; text-align: center; }

    .habits-section {
      border: 1px solid #CCCCCC;
      border-radius: 4px;
      padding: 8px 10px;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    .section-title { font-weight: 800; font-size: 11px; text-transform: uppercase; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { border-bottom: 1px solid #DDDDDD; padding: 4px; font-weight: 700; text-transform: uppercase; font-size: 9px; }
    td { padding: 4px; border-bottom: 1px solid #F0F0F0; }
    .center { text-align: center; }
    .right { text-align: right; }
    .habit-name { font-weight: 600; width: 40%; }

    .review-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      border: 1px solid #CCCCCC;
      border-radius: 4px;
      padding: 8px 10px;
      page-break-inside: avoid;
    }
    .review-item { margin-bottom: 4px; }
    .review-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #555555; }
    .review-val { font-size: 10px; margin-top: 2px; color: #222222; }

    .footer {
      margin-top: 14px;
      border-top: 1px solid #DDDDDD;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #888888;
    }

    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Weekly Life Planner</div>
      <div class="subtitle">Plan &middot; Track &middot; Reflect &middot; Improve</div>
    </div>
    <div>
      <div class="week-label">${weekTitle}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-box">
      <div class="meta-title">Weekly Focus</div>
      <div class="meta-val">${state.focus || 'No focus set'}</div>
      ${state.objective ? `<div class="meta-sub">${state.objective}</div>` : ''}
    </div>
    <div class="meta-box">
      <div class="meta-title">Weekly Reward</div>
      <div class="meta-val">${state.reward || 'No reward set'}</div>
      <div class="meta-sub">Earned on completion</div>
    </div>
    <div class="meta-box">
      <div class="meta-title">Overall Progress</div>
      <div class="meta-val">${weeklyTask.percentage}% Tasks &middot; ${weeklyHabit.percentage}% Habits</div>
      <div class="meta-sub">${weeklyTask.completed}/${weeklyTask.total} tasks complete</div>
    </div>
  </div>

  <div class="days-grid">
    ${daysHtml}
  </div>

  <div class="habits-section">
    <div class="section-title">Habit Consistency Matrix</div>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Habit</th>
          <th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th>
          <th style="text-align:right;">Consistency</th>
        </tr>
      </thead>
      <tbody>
        ${habitsRows}
      </tbody>
    </table>
  </div>

  ${
    state.review && (state.review.wentWell || state.review.challenges || state.review.achievement)
      ? `
  <div class="review-grid">
    <div class="review-item">
      <div class="review-label">What Went Well</div>
      <div class="review-val">${state.review.wentWell || '—'}</div>
    </div>
    <div class="review-item">
      <div class="review-label">What Was Difficult</div>
      <div class="review-val">${state.review.challenges || '—'}</div>
    </div>
    <div class="review-item">
      <div class="review-label">Biggest Achievement</div>
      <div class="review-val">${state.review.achievement || '—'}</div>
    </div>
    <div class="review-item">
      <div class="review-label">Priority Next Week</div>
      <div class="review-val">${state.review.nextWeekPriority || '—'}</div>
    </div>
  </div>
  `
      : ''
  }

  <div class="footer">
    <span>Weekly Life Planner &middot; Swiss Editorial Monochrome Productivity</span>
    <span>Generated: ${new Date().toLocaleDateString()}</span>
  </div>

  <script>
    window.addEventListener('load', function() {
      // Auto-trigger print when opened as standalone file
      setTimeout(function() { window.print(); }, 250);
    });
  </script>
</body>
</html>`;
}
