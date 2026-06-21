import {
  db,
  ref,
  set,
  get,
  update,
  push,
  onValue
} from "./firebase.js";

let currentUser = "";
let token = 247;
let served = 183;
let queueActive = false;
let alertCount = 0;
let alertHistory = [];
let checkedDocs = new Set();
let alertTimer = null;
let monitorTimer = null;
let statsTimer = null;

/* ---------- REALTIME QUEUE ---------- */

onValue(ref(db, "queue"), (snapshot) => {
  const data = snapshot.val();

  if (!data) return;

  token = data.token || 247;
  served = data.served || 183;

  const tokenEl = document.getElementById("statTokens");
  const servedEl = document.getElementById("statServed");

  if (tokenEl) tokenEl.innerText = token;
  if (servedEl) servedEl.innerText = served;
});

/* ---------- LOADER ---------- */

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 800);
});

/* ---------- LOGIN ---------- */

async function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (!u || !p) {
    showToast("Enter credentials");
    return;
  }

  currentUser = u;

  await set(ref(db, "users/" + u), {
    username: u,
    lastLogin: new Date().toISOString()
  });

  const queueSnap = await get(ref(db, "queue"));

  if (!queueSnap.exists()) {
    await set(ref(db, "queue"), {
      token: 247,
      served: 183
    });
  }

  document.body.classList.add("logged-in");
  document.getElementById("loginScreen").classList.remove("active");
  document.getElementById("dashboard").classList.add("active");
  document.getElementById("userDisplay").innerText = u;

  showToast("Login successful");

  setDate();
  startAlerts();
  startMonitor();
  startStatsTicker();
  setActiveNav("navHome");

  onValue(ref(db, "alerts"), (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      alertHistory = [];
      renderAlertHistory();
      return;
    }

    alertHistory = [];

    Object.values(data)
      .reverse()
      .forEach((item) => {
        alertHistory.push(
          item.message +
            " — " +
            new Date(item.time).toLocaleTimeString()
        );
      });

    renderAlertHistory();
  });
}

/* ---------- LOGOUT ---------- */

function logout() {
  document.body.classList.remove("logged-in");

  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));

  document
    .getElementById("loginScreen")
    .classList.add("active");

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  clearInterval(alertTimer);
  clearInterval(monitorTimer);
  clearInterval(statsTimer);

  showToast("Logged out");
}

/* ---------- DATE ---------- */

function setDate() {
  const now = new Date();

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  };

  document.getElementById(
    "dateBadge"
  ).innerText = now.toLocaleDateString(
    "en-US",
    options
  );
}

/* ---------- THEME ---------- */

function toggleTheme() {
  const html = document.documentElement;
  const isDark =
    html.getAttribute("data-theme") === "dark";

  if (isDark) {
    html.removeAttribute("data-theme");

    document.getElementById("themeIcon").src =
      "assets/images/moon.png";

    document.getElementById("navThemeIcon").src =
      "assets/images/moon.png";

    showToast("Light mode enabled");
  } else {
    html.setAttribute("data-theme", "dark");

    document.getElementById("themeIcon").src =
      "assets/images/sun.png";

    document.getElementById("navThemeIcon").src =
      "assets/images/sun.png";

    showToast("Dark mode enabled");
  }
}

/* ---------- TOAST ---------- */

function showToast(msg) {
  const t = document.getElementById("toast");

  const div = document.createElement("div");
  div.className = "toast";
  div.innerText = msg;

  t.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

/* ---------- ALERTS ---------- */

function startAlerts() {
  clearInterval(alertTimer);

  const msgs = [
    "You are 5 minutes away from your token",
    "Get ready with documents",
    "Your turn is approaching",
    "Stay near counter",
    "Please wait patiently",
    "This department is busy right now",
    "Counter 2 has been reassigned to your queue"
  ];

  fireAlert(
    msgs[Math.floor(Math.random() * msgs.length)]
  );

  alertTimer = setInterval(() => {
    fireAlert(
      msgs[Math.floor(Math.random() * msgs.length)]
    );
  }, 4000);
}

function fireAlert(msg) {
  document.getElementById("alertBar").innerText =
    msg;

  alertCount++;

  document.getElementById(
    "alertBadge"
  ).innerText = alertCount;

  push(ref(db, "alerts"), {
    user: currentUser,
    message: msg,
    time: new Date().toISOString()
  });
}

function renderAlertHistory() {
  const list =
    document.getElementById("alertHistoryList");

  const hint =
    document.getElementById("alertEmptyHint");

  list.innerHTML = "";

  if (alertHistory.length === 0) {
    hint.style.display = "block";
    return;
  }

  hint.style.display = "none";

  alertHistory
    .slice(0, 15)
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerText = item;
      list.appendChild(li);
    });
}

function openAlerts() {
  alertCount = 0;

  document.getElementById(
    "alertBadge"
  ).innerText = "0";

  renderAlertHistory();

  switchTab("alerts");
  setActiveNav("navAlerts");
}

/* ---------- MONITOR ---------- */

function startMonitor() {
  clearInterval(monitorTimer);

  updateMonitor();

  monitorTimer = setInterval(
    updateMonitor,
    1000
  );
}

function updateMonitor() {
  document.getElementById("monitor").innerHTML =
    "Active<br>User: " +
    currentUser +
    "<br>Next Token: A-" +
    (token + 1) +
    "<br>Time: " +
    new Date().toLocaleTimeString();
}

/* ---------- STATS ---------- */

function startStatsTicker() {
  clearInterval(statsTimer);

  statsTimer = setInterval(() => {
    if (Math.random() > 0.5) {
      token += Math.floor(Math.random() * 2);
      served += Math.floor(Math.random() * 2);

      update(ref(db, "queue"), {
        token,
        served
      });
    }
  }, 5000);
}

/* ---------- QUEUE ---------- */

function takeToken() {
  if (queueActive) return;

  queueActive = true;
  token++;

  update(ref(db, "queue"), {
    token
  });

  const box =
    document.getElementById("queueBox");

  const bar =
    document.getElementById(
      "queueProgressBar"
    );

  const fill =
    document.getElementById(
      "queueProgressFill"
    );

  bar.style.display = "block";
  fill.style.width = "10%";

  box.innerHTML =
    "Token: A-" + token + "<br>Waiting";

  showToast("Token created");

  setTimeout(() => {
    fill.style.width = "55%";
    box.innerHTML +=
      "<br>Almost your turn";
  }, 3000);

  setTimeout(() => {
    fill.style.width = "100%";
    box.innerHTML +=
      "<br>YOUR TURN NOW!";

    queueActive = false;
    served++;

    update(ref(db, "queue"), {
      served
    });

    showToast("It's your turn!");
  }, 7000);
}

/* ---------- NAVIGATION ---------- */

function openDocs() {
  switchTab("docs");
  setActiveNav("navDocs");
}

function openQueue() {
  switchTab("queue");
  setActiveNav("navQueue");
}

function goHome() {
  switchTab("dashboard");
  setActiveNav("navHome");
}

function switchTab(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) =>
      s.classList.remove("active")
    );

  document
    .getElementById(id)
    .classList.add("active");
}

function setActiveNav(id) {
  document
    .querySelectorAll(".navBtn")
    .forEach((b) =>
      b.classList.remove("activeNav")
    );

  const btn =
    document.getElementById(id);

  if (btn) {
    btn.classList.add("activeNav");
  }
}

function back() {
  switchTab("dashboard");
  setActiveNav("navHome");
}

/* ---------- DOCUMENTS ---------- */

const DOC_DATA = {
  passport: [
    "Citizenship",
    "Birth Certificate",
    "Photo",
    "Form"
  ],
  citizenship: [
    "Birth Certificate",
    "Parent ID"
  ],
  land: [
    "Ownership Paper",
    "Tax Receipt"
  ],
  transport: [
    "License",
    "Medical Report"
  ]
};

function loadDocs(type) {
  const list =
    document.getElementById("docList");

  const progressWrap =
    document.getElementById(
      "docProgressWrap"
    );

  const hint =
    document.getElementById(
      "docEmptyHint"
    );

  list.innerHTML = "";
  checkedDocs.clear();

  if (!type || !DOC_DATA[type]) {
    progressWrap.style.display = "none";
    hint.style.display = "block";
    return;
  }

  hint.style.display = "none";
  progressWrap.style.display = "block";

  DOC_DATA[type].forEach((d, i) => {
    const li =
      document.createElement("li");

    li.innerHTML =
      "<span>" +
      d +
      "</span><span class='checkMark'>☐</span>";

    li.onclick = () =>
      toggleDoc(
        li,
        i,
        DOC_DATA[type].length
      );

    list.appendChild(li);
  });

  updateDocProgress(
    0,
    DOC_DATA[type].length
  );
}

function toggleDoc(li, index, total) {
  li.classList.toggle("checked");

  if (li.classList.contains("checked")) {
    checkedDocs.add(index);
    li.querySelector(
      "span:last-child"
    ).innerText = "✓";
  } else {
    checkedDocs.delete(index);
    li.querySelector(
      "span:last-child"
    ).innerText = "☐";
  }

  updateDocProgress(
    checkedDocs.size,
    total
  );

  set(
    ref(
      db,
      "documents/" + currentUser
    ),
    {
      service:
        document.getElementById(
          "serviceTypeSelect"
        ).value,
      completed: [...checkedDocs]
    }
  );
}

function updateDocProgress(done, total) {
  const fill =
    document.getElementById(
      "docProgressFill"
    );

  const text =
    document.getElementById(
      "docProgressText"
    );

  const pct = total
    ? (done / total) * 100
    : 0;

  fill.style.width = pct + "%";

  text.innerText =
    done +
    " / " +
    total +
    " collected";
}

/* ---------- MAKE FUNCTIONS AVAILABLE TO HTML ---------- */

window.login = login;
window.logout = logout;
window.openDocs = openDocs;
window.openQueue = openQueue;
window.goHome = goHome;
window.back = back;
window.openAlerts = openAlerts;
window.toggleTheme = toggleTheme;
window.takeToken = takeToken;
window.loadDocs = loadDocs;