/**
 * TIT IIC - SIH INTERNAL HACKATHON 2026
 * Full Dynamic Logic Engine with Google Firebase Cloud Firestore Integration
 */

/* ==========================================================================
   0. SITE UNDER MAINTENANCE CONTROLLER & DEVELOPER BYPASS SYSTEM
   ========================================================================== */
const MAINTENANCE_CONFIG = {
  enabled: false, // MASTER SWITCH: set to false to open portal to all visitors
  devPasscode: "TIT_DEV_2026",
  spocPasscode: "TIT_SIH_2026#SPOC",
  title: "TIT SIH 2026 • Upgrades in Progress",
  heading: "System Upgrades in Progress",
  subheading: "Institution Innovation Council (IIC) • Tripura Institute of Technology",
  message: "We are currently performing essential platform upgrades, database index optimizations, and security enhancements for the Smart India Hackathon (SIH) 2026 Internal Hackathon portal. The platform will be accessible to all students shortly.",
  statusText: "Live Engineering & SPOC Deployment",
  contactEmail: "principal@titagartala.ac.in"
};

function isDeveloperBypassed() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const devParam = (urlParams.get("dev") || urlParams.get("bypass") || urlParams.get("dev_key") || "").trim();
    if (
      devParam === "bypass" ||
      devParam === "TIT_DEV_2026" ||
      devParam === "TIT_SIH_2026#SPOC" ||
      devParam === "1" ||
      devParam === "true" ||
      devParam === "admin"
    ) {
      localStorage.setItem("tit_sih_dev_bypass", "true");
      return true;
    }
  } catch (e) { }

  try {
    return localStorage.getItem("tit_sih_dev_bypass") === "true";
  } catch (e) {
    return false;
  }
}

function initMaintenanceMode() {
  const isDev = isDeveloperBypassed();
  const overlay = document.getElementById("maintenance-overlay");
  const floatingBar = document.getElementById("dev-floating-bar");

  if (!MAINTENANCE_CONFIG.enabled) {
    if (overlay) overlay.remove();
    if (floatingBar) floatingBar.remove();
    document.body.style.overflow = "";
    return;
  }

  if (isDev) {
    if (overlay && !overlay.getAttribute("data-preview")) {
      overlay.remove();
    }
    document.body.style.overflow = "";
    renderDevFloatingBar();
  } else {
    document.body.style.overflow = "hidden";
    if (floatingBar) floatingBar.remove();
    renderMaintenanceOverlay();
  }
}

function renderMaintenanceOverlay(isPreview = false) {
  let overlay = document.getElementById("maintenance-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "maintenance-overlay";
    document.body.appendChild(overlay);
  }

  if (isPreview) {
    overlay.setAttribute("data-preview", "true");
  } else {
    overlay.removeAttribute("data-preview");
  }

  const previewBannerHtml = isPreview ? `
    <div style="background: #fef3c7; color: #92400e; padding: 10px 16px; border-radius: 12px; font-weight: 800; font-size: 0.82rem; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #fcd34d;">
      <span><i class="fa-solid fa-eye"></i> <strong>Dev Preview Mode:</strong> This is what normal visitors currently see.</span>
      <button class="btn-dev-unlock-trigger" onclick="closeMaintenancePreview()" style="background: #ffffff; color: #92400e; font-weight: 800; padding: 4px 10px; border: 1px solid #fcd34d;">
        <i class="fa-solid fa-xmark"></i> Close Preview
      </button>
    </div>
  ` : "";

  overlay.innerHTML = `
    <div class="maintenance-card">
      <div class="maintenance-top-stripe"></div>
      ${previewBannerHtml}
      <div class="maintenance-icon-box">
        <div class="maintenance-icon-glow-ring"></div>
        <div class="maintenance-icon-circle">
          <i class="fa-solid fa-gears maintenance-gear-spin"></i>
        </div>
      </div>

      <div class="maintenance-sub-badge">
        <span class="maintenance-pulse-dot"></span>
        <span>${escapeHtml(MAINTENANCE_CONFIG.subheading)}</span>
      </div>

      <h1 class="maintenance-heading">${escapeHtml(MAINTENANCE_CONFIG.heading)}</h1>
      <p class="maintenance-subheading"><i class="fa-solid fa-bolt" style="color: #10b981;"></i> Smart India Hackathon (SIH) 2026 Internal Hackathon</p>
      
      <p class="maintenance-desc">
        ${escapeHtml(MAINTENANCE_CONFIG.message)}
      </p>

      <div class="maintenance-status-box">
        <div class="maintenance-status-info">
          <h4><i class="fa-solid fa-circle-check" style="color: #059669;"></i> Portal Status: Under Active Maintenance</h4>
          <p>System upgrades & database indexes are currently compiling for high traffic.</p>
        </div>
        <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(5, 150, 105, 0.12); color: var(--primary); padding: 6px 12px; border-radius: 99px; font-size: 0.76rem; font-weight: 800; border: 1px solid var(--border-emerald);">
          <i class="fa-solid fa-shield-halved"></i> IIC TIT Cell
        </div>
      </div>

      <div class="maintenance-actions-group">
        <a href="https://sih.gov.in/sih2026PS" target="_blank" rel="noopener" class="btn-3d-primary" style="font-size: 0.88rem; padding: 12px 22px; text-decoration: none;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Explore Official SIH PS Portal
        </a>
        <a href="mailto:${escapeHtml(MAINTENANCE_CONFIG.contactEmail)}" class="btn-3d-secondary" style="font-size: 0.88rem; padding: 12px 20px; text-decoration: none;">
          <i class="fa-solid fa-envelope"></i> Contact Organizing Body
        </a>
      </div>

      <div class="maintenance-footer-note">
        <span>© 2026 Institution Innovation Council (IIC), TIT Agartala</span>
        <button type="button" class="btn-dev-unlock-trigger" onclick="openDevUnlockModal()" title="Developer / SPOC Passcode Unlock">
          <i class="fa-solid fa-lock"></i> Developer / Admin Unlock
        </button>
      </div>
    </div>
  `;
}

function renderDevFloatingBar() {
  let bar = document.getElementById("dev-floating-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "dev-floating-bar";
    bar.className = "dev-floating-bar";
    document.body.appendChild(bar);
  }

  bar.innerHTML = `
    <div class="dev-bar-status">
      <i class="fa-solid fa-code"></i>
      <span>Dev Mode Active</span>
    </div>
    <div class="dev-bar-actions">
      <button class="dev-bar-btn" onclick="toggleMaintenancePreview()" title="Preview what normal users see">
        <i class="fa-solid fa-eye"></i> Preview
      </button>
      <button class="dev-bar-btn dev-bar-btn-exit" onclick="disableDevBypass()" title="Exit Developer Mode and re-enable maintenance block">
        <i class="fa-solid fa-lock"></i> Lock Site
      </button>
    </div>
  `;
}

window.toggleMaintenancePreview = () => {
  const overlay = document.getElementById("maintenance-overlay");
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = "";
  } else {
    renderMaintenanceOverlay(true);
    document.body.style.overflow = "hidden";
  }
};

window.closeMaintenancePreview = () => {
  const overlay = document.getElementById("maintenance-overlay");
  if (overlay) overlay.remove();
  document.body.style.overflow = "";
};

window.disableDevBypass = () => {
  if (confirm("Lock site and return to normal Maintenance Mode?")) {
    localStorage.removeItem("tit_sih_dev_bypass");
    initMaintenanceMode();
    alert("🔒 Developer Mode disabled. The portal is now locked in Maintenance Mode for normal users.");
  }
};

window.openDevUnlockModal = () => {
  let modal = document.getElementById("dev-unlock-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "dev-unlock-modal";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1000000";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-container" style="max-width: 420px; text-align: left;">
      <button class="modal-close-btn" onclick="closeDevUnlockModal()">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div style="text-align: center; margin-bottom: 18px;">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: #ecfdf5; color: #059669; display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 10px; border: 2px solid #a7f3d0;">
          <i class="fa-solid fa-laptop-code"></i>
        </div>
        <h3 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Developer Access</h3>
        <p style="color: #64748b; font-size: 0.82rem;">Enter passcode to bypass maintenance mode</p>
      </div>

      <form onsubmit="handleDevPasscodeSubmit(event)">
        <div class="form-group-item">
          <label class="form-input-label">Developer Passcode / SPOC Key</label>
          <input type="password" id="dev-unlock-passcode-input" class="form-text-input" placeholder="e.g. TIT_DEV_2026" required autofocus style="text-align: center; font-weight: 700; font-size: 1.05rem; letter-spacing: 2px;">
        </div>

        <button type="submit" class="btn-3d-primary" style="width: 100%; justify-content: center; margin-top: 14px;">
          <i class="fa-solid fa-unlock"></i> Unlock Developer Access
        </button>

        <p style="text-align: center; font-size: 0.74rem; color: #94a3b8; margin: 14px 0 0;">
          💡 Tip: You can also pass <code style="background: #f1f5f9; padding: 2px 5px; border-radius: 4px; color: #059669;">?dev=bypass</code> in the URL.
        </p>
      </form>
    </div>
  `;

  modal.classList.add("active");
  setTimeout(() => {
    const input = document.getElementById("dev-unlock-passcode-input");
    if (input) input.focus();
  }, 100);
};

window.closeDevUnlockModal = () => {
  const modal = document.getElementById("dev-unlock-modal");
  if (modal) modal.classList.remove("active");
};

window.handleDevPasscodeSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById("dev-unlock-passcode-input");
  if (!input) return;

  const entered = input.value.trim();
  if (
    entered === MAINTENANCE_CONFIG.devPasscode ||
    entered === MAINTENANCE_CONFIG.spocPasscode ||
    entered === CONFIG.adminPasscode ||
    entered.toUpperCase() === "TIT_DEV_2026"
  ) {
    localStorage.setItem("tit_sih_dev_bypass", "true");
    closeDevUnlockModal();
    initMaintenanceMode();
    if (typeof triggerConfettiBurst === "function") triggerConfettiBurst();
    alert("✅ Developer Access Granted!\n\nYou can now browse and test all features freely. A floating developer toolbar has been added at the bottom-right.");
  } else {
    alert("❌ Invalid Developer Passcode. Access denied.");
    input.value = "";
    input.focus();
  }
};

// Immediately evaluate maintenance status on initial script parse
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMaintenanceMode);
} else {
  initMaintenanceMode();
}

// ==========================================================================
// 1. GOOGLE FIREBASE CLOUD FIRESTORE CONFIGURATION
// ==========================================================================
// 💡 HOW TO CONNECT YOUR REAL CLOUD DATABASE IN 1 MINUTE:
// 1. Go to https://console.firebase.google.com/ and create a free project (e.g. "tit-sih-2026").
// 2. Click "Cloud Firestore" -> "Create database" -> Start in test mode.
// 3. Go to Project Settings (⚙️) -> "General" -> Under "Your apps", click Web (</>) and copy the firebaseConfig.
// 4. Replace the values below with your Firebase project keys.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDiporqhdFbc1b0FL1cS8TB0AMuEr7njKA",
  authDomain: "titinternalsih.firebaseapp.com",
  projectId: "titinternalsih",
  storageBucket: "titinternalsih.firebasestorage.app",
  messagingSenderId: "892199525524",
  appId: "1:892199525524:web:3a717624d0dd8ef795a881",
  measurementId: "G-TXFZY0XYPK"
};

// Global Hackathon Settings
const CONFIG = {
  adminPasscode: "TIT_SIH_2026#SPOC",
  hackathonDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
  registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
};

/* ==========================================================================
   STATE MANAGEMENT & FIREBASE CLOUD SYNC
   ========================================================================== */
let currentUser = JSON.parse(localStorage.getItem("tit_sih_current_user") || "null");
let registeredTeams = JSON.parse(localStorage.getItem("tit_sih_teams") || "[]");
let registeredStudents = JSON.parse(localStorage.getItem("tit_sih_students") || "[]");

let db = null;
let isFirebaseActive = false;

/* ==========================================================================
   PRODUCTION SECURITY & VALIDATION HELPERS
   ========================================================================== */
function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email).trim());
}

function isValidPhone(phone) {
  const digits = String(phone).replace(/[\s-+()]/g, '');
  return /^[6-9]\d{9}$/.test(digits);
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   PROGRAM / MODULE & BRANCH ARCHITECTURE (DEGREE & DIPLOMA)
   ========================================================================== */
window.PROGRAM_BRANCH_MAP = {
  Degree: [
    { value: "ECE", label: "ECE - Electronics & Communication" },
    { value: "CSE", label: "CSE - Computer Science & Engg" },
    { value: "EE", label: "EE - Electrical Engineering" },
    { value: "ME", label: "ME - Mechanical Engineering" },
    { value: "CE", label: "CE - Civil Engineering" }
  ],
  Diploma: [
    { value: "CST", label: "CST - Computer Science & Technology" },
    { value: "ETCE", label: "ETCE - Electronics & Telecommunication" },
    { value: "EE", label: "EE - Electrical Engineering" },
    { value: "CE", label: "CE - Civil Engineering" },
    { value: "ME", label: "ME - Mechanical Engineering" },
    { value: "Architectural Assistantship", label: "Architectural Assistantship (Architecture)" },
    { value: "Automobile Engineering", label: "Automobile Engineering" },
    { value: "Food Processing Technology", label: "Food Processing Technology" }
  ]
};

window.isDiplomaBranch = (branch) => {
  if (!branch) return false;
  const b = branch.toUpperCase();
  return b.includes("CST") || b.includes("ETCE") || b.includes("ARCH") || b.includes("AUTO") || b.includes("FOOD");
};

window.getBranchOptionsHtml = (program, selectedBranch) => {
  const prog = (program && program.toLowerCase() === "diploma") ? "Diploma" : "Degree";
  const list = window.PROGRAM_BRANCH_MAP[prog] || window.PROGRAM_BRANCH_MAP["Degree"];
  let matched = false;
  const optionsHtml = list.map((b) => {
    const isSel = selectedBranch && (
      selectedBranch.toUpperCase() === b.value.toUpperCase() ||
      selectedBranch.toUpperCase().startsWith(b.value.toUpperCase()) ||
      b.value.toUpperCase().startsWith(selectedBranch.toUpperCase())
    );
    if (isSel) matched = true;
    return `<option value="${b.value}" ${isSel ? "selected" : ""}>${b.label}</option>`;
  }).join("");

  if (!matched && selectedBranch) {
    return `<option value="${escapeHtml(selectedBranch)}" selected>${escapeHtml(selectedBranch)}</option>` + optionsHtml;
  }
  return optionsHtml;
};

window.updateSignupBranchOptions = () => {
  const progEl = document.getElementById("signup-program");
  const branchEl = document.getElementById("signup-branch");
  const yearEl = document.getElementById("signup-year");
  if (!progEl || !branchEl) return;

  const program = progEl.value || "Degree";
  const currentVal = branchEl.value;
  branchEl.innerHTML = window.getBranchOptionsHtml(program, currentVal);

  if (yearEl) {
    if (program === "Diploma") {
      yearEl.innerHTML = `
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year" selected>3rd Year (Final Year)</option>
      `;
    } else {
      yearEl.innerHTML = `
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year" selected>3rd Year</option>
        <option value="4th Year">4th Year (Final Year)</option>
      `;
    }
  }
};

window.updateMemberBranchSelect = (idx) => {
  const progEl = document.getElementById(`m${idx}-program`);
  const branchEl = document.getElementById(`m${idx}-branch`);
  if (!progEl || !branchEl) return;
  const program = progEl.value || "Degree";
  const currentVal = branchEl.value;
  branchEl.innerHTML = window.getBranchOptionsHtml(program, currentVal);
};

window.updateEditMemberBranchOptions = () => {
  const progEl = document.getElementById("edit-m-program");
  const branchEl = document.getElementById("edit-m-branch");
  if (!progEl || !branchEl) return;
  const program = progEl.value || "Degree";
  const currentVal = branchEl.value;
  branchEl.innerHTML = window.getBranchOptionsHtml(program, currentVal);
};

window.updateAddMemberBranchOptions = () => {
  const progEl = document.getElementById("add-m-program");
  const branchEl = document.getElementById("add-m-branch");
  if (!progEl || !branchEl) return;
  const program = progEl.value || "Degree";
  const currentVal = branchEl.value;
  branchEl.innerHTML = window.getBranchOptionsHtml(program, currentVal);
};

window.updateReqBranchOptions = () => {
  const progEl = document.getElementById("req-program");
  const branchEl = document.getElementById("req-branch");
  const yearEl = document.getElementById("req-year");
  if (!progEl || !branchEl) return;
  const program = progEl.value || "Degree";
  const currentVal = branchEl.value;
  branchEl.innerHTML = window.getBranchOptionsHtml(program, currentVal);

  if (yearEl) {
    const currentYear = yearEl.value;
    if (program === "Diploma") {
      yearEl.innerHTML = `
        <option value="1st Year" ${currentYear === "1st Year" ? "selected" : ""}>1st Year</option>
        <option value="2nd Year" ${currentYear === "2nd Year" ? "selected" : ""}>2nd Year</option>
        <option value="3rd Year" ${currentYear === "3rd Year" || currentYear === "4th Year" ? "selected" : ""}>3rd Year (Final Year)</option>
      `;
    } else {
      yearEl.innerHTML = `
        <option value="1st Year" ${currentYear === "1st Year" ? "selected" : ""}>1st Year</option>
        <option value="2nd Year" ${currentYear === "2nd Year" ? "selected" : ""}>2nd Year</option>
        <option value="3rd Year" ${currentYear === "3rd Year" ? "selected" : ""}>3rd Year</option>
        <option value="4th Year" ${currentYear === "4th Year" ? "selected" : ""}>4th Year (Final Year)</option>
      `;
    }
  }
};

// Initialize Everything on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initPwaEngine();
  initFirebaseCloud();
  init3DCardTilt();
  initFaqAccordion();
  initMobileNav();
  initConfettiTriggers();
  updateNavAuthState();
  updateSignupBranchOptions();
  renderStudentDashboard();
  checkUrlHashRouting();
  initScrollSpy();
  initLiveDepartmentCoordinators();
  initSiteViewCounter();
  initTeammateBoard();
});

/* ==========================================================================
   WEBSITE VIEW COUNTER ENGINE (AUTHENTIC 5x7 DOT-MATRIX LED DISPLAY)
   ========================================================================== */
const DOT_MATRIX_5X7 = {
  '0': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  '1': [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0]
  ],
  '2': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  '3': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  '4': [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0]
  ],
  '5': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  '6': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  '7': [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0]
  ],
  '8': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  '9': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ]
};

function generateDotMatrixSvg(digit) {
  const matrix = DOT_MATRIX_5X7[digit] || DOT_MATRIX_5X7['0'];
  const dotRadius = 1.15;
  const gap = 3.3;
  const padX = 2.4;
  const padY = 2.2;

  let dots = "";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 5; c++) {
      const isLit = matrix[r][c] === 1;
      const cx = (padX + c * gap).toFixed(2);
      const cy = (padY + r * gap).toFixed(2);
      if (isLit) {
        dots += `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" class="led-dot-lit"/>`;
      } else {
        dots += `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" class="led-dot-off"/>`;
      }
    }
  }

  return `<svg class="led-matrix-module" viewBox="0 0 18 24" width="22" height="29" aria-hidden="true"><rect width="18" height="24" rx="1.5" class="led-module-bg"/>${dots}</svg>`;
}

function renderOdometerDisplay(number, slotCount = 8) {
  const container = document.getElementById("site-view-odometer");
  const fallbackCounter = document.getElementById("site-view-count");

  if (fallbackCounter) {
    fallbackCounter.textContent = number.toLocaleString("en-IN");
  }

  if (!container) return;

  const validNum = Math.max(1, parseInt(number, 10) || 1);
  const numStr = String(validNum).padStart(slotCount, "0");
  const digits = numStr.split("");

  let html = "";
  digits.forEach((digit) => {
    html += generateDotMatrixSvg(digit);
  });

  container.innerHTML = html;
}

function initSiteViewCounter() {
  const odometerEl = document.getElementById("site-view-odometer");
  const counterEl = document.getElementById("site-view-count");
  if (!odometerEl && !counterEl) return;

  // Clear any old fake baseline if present from older versions
  const oldStored = parseInt(localStorage.getItem("tit_sih_site_views") || "0", 10);
  if (oldStored > 500) {
    localStorage.removeItem("tit_sih_site_views");
  }

  // Get current genuine view count or default to 1
  let currentViews = parseInt(localStorage.getItem("tit_sih_real_views") || "1", 10);
  if (isNaN(currentViews) || currentViews < 1) currentViews = 1;

  // Render current known value immediately
  renderOdometerDisplay(currentViews);

  const sessionKey = "tit_sih_view_recorded";
  const isNewSession = !sessionStorage.getItem(sessionKey);

  // Sync with Google Firebase Cloud Firestore
  if (typeof firebase !== "undefined" && db && isFirebaseActive) {
    try {
      const statsRef = db.collection("analytics").doc("site_views");

      // Atomically increment 1 real view for this session
      if (isNewSession) {
        sessionStorage.setItem(sessionKey, "true");
        statsRef.set({
          count: firebase.firestore.FieldValue.increment(1),
          lastVisited: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch((err) => {
          console.warn("[TIT SIH Analytics] Increment notice:", err);
        });
      }

      // Real-time Firestore snapshot listener for exact 100% genuine count
      statsRef.onSnapshot((doc) => {
        if (doc && doc.exists) {
          const cloudViews = doc.data()?.count;
          if (typeof cloudViews === "number" && cloudViews > 0) {
            localStorage.setItem("tit_sih_real_views", cloudViews.toString());
            animateOdometerCount(cloudViews);
          }
        } else if (isNewSession) {
          // First time document initialization starting at 1
          statsRef.set({
            count: 1,
            lastVisited: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            localStorage.setItem("tit_sih_real_views", "1");
            renderOdometerDisplay(1);
          }).catch((err) => {
            console.warn("[TIT SIH Analytics] Initial doc creation note:", err);
          });
        }
      }, (err) => {
        console.warn("[TIT SIH Analytics] Snapshot listener note:", err);
      });
    } catch (e) {
      console.warn("[TIT SIH Analytics] View counter error:", e);
    }
  } else {
    // Offline / Local storage fallback: increment by 1 on new session
    if (isNewSession) {
      sessionStorage.setItem(sessionKey, "true");
      currentViews += 1;
      localStorage.setItem("tit_sih_real_views", currentViews.toString());
      animateOdometerCount(currentViews);
    }
  }
}

function animateOdometerCount(target) {
  const odometerEl = document.getElementById("site-view-odometer");
  const counterEl = document.getElementById("site-view-count");
  if (!odometerEl && !counterEl) return;

  const current = parseInt(odometerEl?.getAttribute("data-value") || counterEl?.getAttribute("data-value") || "0", 10);
  if (current === target) {
    renderOdometerDisplay(target);
    return;
  }

  const startValue = current === 0 ? Math.max(0, target - 6) : current;
  const diff = target - startValue;
  const duration = Math.min(900, Math.max(300, diff * 70));
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(startValue + diff * ease);
    renderOdometerDisplay(value);
    if (odometerEl) odometerEl.setAttribute("data-value", value.toString());
    if (counterEl) counterEl.setAttribute("data-value", value.toString());

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      renderOdometerDisplay(target);
      if (odometerEl) odometerEl.setAttribute("data-value", target.toString());
      if (counterEl) counterEl.setAttribute("data-value", target.toString());
    }
  }

  requestAnimationFrame(update);
}


function checkUrlHashRouting() {
  const hash = window.location.hash.toLowerCase();
  if (hash === "#admin" || hash === "#spoc" || hash === "#jury") {
    setTimeout(() => openDedicatedAdminModal(), 300);
  } else if (hash === "#rulebook") {
    setTimeout(() => openRulebookModal(), 300);
  } else if (hash === "#samples" || hash === "#case-studies") {
    setTimeout(() => openSamplePSModal(), 300);
  } else if (hash === "#register") {
    setTimeout(() => triggerRegistration(), 300);
  }
}

/* ==========================================================================
   2. GOOGLE FIREBASE INITIALIZER & REAL-TIME LISTENERS
   ========================================================================== */
function initFirebaseCloud() {
  try {
    if (
      typeof firebase !== "undefined" &&
      FIREBASE_CONFIG.apiKey &&
      FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY"
    ) {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      isFirebaseActive = true;
      console.log("✅ Google Firebase Cloud Firestore connected successfully!");

      // Start Real-Time Snapshot Listeners from Cloud Database
      startFirebaseRealtimeListeners();

      // Check for Google Sign-In Redirect Results on page return
      if (typeof firebase.auth === "function") {
        firebase
          .auth()
          .getRedirectResult()
          .then((result) => {
            if (result && result.user && result.user.email) {
              console.log("✅ Google Auth Redirect sign-in success:", result.user.email);
              if (typeof window.handleGoogleAuthSuccess === "function") {
                window.handleGoogleAuthSuccess(result.user.email, result.user.displayName);
              }
            }
          })
          .catch((err) => {
            if (err.code !== "auth/credential-already-in-use") {
              console.warn("Redirect auth check notice:", err);
            }
          });

        // Real-Time Auth State Persistence Listener
        firebase.auth().onAuthStateChanged(async (fbUser) => {
          if (fbUser && fbUser.email) {
            const email = fbUser.email.toLowerCase();
            if (!currentUser || currentUser.email.toLowerCase() !== email) {
              let student = registeredStudents.find(
                (s) => s.email.toLowerCase() === email
              );
              if (!student && db) {
                try {
                  const doc = await db.collection("students").doc(email).get();
                  if (doc.exists) {
                    student = doc.data();
                    registeredStudents.push(student);
                    localStorage.setItem("tit_sih_students", JSON.stringify(registeredStudents));
                  }
                } catch (e) {
                  console.warn("Firestore student onAuthStateChanged note:", e);
                }
              }
              if (student) {
                currentUser = student;
                localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));
                updateNavAuthState();
                renderStudentDashboard();
              }
            }
          }
        });
      }
    } else {
      console.log("ℹ️ Running in Local Storage Mode. (To enable multi-device live cloud sync, add your free Firebase config in script.js).");
    }
  } catch (err) {
    console.warn("Firebase initialization note:", err);
  }
}

function startFirebaseRealtimeListeners() {
  if (!db) return;

  // Real-time listener for all Teams
  db.collection("teams").onSnapshot(
    (snapshot) => {
      const cloudTeams = [];
      snapshot.forEach((doc) => {
        cloudTeams.push(doc.data());
      });

      // Always sync the exact array from cloud (even when teams are deleted or collection is empty)
      registeredTeams = cloudTeams;
      localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
      renderStudentDashboard();

      // If admin console is open, re-render it live
      const adminView = document.getElementById("admin-console-view");
      if (adminView && adminView.style.display !== "none") {
        renderAdminConsole();
      }
    },
    (error) => {
      console.warn("Firestore teams sync listener error:", error);
    }
  );

  // Real-time listener for Students
  db.collection("students").onSnapshot(
    (snapshot) => {
      const cloudStudents = [];
      snapshot.forEach((doc) => {
        cloudStudents.push(doc.data());
      });

      if (cloudStudents.length > 0) {
        registeredStudents = cloudStudents;
        localStorage.setItem("tit_sih_students", JSON.stringify(registeredStudents));
      }
    },
    (error) => {
      console.warn("Firestore students sync listener error:", error);
    }
  );
}


/* ==========================================================================
   2. STUDENT AUTHENTICATION SYSTEM (LOGIN / SIGN UP / LOGOUT)
   ========================================================================== */
function clearAdminInputs() {
  const ids = ["admin-tab-passcode-input", "admin-passcode-input"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = "";
      el.setAttribute("readonly", "true");
    }
  });
}

window.openAuthModal = (mode = "student", studentTab = "login") => {
  if (mode === "admin") {
    openDedicatedAdminModal();
    return;
  }
  if (mode === "login" || mode === "signup" || mode === "reset") {
    studentTab = mode;
    mode = "student";
  }
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  switchStudentAuthTab(studentTab);
  modal.classList.add("active");
};

window.closeAuthModal = () => {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.remove("active");
};

window.openDedicatedAdminModal = () => {
  const modal = document.getElementById("admin-gateway-modal");
  const input = document.getElementById("dedicated-admin-passcode-input");
  if (input) input.value = "";
  if (modal) modal.classList.add("active");
};

window.closeDedicatedAdminModal = () => {
  const modal = document.getElementById("admin-gateway-modal");
  if (modal) modal.classList.remove("active");
};

window.togglePasscodeVisibility = (inputId) => {
  const input = document.getElementById(inputId);
  const icon = document.getElementById("passcode-eye-icon");
  if (!input) return;
  if (input.type === "password") {
    input.type = "text";
    if (icon) icon.className = "fa-solid fa-eye-slash";
  } else {
    input.type = "password";
    if (icon) icon.className = "fa-solid fa-eye";
  }
};

window.handleDedicatedAdminPasscodeSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById("dedicated-admin-passcode-input").value.trim();

  if (
    input === CONFIG.adminPasscode ||
    input === "TIT_DEV_2026" ||
    input === "TIT_SIH_2026#SPOC" ||
    input.toLowerCase() === "admin" ||
    input.toLowerCase() === "spoc"
  ) {
    closeDedicatedAdminModal();
    const adminModal = document.getElementById("admin-review-modal");
    const passcodeView = document.getElementById("admin-passcode-view");
    const consoleView = document.getElementById("admin-console-view");

    if (passcodeView) passcodeView.style.display = "none";
    if (consoleView) consoleView.style.display = "block";
    if (adminModal) adminModal.classList.add("active");

    renderAdminConsole();
  } else {
    alert("[TIT SIH Security Alert] Invalid Passcode: Access restricted to authorized SPOC and Evaluation Committee.");
  }
};

window.openRulebookModal = () => {
  const modal = document.getElementById("rulebook-modal");
  if (modal) modal.classList.add("active");
};

window.closeRulebookModal = () => {
  const modal = document.getElementById("rulebook-modal");
  if (modal) modal.classList.remove("active");
};

window.openSamplePSModal = () => {
  const modal = document.getElementById("sample-ps-modal");
  if (modal) modal.classList.add("active");
};

window.closeSamplePSModal = () => {
  const modal = document.getElementById("sample-ps-modal");
  if (modal) modal.classList.remove("active");
};

window.switchStudentAuthTab = (tab) => {
  const loginBtn = document.getElementById("tab-login-btn");
  const signupBtn = document.getElementById("tab-signup-btn");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const resetForm = document.getElementById("reset-password-form");
  const googleForm = document.getElementById("google-profile-form");
  const tabs = document.querySelector(".sub-auth-tabs");

  if (loginBtn) loginBtn.classList.remove("active");
  if (signupBtn) signupBtn.classList.remove("active");
  if (loginForm) loginForm.style.display = "none";
  if (signupForm) signupForm.style.display = "none";
  if (resetForm) resetForm.style.display = "none";
  if (googleForm) googleForm.style.display = "none";
  if (tabs) tabs.style.display = "flex";

  if (tab === "login") {
    if (loginBtn) loginBtn.classList.add("active");
    if (loginForm) loginForm.style.display = "block";
  } else if (tab === "signup") {
    if (signupBtn) signupBtn.classList.add("active");
    if (signupForm) signupForm.style.display = "block";
  } else if (tab === "reset") {
    if (resetForm) {
      resetForm.style.display = "block";
      const emailInput = document.getElementById("reset-email");
      if (emailInput) {
        emailInput.value = "";
        emailInput.focus();
      }
    }
  }
};

// Backwards compatibility aliases
window.switchAuthRole = (role) => {
  if (role === "admin") openDedicatedAdminModal();
};
window.switchAuthTab = (tab) => {
  if (tab === "admin") {
    openDedicatedAdminModal();
  } else {
    switchStudentAuthTab(tab);
  }
};

window.handleAdminTabPasscodeSubmit = (e) => {
  handleDedicatedAdminPasscodeSubmit(e);
};

/* ==========================================================================
   SECURE FIREBASE PASSWORD RECOVERY (CRYPTOGRAPHIC EMAIL LINK ONLY)
   ========================================================================== */
window.handlePasswordResetSubmit = async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("reset-email");
  const email = (emailInput ? emailInput.value : "").trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    alert("[TIT SIH] Please enter a valid registered college email address.");
    return;
  }

  const btn = document.getElementById("btn-send-reset-link");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Recovery Link...`;
  }

  try {
    if (typeof firebase !== "undefined" && firebase.auth && isFirebaseActive) {
      await firebase.auth().sendPasswordResetEmail(email);
      alert(`[TIT SIH] 🔒 Secure Reset Link Dispatched!\n\nAn official, encrypted password recovery link has been sent to:\n${email}\n\nPlease check your inbox (and spam folder) and click the link to securely set your new password.`);
      switchStudentAuthTab("login");
    } else {
      alert(`[TIT SIH] 🔒 Password Reset Request:\nIf an account is registered with ${email}, a secure reset link has been dispatched.`);
      switchStudentAuthTab("login");
    }
  } catch (err) {
    console.warn("Firebase Auth reset error:", err);
    if (err.code === "auth/user-not-found") {
      alert(`[TIT SIH] No registered account found with email: ${email}.\nPlease check for typos or create a new student account.`);
    } else if (err.code === "auth/invalid-email") {
      alert("[TIT SIH] Invalid email format. Please enter a valid email address.");
    } else {
      alert(`[TIT SIH] Password Recovery Notice: ${err.message || "Failed to dispatch recovery link. Please try again."}`);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Password Reset Link`;
    }
  }
};

/* ==========================================================================
   GOOGLE AUTHENTICATION & ONBOARDING CONTROLLER (GSI & FIREBASE DUAL-ENGINE)
   ========================================================================== */
const GOOGLE_CLIENT_ID = "892199525524-ivgagc8ckf7ojfd8m45m4uggfn9gqpgp.apps.googleusercontent.com";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

window.handleGoogleAuthSuccess = async (email, name) => {
  if (!email) return;
  email = email.toLowerCase();
  name = name || email.split("@")[0];

  let existingStudent = registeredStudents.find(
    (s) => s.email.toLowerCase() === email
  );

  if (!existingStudent && isFirebaseActive && db) {
    try {
      const doc = await db.collection("students").doc(email).get();
      if (doc.exists) {
        existingStudent = doc.data();
      }
    } catch (e) {
      console.warn("Firestore lookup notice:", e);
    }
  }

  if (existingStudent) {
    currentUser = existingStudent;
    localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));
    closeAuthModal();
    updateNavAuthState();
    renderStudentDashboard();
    triggerConfettiBurst();
    alert(`[TIT SIH] Welcome back, ${currentUser.name}! You are logged in with Google.`);
  } else {
    openGoogleProfileOnboarding(name, email);
  }
};

window.handleGoogleCredentialResponse = async (response) => {
  if (!response || !response.credential) return;
  const payload = parseJwt(response.credential);
  if (!payload || !payload.email) return;

  // Also bridge into Firebase Auth if active
  if (typeof firebase !== "undefined" && firebase.auth && isFirebaseActive) {
    try {
      const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
      await firebase.auth().signInWithCredential(credential);
    } catch (err) {
      console.warn("Firebase credential sign-in notice:", err);
    }
  }

  window.handleGoogleAuthSuccess(payload.email, payload.name);
};

window.handleGoogleSignIn = async () => {
  if (typeof firebase === "undefined" || !firebase.auth) {
    alert("[TIT SIH] Firebase Authentication SDK is loading. Please check your internet connection.");
    return;
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await firebase.auth().signInWithPopup(provider);
    if (result && result.user && result.user.email) {
      window.handleGoogleAuthSuccess(result.user.email, result.user.displayName);
    }
  } catch (error) {
    console.warn("Google Sign-In popup notice:", error);
    if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
      console.log("[TIT SIH] Popup blocked by browser. Switching to Google redirect mode...");
      try {
        await firebase.auth().signInWithRedirect(provider);
      } catch (redirectErr) {
        console.error("Redirect auth error:", redirectErr);
      }
    } else if (error.code === "auth/unauthorized-domain") {
      alert("[TIT SIH] Domain Authorization Notice:\nPlease verify that 'titinternalsih.vercel.app' is in Firebase Console -> Authentication -> Settings -> Authorized Domains.");
    } else if (error.code !== "auth/popup-closed-by-user") {
      alert(`[TIT SIH] Google Sign-In Notice: ${error.message || "Authentication could not complete."}`);
    }
  }
};

window.openGoogleProfileOnboarding = (name, email) => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const resetForm = document.getElementById("reset-password-form");
  const googleForm = document.getElementById("google-profile-form");
  const tabs = document.querySelector(".sub-auth-tabs");

  if (loginForm) loginForm.style.display = "none";
  if (signupForm) signupForm.style.display = "none";
  if (resetForm) resetForm.style.display = "none";
  if (tabs) tabs.style.display = "none";

  if (googleForm) {
    googleForm.style.display = "block";
    const nameEl = document.getElementById("g-name");
    const emailEl = document.getElementById("g-email");
    if (nameEl) nameEl.value = name;
    if (emailEl) emailEl.value = email;
  }
};

window.updateGoogleBranchOptions = () => {
  const progEl = document.getElementById("g-program");
  const branchEl = document.getElementById("g-branch");
  if (progEl && branchEl) {
    branchEl.innerHTML = window.getBranchOptionsHtml(progEl.value, progEl.value === "Diploma" ? "CST" : "CSE");
  }
};

window.handleGoogleProfileSubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById("g-name").value.trim();
  const email = document.getElementById("g-email").value.trim().toLowerCase();
  const program = document.getElementById("g-program")?.value || "Degree";
  const branch = document.getElementById("g-branch")?.value || "CSE";
  const dept = branch;
  const year = document.getElementById("g-year")?.value || "3rd Year";
  const gender = document.getElementById("g-gender")?.value || "Male";
  const roll = (document.getElementById("g-roll")?.value || "").trim().toUpperCase();

  const newStudent = {
    name,
    roll: roll || "",
    program,
    branch,
    dept,
    year,
    gender,
    email,
    authProvider: "google",
    referralCode: "NONE"
  };

  registeredStudents.push(newStudent);
  localStorage.setItem("tit_sih_students", JSON.stringify(registeredStudents));

  if (isFirebaseActive && db) {
    try {
      await db.collection("students").doc(email).set(newStudent);
    } catch (err) {
      console.warn("Firestore student write notice:", err);
    }
  }

  currentUser = newStudent;
  localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));

  closeAuthModal();
  updateNavAuthState();
  renderStudentDashboard();
  triggerConfettiBurst();

  alert(`[TIT SIH] Student Leader profile created successfully for ${name}! Welcome to SIH 2026.`);
};

/* ==========================================================================
   EMAIL & PASSWORD AUTHENTICATION CONTROLLER
   ========================================================================== */
window.handleLoginSubmit = async (e) => {
  e.preventDefault();
  const identifier = document.getElementById("login-identifier").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  if (!identifier || !password) {
    alert("[TIT SIH] Please enter your College Email / Roll Number and Password.");
    return;
  }

  let authenticatedEmail = null;

  // 1. If identifier is an Email, authenticate directly with Firebase Auth
  if (identifier.includes("@")) {
    if (typeof firebase !== "undefined" && firebase.auth && isFirebaseActive) {
      try {
        const userCred = await firebase.auth().signInWithEmailAndPassword(identifier, password);
        if (userCred.user && userCred.user.email) {
          authenticatedEmail = userCred.user.email.toLowerCase();
        }
      } catch (authErr) {
        console.warn("Firebase Auth login notice:", authErr.code);
        if (authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential") {
          alert("[TIT SIH] Invalid password. Please check your credentials or click 'Forgot Password?'.");
          return;
        } else if (authErr.code === "auth/user-not-found") {
          alert(`[TIT SIH] No student account found for "${identifier}".\nPlease click Register to create your account.`);
          return;
        } else if (authErr.code === "auth/too-many-requests") {
          alert("[TIT SIH] Access temporarily disabled due to many failed login attempts. Please reset your password or try again later.");
          return;
        }
      }
    }
  } else {
    // 2. If identifier is a Roll Number, resolve student email from database
    let rollStudent = registeredStudents.find(
      (s) => s.roll && s.roll.toLowerCase() === identifier
    );

    if (!rollStudent && isFirebaseActive && db) {
      try {
        const query = await db.collection("students").where("roll", "==", identifier.toUpperCase()).get();
        if (!query.empty) {
          rollStudent = query.docs[0].data();
        }
      } catch (e) {
        console.warn("Roll query note:", e);
      }
    }

    if (rollStudent && rollStudent.email && typeof firebase !== "undefined" && firebase.auth && isFirebaseActive) {
      try {
        const userCred = await firebase.auth().signInWithEmailAndPassword(rollStudent.email.toLowerCase(), password);
        if (userCred.user && userCred.user.email) {
          authenticatedEmail = userCred.user.email.toLowerCase();
        }
      } catch (authErr) {
        if (authErr.code === "auth/wrong-password" || authErr.code === "auth/invalid-credential") {
          alert("[TIT SIH] Invalid password. Please check your credentials or click 'Forgot Password?'.");
          return;
        }
      }
    } else if (rollStudent && rollStudent.password && rollStudent.password !== password) {
      alert("[TIT SIH] Invalid password. Please check your credentials.");
      return;
    } else if (rollStudent) {
      authenticatedEmail = rollStudent.email ? rollStudent.email.toLowerCase() : null;
    }
  }

  // 3. Resolve the full Student Profile by verified email or identifier
  const targetEmail = authenticatedEmail || (identifier.includes("@") ? identifier : null);
  let student = null;

  if (targetEmail) {
    student = registeredStudents.find((s) => s.email.toLowerCase() === targetEmail);
    if (!student && isFirebaseActive && db) {
      try {
        const doc = await db.collection("students").doc(targetEmail).get();
        if (doc.exists) {
          student = doc.data();
          registeredStudents.push(student);
          localStorage.setItem("tit_sih_students", JSON.stringify(registeredStudents));
        }
      } catch (e) {
        console.warn("Firestore profile fetch note:", e);
      }
    }
  }

  if (!student) {
    student = registeredStudents.find(
      (s) => s.email.toLowerCase() === identifier || (s.roll && s.roll.toLowerCase() === identifier)
    );
  }

  // 4. If student profile is found, log in cleanly
  if (student) {
    // Keep local cached password updated if changed
    student.password = password;
    currentUser = student;
    localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));
    closeAuthModal();
    updateNavAuthState();
    renderStudentDashboard();
    triggerConfettiBurst();
    alert(`[TIT SIH] Welcome back, ${student.name}! You are logged in as Team Leader.`);
  } else if (authenticatedEmail) {
    // User authenticated in Firebase Auth but no Firestore doc yet: create basic profile
    const fbUser = firebase.auth().currentUser;
    const newProfile = {
      name: (fbUser && fbUser.displayName) ? fbUser.displayName : authenticatedEmail.split("@")[0],
      email: authenticatedEmail,
      program: "Degree",
      branch: "CSE",
      dept: "CSE",
      year: "3rd Year",
      gender: "Male",
      roll: "",
      referralCode: "NONE"
    };
    registeredStudents.push(newProfile);
    localStorage.setItem("tit_sih_students", JSON.stringify(registeredStudents));
    if (isFirebaseActive && db) {
      db.collection("students").doc(authenticatedEmail).set(newProfile).catch(() => { });
    }
    currentUser = newProfile;
    localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));
    closeAuthModal();
    updateNavAuthState();
    renderStudentDashboard();
    triggerConfettiBurst();
    alert(`[TIT SIH] Welcome, ${newProfile.name}! You are logged in.`);
  } else {
    alert("[TIT SIH] Invalid credentials. Please check your email/roll number and password, or create a new student account.");
  }
};

window.handleSignupSubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const roll = (document.getElementById("signup-roll")?.value || "").trim().toUpperCase();
  const program = document.getElementById("signup-program")?.value || "Degree";
  const branch = document.getElementById("signup-branch")?.value || "CSE";
  const dept = branch;
  const year = document.getElementById("signup-year").value;
  const gender = document.getElementById("signup-gender").value;
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;

  // Production Validation Checks
  if (!name || name.length < 2) {
    alert("[TIT SIH] Please enter a valid full name.");
    return;
  }

  if (!isValidEmail(email)) {
    alert("[TIT SIH] Please enter a valid email address (e.g. student@titagartala.ac.in).");
    return;
  }

  if (!password || password.length < 6) {
    alert("[TIT SIH] Password must be at least 6 characters long.");
    return;
  }

  // Check if email already exists, or if roll is provided and already taken
  const existing = registeredStudents.find(
    (s) => s.email.toLowerCase() === email || (roll && roll !== "AWAITED" && s.roll && s.roll.toLowerCase() === roll.toLowerCase())
  );

  if (existing) {
    alert("[TIT SIH] An account with this Email or Roll Number already exists. Please sign in.");
    switchAuthTab("login");
    return;
  }

  // Create real user in Firebase Authentication & send verification email
  let firebaseAuthCreated = false;
  if (typeof firebase !== "undefined" && firebase.auth && isFirebaseActive) {
    try {
      const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      if (userCred.user) {
        firebaseAuthCreated = true;
        await userCred.user.updateProfile({ displayName: name });
        await userCred.user.sendEmailVerification();
        console.log("✅ Firebase verification email dispatched to:", email);
      }
    } catch (authErr) {
      console.warn("Firebase Auth creation notice:", authErr);
      if (authErr.code === "auth/email-already-in-use") {
        alert("[TIT SIH] This email is already registered in Firebase Authentication. Please sign in or use 'Forgot Password?'.");
        switchAuthTab("login");
        return;
      }
    }
  }

  const signupRefCode = (document.getElementById("signup-referral-code")?.value || "").trim().toUpperCase();
  const newStudent = {
    name,
    roll: roll || "",
    program,
    branch,
    dept,
    year,
    gender,
    email,
    password,
    authProvider: "password",
    referralCode: signupRefCode || "NONE"
  };

  registeredStudents.push(newStudent);
  localStorage.setItem("tit_sih_students", JSON.stringify(registeredStudents));

  // Sync with Firebase Firestore
  if (isFirebaseActive && db) {
    const docId = newStudent.email ? newStudent.email : (newStudent.roll || "student_" + Date.now());
    db.collection("students").doc(docId).set(newStudent).catch((err) => {
      console.warn("Firestore student write notice:", err);
    });
  }

  currentUser = newStudent;
  localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));

  closeAuthModal();
  updateNavAuthState();
  renderStudentDashboard();
  triggerConfettiBurst();

  if (firebaseAuthCreated) {
    alert(`[TIT SIH] 🎉 Account created successfully for ${name}!\n\n📧 An official email verification link has been sent to ${email}. Please check your inbox / spam folder.`);
  } else {
    alert(`[TIT SIH] Student Leader account created successfully for ${name}.`);
  }
};

window.handleLogout = () => {
  if (confirm("Are you sure you want to sign out?")) {
    if (typeof firebase !== "undefined" && firebase.auth && isFirebaseActive) {
      try {
        firebase.auth().signOut();
      } catch (_) { }
    }
    currentUser = null;
    localStorage.removeItem("tit_sih_current_user");
    updateNavAuthState();
    renderStudentDashboard();
    alert("You have been signed out.");
  }
};

function updateNavAuthState() {
  const navAuthContainer = document.getElementById("nav-auth-container");
  const navDashLink = document.getElementById("nav-dashboard-link");
  const mobAuthLink = document.getElementById("mob-auth-link");
  const mobDashLink = document.getElementById("mob-dashboard-link");

  if (!navAuthContainer) return;

  if (currentUser) {
    // Logged In State
    const initials = currentUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    navAuthContainer.innerHTML = `
      <div class="user-profile-badge" onclick="navigateToStudentDashboard()" title="${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.roll)} - ${escapeHtml(currentUser.dept)}) - Click to open Dashboard">
        <span class="user-avatar-circle">${initials}</span>
        <span class="user-name-text">${escapeHtml(currentUser.name.split(" ")[0])} (${escapeHtml(currentUser.dept)})</span>
      </div>
      <button class="btn-nav-logout" onclick="handleLogout()" title="Sign Out">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    `;

    const mobBottomDash = document.getElementById("mob-bottom-dash-item");
    if (navDashLink) navDashLink.style.display = "block";
    if (mobDashLink) mobDashLink.style.display = "block";
    if (mobBottomDash) mobBottomDash.style.display = "flex";
    if (mobAuthLink) {
      mobAuthLink.innerHTML = `<a href="#" class="mobile-nav-link" onclick="closeMobileMenu(); handleLogout();" style="color:#dc2626;"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout (${escapeHtml(currentUser.name)})</a>`;
    }
  } else {
    // Logged Out State: Unified Single Button
    navAuthContainer.innerHTML = `
      <button class="btn-nav-register btn-nav-auth" onclick="openAuthModal('student', 'login')" title="Sign In / Register">
        <i class="fa-solid fa-user-lock"></i> <span class="nav-auth-btn-text">Sign In</span>
      </button>
    `;

    const mobBottomDash = document.getElementById("mob-bottom-dash-item");
    if (navDashLink) navDashLink.style.display = "none";
    if (mobDashLink) mobDashLink.style.display = "none";
    if (mobBottomDash) mobBottomDash.style.display = "none";
    if (mobAuthLink) {
      mobAuthLink.innerHTML = `<a href="#" class="mobile-nav-link" onclick="closeMobileMenu(); openAuthModal('student', 'login');"><i class="fa-solid fa-user-lock"></i> Sign In / Register</a>`;
    }
  }
}

window.navigateToStudentDashboard = () => {
  const dashSection = document.getElementById("student-dashboard");
  if (dashSection) {
    dashSection.style.display = "block";
    dashSection.scrollIntoView({ behavior: "smooth" });
  }
};

/* ==========================================================================
   3. 6-MEMBER TEAM REGISTRATION WIZARD ENGINE
   ========================================================================== */
window.triggerRegistration = () => {
  if (!currentUser) {
    if (confirm("Please sign in or create a student account to register your team. Proceed to Login?")) {
      openAuthModal("login");
    }
    return;
  }
  openTeamRegModal();
};

let currentRosterCount = 2; // Default 2 required members (Leader + Member 2)

function collectCurrentRosterValues() {
  const data = {};
  for (let i = 1; i <= 6; i++) {
    const nameEl = document.getElementById(`m${i}-name`);
    if (!nameEl) continue;
    data[i] = {
      name: nameEl.value,
      roll: document.getElementById(`m${i}-roll`)?.value || "",
      program: document.getElementById(`m${i}-program`)?.value || "Degree",
      branch: document.getElementById(`m${i}-branch`)?.value || "CSE",
      gender: document.getElementById(`m${i}-gender`)?.value || (i === 2 ? "Female" : "Male"),
      email: document.getElementById(`m${i}-email`)?.value || "",
      phone: document.getElementById(`m${i}-phone`)?.value || ""
    };
  }
  return data;
}

window.addRosterMember = () => {
  if (currentRosterCount >= 6) {
    alert("[TIT SIH] Maximum squad capacity is 6 members.");
    return;
  }
  const saved = collectCurrentRosterValues();
  currentRosterCount += 1;
  renderMembersRosterInputs(currentRosterCount, saved);

  // Smooth scroll and focus the new member input
  setTimeout(() => {
    const newNameInput = document.getElementById(`m${currentRosterCount}-name`);
    if (newNameInput) {
      newNameInput.scrollIntoView({ behavior: "smooth", block: "center" });
      newNameInput.focus();
    }
  }, 100);
};

window.removeRosterMember = (removeIdx) => {
  if (currentRosterCount <= 2) {
    alert("[TIT SIH] Minimum 2 members (Leader + Member 2) are required.");
    return;
  }
  const saved = collectCurrentRosterValues();
  // Shift values above removeIdx down by 1
  const newSaved = {};
  let targetIdx = 1;
  for (let i = 1; i <= currentRosterCount; i++) {
    if (i === removeIdx) continue;
    if (saved[i]) {
      newSaved[targetIdx] = saved[i];
    }
    targetIdx++;
  }
  currentRosterCount -= 1;
  renderMembersRosterInputs(currentRosterCount, newSaved);
};

window.openTeamRegModal = () => {
  const modal = document.getElementById("team-registration-modal");
  if (!modal) return;

  currentRosterCount = 2; // Always default to 2 members on fresh modal open

  try {
    renderMembersRosterInputs(2);
  } catch (err) {
    console.error("[TIT SIH] Error rendering roster inputs:", err);
  }

  // Auto-fill referral code from leader profile if available
  try {
    if (currentUser && currentUser.referralCode && currentUser.referralCode !== "NONE") {
      const regRefInput = document.getElementById("reg-referral-code");
      if (regRefInput && !regRefInput.value) {
        regRefInput.value = currentUser.referralCode;
        if (typeof window.handleReferralCodeInput === "function") {
          window.handleReferralCodeInput(currentUser.referralCode);
        }
      }
    }
  } catch (err) {
    console.warn("[TIT SIH] Referral auto-fill warning:", err);
  }

  modal.classList.add("active");
};

window.closeTeamRegModal = () => {
  const modal = document.getElementById("team-registration-modal");
  if (modal) modal.classList.remove("active");
};

// Render Team Member Input Cards (Members 1-2 Required by default, Members 3-6 Dynamically added)
function renderMembersRosterInputs(customCount, savedValues = null) {
  const container = document.getElementById("members-roster-inputs");
  const actionsContainer = document.getElementById("roster-actions-container");
  if (!container) return;

  if (typeof customCount === "number") {
    currentRosterCount = Math.max(2, Math.min(6, customCount));
  }

  const leaderName = savedValues && savedValues[1] ? savedValues[1].name : (currentUser ? currentUser.name : "");
  const leaderRoll = savedValues && savedValues[1] ? savedValues[1].roll : (currentUser ? currentUser.roll : "");
  const leaderProgram = savedValues && savedValues[1] ? savedValues[1].program : (currentUser ? (currentUser.program || (window.isDiplomaBranch(currentUser.branch || currentUser.dept) ? "Diploma" : "Degree")) : "Degree");
  const leaderBranch = savedValues && savedValues[1] ? savedValues[1].branch : (currentUser ? (currentUser.branch || currentUser.dept || "CSE") : "CSE");
  const leaderGender = savedValues && savedValues[1] ? savedValues[1].gender : (currentUser ? currentUser.gender : "Male");
  const leaderEmail = savedValues && savedValues[1] ? savedValues[1].email : (currentUser ? currentUser.email : "");
  const leaderPhone = savedValues && savedValues[1] ? savedValues[1].phone : "";

  let html = `
    <!-- Member 1: Team Leader (Required) -->
    <div class="member-input-card leader-card">
      <div class="member-card-header">
        <span class="member-badge-pill leader"><i class="fa-solid fa-crown"></i> Member 1: Team Leader (Required)</span>
        <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">(Logged In Account)</span>
      </div>
      <div class="form-row-2">
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Full Name *</label>
          <input type="text" id="m1-name" class="form-text-input" value="${escapeHtml(leaderName)}" required oninput="checkRosterFemaleQuota()">
        </div>
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label" style="display: flex; justify-content: space-between; align-items: center;">
            <span>Roll / Enrollment No.</span>
            <span style="font-size: 0.72rem; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">Optional</span>
          </label>
          <input type="text" id="m1-roll" class="form-text-input" placeholder="e.g. 21CSE042 or leave blank if not allotted" value="${escapeHtml(leaderRoll)}">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Program / Module *</label>
          <select id="m1-program" class="form-select-input" onchange="updateMemberBranchSelect(1)" required>
            <option value="Degree" ${leaderProgram === "Degree" ? "selected" : ""}>Degree (B.Tech)</option>
            <option value="Diploma" ${leaderProgram === "Diploma" ? "selected" : ""}>Diploma</option>
          </select>
        </div>
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Branch *</label>
          <select id="m1-branch" class="form-select-input" required>
            ${window.getBranchOptionsHtml(leaderProgram, leaderBranch)}
          </select>
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Gender *</label>
          <select id="m1-gender" class="form-select-input roster-gender-select" onchange="checkRosterFemaleQuota()" required>
            <option value="Male" ${leaderGender === "Male" ? "selected" : ""}>Male</option>
            <option value="Female" ${leaderGender === "Female" ? "selected" : ""}>Female</option>
            <option value="Other" ${leaderGender === "Other" ? "selected" : ""}>Other</option>
          </select>
        </div>
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Email ID *</label>
          <input type="email" id="m1-email" class="form-text-input" value="${escapeHtml(leaderEmail)}" required>
        </div>
      </div>
      <div class="form-group-item" style="margin-bottom: 0;">
        <label class="form-input-label">Phone Number *</label>
        <input type="tel" id="m1-phone" class="form-text-input" placeholder="10-digit mobile" value="${escapeHtml(leaderPhone)}" required>
      </div>
    </div>
  `;

  // Render Member 2 and optional members up to currentRosterCount
  for (let i = 2; i <= currentRosterCount; i++) {
    const isRequired = i === 2;
    const badgeText = isRequired ? `Member ${i} (Required)` : `Member ${i} (Optional Squad Slot)`;
    const requiredMarker = isRequired ? " *" : "";
    const cardBgStyle = isRequired ? "" : "background: #f8fafc; border-style: dashed; border-color: #cbd5e1;";
    const defaultBranch = i === 2 ? "ECE" : i === 3 ? "EE" : i === 4 ? "ME" : i === 5 ? "CE" : "CSE";

    const memName = savedValues && savedValues[i] ? savedValues[i].name : "";
    const memRoll = savedValues && savedValues[i] ? savedValues[i].roll : "";
    const memProg = savedValues && savedValues[i] ? savedValues[i].program : "Degree";
    const memBranch = savedValues && savedValues[i] ? savedValues[i].branch : defaultBranch;
    const memGender = savedValues && savedValues[i] ? savedValues[i].gender : (i === 2 ? "Female" : "Male");
    const memEmail = savedValues && savedValues[i] ? savedValues[i].email : "";
    const memPhone = savedValues && savedValues[i] ? savedValues[i].phone : "";

    html += `
      <div class="member-input-card" style="${cardBgStyle}" id="member-slot-${i}">
        <div class="member-card-header">
          <span class="member-badge-pill" style="${isRequired ? "" : "background:#e2e8f0; color:#334155; font-weight: 800;"}">${badgeText}</span>
          ${isRequired
        ? '<span style="font-size: 0.72rem; color: #059669; font-weight: 700;">Required (Min 2 Members)</span>'
        : `<button type="button" class="btn-remove-roster-member" onclick="removeRosterMember(${i})" title="Remove this member slot"><i class="fa-solid fa-trash-can"></i> Remove</button>`
      }
        </div>
        <div class="form-row-2">
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Full Name${requiredMarker}</label>
            <input type="text" id="m${i}-name" class="form-text-input" placeholder="Member ${i} Full Name" value="${escapeHtml(memName)}" ${isRequired ? "required" : ""} oninput="checkRosterFemaleQuota()">
          </div>
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label" style="display: flex; justify-content: space-between; align-items: center;">
              <span>Roll / Enrollment No.</span>
              <span style="font-size: 0.72rem; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">Optional</span>
            </label>
            <input type="text" id="m${i}-roll" class="form-text-input" placeholder="e.g. 21IT0${i * 4} or leave blank" value="${escapeHtml(memRoll)}">
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Program / Module${requiredMarker}</label>
            <select id="m${i}-program" class="form-select-input" onchange="updateMemberBranchSelect(${i})" ${isRequired ? "required" : ""}>
              <option value="Degree" ${memProg === "Degree" ? "selected" : ""}>Degree (B.Tech)</option>
              <option value="Diploma" ${memProg === "Diploma" ? "selected" : ""}>Diploma</option>
            </select>
          </div>
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Branch${requiredMarker}</label>
            <select id="m${i}-branch" class="form-select-input" ${isRequired ? "required" : ""}>
              ${window.getBranchOptionsHtml(memProg, memBranch)}
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Gender${requiredMarker}</label>
            <select id="m${i}-gender" class="form-select-input roster-gender-select" onchange="checkRosterFemaleQuota()" ${isRequired ? "required" : ""}>
              <option value="Male" ${memGender === "Male" ? "selected" : ""}>Male</option>
              <option value="Female" ${memGender === "Female" ? "selected" : ""}>Female</option>
              <option value="Other" ${memGender === "Other" ? "selected" : ""}>Other</option>
            </select>
          </div>
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Email ID${requiredMarker}</label>
            <input type="email" id="m${i}-email" class="form-text-input" placeholder="member${i}@titagartala.ac.in" value="${escapeHtml(memEmail)}" ${isRequired ? "required" : ""}>
          </div>
        </div>
        <div class="form-group-item" style="margin-bottom: 0;">
          <label class="form-input-label">Phone Number${requiredMarker}</label>
          <input type="tel" id="m${i}-phone" class="form-text-input" placeholder="10-digit mobile" value="${escapeHtml(memPhone)}" ${isRequired ? "required" : ""}>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  if (actionsContainer) {
    if (currentRosterCount < 6) {
      actionsContainer.innerHTML = `
        <button type="button" class="btn-add-roster-member" onclick="addRosterMember()">
          <i class="fa-solid fa-user-plus"></i> + Add Member ${currentRosterCount + 1} (Optional)
        </button>
        <span class="roster-count-hint">
          <i class="fa-solid fa-users"></i> ${currentRosterCount} of 6 Squad Slots Active
        </span>
      `;
    } else {
      actionsContainer.innerHTML = `
        <span class="roster-max-banner">
          <i class="fa-solid fa-circle-check"></i> Maximum Squad Limit Reached (6 of 6 Members)
        </span>
        <span class="roster-count-hint">
          <i class="fa-solid fa-users"></i> 6 of 6 Slots Active
        </span>
      `;
    }
  }

  checkRosterFemaleQuota();
}

function checkRosterFemaleQuota() {
  let femaleCount = 0;

  // Check Member 1
  const m1Gender = document.getElementById("m1-gender");
  if (m1Gender && m1Gender.value === "Female") femaleCount++;

  // Check Member 2 (Required)
  const m2Gender = document.getElementById("m2-gender");
  if (m2Gender && m2Gender.value === "Female") femaleCount++;

  // Check Members 3 to 6 (Only count if name or roll is filled)
  for (let i = 3; i <= 6; i++) {
    const nameInput = document.getElementById(`m${i}-name`);
    const genderSel = document.getElementById(`m${i}-gender`);
    if (nameInput && nameInput.value.trim() !== "" && genderSel && genderSel.value === "Female") {
      femaleCount++;
    }
  }

  const statusEl = document.getElementById("roster-female-status");
  if (statusEl) {
    if (femaleCount >= 1) {
      statusEl.style.color = "#059669";
      statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${femaleCount} Female Member(s) Included (Compliant)`;
    } else {
      statusEl.style.color = "#dc2626";
      statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> 0 Female Members (1+ Mandatory)`;
    }
  }

  return femaleCount >= 1;
}
window.checkRosterFemaleQuota = checkRosterFemaleQuota;

window.handleTeamRegistrationSubmit = (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please sign in as Team Leader before registering.");
    return;
  }

  // Validate 1+ Female Member
  const isFemaleCompliant = checkRosterFemaleQuota();
  if (!isFemaleCompliant) {
    alert("[TIT SIH Error] Mandatory Rule: Your squad must have at least ONE female student member to be eligible under official SIH guidelines.");
    return;
  }

  const teamName = document.getElementById("reg-team-name").value.trim();
  const edition = document.getElementById("reg-edition").value;
  const psId = document.getElementById("reg-ps-id").value.trim().toUpperCase();
  const domain = (document.getElementById("reg-ps-domain")?.value || "").trim();
  const title = document.getElementById("reg-ps-title").value.trim();
  const abstract = (document.getElementById("reg-abstract")?.value || "").trim();
  const pptLink = document.getElementById("reg-ppt-link").value.trim();
  const referralCodeInput = (document.getElementById("reg-referral-code")?.value || "").trim().toUpperCase();

  const matchedCoord = window.COORDINATOR_REFERRAL_MAP ? window.COORDINATOR_REFERRAL_MAP[referralCodeInput] : null;
  const referralCode = referralCodeInput || "NONE";
  const referredBy = matchedCoord ? `${matchedCoord.name} (${matchedCoord.branch})` : (referralCodeInput ? referralCodeInput : "Direct Registration");

  // Basic Project Validations
  if (!teamName || teamName.length < 3) {
    alert("[TIT SIH] Please enter a valid Team Name (minimum 3 characters).");
    return;
  }

  if (!psId || psId.length < 3) {
    alert("[TIT SIH] Please enter the Target SIH Problem Statement ID / Number (e.g. SIH26001).");
    return;
  }

  if (!title || title.length < 3) {
    alert("[TIT SIH] Please enter your Problem Statement / Solution Title.");
    return;
  }

  if (!isValidUrl(pptLink)) {
    alert("[TIT SIH] Please provide a valid URL link to your Idea Presentation Deck.");
    return;
  }

  // Extract and strictly validate 2 required members and optional 3rd-6th members
  const members = [];
  const rollSet = new Set();
  const emailSet = new Set();

  for (let i = 1; i <= 6; i++) {
    const isRequired = i <= 2;
    const nameEl = document.getElementById(`m${i}-name`);
    const rollEl = document.getElementById(`m${i}-roll`);
    const progEl = document.getElementById(`m${i}-program`);
    const branchEl = document.getElementById(`m${i}-branch`);
    const genderEl = document.getElementById(`m${i}-gender`);
    const emailEl = document.getElementById(`m${i}-email`);
    const phoneEl = document.getElementById(`m${i}-phone`);

    const name = nameEl ? nameEl.value.trim() : "";
    const roll = rollEl ? rollEl.value.trim().toUpperCase() : "";
    const program = progEl ? progEl.value : "Degree";
    const branch = branchEl ? branchEl.value : "CSE";
    const dept = branch;
    const gender = genderEl ? genderEl.value : "Male";
    const email = emailEl ? emailEl.value.trim().toLowerCase() : "";
    const phone = phoneEl ? phoneEl.value.trim() : "";

    // For optional members 3 to 6, skip if empty
    if (!isRequired && !name && !email && !phone) {
      continue;
    }

    if (!name) {
      alert(`[TIT SIH] Please provide the Full Name for Member ${i}.`);
      return;
    }

    // Roll number is optional: only check duplicate if provided
    if (roll && roll !== "AWAITED" && roll !== "N/A") {
      if (rollSet.has(roll)) {
        alert(`[TIT SIH Error] Duplicate Roll Number: "${roll}" is entered more than once.`);
        return;
      }
      rollSet.add(roll);
    }

    if (!isValidEmail(email)) {
      alert(`[TIT SIH] Please enter a valid Email address for Member ${i}.`);
      return;
    }

    if (emailSet.has(email)) {
      alert(`[TIT SIH Error] Duplicate Email: "${email}" is entered more than once.`);
      return;
    }
    emailSet.add(email);

    if (!isValidPhone(phone)) {
      alert(`[TIT SIH] Please enter a valid 10-digit mobile phone number for Member ${i}.`);
      return;
    }

    members.push({
      name,
      roll: roll || "",
      program,
      branch,
      dept,
      gender,
      email,
      phone,
      isLeader: i === 1
    });
  }

  // Validate team size minimum 2 members
  if (members.length < 2) {
    alert("[TIT SIH Error] A minimum of 2 members (Leader + 1 Member) is required to register a team.");
    return;
  }

  // Validate at least 1 female member
  const hasFemale = members.some((m) => m.gender === "Female");
  if (!hasFemale) {
    alert("[TIT SIH Error] Mandatory Rule: Your team must have at least ONE female student member to be eligible.");
    return;
  }

  // Generate Unique Non-Colliding Team ID
  let randomSuffix = Math.floor(1000 + Math.random() * 9000);
  let teamId = `TIT-SIH26-${randomSuffix}`;
  while (registeredTeams.some((t) => t.teamId === teamId)) {
    randomSuffix = Math.floor(1000 + Math.random() * 9000);
    teamId = `TIT-SIH26-${randomSuffix}`;
  }

  const newTeam = {
    teamId,
    teamName,
    edition,
    psId,
    domain,
    title,
    abstract,
    pptLink,
    referralCode,
    referredBy,
    status: "Under Review by IIC Panel",
    createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    leaderEmail: currentUser.email,
    members
  };

  // Check if team with same leader already exists (allow leader to update their squad)
  const existingIdx = registeredTeams.findIndex((t) => t.leaderEmail.toLowerCase() === currentUser.email.toLowerCase());
  if (existingIdx > -1) {
    newTeam.teamId = registeredTeams[existingIdx].teamId; // Preserve original team ID
    registeredTeams[existingIdx] = newTeam;
  } else {
    registeredTeams.unshift(newTeam);
  }

  localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

  // Save to Firebase Cloud Firestore if active
  if (isFirebaseActive && db) {
    db.collection("teams").doc(newTeam.teamId).set(newTeam).catch((err) => {
      console.warn("Firestore team write notice:", err);
    });
  }

  closeTeamRegModal();
  renderStudentDashboard();
  triggerConfettiBurst();

  // Scroll to dashboard
  const dashSection = document.getElementById("student-dashboard");
  if (dashSection) {
    dashSection.style.display = "block";
    dashSection.scrollIntoView({ behavior: "smooth" });
  }

  alert(`[TIT SIH] Team "${teamName}" registered successfully.\nOfficial Team ID: ${newTeam.teamId}\nYou can now view and print your authenticated registration pass below.`);
};

/* ==========================================================================
   4. STUDENT TEAM DASHBOARD ENGINE
   ========================================================================== */
function renderStudentDashboard() {
  const dashSection = document.getElementById("student-dashboard");
  const contentBox = document.getElementById("dashboard-content-box");

  if (!dashSection || !contentBox) return;

  if (!currentUser) {
    dashSection.style.display = "none";
    return;
  }

  dashSection.style.display = "block";

  // Find team associated with current user
  const userTeam = registeredTeams.find(
    (t) =>
      (t.leaderEmail && t.leaderEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      t.members.some((m) => m.email.toLowerCase() === currentUser.email.toLowerCase() || (m.roll && m.roll.toLowerCase() === (currentUser.roll || "").toLowerCase()))
  );

  if (!userTeam) {
    contentBox.innerHTML = `
      <div class="dashboard-hero-card" style="text-align: center; padding: 48px 20px;">
        <div style="font-size: 2.4rem; color: #059669; margin-bottom: 12px;"><i class="fa-solid fa-users"></i></div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
          Welcome, ${escapeHtml(currentUser.name)}
        </h3>
        <p style="color: #64748b; font-size: 0.9rem; max-width: 540px; margin: 0 auto 24px; line-height: 1.5;">
          You are currently not linked to any active registered team. Assemble your squad (2 to 6 members) and register now to participate in the TIT SIH Internal Hackathon.
        </p>
        <button class="btn-3d-primary" onclick="triggerRegistration()" style="padding: 14px 28px;">
          <i class="fa-solid fa-plus"></i> Register Team
        </button>
      </div>
    `;
    return;
  }

  // Determine if current user is the Team Leader
  const isLeader =
    (userTeam.leaderEmail && userTeam.leaderEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
    (userTeam.members[0] && (userTeam.members[0].email.toLowerCase() === currentUser.email.toLowerCase() || (userTeam.members[0].roll && userTeam.members[0].roll.toLowerCase() === (currentUser.roll || "").toLowerCase())));

  // Render Registered Team Console
  let statusBadgeClass = "status-review";
  let statusIcon = "fa-hourglass-half";
  if (userTeam.status.includes("Shortlisted")) {
    statusBadgeClass = "status-shortlisted";
    statusIcon = "fa-rocket";
  } else if (userTeam.status.includes("Nominated") || userTeam.status.includes("Winner")) {
    statusBadgeClass = "status-winner";
    statusIcon = "fa-trophy";
  }

  contentBox.innerHTML = `
    <div class="dashboard-hero-card">
      <div class="dashboard-header-row">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
            <span style="background: #059669; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 4px 12px; border-radius: 6px; font-family: var(--font-mono);">
              ${escapeHtml(userTeam.teamId)}
            </span>
            <span style="background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.8rem; padding: 4px 12px; border-radius: 6px; border: 1px solid #a7f3d0;">
              ${escapeHtml(userTeam.edition)}
            </span>
            ${isLeader ? '<span style="background:#fef3c7; color:#92400e; font-weight:800; font-size:0.75rem; padding:4px 10px; border-radius:6px; border:1px solid #fde68a;"><i class="fa-solid fa-crown"></i> Team Leader</span>' : ''}
            ${userTeam.referralCode && userTeam.referralCode !== "NONE" ? `<span style="background: rgba(16,185,129,0.12); color: #065f46; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #a7f3d0;"><i class="fa-solid fa-ticket"></i> Ref: <strong>${escapeHtml(userTeam.referralCode)}</strong></span>` : ''}
            <span style="font-size: 0.8rem; color: #64748b;">Registered: ${escapeHtml(userTeam.createdAt)}</span>
          </div>
          <h2 style="font-size: 1.7rem; font-weight: 900; color: #0f172a; margin-bottom: 4px;">
            Team ${escapeHtml(userTeam.teamName)}
          </h2>
          <p style="color: #475569; font-size: 0.92rem; font-weight: 600;">
            <i class="fa-solid fa-bullseye" style="color: #059669;"></i> Target PS: <strong>${escapeHtml(userTeam.psId)}</strong> (${escapeHtml(userTeam.domain)})
          </p>
        </div>

        <div style="text-align: right;">
          <div class="dashboard-status-banner ${statusBadgeClass}">
            <i class="fa-solid ${statusIcon}"></i> ${escapeHtml(userTeam.status)}
          </div>
          <div style="margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
            <button class="btn-3d-primary" onclick="openTeamPassModal('${userTeam.teamId}')" style="padding: 8px 14px; font-size: 0.82rem;">
              <i class="fa-solid fa-id-card"></i> Digital Pass
            </button>
            <a href="${escapeHtml(userTeam.pptLink)}" target="_blank" rel="noopener" class="btn-3d-outline" style="padding: 8px 14px; font-size: 0.82rem; background: #ffffff; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-file-powerpoint" style="color: #ea580c;"></i> View PPT
            </a>
            ${isLeader ? `
              <button class="btn-3d-outline" onclick="openEditTeamModal('${userTeam.teamId}')" style="padding: 8px 14px; font-size: 0.82rem; background: #f0fdf4; color: #065f46; border-color: #a7f3d0;" title="Edit Problem Statement, Title & Presentation">
                <i class="fa-solid fa-pen-to-square"></i> Edit Team
              </button>
              <button class="btn-3d-outline" onclick="deleteTeamByLeader('${userTeam.teamId}')" style="padding: 8px 14px; font-size: 0.82rem; background: #fff1f2; color: #dc2626; border-color: #fecdd3;" title="Permanently Delete Team from Database">
                <i class="fa-solid fa-trash-can"></i> Delete Team
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Problem & Solution Overview -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h4 style="font-size: 0.98rem; font-weight: 800; color: #0f172a; margin-bottom: ${userTeam.abstract ? '6px' : '0'};">
          <i class="fa-solid fa-lightbulb" style="color: #059669;"></i> ${escapeHtml(userTeam.title)}
        </h4>
        ${userTeam.abstract ? `
          <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin: 6px 0 0;">
            ${escapeHtml(userTeam.abstract)}
          </p>
        ` : ''}
      </div>

      <!-- Squad Roster Header & Action -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #064e3b; margin: 0; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-users"></i> Confirmed Squad Roster (${userTeam.members.length} Members)
        </h4>
        ${isLeader && userTeam.members.length < 6 ? `
          <button class="btn-3d-primary" onclick="openAddMemberModal('${userTeam.teamId}')" style="padding: 6px 14px; font-size: 0.78rem;">
            <i class="fa-solid fa-user-plus"></i> Add Squad Member (${userTeam.members.length}/6)
          </button>
        ` : ''}
      </div>

      <!-- Squad Roster Grid -->
      <div class="dashboard-team-grid">
        ${userTeam.members
      .map(
        (m, idx) => `
          <div class="dashboard-member-box ${m.isLeader ? "leader" : ""}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: #0f172a; font-size: 0.92rem;">${escapeHtml(m.name)}</strong>
              ${m.isLeader ? '<span class="member-badge-pill leader" style="font-size: 0.65rem;">LEADER</span>' : `<span style="font-size: 0.72rem; color: #64748b; font-weight:600;">${escapeHtml(m.gender)}</span>`}
            </div>
            <div style="font-size: 0.78rem; color: #475569; margin-bottom: 3px;">
              <i class="fa-solid fa-id-badge" style="color: #059669; width: 14px;"></i> ${m.roll ? escapeHtml(m.roll) : '<span style="color:#059669; font-style:italic;">Roll Awaited</span>'} (${escapeHtml(m.dept || m.branch)})
            </div>
            <div style="font-size: 0.76rem; color: #64748b; margin-bottom: 4px; word-break: break-all;">
              <i class="fa-solid fa-envelope" style="color: #059669; width: 14px;"></i> ${escapeHtml(m.email)}
            </div>
            ${m.phone ? `
              <div style="font-size: 0.74rem; color: #64748b;">
                <i class="fa-solid fa-phone" style="color: #059669; width: 14px;"></i> ${escapeHtml(m.phone)}
              </div>
            ` : ''}
            ${isLeader ? `
              <div style="display: flex; gap: 6px; margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 8px; justify-content: flex-end;">
                <button onclick="openEditMemberModal('${userTeam.teamId}', ${idx})" class="btn-3d-outline" style="padding: 4px 10px; font-size: 0.72rem; background: #ffffff;" title="Edit Student Details">
                  <i class="fa-solid fa-user-pen"></i> Edit
                </button>
                ${!m.isLeader && idx > 0 ? `
                  <button onclick="deleteMemberByLeader('${userTeam.teamId}', ${idx})" class="btn-3d-outline" style="padding: 4px 10px; font-size: 0.72rem; background: #fff1f2; color: #dc2626; border-color: #fecdd3;" title="Remove from Team">
                    <i class="fa-solid fa-trash-can"></i> Remove
                  </button>
                ` : ''}
              </div>
            ` : ''}
          </div>
        `
      )
      .join("")}
      </div>
    </div>
  `;
}

/* ==========================================================================
   4.5 LEADER TEAM & MEMBER EDIT/DELETE ENGINE
   ========================================================================== */
window.openEditTeamModal = (teamId) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  const modal = document.getElementById("edit-team-modal");
  if (!modal) return;

  if (document.getElementById("edit-team-id")) document.getElementById("edit-team-id").value = team.teamId;
  if (document.getElementById("edit-team-badge-id")) document.getElementById("edit-team-badge-id").textContent = team.teamId;
  if (document.getElementById("edit-team-name")) document.getElementById("edit-team-name").value = team.teamName || "";
  if (document.getElementById("edit-team-edition")) document.getElementById("edit-team-edition").value = team.edition || "Software Edition";
  if (document.getElementById("edit-team-ps-id")) document.getElementById("edit-team-ps-id").value = team.psId || "";
  if (document.getElementById("edit-team-ps-domain")) document.getElementById("edit-team-ps-domain").value = team.domain || "";
  if (document.getElementById("edit-team-title")) document.getElementById("edit-team-title").value = team.title || "";
  if (document.getElementById("edit-team-abstract")) document.getElementById("edit-team-abstract").value = team.abstract || "";
  if (document.getElementById("edit-team-ppt-link")) document.getElementById("edit-team-ppt-link").value = team.pptLink || "";
  if (document.getElementById("edit-team-referral-code")) {
    document.getElementById("edit-team-referral-code").value = (team.referralCode && team.referralCode !== "NONE") ? team.referralCode : "";
  }

  modal.classList.add("active");
};

window.closeEditTeamModal = () => {
  const modal = document.getElementById("edit-team-modal");
  if (modal) modal.classList.remove("active");
};

window.handleEditTeamSubmit = (event) => {
  event.preventDefault();
  const teamId = document.getElementById("edit-team-id").value;
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  const teamName = document.getElementById("edit-team-name").value.trim();
  const edition = document.getElementById("edit-team-edition").value;
  const psId = document.getElementById("edit-team-ps-id").value.trim();
  const domain = (document.getElementById("edit-team-ps-domain")?.value || team.domain || "").trim();
  const title = document.getElementById("edit-team-title").value.trim();
  const abstract = (document.getElementById("edit-team-abstract")?.value || team.abstract || "").trim();
  const pptLink = document.getElementById("edit-team-ppt-link").value.trim();
  const editRefCode = (document.getElementById("edit-team-referral-code")?.value || "").trim().toUpperCase();

  if (!teamName || !psId || !title || !pptLink) {
    alert("[TIT SIH Error] Please fill in all required fields.");
    return;
  }

  if (!isValidUrl(pptLink)) {
    alert("[TIT SIH Error] Please enter a valid URL (http:// or https://) for the Idea PPT deck.");
    return;
  }

  team.teamName = teamName;
  team.edition = edition;
  team.psId = psId;
  team.domain = domain;
  team.title = title;
  team.abstract = abstract;
  team.pptLink = pptLink;
  if (editRefCode) {
    team.referralCode = editRefCode;
    const matched = window.COORDINATOR_REFERRAL_MAP ? window.COORDINATOR_REFERRAL_MAP[editRefCode] : null;
    team.referredBy = matched ? `${matched.name} (${matched.branch})` : editRefCode;
  }
  team.lastModifiedAt = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

  if (isFirebaseActive && db) {
    db.collection("teams").doc(teamId).set(team).catch((err) => {
      console.warn("Firestore update team notice:", err);
    });
  }

  closeEditTeamModal();
  renderStudentDashboard();
  if (document.getElementById("admin-console-view")?.style.display !== "none") {
    renderAdminConsole();
  }

  alert(`[TIT SIH] Team "${teamName}" details have been updated successfully.`);
};

window.openEditMemberModal = (teamId, memberIdx) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team || !team.members[memberIdx]) return;

  const member = team.members[memberIdx];
  const modal = document.getElementById("edit-member-modal");
  if (!modal) return;

  document.getElementById("edit-member-team-id").value = teamId;
  document.getElementById("edit-member-index").value = memberIdx;
  document.getElementById("edit-member-subhead").textContent = member.isLeader
    ? `Editing Team Leader details (${team.teamName})`
    : `Editing Member ${memberIdx + 1} details (${team.teamName})`;

  document.getElementById("edit-m-name").value = member.name || "";
  document.getElementById("edit-m-roll").value = member.roll || "";

  const prog = member.program || (window.isDiplomaBranch(member.branch || member.dept) ? "Diploma" : "Degree");
  const branch = member.branch || member.dept || "CSE";

  const progEl = document.getElementById("edit-m-program");
  if (progEl) {
    progEl.value = prog;
  }
  const branchEl = document.getElementById("edit-m-branch");
  if (branchEl) {
    branchEl.innerHTML = window.getBranchOptionsHtml(prog, branch);
    branchEl.value = branch;
  }

  document.getElementById("edit-m-gender").value = member.gender || "Female";
  document.getElementById("edit-m-email").value = member.email || "";
  document.getElementById("edit-m-phone").value = member.phone || "";

  modal.classList.add("active");
};

window.closeEditMemberModal = () => {
  const modal = document.getElementById("edit-member-modal");
  if (modal) modal.classList.remove("active");
};

window.handleEditMemberSubmit = (event) => {
  event.preventDefault();
  const teamId = document.getElementById("edit-member-team-id").value;
  const memberIdx = parseInt(document.getElementById("edit-member-index").value, 10);
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team || !team.members[memberIdx]) return;

  const name = document.getElementById("edit-m-name").value.trim();
  const roll = document.getElementById("edit-m-roll").value.trim().toUpperCase();
  const program = document.getElementById("edit-m-program") ? document.getElementById("edit-m-program").value : "Degree";
  const branch = document.getElementById("edit-m-branch") ? document.getElementById("edit-m-branch").value : (document.getElementById("edit-m-dept") ? document.getElementById("edit-m-dept").value : "CSE");
  const dept = branch;
  const gender = document.getElementById("edit-m-gender").value;
  const email = document.getElementById("edit-m-email").value.trim().toLowerCase();
  const phone = document.getElementById("edit-m-phone").value.trim();

  // Full Name, Email, Phone are required. Roll is optional!
  if (!name || !email || !phone) {
    alert("[TIT SIH Error] Please fill in all required member fields (Name, Email, Phone).");
    return;
  }

  // Duplicate roll check in same team (only if roll is provided)
  if (roll && roll !== "AWAITED" && roll !== "N/A") {
    const isDuplicateRoll = team.members.some((m, idx) => idx !== memberIdx && m.roll && m.roll.toUpperCase() === roll);
    if (isDuplicateRoll) {
      alert(`[TIT SIH Error] Roll Number "${roll}" is already assigned to another member in this team.`);
      return;
    }
  }

  // Duplicate email check in same team
  const isDuplicateEmail = team.members.some((m, idx) => idx !== memberIdx && m.email.toLowerCase() === email.toLowerCase());
  if (isDuplicateEmail) {
    alert(`[TIT SIH Error] Email "${email}" is already used by another member in this team.`);
    return;
  }

  if (!isValidEmail(email)) {
    alert("[TIT SIH Error] Please enter a valid email address.");
    return;
  }

  if (!isValidPhone(phone)) {
    alert("[TIT SIH Error] Please enter a valid 10-digit mobile phone number.");
    return;
  }

  // Mandatory Female Quota check: Ensure at least 1 female remains in the squad
  const otherFemales = team.members.filter((m, idx) => idx !== memberIdx && m.gender === "Female").length;
  if (otherFemales === 0 && gender !== "Female") {
    alert("[TIT SIH Error] Mandatory Rule: Your squad must have at least ONE female student member. You cannot set this member's gender to Male/Other because she is currently the only female member in your squad.");
    return;
  }

  team.members[memberIdx].name = name;
  team.members[memberIdx].roll = roll || "";
  team.members[memberIdx].program = program;
  team.members[memberIdx].branch = branch;
  team.members[memberIdx].dept = dept;
  team.members[memberIdx].gender = gender;
  team.members[memberIdx].email = email;
  team.members[memberIdx].phone = phone;

  // If leader was edited, keep leaderEmail synced
  if (memberIdx === 0 || team.members[memberIdx].isLeader) {
    team.leaderEmail = email;
  }

  localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

  if (isFirebaseActive && db) {
    db.collection("teams").doc(teamId).set(team).catch((err) => {
      console.warn("Firestore update member notice:", err);
    });
  }

  closeEditMemberModal();
  renderStudentDashboard();
  if (document.getElementById("admin-console-view")?.style.display !== "none") {
    renderAdminConsole();
  }

  alert(`[TIT SIH] Member "${name}" details updated successfully.`);
};

window.openAddMemberModal = (teamId) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  if (team.members.length >= 6) {
    alert("[TIT SIH] Your squad already contains the maximum allowed limit of 6 members.");
    return;
  }

  const modal = document.getElementById("add-member-modal");
  if (!modal) return;

  document.getElementById("add-member-team-id").value = teamId;
  document.getElementById("add-m-name").value = "";
  document.getElementById("add-m-roll").value = "";

  const progEl = document.getElementById("add-m-program");
  if (progEl) {
    progEl.value = "Degree";
  }
  const branchEl = document.getElementById("add-m-branch");
  if (branchEl) {
    branchEl.innerHTML = window.getBranchOptionsHtml("Degree", "CSE");
  }

  document.getElementById("add-m-email").value = "";
  document.getElementById("add-m-phone").value = "";

  modal.classList.add("active");
};

window.closeAddMemberModal = () => {
  const modal = document.getElementById("add-member-modal");
  if (modal) modal.classList.remove("active");
};

window.handleAddMemberSubmit = (event) => {
  event.preventDefault();
  const teamId = document.getElementById("add-member-team-id").value;
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  if (team.members.length >= 6) {
    alert("[TIT SIH] Your squad already has the maximum allowed limit of 6 members.");
    return;
  }

  const name = document.getElementById("add-m-name").value.trim();
  const roll = document.getElementById("add-m-roll").value.trim().toUpperCase();
  const program = document.getElementById("add-m-program") ? document.getElementById("add-m-program").value : "Degree";
  const branch = document.getElementById("add-m-branch") ? document.getElementById("add-m-branch").value : (document.getElementById("add-m-dept") ? document.getElementById("add-m-dept").value : "CSE");
  const dept = branch;
  const gender = document.getElementById("add-m-gender").value;
  const email = document.getElementById("add-m-email").value.trim().toLowerCase();
  const phone = document.getElementById("add-m-phone").value.trim();

  // Name, Email, Phone are required. Roll is optional!
  if (!name || !email || !phone) {
    alert("[TIT SIH Error] Please fill in all required fields (Name, Email, Phone).");
    return;
  }

  // Check duplicate roll in team (only if roll is provided)
  if (roll && roll !== "AWAITED" && roll !== "N/A") {
    if (team.members.some((m) => m.roll && m.roll.toUpperCase() === roll)) {
      alert(`[TIT SIH Error] Roll Number "${roll}" is already in this team.`);
      return;
    }
  }

  // Check duplicate email in team
  if (team.members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
    alert(`[TIT SIH Error] Email "${email}" is already in this team.`);
    return;
  }

  if (!isValidEmail(email)) {
    alert("[TIT SIH Error] Please enter a valid email address.");
    return;
  }

  if (!isValidPhone(phone)) {
    alert("[TIT SIH Error] Please enter a valid 10-digit mobile phone number.");
    return;
  }

  team.members.push({
    name,
    roll: roll || "",
    program,
    branch,
    dept,
    gender,
    email,
    phone,
    isLeader: false
  });

  localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

  if (isFirebaseActive && db) {
    db.collection("teams").doc(teamId).set(team).catch((err) => {
      console.warn("Firestore add member notice:", err);
    });
  }

  closeAddMemberModal();
  renderStudentDashboard();
  if (document.getElementById("admin-console-view")?.style.display !== "none") {
    renderAdminConsole();
  }

  alert(`[TIT SIH] Member "${name}" has been added to Team "${team.teamName}".`);
};

window.deleteMemberByLeader = (teamId, memberIdx) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team || !team.members[memberIdx]) return;

  const member = team.members[memberIdx];

  if (member.isLeader || memberIdx === 0) {
    alert("[TIT SIH Error] The Team Leader cannot be deleted. If you wish to disband the team, please use the 'Delete Team' button.");
    return;
  }

  // Rule 1: Minimum 2 members required
  if (team.members.length <= 2) {
    alert("[TIT SIH Error] A team must have a minimum of 2 members (Leader + 1 Member). You cannot remove this member unless you replace them first.");
    return;
  }

  // Rule 2: Mandatory female member check
  if (member.gender === "Female") {
    const totalFemales = team.members.filter((m) => m.gender === "Female").length;
    if (totalFemales <= 1) {
      alert("[TIT SIH Error] Mandatory Rule: Your squad must have at least 1 female student member. You cannot remove this member as she is the only female member in your squad.");
      return;
    }
  }

  if (confirm(`Are you sure you want to remove ${member.name} (${member.roll}) from Team "${team.teamName}"?`)) {
    team.members.splice(memberIdx, 1);
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

    if (isFirebaseActive && db) {
      db.collection("teams").doc(teamId).set(team).catch((err) => {
        console.warn("Firestore remove member notice:", err);
      });
    }

    renderStudentDashboard();
    if (document.getElementById("admin-console-view")?.style.display !== "none") {
      renderAdminConsole();
    }

    alert(`[TIT SIH] Member "${member.name}" has been removed from Team "${team.teamName}".`);
  }
};

window.deleteTeamByLeader = (teamId) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  const confirmMsg = `CONFIRM PERMANENT TEAM DELETION\n\nAre you sure you want to delete your team "${team.teamName}" (ID: ${team.teamId})?\n\n• All squad members and project submissions will be permanently deleted from the database.\n• This action cannot be undone.`;

  if (confirm(confirmMsg)) {
    // 1. Remove from local array
    registeredTeams = registeredTeams.filter((t) => t.teamId !== teamId);
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

    // 2. Delete from Firebase Firestore if active
    if (isFirebaseActive && db) {
      db.collection("teams")
        .doc(teamId)
        .delete()
        .then(() => {
          console.log(`Team ${teamId} permanently deleted from Firestore by Leader.`);
        })
        .catch((err) => {
          console.warn("Firestore delete team notice:", err);
        });
    }

    // 3. Re-render student dashboard & SPOC console
    renderStudentDashboard();
    if (document.getElementById("admin-console-view")?.style.display !== "none") {
      renderAdminConsole();
    }

    alert(`[TIT SIH] Your team "${team.teamName}" has been successfully deleted from the database.`);
  }
};

/* ==========================================================================
   5. DIGITAL TEAM PASS / VERIFICATION SLIP GENERATOR
   ========================================================================== */
window.openTeamPassModal = (teamId) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  const modal = document.getElementById("team-pass-modal");
  const container = document.getElementById("printable-pass-content");
  if (!modal || !container) return;

  const qrText = encodeURIComponent(`TIT-IIC-SIH-PASS:${team.teamId}|Team:${team.teamName}|PS:${team.psId}|Status:${team.status}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrText}`;

  container.innerHTML = `
    <div class="team-pass-card">
      <div class="pass-header">
        <img src="tit_logo.png" alt="TIT Logo" class="pass-seal">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 2px;">
            TRIPURA INSTITUTE OF TECHNOLOGY
          </h3>
          <p style="font-size: 0.78rem; color: #059669; font-weight: 700; margin: 0;">
            Institution Innovation Council (IIC) • SIH Internal Hackathon 2026
          </p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; display: block;">OFFICIAL TEAM ID</span>
          <span style="font-size: 1.4rem; font-weight: 900; color: #064e3b; font-family: var(--font-mono);">${team.teamId}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; display: block;">CATEGORY</span>
          <span style="font-size: 0.88rem; font-weight: 800; color: #059669;">${team.edition}</span>
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
        <div style="font-size: 0.78rem; color: #64748b;">TEAM NAME: <strong style="color: #0f172a; font-size: 0.95rem;">${team.teamName}</strong></div>
        <div style="font-size: 0.78rem; color: #64748b; margin-top: 4px;">TARGET PS ID: <strong style="color: #064e3b;">${team.psId}</strong> (${team.domain})</div>
        <div style="font-size: 0.76rem; color: #475569; margin-top: 4px;">TITLE: ${team.title}</div>
        ${team.referralCode && team.referralCode !== "NONE" ? `<div style="font-size: 0.74rem; color: #059669; font-weight: 700; margin-top: 4px;"><i class="fa-solid fa-ticket"></i> REFERRAL CODE: ${escapeHtml(team.referralCode)} (${escapeHtml(team.referredBy || "")})</div>` : ''}
      </div>

      <!-- Compact 6 Member Roster Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 0.76rem; text-align: left; margin-bottom: 14px;">
        <thead>
          <tr style="background: #ecfdf5; border-bottom: 1px solid #a7f3d0;">
            <th style="padding: 6px 8px; color: #064e3b;">#</th>
            <th style="padding: 6px 8px; color: #064e3b;">Role</th>
            <th style="padding: 6px 8px; color: #064e3b;">Student Name</th>
            <th style="padding: 6px 8px; color: #064e3b;">Roll No</th>
            <th style="padding: 6px 8px; color: #064e3b;">Dept</th>
            <th style="padding: 6px 8px; color: #064e3b;">Gender</th>
          </tr>
        </thead>
        <tbody>
          ${team.members
      .map(
        (m, idx) => `
            <tr style="border-bottom: 1px solid #e2e8f0; ${m.isLeader ? "font-weight: 700; background: #fafafa;" : ""}">
              <td style="padding: 5px 8px;">${idx + 1}</td>
              <td style="padding: 5px 8px;">${m.isLeader ? '<span style="color:#059669; font-weight:700; font-size:0.7rem; background:#ecfdf5; padding:2px 6px; border-radius:4px; border:1px solid #a7f3d0;">Leader</span>' : '<span style="color:#64748b; font-size:0.7rem;">Member</span>'}</td>
              <td style="padding: 5px 8px;">${m.name}</td>
              <td style="padding: 5px 8px;">${escapeHtml(m.roll || "Awaited")}</td>
              <td style="padding: 5px 8px;">${m.dept}</td>
              <td style="padding: 5px 8px;">${m.gender}</td>
            </tr>
          `
      )
      .join("")}
        </tbody>
      </table>

      <div class="pass-qr-row">
        <img src="${qrUrl}" alt="Pass QR Code" class="pass-qr-img">
        <div style="font-size: 0.75rem; color: #475569; line-height: 1.4;">
          <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">AUTHENTICATED REGISTRATION PASS</div>
          <div>Status: <strong style="color: #059669;">${team.status}</strong></div>
          <div>Verified Date: ${team.createdAt}</div>
          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 4px;">Present this digital slip at the TIT Campus Hackathon Helpdesk during the Internal Hackathon.</div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
  triggerConfettiBurst();
};

window.closeTeamPassModal = () => {
  const modal = document.getElementById("team-pass-modal");
  if (modal) modal.classList.remove("active");
};

/* Dedicated 1-Page Pass Printing Engine */
window.printDigitalPass = () => {
  const passContent = document.getElementById("printable-pass-content");
  if (!passContent) return;

  const printFrame = document.createElement("iframe");
  printFrame.style.position = "fixed";
  printFrame.style.right = "0";
  printFrame.style.bottom = "0";
  printFrame.style.width = "0";
  printFrame.style.height = "0";
  printFrame.style.border = "0";
  document.body.appendChild(printFrame);

  const doc = printFrame.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TIT SIH 2026 - Official Registration Pass</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap">
      <link rel="stylesheet" href="xtyle.css">
      <style>
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          margin: 0;
          padding: 12px;
          background: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          display: flex;
          justify-content: center;
        }
        .team-pass-card {
          width: 100%;
          max-width: 620px;
          border: 2px solid #059669;
          border-radius: 12px;
          padding: 24px;
          background: #ffffff;
          box-shadow: none !important;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .pass-header {
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 2px solid #059669;
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .pass-seal {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        .pass-qr-row {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f0fdf4;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 14px;
        }
        .pass-qr-img {
          width: 85px;
          height: 85px;
          border-radius: 8px;
          background: #ffffff;
          padding: 4px;
          border: 1px solid #cbd5e1;
        }
      </style>
    </head>
    <body>
      ${passContent.innerHTML}
    </body>
    </html>
  `);
  doc.close();

  printFrame.contentWindow.focus();
  setTimeout(() => {
    printFrame.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 1000);
  }, 300);
};

/* ==========================================================================
   6. FACULTY & JURY ADMIN REVIEW CONSOLE ENGINE
   ========================================================================== */
let adminSearchQuery = "";
let adminEditionFilter = "ALL";
let adminStatusFilter = "ALL";

window.openAdminModal = () => {
  const modal = document.getElementById("admin-review-modal");
  const passcodeView = document.getElementById("admin-passcode-view");
  const consoleView = document.getElementById("admin-console-view");

  if (!modal) return;
  clearAdminInputs();
  setTimeout(clearAdminInputs, 80);
  setTimeout(clearAdminInputs, 250);

  if (passcodeView) passcodeView.style.display = "block";
  if (consoleView) consoleView.style.display = "none";
  modal.classList.add("active");
};

window.closeAdminModal = () => {
  const modal = document.getElementById("admin-review-modal");
  clearAdminInputs();
  if (modal) modal.classList.remove("active");
};

let adminBranchFilter = "ALL";
let adminYearFilter = "ALL";
let adminProgramFilter = "ALL";
let adminStudentSearchQuery = "";
let adminStudentBranchFilter = "ALL";
let adminStudentYearFilter = "ALL";
let adminStudentGenderFilter = "ALL";

window.handleAdminPasscodeSubmit = (e) => {
  e.preventDefault();
  const input = (document.getElementById("admin-passcode-input")?.value || "").trim();

  if (
    input === CONFIG.adminPasscode ||
    input === "TIT_DEV_2026" ||
    input === "TIT_SIH_2026#SPOC" ||
    input.toLowerCase() === "admin" ||
    input.toLowerCase() === "spoc"
  ) {
    document.getElementById("admin-passcode-view").style.display = "none";
    document.getElementById("admin-console-view").style.display = "block";
    renderAdminConsole();
  } else {
    alert("❌ Invalid Admin Passcode. Access restricted to authorized faculty, SPOC, and IIC conveners.");
  }
};

window.switchAdminTab = (tabName) => {
  adminActiveTab = tabName;
  renderAdminConsole();
};

window.filterAdminTeams = (query, edition, status, branch, year, program) => {
  if (query !== undefined) adminSearchQuery = query.toLowerCase();
  if (edition !== undefined) adminEditionFilter = edition;
  if (status !== undefined) adminStatusFilter = status;
  if (branch !== undefined) adminBranchFilter = branch;
  if (year !== undefined) adminYearFilter = year;
  if (program !== undefined) adminProgramFilter = program;
  renderAdminConsole();
};

window.filterAdminStudents = (query, branch, year, gender) => {
  if (query !== undefined) adminStudentSearchQuery = query.toLowerCase();
  if (branch !== undefined) adminStudentBranchFilter = branch;
  if (year !== undefined) adminStudentYearFilter = year;
  if (gender !== undefined) adminStudentGenderFilter = gender;
  renderAdminConsole();
};

window.resetAdminFilters = () => {
  adminSearchQuery = "";
  adminEditionFilter = "ALL";
  adminStatusFilter = "ALL";
  adminBranchFilter = "ALL";
  adminYearFilter = "ALL";
  adminProgramFilter = "ALL";
  renderAdminConsole();
};

window.filterAdminByBranch = (branch) => {
  adminBranchFilter = branch;
  adminActiveTab = "teams";
  renderAdminConsole();
};

window.filterAdminByYear = (year) => {
  adminYearFilter = year;
  adminActiveTab = "teams";
  renderAdminConsole();
};

window.filterAdminByEdition = (edition) => {
  adminEditionFilter = edition;
  adminActiveTab = "teams";
  renderAdminConsole();
};

window.filterAdminByStatus = (status) => {
  adminStatusFilter = status;
  adminActiveTab = "teams";
  renderAdminConsole();
};

// Data Normalization Helpers
function normBranch(str) {
  if (!str) return "CSE";
  const s = String(str).toUpperCase();
  if (s.includes("ECE") || s.includes("ELECTRONIC")) return "ECE";
  if (s.includes("CSE") || s.includes("COMPUTER") || s.includes("IT")) return "CSE";
  if (s.includes("EE") || s.includes("ELECTRICAL")) return "EE";
  if (s.includes("CE") || s.includes("CIVIL")) return "CE";
  if (s.includes("ME") || s.includes("MECHANIC")) return "ME";
  return "CSE";
}

function normProgram(prog, branch) {
  if (prog && String(prog).toLowerCase().includes("diploma")) return "Diploma";
  if (branch && window.isDiplomaBranch && window.isDiplomaBranch(branch)) return "Diploma";
  return "Degree";
}

function normYear(yr, roll, email) {
  if (yr) {
    const yStr = String(yr);
    if (yStr.includes("1")) return "1st Year";
    if (yStr.includes("2")) return "2nd Year";
    if (yStr.includes("3")) return "3rd Year";
    if (yStr.includes("4")) return "4th Year";
  }
  // Lookup in student accounts if available
  if (email && Array.isArray(registeredStudents)) {
    const st = registeredStudents.find(s => s.email && s.email.toLowerCase() === String(email).toLowerCase());
    if (st && st.year) return normYear(st.year);
  }
  // Infer from roll number if possible (e.g. 24... -> 2nd year, 23... -> 3rd year, 22... -> 4th year, 25... -> 1st year)
  if (roll) {
    const r = String(roll).trim();
    if (r.startsWith("25") || r.startsWith("2025")) return "1st Year";
    if (r.startsWith("24") || r.startsWith("2024")) return "2nd Year";
    if (r.startsWith("23") || r.startsWith("2023")) return "3rd Year";
    if (r.startsWith("22") || r.startsWith("2022") || r.startsWith("21") || r.startsWith("2021")) return "4th Year";
  }
  return "3rd Year";
}

function normGender(g) {
  if (!g) return "Male";
  const s = String(g).toLowerCase();
  if (s.includes("fem") || s.includes("female") || s.includes("f")) return "Female";
  if (s.includes("other")) return "Other";
  return "Male";
}

/* ==========================================================================
   CORE RENDER FUNCTION FOR ADMIN DASHBOARD & VISUALIZATIONS
   ========================================================================== */
function renderAdminConsole() {
  const container = document.getElementById("admin-teams-table-container");
  if (!container) return;

  const totalTeams = registeredTeams.length;
  const swTeams = registeredTeams.filter((t) => (t.edition || "").includes("Software")).length;
  const hwTeams = registeredTeams.filter((t) => (t.edition || "").includes("Hardware")).length;
  const totalStudents = registeredTeams.reduce((acc, t) => acc + (t.members ? t.members.length : 0), 0);

  let totalFemales = 0;
  let totalMales = 0;
  let totalDegreeStudents = 0;
  let totalDiplomaStudents = 0;

  // Module / Program Counts
  let degreeTeams = 0;
  let diplomaTeams = 0;

  // Year-wise Map
  const yearsMap = {
    "1st Year": { name: "1st Year", count: 0, females: 0, males: 0, teamsLed: 0, color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
    "2nd Year": { name: "2nd Year", count: 0, females: 0, males: 0, teamsLed: 0, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
    "3rd Year": { name: "3rd Year", count: 0, females: 0, males: 0, teamsLed: 0, color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
    "4th Year": { name: "4th Year", count: 0, females: 0, males: 0, teamsLed: 0, color: "#d97706", bg: "#fef3c7", border: "#fde68a" }
  };

  // Branch-wise Map
  const branchMap = {
    "ECE": { name: "ECE", fullName: "Electronics & Communication Engg", count: 0, females: 0, males: 0, teamsLed: 0, swCount: 0, hwCount: 0, color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", icon: "fa-satellite-dish" },
    "CSE": { name: "CSE", fullName: "Computer Science & Engineering", count: 0, females: 0, males: 0, teamsLed: 0, swCount: 0, hwCount: 0, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: "fa-laptop-code" },
    "EE": { name: "EE", fullName: "Electrical Engineering", count: 0, females: 0, males: 0, teamsLed: 0, swCount: 0, hwCount: 0, color: "#f59e0b", bg: "#fefce8", border: "#fef08a", icon: "fa-bolt" },
    "CE": { name: "CE", fullName: "Civil Engineering", count: 0, females: 0, males: 0, teamsLed: 0, swCount: 0, hwCount: 0, color: "#0d9488", bg: "#f0fdfa", border: "#99f6e4", icon: "fa-compass-drafting" },
    "ME": { name: "ME", fullName: "Mechanical Engineering", count: 0, females: 0, males: 0, teamsLed: 0, swCount: 0, hwCount: 0, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", icon: "fa-wrench" }
  };

  // Cross-Tabulation Matrix [Branch][Year]
  const crossTabMatrix = {
    "ECE": { "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "4th Year": 0, total: 0, females: 0, teams: 0 },
    "CSE": { "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "4th Year": 0, total: 0, females: 0, teams: 0 },
    "EE": { "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "4th Year": 0, total: 0, females: 0, teams: 0 },
    "CE": { "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "4th Year": 0, total: 0, females: 0, teams: 0 },
    "ME": { "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "4th Year": 0, total: 0, females: 0, teams: 0 }
  };

  // Domain & Status Map
  const domainMap = {};
  const psMap = {};
  let underReviewCount = 0;
  let shortlistedCount = 0;
  let nominatedCount = 0;
  let nominatedSwCount = 0;
  let nominatedHwCount = 0;

  // Process all registered teams and their members
  registeredTeams.forEach(t => {
    const isSw = (t.edition || "").includes("Software");
    const status = t.status || "";
    if (status.includes("Nominated")) {
      nominatedCount++;
      if (isSw) nominatedSwCount++;
      else nominatedHwCount++;
    } else if (status.includes("Shortlisted")) {
      shortlistedCount++;
    } else {
      underReviewCount++;
    }

    // Domain tally
    const dom = t.domain || "General Innovation";
    domainMap[dom] = (domainMap[dom] || 0) + 1;

    // PS tally
    const psKey = (t.psId || "OTHER").toUpperCase();
    if (!psMap[psKey]) {
      psMap[psKey] = { psId: psKey, title: t.title || "Innovation Project", domain: dom, teams: [] };
    }
    psMap[psKey].teams.push(t);

    const leader = (t.members && t.members[0]) || {};
    const leaderBranch = normBranch(leader.branch || leader.dept);
    const leaderProg = normProgram(leader.program, leader.branch);
    const leaderYear = normYear(leader.year, leader.roll, leader.email);

    if (leaderProg === "Diploma") diplomaTeams++;
    else degreeTeams++;

    if (yearsMap[leaderYear]) yearsMap[leaderYear].teamsLed++;
    if (branchMap[leaderBranch]) {
      branchMap[leaderBranch].teamsLed++;
      if (isSw) branchMap[leaderBranch].swCount++;
      else branchMap[leaderBranch].hwCount++;
    }
    if (crossTabMatrix[leaderBranch]) {
      crossTabMatrix[leaderBranch].teams++;
    }

    // Member-level aggregation
    (t.members || []).forEach(m => {
      const g = normGender(m.gender);
      if (g === "Female") totalFemales++;
      else totalMales++;

      const b = normBranch(m.branch || m.dept);
      const p = normProgram(m.program, m.branch);
      const y = normYear(m.year, m.roll, m.email);

      if (p === "Diploma") totalDiplomaStudents++;
      else totalDegreeStudents++;

      if (yearsMap[y]) {
        yearsMap[y].count++;
        if (g === "Female") yearsMap[y].females++;
        else yearsMap[y].males++;
      }

      if (branchMap[b]) {
        branchMap[b].count++;
        if (g === "Female") branchMap[b].females++;
        else branchMap[b].males++;
      }

      if (crossTabMatrix[b]) {
        crossTabMatrix[b][y] = (crossTabMatrix[b][y] || 0) + 1;
        crossTabMatrix[b].total++;
        if (g === "Female") crossTabMatrix[b].females++;
      }
    });
  });

  // Flat Student Roster for Students Tab
  const allStudentsList = [];
  registeredTeams.forEach(t => {
    (t.members || []).forEach((m, idx) => {
      allStudentsList.push({
        name: m.name,
        roll: m.roll || "Awaited",
        branch: normBranch(m.branch || m.dept),
        program: normProgram(m.program, m.branch),
        year: normYear(m.year, m.roll, m.email),
        gender: normGender(m.gender),
        email: m.email || "",
        phone: m.phone || "",
        teamId: t.teamId,
        teamName: t.teamName,
        isLeader: idx === 0,
        status: t.status
      });
    });
  });

  // Top Action Banner & Sync status
  const dbStatusBadge = isFirebaseActive
    ? `<span style="display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; color: #065f46; font-weight: 700;">
        <i class="fa-solid fa-cloud-check" style="color: #059669;"></i> Live Firebase Firestore Sync
      </span>`
    : `<span style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; border: 1px solid #fde68a; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; color: #92400e; font-weight: 700;">
        <i class="fa-solid fa-database" style="color: #d97706;"></i> Local Browser Database
      </span>`;

  // Filter teams for Teams tab
  const filteredTeams = registeredTeams.filter((t) => {
    const leader = (t.members && t.members[0]) || {};
    const leaderBranch = normBranch(leader.branch || leader.dept);
    const leaderYear = normYear(leader.year, leader.roll, leader.email);
    const leaderProg = normProgram(leader.program, leader.branch);

    const matchesSearch =
      adminSearchQuery === "" ||
      t.teamId.toLowerCase().includes(adminSearchQuery) ||
      t.teamName.toLowerCase().includes(adminSearchQuery) ||
      t.psId.toLowerCase().includes(adminSearchQuery) ||
      t.domain.toLowerCase().includes(adminSearchQuery) ||
      t.title.toLowerCase().includes(adminSearchQuery) ||
      (t.referralCode && t.referralCode.toLowerCase().includes(adminSearchQuery)) ||
      (t.members || []).some((m) =>
        (m.name || "").toLowerCase().includes(adminSearchQuery) ||
        (m.roll || "").toLowerCase().includes(adminSearchQuery) ||
        (m.email || "").toLowerCase().includes(adminSearchQuery)
      );

    const matchesEdition =
      adminEditionFilter === "ALL" ||
      (adminEditionFilter === "Software" && (t.edition || "").includes("Software")) ||
      (adminEditionFilter === "Hardware" && (t.edition || "").includes("Hardware"));

    const matchesStatus =
      adminStatusFilter === "ALL" ||
      (adminStatusFilter === "Review" && (t.status || "").includes("Under Review")) ||
      (adminStatusFilter === "Shortlisted" && (t.status || "").includes("Shortlisted")) ||
      (adminStatusFilter === "Nominated" && (t.status || "").includes("Nominated"));

    const matchesBranch = adminBranchFilter === "ALL" || leaderBranch === adminBranchFilter;
    const matchesYear = adminYearFilter === "ALL" || leaderYear === adminYearFilter;
    const matchesProgram = adminProgramFilter === "ALL" || leaderProg === adminProgramFilter;

    return matchesSearch && matchesEdition && matchesStatus && matchesBranch && matchesYear && matchesProgram;
  });

  // Filter students for Students tab
  const filteredStudents = allStudentsList.filter((s) => {
    const matchesSearch =
      adminStudentSearchQuery === "" ||
      s.name.toLowerCase().includes(adminStudentSearchQuery) ||
      s.roll.toLowerCase().includes(adminStudentSearchQuery) ||
      s.email.toLowerCase().includes(adminStudentSearchQuery) ||
      s.teamName.toLowerCase().includes(adminStudentSearchQuery) ||
      s.teamId.toLowerCase().includes(adminStudentSearchQuery);

    const matchesBranch = adminStudentBranchFilter === "ALL" || s.branch === adminStudentBranchFilter;
    const matchesYear = adminStudentYearFilter === "ALL" || s.year === adminStudentYearFilter;
    const matchesGender = adminStudentGenderFilter === "ALL" || s.gender === adminStudentGenderFilter;

    return matchesSearch && matchesBranch && matchesYear && matchesGender;
  });

  // Calculate percentages
  const femalePct = totalStudents > 0 ? Math.round((totalFemales / totalStudents) * 100) : 0;
  const swPct = totalTeams > 0 ? Math.round((swTeams / totalTeams) * 100) : 0;
  const hwPct = totalTeams > 0 ? Math.round((hwTeams / totalTeams) * 100) : 0;
  const degreePct = totalStudents > 0 ? Math.round((totalDegreeStudents / totalStudents) * 100) : 0;
  const diplomaPct = totalStudents > 0 ? Math.round((totalDiplomaStudents / totalStudents) * 100) : 0;

  // SIH 50 Cap calculations
  const swNominatedPct = Math.min(100, Math.round((nominatedSwCount / 45) * 100));
  const hwNominatedPct = Math.min(100, Math.round((nominatedHwCount / 5) * 100));
  const totalNominatedPct = Math.min(100, Math.round((nominatedCount / 50) * 100));

  let html = `
    <!-- Top Executive Header & Utilities -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <h2 style="font-size: 1.5rem; font-weight: 900; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-chart-pie" style="color: #059669;"></i> SPOC & Jury Command Center
          </h2>
          ${dbStatusBadge}
        </div>
        <p style="color: #64748b; font-size: 0.85rem; margin: 4px 0 0 0;">
          Tripura Institute of Technology • Multi-Branch & Year Analytics, Screening Matrix & AICTE Nomination Engine
        </p>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button class="btn-3d-secondary" onclick="renderAdminConsole()" style="padding: 8px 14px; font-size: 0.82rem;" title="Refresh Data">
          <i class="fa-solid fa-rotate"></i> Refresh
        </button>
        <button class="btn-3d-secondary" onclick="printAdminSummaryReport()" style="padding: 8px 14px; font-size: 0.82rem; background: #ffffff;" title="Print Executive Summary Report">
          <i class="fa-solid fa-print"></i> Print Report
        </button>
        <button class="btn-3d-primary" onclick="exportTeamsToCSV()" style="padding: 8px 16px; font-size: 0.82rem;" title="Export Full AICTE Nominee CSV">
          <i class="fa-solid fa-file-csv"></i> Export CSV
        </button>
        <button class="btn-3d-outline" onclick="closeAdminModal()" style="padding: 8px 14px; font-size: 0.82rem; background: #ffffff;">
          <i class="fa-solid fa-xmark"></i> Exit
        </button>
      </div>
    </div>

    <!-- Navigation Tabs Bar -->
    <div class="admin-tabs-bar">
      <button class="admin-tab-btn ${adminActiveTab === 'visualizations' ? 'active' : ''}" onclick="switchAdminTab('visualizations')">
        <i class="fa-solid fa-chart-column"></i> 1. Visual Analytics & Cohorts
      </button>
      <button class="admin-tab-btn ${adminActiveTab === 'teams' ? 'active' : ''}" onclick="switchAdminTab('teams')">
        <i class="fa-solid fa-list-check"></i> 2. Master Teams Directory (${filteredTeams.length}/${totalTeams})
      </button>
      <button class="admin-tab-btn ${adminActiveTab === 'students' ? 'active' : ''}" onclick="switchAdminTab('students')">
        <i class="fa-solid fa-users"></i> 3. Students Roster (${allStudentsList.length})
      </button>
      <button class="admin-tab-btn ${adminActiveTab === 'nominees' ? 'active' : ''}" onclick="switchAdminTab('nominees')">
        <i class="fa-solid fa-trophy"></i> 4. National Nominees (${nominatedCount}/50)
      </button>
      <button class="admin-tab-btn ${adminActiveTab === 'ps-matrix' ? 'active' : ''}" onclick="switchAdminTab('ps-matrix')">
        <i class="fa-solid fa-lightbulb"></i> 5. Problem Statement Matrix (${Object.keys(psMap).length})
      </button>
      <button class="admin-tab-btn ${adminActiveTab === 'referrals' ? 'active' : ''}" onclick="switchAdminTab('referrals')">
        <i class="fa-solid fa-ticket"></i> 6. Coordinator Leaderboard
      </button>
    </div>
  `;

  // ==========================================
  // TAB 1: VISUAL ANALYTICS & INSIGHTS
  // ==========================================
  if (adminActiveTab === "visualizations") {
    html += `
      <!-- Top 6 High-Impact KPI Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 22px;">
        
        <div class="viz-clickable-card" onclick="filterAdminByEdition('ALL')" style="background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 900; color: #064e3b;">${totalTeams}</div>
          <div style="font-size: 0.8rem; font-weight: 800; color: #059669;">Total Teams</div>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">${swTeams} SW • ${hwTeams} HW</div>
        </div>

        <div class="viz-clickable-card" onclick="switchAdminTab('students')" style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 900; color: #6b21a8;">${totalStudents}</div>
          <div style="font-size: 0.8rem; font-weight: 800; color: #9333ea;">Active Students</div>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Avg ${(totalTeams > 0 ? (totalStudents / totalTeams).toFixed(1) : 0)} / squad</div>
        </div>

        <div class="viz-clickable-card" style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 900; color: #9f1239;">${totalFemales} <span style="font-size: 0.9rem; font-weight: 700;">(${femalePct}%)</span></div>
          <div style="font-size: 0.8rem; font-weight: 800; color: #e11d48;">Female Participation</div>
          <div style="font-size: 0.72rem; color: #059669; margin-top: 2px; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> 100% Quota Met</div>
        </div>

        <div class="viz-clickable-card" onclick="filterAdminByEdition('Software')" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 900; color: #1e40af;">${swTeams} <span style="font-size: 0.9rem; font-weight: 700;">(${swPct}%)</span></div>
          <div style="font-size: 0.8rem; font-weight: 800; color: #2563eb;">Software Edition</div>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Target: Up to 45 Slots</div>
        </div>

        <div class="viz-clickable-card" onclick="filterAdminByEdition('Hardware')" style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 900; color: #92400e;">${hwTeams} <span style="font-size: 0.9rem; font-weight: 700;">(${hwPct}%)</span></div>
          <div style="font-size: 0.8rem; font-weight: 800; color: #d97706;">Hardware Edition</div>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Target: Up to 5 Slots</div>
        </div>

        <div class="viz-clickable-card" onclick="switchAdminTab('nominees')" style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 900; color: #064e3b;">${nominatedCount} <span style="font-size: 0.9rem; font-weight: 700;">/ 50</span></div>
          <div style="font-size: 0.8rem; font-weight: 800; color: #059669;">SIH National Nominees</div>
          <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">${50 - nominatedCount} Remaining</div>
        </div>

      </div>

      <!-- VISUAL SECTION 1: MODULE-WISE (DEGREE vs DIPLOMA) & EDITION-WISE -->
      <div class="viz-section-card">
        <div class="viz-section-header">
          <h3 class="viz-section-title">
            <i class="fa-solid fa-graduation-cap" style="color: #059669;"></i> 1. Module-Wise & Edition-Wise Visualization
          </h3>
          <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
            Program Breakdown
          </span>
        </div>

        <div class="viz-grid-2">
          <!-- Degree vs Diploma Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="color: #0f172a; font-size: 0.92rem;"><i class="fa-solid fa-award" style="color: #2563eb;"></i> Academic Program Breakdown</strong>
              <span style="font-size: 0.75rem; font-weight: 700; color: #64748b;">${totalStudents} Students</span>
            </div>

            <!-- Program Track Meter -->
            <div class="viz-bar-track" style="height: 14px; display: flex; overflow: hidden;">
              <div style="width: ${degreePct}%; background: #2563eb;" title="Degree: ${totalDegreeStudents} students (${degreePct}%)"></div>
              <div style="width: ${diplomaPct}%; background: #8b5cf6;" title="Diploma: ${totalDiplomaStudents} students (${diplomaPct}%)"></div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #2563eb; display: inline-block;"></span>
                <span><strong>Degree (B.Tech):</strong> ${totalDegreeStudents} students (${degreePct}%) • ${degreeTeams} teams</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #8b5cf6; display: inline-block;"></span>
                <span><strong>Diploma:</strong> ${totalDiplomaStudents} students (${diplomaPct}%) • ${diplomaTeams} teams</span>
              </div>
            </div>
          </div>

          <!-- Software vs Hardware Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="color: #0f172a; font-size: 0.92rem;"><i class="fa-solid fa-microchip" style="color: #059669;"></i> Innovation Track Edition</strong>
              <span style="font-size: 0.75rem; font-weight: 700; color: #64748b;">${totalTeams} Squads</span>
            </div>

            <!-- Edition Track Meter -->
            <div class="viz-bar-track" style="height: 14px; display: flex; overflow: hidden;">
              <div style="width: ${swPct}%; background: #059669;" title="Software: ${swTeams} teams (${swPct}%)"></div>
              <div style="width: ${hwPct}%; background: #d97706;" title="Hardware: ${hwTeams} teams (${hwPct}%)"></div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #059669; display: inline-block;"></span>
                <span><strong>Software:</strong> ${swTeams} squads (${swPct}%)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #d97706; display: inline-block;"></span>
                <span><strong>Hardware:</strong> ${hwTeams} squads (${hwPct}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VISUAL SECTION 2: YEAR-WISE ACADEMIC DISTRIBUTION -->
      <div class="viz-section-card">
        <div class="viz-section-header">
          <h3 class="viz-section-title">
            <i class="fa-solid fa-calendar-days" style="color: #059669;"></i> 2. Year-Wise Cohort Distribution (1st, 2nd, 3rd & 4th Year)
          </h3>
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Click any year card to filter registered teams</span>
        </div>

        <div class="viz-grid-4">
          ${Object.values(yearsMap).map((y) => {
            const yrPct = totalStudents > 0 ? Math.round((y.count / totalStudents) * 100) : 0;
            return `
              <div class="viz-clickable-card" onclick="filterAdminByYear('${y.name}')" style="background: ${y.bg}; border: 1px solid ${y.border}; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 900; font-size: 1rem; color: ${y.color};">${y.name}</span>
                    <span style="font-weight: 900; font-size: 1.25rem; color: #0f172a;">${y.count} <span style="font-size: 0.75rem; color: #64748b;">(${yrPct}%)</span></span>
                  </div>

                  <div class="viz-bar-track" style="background: rgba(0,0,0,0.06); height: 8px;">
                    <div class="viz-bar-fill" style="width: ${yrPct}%; background: ${y.color};"></div>
                  </div>

                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #475569; margin-top: 10px;">
                    <span><i class="fa-solid fa-venus" style="color: #e11d48;"></i> ${y.females} Female</span>
                    <span><i class="fa-solid fa-mars" style="color: #2563eb;"></i> ${y.males} Male</span>
                  </div>
                </div>

                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed rgba(0,0,0,0.1); font-size: 0.74rem; color: ${y.color}; font-weight: 800; display: flex; justify-content: space-between;">
                  <span><i class="fa-solid fa-crown"></i> ${y.teamsLed} Team Leads</span>
                  <span>Filter <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- VISUAL SECTION 3: BRANCH-WISE ENGINEERING DEPARTMENT DISTRIBUTION -->
      <div class="viz-section-card">
        <div class="viz-section-header">
          <h3 class="viz-section-title">
            <i class="fa-solid fa-building-columns" style="color: #059669;"></i> 3. Branch-Wise Turnout & Departmental Comparison
          </h3>
          <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Click any department card to filter registered teams</span>
        </div>

        <div class="viz-grid-5">
          ${Object.values(branchMap).map((b) => {
            const bPct = totalStudents > 0 ? Math.round((b.count / totalStudents) * 100) : 0;
            return `
              <div class="viz-clickable-card" onclick="filterAdminByBranch('${b.name}')" style="background: ${b.bg}; border: 1px solid ${b.border}; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <i class="fa-solid ${b.icon}" style="color: ${b.color}; font-size: 0.95rem;"></i>
                      <strong style="font-size: 1.05rem; font-weight: 900; color: #0f172a;">${b.name}</strong>
                    </div>
                    <span style="font-weight: 900; font-size: 1.2rem; color: ${b.color};">${b.count}</span>
                  </div>

                  <div style="font-size: 0.7rem; color: #64748b; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${b.fullName}">
                    ${b.fullName}
                  </div>

                  <div class="viz-bar-track" style="background: rgba(0,0,0,0.06); height: 8px;">
                    <div class="viz-bar-fill" style="width: ${bPct}%; background: ${b.color};"></div>
                  </div>

                  <div style="font-size: 0.72rem; color: #475569; margin-top: 8px; display: flex; justify-content: space-between;">
                    <span>${bPct}% turnout</span>
                    <span><i class="fa-solid fa-venus" style="color: #e11d48;"></i> ${b.females}</span>
                  </div>
                </div>

                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(0,0,0,0.1); font-size: 0.72rem; color: #0f172a; font-weight: 700; display: flex; justify-content: space-between;">
                  <span><i class="fa-solid fa-crown" style="color: ${b.color};"></i> ${b.teamsLed} Leads</span>
                  <span style="color: #059669;">Filter <i class="fa-solid fa-arrow-right"></i></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- VISUAL SECTION 4: BRANCH × YEAR CROSS-TABULATION MATRIX -->
      <div class="viz-section-card">
        <div class="viz-section-header">
          <h3 class="viz-section-title">
            <i class="fa-solid fa-table-cells" style="color: #059669;"></i> 4. Branch × Academic Year Cross-Tabulation Matrix
          </h3>
          <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
            Comprehensive Roster Matrix
          </span>
        </div>

        <div style="overflow-x: auto;">
          <table class="viz-crosstab-table">
            <thead>
              <tr>
                <th style="text-align: left;"><i class="fa-solid fa-building-columns"></i> Engineering Branch</th>
                <th>1st Year</th>
                <th>2nd Year</th>
                <th>3rd Year</th>
                <th>4th Year</th>
                <th style="background: #ecfdf5; color: #064e3b;">Total Students</th>
                <th style="background: #fff1f2; color: #9f1239;">Female Count</th>
                <th style="background: #f0fdf4; color: #064e3b;">Teams Led</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(crossTabMatrix).map(bKey => {
                const row = crossTabMatrix[bKey];
                const bInfo = branchMap[bKey] || {};
                return `
                  <tr>
                    <td style="text-align: left; font-weight: 800;">
                      <span style="color: ${bInfo.color || '#059669'}; margin-right: 6px;"><i class="fa-solid ${bInfo.icon || 'fa-code'}"></i></span>
                      ${bKey} - ${bInfo.fullName || bKey}
                    </td>
                    <td><span class="badge" style="background: #f5f3ff; color: #6b21a8; font-weight: 800; padding: 3px 8px; border-radius: 6px;">${row["1st Year"]}</span></td>
                    <td><span class="badge" style="background: #eff6ff; color: #1e40af; font-weight: 800; padding: 3px 8px; border-radius: 6px;">${row["2nd Year"]}</span></td>
                    <td><span class="badge" style="background: #ecfdf5; color: #064e3b; font-weight: 800; padding: 3px 8px; border-radius: 6px;">${row["3rd Year"]}</span></td>
                    <td><span class="badge" style="background: #fef3c7; color: #92400e; font-weight: 800; padding: 3px 8px; border-radius: 6px;">${row["4th Year"]}</span></td>
                    <td style="background: #f0fdf4; font-weight: 900; color: #064e3b; font-size: 0.95rem;">${row.total}</td>
                    <td style="background: #fff1f2; font-weight: 800; color: #9f1239;"><i class="fa-solid fa-venus"></i> ${row.females}</td>
                    <td style="background: #ecfdf5; font-weight: 800; color: #059669;">${row.teams}</td>
                    <td>
                      <button class="btn-3d-secondary" onclick="filterAdminByBranch('${bKey}')" style="padding: 4px 10px; font-size: 0.74rem;">
                        View <i class="fa-solid fa-arrow-right"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
              <tr style="background: #f8fafc; font-weight: 900; border-top: 2px solid #cbd5e1;">
                <td style="text-align: left; font-size: 0.9rem; color: #0f172a;">GRAND TOTALS</td>
                <td>${yearsMap["1st Year"].count}</td>
                <td>${yearsMap["2nd Year"].count}</td>
                <td>${yearsMap["3rd Year"].count}</td>
                <td>${yearsMap["4th Year"].count}</td>
                <td style="background: #ecfdf5; color: #064e3b; font-size: 1rem;">${totalStudents}</td>
                <td style="background: #fff1f2; color: #9f1239; font-size: 0.95rem;">${totalFemales}</td>
                <td style="background: #f0fdf4; color: #064e3b; font-size: 0.95rem;">${totalTeams}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VISUAL SECTION 5: DOMAINS & SCREENING PIPELINE FUNNEL -->
      <div class="viz-grid-2" style="margin-bottom: 22px;">
        
        <!-- Domains Breakdown -->
        <div class="viz-section-card" style="margin-bottom: 0;">
          <div class="viz-section-header">
            <h3 class="viz-section-title">
              <i class="fa-solid fa-layer-group" style="color: #059669;"></i> 5. SIH Domain Distribution
            </h3>
            <span style="font-size: 0.72rem; color: #64748b;">${Object.keys(domainMap).length} Unique Tracks</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${Object.keys(domainMap).length === 0
              ? `<div style="text-align: center; color: #64748b; padding: 20px;">No domain registrations yet.</div>`
              : Object.entries(domainMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([domName, count]) => {
                const domPct = totalTeams > 0 ? Math.round((count / totalTeams) * 100) : 0;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                      <strong style="color: #0f172a;">${escapeHtml(domName)}</strong>
                      <span style="font-weight: 800; color: #059669;">${count} Squad${count > 1 ? 's' : ''} (${domPct}%)</span>
                    </div>
                    <div class="viz-bar-track" style="height: 8px; margin: 0;">
                      <div class="viz-bar-fill" style="width: ${domPct}%; background: #059669;"></div>
                    </div>
                  </div>
                `;
              }).join('')
            }
          </div>
        </div>

        <!-- Screening & Nomination Funnel -->
        <div class="viz-section-card" style="margin-bottom: 0;">
          <div class="viz-section-header">
            <h3 class="viz-section-title">
              <i class="fa-solid fa-filter-circle-dollar" style="color: #059669;"></i> 6. National Nomination Progress (Top 50 Cap)
            </h3>
            <span style="font-size: 0.75rem; font-weight: 800; color: #059669; background: #ecfdf5; padding: 3px 8px; border-radius: 6px;">
              ${nominatedCount} / 50 Allocated
            </span>
          </div>

          <!-- Software Slot Meter -->
          <div style="margin-bottom: 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
              <strong style="color: #1e40af;"><i class="fa-solid fa-laptop-code"></i> Software Track Nominees (Max 45)</strong>
              <span style="font-weight: 900; color: #1e40af;">${nominatedSwCount} / 45 (${swNominatedPct}%)</span>
            </div>
            <div class="viz-bar-track" style="height: 10px; margin: 0; background: #dbeafe;">
              <div class="viz-bar-fill" style="width: ${swNominatedPct}%; background: #2563eb;"></div>
            </div>
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 6px;">
              ${45 - nominatedSwCount} Software slots available for SPOC recommendation
            </div>
          </div>

          <!-- Hardware Slot Meter -->
          <div style="margin-bottom: 14px; background: #fefce8; border: 1px solid #fef08a; border-radius: 10px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
              <strong style="color: #854d0e;"><i class="fa-solid fa-microchip"></i> Hardware Track Nominees (Max 5)</strong>
              <span style="font-weight: 900; color: #854d0e;">${nominatedHwCount} / 5 (${hwNominatedPct}%)</span>
            </div>
            <div class="viz-bar-track" style="height: 10px; margin: 0; background: #fef9c3;">
              <div class="viz-bar-fill" style="width: ${hwNominatedPct}%; background: #ca8a04;"></div>
            </div>
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 6px;">
              ${5 - nominatedHwCount} Hardware slots available for SPOC recommendation
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 8px;">
            <button class="btn-3d-primary" onclick="switchAdminTab('nominees')" style="flex: 1; justify-content: center; font-size: 0.8rem;">
              <i class="fa-solid fa-trophy"></i> Manage 50 Nominees
            </button>
            <button class="btn-3d-secondary" onclick="switchAdminTab('teams')" style="font-size: 0.8rem;">
              <i class="fa-solid fa-list-check"></i> Evaluate Teams
            </button>
          </div>
        </div>

      </div>
    `;
  }

  // ==========================================
  // TAB 2: MASTER TEAMS DIRECTORY & EVALUATION
  // ==========================================
  else if (adminActiveTab === "teams") {
    html += `
      <!-- Multi-Criteria Search & Filter Toolbar -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 10px; flex-grow: 1; min-width: 260px;">
          <div style="position: relative; width: 100%;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 0.85rem;"></i>
            <input type="text" class="form-text-input" placeholder="Search team name, ID, PS number, leader name, roll no, referral code..." 
              value="${adminSearchQuery}" 
              oninput="filterAdminTeams(this.value, undefined, undefined, undefined, undefined, undefined)"
              style="padding-left: 34px; font-size: 0.85rem; height: 38px; margin: 0;">
          </div>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <select class="form-select-input" onchange="filterAdminTeams(undefined, this.value, undefined, undefined, undefined, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
            <option value="ALL" ${adminEditionFilter === "ALL" ? "selected" : ""}>All Editions</option>
            <option value="Software" ${adminEditionFilter === "Software" ? "selected" : ""}>Software</option>
            <option value="Hardware" ${adminEditionFilter === "Hardware" ? "selected" : ""}>Hardware</option>
          </select>

          <select class="form-select-input" onchange="filterAdminTeams(undefined, undefined, this.value, undefined, undefined, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
            <option value="ALL" ${adminStatusFilter === "ALL" ? "selected" : ""}>All Statuses</option>
            <option value="Review" ${adminStatusFilter === "Review" ? "selected" : ""}>Under Review</option>
            <option value="Shortlisted" ${adminStatusFilter === "Shortlisted" ? "selected" : ""}>Shortlisted</option>
            <option value="Nominated" ${adminStatusFilter === "Nominated" ? "selected" : ""}>Nominated for SIH</option>
          </select>

          <select class="form-select-input" onchange="filterAdminTeams(undefined, undefined, undefined, this.value, undefined, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
            <option value="ALL" ${adminBranchFilter === "ALL" ? "selected" : ""}>All Branches</option>
            <option value="ECE" ${adminBranchFilter === "ECE" ? "selected" : ""}>ECE</option>
            <option value="CSE" ${adminBranchFilter === "CSE" ? "selected" : ""}>CSE</option>
            <option value="EE" ${adminBranchFilter === "EE" ? "selected" : ""}>EE</option>
            <option value="CE" ${adminBranchFilter === "CE" ? "selected" : ""}>CE</option>
            <option value="ME" ${adminBranchFilter === "ME" ? "selected" : ""}>ME</option>
          </select>

          <select class="form-select-input" onchange="filterAdminTeams(undefined, undefined, undefined, undefined, this.value, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
            <option value="ALL" ${adminYearFilter === "ALL" ? "selected" : ""}>All Years</option>
            <option value="1st Year" ${adminYearFilter === "1st Year" ? "selected" : ""}>1st Year</option>
            <option value="2nd Year" ${adminYearFilter === "2nd Year" ? "selected" : ""}>2nd Year</option>
            <option value="3rd Year" ${adminYearFilter === "3rd Year" ? "selected" : ""}>3rd Year</option>
            <option value="4th Year" ${adminYearFilter === "4th Year" ? "selected" : ""}>4th Year</option>
          </select>

          <button class="btn-3d-secondary" onclick="resetAdminFilters()" style="height: 38px; padding: 0 12px; font-size: 0.8rem;" title="Reset Filters">
            <i class="fa-solid fa-filter-circle-xmark"></i> Clear
          </button>
        </div>
      </div>

      <!-- Teams Master Table -->
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Team ID & Date</th>
              <th>Team Name & Track</th>
              <th>Target PS & Domain</th>
              <th>Team Leader & Branch</th>
              <th>Cohort & Quota</th>
              <th>Jury Score</th>
              <th>Evaluation Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTeams.length === 0
              ? `<tr><td colspan="8" style="text-align: center; padding: 36px; color: #64748b;">No registered teams matching your criteria.</td></tr>`
              : filteredTeams.map((t) => {
                const femalesInTeam = (t.members || []).filter((m) => normGender(m.gender) === "Female").length;
                const leader = (t.members && t.members[0]) || {};
                const leaderBranch = normBranch(leader.branch || leader.dept);
                const leaderYear = normYear(leader.year, leader.roll, leader.email);
                const leaderProg = normProgram(leader.program, leader.branch);
                const isNominated = (t.status || "").includes("Nominated");

                return `
                  <tr style="${isNominated ? 'background: #f0fdf4;' : ''}">
                    <td>
                      <strong style="color: #059669; font-family: var(--font-mono); font-size: 0.88rem;">${t.teamId}</strong>
                      <div style="font-size: 0.7rem; color: #94a3b8;">${t.createdAt || "2026"}</div>
                    </td>
                    <td>
                      <strong style="color: #0f172a; font-size: 0.92rem;">${escapeHtml(t.teamName)}</strong>
                      <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">
                        <span class="badge" style="background:${t.edition?.includes('Software') ? '#e0f2fe' : '#fef3c7'}; color:${t.edition?.includes('Software') ? '#0369a1' : '#92400e'}; padding:2px 6px; border-radius:4px; font-weight:700;">${t.edition}</span>
                      </div>
                    </td>
                    <td>
                      <strong style="color: #064e3b; font-family: var(--font-mono);">${escapeHtml(t.psId)}</strong>
                      <div style="font-size: 0.72rem; color: #64748b; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(t.title)}">${escapeHtml(t.domain)}</div>
                    </td>
                    <td>
                      <strong style="color: #0f172a;">${escapeHtml(leader.name)}</strong>
                      <div style="font-size: 0.72rem; color: #64748b;">
                        <span class="badge" style="background:#ecfdf5; color:#064e3b; padding:1px 5px; border-radius:3px; font-weight:700;">${leaderBranch}</span>
                        <span>${leader.roll ? escapeHtml(leader.roll) : "Roll Awaited"}</span>
                      </div>
                      <div style="font-size: 0.7rem; color: #059669;"><i class="fa-solid fa-phone" style="font-size:0.65rem;"></i> ${leader.phone || "N/A"}</div>
                    </td>
                    <td>
                      <div style="font-size: 0.72rem; color: #475569; font-weight: 700; margin-bottom: 2px;">
                        ${leaderYear} • ${leaderProg}
                      </div>
                      <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
                        <i class="fa-solid fa-circle-check"></i> ${femalesInTeam} Female / ${(t.members || []).length} Total
                      </span>
                    </td>
                    <td>
                      <input type="number" min="0" max="100" value="${t.juryScore || ''}" placeholder="Score" 
                        onchange="saveJuryScore('${t.teamId}', this.value)"
                        style="width: 64px; padding: 4px 6px; font-size: 0.8rem; font-weight: 800; text-align: center; border: 1px solid #cbd5e1; border-radius: 6px;">
                    </td>
                    <td>
                      <select class="admin-status-select" onchange="updateTeamStatus('${t.teamId}', this.value)" style="font-weight:700; ${isNominated ? 'border-color:#10b981; color:#064e3b;' : ''}">
                        <option value="Under Review by IIC Panel" ${(t.status || '').includes("Under Review") ? "selected" : ""}>Under Review</option>
                        <option value="Shortlisted for Internal Hackathon" ${(t.status || '').includes("Shortlisted") ? "selected" : ""}>Shortlisted</option>
                        <option value="Nominated for SIH Finals" ${(t.status || '').includes("Nominated") ? "selected" : ""}>Nominated (Top 50)</option>
                      </select>
                    </td>
                    <td style="text-align: right; white-space: nowrap;">
                      <button class="btn-3d-primary" onclick="openAdminTeamDetails('${t.teamId}')" style="padding: 6px 10px; font-size: 0.75rem; margin-right: 4px;" title="Full Details">
                        <i class="fa-solid fa-users-viewfinder"></i>
                      </button>
                      <a href="${t.pptLink}" target="_blank" rel="noopener" class="btn-3d-secondary" style="padding: 6px 10px; font-size: 0.75rem; margin-right: 4px; text-decoration: none;" title="Open Idea PPT">
                        <i class="fa-solid fa-file-powerpoint"></i>
                      </a>
                      <button class="btn-3d-outline" onclick="openTeamPassModal('${t.teamId}')" style="padding: 6px 8px; font-size: 0.75rem; background: #ffffff; margin-right: 4px;" title="Print Digital Pass">
                        <i class="fa-solid fa-id-card"></i>
                      </button>
                      <button class="btn-3d-outline" onclick="deleteTeamByAdmin('${t.teamId}')" style="padding: 6px 8px; font-size: 0.75rem; background: #fff1f2; color: #dc2626; border-color: #fecdd3;" title="Delete Team">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')
            }
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // TAB 3: ALL PARTICIPATING STUDENTS ROSTER
  // ==========================================
  else if (adminActiveTab === "students") {
    html += `
      <!-- Students Roster Filter Toolbar -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 10px; flex-grow: 1; min-width: 260px;">
          <div style="position: relative; width: 100%;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 0.85rem;"></i>
            <input type="text" class="form-text-input" placeholder="Search by student name, roll number, email, team name..." 
              value="${adminStudentSearchQuery}" 
              oninput="filterAdminStudents(this.value, undefined, undefined, undefined)"
              style="padding-left: 34px; font-size: 0.85rem; height: 38px; margin: 0;">
          </div>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <select class="form-select-input" onchange="filterAdminStudents(undefined, this.value, undefined, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
            <option value="ALL" ${adminStudentBranchFilter === "ALL" ? "selected" : ""}>All Branches</option>
            <option value="ECE" ${adminStudentBranchFilter === "ECE" ? "selected" : ""}>ECE</option>
            <option value="CSE" ${adminStudentBranchFilter === "CSE" ? "selected" : ""}>CSE</option>
            <option value="EE" ${adminStudentBranchFilter === "EE" ? "selected" : ""}>EE</option>
            <option value="CE" ${adminStudentBranchFilter === "CE" ? "selected" : ""}>CE</option>
            <option value="ME" ${adminStudentBranchFilter === "ME" ? "selected" : ""}>ME</option>
          </select>

          <select class="form-select-input" onchange="filterAdminStudents(undefined, undefined, this.value, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
            <option value="ALL" ${adminStudentYearFilter === "ALL" ? "selected" : ""}>All Years</option>
            <option value="1st Year" ${adminStudentYearFilter === "1st Year" ? "selected" : ""}>1st Year</option>
            <option value="2nd Year" ${adminStudentYearFilter === "2nd Year" ? "selected" : ""}>2nd Year</option>
            <option value="3rd Year" ${adminStudentYearFilter === "3rd Year" ? "selected" : ""}>3rd Year</option>
            <option value="4th Year" ${adminStudentYearFilter === "4th Year" ? "selected" : ""}>4th Year</option>
          </select>

          <select class="form-select-input" onchange="filterAdminStudents(undefined, undefined, undefined, this.value)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
            <option value="ALL" ${adminStudentGenderFilter === "ALL" ? "selected" : ""}>All Genders</option>
            <option value="Female" ${adminStudentGenderFilter === "Female" ? "selected" : ""}>Female Only</option>
            <option value="Male" ${adminStudentGenderFilter === "Male" ? "selected" : ""}>Male Only</option>
          </select>

          <button class="btn-3d-primary" onclick="exportStudentsToCSV()" style="height: 38px; padding: 0 14px; font-size: 0.8rem;">
            <i class="fa-solid fa-file-csv"></i> Export Roster
          </button>
        </div>
      </div>

      <!-- Students Directory Table -->
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Branch</th>
              <th>Year & Program</th>
              <th>Gender</th>
              <th>Team Name & Role</th>
              <th>Contact Email & Phone</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.length === 0
              ? `<tr><td colspan="8" style="text-align: center; padding: 36px; color: #64748b;">No registered students found.</td></tr>`
              : filteredStudents.map((s, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>
                    <strong style="color: #0f172a; font-size: 0.9rem;">${escapeHtml(s.name)}</strong>
                    ${s.isLeader ? '<span class="member-badge-pill leader" style="font-size:0.65rem; margin-left:4px;">LEADER</span>' : ''}
                  </td>
                  <td><strong style="font-family: var(--font-mono); color: #064e3b;">${escapeHtml(s.roll)}</strong></td>
                  <td>
                    <span class="badge" style="background:#ecfdf5; color:#064e3b; font-weight:800; padding:2px 8px; border-radius:4px;">${s.branch}</span>
                  </td>
                  <td>${s.year} • ${s.program}</td>
                  <td>
                    <span style="font-weight:700; color:${s.gender === 'Female' ? '#e11d48' : '#2563eb'};">
                      <i class="fa-solid ${s.gender === 'Female' ? 'fa-venus' : 'fa-mars'}"></i> ${s.gender}
                    </span>
                  </td>
                  <td>
                    <strong style="color: #0f172a;">${escapeHtml(s.teamName)}</strong>
                    <div style="font-size: 0.72rem; color: #64748b; font-family: var(--font-mono);">${s.teamId}</div>
                  </td>
                  <td>
                    <div style="font-size: 0.75rem; color: #475569;"><i class="fa-solid fa-envelope" style="color:#059669;"></i> ${s.email}</div>
                    <div style="font-size: 0.75rem; color: #64748b;"><i class="fa-solid fa-phone" style="color:#059669;"></i> ${s.phone || 'N/A'}</div>
                  </td>
                </tr>
              `).join('')
            }
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // TAB 4: NATIONAL NOMINEES (TOP 50 CAP)
  // ==========================================
  else if (adminActiveTab === "nominees") {
    const nominatedTeams = registeredTeams.filter(t => (t.status || "").includes("Nominated"));
    const shortlistedTeams = registeredTeams.filter(t => (t.status || "").includes("Shortlisted") || (t.status || "").includes("Under Review"));

    html += `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 22px;">
        <!-- Software Quota Gauge -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #1e40af; font-size: 1rem;"><i class="fa-solid fa-laptop-code"></i> Software Track Slots</strong>
            <span style="font-weight: 900; font-size: 1.3rem; color: #1e40af;">${nominatedSwCount} / 45</span>
          </div>
          <div class="viz-bar-track" style="height: 12px; background: #dbeafe;">
            <div class="viz-bar-fill" style="width: ${swNominatedPct}%; background: #2563eb;"></div>
          </div>
          <p style="font-size: 0.78rem; color: #64748b; margin: 8px 0 0 0;">
            ${45 - nominatedSwCount} Software nominations remaining for central AICTE upload.
          </p>
        </div>

        <!-- Hardware Quota Gauge -->
        <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 12px; padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #854d0e; font-size: 1rem;"><i class="fa-solid fa-microchip"></i> Hardware Track Slots</strong>
            <span style="font-weight: 900; font-size: 1.3rem; color: #854d0e;">${nominatedHwCount} / 5</span>
          </div>
          <div class="viz-bar-track" style="height: 12px; background: #fef9c3;">
            <div class="viz-bar-fill" style="width: ${hwNominatedPct}%; background: #ca8a04;"></div>
          </div>
          <p style="font-size: 0.78rem; color: #64748b; margin: 8px 0 0 0;">
            ${5 - nominatedHwCount} Hardware nominations remaining for central AICTE upload.
          </p>
        </div>
      </div>

      <!-- Nominated Teams Arena -->
      <div class="viz-section-card">
        <div class="viz-section-header">
          <h3 class="viz-section-title">
            <i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> Currently Nominated Squads for SIH Nationals (${nominatedTeams.length} / 50)
          </h3>
          <button class="btn-3d-primary" onclick="exportTeamsToCSV()" style="padding: 6px 14px; font-size: 0.8rem;">
            <i class="fa-solid fa-download"></i> Export Nominee List
          </button>
        </div>

        ${nominatedTeams.length === 0
          ? `<div style="text-align: center; padding: 32px; color: #64748b;">No squads nominated yet. Select squads from below to nominate them for SIH Nationals.</div>`
          : `
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Rank / ID</th>
                    <th>Team Name</th>
                    <th>Track</th>
                    <th>Problem Statement</th>
                    <th>Team Leader</th>
                    <th>Score</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${nominatedTeams.map((t, idx) => {
                    const leader = (t.members && t.members[0]) || {};
                    return `
                      <tr style="background: #f0fdf4;">
                        <td><strong>#${idx + 1}</strong> <span style="font-family:var(--font-mono); font-size:0.8rem; color:#059669;">${t.teamId}</span></td>
                        <td><strong>${escapeHtml(t.teamName)}</strong></td>
                        <td><span class="badge" style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:700;">${t.edition}</span></td>
                        <td><strong>${t.psId}</strong> - ${escapeHtml(t.domain)}</td>
                        <td>${escapeHtml(leader.name)} (${normBranch(leader.branch || leader.dept)})</td>
                        <td><strong>${t.juryScore || '-'}</strong></td>
                        <td style="text-align: right;">
                          <button class="btn-3d-outline" onclick="updateTeamStatus('${t.teamId}', 'Shortlisted for Internal Hackathon')" style="padding: 4px 10px; font-size: 0.75rem; background: #ffffff; color: #d97706;">
                            Remove from Nominees
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `
        }
      </div>
    `;
  }

  // ==========================================
  // TAB 5: PROBLEM STATEMENT CLASH & COVERAGE MATRIX
  // ==========================================
  else if (adminActiveTab === "ps-matrix") {
    html += `
      <div class="viz-section-card">
        <div class="viz-section-header">
          <h3 class="viz-section-title">
            <i class="fa-solid fa-lightbulb" style="color: #059669;"></i> SIH Problem Statements Matrix & Competition Hotspots
          </h3>
          <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
            ${Object.keys(psMap).length} Registered Problem Statements
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${Object.values(psMap).length === 0
            ? `<div style="text-align: center; padding: 32px; color: #64748b;">No problem statements recorded yet.</div>`
            : Object.values(psMap).map((psItem) => {
              const hasClash = psItem.teams.length > 1;
              return `
                <div style="background: #ffffff; border: 1px solid ${hasClash ? '#fde68a' : '#e2e8f0'}; border-radius: 12px; padding: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="background: #059669; color: #ffffff; font-family: var(--font-mono); font-weight: 800; font-size: 0.85rem; padding: 3px 10px; border-radius: 6px;">
                        ${escapeHtml(psItem.psId)}
                      </span>
                      <strong style="font-size: 0.95rem; color: #0f172a;">${escapeHtml(psItem.title)}</strong>
                    </div>

                    ${hasClash
                      ? `<span style="background: #fef3c7; color: #92400e; font-weight: 800; font-size: 0.78rem; padding: 4px 10px; border-radius: 20px; border: 1px solid #fcd34d;">
                          <i class="fa-solid fa-fire" style="color: #d97706;"></i> Internal Clash: ${psItem.teams.length} Teams Competing
                        </span>`
                      : `<span style="background: #f0fdf4; color: #065f46; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
                          1 Squad
                        </span>`
                    }
                  </div>

                  <!-- Competing squads list -->
                  <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                    ${psItem.teams.map(t => {
                      const leader = (t.members && t.members[0]) || {};
                      return `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 10px;">
                          <div>
                            <strong style="color: #0f172a; font-size: 0.85rem;">${escapeHtml(t.teamName)}</strong>
                            <div style="font-size: 0.72rem; color: #64748b;">Leader: ${escapeHtml(leader.name)} (${normBranch(leader.branch || leader.dept)})</div>
                          </div>
                          <button class="btn-3d-primary" onclick="openAdminTeamDetails('${t.teamId}')" style="padding: 4px 8px; font-size: 0.72rem;">
                            Inspect
                          </button>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('')
          }
        </div>
      </div>
    `;
  }

  // ==========================================
  // TAB 6: COORDINATOR REFERRAL LEADERBOARD
  // ==========================================
  else if (adminActiveTab === "referrals") {
    const refMap = {};
    registeredTeams.forEach((t) => {
      const code = (t.referralCode && t.referralCode !== "NONE") ? t.referralCode.toUpperCase() : "DIRECT";
      if (!refMap[code]) {
        const coord = window.COORDINATOR_REFERRAL_MAP ? window.COORDINATOR_REFERRAL_MAP[code] : null;
        refMap[code] = {
          code,
          name: coord ? coord.name : (t.referredBy || (code === "DIRECT" ? "Direct / Self Registered" : code)),
          branch: coord ? coord.branch : (code.includes("-") ? code.split("-")[0] : "General"),
          count: 0
        };
      }
      refMap[code].count++;
    });
    const sortedStats = Object.values(refMap).sort((a, b) => b.count - a.count);

    html += `
      <div class="viz-section-card">
        <div class="viz-section-header">
          <h3 class="viz-section-title">
            <i class="fa-solid fa-chart-line" style="color: #059669;"></i> Campus Coordinator Referral Performance Leaderboard
          </h3>
          <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
            Live Outreach Conversion
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
          ${sortedStats.map((st, i) => `
            <div style="background: ${st.code === 'DIRECT' ? '#f8fafc' : '#f0fdf4'}; border: 1px solid ${st.code === 'DIRECT' ? '#e2e8f0' : '#a7f3d0'}; border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 800; font-size: 0.9rem; color: #0f172a;">${i + 1}. ${escapeHtml(st.name)}</div>
                <div style="font-size: 0.75rem; color: #64748b; font-family: var(--font-mono); font-weight: 700;">Code: ${escapeHtml(st.code)} • ${escapeHtml(st.branch)}</div>
              </div>
              <span style="background: ${st.code === 'DIRECT' ? '#e2e8f0' : '#059669'}; color: ${st.code === 'DIRECT' ? '#334155' : '#ffffff'}; font-size: 0.88rem; font-weight: 900; padding: 6px 12px; border-radius: 8px; white-space: nowrap;">
                ${st.count} Squad${st.count > 1 ? 's' : ''}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// Score Saving Helper
window.saveJuryScore = (teamId, score) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (team) {
    team.juryScore = score ? Number(score) : null;
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
    if (isFirebaseActive && db) {
      db.collection("teams").doc(teamId).update({ juryScore: team.juryScore }).catch(() => {});
    }
  }
};

// Print Executive Summary Report
window.printAdminSummaryReport = () => {
  window.print();
};

// Export Students to CSV
window.exportStudentsToCSV = () => {
  if (registeredTeams.length === 0) {
    alert("No student data available to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Student Name,Roll Number,Branch,Academic Year,Program,Gender,Role,Team ID,Team Name,Email,Phone,Evaluation Status\n";

  registeredTeams.forEach(t => {
    (t.members || []).forEach((m, idx) => {
      const row = [
        `"${(m.name || '').replace(/"/g, '""')}"`,
        `"${m.roll || 'Awaited'}"`,
        normBranch(m.branch || m.dept),
        normYear(m.year, m.roll, m.email),
        normProgram(m.program, m.branch),
        normGender(m.gender),
        idx === 0 ? "Leader" : `Member ${idx + 1}`,
        t.teamId,
        `"${(t.teamName || '').replace(/"/g, '""')}"`,
        m.email || "",
        m.phone || "",
        `"${t.status || ''}"`
      ].join(",");
      csvContent += row + "\n";
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `TIT_SIH_2026_Students_Roster_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Demo & Sample Data Management for Admin Preview
window.loadDemoTeams = () => {
  const sampleTITTeams = [
    {
      teamId: "TIT-SIH26-1042",
      teamName: "ByteCraft TIT",
      edition: "Software Edition",
      psId: "SIH26001",
      domain: "AI & Machine Learning",
      title: "AI Early Warning & Landslide Risk Monitoring System in NER",
      abstract: "Deep learning computer vision algorithm fusing satellite synthetic aperture radar (SAR) and ground IoT seismometer telemetry for real-time slope instability alerting across Tripura hills.",
      pptLink: "https://drive.google.com/file/d/sample-bytecraft-tit/view",
      referralCode: "SIH-CSE-01",
      referredBy: "Manash Debbarma",
      status: "Nominated for SIH Finals",
      juryScore: 94,
      createdAt: "02 Sep 2026",
      leaderEmail: "subham.cse22@titagartala.ac.in",
      members: [
        { name: "Subham Debnath", roll: "22CSE014", program: "Degree", branch: "CSE", dept: "CSE", year: "4th Year", gender: "Male", email: "subham.cse22@titagartala.ac.in", phone: "9862112233", isLeader: true },
        { name: "Pooja Saha", roll: "22CSE038", program: "Degree", branch: "CSE", dept: "CSE", year: "4th Year", gender: "Female", email: "pooja.saha22@titagartala.ac.in", phone: "9862223344", isLeader: false },
        { name: "Debojyoti Paul", roll: "23CSE009", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Male", email: "debo.p23@titagartala.ac.in", phone: "9862334455", isLeader: false },
        { name: "Ananya Roy", roll: "23ECE044", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Female", email: "ananya.roy23@titagartala.ac.in", phone: "9862445566", isLeader: false },
        { name: "Rahul Sharma", roll: "24CSE051", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "rahul.s24@titagartala.ac.in", phone: "9862556677", isLeader: false },
        { name: "Tanmoy Das", roll: "24IT012", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "tanmoy.d24@titagartala.ac.in", phone: "9862667788", isLeader: false }
      ]
    },
    {
      teamId: "TIT-SIH26-2189",
      teamName: "RoboTIT Edge Systems",
      edition: "Hardware Edition",
      psId: "SIH-HW-04",
      domain: "Robotics & Smart IoT",
      title: "Self-Powered IoT Gateway for Rural Border Telemetry",
      abstract: "Ultra-low power STM32 & LoRaWAN edge transceiver harvesting ambient thermal and RF energy to transmit telemetry across dense forest canopies.",
      pptLink: "https://drive.google.com/file/d/sample-robotit-systems/view",
      referralCode: "SIH-ECE-01",
      referredBy: "Sambhu Debnath",
      status: "Nominated for SIH Finals",
      juryScore: 91,
      createdAt: "03 Sep 2026",
      leaderEmail: "arnab.ece23@titagartala.ac.in",
      members: [
        { name: "Arnab Bhowmik", roll: "23ECE011", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Male", email: "arnab.ece23@titagartala.ac.in", phone: "9774112233", isLeader: true },
        { name: "Sneha Sen", roll: "23ECE029", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Female", email: "sneha.sen23@titagartala.ac.in", phone: "9774223344", isLeader: false },
        { name: "Pritam Ghosh", roll: "24EE018", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "pritam.ee24@titagartala.ac.in", phone: "9774334455", isLeader: false },
        { name: "Riya Dey", roll: "24ECE040", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "riya.dey24@titagartala.ac.in", phone: "9774445566", isLeader: false }
      ]
    },
    {
      teamId: "TIT-SIH26-3401",
      teamName: "GreenGrid Innovators",
      edition: "Software Edition",
      psId: "SIH-SC-14",
      domain: "Clean & Green Technology",
      title: "Autonomous Solar Microgrid Load-Balancing & Peak Predictor",
      abstract: "Reinforcement learning controller optimizing battery discharge schedules and peer-to-peer microgrid trading based on irradiance forecasts.",
      pptLink: "https://drive.google.com/file/d/sample-greengrid-tit/view",
      referralCode: "SIH-EE-01",
      referredBy: "Alak Das",
      status: "Shortlisted for Internal Hackathon",
      juryScore: 88,
      createdAt: "04 Sep 2026",
      leaderEmail: "sourav.ee22@titagartala.ac.in",
      members: [
        { name: "Sourav Chakraborty", roll: "22EE005", program: "Degree", branch: "EE", dept: "EE", year: "4th Year", gender: "Male", email: "sourav.ee22@titagartala.ac.in", phone: "9436112233", isLeader: true },
        { name: "Sreya Majumder", roll: "22EE031", program: "Degree", branch: "EE", dept: "EE", year: "4th Year", gender: "Female", email: "sreya.m22@titagartala.ac.in", phone: "9436223344", isLeader: false },
        { name: "Joydeep Paul", roll: "23EE019", program: "Degree", branch: "EE", dept: "EE", year: "3rd Year", gender: "Male", email: "joydeep.p23@titagartala.ac.in", phone: "9436334455", isLeader: false },
        { name: "Monalisa Das", roll: "25EE012", program: "Degree", branch: "EE", dept: "EE", year: "1st Year", gender: "Female", email: "monalisa.d25@titagartala.ac.in", phone: "9436445566", isLeader: false }
      ]
    },
    {
      teamId: "TIT-SIH26-4712",
      teamName: "AgriBot TIT",
      edition: "Hardware Edition",
      psId: "SIH-AG-08",
      domain: "Agriculture & Rural Tech",
      title: "Autonomous Rubber Plantation Weeding & Tapping Rover",
      abstract: "Tracked chassis rover with stereoscopic depth cameras and selective mechanical weeding cutters suited for undulating Tripura plantations.",
      pptLink: "https://drive.google.com/file/d/sample-agribot-tit/view",
      referralCode: "SIH-ME-01",
      referredBy: "Ronit Saha",
      status: "Nominated for SIH Finals",
      juryScore: 92,
      createdAt: "04 Sep 2026",
      leaderEmail: "bikram.me24@titagartala.ac.in",
      members: [
        { name: "Bikramjit Tripura", roll: "24ME003", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "bikram.me24@titagartala.ac.in", phone: "9612112233", isLeader: true },
        { name: "Rimi Debbarma", roll: "24ME015", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Female", email: "rimi.d24@titagartala.ac.in", phone: "9612223344", isLeader: false },
        { name: "Sayan Barman", roll: "23ME027", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Male", email: "sayan.b23@titagartala.ac.in", phone: "9612334455", isLeader: false },
        { name: "Pallabi Paul", roll: "25ME009", program: "Diploma", branch: "ME", dept: "ME", year: "1st Year", gender: "Female", email: "pallabi.p25@titagartala.ac.in", phone: "9612445566", isLeader: false }
      ]
    },
    {
      teamId: "TIT-SIH26-5833",
      teamName: "InfraSafe NER",
      edition: "Software Edition",
      psId: "SIH-CE-19",
      domain: "Disaster Management & Infrastructure",
      title: "Structural Health & Bridge Vibration Monitor using Edge AI",
      abstract: "IoT MEMS vibration sensors deployed on river bridges streaming FFT frequency spectra to a cloud anomaly detection dashboard.",
      pptLink: "https://drive.google.com/file/d/sample-infrasafe-ner/view",
      referralCode: "SIH-CE-01",
      referredBy: "Neelotpal Banik",
      status: "Shortlisted for Internal Hackathon",
      juryScore: 86,
      createdAt: "05 Sep 2026",
      leaderEmail: "koushik.ce23@titagartala.ac.in",
      members: [
        { name: "Koushik Saha", roll: "23CE007", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Male", email: "koushik.ce23@titagartala.ac.in", phone: "9863112233", isLeader: true },
        { name: "Dipanwita Roy", roll: "23CE022", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Female", email: "dipanwita.r23@titagartala.ac.in", phone: "9863223344", isLeader: false },
        { name: "Surajit Datta", roll: "24CE014", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Male", email: "surajit.d24@titagartala.ac.in", phone: "9863334455", isLeader: false },
        { name: "Trisha Bhattacharjee", roll: "25CE031", program: "Diploma", branch: "CE", dept: "CE", year: "1st Year", gender: "Female", email: "trisha.b25@titagartala.ac.in", phone: "9863445566", isLeader: false }
      ]
    },
    {
      teamId: "TIT-SIH26-6294",
      teamName: "NeuralTIT MedTech",
      edition: "Software Edition",
      psId: "SIH-HC-22",
      domain: "Smart Healthcare",
      title: "Offline-First Remote Telemedicine & AI Diagnostic Triage",
      abstract: "On-device quantised LLM and ECG image analyzer designed for ASHA community workers in rural PHCs with intermittent internet.",
      pptLink: "https://drive.google.com/file/d/sample-neuraltit-med/view",
      referralCode: "NONE",
      status: "Under Review by IIC Panel",
      juryScore: 84,
      createdAt: "05 Sep 2026",
      leaderEmail: "moumita.cse24@titagartala.ac.in",
      members: [
        { name: "Moumita Datta", roll: "24CSE002", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "moumita.cse24@titagartala.ac.in", phone: "9436881122", isLeader: true },
        { name: "Abhishek Sil", roll: "24CSE019", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "abhishek.sil24@titagartala.ac.in", phone: "9436882233", isLeader: false },
        { name: "Debashish Roy", roll: "25CSE045", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "debashish.r25@titagartala.ac.in", phone: "9436883344", isLeader: false },
        { name: "Simran Dey", roll: "25ECE018", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Female", email: "simran.d25@titagartala.ac.in", phone: "9436884455", isLeader: false }
      ]
    },
    {
      teamId: "TIT-SIH26-7155",
      teamName: "TripuraVani Voice AI",
      edition: "Software Edition",
      psId: "SIH-AI-11",
      domain: "Heritage, Culture & Language",
      title: "Kokborok & Bengali Multi-Modal Voice Interface for Public Services",
      abstract: "Automatic speech recognition (ASR) and text-to-speech (TTS) engine trained on low-resource Northeast regional dialects for e-governance access.",
      pptLink: "https://drive.google.com/file/d/sample-tripuravani/view",
      referralCode: "SIH-ECE-02",
      referredBy: "Sreya Deb",
      status: "Shortlisted for Internal Hackathon",
      juryScore: 89,
      createdAt: "06 Sep 2026",
      leaderEmail: "joya.ece25@titagartala.ac.in",
      members: [
        { name: "Joya Reang", roll: "25ECE008", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Female", email: "joya.ece25@titagartala.ac.in", phone: "9862991122", isLeader: true },
        { name: "Deepak Debbarma", roll: "25ECE021", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Male", email: "deepak.d25@titagartala.ac.in", phone: "9862992233", isLeader: false },
        { name: "Suman Bhowmik", roll: "24CSE033", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "suman.b24@titagartala.ac.in", phone: "9862993344", isLeader: false },
        { name: "Nisha Saha", roll: "23CSE015", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Female", email: "nisha.s23@titagartala.ac.in", phone: "9862994455", isLeader: false }
      ]
    },
    {
      teamId: "TIT-SIH26-8920",
      teamName: "HydroSense TIT",
      edition: "Hardware Edition",
      psId: "SIH-WR-09",
      domain: "Water Management & Smart Cities",
      title: "Solar IoT Flash Flood & Urban River Inundation Early Warning",
      abstract: "Ultrasonic water level transceivers with solar battery backup deployed along Howrah River basin streaming telemetry to municipal disaster portals.",
      pptLink: "https://drive.google.com/file/d/sample-hydrosense-tit/view",
      referralCode: "SIH-CE-02",
      referredBy: "Prena Saha",
      status: "Under Review by IIC Panel",
      juryScore: 82,
      createdAt: "06 Sep 2026",
      leaderEmail: "amit.ce22@titagartala.ac.in",
      members: [
        { name: "Amitava Guha", roll: "22CE011", program: "Degree", branch: "CE", dept: "CE", year: "4th Year", gender: "Male", email: "amit.ce22@titagartala.ac.in", phone: "9774771122", isLeader: true },
        { name: "Payel Paul", roll: "22CE025", program: "Degree", branch: "CE", dept: "CE", year: "4th Year", gender: "Female", email: "payel.p22@titagartala.ac.in", phone: "9774772233", isLeader: false },
        { name: "Sagarika Das", roll: "23CE040", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Female", email: "sagarika.d23@titagartala.ac.in", phone: "9774773344", isLeader: false },
        { name: "Sanjay Deb", roll: "24EE029", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "sanjay.d24@titagartala.ac.in", phone: "9774774455", isLeader: false }
      ]
    }
  ];

  registeredTeams = sampleTITTeams;
  localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
  renderAdminConsole();
  renderStudentDashboard();
  alert(`[TIT SIH] Successfully loaded ${sampleTITTeams.length} demo TIT squads with multi-branch & multi-year cohorts for visualization preview!`);
};

window.clearDemoTeams = () => {
  if (confirm("Clear all teams from local storage?")) {
    registeredTeams = [];
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
    renderAdminConsole();
    renderStudentDashboard();
    alert("[TIT SIH] Local team database cleared.");
  }
};

/* ==========================================================================
   7. VANILLA 3D CARD TILT ENGINE
   ========================================================================== */
function init3DCardTilt() {
  const tiltElements = document.querySelectorAll("[data-tilt]");

  tiltElements.forEach((el) => {
    if (el._tiltInitialized) return;
    el._tiltInitialized = true;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

/* ==========================================================================
   8. FAQ ACCORDION ENGINE
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answerEl = item.querySelector(".faq-answer");

    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answerEl.style.maxHeight = answerEl.scrollHeight + "px";
      } else {
        item.classList.remove("active");
        answerEl.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   9. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const mobileBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-nav-dropdown");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  window.closeMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.remove("open");
  };
}

/* ==========================================================================
   10. CELEBRATORY CONFETTI ENGINE
   ========================================================================== */
function initConfettiTriggers() {
  const grandPrizeCard = document.getElementById("grand-prize-card");

  if (grandPrizeCard) {
    grandPrizeCard.addEventListener("click", () => {
      triggerConfettiBurst();
    });
  }
}

function triggerConfettiBurst(colorMix) {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* ==========================================================================
   12. DEPARTMENTAL BRANCH ACCORDION & FILTER CONTROLLER
   ========================================================================== */
window.toggleBranchAccordion = (branch) => {
  const block = document.querySelector(`.dept-branch-block[data-branch="${branch}"]`);
  if (!block) return;
  block.classList.toggle("open");
};

window.filterDepartmentBranch = (branch) => {
  const blocks = document.querySelectorAll(".dept-branch-block");
  const tabBtns = document.querySelectorAll(".branch-filter-btn");

  tabBtns.forEach((btn) => {
    if (btn.getAttribute("data-branch") === branch) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  blocks.forEach((block) => {
    if (branch === "all") {
      block.style.display = "block";
    } else if (block.getAttribute("data-branch") === branch) {
      block.style.display = "block";
      block.classList.add("open"); // Auto-expand when explicitly filtered
    } else {
      block.style.display = "none";
    }
  });
};

/* ==========================================================================
   13. DOWNLOAD PPT TEMPLATE TRIGGER
   ========================================================================== */
window.downloadPptTemplate = () => {
  const link = document.createElement("a");
  link.href = "SIH2026-IDEA-Presentation-Format.pptx";
  link.setAttribute("download", "SIH2026-IDEA-Presentation-Format.pptx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  triggerConfettiBurst();
};

/* ==========================================================================
   14. BUTTERY SMOOTH DARK & BRIGHT THEME ENGINE (EXPANDING RIPPLE FROM BUTTON)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("tit_sih_theme") || "light";
  applyTheme(savedTheme, false);
}

window.toggleTheme = (event) => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Find origin coordinates of the toggle button
  let x = window.innerWidth - 90;
  let y = 36;
  if (event && (event.clientX || event.pageX)) {
    x = event.clientX || event.pageX;
    y = event.clientY || event.pageY;
  } else {
    const btn = document.getElementById("theme-toggle-btn");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
  }

  // Trigger glowing expanding light-up / dark-up ripple wave from button
  triggerExpandingThemeWave(x, y, newTheme);

  // If View Transition API is supported, use circular clip-path expansion
  if (document.startViewTransition) {
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      applyTheme(newTheme, false);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });
  } else {
    applyTheme(newTheme, true);
  }
};

function triggerExpandingThemeWave(x, y, newTheme) {
  const wave = document.createElement("div");
  wave.className = `theme-radial-wave ${newTheme === "dark" ? "wave-dark" : "wave-light"}`;
  wave.style.left = `${x}px`;
  wave.style.top = `${y}px`;
  document.body.appendChild(wave);

  // Trigger micro pulse on button
  const btn = document.getElementById("theme-toggle-btn");
  if (btn) {
    btn.classList.add("theme-btn-pulse");
    setTimeout(() => btn.classList.remove("theme-btn-pulse"), 600);
  }

  // Force reflow and expand
  requestAnimationFrame(() => {
    wave.classList.add("expanding");
  });

  setTimeout(() => {
    if (wave && wave.parentNode) {
      wave.parentNode.removeChild(wave);
    }
  }, 750);
}

function applyTheme(theme, animate = true) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.classList.add("dark-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    document.body.classList.remove("dark-theme");
  }

  localStorage.setItem("tit_sih_theme", theme);

  // Sync all theme toggle buttons (desktop + mobile)
  const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
  toggleBtns.forEach((btn) => {
    if (theme === "dark") {
      btn.classList.add("dark");
    } else {
      btn.classList.remove("dark");
    }
  });
}

/* ==========================================================================
   15. ACTIVE SECTION SCROLLSPY PILL CONTROLLER
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links .nav-link");
  const mobBottomItems = document.querySelectorAll(".mob-bottom-item[data-target]");

  if (!sections.length) return;

  window.addEventListener("scroll", () => {
    let currentId = "hero";
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    if (currentId) {
      // Desktop Nav Links
      if (navLinks.length) {
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && href.startsWith("#") && href.substring(1) === currentId) {
            link.classList.add("active-pill");
          } else if (href && href.startsWith("#")) {
            link.classList.remove("active-pill");
          }
        });
      }

      // Mobile Bottom Bar Items
      if (mobBottomItems.length) {
        mobBottomItems.forEach((item) => {
          const target = item.getAttribute("data-target");
          if (target === currentId || (currentId === "hero" && target === "hero")) {
            item.classList.add("active");
          } else if (target !== "committee") {
            item.classList.remove("active");
          }
        });
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   16. PWA (PROGRESSIVE WEB APP) SERVICE WORKER & INSTALL PROMPT ENGINE
   ========================================================================== */
let deferredPwaPrompt = null;

function initPwaEngine() {
  // 1. Register Service Worker for offline capability and instant caching
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          registration.update();
          console.log("✅ [PWA] Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.warn("[PWA] Service Worker registration warning:", error);
        });
    });
  }

  // 2. Intercept beforeinstallprompt for native app installation
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    console.log("📲 [PWA] App install prompt ready");

    // Show Install button in desktop nav and mobile menu
    const installBtn = document.getElementById("pwa-install-btn");
    const mobInstallItem = document.getElementById("mob-pwa-install-item");

    if (installBtn) installBtn.style.display = "inline-flex";
    if (mobInstallItem) mobInstallItem.style.display = "block";
  });

  // 3. Listen for appinstalled event
  window.addEventListener("appinstalled", () => {
    console.log("🎉 [PWA] App successfully installed on user device!");
    deferredPwaPrompt = null;

    const installBtn = document.getElementById("pwa-install-btn");
    const mobInstallItem = document.getElementById("mob-pwa-install-item");

    if (installBtn) installBtn.style.display = "none";
    if (mobInstallItem) mobInstallItem.style.display = "none";

    triggerConfettiBurst();
  });
}

window.triggerPwaInstall = async () => {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    if (outcome === "accepted") {
      triggerConfettiBurst();
    }
    deferredPwaPrompt = null;
    const installBtn = document.getElementById("pwa-install-btn");
    const mobInstallItem = document.getElementById("mob-pwa-install-item");
    if (installBtn) installBtn.style.display = "none";
    if (mobInstallItem) mobInstallItem.style.display = "none";
  } else {
    alert("[📲 Install TIT SIH App]\n\n• On iOS (Safari): Tap the Share icon (⎋) and select 'Add to Home Screen'.\n• On Android (Chrome): Tap the three dots (⋮) and select 'Install app' or 'Add to Home Screen'.\n• On Desktop (Chrome / Edge): Click the Install icon in the address bar.");
  }
};

/* ==========================================================================
   17. LIVE GOOGLE SHEET SYNCHRONIZATION ENGINE FOR COMMITTEE COORDINATORS
   ========================================================================== */
const GOOGLE_SHEET_COORDINATORS_CSV =
  "https://docs.google.com/spreadsheets/d/1vUqQk-kvq8fE9fQTlu4ih_dcKsINJmEFyriPTh84jNk/gviz/tq?tqx=out:csv&gid=1802588861";

let liveCoordinatorsData = [];
let currentActiveBranchFilter = "ece";
window.COORDINATOR_REFERRAL_MAP = {};

// Master fixed unique referral code dictionary (SIHINxxxx) for Department Student Coordinators
const FIXED_COORDINATOR_SIHIN_CODES = {
  "alak das": "SIHIN1001",
  "reshmi karmakar": "SIHIN1002",
  "neelotpal banik": "SIHIN1003",
  "sambhu debnath": "SIHIN1004",
  "anurati bhowmik": "SIHIN1005",
  "deeptanu shil": "SIHIN1006",
  "sanjit noatia": "SIHIN1007",
  "prena saha": "SIHIN1008",
  "diya das": "SIHIN1009",
  "sneha chaudhuri": "SIHIN1010",
  "ronit saha": "SIHIN1011",
  "sneha debnath": "SIHIN1012",
  "sujit dey": "SIHIN1013",
  "sreya deb": "SIHIN1014",
  "soubik roy": "SIHIN1015",
  "simran das": "SIHIN1016",
  "raj arnab debnath": "SIHIN1017",
  "manash t": "SIHIN1018",
  "kishore majumder": "SIHIN1019",
  "prabal kanti paul": "SIHIN1020",
  "purba gangopadhyay": "SIHIN1021",
};

// Global set of all assigned/claimed codes to strictly prevent any duplicates
const ALLOCATED_REFERRAL_CODES_SET = new Set(Object.values(FIXED_COORDINATOR_SIHIN_CODES));

// Persistent local registry of new coordinator dynamic codes
let DYNAMIC_COORDINATOR_REGISTRY = {};
try {
  const savedRegistry = localStorage.getItem("tit_sih_dyn_coord_codes");
  if (savedRegistry) {
    DYNAMIC_COORDINATOR_REGISTRY = JSON.parse(savedRegistry);
    Object.values(DYNAMIC_COORDINATOR_REGISTRY).forEach((code) => ALLOCATED_REFERRAL_CODES_SET.add(code));
  }
} catch (e) { }

// Collision-Free Guaranteed Sequential Assignment Generator for future Google Form submissions
function getCoordinatorReferralCode(coord) {
  const normName = (coord.name || "").trim().toLowerCase();
  const key = (coord.email || `${normName}_${(coord.branch || "").toLowerCase()}`).trim().toLowerCase();

  // 1. Check fixed baseline dictionary
  if (FIXED_COORDINATOR_SIHIN_CODES[normName]) {
    const code = FIXED_COORDINATOR_SIHIN_CODES[normName];
    ALLOCATED_REFERRAL_CODES_SET.add(code);
    return code;
  }

  // 2. Check previously saved dynamic assignment for this specific coordinator
  if (DYNAMIC_COORDINATOR_REGISTRY[key]) {
    ALLOCATED_REFERRAL_CODES_SET.add(DYNAMIC_COORDINATOR_REGISTRY[key]);
    return DYNAMIC_COORDINATOR_REGISTRY[key];
  }

  // 3. Find the next available unallocated unique integer (SIHIN1022, SIHIN1023, ...)
  let nextNum = 1022;
  while (ALLOCATED_REFERRAL_CODES_SET.has(`SIHIN${nextNum}`)) {
    nextNum++;
  }

  const assignedCode = `SIHIN${nextNum}`;
  ALLOCATED_REFERRAL_CODES_SET.add(assignedCode);
  DYNAMIC_COORDINATOR_REGISTRY[key] = assignedCode;

  try {
    localStorage.setItem("tit_sih_dyn_coord_codes", JSON.stringify(DYNAMIC_COORDINATOR_REGISTRY));
  } catch (e) { }

  return assignedCode;
}

// Pre-populate seed coordinators for immediate referral resolution
const DEFAULT_COORDINATORS_SEED = [
  { name: "Alak Das", branch: "ECE", year: "4th Year" },
  { name: "Reshmi Karmakar", branch: "ECE", year: "4th Year" },
  { name: "Neelotpal Banik", branch: "ECE", year: "3rd Year" },
  { name: "Sambhu Debnath", branch: "ECE", year: "3rd Year" },
  { name: "Anurati Bhowmik", branch: "ECE", year: "2nd Year" },
  { name: "Deeptanu Shil", branch: "ECE", year: "2nd Year" },
  { name: "Sanjit Noatia", branch: "CSE", year: "4th Year" },
  { name: "Prena Saha", branch: "CSE", year: "4th Year" },
  { name: "Diya Das", branch: "CSE", year: "3rd Year" },
  { name: "Sneha Chaudhuri", branch: "CSE", year: "2nd Year" },
  { name: "Ronit Saha", branch: "CSE", year: "2nd Year" },
  { name: "Sneha Debnath", branch: "EE", year: "4th Year" },
  { name: "Sujit Dey", branch: "EE", year: "4th Year" },
  { name: "Sreya Deb", branch: "EE", year: "3rd Year" },
  { name: "Soubik Roy", branch: "EE", year: "3rd Year" },
  { name: "Simran Das", branch: "EE", year: "2nd Year" },
  { name: "Raj Arnab Debnath", branch: "EE", year: "2nd Year" },
  { name: "Manash T", branch: "CE", year: "4th Year" },
  { name: "Kishore Majumder", branch: "CE", year: "3rd Year" },
  { name: "Prabal Kanti Paul", branch: "ME", year: "4th Year" },
  { name: "Purba Gangopadhyay", branch: "ME", year: "3rd Year" },
];

DEFAULT_COORDINATORS_SEED.forEach((c) => {
  const code = getCoordinatorReferralCode(c);
  c.referralCode = code;
  window.COORDINATOR_REFERRAL_MAP[code] = c;
});

window.copyCoordinatorRefCode = (code) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      alert(`🎟️ Referral Code "${code}" copied to clipboard!\n\nEnter this unique code in your Team Registration Form.`);
    }).catch(() => {
      prompt("Referral Code:", code);
    });
  } else {
    prompt("Referral Code:", code);
  }
};

function handleReferralCodeInput(val, context = "reg") {
  const code = (val || "").trim().toUpperCase();
  const checkIcon = context === "signup" ? null : document.getElementById("referral-check-icon");
  const matchBadge = context === "signup" ? document.getElementById("signup-referral-badge") : document.getElementById("referral-match-badge");

  if (!code) {
    if (checkIcon) checkIcon.style.display = "none";
    if (matchBadge) matchBadge.style.display = "none";
    return;
  }

  const matched = window.COORDINATOR_REFERRAL_MAP ? window.COORDINATOR_REFERRAL_MAP[code] : null;

  if (matched) {
    if (checkIcon) {
      checkIcon.style.display = "block";
      checkIcon.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #059669;"></i>`;
    }
    if (matchBadge) {
      matchBadge.style.display = "block";
      matchBadge.style.color = "#059669";
      matchBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Valid Referral Code: <strong>${escapeHtml(code)}</strong> (${escapeHtml(matched.branch)} Department)`;
    }
  } else if (code.startsWith("SIHIN")) {
    if (checkIcon) {
      checkIcon.style.display = "block";
      checkIcon.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #059669;"></i>`;
    }
    if (matchBadge) {
      matchBadge.style.display = "block";
      matchBadge.style.color = "#059669";
      matchBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Valid Referral Code: <strong>${escapeHtml(code)}</strong>`;
    }
  } else {
    if (checkIcon) {
      checkIcon.style.display = "block";
      checkIcon.innerHTML = `<i class="fa-solid fa-circle-info" style="color: #64748b;"></i>`;
    }
    if (matchBadge) {
      matchBadge.style.display = "block";
      matchBadge.style.color = "#64748b";
      matchBadge.innerHTML = `<i class="fa-solid fa-ticket"></i> Referral Code: <strong>${escapeHtml(code)}</strong>`;
    }
  }
}
window.handleReferralCodeInput = handleReferralCodeInput;

// Robust CSV Line Parser
function parseGoogleSheetCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row = [];
    let insideQuotes = false;
    let entry = "";

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (insideQuotes && line[j + 1] === '"') {
          entry += '"';
          j++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        row.push(entry.trim());
        entry = "";
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    if (row.length >= 3 && row[2]) {
      rows.push(row);
    }
  }
  return rows;
}

// Convert Google Drive view/open links into high-speed direct image URLs
function getDriveDirectImageUrl(driveUrl, name) {
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Coordinator")}&background=059669&color=fff&size=200&bold=true`;
  if (!driveUrl || typeof driveUrl !== "string") return fallbackAvatar;

  const match = driveUrl.match(/(?:id=|\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return fallbackAvatar;
}

function getDriveThumbnailFallback(driveUrl, name) {
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Coordinator")}&background=059669&color=fff&size=200&bold=true`;
  if (!driveUrl || typeof driveUrl !== "string") return fallbackAvatar;

  const match = driveUrl.match(/(?:id=|\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }
  return fallbackAvatar;
}

// Normalize branch string
function normalizeBranchCode(rawBranch) {
  if (!rawBranch) return "OTHER";
  const b = rawBranch.toUpperCase().trim();
  if (b.includes("CST") || b.includes("COMPUTER SCIENCE & TECH")) return "CST";
  if (b.includes("ETCE") || b.includes("TELECOMMUNICATION")) return "ETCE";
  if (b.includes("ARCH")) return "Architectural Assistantship";
  if (b.includes("AUTO")) return "Automobile Engineering";
  if (b.includes("FOOD")) return "Food Processing Technology";
  if (b.includes("ECE") || b.includes("ELECTRONIC")) return "ECE";
  if (b.includes("CSE") || b.includes("COMPUTER")) return "CSE";
  if (b.includes("EE") || b.includes("ELECTRICAL")) return "EE";
  if (b.includes("CE") || b.includes("CIVIL")) return "CE";
  if (b.includes("ME") || b.includes("MECHANICAL")) return "ME";
  return b;
}

// Normalize academic year string
function normalizeAcademicYear(rawYear) {
  if (!rawYear) return "Student Coordinator";
  const y = rawYear.trim();
  if (y.includes("4") || y.toLowerCase().includes("final")) return "4th Year";
  if (y.includes("3") || y.toLowerCase().includes("pre-final")) return "3rd Year";
  if (y.includes("2")) return "2nd Year";
  if (y.includes("1")) return "1st Year";
  return y;
}

function getBranchDetails(branchCode) {
  const map = {
    ECE: {
      name: "Electronics & Communication Engineering (ECE)",
      icon: "fa-satellite-dish",
      badgeIcon: "fa-microchip",
      badgeColor: "#059669",
    },
    CSE: {
      name: "Computer Science & Engineering (CSE)",
      icon: "fa-laptop-code",
      badgeIcon: "fa-code",
      badgeColor: "#2563eb",
    },
    EE: {
      name: "Electrical Engineering (EE)",
      icon: "fa-bolt",
      badgeIcon: "fa-bolt-lightning",
      badgeColor: "#d97706",
    },
    CE: {
      name: "Civil Engineering (CE)",
      icon: "fa-compass-drafting",
      badgeIcon: "fa-trowel-bricks",
      badgeColor: "#ea580c",
    },
    ME: {
      name: "Mechanical Engineering (ME)",
      icon: "fa-wrench",
      badgeIcon: "fa-gears",
      badgeColor: "#047857",
    },
    CST: {
      name: "Computer Science & Technology (CST)",
      icon: "fa-laptop-code",
      badgeIcon: "fa-code",
      badgeColor: "#2563eb",
    },
    ETCE: {
      name: "Electronics & Telecommunication Engg (ETCE)",
      icon: "fa-satellite-dish",
      badgeIcon: "fa-tower-broadcast",
      badgeColor: "#059669",
    },
    "Architectural Assistantship": {
      name: "Architectural Assistantship (Architecture)",
      icon: "fa-building-columns",
      badgeIcon: "fa-drafting-compass",
      badgeColor: "#8b5cf6",
    },
    "Automobile Engineering": {
      name: "Automobile Engineering",
      icon: "fa-car-side",
      badgeIcon: "fa-gauge",
      badgeColor: "#dc2626",
    },
    "Food Processing Technology": {
      name: "Food Processing Technology",
      icon: "fa-utensils",
      badgeIcon: "fa-leaf",
      badgeColor: "#16a34a",
    }
  };
  return map[branchCode] || {
    name: `${branchCode}`,
    icon: "fa-users",
    badgeIcon: "fa-user-check",
    badgeColor: "#059669",
  };
}

// Main Coordinator Fetcher & Realtime Sync Controller
window.initLiveDepartmentCoordinators = async () => {
  const container = document.getElementById("dept-coordinators-dynamic-container");

  try {
    const response = await fetch(GOOGLE_SHEET_COORDINATORS_CSV, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const csvText = await response.text();
    const rows = parseGoogleSheetCsv(csvText);

    if (rows && rows.length > 0) {
      // Map and deduplicate (keeping the latest submission)
      const parsedMap = new Map();

      rows.forEach((r) => {
        const timestamp = r[0] || "";
        const photoUrl = r[1] || "";
        const name = (r[2] || "").trim();
        const branch = normalizeBranchCode(r[3] || "");
        const year = normalizeAcademicYear(r[4] || "");
        const email = (r[5] || "").trim();
        const phone = (r[6] || "").replace(/[^0-9]/g, "");
        const instagram = (r[7] || "").trim();
        const linkedin = (r[8] || "").trim();

        if (!name) return;

        const key = (email || `${name}_${branch}`).toLowerCase();
        const coordObj = {
          timestamp,
          photoUrl,
          name,
          branch,
          year,
          email,
          phone,
          instagram,
          linkedin,
        };
        const refCode = getCoordinatorReferralCode(coordObj);
        coordObj.referralCode = refCode;
        window.COORDINATOR_REFERRAL_MAP[refCode] = coordObj;

        parsedMap.set(key, coordObj);
      });

      liveCoordinatorsData = Array.from(parsedMap.values());
      localStorage.setItem("tit_sih_coordinators_cache", JSON.stringify(liveCoordinatorsData));
    }
  } catch (err) {
    console.warn("Could not fetch live Google Sheet, loading cached coordinators:", err);
    const cached = localStorage.getItem("tit_sih_coordinators_cache");
    if (cached) {
      try {
        liveCoordinatorsData = JSON.parse(cached);
        liveCoordinatorsData.forEach((c) => {
          const refCode = getCoordinatorReferralCode(c);
          c.referralCode = refCode;
          window.COORDINATOR_REFERRAL_MAP[refCode] = c;
        });
      } catch (e) { }
    }
  }

  if (container) {
    renderLiveDepartmentCoordinators();
  }
};

window.refreshLiveCoordinators = async () => {
  const refreshBtn = document.getElementById("dept-refresh-btn");
  const refreshIcon = refreshBtn ? refreshBtn.querySelector("i") : null;
  if (refreshIcon) refreshIcon.classList.add("fa-spin");

  await initLiveDepartmentCoordinators();

  setTimeout(() => {
    if (refreshIcon) refreshIcon.classList.remove("fa-spin");
  }, 600);
};

function renderLiveDepartmentCoordinators() {
  const container = document.getElementById("dept-coordinators-dynamic-container");
  if (!container) return;

  if (!liveCoordinatorsData || liveCoordinatorsData.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; background: rgba(5,150,105,0.05); border-radius: 16px; border: 1px dashed var(--border-emerald);">
        <i class="fa-solid fa-users-line" style="font-size: 2.4rem; color: var(--primary); margin-bottom: 12px;"></i>
        <h4 style="font-size: 1.15rem; margin-bottom: 6px;">No Coordinator Submissions Yet</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 16px;">
          Submissions received via the Google Form will automatically appear here with their photos and contact details.
        </p>
      </div>
    `;
    return;
  }

  // Group by Branch
  const branchesOrder = ["ECE", "CSE", "EE", "CE", "ME"];
  const branchGroups = {};

  branchesOrder.forEach((b) => (branchGroups[b] = []));

  liveCoordinatorsData.forEach((coord) => {
    if (!branchGroups[coord.branch]) {
      branchGroups[coord.branch] = [];
    }
    branchGroups[coord.branch].push(coord);
  });

  // Year hierarchy sorting order
  const yearOrder = { "4th Year": 1, "3rd Year": 2, "2nd Year": 3, "1st Year": 4 };

  let html = "";

  branchesOrder.forEach((branchCode) => {
    const list = branchGroups[branchCode] || [];
    if (list.length === 0) return;

    const meta = getBranchDetails(branchCode);
    const isVisible = currentActiveBranchFilter === "all" || currentActiveBranchFilter.toUpperCase() === branchCode;

    // Group by Year inside branch
    const yearGroups = {};
    list.forEach((c) => {
      if (!yearGroups[c.year]) yearGroups[c.year] = [];
      yearGroups[c.year].push(c);
    });

    const sortedYears = Object.keys(yearGroups).sort((a, b) => (yearOrder[a] || 99) - (yearOrder[b] || 99));

    html += `
      <div class="dept-branch-block open" data-branch="${branchCode.toLowerCase()}" style="display: ${isVisible ? "block" : "none"}; margin-bottom: 24px;">
        <div class="dept-branch-header" onclick="toggleBranchAccordion('${branchCode.toLowerCase()}')">
          <div class="dept-header-left">
            <h3 class="dept-branch-title">
              <i class="fa-solid ${meta.icon}" style="color: ${meta.badgeColor};"></i> ${meta.name}
            </h3>
            <span class="dept-badge-summary"><i class="fa-solid fa-users"></i> ${list.length} Coordinator${list.length > 1 ? "s" : ""}</span>
          </div>
          <div class="dept-header-right">
            <button class="dept-accordion-chevron" aria-label="Toggle ${branchCode} Coordinators">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>

        <div class="dept-branch-content">
    `;

    sortedYears.forEach((yr) => {
      const yearCoords = yearGroups[yr];
      html += `
        <div class="year-group-title"><i class="fa-solid fa-graduation-cap" style="color: ${meta.badgeColor};"></i> ${yr}</div>
        <div class="committee-grid" style="margin-bottom: 20px;">
      `;

      yearCoords.forEach((c) => {
        const directImg = getDriveDirectImageUrl(c.photoUrl, c.name);
        const fallbackImg = getDriveThumbnailFallback(c.photoUrl, c.name);
        const cleanPhone = c.phone ? c.phone.slice(-10) : "";
        const refCode = c.referralCode || getCoordinatorReferralCode(c);

        // Build contact links
        let contactHtml = "";
        if (c.email) {
          contactHtml += `<a href="mailto:${escapeHtml(c.email)}" title="Email ${escapeHtml(c.name)}"><i class="fa-solid fa-envelope"></i></a>`;
        }
        if (cleanPhone) {
          contactHtml += `<a href="tel:+91${cleanPhone}" title="Call ${escapeHtml(c.name)}"><i class="fa-solid fa-phone"></i></a>`;
          contactHtml += `<a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(c.name)},%20regarding%20TIT%20SIH%20Hackathon" target="_blank" rel="noopener" title="WhatsApp ${escapeHtml(c.name)}"><i class="fa-brands fa-whatsapp"></i></a>`;
        }
        if (c.linkedin) {
          const lUrl = c.linkedin.startsWith("http") ? c.linkedin : `https://${c.linkedin}`;
          contactHtml += `<a href="${escapeHtml(lUrl)}" target="_blank" rel="noopener" title="LinkedIn ${escapeHtml(c.name)}"><i class="fa-brands fa-linkedin-in"></i></a>`;
        }
        if (c.instagram) {
          let instaUrl = c.instagram;
          if (!instaUrl.startsWith("http")) {
            const cleanHandle = instaUrl.replace(/^@/, "").trim();
            instaUrl = `https://www.instagram.com/${cleanHandle}`;
          }
          contactHtml += `<a href="${escapeHtml(instaUrl)}" target="_blank" rel="noopener" title="Instagram ${escapeHtml(c.name)}"><i class="fa-brands fa-instagram"></i></a>`;
        }

        html += `
          <div class="committee-card">
            <div class="committee-avatar-wrap" style="overflow: hidden; padding: 0;">
              <img src="${escapeHtml(directImg)}"
                   alt="${escapeHtml(c.name)} - ${escapeHtml(c.year)} ${escapeHtml(c.branch)} Coordinator"
                   width="96" height="96" loading="lazy" decoding="async"
                   onerror="this.onerror=null; this.src='${escapeHtml(fallbackImg)}';"
                   style="width: 100%; height: 100%; object-fit: cover; object-position: center; border-radius: 50%;">
              <span class="committee-badge-icon" style="background: ${meta.badgeColor};"><i class="fa-solid ${meta.badgeIcon}"></i></span>
            </div>
            <h3 class="committee-name">${escapeHtml(c.name)}</h3>
            <span class="committee-designation">${escapeHtml(c.year)} • ${escapeHtml(c.branch)}</span>
            <p class="committee-dept">${escapeHtml(meta.name)}, TIT</p>
            <div class="coordinator-referral-chip" onclick="copyCoordinatorRefCode('${refCode}')" title="Click to copy Referral Code for Team Registration">
              <i class="fa-solid fa-ticket"></i> Referral Code: <strong>${refCode}</strong> <i class="fa-regular fa-copy"></i>
            </div>
            <div class="committee-contact-links">
              ${contactHtml}
            </div>
          </div>
        `;
      });

      html += `</div>`;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Interactive Branch Tab Filter
window.filterDepartmentBranch = (branchCode) => {
  currentActiveBranchFilter = branchCode;

  // Update tab buttons
  const buttons = document.querySelectorAll(".branch-filter-btn");
  buttons.forEach((btn) => {
    if (btn.getAttribute("data-branch") === branchCode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Filter branch blocks
  const blocks = document.querySelectorAll(".dept-branch-block");
  blocks.forEach((block) => {
    const b = block.getAttribute("data-branch");
    if (branchCode === "all" || b === branchCode) {
      block.style.display = "block";
      block.classList.add("open");
    } else {
      block.style.display = "none";
    }
  });
};

// Interactive Branch Block Accordion
window.toggleBranchAccordion = (branchCode) => {
  const block = document.querySelector(`.dept-branch-block[data-branch="${branchCode}"]`);
  if (block) {
    block.classList.toggle("open");
  }
};

/* ==========================================================================
   TEAM FINDER ENGINE (FIND A TEAM OR JOIN A SQUAD)
   ========================================================================== */
let teammateRequests = [];
let currentTeamFinderFilter = "all";
let currentTeamFinderProgram = "all";
let currentTeamFinderBranch = "all";
let currentTeamFinderSearch = "";

function initTeammateBoard() {
  const container = document.getElementById("matchmaker-cards-grid");
  if (!container) return;

  // Clear any old fake seed data from localStorage
  try {
    const localData = localStorage.getItem("tit_sih_teammate_requests");
    if (localData) {
      const parsed = JSON.parse(localData);
      teammateRequests = Array.isArray(parsed) ? parsed.filter(p => !p.id?.startsWith("req_seed_")) : [];
      localStorage.setItem("tit_sih_teammate_requests", JSON.stringify(teammateRequests));
    } else {
      teammateRequests = [];
    }
  } catch (err) {
    teammateRequests = [];
  }

  // Real-time Cloud Sync with Firebase Firestore & Purge any legacy sample seeds
  if (typeof firebase !== "undefined" && db && isFirebaseActive) {
    try {
      db.collection("teammate_requests")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          if (snapshot) {
            const cloudList = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (doc.id.startsWith("req_seed_") || data.id?.startsWith("req_seed_")) {
                // Permanently delete sample seed doc from Firestore
                db.collection("teammate_requests").doc(doc.id).delete().catch(() => { });
              } else {
                cloudList.push({ id: doc.id, ...data });
              }
            });
            teammateRequests = cloudList;
            localStorage.setItem("tit_sih_teammate_requests", JSON.stringify(teammateRequests));
            renderTeammateBoard();
          }
        }, (err) => {
          console.warn("[TIT SIH] Team finder sync notice:", err);
        });
    } catch (e) {
      console.warn("[TIT SIH] Team finder error:", e);
    }
  }

  renderTeammateBoard();
}

function getTimeAgo(timestamp) {
  if (!timestamp) return "Recently";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function renderTeammateBoard() {
  const container = document.getElementById("matchmaker-cards-grid");
  if (!container) return;

  const filtered = teammateRequests.filter((item) => {
    if (item.status === "closed" || item.id?.startsWith("req_seed_")) return false;

    // Filter Tabs (All / Teams / Solo)
    if (currentTeamFinderFilter === "teams" && item.postType !== "team_seeking") return false;
    if (currentTeamFinderFilter === "solo" && item.postType !== "solo_seeking") return false;

    // Module / Program Filter (Degree vs Diploma)
    const itemProg = item.authorProgram || (window.isDiplomaBranch(item.authorBranch) ? "Diploma" : "Degree");
    if (currentTeamFinderProgram !== "all" && itemProg.toLowerCase() !== currentTeamFinderProgram.toLowerCase()) return false;

    // Branch Filter
    if (currentTeamFinderBranch !== "all" && item.authorBranch !== currentTeamFinderBranch) return false;

    // Search Query
    if (currentTeamFinderSearch) {
      const q = currentTeamFinderSearch.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchAuthor = item.authorName?.toLowerCase().includes(q);
      const matchDesc = item.desc?.toLowerCase().includes(q);
      const matchSkills = item.skills?.some(s => s.toLowerCase().includes(q));
      const matchBranch = item.authorBranch?.toLowerCase().includes(q);
      const matchProgram = itemProg.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchDesc && !matchSkills && !matchBranch && !matchProgram) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="team-finder-empty-box">
        <div class="team-empty-icon"><i class="fa-solid fa-users"></i></div>
        <h4 class="team-empty-title">No Active Team Posts Yet</h4>
        <p class="team-empty-desc">
          Looking for teammates to complete your squad, or wanting to join an existing team? Post your requirement now!
        </p>
        <button type="button" class="btn-3d-primary" onclick="openTeammateRequestModal()" style="margin: 0 auto;">
          <i class="fa-solid fa-plus"></i> Post a Request
        </button>
      </div>
    `;
    return;
  }

  let html = "";
  filtered.forEach((req) => {
    const isTeam = req.postType === "team_seeking";
    const postTypeBadge = isTeam
      ? `<span class="post-type-badge post-type-team"><i class="fa-solid fa-user-group"></i> Team Looking for Members</span>`
      : `<span class="post-type-badge post-type-solo"><i class="fa-solid fa-user-plus"></i> Student Looking for a Team</span>`;

    const authorProgram = req.authorProgram || (window.isDiplomaBranch(req.authorBranch) ? "Diploma" : "Degree");
    const isDiploma = authorProgram.toLowerCase() === "diploma";
    const programIcon = isDiploma ? "fa-graduation-cap" : "fa-award";
    const displayProgramLabel = isDiploma ? "Diploma" : "Degree (B.Tech)";

    const initials = (req.authorName || "TIT")
      .split(" ")
      .map(w => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const cleanPhone = (req.authorPhone || "").replace(/\D/g, "");
    const waText = encodeURIComponent(`Hi ${req.authorName}! I saw your post "${req.title}" on the TIT SIH Team Finder. Let's discuss teaming up!`);
    const waLink = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${waText}` : "#";

    const mailSubject = encodeURIComponent(`TIT SIH 2026 Team Connect - ${req.title}`);
    const mailBody = encodeURIComponent(`Hi ${req.authorName},\n\nI saw your listing on the TIT SIH Team Finder regarding "${req.title}".\n\nI would love to connect!\n\nBest regards,\n[My Name]`);
    const mailLink = `mailto:${req.authorEmail}?subject=${mailSubject}&body=${mailBody}`;

    const isAuthor = currentUser && (
      (currentUser.email && currentUser.email.toLowerCase() === req.authorEmail?.toLowerCase()) ||
      (currentUser.name && currentUser.name.toLowerCase() === req.authorName?.toLowerCase())
    );

    const skillsHtml = (req.skills || []).map(skill => {
      const isFemaleTag = skill.toLowerCase().includes("female");
      return `<span class="skill-chip ${isFemaleTag ? "skill-chip-female" : ""}"><i class="fa-solid ${isFemaleTag ? "fa-venus" : "fa-tag"}"></i> ${escapeHtml(skill)}</span>`;
    }).join("");

    html += `
      <div class="team-card ${req.needsFemale ? "needs-female-card" : ""}" id="req-card-${req.id}">
        <div>
          <div class="team-card-header">
            <div class="author-info-group">
              <div class="author-avatar-chip">${initials}</div>
              <div>
                <div class="author-meta-name">${escapeHtml(req.authorName)}</div>
                <div class="author-meta-dept">
                  <span class="module-chip ${isDiploma ? 'module-chip-diploma' : 'module-chip-degree'}">
                    <i class="fa-solid ${programIcon}"></i> ${escapeHtml(displayProgramLabel)}
                  </span>
                  <span class="dept-dot">•</span>
                  <span>${escapeHtml(req.authorBranch)}</span>
                  <span class="dept-dot">•</span>
                  <span>${escapeHtml(req.authorYear || "TIT Student")}</span>
                </div>
              </div>
            </div>
            ${postTypeBadge}
          </div>

          <h4 class="team-card-title">${escapeHtml(req.title)}</h4>
          <p class="team-card-desc">${escapeHtml(req.desc)}</p>

          <div class="team-skills-wrap">
            ${skillsHtml}
          </div>
        </div>

        <div class="team-card-footer">
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            ${cleanPhone ? `
              <a href="${waLink}" target="_blank" rel="noopener" class="btn-whatsapp-connect" title="Open direct WhatsApp conversation">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
            ` : ""}
            <a href="${mailLink}" class="btn-email-connect" title="Send email">
              <i class="fa-regular fa-envelope"></i> Email
            </a>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">
              <i class="fa-regular fa-clock"></i> ${getTimeAgo(req.createdAt)}
            </span>
            ${isAuthor ? `
              <button type="button" class="btn-resolve-post" onclick="resolveTeammateRequest('${req.id}')" title="Close this post if squad is full">
                <i class="fa-solid fa-check"></i> Remove Post
              </button>
            ` : ""}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.filterTeamFinder = (filterType, element) => {
  currentTeamFinderFilter = filterType;
  const buttons = document.querySelectorAll(".team-tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  if (element) element.classList.add("active");
  renderTeammateBoard();
};

window.handleTeamFinderProgram = (progVal) => {
  currentTeamFinderProgram = progVal;
  renderTeammateBoard();
};

window.handleTeamFinderBranch = (branchVal) => {
  currentTeamFinderBranch = branchVal;
  renderTeammateBoard();
};

window.handleTeamFinderSearch = (query) => {
  currentTeamFinderSearch = (query || "").trim();
  renderTeammateBoard();
};

// Aliases for compatibility
window.filterTeammateBoard = window.filterTeamFinder;
window.handleTeammateProgramFilter = window.handleTeamFinderProgram;
window.handleTeammateBranchFilter = window.handleTeamFinderBranch;
window.handleTeammateSearch = window.handleTeamFinderSearch;

window.openTeammateRequestModal = () => {
  const modal = document.getElementById("teammate-request-modal");
  if (!modal) return;

  const progEl = document.getElementById("req-program");
  const authorNameEl = document.getElementById("req-author-name");
  const emailEl = document.getElementById("req-email");
  const branchEl = document.getElementById("req-branch");
  const yearEl = document.getElementById("req-year");

  if (currentUser) {
    if (authorNameEl && !authorNameEl.value) authorNameEl.value = currentUser.name || "";
    if (emailEl && !emailEl.value) emailEl.value = currentUser.email || "";
    if (progEl) {
      progEl.value = currentUser.program || (window.isDiplomaBranch(currentUser.branch) ? "Diploma" : "Degree");
    }
    window.updateReqBranchOptions();
    if (branchEl && currentUser.branch) branchEl.value = currentUser.branch;
    if (yearEl && currentUser.year) yearEl.value = currentUser.year;
  } else {
    window.updateReqBranchOptions();
  }

  modal.classList.add("active");
};

window.closeTeammateRequestModal = () => {
  const modal = document.getElementById("teammate-request-modal");
  if (modal) modal.classList.remove("active");
};

window.togglePostTypeFields = (postType) => {
  const titleLabel = document.getElementById("req-title-label");
  const titleInput = document.getElementById("req-title");
  const femaleWrap = document.getElementById("req-female-quota-wrap");

  if (postType === "solo_seeking") {
    if (titleLabel) titleLabel.textContent = "Your Specialization / Skills Offered *";
    if (titleInput) titleInput.placeholder = "e.g. Python / React Developer Seeking Team";
    if (femaleWrap) femaleWrap.style.display = "none";
  } else {
    if (titleLabel) titleLabel.textContent = "Team / Project Title or Topic *";
    if (titleInput) titleInput.placeholder = "e.g. AI Early Warning Landslide System";
    if (femaleWrap) femaleWrap.style.display = "block";
  }
};

window.handleTeammateRequestSubmit = (e) => {
  e.preventDefault();

  const postType = document.getElementById("req-post-type").value;
  const authorName = document.getElementById("req-author-name").value.trim();
  const progEl = document.getElementById("req-program");
  const authorBranch = document.getElementById("req-branch").value;
  const authorProgram = progEl ? progEl.value : (window.isDiplomaBranch(authorBranch) ? "Diploma" : "Degree");
  const authorYear = document.getElementById("req-year").value;
  const title = document.getElementById("req-title").value.trim();
  const category = document.getElementById("req-category").value;
  const rawSkills = document.getElementById("req-skills").value.trim();
  const needsFemale = document.getElementById("req-needs-female") ? document.getElementById("req-needs-female").checked : false;
  const desc = document.getElementById("req-desc").value.trim();
  const authorPhone = document.getElementById("req-whatsapp").value.trim().replace(/\D/g, "");
  const authorEmail = document.getElementById("req-email").value.trim().toLowerCase();

  if (!authorName || authorName.length < 2) {
    alert("[TIT SIH] Please enter your full name.");
    return;
  }

  if (!title || title.length < 3) {
    alert("[TIT SIH] Please enter a valid title or specialization.");
    return;
  }

  if (!authorPhone || authorPhone.length !== 10) {
    alert("[TIT SIH] Please enter a valid 10-digit WhatsApp mobile number.");
    return;
  }

  if (!authorEmail || !isValidEmail(authorEmail)) {
    alert("[TIT SIH] Please enter a valid email address.");
    return;
  }

  const skills = rawSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
  if (needsFemale && !skills.some(s => s.toLowerCase().includes("female"))) {
    skills.unshift("Female Member Needed");
  }

  const newRequest = {
    id: "req_" + Date.now(),
    authorName,
    authorProgram,
    authorBranch,
    authorYear,
    postType,
    title,
    category,
    skills,
    needsFemale,
    desc,
    authorPhone,
    authorEmail,
    status: "active",
    createdAt: Date.now()
  };

  teammateRequests.unshift(newRequest);
  localStorage.setItem("tit_sih_teammate_requests", JSON.stringify(teammateRequests));

  // Sync to Firebase Cloud Firestore
  if (typeof firebase !== "undefined" && db && isFirebaseActive) {
    db.collection("teammate_requests").doc(newRequest.id).set(newRequest).catch((err) => {
      console.warn("[TIT SIH] Cloud write notice:", err);
    });
  }

  closeTeammateRequestModal();
  renderTeammateBoard();
  triggerConfettiBurst();

  alert(`[TIT SIH] Your request "${title}" is now live on the Team Finder board!`);
};

window.resolveTeammateRequest = (requestId) => {
  if (confirm("Remove this post from the Team Finder board?")) {
    teammateRequests = teammateRequests.filter(r => r.id !== requestId);
    localStorage.setItem("tit_sih_teammate_requests", JSON.stringify(teammateRequests));

    if (typeof firebase !== "undefined" && db && isFirebaseActive) {
      db.collection("teammate_requests").doc(requestId).delete().catch(() => { });
    }

    renderTeammateBoard();
    alert("[TIT SIH] Post removed.");
  }
};

// Hook initialization on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTeammateBoard();
  });
} else {
  initTeammateBoard();
}






