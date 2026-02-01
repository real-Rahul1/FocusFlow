/* ================== LOAD RAW DATA ================== */

const DAILY_KEY = "studyTimeData";
const SUBJECT_KEY = "subjectTimeData";

const dailyData =
  JSON.parse(localStorage.getItem(DAILY_KEY) || "{}");

const subjectSeconds =
  JSON.parse(localStorage.getItem(SUBJECT_KEY) || "{}");

/* ================== HELPERS ================== */

function minutes(sec) {
  return Math.round(sec / 60);
}

function getLast7Days() {
  const days = [];
  const mins = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const key =
      d.getFullYear() + "-" +
      (d.getMonth() + 1) + "-" +
      d.getDate();

    days.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    mins.push(dailyData[key] || 0);
  }

  return { days, mins };
}

/* ================== WEEKLY ================== */

const weekly = getLast7Days();

/* ================== SUBJECTS ================== */

const subjects = {};
for (const sub in subjectSeconds) {
  subjects[sub] = minutes(subjectSeconds[sub]);
}

/* ================== MONTHLY ================== */

const now = new Date();
const daysInMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  0
).getDate();

const monthly = [];
for (let d = 1; d <= daysInMonth; d++) {
  const key =
    now.getFullYear() + "-" +
    (now.getMonth() + 1) + "-" + d;

  monthly.push(dailyData[key] || 0);
}

/* ================== YEARLY ================== */

const yearly = Array(12).fill(0);

for (const key in dailyData) {
  const [y, m] = key.split("-").map(Number);
  if (y === now.getFullYear()) {
    yearly[m - 1] += dailyData[key];
  }
}

/* ================== FINAL EXPORTED DATA ================== */

// ===== SUMMARY STATS =====
// Dashboard stores daily totals as minutes in `studyTimeData`.
const totalMinutes = Object.values(dailyData).reduce((a, b) => a + b, 0);
const totalHours = +(totalMinutes / 60).toFixed(1); // hours with one decimal
const totalSessions = Object.values(dailyData).filter(v => v > 0).length; // approximate sessions as non-zero days
const avgSession = totalSessions ? Math.round(totalMinutes / totalSessions) : 0; // minutes per session

// best streak (longest consecutive-day run)
const dates = Object.keys(dailyData)
  .filter(k => dailyData[k] > 0)
  .map(k => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  })
  .sort((a, b) => a - b);

let bestStreak = 0, current = 0, prev = null;
for (const ts of dates) {
  if (prev === null || ts - prev === 24 * 3600 * 1000) {
    current++;
  } else {
    current = 1;
  }
  if (current > bestStreak) bestStreak = current;
  prev = ts;
}

const summary = {
  totalHours,
  totalSessions,
  avgSession,
  bestStreak
};

window.studyData = {
  weekly: {
    days: weekly.days,
    minutesPerDay: weekly.mins
  },
  subjects,
  monthly,
  yearly,
  summary
};