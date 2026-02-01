document.addEventListener("DOMContentLoaded", () => {

  // Populate summary cards
  if (studyData.summary) {
    document.getElementById("totalHours").textContent = studyData.summary.totalHours;
    document.getElementById("totalSessions").textContent = studyData.summary.totalSessions;
    document.getElementById("avgSession").textContent = studyData.summary.avgSession;
    document.getElementById("bestStreak").textContent = studyData.summary.bestStreak;
  }

  /* ===== WEEKLY LINE ===== */
  new Chart(document.getElementById("weeklyData"), {
    type: "line",
    data: {
      labels: studyData.weekly.days,
      datasets: [{
        label: "Minutes Studied",
        data: studyData.weekly.minutesPerDay,
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true
    }
  });

  /* ===== WEEKLY SUBJECT PIE ===== */
  const subjectLabels = Object.keys(studyData.subjects);
const subjectValues = Object.values(studyData.subjects);

if (subjectLabels.length === 0) {
  const ctx = document.getElementById("weeklySubjectData");
  ctx.parentElement.classList.add("center");
  ctx.replaceWith(Object.assign(document.createElement("div"), {
    className: "empty-text",
    innerText: "No subject data yet"
  }));
} else {
  new Chart(document.getElementById("weeklySubjectData"), {
    type: "doughnut",
    data: {
      labels: subjectLabels,
      datasets: [{
        data: subjectValues
      }]
    },
    options: {
      responsive: true
    }
  });
}


  /* ===== MONTHLY BAR ===== */
  new Chart(document.getElementById("monthlyData"), {
    type: "bar",
    data: {
      labels: studyData.monthly.map((_, i) => i + 1),
      datasets: [{
        label: "Minutes",
        data: studyData.monthly
      }]
    }
  });

  /* ===== YEARLY BAR ===== */
  new Chart(document.getElementById("yearlyData"), {
    type: "bar",
    data: {
      labels: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],
      datasets: [{
        label: "Minutes",
        data: studyData.yearly
      }]
    }
  });

});