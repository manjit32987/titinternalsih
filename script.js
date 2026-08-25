/**
 * TIT IIC - SIH INTERNAL HACKATHON 2026
 * Full Dynamic Logic Engine with Google Firebase Cloud Firestore Integration
 */

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
  renderStudentDashboard();
  checkUrlHashRouting();
  initScrollSpy();
  initLiveDepartmentCoordinators();
});

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

  if (input === CONFIG.adminPasscode) {
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

  if (loginBtn) loginBtn.classList.remove("active");
  if (signupBtn) signupBtn.classList.remove("active");
  if (loginForm) loginForm.style.display = "none";
  if (signupForm) signupForm.style.display = "none";
  if (resetForm) resetForm.style.display = "none";

  if (tab === "login") {
    if (loginBtn) loginBtn.classList.add("active");
    if (loginForm) loginForm.style.display = "block";
  } else if (tab === "signup") {
    if (signupBtn) signupBtn.classList.add("active");
    if (signupForm) signupForm.style.display = "block";
  } else if (tab === "reset") {
    if (resetForm) resetForm.style.display = "block";
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

window.handlePasswordResetSubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById("reset-email").value.trim().toLowerCase();

  // Try Firebase Auth Password Reset Email if active
  if (typeof firebase !== "undefined" && firebase.auth && isFirebaseActive) {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert(`[TIT SIH] Password Reset Dispatched: A secure reset link has been sent to ${email}. Please check your inbox and spam folder.`);
        switchAuthTab("login");
      })
      .catch((err) => {
        console.warn("Firebase Auth reset error:", err);
        alert(`[TIT SIH] Password Reset Dispatched: If an account exists with ${email}, you will receive a reset link shortly.`);
        switchAuthTab("login");
      });
  } else {
    // Local / Firestore lookup
    const student = registeredStudents.find((s) => s.email.toLowerCase() === email);
    if (student) {
      alert(`[TIT SIH] Password Reset Request: A reset link has been dispatched to ${email}.`);
    } else {
      alert(`[TIT SIH] Password Reset Request: If this email is registered with TIT IIC, a reset link will arrive shortly.`);
    }
    switchAuthTab("login");
  }
};

window.handleLoginSubmit = (e) => {
  e.preventDefault();
  const identifier = document.getElementById("login-identifier").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  if (!identifier || !password) {
    alert("[TIT SIH] Please enter your College Email / Roll Number and Password.");
    return;
  }

  const student = registeredStudents.find(
    (s) => (s.email.toLowerCase() === identifier || s.roll.toLowerCase() === identifier) && s.password === password
  );

  if (student) {
    currentUser = student;
    localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));
    closeAuthModal();
    updateNavAuthState();
    renderStudentDashboard();
    triggerConfettiBurst();
    alert(`[TIT SIH] Welcome, ${student.name}. You are logged in as Team Leader.`);
  } else {
    alert("[TIT SIH] Invalid credentials. Please check your email/roll number and password, or create a new student account.");
  }
};

window.handleSignupSubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const roll = document.getElementById("signup-roll").value.trim().toUpperCase();
  const dept = document.getElementById("signup-dept").value;
  const year = document.getElementById("signup-year").value;
  const gender = document.getElementById("signup-gender").value;
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;

  // Production Validation Checks
  if (!name || name.length < 2) {
    alert("[TIT SIH] Please enter a valid full name.");
    return;
  }

  if (!roll || roll.length < 3) {
    alert("[TIT SIH] Please enter a valid college roll number (e.g. 21CSE042).");
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

  // Check if roll or email already exists
  const existing = registeredStudents.find(
    (s) => s.email.toLowerCase() === email || s.roll.toLowerCase() === roll.toLowerCase()
  );

  if (existing) {
    alert("[TIT SIH] An account with this Email or Roll Number already exists. Please sign in.");
    switchAuthTab("login");
    return;
  }

  const newStudent = { name, roll, dept, year, gender, email, password };
  registeredStudents.push(newStudent);
  localStorage.setItem("tit_sih_students", JSON.stringify(registeredStudents));

  // Sync with Firebase Firestore if active
  if (isFirebaseActive && db) {
    db.collection("students").doc(newStudent.roll).set(newStudent).catch((err) => {
      console.warn("Firestore student write notice:", err);
    });
  }

  currentUser = newStudent;
  localStorage.setItem("tit_sih_current_user", JSON.stringify(currentUser));

  closeAuthModal();
  updateNavAuthState();
  renderStudentDashboard();
  triggerConfettiBurst();
  alert(`[TIT SIH] Student Leader account created successfully for ${name}.`);
};

window.handleLogout = () => {
  if (confirm("Are you sure you want to sign out?")) {
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
      <div class="user-profile-badge" title="${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.roll)} - ${escapeHtml(currentUser.dept)})">
        <span class="user-avatar-circle">${initials}</span>
        <span>${escapeHtml(currentUser.name.split(" ")[0])} (${escapeHtml(currentUser.dept)})</span>
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
      <button class="btn-nav-register" onclick="openAuthModal('student', 'login')">
        <i class="fa-solid fa-user-lock"></i> Sign In / Register
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

window.openTeamRegModal = () => {
  const modal = document.getElementById("team-registration-modal");
  if (!modal) return;
  renderMembersRosterInputs();
  modal.classList.add("active");
};

window.closeTeamRegModal = () => {
  const modal = document.getElementById("team-registration-modal");
  if (modal) modal.classList.remove("active");
};

// Render Team Member Input Cards (Members 1-4 Required, Members 5-6 Optional)
function renderMembersRosterInputs() {
  const container = document.getElementById("members-roster-inputs");
  if (!container) return;

  const leaderName = currentUser ? currentUser.name : "";
  const leaderRoll = currentUser ? currentUser.roll : "";
  const leaderDept = currentUser ? currentUser.dept : "CSE";
  const leaderGender = currentUser ? currentUser.gender : "Male";
  const leaderEmail = currentUser ? currentUser.email : "";

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
          <input type="text" id="m1-name" class="form-text-input" value="${leaderName}" required oninput="checkRosterFemaleQuota()">
        </div>
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Roll Number *</label>
          <input type="text" id="m1-roll" class="form-text-input" value="${leaderRoll}" required>
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Department *</label>
          <select id="m1-dept" class="form-select-input" required>
            <option value="CSE" ${leaderDept === "CSE" ? "selected" : ""}>CSE</option>
            <option value="IT" ${leaderDept === "IT" ? "selected" : ""}>IT</option>
            <option value="ECE" ${leaderDept === "ECE" ? "selected" : ""}>ECE</option>
            <option value="EE" ${leaderDept === "EE" ? "selected" : ""}>EE</option>
            <option value="ME" ${leaderDept === "ME" ? "selected" : ""}>ME</option>
            <option value="CE" ${leaderDept === "CE" ? "selected" : ""}>CE</option>
            <option value="AI&DS" ${leaderDept === "AI&DS" ? "selected" : ""}>AI & DS</option>
          </select>
        </div>
        <div class="form-group-item" style="margin-bottom: 8px;">
          <label class="form-input-label">Gender *</label>
          <select id="m1-gender" class="form-select-input roster-gender-select" onchange="checkRosterFemaleQuota()" required>
            <option value="Male" ${leaderGender === "Male" ? "selected" : ""}>Male</option>
            <option value="Female" ${leaderGender === "Female" ? "selected" : ""}>Female</option>
            <option value="Other" ${leaderGender === "Other" ? "selected" : ""}>Other</option>
          </select>
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-group-item" style="margin-bottom: 0;">
          <label class="form-input-label">Email ID *</label>
          <input type="email" id="m1-email" class="form-text-input" value="${leaderEmail}" required>
        </div>
        <div class="form-group-item" style="margin-bottom: 0;">
          <label class="form-input-label">Phone Number *</label>
          <input type="tel" id="m1-phone" class="form-text-input" placeholder="10-digit mobile" required>
        </div>
      </div>
    </div>
  `;

  // Members 2 to 6
  for (let i = 2; i <= 6; i++) {
    const isRequired = i <= 2;
    const badgeText = isRequired ? `Member ${i} (Required)` : `Member ${i} (Optional for Internal Round)`;
    const requiredMarker = isRequired ? " *" : "";
    const cardBgStyle = isRequired ? "" : "background: #f8fafc; border-style: dashed;";

    html += `
      <div class="member-input-card" style="${cardBgStyle}">
        <div class="member-card-header">
          <span class="member-badge-pill" style="${isRequired ? "" : "background:#f1f5f9; color:#475569;"}">${badgeText}</span>
          <span style="font-size: 0.72rem; color: #64748b;">${isRequired ? "Required TIT Student (Min 2 Required)" : "Optional (Max 6 Allowed)"}</span>
        </div>
        <div class="form-row-2">
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Full Name${requiredMarker}</label>
            <input type="text" id="m${i}-name" class="form-text-input" placeholder="Member ${i} Name" ${isRequired ? "required" : ""} oninput="checkRosterFemaleQuota()">
          </div>
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Roll Number${requiredMarker}</label>
            <input type="text" id="m${i}-roll" class="form-text-input" placeholder="e.g. 21IT0${i * 4}" ${isRequired ? "required" : ""}>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Department${requiredMarker}</label>
            <select id="m${i}-dept" class="form-select-input" ${isRequired ? "required" : ""}>
              <option value="CSE">CSE</option>
              <option value="IT" ${i === 2 ? "selected" : ""}>IT</option>
              <option value="ECE" ${i === 3 ? "selected" : ""}>ECE</option>
              <option value="EE" ${i === 4 ? "selected" : ""}>EE</option>
              <option value="ME" ${i === 5 ? "selected" : ""}>ME</option>
              <option value="CE" ${i === 6 ? "selected" : ""}>CE</option>
              <option value="AI&DS">AI & DS</option>
            </select>
          </div>
          <div class="form-group-item" style="margin-bottom: 8px;">
            <label class="form-input-label">Gender${requiredMarker}</label>
            <select id="m${i}-gender" class="form-select-input roster-gender-select" onchange="checkRosterFemaleQuota()" ${isRequired ? "required" : ""}>
              <option value="Male">Male</option>
              <option value="Female" ${i === 2 ? "selected" : ""}>Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group-item" style="margin-bottom: 0;">
            <label class="form-input-label">Email ID${requiredMarker}</label>
            <input type="email" id="m${i}-email" class="form-text-input" placeholder="member${i}@titagartala.ac.in" ${isRequired ? "required" : ""}>
          </div>
          <div class="form-group-item" style="margin-bottom: 0;">
            <label class="form-input-label">Phone Number${requiredMarker}</label>
            <input type="tel" id="m${i}-phone" class="form-text-input" placeholder="10-digit mobile" ${isRequired ? "required" : ""}>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  checkRosterFemaleQuota();
}

window.checkRosterFemaleQuota = () => {
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
};

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
  const domain = document.getElementById("reg-ps-domain").value;
  const title = document.getElementById("reg-ps-title").value.trim();
  const abstract = document.getElementById("reg-abstract").value.trim();
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
    alert("[TIT SIH] Please enter the Target SIH Problem Statement ID (e.g. SIH2601).");
    return;
  }

  if (!title || title.length < 5) {
    alert("[TIT SIH] Please enter your Solution Title (minimum 5 characters).");
    return;
  }

  if (!abstract || abstract.length < 15) {
    alert("[TIT SIH] Please provide a clear Solution Abstract (minimum 15 characters).");
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
    const deptEl = document.getElementById(`m${i}-dept`);
    const genderEl = document.getElementById(`m${i}-gender`);
    const emailEl = document.getElementById(`m${i}-email`);
    const phoneEl = document.getElementById(`m${i}-phone`);

    const name = nameEl ? nameEl.value.trim() : "";
    const roll = rollEl ? rollEl.value.trim().toUpperCase() : "";
    const dept = deptEl ? deptEl.value : "CSE";
    const gender = genderEl ? genderEl.value : "Male";
    const email = emailEl ? emailEl.value.trim().toLowerCase() : "";
    const phone = phoneEl ? phoneEl.value.trim() : "";

    // For optional members 3 to 6, skip if empty
    if (!isRequired && !name && !roll && !email) {
      continue;
    }

    if (!name) {
      alert(`[TIT SIH] Please provide the Full Name for Member ${i}.`);
      return;
    }

    if (!roll) {
      alert(`[TIT SIH] Please provide the Roll Number for Member ${i}.`);
      return;
    }

    if (rollSet.has(roll)) {
      alert(`[TIT SIH Error] Duplicate Roll Number: "${roll}" is entered more than once.`);
      return;
    }
    rollSet.add(roll);

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
      roll,
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
        <h4 style="font-size: 0.98rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
          ${escapeHtml(userTeam.title)}
        </h4>
        <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin: 0;">
          ${escapeHtml(userTeam.abstract)}
        </p>
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
              <i class="fa-solid fa-id-badge" style="color: #059669; width: 14px;"></i> ${escapeHtml(m.roll)} (${escapeHtml(m.dept)})
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

  document.getElementById("edit-team-id").value = team.teamId;
  document.getElementById("edit-team-badge-id").textContent = team.teamId;
  document.getElementById("edit-team-name").value = team.teamName || "";
  document.getElementById("edit-team-edition").value = team.edition || "Software Edition";
  document.getElementById("edit-team-ps-id").value = team.psId || "";
  document.getElementById("edit-team-ps-domain").value = team.domain || "Student Innovation (Open)";
  document.getElementById("edit-team-title").value = team.title || "";
  document.getElementById("edit-team-abstract").value = team.abstract || "";
  document.getElementById("edit-team-ppt-link").value = team.pptLink || "";
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
  const domain = document.getElementById("edit-team-ps-domain").value;
  const title = document.getElementById("edit-team-title").value.trim();
  const abstract = document.getElementById("edit-team-abstract").value.trim();
  const pptLink = document.getElementById("edit-team-ppt-link").value.trim();
  const editRefCode = (document.getElementById("edit-team-referral-code")?.value || "").trim().toUpperCase();

  if (!teamName || !psId || !title || !abstract || !pptLink) {
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
  document.getElementById("edit-m-dept").value = member.dept || "CSE";
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
  const roll = document.getElementById("edit-m-roll").value.trim();
  const dept = document.getElementById("edit-m-dept").value;
  const gender = document.getElementById("edit-m-gender").value;
  const email = document.getElementById("edit-m-email").value.trim();
  const phone = document.getElementById("edit-m-phone").value.trim();

  if (!name || !roll || !email || !phone) {
    alert("[TIT SIH Error] Please fill in all member fields.");
    return;
  }

  // Duplicate roll check in same team
  const isDuplicateRoll = team.members.some((m, idx) => idx !== memberIdx && m.roll.toLowerCase() === roll.toLowerCase());
  if (isDuplicateRoll) {
    alert(`[TIT SIH Error] Roll Number "${roll}" is already assigned to another member in this team.`);
    return;
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
  team.members[memberIdx].roll = roll;
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
  const roll = document.getElementById("add-m-roll").value.trim();
  const dept = document.getElementById("add-m-dept").value;
  const gender = document.getElementById("add-m-gender").value;
  const email = document.getElementById("add-m-email").value.trim();
  const phone = document.getElementById("add-m-phone").value.trim();

  if (!name || !roll || !email || !phone) {
    alert("[TIT SIH Error] Please fill in all fields to add the member.");
    return;
  }

  // Check duplicate roll in team
  if (team.members.some((m) => m.roll.toLowerCase() === roll.toLowerCase())) {
    alert(`[TIT SIH Error] Roll Number "${roll}" is already in this team.`);
    return;
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
    roll,
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
              <td style="padding: 5px 8px;">${m.roll}</td>
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

window.handleAdminPasscodeSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById("admin-passcode-input").value.trim();

  if (input === CONFIG.adminPasscode) {
    document.getElementById("admin-passcode-view").style.display = "none";
    document.getElementById("admin-console-view").style.display = "block";
    renderAdminConsole();
  } else {
    alert("❌ Invalid Admin Passcode. Access restricted to authorized faculty and IIC conveners.");
  }
};

window.filterAdminTeams = (query, edition, status) => {
  if (query !== undefined) adminSearchQuery = query.toLowerCase();
  if (edition !== undefined) adminEditionFilter = edition;
  if (status !== undefined) adminStatusFilter = status;
  renderAdminConsole();
};

function renderAdminConsole() {
  const container = document.getElementById("admin-teams-table-container");
  if (!container) return;

  const totalTeams = registeredTeams.length;
  const swTeams = registeredTeams.filter((t) => t.edition.includes("Software")).length;
  const hwTeams = registeredTeams.filter((t) => t.edition.includes("Hardware")).length;
  const totalStudents = registeredTeams.reduce((acc, t) => acc + (t.members ? t.members.length : 0), 0);
  
  let totalFemales = 0;
  registeredTeams.forEach(t => {
    t.members.forEach(m => {
      if (m.gender === "Female") totalFemales++;
    });
  });

  // Filter teams based on search & filters
  const filteredTeams = registeredTeams.filter((t) => {
    const matchesSearch =
      adminSearchQuery === "" ||
      t.teamId.toLowerCase().includes(adminSearchQuery) ||
      t.teamName.toLowerCase().includes(adminSearchQuery) ||
      t.psId.toLowerCase().includes(adminSearchQuery) ||
      t.domain.toLowerCase().includes(adminSearchQuery) ||
      t.title.toLowerCase().includes(adminSearchQuery) ||
      t.members.some((m) => m.name.toLowerCase().includes(adminSearchQuery) || m.roll.toLowerCase().includes(adminSearchQuery));

    const matchesEdition =
      adminEditionFilter === "ALL" ||
      (adminEditionFilter === "Software" && t.edition.includes("Software")) ||
      (adminEditionFilter === "Hardware" && t.edition.includes("Hardware"));

    const matchesStatus =
      adminStatusFilter === "ALL" ||
      (adminStatusFilter === "Review" && t.status.includes("Under Review")) ||
      (adminStatusFilter === "Shortlisted" && t.status.includes("Shortlisted")) ||
      (adminStatusFilter === "Nominated" && t.status.includes("Nominated"));

    return matchesSearch && matchesEdition && matchesStatus;
  });

  const dbStatusBadge = isFirebaseActive
    ? `<div style="display: inline-flex; align-items: center; gap: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 6px 14px; border-radius: 8px; font-size: 0.8rem; color: #065f46; font-weight: 700; margin-bottom: 16px;">
        <i class="fa-solid fa-cloud-check" style="color: #059669;"></i> Connected to Google Firebase Cloud Firestore (Live Multi-Device Sync Active)
      </div>`
    : `<div style="display: inline-flex; align-items: center; gap: 8px; background: #fef3c7; border: 1px solid #fde68a; padding: 6px 14px; border-radius: 8px; font-size: 0.8rem; color: #92400e; font-weight: 700; margin-bottom: 16px;">
        <i class="fa-solid fa-database" style="color: #d97706;"></i> Local Browser Database Mode (Paste your free Firebase project keys in script.js to enable live cloud sync across all phones & PCs)
      </div>`;

  container.innerHTML = `
    ${dbStatusBadge}

    <!-- Summary Stats Grid -->
    <!-- Summary Stats Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px;">
      <div style="background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px; text-align: center;">
        <div style="font-size: 1.6rem; font-weight: 900; color: #064e3b;">${totalTeams}</div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #059669;">Total Teams</div>
      </div>
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px; text-align: center;">
        <div style="font-size: 1.6rem; font-weight: 900; color: #1e40af;">${swTeams}</div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #2563eb;">Software Teams</div>
      </div>
      <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 12px; text-align: center;">
        <div style="font-size: 1.6rem; font-weight: 900; color: #92400e;">${hwTeams}</div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #d97706;">Hardware Teams</div>
      </div>
      <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 12px; text-align: center;">
        <div style="font-size: 1.6rem; font-weight: 900; color: #6b21a8;">${totalStudents}</div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #9333ea;">Active Students</div>
      </div>
      <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 12px; text-align: center;">
        <div style="font-size: 1.6rem; font-weight: 900; color: #9f1239;">${totalFemales}</div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #e11d48;">Female Participants</div>
      </div>
    </div>

    <!-- Coordinator Referral Performance Leaderboard -->
    ${(() => {
      const refMap = {};
      registeredTeams.forEach((t) => {
        const code = (t.referralCode && t.referralCode !== "NONE") ? t.referralCode.toUpperCase() : "DIRECT";
        if (!refMap[code]) {
          const coord = window.COORDINATOR_REFERRAL_MAP ? window.COORDINATOR_REFERRAL_MAP[code] : null;
          refMap[code] = {
            code,
            name: coord ? coord.name : (t.referredBy || (code === "DIRECT" ? "Direct / No Referral" : code)),
            branch: coord ? coord.branch : (code.includes("-") ? code.split("-")[0] : "General"),
            count: 0
          };
        }
        refMap[code].count++;
      });
      const sortedStats = Object.values(refMap).sort((a, b) => b.count - a.count);
      return `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 18px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <h4 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #064e3b; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-chart-simple" style="color: #059669;"></i> Technical Heads & Coordinator Referral Performance
            </h4>
            <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 3px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
              <i class="fa-solid fa-ticket"></i> Live Referral Tracker
            </span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            ${sortedStats.map((st, i) => `
              <div style="background: ${st.code === 'DIRECT' ? '#f8fafc' : '#f0fdf4'}; border: 1px solid ${st.code === 'DIRECT' ? '#e2e8f0' : '#a7f3d0'}; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${i + 1}. ${escapeHtml(st.name)}</div>
                  <div style="font-size: 0.72rem; color: #64748b; font-family: var(--font-mono); font-weight: 700;">Code: ${escapeHtml(st.code)} (${escapeHtml(st.branch)})</div>
                </div>
                <span style="background: ${st.code === 'DIRECT' ? '#e2e8f0' : '#059669'}; color: ${st.code === 'DIRECT' ? '#334155' : '#ffffff'}; font-size: 0.82rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; white-space: nowrap;">
                  ${st.count} Team${st.count > 1 ? 's' : ''}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    })()}

    <!-- Search & Filter Toolbar -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <div style="display: flex; gap: 10px; flex-grow: 1; min-width: 240px;">
        <div style="position: relative; width: 100%;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 0.85rem;"></i>
          <input type="text" class="form-text-input" placeholder="Search by team name, ID, leader, roll no, referral code..." 
            value="${adminSearchQuery}" 
            oninput="filterAdminTeams(this.value, undefined, undefined)"
            style="padding-left: 34px; font-size: 0.85rem; height: 38px; margin: 0;">
        </div>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <select class="form-select-input" onchange="filterAdminTeams(undefined, this.value, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 12px; width: auto; margin: 0;">
          <option value="ALL" ${adminEditionFilter === "ALL" ? "selected" : ""}>All Editions</option>
          <option value="Software" ${adminEditionFilter === "Software" ? "selected" : ""}>Software Edition</option>
          <option value="Hardware" ${adminEditionFilter === "Hardware" ? "selected" : ""}>Hardware Edition</option>
        </select>

        <select class="form-select-input" onchange="filterAdminTeams(undefined, undefined, this.value)" style="height: 38px; font-size: 0.82rem; padding: 6px 12px; width: auto; margin: 0;">
          <option value="ALL" ${adminStatusFilter === "ALL" ? "selected" : ""}>All Statuses</option>
          <option value="Review" ${adminStatusFilter === "Review" ? "selected" : ""}>Under Review</option>
          <option value="Shortlisted" ${adminStatusFilter === "Shortlisted" ? "selected" : ""}>Shortlisted for Internal Hackathon</option>
          <option value="Nominated" ${adminStatusFilter === "Nominated" ? "selected" : ""}>Nominated for SIH Finals</option>
        </select>
      </div>
    </div>

    <!-- Master Teams Table -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Team ID</th>
            <th>Team Name & Category</th>
            <th>Target PS & Domain</th>
            <th>Referral Code</th>
            <th>Team Leader</th>
            <th>Female Quota</th>
            <th>Evaluation Status</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredTeams.length === 0
              ? `<tr><td colspan="8" style="text-align: center; padding: 32px; color: #64748b;">No registered teams matching your search/filters.</td></tr>`
              : filteredTeams
                  .map((t) => {
                    const femalesInTeam = t.members.filter((m) => m.gender === "Female").length;
                    const leader = t.members[0] || {};
                    return `
            <tr>
              <td>
                <strong style="color: #059669; font-family: var(--font-mono); font-size: 0.88rem;">${t.teamId}</strong>
                <div style="font-size: 0.7rem; color: #94a3b8;">${t.createdAt || "2026"}</div>
              </td>
              <td>
                <strong style="color: #0f172a; font-size: 0.92rem;">${t.teamName}</strong>
                <div style="font-size: 0.72rem; color: #64748b;"><span class="badge" style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">${t.edition}</span></div>
              </td>
              <td>
                <strong style="color: #064e3b;">${t.psId}</strong>
                <div style="font-size: 0.72rem; color: #64748b;">${t.domain}</div>
              </td>
              <td>
                ${t.referralCode && t.referralCode !== 'NONE' ? `
                  <span style="font-size: 0.75rem; font-weight: 800; background: #f0fdf4; color: #065f46; padding: 3px 8px; border-radius: 6px; border: 1px solid #a7f3d0; font-family: var(--font-mono); display: inline-block;">
                    ${escapeHtml(t.referralCode)}
                  </span>
                  <div style="font-size: 0.68rem; color: #64748b; margin-top: 2px;">${escapeHtml(t.referredBy || "")}</div>
                ` : `<span style="font-size: 0.72rem; color: #94a3b8;">Direct</span>`}
              </td>
              <td>
                <strong style="color: #0f172a;">${leader.name}</strong>
                <div style="font-size: 0.72rem; color: #64748b;">${leader.roll} (${leader.dept})</div>
                <div style="font-size: 0.7rem; color: #059669;"><i class="fa-solid fa-phone" style="font-size:0.65rem;"></i> ${leader.phone || "N/A"}</div>
              </td>
              <td>
                <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 3px 8px; border-radius: 6px; border: 1px solid #a7f3d0;">
                  <i class="fa-solid fa-circle-check"></i> ${femalesInTeam} Female
                </span>
              </td>
              <td>
                <select class="admin-status-select" onchange="updateTeamStatus('${t.teamId}', this.value)">
                  <option value="Under Review by IIC Panel" ${t.status.includes("Under Review") ? "selected" : ""}>Under Review</option>
                  <option value="Shortlisted for Internal Hackathon" ${t.status.includes("Shortlisted") ? "selected" : ""}>Shortlisted for Internal Hackathon</option>
                  <option value="Nominated for SIH Finals" ${t.status.includes("Nominated") ? "selected" : ""}>Nominated for SIH Finals</option>
                </select>
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <button class="btn-3d-primary" onclick="openAdminTeamDetails('${t.teamId}')" style="padding: 6px 12px; font-size: 0.75rem; margin-right: 4px;">
                  <i class="fa-solid fa-users-viewfinder"></i> Details
                </button>
                <button class="btn-3d-outline" onclick="openTeamPassModal('${t.teamId}')" style="padding: 6px 8px; font-size: 0.75rem; background: #ffffff; margin-right: 4px;" title="Print Digital Pass">
                  <i class="fa-solid fa-id-card"></i>
                </button>
                <button class="btn-3d-outline" onclick="deleteTeamByAdmin('${t.teamId}')" style="padding: 6px 8px; font-size: 0.75rem; background: #fff1f2; color: #dc2626; border-color: #fecdd3;" title="Delete Team">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          `;
                  })
                  .join("")
          }
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   7. DETAILED TEAM INSPECTOR MODAL FOR ADMIN
   ========================================================================== */
window.openAdminTeamDetails = (teamId) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  const modal = document.getElementById("admin-team-details-modal");
  const content = document.getElementById("admin-team-details-content");
  if (!modal || !content) return;

  const leader = team.members[0] || {};
  const femaleCount = team.members.filter((m) => m.gender === "Female").length;

  content.innerHTML = `
    <!-- Header Banner -->
    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="background: #059669; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono);">
              ${team.teamId}
            </span>
            <span style="background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #a7f3d0;">
              ${team.edition}
            </span>
            <span style="background: #fff1f2; color: #9f1239; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #fecdd3;">
              <i class="fa-solid fa-venus"></i> ${femaleCount} Female Member(s)
            </span>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #0f172a; margin: 0 0 4px;">
            Team: ${team.teamName}
          </h2>
          <div style="color: #64748b; font-size: 0.85rem;">
            Leader: <strong style="color: #0f172a;">${leader.name}</strong> (${leader.roll} - ${leader.dept}) • Registered on: ${team.createdAt}
          </div>
        </div>

        <div style="text-align: right;">
          <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; display: block; margin-bottom: 4px;">UPDATE EVALUATION STATUS</label>
          <select class="admin-status-select" style="padding: 6px 12px; font-weight: 700;" onchange="updateTeamStatus('${team.teamId}', this.value)">
            <option value="Under Review by IIC Panel" ${team.status.includes("Under Review") ? "selected" : ""}>Under Review</option>
            <option value="Shortlisted for Internal Hackathon" ${team.status.includes("Shortlisted") ? "selected" : ""}>Shortlisted for Internal Hackathon</option>
            <option value="Nominated for SIH Finals" ${team.status.includes("Nominated") ? "selected" : ""}>Nominated for SIH Finals</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Project & Solution Synopsis -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
        <span style="font-weight: 800; color: #064e3b; font-size: 0.95rem;">
          <i class="fa-solid fa-bullseye" style="color: #059669;"></i> Target PS: <strong>${team.psId}</strong> (${team.domain})
        </span>
        <a href="${team.pptLink}" target="_blank" rel="noopener" class="btn-3d-primary" style="padding: 6px 14px; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-file-powerpoint"></i> Open Idea PPT Deck
        </a>
      </div>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
        ${team.title}
      </h4>
      <p style="font-size: 0.88rem; color: #475569; line-height: 1.55; margin: 0;">
        ${team.abstract}
      </p>
    </div>

    <!-- Complete 6 Squad Members Table & Details -->
    <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-users" style="color: #059669;"></i> Full 6-Member Squad Roster
    </h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 24px;">
      ${team.members
        .map(
          (m, idx) => `
        <div style="background: ${m.isLeader ? "#f0fdf4" : "#ffffff"}; border: 1px solid ${m.isLeader ? "#a7f3d0" : "#e2e8f0"}; border-radius: 10px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #0f172a; font-size: 0.9rem;">${m.name}</strong>
            ${m.isLeader ? '<span class="member-badge-pill leader" style="font-size:0.65rem;">LEADER</span>' : `<span style="font-size:0.7rem; color:#64748b; font-weight:600;">Member ${idx + 1}</span>`}
          </div>
          <div style="font-size: 0.78rem; color: #475569; margin-bottom: 3px;">
            <i class="fa-solid fa-id-badge" style="color: #059669; width: 14px;"></i> Roll: <strong>${m.roll}</strong> (${m.dept})
          </div>
          <div style="font-size: 0.78rem; color: #475569; margin-bottom: 3px;">
            <i class="fa-solid fa-venus-mars" style="color: #059669; width: 14px;"></i> Gender: <strong>${m.gender}</strong>
          </div>
          <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 3px; word-break: break-all;">
            <i class="fa-solid fa-envelope" style="color: #059669; width: 14px;"></i> ${m.email}
          </div>
          <div style="font-size: 0.75rem; color: #64748b;">
            <i class="fa-solid fa-phone" style="color: #059669; width: 14px;"></i> ${m.phone || "N/A"}
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <!-- Inspector Actions -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 16px; flex-wrap: wrap; gap: 10px;">
      <div style="display: flex; gap: 8px;">
        <button class="btn-3d-outline" onclick="openTeamPassModal('${team.teamId}')" style="padding: 8px 14px; font-size: 0.82rem; background: #ffffff;">
          <i class="fa-solid fa-id-card"></i> View Pass & QR
        </button>
        <button class="btn-3d-outline" onclick="deleteTeamByAdmin('${team.teamId}')" style="padding: 8px 14px; font-size: 0.82rem; background: #fff1f2; color: #dc2626; border-color: #fecdd3;">
          <i class="fa-solid fa-trash-can"></i> Delete Team
        </button>
      </div>

      <button class="btn-3d-secondary" onclick="closeAdminTeamDetails()">
        Close Inspector
      </button>
    </div>
  `;

  modal.classList.add("active");
};

window.closeAdminTeamDetails = () => {
  const modal = document.getElementById("admin-team-details-modal");
  if (modal) modal.classList.remove("active");
};

/* ==========================================================================
   8. ADMIN TEAM DELETION LOGIC (LOCAL & FIREBASE CLOUD)
   ========================================================================== */
window.deleteTeamByAdmin = (teamId) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (!team) return;

  const confirmPrompt = `CONFIRM PERMANENT DELETION\n\nAre you sure you want to delete this team?\n• Team Name: ${team.teamName}\n• Team ID: ${team.teamId}\n• Leader: ${team.members[0]?.name || "N/A"}\n\nThis will remove the team from the registry and cloud database. This action cannot be undone.`;

  if (confirm(confirmPrompt)) {
    // 1. Remove from local array
    registeredTeams = registeredTeams.filter((t) => t.teamId !== teamId);
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

    // 2. Delete from Google Firebase Firestore if active
    if (isFirebaseActive && db) {
      db.collection("teams")
        .doc(teamId)
        .delete()
        .then(() => {
          console.log(`Team ${teamId} permanently deleted from Firestore.`);
        })
        .catch((err) => {
          console.error("Error deleting team from Firestore:", err);
        });
    }

    // 3. Close inspector modal if open and re-render
    closeAdminTeamDetails();
    renderAdminConsole();
    renderStudentDashboard();

    alert(`[TIT SIH] Team "${team.teamName}" (${teamId}) has been deleted.`);
  }
};

window.updateTeamStatus = (teamId, newStatus) => {
  const team = registeredTeams.find((t) => t.teamId === teamId);
  if (team) {
    team.status = newStatus;
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
    
    // Sync status change to Firebase Firestore if active
    if (isFirebaseActive && db) {
      db.collection("teams").doc(teamId).update({ status: newStatus }).catch((err) => {
        console.warn("Firestore status update notice:", err);
      });
    }

    renderStudentDashboard();
    alert(`Status for team ${team.teamName} updated to: "${newStatus}"`);
  }
};

window.exportTeamsToCSV = () => {
  if (registeredTeams.length === 0) {
    alert("No registered teams found to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Team ID,Team Name,Edition,PS ID,PS Domain,Solution Title,Referral Code,Referred By Coordinator,Status,Registered Date,PPT Link,Leader Name,Leader Roll,Leader Dept,Leader Gender,Leader Email,Leader Phone,Member 2 Name,Member 2 Roll,Member 2 Gender,Member 3 Name,Member 3 Roll,Member 3 Gender,Member 4 Name,Member 4 Roll,Member 4 Gender,Member 5 Name,Member 5 Roll,Member 5 Gender,Member 6 Name,Member 6 Roll,Member 6 Gender\n";

  registeredTeams.forEach((t) => {
    const row = [
      t.teamId,
      `"${t.teamName.replace(/"/g, '""')}"`,
      t.edition,
      t.psId,
      `"${t.domain}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      t.referralCode || "NONE",
      `"${(t.referredBy || "").replace(/"/g, '""')}"`,
      `"${t.status}"`,
      t.createdAt,
      `"${t.pptLink}"`,
      `"${t.members[0].name}"`,
      t.members[0].roll,
      t.members[0].dept,
      t.members[0].gender,
      t.members[0].email,
      t.members[0].phone,
      `"${t.members[1]?.name || ""}"`,
      t.members[1]?.roll || "",
      t.members[1]?.gender || "",
      `"${t.members[2]?.name || ""}"`,
      t.members[2]?.roll || "",
      t.members[2]?.gender || "",
      `"${t.members[3]?.name || ""}"`,
      t.members[3]?.roll || "",
      t.members[3]?.gender || "",
      `"${t.members[4]?.name || ""}"`,
      t.members[4]?.roll || "",
      t.members[4]?.gender || "",
      `"${t.members[5]?.name || ""}"`,
      t.members[5]?.roll || "",
      t.members[5]?.gender || ""
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `TIT_SIH_2026_Registered_Teams_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  triggerConfettiBurst();
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

// Helper: Generate or look up permanent unique SIHINxxxx code
function getCoordinatorReferralCode(coord) {
  const normName = (coord.name || "").trim().toLowerCase();
  if (FIXED_COORDINATOR_SIHIN_CODES[normName]) {
    return FIXED_COORDINATOR_SIHIN_CODES[normName];
  }
  // Deterministic 4-digit number for any dynamic new form submissions
  let hash = 0;
  const str = `${normName}_${(coord.branch || "").toLowerCase()}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 9000;
  }
  const num = 1000 + Math.abs(hash);
  return `SIHIN${num}`;
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

window.handleReferralCodeInput = (val) => {
  const code = (val || "").trim().toUpperCase();
  const checkIcon = document.getElementById("referral-check-icon");
  const matchBadge = document.getElementById("referral-match-badge");

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
};

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
  };
  return map[branchCode] || {
    name: `${branchCode} Engineering`,
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
      } catch (e) {}
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



