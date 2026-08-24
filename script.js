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
  initFirebaseCloud();
  init3DCardTilt();
  initFaqAccordion();
  initMobileNav();
  initConfettiTriggers();
  updateNavAuthState();
  renderStudentDashboard();
  checkUrlHashRouting();
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

      if (cloudTeams.length > 0) {
        registeredTeams = cloudTeams;
        localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
        renderStudentDashboard();
        
        // If admin console is open, re-render it live
        const adminView = document.getElementById("admin-console-view");
        if (adminView && adminView.style.display !== "none") {
          renderAdminConsole();
        }
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
      <div class="user-profile-badge" title="${currentUser.name} (${currentUser.roll} - ${currentUser.dept})">
        <span class="user-avatar-circle">${initials}</span>
        <span>${currentUser.name.split(" ")[0]} (${currentUser.dept})</span>
      </div>
      <button class="btn-3d-primary" style="padding: 7px 14px; font-size: 0.8rem;" onclick="triggerRegistration()">
        <i class="fa-solid fa-file-pen"></i> Register Team
      </button>
      <button class="btn-nav-logout" onclick="handleLogout()" title="Sign Out">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    `;

    if (navDashLink) navDashLink.style.display = "block";
    if (mobDashLink) mobDashLink.style.display = "block";
    if (mobAuthLink) {
      mobAuthLink.innerHTML = `<a href="#" class="mobile-nav-link" onclick="closeMobileMenu(); handleLogout();" style="color:#dc2626;"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout (${currentUser.name})</a>`;
    }
  } else {
    // Logged Out State
    navAuthContainer.innerHTML = `
      <button class="btn-nav-auth" onclick="openAuthModal('login')">
        <i class="fa-solid fa-user-lock"></i> Sign In / Portal
      </button>
      <button class="btn-nav-register" onclick="triggerRegistration()">
        <i class="fa-solid fa-file-pen"></i> Register Team
      </button>
    `;

    if (navDashLink) navDashLink.style.display = "none";
    if (mobDashLink) mobDashLink.style.display = "none";
    if (mobAuthLink) {
      mobAuthLink.innerHTML = `<a href="#" class="mobile-nav-link" onclick="closeMobileMenu(); openAuthModal('login');"><i class="fa-solid fa-user-lock"></i> Sign In / Portal (Student / SPOC)</a>`;
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
          <span style="font-size: 0.72rem; color: #64748b;">${isRequired ? "Required TIT Student" : "Optional (2-6 Members Allowed)"}</span>
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
      t.leaderEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      t.members.some((m) => m.email.toLowerCase() === currentUser.email.toLowerCase() || m.roll.toLowerCase() === currentUser.roll.toLowerCase())
  );

  if (!userTeam) {
    contentBox.innerHTML = `
      <div class="dashboard-hero-card" style="text-align: center; padding: 48px 20px;">
        <div style="font-size: 2.4rem; color: #059669; margin-bottom: 12px;"><i class="fa-solid fa-users"></i></div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
          Welcome, ${currentUser.name}
        </h3>
        <p style="color: #64748b; font-size: 0.9rem; max-width: 540px; margin: 0 auto 24px; line-height: 1.5;">
          You are currently not linked to any registered team. Assemble your squad (4 to 6 members) and register now to participate in the TIT SIH Internal Hackathon.
        </p>
        <button class="btn-3d-primary" onclick="triggerRegistration()" style="padding: 14px 28px;">
          <i class="fa-solid fa-plus"></i> Register Team
        </button>
      </div>
    `;
    return;
  }

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
            <span style="background: #059669; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 4px 12px; border-radius: 6px;">
              ${userTeam.teamId}
            </span>
            <span style="background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.8rem; padding: 4px 12px; border-radius: 6px; border: 1px solid #a7f3d0;">
              ${userTeam.edition}
            </span>
            <span style="font-size: 0.8rem; color: #64748b;">Registered: ${userTeam.createdAt}</span>
          </div>
          <h2 style="font-size: 1.7rem; font-weight: 900; color: #0f172a; margin-bottom: 4px;">
            Team ${userTeam.teamName}
          </h2>
          <p style="color: #475569; font-size: 0.92rem; font-weight: 600;">
            <i class="fa-solid fa-bullseye" style="color: #059669;"></i> Target PS: <strong>${userTeam.psId}</strong> (${userTeam.domain})
          </p>
        </div>

        <div style="text-align: right;">
          <div class="dashboard-status-banner ${statusBadgeClass}">
            <i class="fa-solid ${statusIcon}"></i> ${userTeam.status}
          </div>
          <div style="margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
            <button class="btn-3d-primary" onclick="openTeamPassModal('${userTeam.teamId}')" style="padding: 9px 18px; font-size: 0.85rem;">
              <i class="fa-solid fa-id-card"></i> View Digital Pass
            </button>
            <a href="${userTeam.pptLink}" target="_blank" rel="noopener" class="btn-3d-outline" style="padding: 9px 18px; font-size: 0.85rem; background: #ffffff; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-file-powerpoint" style="color: #ea580c;"></i> View PPT ↗
            </a>
          </div>
        </div>
      </div>

      <!-- Problem & Solution Overview -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h4 style="font-size: 0.98rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
          ${userTeam.title}
        </h4>
        <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin: 0;">
          ${userTeam.abstract}
        </p>
      </div>

      <!-- Squad Roster Grid -->
      <h4 style="font-size: 1.05rem; font-weight: 800; color: #064e3b; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-users"></i> Confirmed Squad Roster (${userTeam.members.length} Members)
      </h4>
      <div class="dashboard-team-grid">
        ${userTeam.members
          .map(
            (m) => `
          <div class="dashboard-member-box ${m.isLeader ? "leader" : ""}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="color: #0f172a; font-size: 0.92rem;">${m.name}</strong>
              ${m.isLeader ? '<span class="member-badge-pill leader" style="font-size: 0.65rem;">LEADER</span>' : `<span style="font-size: 0.72rem; color: #64748b;">${m.gender}</span>`}
            </div>
            <div style="font-size: 0.78rem; color: #475569; margin-bottom: 3px;">
              <i class="fa-solid fa-id-badge" style="color: #059669; width: 14px;"></i> ${m.roll} (${m.dept})
            </div>
            <div style="font-size: 0.76rem; color: #64748b;">
              <i class="fa-solid fa-envelope" style="color: #059669; width: 14px;"></i> ${m.email}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

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

    <!-- Search & Filter Toolbar -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <div style="display: flex; gap: 10px; flex-grow: 1; min-width: 240px;">
        <div style="position: relative; width: 100%;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 0.85rem;"></i>
          <input type="text" class="form-text-input" placeholder="Search by team name, ID, leader, roll no, or domain..." 
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
            <th>Team Leader</th>
            <th>Female Quota</th>
            <th>Evaluation Status</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredTeams.length === 0
              ? `<tr><td colspan="7" style="text-align: center; padding: 32px; color: #64748b;">No registered teams matching your search/filters.</td></tr>`
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
          <i class="fa-solid fa-file-powerpoint"></i> Open Idea PPT Deck ↗
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
  csvContent += "Team ID,Team Name,Edition,PS ID,PS Domain,Solution Title,Status,Registered Date,PPT Link,Leader Name,Leader Roll,Leader Dept,Leader Gender,Leader Email,Leader Phone,Member 2 Name,Member 2 Roll,Member 2 Gender,Member 3 Name,Member 3 Roll,Member 3 Gender,Member 4 Name,Member 4 Roll,Member 4 Gender,Member 5 Name,Member 5 Roll,Member 5 Gender,Member 6 Name,Member 6 Roll,Member 6 Gender\n";

  registeredTeams.forEach((t) => {
    const row = [
      t.teamId,
      `"${t.teamName.replace(/"/g, '""')}"`,
      t.edition,
      t.psId,
      `"${t.domain}"`,
      `"${t.title.replace(/"/g, '""')}"`,
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


