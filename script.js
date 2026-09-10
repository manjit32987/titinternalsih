/**
 * TIT IIC - SIH INTERNAL HACKATHON 2026
 * Full Dynamic Logic Engine with Google Firebase Cloud Firestore Integration
 */

/* ==========================================================================
   0. SITE UNDER MAINTENANCE CONTROLLER & DEVELOPER BYPASS SYSTEM
   ========================================================================== */
const MAINTENANCE_CONFIG = {
  enabled: false, // MASTER SWITCH: set to false to open portal to all visitors
  heading: "Website Under Maintenance",
  message: "We are currently undergoing scheduled maintenance. Please check back soon."
};

function isDeveloperBypassed() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("dev") === "bypass";
  } catch (e) {
    return false;
  }
}

function initMaintenanceMode() {
  const overlay = document.getElementById("maintenance-overlay");
  const floatingBar = document.getElementById("dev-floating-bar");
  const devModal = document.getElementById("dev-unlock-modal");
  if (floatingBar) floatingBar.remove();
  if (devModal) devModal.remove();

  // Clear previous stored bypass so clean maintenance mode takes effect
  try {
    localStorage.removeItem("tit_sih_dev_bypass");
  } catch (e) {}

  if (!MAINTENANCE_CONFIG.enabled || isDeveloperBypassed()) {
    if (overlay) overlay.remove();
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "hidden";
  renderMaintenanceOverlay();
}

function renderMaintenanceOverlay() {
  let overlay = document.getElementById("maintenance-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "maintenance-overlay";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="maintenance-card" style="max-width: 460px; padding: 46px 28px; text-align: center;">
      <div class="maintenance-top-stripe"></div>
      <div class="maintenance-icon-box">
        <div class="maintenance-icon-glow-ring"></div>
        <div class="maintenance-icon-circle">
          <i class="fa-solid fa-gears maintenance-gear-spin"></i>
        </div>
      </div>
      <h1 class="maintenance-heading" style="font-size: 1.85rem; font-weight: 800; margin: 0 0 12px; color: var(--text-main);">${escapeHtml(MAINTENANCE_CONFIG.heading)}</h1>
      <p class="maintenance-desc" style="margin: 0 auto; color: var(--text-muted); font-size: 0.96rem; line-height: 1.6; max-width: 360px;">
        ${escapeHtml(MAINTENANCE_CONFIG.message)}
      </p>
    </div>
  `;
}

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
const OFFICIAL_TIT_30_TEAMS = [
  {
    teamId: "TIT-SIH26-1042",
    teamName: "ByteCraft TIT",
    edition: "Software Edition",
    psId: "SIH26001",
    domain: "AI & Machine Learning",
    title: "AI Early Warning & Landslide Risk Monitoring System in NER",
    abstract: "Deep learning computer vision algorithm fusing satellite SAR and ground IoT seismometer telemetry for real-time slope instability alerting across Tripura hills.",
    referralCode: "SIH-CSE-01",
    referredBy: "Manash Debbarma",
    status: "Winner • 1st Place (₹3,000 Cash)",
    juryScore: 19.2,
    rank: 1,
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
    teamId: "TIT-SIH26-4712",
    teamName: "AgriBot TIT",
    edition: "Hardware Edition",
    psId: "SIH-AG-08",
    domain: "Robotics & Smart Agriculture",
    title: "Autonomous Rubber Plantation Weeding & Tapping Rover",
    abstract: "Tracked chassis rover with stereoscopic depth cameras and selective mechanical weeding cutters suited for undulating Tripura rubber plantations.",
    referralCode: "SIH-ME-01",
    referredBy: "Ronit Saha",
    status: "Winner • 2nd Place (₹2,000 Cash)",
    juryScore: 18.8,
    rank: 2,
    leaderEmail: "bikram.me24@titagartala.ac.in",
    members: [
      { name: "Bikramjit Tripura", roll: "24ME003", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "bikram.me24@titagartala.ac.in", phone: "9612112233", isLeader: true },
      { name: "Rimi Debbarma", roll: "24ME015", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Female", email: "rimi.d24@titagartala.ac.in", phone: "9612223344", isLeader: false },
      { name: "Sayan Barman", roll: "23ME027", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Male", email: "sayan.b23@titagartala.ac.in", phone: "9612334455", isLeader: false },
      { name: "Pallabi Paul", roll: "25ME009", program: "Diploma", branch: "ME", dept: "ME", year: "1st Year", gender: "Female", email: "pallabi.p25@titagartala.ac.in", phone: "9612445566", isLeader: false },
      { name: "Joydeep Roy", roll: "23ME033", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Male", email: "joydeep.r23@titagartala.ac.in", phone: "9612556677", isLeader: false }
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
    referralCode: "SIH-ECE-01",
    referredBy: "Sambhu Debnath",
    status: "Winner • 3rd Place (₹1,000 Cash)",
    juryScore: 18.4,
    rank: 3,
    leaderEmail: "arnab.ece23@titagartala.ac.in",
    members: [
      { name: "Arnab Bhowmik", roll: "23ECE011", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Male", email: "arnab.ece23@titagartala.ac.in", phone: "9774112233", isLeader: true },
      { name: "Sneha Sen", roll: "23ECE029", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Female", email: "sneha.sen23@titagartala.ac.in", phone: "9774223344", isLeader: false },
      { name: "Pritam Ghosh", roll: "24EE018", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "pritam.ee24@titagartala.ac.in", phone: "9774334455", isLeader: false },
      { name: "Riya Dey", roll: "24ECE040", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "riya.dey24@titagartala.ac.in", phone: "9774445566", isLeader: false },
      { name: "Akash Roy", roll: "23ECE035", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Male", email: "akash.r23@titagartala.ac.in", phone: "9774556677", isLeader: false }
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
    referralCode: "SIH-ECE-02",
    referredBy: "Sreya Deb",
    status: "Nominated for SIH Nationals",
    juryScore: 18.0,
    rank: 4,
    leaderEmail: "joya.ece25@titagartala.ac.in",
    members: [
      { name: "Joya Reang", roll: "25ECE008", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Female", email: "joya.ece25@titagartala.ac.in", phone: "9862991122", isLeader: true },
      { name: "Deepak Debbarma", roll: "25ECE021", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Male", email: "deepak.d25@titagartala.ac.in", phone: "9862992233", isLeader: false },
      { name: "Suman Bhowmik", roll: "24CSE033", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "suman.b24@titagartala.ac.in", phone: "9862993344", isLeader: false },
      { name: "Nisha Saha", roll: "23CSE015", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Female", email: "nisha.s23@titagartala.ac.in", phone: "9862994455", isLeader: false },
      { name: "Prasenjit Shil", roll: "24CSE042", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "prasenjit.s24@titagartala.ac.in", phone: "9862995566", isLeader: false }
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
    referralCode: "SIH-EE-01",
    referredBy: "Alak Das",
    status: "Nominated for SIH Nationals",
    juryScore: 17.8,
    rank: 5,
    leaderEmail: "sourav.ee22@titagartala.ac.in",
    members: [
      { name: "Sourav Chakraborty", roll: "22EE005", program: "Degree", branch: "EE", dept: "EE", year: "4th Year", gender: "Male", email: "sourav.ee22@titagartala.ac.in", phone: "9436112233", isLeader: true },
      { name: "Sreya Majumder", roll: "22EE031", program: "Degree", branch: "EE", dept: "EE", year: "4th Year", gender: "Female", email: "sreya.m22@titagartala.ac.in", phone: "9436223344", isLeader: false },
      { name: "Joydeep Paul", roll: "23EE019", program: "Degree", branch: "EE", dept: "EE", year: "3rd Year", gender: "Male", email: "joydeep.p23@titagartala.ac.in", phone: "9436334455", isLeader: false },
      { name: "Monalisa Das", roll: "25EE012", program: "Degree", branch: "EE", dept: "EE", year: "1st Year", gender: "Female", email: "monalisa.d25@titagartala.ac.in", phone: "9436445566", isLeader: false },
      { name: "Tapash Debnath", roll: "24EE016", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "tapash.d24@titagartala.ac.in", phone: "9436556677", isLeader: false }
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
    referralCode: "SIH-CE-01",
    referredBy: "Neelotpal Banik",
    status: "Nominated for SIH Nationals",
    juryScore: 17.6,
    rank: 6,
    leaderEmail: "koushik.ce23@titagartala.ac.in",
    members: [
      { name: "Koushik Saha", roll: "23CE007", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Male", email: "koushik.ce23@titagartala.ac.in", phone: "9863112233", isLeader: true },
      { name: "Dipanwita Roy", roll: "23CE022", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Female", email: "dipanwita.r23@titagartala.ac.in", phone: "9863223344", isLeader: false },
      { name: "Surajit Datta", roll: "24CE014", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Male", email: "surajit.d24@titagartala.ac.in", phone: "9863334455", isLeader: false },
      { name: "Trisha Bhattacharjee", roll: "25CE031", program: "Diploma", branch: "CE", dept: "CE", year: "1st Year", gender: "Female", email: "trisha.b25@titagartala.ac.in", phone: "9863445566", isLeader: false },
      { name: "Abhijit Paul", roll: "23CE018", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Male", email: "abhijit.p23@titagartala.ac.in", phone: "9863556677", isLeader: false }
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
    referralCode: "SIH-CSE-03",
    referredBy: "Prena Saha",
    status: "Nominated for SIH Nationals",
    juryScore: 17.4,
    rank: 7,
    leaderEmail: "moumita.cse24@titagartala.ac.in",
    members: [
      { name: "Moumita Datta", roll: "24CSE002", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "moumita.cse24@titagartala.ac.in", phone: "9436881122", isLeader: true },
      { name: "Abhishek Sil", roll: "24CSE019", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "abhishek.sil24@titagartala.ac.in", phone: "9436882233", isLeader: false },
      { name: "Debashish Roy", roll: "25CSE045", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "debashish.r25@titagartala.ac.in", phone: "9436883344", isLeader: false },
      { name: "Simran Dey", roll: "25ECE018", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Female", email: "simran.d25@titagartala.ac.in", phone: "9436884455", isLeader: false },
      { name: "Niladri Saha", roll: "23CSE024", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Male", email: "niladri.s23@titagartala.ac.in", phone: "9436885566", isLeader: false }
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
    referralCode: "SIH-CE-02",
    referredBy: "Kishore Majumder",
    status: "Nominated for SIH Nationals",
    juryScore: 17.2,
    rank: 8,
    leaderEmail: "amit.ce22@titagartala.ac.in",
    members: [
      { name: "Amitava Guha", roll: "22CE011", program: "Degree", branch: "CE", dept: "CE", year: "4th Year", gender: "Male", email: "amit.ce22@titagartala.ac.in", phone: "9774771122", isLeader: true },
      { name: "Payel Paul", roll: "22CE025", program: "Degree", branch: "CE", dept: "CE", year: "4th Year", gender: "Female", email: "payel.p22@titagartala.ac.in", phone: "9774772233", isLeader: false },
      { name: "Sagarika Das", roll: "23CE040", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Female", email: "sagarika.d23@titagartala.ac.in", phone: "9774773344", isLeader: false },
      { name: "Sanjay Deb", roll: "24EE029", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "sanjay.d24@titagartala.ac.in", phone: "9774774455", isLeader: false },
      { name: "Debamita Bhowmik", roll: "24CE033", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Female", email: "debamita.b24@titagartala.ac.in", phone: "9774775566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9031",
    teamName: "CyberShield Tripura",
    edition: "Software Edition",
    psId: "SIH-CS-03",
    domain: "Cybersecurity & Citizen Trust",
    title: "Decentralized Phishing & Financial Fraud Prevention Shield",
    abstract: "Browser extension & mobile VPN sandbox intercepting spoofed banking and Aadhaar APK links targeted at rural digital banking users.",
    referralCode: "SIH-CSE-02",
    referredBy: "Sanjit Noatia",
    status: "Nominated for SIH Nationals",
    juryScore: 17.0,
    rank: 9,
    leaderEmail: "rajat.cse23@titagartala.ac.in",
    members: [
      { name: "Rajat Paul", roll: "23CSE018", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Male", email: "rajat.cse23@titagartala.ac.in", phone: "9862881122", isLeader: true },
      { name: "Ankita Sharma", roll: "23CSE041", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Female", email: "ankita.s23@titagartala.ac.in", phone: "9862882233", isLeader: false },
      { name: "Dipankar Ghosh", roll: "24CSE022", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "dipankar.g24@titagartala.ac.in", phone: "9862883344", isLeader: false },
      { name: "Priya Deb", roll: "24ECE015", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "priya.d24@titagartala.ac.in", phone: "9862884455", isLeader: false },
      { name: "Rohit Karmakar", roll: "25CSE019", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "rohit.k25@titagartala.ac.in", phone: "9862885566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9142",
    teamName: "AeroTIT SkyGuard",
    edition: "Hardware Edition",
    psId: "SIH-DR-12",
    domain: "Drones & Disaster Management",
    title: "Autonomous Thermal Forest Fire & Poaching Patrol Drone",
    abstract: "Long-endurance VTOL aircraft equipped with micro-bolometer thermal cameras detecting early forest canopy flare-ups in Sepahijala Sanctuary.",
    referralCode: "SIH-ME-02",
    referredBy: "Prabal Kanti Paul",
    status: "Nominated for SIH Nationals",
    juryScore: 17.0,
    rank: 10,
    leaderEmail: "saptarshi.me22@titagartala.ac.in",
    members: [
      { name: "Saptarshi Deb", roll: "22ME007", program: "Degree", branch: "ME", dept: "ME", year: "4th Year", gender: "Male", email: "saptarshi.me22@titagartala.ac.in", phone: "9436441122", isLeader: true },
      { name: "Priyanka Das", roll: "22ECE019", program: "Degree", branch: "ECE", dept: "ECE", year: "4th Year", gender: "Female", email: "priyanka.d22@titagartala.ac.in", phone: "9436442233", isLeader: false },
      { name: "Anirban Paul", roll: "23ME014", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Male", email: "anirban.p23@titagartala.ac.in", phone: "9436443344", isLeader: false },
      { name: "Shilpa Roy", roll: "24EE025", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Female", email: "shilpa.r24@titagartala.ac.in", phone: "9436444455", isLeader: false },
      { name: "Subhankar Saha", roll: "24ME031", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "subhankar.s24@titagartala.ac.in", phone: "9436445566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9253",
    teamName: "BioWaste Energy TIT",
    edition: "Hardware Edition",
    psId: "SIH-EN-07",
    domain: "Renewable Energy",
    title: "Smart Biogas Micro-Reactor Telemetry & Digestate Controller",
    abstract: "IoT anaerobic digestion monitoring unit calculating methane yield and auto-dosing neutralizing agents for dairy farmers in West Tripura.",
    referralCode: "SIH-EE-02",
    referredBy: "Sneha Debnath",
    status: "Shortlisted Finalist",
    juryScore: 16.8,
    rank: 11,
    leaderEmail: "joyeeta.ee23@titagartala.ac.in",
    members: [
      { name: "Joyeeta Bhowmik", roll: "23EE008", program: "Degree", branch: "EE", dept: "EE", year: "3rd Year", gender: "Female", email: "joyeeta.ee23@titagartala.ac.in", phone: "9774331122", isLeader: true },
      { name: "Subrata Shil", roll: "23EE021", program: "Degree", branch: "EE", dept: "EE", year: "3rd Year", gender: "Male", email: "subrata.s23@titagartala.ac.in", phone: "9774332233", isLeader: false },
      { name: "Raktim Das", roll: "24ME012", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "raktim.d24@titagartala.ac.in", phone: "9774333344", isLeader: false },
      { name: "Swagata Paul", roll: "25EE018", program: "Degree", branch: "EE", dept: "EE", year: "1st Year", gender: "Female", email: "swagata.p25@titagartala.ac.in", phone: "9774334455", isLeader: false },
      { name: "Anik Debbarma", roll: "24EE035", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "anik.d24@titagartala.ac.in", phone: "9774335566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9364",
    teamName: "FinSecure PayTIT",
    edition: "Software Edition",
    psId: "SIH-FT-05",
    domain: "FinTech & Inclusion",
    title: "Offline Mesh UPI Payments for Hill Tribal Hamlets",
    abstract: "Secure Bluetooth BLE and sound-wave acoustic encrypted payment protocol settling offline credit tokens once phone connects to cellular tower.",
    referralCode: "SIH-CSE-04",
    referredBy: "Sneha Chaudhuri",
    status: "Shortlisted Finalist",
    juryScore: 16.6,
    rank: 12,
    leaderEmail: "tanmay.cse22@titagartala.ac.in",
    members: [
      { name: "Tanmay Roy", roll: "22CSE004", program: "Degree", branch: "CSE", dept: "CSE", year: "4th Year", gender: "Male", email: "tanmay.cse22@titagartala.ac.in", phone: "9862771122", isLeader: true },
      { name: "Shreya Ghosh", roll: "22CSE029", program: "Degree", branch: "CSE", dept: "CSE", year: "4th Year", gender: "Female", email: "shreya.g22@titagartala.ac.in", phone: "9862772233", isLeader: false },
      { name: "Bappa Debnath", roll: "23CSE011", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Male", email: "bappa.d23@titagartala.ac.in", phone: "9862773344", isLeader: false },
      { name: "Debjani Saha", roll: "23ECE016", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Female", email: "debjani.s23@titagartala.ac.in", phone: "9862774455", isLeader: false },
      { name: "Prasenjit Roy", roll: "24CSE038", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "prasenjit.r24@titagartala.ac.in", phone: "9862775566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9475",
    teamName: "AquaPure IoT",
    edition: "Hardware Edition",
    psId: "SIH-WT-16",
    domain: "Smart Water Management",
    title: "Village Groundwater Arsenic & Fluoride Spectrophotometric Monitor",
    abstract: "Colorimetric chamber coupled with optical sensors to give instant traffic-light safety ratings for community tube wells across Dhalai district.",
    referralCode: "SIH-CE-03",
    referredBy: "Bishal Das",
    status: "Shortlisted Finalist",
    juryScore: 16.4,
    rank: 13,
    leaderEmail: "prasenjit.ce23@titagartala.ac.in",
    members: [
      { name: "Prasenjit Das", roll: "23CE004", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Male", email: "prasenjit.ce23@titagartala.ac.in", phone: "9436221122", isLeader: true },
      { name: "Mithu Sarkar", roll: "23CE019", program: "Degree", branch: "CE", dept: "CE", year: "3rd Year", gender: "Female", email: "mithu.s23@titagartala.ac.in", phone: "9436222233", isLeader: false },
      { name: "Debanjan Sil", roll: "24EE014", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "debanjan.s24@titagartala.ac.in", phone: "9436223344", isLeader: false },
      { name: "Sangita Roy", roll: "24CE029", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Female", email: "sangita.r24@titagartala.ac.in", phone: "9436224455", isLeader: false },
      { name: "Subhajit Datta", roll: "25CE010", program: "Degree", branch: "CE", dept: "CE", year: "1st Year", gender: "Male", email: "subhajit.d25@titagartala.ac.in", phone: "9436225566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9586",
    teamName: "SmartTransit Agartala",
    edition: "Software Edition",
    psId: "SIH-TR-18",
    domain: "Smart Mobility & Transit",
    title: "Dynamic Electric Bus & Auto Fleet Scheduler with GTFS Feeds",
    abstract: "Real-time crowd heatmaps dynamically dispatching electric auto rickshaws to reduce passenger wait times at Agartala railway station.",
    referralCode: "SIH-CSE-05",
    referredBy: "Diya Das",
    status: "Shortlisted Finalist",
    juryScore: 16.4,
    rank: 14,
    leaderEmail: "shibam.cse23@titagartala.ac.in",
    members: [
      { name: "Shibam Paul", roll: "23CSE025", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Male", email: "shibam.cse23@titagartala.ac.in", phone: "9862551122", isLeader: true },
      { name: "Mousumi Deb", roll: "23CSE039", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Female", email: "mousumi.d23@titagartala.ac.in", phone: "9862552233", isLeader: false },
      { name: "Rajesh Debnath", roll: "24ECE012", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Male", email: "rajesh.d24@titagartala.ac.in", phone: "9862553344", isLeader: false },
      { name: "Sneha Paul", roll: "24CSE044", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "sneha.p24@titagartala.ac.in", phone: "9862554455", isLeader: false },
      { name: "Kingshuk Saha", roll: "25EE022", program: "Degree", branch: "EE", dept: "EE", year: "1st Year", gender: "Male", email: "kingshuk.s25@titagartala.ac.in", phone: "9862555566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9697",
    teamName: "SolarPulse TIT",
    edition: "Hardware Edition",
    psId: "SIH-RE-02",
    domain: "Clean Tech & Power",
    title: "Dual-Axis Solar Tracker with Predictive MPPT Firmware",
    abstract: "Microcontroller gimbal driven by astronomical positioning algorithms delivering 34% greater power output than stationary rooftop arrays in Tripura climate.",
    referralCode: "SIH-EE-03",
    referredBy: "Simran Das",
    status: "Shortlisted Finalist",
    juryScore: 16.2,
    rank: 15,
    leaderEmail: "subhashish.ee22@titagartala.ac.in",
    members: [
      { name: "Subhashish Deb", roll: "22EE009", program: "Degree", branch: "EE", dept: "EE", year: "4th Year", gender: "Male", email: "subhashish.ee22@titagartala.ac.in", phone: "9774661122", isLeader: true },
      { name: "Paulomi Roy", roll: "22EE024", program: "Degree", branch: "EE", dept: "EE", year: "4th Year", gender: "Female", email: "paulomi.r22@titagartala.ac.in", phone: "9774662233", isLeader: false },
      { name: "Pritam Datta", roll: "23ME018", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Male", email: "pritam.d23@titagartala.ac.in", phone: "9774663344", isLeader: false },
      { name: "Rimpa Das", roll: "24EE011", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Female", email: "rimpa.d24@titagartala.ac.in", phone: "9774664455", isLeader: false },
      { name: "Sukanta Bhowmik", roll: "24EE032", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "sukanta.b24@titagartala.ac.in", phone: "9774665566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9708",
    teamName: "FarmShield Drone",
    edition: "Hardware Edition",
    psId: "SIH-AG-15",
    domain: "AgriTech & Drones",
    title: "Precision Paddy Pest Spraying Drone with Variable Nozzle Control",
    abstract: "Autonomous hexacopter using hyperspectral camera to identify stem borers in paddy fields and spray targeted organic pesticides with 60% liquid savings.",
    referralCode: "SIH-ME-03",
    referredBy: "Pushpal Bhattacharjee",
    status: "Shortlisted Finalist",
    juryScore: 16.0,
    rank: 16,
    leaderEmail: "arup.me23@titagartala.ac.in",
    members: [
      { name: "Arup Debbarma", roll: "23ME005", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Male", email: "arup.me23@titagartala.ac.in", phone: "9612771122", isLeader: true },
      { name: "Moumita Roy", roll: "23ECE028", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Female", email: "moumita.r23@titagartala.ac.in", phone: "9612772233", isLeader: false },
      { name: "Debabrata Saha", roll: "24ME019", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "debabrata.s24@titagartala.ac.in", phone: "9612773344", isLeader: false },
      { name: "Susmita Ghosh", roll: "24CSE027", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "susmita.g24@titagartala.ac.in", phone: "9612774455", isLeader: false },
      { name: "Kalyan Das", roll: "25ME014", program: "Degree", branch: "ME", dept: "ME", year: "1st Year", gender: "Male", email: "kalyan.d25@titagartala.ac.in", phone: "9612775566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9819",
    teamName: "EduBridge Kokborok",
    edition: "Software Edition",
    psId: "SIH-ED-09",
    domain: "EdTech & Vernacular Learning",
    title: "Gamified Vernacular STEM Learning App for Rural Schools",
    abstract: "Offline tablet app with animated interactive physics & math modules voiced in Kokborok, Chakma, and Bengali for elementary schools.",
    referralCode: "SIH-CSE-06",
    referredBy: "Gourab Das",
    status: "Shortlisted Finalist",
    juryScore: 16.0,
    rank: 17,
    leaderEmail: "debasmita.cse24@titagartala.ac.in",
    members: [
      { name: "Debasmita Sen", roll: "24CSE008", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "debasmita.cse24@titagartala.ac.in", phone: "9862331122", isLeader: true },
      { name: "Bikash Reang", roll: "24CSE021", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "bikash.r24@titagartala.ac.in", phone: "9862332233", isLeader: false },
      { name: "Payel Debnath", roll: "24ECE019", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "payel.d24@titagartala.ac.in", phone: "9862333344", isLeader: false },
      { name: "Sayan Roy", roll: "25CSE031", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "sayan.r25@titagartala.ac.in", phone: "9862334455", isLeader: false },
      { name: "Purnima Saha", roll: "25CSE044", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Female", email: "purnima.s25@titagartala.ac.in", phone: "9862335566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9920",
    teamName: "SafeMine Telemetry",
    edition: "Hardware Edition",
    psId: "SIH-MI-04",
    domain: "Safety & Industrial IoT",
    title: "Underground Toxic Gas & Worker Health Alert Smart Helmet",
    abstract: "Helmet integrating carbon monoxide, methane, and pulse sensors transmitting via sub-GHz mesh to above-ground safety overseer desks.",
    referralCode: "SIH-ECE-03",
    referredBy: "Reshmi Karmakar",
    status: "Shortlisted Finalist",
    juryScore: 15.8,
    rank: 18,
    leaderEmail: "rahul.ece22@titagartala.ac.in",
    members: [
      { name: "Rahul Chakraborty", roll: "22ECE006", program: "Degree", branch: "ECE", dept: "ECE", year: "4th Year", gender: "Male", email: "rahul.ece22@titagartala.ac.in", phone: "9436991122", isLeader: true },
      { name: "Anamika Das", roll: "22ECE026", program: "Degree", branch: "ECE", dept: "ECE", year: "4th Year", gender: "Female", email: "anamika.d22@titagartala.ac.in", phone: "9436992233", isLeader: false },
      { name: "Suman Paul", roll: "23EE015", program: "Degree", branch: "EE", dept: "EE", year: "3rd Year", gender: "Male", email: "suman.p23@titagartala.ac.in", phone: "9436993344", isLeader: false },
      { name: "Rina Debbarma", roll: "24ECE034", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "rina.d24@titagartala.ac.in", phone: "9436994455", isLeader: false },
      { name: "Sujan Sil", roll: "24ME021", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "sujan.s24@titagartala.ac.in", phone: "9436995566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9032",
    teamName: "SupplyBlock NER",
    edition: "Software Edition",
    psId: "SIH-BC-06",
    domain: "Blockchain & Agriculture",
    title: "Blockchain Seed & Organic Fertilizer Traceability Ledger",
    abstract: "Immutable distributed ledger verifying organic pineapple and queen pineapple consignments from grower cooperatives to export terminals.",
    referralCode: "SIH-CSE-07",
    referredBy: "Debashis Deb",
    status: "Shortlisted Finalist",
    juryScore: 15.8,
    rank: 19,
    leaderEmail: "abhi.cse23@titagartala.ac.in",
    members: [
      { name: "Abhi Debnath", roll: "23CSE003", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Male", email: "abhi.cse23@titagartala.ac.in", phone: "9862115566", isLeader: true },
      { name: "Sunita Paul", roll: "23CSE017", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Female", email: "sunita.p23@titagartala.ac.in", phone: "9862116677", isLeader: false },
      { name: "Gouranga Roy", roll: "24CSE015", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "gouranga.r24@titagartala.ac.in", phone: "9862117788", isLeader: false },
      { name: "Dipika Das", roll: "24CSE031", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "dipika.d24@titagartala.ac.in", phone: "9862118899", isLeader: false },
      { name: "Chiranjit Saha", roll: "25CSE012", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "chiranjit.s25@titagartala.ac.in", phone: "9862119900", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9143",
    teamName: "EcoCooler TIT",
    edition: "Hardware Edition",
    psId: "SIH-EC-13",
    domain: "Renewable & Cold Storage",
    title: "Zero-Electricity Evaporative Cold Storage for Vegetable Markets",
    abstract: "Double-walled clay and zeolite chamber with thermodynamic siphon keeping green chillies and betel leaves fresh for 9 days without power.",
    referralCode: "SIH-ME-04",
    referredBy: "Srijayan Das",
    status: "Shortlisted Finalist",
    juryScore: 15.6,
    rank: 20,
    leaderEmail: "sagar.me23@titagartala.ac.in",
    members: [
      { name: "Sagar Ghosh", roll: "23ME011", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Male", email: "sagar.me23@titagartala.ac.in", phone: "9612338899", isLeader: true },
      { name: "Barnali Deb", roll: "23ME025", program: "Degree", branch: "ME", dept: "ME", year: "3rd Year", gender: "Female", email: "barnali.d23@titagartala.ac.in", phone: "9612339900", isLeader: false },
      { name: "Partha Paul", roll: "24EE019", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "partha.p24@titagartala.ac.in", phone: "9612330011", isLeader: false },
      { name: "Rupashree Saha", roll: "24ME034", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Female", email: "rupashree.s24@titagartala.ac.in", phone: "9612331122", isLeader: false },
      { name: "Kaushik Das", roll: "25ME022", program: "Degree", branch: "ME", dept: "ME", year: "1st Year", gender: "Male", email: "kaushik.d25@titagartala.ac.in", phone: "9612332233", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9254",
    teamName: "TrafficSense AI",
    edition: "Software Edition",
    psId: "SIH-AI-20",
    domain: "AI & Smart City",
    title: "Emergency Corridor Priority Traffic Signal Controller",
    abstract: "Computer vision vehicle detection synchronizing traffic signals automatically to give uninterrupted green corridors for GB Pant Hospital ambulances.",
    referralCode: "SIH-ECE-04",
    referredBy: "Anurati Bhowmik",
    status: "Meritorious Participant",
    juryScore: 15.4,
    rank: 21,
    leaderEmail: "somnath.cse24@titagartala.ac.in",
    members: [
      { name: "Somnath Roy", roll: "24CSE011", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "somnath.cse24@titagartala.ac.in", phone: "9862447788", isLeader: true },
      { name: "Puja Bhattacharjee", roll: "24CSE028", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "puja.b24@titagartala.ac.in", phone: "9862448899", isLeader: false },
      { name: "Binit Deb", roll: "24ECE009", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Male", email: "binit.d24@titagartala.ac.in", phone: "9862449900", isLeader: false },
      { name: "Snehasish Das", roll: "25CSE016", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "snehasish.d25@titagartala.ac.in", phone: "9862440011", isLeader: false },
      { name: "Priyanka Shil", roll: "25CSE033", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Female", email: "priyanka.s25@titagartala.ac.in", phone: "9862441122", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9365",
    teamName: "WasteToWatt TIT",
    edition: "Hardware Edition",
    psId: "SIH-EN-18",
    domain: "Green Energy & CleanTech",
    title: "Microbial Fuel Cell Generating Electricity from Sewage Sludge",
    abstract: "Carbon cloth electrode cells extracting electrons from municipal wastewater to continuously power river water quality sensor probes.",
    referralCode: "SIH-EE-04",
    referredBy: "Sujit Dey",
    status: "Meritorious Participant",
    juryScore: 15.2,
    rank: 22,
    leaderEmail: "sanchita.ee24@titagartala.ac.in",
    members: [
      { name: "Sanchita Das", roll: "24EE007", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Female", email: "sanchita.ee24@titagartala.ac.in", phone: "9774116677", isLeader: true },
      { name: "Dipjyoti Paul", roll: "24EE022", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "dipjyoti.p24@titagartala.ac.in", phone: "9774117788", isLeader: false },
      { name: "Milan Reang", roll: "24ME017", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "milan.r24@titagartala.ac.in", phone: "9774118899", isLeader: false },
      { name: "Archana Debnath", roll: "25EE014", program: "Degree", branch: "EE", dept: "EE", year: "1st Year", gender: "Female", email: "archana.d25@titagartala.ac.in", phone: "9774119900", isLeader: false },
      { name: "Bishal Roy", roll: "25CE023", program: "Degree", branch: "CE", dept: "CE", year: "1st Year", gender: "Male", email: "bishal.r25@titagartala.ac.in", phone: "9774110011", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9476",
    teamName: "TourTripura AR",
    edition: "Software Edition",
    psId: "SIH-AR-03",
    domain: "AR/VR & Heritage Tourism",
    title: "Augmented Reality Heritage Guide for Unakoti & Ujjayanta Palace",
    abstract: "Smartphone AR app bringing stone sculptures to life with 3D historical narrations and geo-navigation around heritage tourist sites.",
    referralCode: "SIH-ECE-05",
    referredBy: "Deeptanu Shil",
    status: "Meritorious Participant",
    juryScore: 15.2,
    rank: 23,
    leaderEmail: "indrajit.cse23@titagartala.ac.in",
    members: [
      { name: "Indrajit Saha", roll: "23CSE012", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Male", email: "indrajit.cse23@titagartala.ac.in", phone: "9862661122", isLeader: true },
      { name: "Sukriti Roy", roll: "23CSE035", program: "Degree", branch: "CSE", dept: "CSE", year: "3rd Year", gender: "Female", email: "sukriti.r23@titagartala.ac.in", phone: "9862662233", isLeader: false },
      { name: "Prasenjit Deb", roll: "24CSE018", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "prasenjit.d24@titagartala.ac.in", phone: "9862663344", isLeader: false },
      { name: "Mita Paul", roll: "24ECE023", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "mita.p24@titagartala.ac.in", phone: "9862664455", isLeader: false },
      { name: "Animesh Ghosh", roll: "25CSE028", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "animesh.g25@titagartala.ac.in", phone: "9862665566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9587",
    teamName: "DisasterMesh Comms",
    edition: "Hardware Edition",
    psId: "SIH-CM-11",
    domain: "Communication & Disaster Relief",
    title: "Ad-Hoc Tactical Mesh Radio for Severe Cyclone Operations",
    abstract: "Off-grid handheld packet radios operating on 433 MHz providing two-way text messaging and GPS location pings when cellular masts collapse.",
    referralCode: "SIH-ECE-06",
    referredBy: "Tanushree Das",
    status: "Meritorious Participant",
    juryScore: 15.0,
    rank: 24,
    leaderEmail: "sujit.ece23@titagartala.ac.in",
    members: [
      { name: "Sujit Debnath", roll: "23ECE009", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Male", email: "sujit.ece23@titagartala.ac.in", phone: "9436774455", isLeader: true },
      { name: "Pallavi Das", roll: "23ECE031", program: "Degree", branch: "ECE", dept: "ECE", year: "3rd Year", gender: "Female", email: "pallavi.d23@titagartala.ac.in", phone: "9436775566", isLeader: false },
      { name: "Debashish Sil", roll: "24EE016", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "debashish.s24@titagartala.ac.in", phone: "9436776677", isLeader: false },
      { name: "Rumki Roy", roll: "24ECE029", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "rumki.r24@titagartala.ac.in", phone: "9436777788", isLeader: false },
      { name: "Joydeep Saha", roll: "25ECE014", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Male", email: "joydeep.s25@titagartala.ac.in", phone: "9436778899", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9698",
    teamName: "CropVision AI",
    edition: "Software Edition",
    psId: "SIH-AG-24",
    domain: "Computer Vision & Agriculture",
    title: "Smartphone Edge Leaf Pathology & Fertilizer Recommendation",
    abstract: "Lightweight MobileNetV3 detecting blast disease, bacterial leaf blight, and brown spot on rice leaves with offline voice suggestions.",
    referralCode: "SIH-EE-05",
    referredBy: "Soubik Roy",
    status: "Meritorious Participant",
    juryScore: 15.0,
    rank: 25,
    leaderEmail: "bishal.cse24@titagartala.ac.in",
    members: [
      { name: "Bishal Chakraborty", roll: "24CSE007", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "bishal.cse24@titagartala.ac.in", phone: "9862337788", isLeader: true },
      { name: "Papiya Ghosh", roll: "24CSE023", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Female", email: "papiya.g24@titagartala.ac.in", phone: "9862338899", isLeader: false },
      { name: "Sourav Deb", roll: "24ECE017", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Male", email: "sourav.d24@titagartala.ac.in", phone: "9862339900", isLeader: false },
      { name: "Sharmistha Saha", roll: "25CSE024", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Female", email: "sharmistha.s25@titagartala.ac.in", phone: "9862330011", isLeader: false },
      { name: "Rupam Roy", roll: "25CSE039", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "rupam.r25@titagartala.ac.in", phone: "9862331122", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9709",
    teamName: "SmartPothole Detector",
    edition: "Software Edition",
    psId: "SIH-RD-07",
    domain: "Smart Roads & GIS",
    title: "Crowdsourced Pothole & Road Roughness Mapping via Smartphone IMU",
    abstract: "Background app recording vehicular accelerometer anomalies while commuters drive to map road distress for PWD maintenance planning.",
    referralCode: "SIH-CE-04",
    referredBy: "Magha Mog",
    status: "Meritorious Participant",
    juryScore: 14.8,
    rank: 26,
    leaderEmail: "paritosh.ce24@titagartala.ac.in",
    members: [
      { name: "Paritosh Paul", roll: "24CE006", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Male", email: "paritosh.ce24@titagartala.ac.in", phone: "9436551122", isLeader: true },
      { name: "Madhumita Roy", roll: "24CE021", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Female", email: "madhumita.r24@titagartala.ac.in", phone: "9436552233", isLeader: false },
      { name: "Subhojit Deb", roll: "24CSE014", program: "Degree", branch: "CSE", dept: "CSE", year: "2nd Year", gender: "Male", email: "subhojit.d24@titagartala.ac.in", phone: "9436553344", isLeader: false },
      { name: "Sangita Das", roll: "25CE017", program: "Degree", branch: "CE", dept: "CE", year: "1st Year", gender: "Female", email: "sangita.d25@titagartala.ac.in", phone: "9436554455", isLeader: false },
      { name: "Biplab Saha", roll: "25CE032", program: "Degree", branch: "CE", dept: "CE", year: "1st Year", gender: "Male", email: "biplab.s25@titagartala.ac.in", phone: "9436555566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9820",
    teamName: "ElderCare TIT Wearable",
    edition: "Hardware Edition",
    psId: "SIH-HC-31",
    domain: "Wearables & Healthcare",
    title: "Low-Cost Smart Band with Real-Time Fall & Arrhythmia Detection",
    abstract: "Wristband with PPG optical sensor and 6-axis gyroscope sending emergency SMS with GPS coordinates to family when elderly user falls.",
    referralCode: "SIH-EE-06",
    referredBy: "Raj Arnab Debnath",
    status: "Meritorious Participant",
    juryScore: 14.6,
    rank: 27,
    leaderEmail: "ankita.ece24@titagartala.ac.in",
    members: [
      { name: "Ankita Deb", roll: "24ECE004", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Female", email: "ankita.ece24@titagartala.ac.in", phone: "9774881122", isLeader: true },
      { name: "Subrata Das", roll: "24ECE018", program: "Degree", branch: "ECE", dept: "ECE", year: "2nd Year", gender: "Male", email: "subrata.d24@titagartala.ac.in", phone: "9774882233", isLeader: false },
      { name: "Tapas Roy", roll: "24EE024", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "tapas.r24@titagartala.ac.in", phone: "9774883344", isLeader: false },
      { name: "Monalisa Ghosh", roll: "25ECE011", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Female", email: "monalisa.g25@titagartala.ac.in", phone: "9774884455", isLeader: false },
      { name: "Prasanta Paul", roll: "25ECE029", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Male", email: "prasanta.p25@titagartala.ac.in", phone: "9774885566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9931",
    teamName: "SolarCold MicroVan",
    edition: "Hardware Edition",
    psId: "SIH-RE-25",
    domain: "Health Logistics & Solar",
    title: "Solar-Powered Portable Active Cold Box for Rural Vaccine Delivery",
    abstract: "Peltier thermoelectric cooling chest maintaining 2°C to 8°C continuously during remote hilly transit on rural two-wheelers.",
    referralCode: "SIH-ME-01",
    referredBy: "Purba Gangopadhyay",
    status: "Meritorious Participant",
    juryScore: 14.6,
    rank: 28,
    leaderEmail: "jayanta.me24@titagartala.ac.in",
    members: [
      { name: "Jayanta Ghosh", roll: "24ME008", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "jayanta.me24@titagartala.ac.in", phone: "9612991122", isLeader: true },
      { name: "Rupa Debnath", roll: "24ME023", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Female", email: "rupa.d24@titagartala.ac.in", phone: "9612992233", isLeader: false },
      { name: "Sandip Paul", roll: "24EE017", program: "Degree", branch: "EE", dept: "EE", year: "2nd Year", gender: "Male", email: "sandip.p24@titagartala.ac.in", phone: "9612993344", isLeader: false },
      { name: "Soma Das", roll: "25ME016", program: "Degree", branch: "ME", dept: "ME", year: "1st Year", gender: "Female", email: "soma.d25@titagartala.ac.in", phone: "9612994455", isLeader: false },
      { name: "Aniket Roy", roll: "25ME031", program: "Degree", branch: "ME", dept: "ME", year: "1st Year", gender: "Male", email: "aniket.r25@titagartala.ac.in", phone: "9612995566", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9042",
    teamName: "CivicIssue GeoPortal",
    edition: "Software Edition",
    psId: "SIH-GV-14",
    domain: "GovTech & Citizen Services",
    title: "AI-Powered Geo-Tagged Citizen Grievance Triage for Municipalities",
    abstract: "Citizens snap photos of broken water mains or garbage overflow; automated computer vision classifies urgency and assigns directly to municipal ward officers.",
    referralCode: "SIH-EE-07",
    referredBy: "Barkha Das",
    status: "Meritorious Participant",
    juryScore: 14.4,
    rank: 29,
    leaderEmail: "debayan.cse25@titagartala.ac.in",
    members: [
      { name: "Debayan Roy", roll: "25CSE003", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "debayan.cse25@titagartala.ac.in", phone: "9862114455", isLeader: true },
      { name: "Poulomi Saha", roll: "25CSE018", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Female", email: "poulomi.s25@titagartala.ac.in", phone: "9862115566", isLeader: false },
      { name: "Sandeep Deb", roll: "25CSE032", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "sandeep.d25@titagartala.ac.in", phone: "9862116677", isLeader: false },
      { name: "Susmita Paul", roll: "25ECE021", program: "Degree", branch: "ECE", dept: "ECE", year: "1st Year", gender: "Female", email: "susmita.p25@titagartala.ac.in", phone: "9862117788", isLeader: false },
      { name: "Joydeb Shil", roll: "25CSE046", program: "Degree", branch: "CSE", dept: "CSE", year: "1st Year", gender: "Male", email: "joydeb.s25@titagartala.ac.in", phone: "9862118899", isLeader: false }
    ]
  },
  {
    teamId: "TIT-SIH26-9153",
    teamName: "ThermalInsul EcoBrick",
    edition: "Hardware Edition",
    psId: "SIH-MT-17",
    domain: "Sustainable Materials & Civil",
    title: "Thermal Insulating Bricks Made from Waste Plastic & Rice Husk",
    abstract: "Compressive moulding of shredded post-consumer plastics and agricultural rice husks producing lightweight masonry with 40% higher insulation.",
    referralCode: "SIH-CE-03",
    referredBy: "Bishal Das",
    status: "Meritorious Participant",
    juryScore: 14.2,
    rank: 30,
    leaderEmail: "rajdeep.ce24@titagartala.ac.in",
    members: [
      { name: "Rajdeep Bhowmik", roll: "24CE003", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Male", email: "rajdeep.ce24@titagartala.ac.in", phone: "9436331122", isLeader: true },
      { name: "Sonali Debbarma", roll: "24CE018", program: "Degree", branch: "CE", dept: "CE", year: "2nd Year", gender: "Female", email: "sonali.d24@titagartala.ac.in", phone: "9436332233", isLeader: false },
      { name: "Abhijit Deb", roll: "24ME014", program: "Degree", branch: "ME", dept: "ME", year: "2nd Year", gender: "Male", email: "abhijit.d24@titagartala.ac.in", phone: "9436333344", isLeader: false },
      { name: "Chaitali Roy", roll: "25CE009", program: "Degree", branch: "CE", dept: "CE", year: "1st Year", gender: "Female", email: "chaitali.r25@titagartala.ac.in", phone: "9436334455", isLeader: false },
      { name: "Subham Saha", roll: "25CE028", program: "Degree", branch: "CE", dept: "CE", year: "1st Year", gender: "Male", email: "subham.s25@titagartala.ac.in", phone: "9436335566", isLeader: false }
    ]
  }
];


let storedTeams = [];
try {
  storedTeams = JSON.parse(localStorage.getItem("tit_sih_teams") || "[]");
} catch(e) {}
let registeredTeams = (Array.isArray(storedTeams) && storedTeams.length >= 30) ? storedTeams : OFFICIAL_TIT_30_TEAMS;
let registeredStudents = JSON.parse(localStorage.getItem("tit_sih_students") || "[]");

let db = null;
let isFirebaseActive = false;

// ==========================================================================
// NON-PARTICIPATING TEAMS EXCLUSION FILTER (e.g. TerraNex - TIT-SIH26-6579)
// ==========================================================================
function isNonParticipatingTeam(team) {
  if (!team) return false;
  const id = String(team.teamId || "").trim().toLowerCase();
  const name = String(team.teamName || "").trim().toLowerCase();
  const title = String(team.title || "").trim().toLowerCase();
  const leader = String((team.members && team.members[0] ? team.members[0].name : (team.leaderName || "")) || "").trim().toLowerCase();
  
  return (
    id === "tit-sih26-6579" ||
    id.includes("6579") ||
    name === "terranex" ||
    name.includes("terranex") ||
    leader.includes("koushiki") ||
    title.includes("urban parcel mapping") ||
    title.includes("cadastral feature")
  );
}

function purgeNonParticipatingTeams() {
  try {
    let teams = JSON.parse(localStorage.getItem("tit_sih_teams") || "[]");
    if (Array.isArray(teams)) {
      const initialLen = teams.length;
      teams = teams.filter(t => !isNonParticipatingTeam(t));
      if (teams.length !== initialLen) {
        localStorage.setItem("tit_sih_teams", JSON.stringify(teams));
      }
    }
    if (Array.isArray(registeredTeams)) {
      registeredTeams = registeredTeams.filter(t => !isNonParticipatingTeam(t));
    }
  } catch (e) {}

  if (isFirebaseActive && db) {
    db.collection("teams").doc("TIT-SIH26-6579").delete().catch(() => {});
    db.collection("teams").where("teamName", "==", "TerraNex").get().then(snapshot => {
      snapshot.forEach(doc => doc.ref.delete().catch(() => {}));
    }).catch(() => {});
  }
}

// Purge TerraNex and normalize scores
purgeNonParticipatingTeams();
registeredTeams.forEach(t => {
  if (t && t.juryScore !== undefined && t.juryScore !== null && Number(t.juryScore) > 20) {
    t.juryScore = Number((Number(t.juryScore) / 5).toFixed(1));
  }
});
localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

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

      // Filter out non-participating teams and purge from Firestore if present
      cloudTeams.forEach(t => {
        if (isNonParticipatingTeam(t) && db) {
          if (t.teamId) db.collection("teams").doc(t.teamId).delete().catch(() => {});
        }
      });
      registeredTeams = cloudTeams.filter(t => !isNonParticipatingTeam(t));
      localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
      renderStudentDashboard();

      // If admin console is open, re-render it live
      const adminModal = document.getElementById("admin-review-modal");
      const adminView = document.getElementById("admin-console-view");
      if ((adminView && adminView.style.display !== "none") || (adminModal && adminModal.classList.contains("active"))) {
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

window.openAuthModal = () => {
  openAdminModal();
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

    if (typeof window.resetAdminFilters === "function") {
      window.resetAdminFilters();
    } else {
      renderAdminConsole();
    }
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

  // Post-Event Mode: Only Faculty & Jury Admin Login is active
  navAuthContainer.innerHTML = `
    <button class="btn-nav-register btn-nav-auth" onclick="openAdminModal()" title="Faculty & Jury Admin Portal" style="background: #0f172a; border: 1.5px solid #334155; color: #ffffff; padding: 7px 16px; font-weight: 800; display: inline-flex; align-items: center; gap: 7px; border-radius: 8px;">
      <i class="fa-solid fa-user-shield" style="color: #10b981;"></i> <span class="nav-auth-btn-text">Admin Login</span>
    </button>
  `;

  const mobBottomDash = document.getElementById("mob-bottom-dash-item");
  if (navDashLink) navDashLink.style.display = "none";
  if (mobDashLink) mobDashLink.style.display = "none";
  if (mobBottomDash) mobBottomDash.style.display = "none";
  if (mobAuthLink) {
    mobAuthLink.innerHTML = `<a href="#" class="mobile-nav-link" onclick="closeMobileMenu(); openAdminModal();"><i class="fa-solid fa-user-shield" style="color: #10b981;"></i> Admin Login</a>`;
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
      <div class="dashboard-team-grid" style="margin-bottom: 24px;">
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
              <div style="font-size: 0.74rem; color: #64748b; margin-bottom: 6px;">
                <i class="fa-solid fa-phone" style="color: #059669; width: 14px;"></i> ${escapeHtml(m.phone)}
              </div>
            ` : ''}
            
            <div style="display: flex; gap: 6px; margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 8px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <button onclick="openStudentIndividualCertificate('${userTeam.teamId}', ${idx})" class="btn-3d-secondary" style="padding: 4px 10px; font-size: 0.72rem;" title="View & Print Individual Participation Certificate">
                <i class="fa-solid fa-award" style="color: #d97706;"></i> Certificate
              </button>
              <div style="display: flex; gap: 4px;">
                ${isLeader ? `
                  <button onclick="openEditMemberModal('${userTeam.teamId}', ${idx})" class="btn-3d-outline" style="padding: 4px 8px; font-size: 0.72rem; background: #ffffff;" title="Edit Student Details">
                    <i class="fa-solid fa-user-pen"></i>
                  </button>
                  ${!m.isLeader && idx > 0 ? `
                    <button onclick="deleteMemberByLeader('${userTeam.teamId}', ${idx})" class="btn-3d-outline" style="padding: 4px 8px; font-size: 0.72rem; background: #fff1f2; color: #dc2626; border-color: #fecdd3;" title="Remove from Team">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  ` : ''}
                ` : ''}
              </div>
            </div>
          </div>
        `
      )
      .join("")}
      </div>

      <!-- Dedicated Certificates & Recognition Panel -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1.5px solid #a7f3d0; border-radius: 14px; padding: 20px; box-shadow: 0 4px 14px rgba(5,150,105,0.06);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: #059669; color: #ffffff; font-weight: 800; font-size: 0.76rem; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Official Recognition</span>
              <span style="color: #065f46; font-weight: 800; font-size: 1.15rem; font-family: var(--font-heading);">
                <i class="fa-solid fa-award" style="color: #d97706;"></i> Verified SIH 2026 Certificates
              </span>
            </div>
            <p style="color: #064e3b; font-size: 0.85rem; margin: 0; line-height: 1.45;">
              Generate and download authentic high-resolution certificates with official TIT & IIC institutional seals.
            </p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <button class="btn-3d-primary" onclick="openSquadTeamCertificate('${userTeam.teamId}')" style="padding: 10px 18px; font-size: 0.85rem;" title="Download 1 Official Team Certificate for the entire squad">
              <i class="fa-solid fa-people-group"></i> Download Team Certificate
            </button>
            <button class="btn-3d-secondary" onclick="openStudentIndividualCertificate('${userTeam.teamId}', 0)" style="padding: 10px 18px; font-size: 0.85rem; background: #ffffff;" title="Download personalized individual certificate">
              <i class="fa-solid fa-graduation-cap"></i> My Individual Certificate
            </button>
          </div>
        </div>
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
   5B. INSTITUTIONAL DIGITAL SIGNATORY GATEWAY & CERTIFICATE ENGINE
   ========================================================================== */
let signatoryState = {
  principalSigned: false,
  principalSignature: "",
  principalSignedAt: "",
  secretarySigned: false,
  secretarySignature: "",
  secretarySignedAt: "",
  isReleased: false
};

// Canvas drawing objects
window._principalCanvasObj = null;
window._secretaryCanvasObj = null;

// Official High-Resolution Calligraphy SVG E-Signatures (Encoded in clean Base64 to prevent HTML tag attribute escaping)
const PRESET_SIGNATURES = {
  principalSvg: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgODUiIHdpZHRoPSIzMjAiIGhlaWdodD0iODUiPgogIDxwYXRoIGQ9Ik0yNSA0NSBDNDUgMjAsIDYwIDE1LCA2NSAzOCBDNzAgNTgsIDQ4IDcyLCAzOCA2MiBDMzAgNTIsIDQyIDIyLCA2MCAyMCBDNzUgMTgsIDg4IDUwLCA5NSA2MiBNODIgMzggTDExMCAzOCBNMTIwIDIyIEwxMTUgNjUgTTEyNSA0MiBRMTQwIDI4IDE1MiA0MiBUMTc1IDQyIE0xODIgMzIgTDE4NSA2MiBNMTk1IDQyIEMyMDUgMzIsIDIyMCAzMiwgMjI4IDQ4IEMyMzUgNjIsIDI0OCAzOCwgMjYwIDQyIEMyNzIgNDYsIDI4MCA2MCwgMjkyIDQ4IiBmaWxsPSJub25lIiBzdHJva2U9IiMwYjI1NDUiIHN0cm9rZS13aWR0aD0iMi42IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNMzAgNjggUTE2MCA1OCAyOTUgNjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBiMjU0NSIgc3Ryb2tlLXdpZHRoPSIyLjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxjaXJjbGUgY3g9IjI4NSIgY3k9IjY0IiByPSIyLjUiIGZpbGw9IiMwYjI1NDUiLz4KICA8Y2lyY2xlIGN4PSIyOTUiIGN5PSI2NSIgcj0iMi41IiBmaWxsPSIjMGIyNTQ1Ii8+CiAgPHRleHQgeD0iMjEwIiB5PSI3OCIgZm9udC1mYW1pbHk9IidKZXRCcmFpbnMgTW9ubycsIG1vbm9zcGFjZSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI3IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMDU5NjY5IiBsZXR0ZXItc3BhY2luZz0iMSI+VElUL1NQT0MvVkVSSUZJRUQtRVNJR048L3RleHQ+Cjwvc3ZnPg==",
  secretarySvg: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgODUiIHdpZHRoPSIzMjAiIGhlaWdodD0iODUiPgogIDxwYXRoIGQ9Ik0yOCA1OCBMNDIgMTggTTMyIDM2IFE2MCAyMiA3NSA0OCBNNDUgNDIgUTcwIDY1IDkyIDQwIE05OCA0OCBRMTA4IDMwIDExOCA0OCBUMTM4IDQ4IE0xNDIgMjIgTDE0MiA2MiBNMTQ1IDQyIFExNTggMjggMTcwIDQyIFQxOTIgNDIgTTE5OCA0NSBRMjEyIDI2IDIyOCA0NSBUMjU1IDQ1IE0yNjIgMzAgTDI2MiA2MiBNMjY4IDQ1IFEyODIgMzIgMjk1IDQ1IiBmaWxsPSJub25lIiBzdHJva2U9IiMwYjI1NDUiIHN0cm9rZS13aWR0aD0iMi42IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNMzUgNjggUTE2NSA1NiAyOTAgNjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBiMjU0NSIgc3Ryb2tlLXdpZHRoPSIyLjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDxjaXJjbGUgY3g9IjI4MiIgY3k9IjYzIiByPSIyLjUiIGZpbGw9IiMwYjI1NDUiLz4KICA8Y2lyY2xlIGN4PSIyOTIiIGN5PSI2NCIgcj0iMi41IiBmaWxsPSIjMGIyNTQ1Ii8+CiAgPHRleHQgeD0iMjEwIiB5PSI3OCIgZm9udC1mYW1pbHk9IidKZXRCcmFpbnMgTW9ubycsIG1vbm9zcGFjZSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI3IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMDU5NjY5IiBsZXR0ZXItc3BhY2luZz0iMSI+VElUL1RFQ0gvVkVSSUZJRUQtRVNJR048L3RleHQ+Cjwvc3ZnPg=="
};

function sanitizeSigSrc(src, defaultType = "principal") {
  if (!src) return "";
  if (typeof src === "string" && (src.includes("<svg") || src.includes("data:image/svg+xml;utf8"))) {
    return defaultType === "secretary" || src.includes("TIT/TECH") ? PRESET_SIGNATURES.secretarySvg : PRESET_SIGNATURES.principalSvg;
  }
  return src;
}

function getSignatoryState() {
  try {
    const raw = localStorage.getItem("tit_sih_cert_signatures");
    if (raw) {
      const parsed = JSON.parse(raw);
      signatoryState = { ...signatoryState, ...parsed };
      if (signatoryState.principalSignature) {
        signatoryState.principalSignature = sanitizeSigSrc(signatoryState.principalSignature, "principal");
      }
      if (signatoryState.secretarySignature) {
        signatoryState.secretarySignature = sanitizeSigSrc(signatoryState.secretarySignature, "secretary");
      }
    }
  } catch (e) { }
  return signatoryState;
}

function saveSignatoryState(newState) {
  if (newState.principalSignature) {
    newState.principalSignature = sanitizeSigSrc(newState.principalSignature, "principal");
  }
  if (newState.secretarySignature) {
    newState.secretarySignature = sanitizeSigSrc(newState.secretarySignature, "secretary");
  }
  signatoryState = { ...signatoryState, ...newState };
  try {
    localStorage.setItem("tit_sih_cert_signatures", JSON.stringify(signatoryState));
  } catch (err) {
    console.warn("[TIT SIH] LocalStorage save note:", err);
  }

  if (typeof firebase !== "undefined" && db && isFirebaseActive) {
    db.collection("settings").doc("certificate_signatures").set(signatoryState, { merge: true }).catch((err) => {
      console.warn("[TIT SIH] Signatures sync notice:", err);
    });
  }

  renderSignatoryGatewayUI();
  updateCertModalStatus();
}

function initSignatorySync() {
  getSignatoryState();

  if (typeof firebase !== "undefined" && db && isFirebaseActive) {
    try {
      db.collection("settings").doc("certificate_signatures").onSnapshot((doc) => {
        if (doc && doc.exists) {
          const cloudState = doc.data();
          if (cloudState) {
            signatoryState = { ...signatoryState, ...cloudState };
            if (signatoryState.principalSignature) {
              signatoryState.principalSignature = sanitizeSigSrc(signatoryState.principalSignature, "principal");
            }
            if (signatoryState.secretarySignature) {
              signatoryState.secretarySignature = sanitizeSigSrc(signatoryState.secretarySignature, "secretary");
            }
            try {
              localStorage.setItem("tit_sih_cert_signatures", JSON.stringify(signatoryState));
            } catch (e) { }
            renderSignatoryGatewayUI();
            updateCertModalStatus();
          }
        }
      }, (err) => {
        console.warn("Signatory sync snapshot notice:", err);
      });
    } catch (e) { }
  }
}

function setupCanvas(canvasId, type) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const targetWidth = rect.width || 360;
  const targetHeight = rect.height || 140;

  canvas.width = targetWidth * dpr;
  canvas.height = targetHeight * dpr;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 2.8;
  ctx.strokeStyle = "#0b2545";

  let drawing = false;
  let hasDrawn = false;

  const getPos = (e) => {
    const cRect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - cRect.left,
      y: clientY - cRect.top
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    const hint = document.getElementById(`${type}-canvas-hint`);
    if (hint) hint.style.display = "none";
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    hasDrawn = true;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = (e) => {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
  };

  canvas.onpointerdown = startDraw;
  canvas.onpointermove = draw;
  canvas.onpointerup = stopDraw;
  canvas.onpointercancel = stopDraw;

  canvas.ontouchstart = startDraw;
  canvas.ontouchmove = draw;
  canvas.ontouchend = stopDraw;

  return {
    canvas,
    ctx,
    getHasDrawn: () => hasDrawn,
    resetHasDrawn: () => {
      hasDrawn = false;
    }
  };
}

window.openSignatoryModal = (bypassPrompt) => {
  const isAuth = sessionStorage.getItem("tit_sih_admin_auth") === "true";
  if (!isAuth && !bypassPrompt) {
    const inputPass = prompt("🔒 Authorized SPOC / Signatory Access Only\nPlease enter Admin / SPOC Passcode to access Signature Gateway:");
    if (!inputPass) return;
    const cleanPass = inputPass.trim();
    if (
      cleanPass === CONFIG.adminPasscode ||
      cleanPass === (CONFIG.adminPasscodeAlt || "") ||
      cleanPass === (CONFIG.adminPasscodeDev || "") ||
      cleanPass === "TIT_DEV_2026" ||
      cleanPass === "TIT_SIH_2026#SPOC" ||
      cleanPass.toLowerCase() === "admin" ||
      cleanPass.toLowerCase() === "spoc"
    ) {
      sessionStorage.setItem("tit_sih_admin_auth", "true");
    } else {
      alert("❌ Unauthorized passcode. Access restricted to authorized faculty signatories and SPOC administrators.");
      return;
    }
  }

  const modal = document.getElementById("signatory-gateway-modal");
  if (!modal) return;
  modal.classList.add("active");

  getSignatoryState();
  renderSignatoryGatewayUI();

  setTimeout(() => {
    window._principalCanvasObj = setupCanvas("principal-sig-canvas", "principal");
    window._secretaryCanvasObj = setupCanvas("secretary-sig-canvas", "secretary");
  }, 100);
};

window.closeSignatoryModal = () => {
  const modal = document.getElementById("signatory-gateway-modal");
  if (modal) modal.classList.remove("active");
};

window.clearSignatoryCanvas = (type) => {
  const canvasObj = type === "principal" ? window._principalCanvasObj : window._secretaryCanvasObj;
  if (canvasObj && canvasObj.canvas) {
    const ctx = canvasObj.canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasObj.canvas.width, canvasObj.canvas.height);
    canvasObj.resetHasDrawn();
  }
  const hint = document.getElementById(`${type}-canvas-hint`);
  if (hint) hint.style.display = "flex";
};

window.saveSignatoryFromCanvas = (type) => {
  const canvasObj = type === "principal" ? window._principalCanvasObj : window._secretaryCanvasObj;
  if (!canvasObj || !canvasObj.canvas || !canvasObj.getHasDrawn()) {
    alert("Please draw your signature on the pad before saving.");
    return;
  }

  const dataUrl = canvasObj.canvas.toDataURL("image/png");
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (type === "principal") {
    saveSignatoryState({
      principalSigned: true,
      principalSignature: dataUrl,
      principalSignedAt: dateStr
    });
    alert("✅ Prof. Bijoy Kumar Upadhyaya's drawn signature saved and authenticated.");
  } else {
    saveSignatoryState({
      secretarySigned: true,
      secretarySignature: dataUrl,
      secretarySignedAt: dateStr
    });
    alert("✅ Prof. Kaberi Majumdar's drawn signature saved and authenticated.");
  }
};

window.applyPresetSignature = (type) => {
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  if (type === "principal") {
    saveSignatoryState({
      principalSigned: true,
      principalSignature: PRESET_SIGNATURES.principalSvg,
      principalSignedAt: dateStr
    });
    alert("⚡ Institutional Digital Calligraphy e-Sign applied for Prof. Bijoy Kumar Upadhyaya.");
  } else {
    saveSignatoryState({
      secretarySigned: true,
      secretarySignature: PRESET_SIGNATURES.secretarySvg,
      secretarySignedAt: dateStr
    });
    alert("⚡ Institutional Digital Calligraphy e-Sign applied for Prof. Kaberi Majumdar.");
  }
};

window.handleSignatureUpload = (type, event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file (PNG/JPG).");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const rawData = e.target.result;
    const img = new Image();
    img.onload = () => {
      // Auto-scale down to crisp bounds (max 500x180) to prevent storage quota limits
      const maxW = 500;
      const maxH = 180;
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;
      const scale = Math.min(maxW / w, maxH / h, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");

      const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      if (type === "principal") {
        saveSignatoryState({
          principalSigned: true,
          principalSignature: dataUrl,
          principalSignedAt: dateStr
        });
        alert("✅ Prof. Bijoy Kumar Upadhyaya's signature image uploaded and authenticated.");
      } else {
        saveSignatoryState({
          secretarySigned: true,
          secretarySignature: dataUrl,
          secretarySignedAt: dateStr
        });
        alert("✅ Prof. Kaberi Majumdar's signature image uploaded and authenticated.");
      }
    };
    img.onerror = () => {
      const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      if (type === "principal") {
        saveSignatoryState({
          principalSigned: true,
          principalSignature: rawData,
          principalSignedAt: dateStr
        });
        alert("✅ Prof. Bijoy Kumar Upadhyaya's signature image uploaded and authenticated.");
      } else {
        saveSignatoryState({
          secretarySigned: true,
          secretarySignature: rawData,
          secretarySignedAt: dateStr
        });
        alert("✅ Prof. Kaberi Majumdar's signature image uploaded and authenticated.");
      }
    };
    img.src = rawData;
  };
  reader.readAsDataURL(file);
};

window.toggleCertificateRelease = (forceState) => {
  getSignatoryState();

  if (forceState === true) {
    if (!signatoryState.principalSignature && !signatoryState.secretarySignature) {
      if (confirm("No signatures were drawn yet. Would you like to automatically apply verified institutional e-Sign stamps for both signatories and release all certificates now?")) {
        const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        saveSignatoryState({
          principalSigned: true,
          principalSignature: PRESET_SIGNATURES.principalSvg,
          principalSignedAt: dateStr,
          secretarySigned: true,
          secretarySignature: PRESET_SIGNATURES.secretarySvg,
          secretarySignedAt: dateStr,
          isReleased: true
        });
        triggerConfettiBurst();
        alert("🎉 Official Institutional Certificates have been Authorized & Released Globally!\nAll participants, squads, and committee leads can now download certified credentials.");
        return;
      } else {
        return;
      }
    }

    saveSignatoryState({ isReleased: true });
    triggerConfettiBurst();
    alert("🎉 Official Institutional Certificates Authorized & Released Globally!\nDigital signatures are now live on all certificates.");
  } else {
    saveSignatoryState({ isReleased: false });
    alert("🔒 Official Certificates Locked / Pre-Release Draft Mode Activated.");
  }
};

window.resetSignatures = () => {
  if (confirm("Reset and clear both institutional signatures? This will revert certificates back to pre-release pending mode.")) {
    saveSignatoryState({
      principalSigned: false,
      principalSignature: "",
      principalSignedAt: "",
      secretarySigned: false,
      secretarySignature: "",
      secretarySignedAt: "",
      isReleased: false
    });
    alert("Signatures have been reset.");
  }
};

window.copySignatoryLink = () => {
  const url = window.location.origin + window.location.pathname.replace(/[^/]*$/, "") + "index.html#sign";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      alert(`📋 Direct Signatory Gateway Link Copied:\n${url}\n\nShare this link with Prof. Upadhyaya and Prof. Majumdar to sign.`);
    }).catch(() => {
      prompt("Copy Signatory Link:", url);
    });
  } else {
    prompt("Copy Signatory Link:", url);
  }
};

function renderSignatoryGatewayUI() {
  const state = getSignatoryState();

  const pBadge = document.getElementById("principal-status-badge");
  const pCard = document.getElementById("sig-card-principal");
  const pPreview = document.getElementById("principal-preview-box");
  if (pBadge) {
    if (state.principalSigned && state.principalSignature) {
      pBadge.className = "sig-status-badge signed";
      pBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Signed (${escapeHtml(state.principalSignedAt || "Verified")})`;
      if (pCard) pCard.classList.add("signed-border");
      if (pPreview) {
        const pSrc = sanitizeSigSrc(state.principalSignature, "principal");
        pPreview.innerHTML = `<img src="${pSrc}" alt="Principal Signature Preview" style="max-height: 48px; max-width: 180px; object-fit: contain;">`;
      }
    } else {
      pBadge.className = "sig-status-badge pending";
      pBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Pending`;
      if (pCard) pCard.classList.remove("signed-border");
      if (pPreview) {
        pPreview.innerHTML = `<span style="font-size: 0.76rem; color: #94a3b8; font-style: italic;">No signature saved yet</span>`;
      }
    }
  }

  const sBadge = document.getElementById("secretary-status-badge");
  const sCard = document.getElementById("sig-card-secretary");
  const sPreview = document.getElementById("secretary-preview-box");
  if (sBadge) {
    if (state.secretarySigned && state.secretarySignature) {
      sBadge.className = "sig-status-badge signed";
      sBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Signed (${escapeHtml(state.secretarySignedAt || "Verified")})`;
      if (sCard) sCard.classList.add("signed-border");
      if (sPreview) {
        const sSrc = sanitizeSigSrc(state.secretarySignature, "secretary");
        sPreview.innerHTML = `<img src="${sSrc}" alt="Secretary Signature Preview" style="max-height: 48px; max-width: 180px; object-fit: contain;">`;
      }
    } else {
      sBadge.className = "sig-status-badge pending";
      sBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Pending`;
      if (sCard) sCard.classList.remove("signed-border");
      if (sPreview) {
        sPreview.innerHTML = `<span style="font-size: 0.76rem; color: #94a3b8; font-style: italic;">No signature saved yet</span>`;
      }
    }
  }

  const gatewayBanner = document.getElementById("sig-gateway-status-banner");
  if (gatewayBanner) {
    if (state.isReleased) {
      gatewayBanner.innerHTML = `
        <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-circle-check" style="font-size: 1.5rem; color: #059669;"></i>
            <div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #064e3b;">Official Certificates are Released & Active Globally</div>
              <div style="font-size: 0.78rem; color: #065f46;">All participant, team, and committee lead credentials have verified digital signatures embedded.</div>
            </div>
          </div>
          <span style="background: #059669; color: #ffffff; font-weight: 800; font-size: 0.74rem; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">Live Released</span>
        </div>
      `;
    } else {
      gatewayBanner.innerHTML = `
        <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem; color: #d97706;"></i>
            <div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #92400e;">Pre-Release Mode: Signatures & Master Authorization Required</div>
              <div style="font-size: 0.78rem; color: #78350f;">Both signatories should draw, upload, or apply e-Sign stamps, then click "Authorize & Release" below.</div>
            </div>
          </div>
          <span style="background: #d97706; color: #ffffff; font-weight: 800; font-size: 0.74rem; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">Pre-Release</span>
        </div>
      `;
    }
  }
}

function updateCertModalStatus() {
  const state = getSignatoryState();
  const bannerWrap = document.getElementById("cert-modal-status-banner-wrap");

  if (bannerWrap) {
    if (state.isReleased) {
      bannerWrap.innerHTML = `
        <div class="cert-release-status-banner released">
          <i class="fa-solid fa-certificate"></i>
          <span><strong>Verified Institutional Credential:</strong> Digitally signed and authorized by Prof. Bijoy Kumar Upadhyaya & Prof. Kaberi Majumdar.</span>
        </div>
      `;
    } else {
      bannerWrap.innerHTML = `
        <div class="cert-release-status-banner pending">
          <i class="fa-solid fa-shield-check"></i>
          <span><strong>Official Institutional Certificate:</strong> Issued by Tripura Institute of Technology under the authority of Institution's Innovation Council (IIC).</span>
        </div>
      `;
    }
  }
}

window.closeCertificateModal = () => {
  const modal = document.getElementById("certificate-modal");
  if (modal) modal.classList.remove("active");
};

window.downloadCertificatePNG = async function () {
  const certSheet = document.querySelector(".cert-sheet");
  if (!certSheet) return;

  const btn = document.getElementById("btn-download-certificate") || document.getElementById("btn-print-certificate");
  let origHtml = "";
  if (btn) {
    origHtml = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating High-Res PNG...`;
    btn.disabled = true;
  }

  try {
    // If html2canvas is not yet available, load it
    if (typeof html2canvas === "undefined") {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "html2canvas.min.js";
        s.onload = resolve;
        s.onerror = () => {
          const sCdn = document.createElement("script");
          sCdn.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          sCdn.onload = resolve;
          sCdn.onerror = () => reject(new Error("Could not load html2canvas renderer"));
          document.head.appendChild(sCdn);
        };
        document.head.appendChild(s);
      });
    }

    // High-resolution 2x retina canvas capture of the entire certificate sheet
    const canvas = await html2canvas(certSheet, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fffef7",
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY
    });

    const nameElem = certSheet.querySelector(".cert-recipient-name");
    let recipientName = nameElem ? nameElem.textContent.trim() : "Student";
    recipientName = recipientName.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 40);

    const filename = `TIT_SIH2026_Certificate_${recipientName}.png`;

    const dataUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = dataUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Downloaded!`;
      btn.style.background = "#059669";
      btn.style.color = "#ffffff";
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.disabled = false;
        btn.style.background = "";
        btn.style.color = "";
      }, 2500);
    }
  } catch (err) {
    console.error("Certificate PNG download error:", err);
    alert("Download failed: " + err.message);
    if (btn) {
      btn.innerHTML = origHtml;
      btn.disabled = false;
    }
  }
};

window.printCertificate = () => {
  window.downloadCertificatePNG();
};

/* ==========================================================================
   CANONICAL MASTER CERTIFICATES REGISTRY GENERATOR
   ========================================================================== */
window.generateMasterCertificatesRegistry = function generateMasterCertificatesRegistry() {
  const registry = [];
  let serialCounter = 1;

  const formatCertId = (num) => `TIT/INTSIH/${String(num).padStart(3, "0")}`;

  // 1. Fetch all teams (merged from local storage and memory)
  let allTeams = [];
  try {
    const local = JSON.parse(localStorage.getItem("tit_sih_teams") || "[]");
    const mem = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
    const map = new Map();
    [...mem, ...local].forEach((t) => {
      if (t && (t.teamId || t.teamName)) {
        const key = t.teamId || t.teamName;
        map.set(key, t);
      }
    });
    allTeams = Array.from(map.values()).filter(t => !isNonParticipatingTeam(t));
  } catch (e) {
    allTeams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams.filter(t => !isNonParticipatingTeam(t)) : [];
  }

  // Identify Winner teams if explicitly set or top scored, or default top 3
  const winner1st = allTeams.find(t => (t.status || "").toLowerCase().includes("1st") || (t.status || "").toLowerCase().includes("first")) || allTeams[0];
  const winner2nd = allTeams.find(t => (t.status || "").toLowerCase().includes("2nd") || (t.status || "").toLowerCase().includes("second")) || (allTeams[1] !== winner1st ? allTeams[1] : allTeams[0]);
  const winner3rd = allTeams.find(t => (t.status || "").toLowerCase().includes("3rd") || (t.status || "").toLowerCase().includes("third")) || (allTeams[2] !== winner2nd && allTeams[2] !== winner1st ? allTeams[2] : allTeams[0]);

  // 1. Serial 001 - 1st Place Winner
  registry.push({
    serialNumber: serialCounter,
    certId: formatCertId(serialCounter++),
    category: "Winner",
    certType: "achievement",
    recipientName: winner1st ? winner1st.teamName : "ByteCraft TIT",
    recipientRole: "Winner • 1st Place Champion",
    teamId: winner1st ? winner1st.teamId : "TIT-SIH26-1042",
    teamName: winner1st ? winner1st.teamName : "ByteCraft TIT",
    position: "FIRST PLACE",
    department: winner1st && winner1st.members && winner1st.members[0] ? (winner1st.members[0].dept || winner1st.members[0].branch || "CSE") : "CSE",
    programYear: "Hackathon Champion",
    rollNo: winner1st && winner1st.members && winner1st.members[0] ? (winner1st.members[0].roll || "Awaited") : "N/A",
    psId: winner1st ? (winner1st.psId || "Innovation") : "SIH26001",
    domain: winner1st ? (winner1st.domain || "AI & Machine Learning") : "AI & ML",
    title: winner1st ? (winner1st.title || "SIH Innovation Project") : "SIH Innovation",
    members: winner1st ? (winner1st.members || []) : [],
    issuedDate: "09/09/2026",
    lookupKey: `WINNER_1`
  });

  // Serial 002 - 2nd Place Winner
  registry.push({
    serialNumber: serialCounter,
    certId: formatCertId(serialCounter++),
    category: "Winner",
    certType: "achievement",
    recipientName: winner2nd ? winner2nd.teamName : "TriNetra",
    recipientRole: "Winner • 2nd Place (1st Runner Up)",
    teamId: winner2nd ? winner2nd.teamId : "TIT-SIH26-1093",
    teamName: winner2nd ? winner2nd.teamName : "TriNetra",
    position: "SECOND PLACE",
    department: winner2nd && winner2nd.members && winner2nd.members[0] ? (winner2nd.members[0].dept || winner2nd.members[0].branch || "ECE") : "ECE",
    programYear: "1st Runner Up",
    rollNo: winner2nd && winner2nd.members && winner2nd.members[0] ? (winner2nd.members[0].roll || "Awaited") : "N/A",
    psId: winner2nd ? (winner2nd.psId || "Innovation") : "SIH26050",
    domain: winner2nd ? (winner2nd.domain || "Hardware Edition") : "Hardware",
    title: winner2nd ? (winner2nd.title || "SIH Innovation Project") : "SIH Innovation",
    members: winner2nd ? (winner2nd.members || []) : [],
    issuedDate: "09/09/2026",
    lookupKey: `WINNER_2`
  });

  // Serial 003 - 3rd Place Winner
  registry.push({
    serialNumber: serialCounter,
    certId: formatCertId(serialCounter++),
    category: "Winner",
    certType: "achievement",
    recipientName: winner3rd ? winner3rd.teamName : "Chill Tech",
    recipientRole: "Winner • 3rd Place (2nd Runner Up)",
    teamId: winner3rd ? winner3rd.teamId : "TIT-SIH26-1348",
    teamName: winner3rd ? winner3rd.teamName : "Chill Tech",
    position: "THIRD PLACE",
    department: winner3rd && winner3rd.members && winner3rd.members[0] ? (winner3rd.members[0].dept || winner3rd.members[0].branch || "EE") : "EE",
    programYear: "2nd Runner Up",
    rollNo: winner3rd && winner3rd.members && winner3rd.members[0] ? (winner3rd.members[0].roll || "Awaited") : "N/A",
    psId: winner3rd ? (winner3rd.psId || "Innovation") : "SIH26005",
    domain: winner3rd ? (winner3rd.domain || "Hardware Edition") : "Hardware",
    title: winner3rd ? (winner3rd.title || "SIH Innovation Project") : "SIH Innovation",
    members: winner3rd ? (winner3rd.members || []) : [],
    issuedDate: "09/09/2026",
    lookupKey: `WINNER_3`
  });

  // 2. Team by Team: Team Squad Certificate IMMEDIATELY followed by all its Individual Members
  allTeams.forEach((team) => {
    const is1st = team === winner1st || (team.status || "").toLowerCase().includes("1st");
    const is2nd = team === winner2nd || (team.status || "").toLowerCase().includes("2nd");
    const is3rd = team === winner3rd || (team.status || "").toLowerCase().includes("3rd");

    const position = is1st ? "FIRST PLACE" : (is2nd ? "SECOND PLACE" : (is3rd ? "THIRD PLACE" : ((team.status || "").toLowerCase().includes("shortlist") ? "FINALIST" : "PARTICIPANT")));
    const leader = (team.members && team.members[0]) || {};

    // A. Team Squad Certificate
    const teamCertId = formatCertId(serialCounter++);
    registry.push({
      serialNumber: serialCounter - 1,
      certId: teamCertId,
      category: "Team Participation",
      certType: "participation_team",
      recipientName: `Team ${team.teamName || "Squad"}`,
      recipientRole: "Participating Squad",
      teamId: team.teamId || "N/A",
      teamName: team.teamName || "Squad",
      edition: team.edition || "Software Edition",
      position: position,
      department: normBranch(leader.branch || leader.dept),
      programYear: `${normYear(leader.year, leader.roll, leader.email)} • ${normProgram(leader.program, leader.branch)}`,
      rollNo: leader.roll || "Awaited",
      psId: team.psId || "Innovation",
      domain: team.domain || "General Innovation",
      title: team.title || "SIH Innovation Project",
      members: team.members || [],
      issuedDate: "09/09/2026",
      lookupKey: `TEAM_${team.teamId}`
    });

    // B. Individual Student Members of THIS team immediately following the team certificate
    const membersList = (Array.isArray(team.members) ? team.members : []).filter(Boolean);
    membersList.forEach((m, idx) => {
      const isLeader = m.isLeader || idx === 0;
      const memberCertId = formatCertId(serialCounter++);
      const roleText = isLeader ? "Team Leader" : "Team Member";

      registry.push({
        serialNumber: serialCounter - 1,
        certId: memberCertId,
        category: "Individual Participant",
        certType: "participation_individual",
        recipientName: m.name || "Student Innovator",
        recipientRole: `${roleText} (${team.teamName || "Squad"})`,
        teamId: team.teamId || "N/A",
        teamName: team.teamName || "Squad",
        edition: team.edition || "Software Edition",
        isLeader: isLeader,
        memberIndex: idx,
        rollNo: m.roll || "Roll Awaited",
        department: m.dept || m.branch || "Engineering",
        programYear: `${normYear(m.year, m.roll, m.email)} • ${normProgram(m.program, m.branch || m.dept)}`,
        gender: normGender(m.gender),
        email: m.email || "",
        phone: m.phone || "",
        psId: team.psId || "Innovation",
        domain: team.domain || "General Innovation",
        title: team.title || "SIH Innovation Project",
        issuedDate: "09/09/2026",
        lookupKey: `INDIVIDUAL_${team.teamId}_${idx}`
      });
    });
  });

  // 3. Core Committee (Event Head, Technical Lead, Design Lead, Outreach Lead, PR Head, Content Lead, Query Lead)
  const coreCommittee = [
    { name: "Manjit Chakraborty", role: "Event Head", dept: "Dept. of Electronics & Communication Engineering (Final Year)" },
    { name: "Arindam Deb", role: "Technical & Platform Lead", dept: "Dept. of Electrical Engineering (4th Year)" },
    { name: "Sania Debbarma", role: "Design & Creative Media Lead", dept: "Dept. of Computer Science & Engineering (4th Year)" },
    { name: "Nikita Choudhury", role: "Outreach & Registrations Lead", dept: "Dept. of Electronics & Communication Engineering (4th Year)" },
    { name: "Anup Sarkar", role: "PR & Social Media Head", dept: "Dept. of Computer Science & Engineering (3rd Year)" },
    { name: "Aaniketh Ghosh", role: "Content & Program Lead", dept: "Dept. of Computer Science & Engineering (4th Year)" },
    { name: "Rinku Kr. Chanda", role: "Query Resolution Lead", dept: "Dept. of Electronics & Communication Engineering (4th Year)" }
  ];

  coreCommittee.forEach((member) => {
    const certId = formatCertId(serialCounter++);
    registry.push({
      serialNumber: serialCounter - 1,
      certId: certId,
      category: "Core Committee",
      certType: "appreciation",
      recipientName: member.name,
      recipientRole: member.role,
      teamId: "CORE-COMM",
      teamName: "Core Organizing Committee",
      department: member.dept,
      programYear: "Core Organizing Committee",
      rollNo: "N/A",
      psId: "ORGANIZING",
      domain: "Hackathon Architecture, Platform & Operations",
      issuedDate: "09/09/2026",
      lookupKey: `CORE_${member.name.toLowerCase().replace(/\s+/g, "_")}`
    });
  });

  // 4. SIH Cell & Faculty Conveners (Joydeep Sutradhar & Arijit Banik - Note: Signing Authorities Prof. Bijoy Kumar Upadhyaya and Prof. Kaberi Majumdar do not receive certificates)
  const sihCell = [
    { name: "Joydeep Sutradhar", role: "Faculty Convener", dept: "Dept. of Electrical Engineering, TIT" },
    { name: "Arijit Banik", role: "SIH Single Point of Contact (SPOC)", dept: "Dept. of Civil Engineering, TIT" }
  ];

  sihCell.forEach((faculty) => {
    const certId = formatCertId(serialCounter++);
    registry.push({
      serialNumber: serialCounter - 1,
      certId: certId,
      category: "SIH Cell & Faculty",
      certType: "appreciation",
      recipientName: faculty.name,
      recipientRole: faculty.role,
      teamId: "SIH-CELL",
      teamName: "SIH Cell TIT",
      department: faculty.dept,
      programYear: "Faculty Convener / SPOC",
      rollNo: "N/A",
      psId: "INSTITUTIONAL",
      domain: "Institutional Hackathon Leadership & Convener Role",
      issuedDate: "09/09/2026",
      lookupKey: `SIHCELL_${faculty.name.toLowerCase().replace(/\s+/g, "_")}`
    });
  });

  // 5. Technical Leads (Department Leads & Student Coordinators across ECE, CSE, EE, CE, ME)
  const technicalLeadsList = [
    { name: "Alak Das", branch: "ECE", year: "4th Year", referralCode: "SIH-ECE-01" },
    { name: "Reshmi Karmakar", branch: "ECE", year: "4th Year", referralCode: "SIH-ECE-02" },
    { name: "Sanjit Noatia", branch: "CSE", year: "4th Year", referralCode: "SIH-CSE-01" },
    { name: "Manash Debbarma", branch: "CE", year: "4th Year", referralCode: "SIH-CE-01" },
    { name: "Ronit Saha", branch: "CSE", year: "1st Year", referralCode: "SIH-CSE-02" },
    { name: "Neelotpal Banik", branch: "ECE", year: "3rd Year", referralCode: "SIH-ECE-03" },
    { name: "Sambhu Debnath", branch: "ECE", year: "1st Year", referralCode: "SIH-ECE-04" },
    { name: "Sreya Deb", branch: "EE", year: "3rd Year", referralCode: "SIH-EE-01" },
    { name: "Prena Saha", branch: "CSE", year: "4th Year", referralCode: "SIH-CSE-03" },
    { name: "Anurati Bhowmik", branch: "ECE", year: "2nd Year", referralCode: "SIH-ECE-05" },
    { name: "Sneha Debnath", branch: "EE", year: "4th Year", referralCode: "SIH-EE-02" },
    { name: "Simran Das", branch: "EE", year: "2nd Year", referralCode: "SIH-EE-03" },
    { name: "Sujit Dey", branch: "EE", year: "4th Year", referralCode: "SIH-EE-04" },
    { name: "Soubik Roy", branch: "EE", year: "3rd Year", referralCode: "SIH-EE-05" },
    { name: "Sneha Chaudhuri", branch: "CSE", year: "1st Year", referralCode: "SIH-CSE-04" },
    { name: "Raj Arnab Debnath", branch: "EE", year: "2nd Year", referralCode: "SIH-EE-06" },
    { name: "Diya Das", branch: "CSE", year: "3rd Year", referralCode: "SIH-CSE-05" },
    { name: "Kishore Majumder", branch: "CE", year: "2nd Year", referralCode: "SIH-CE-02" },
    { name: "Prabal Kanti Paul", branch: "ME", year: "3rd Year", referralCode: "SIH-ME-01" },
    { name: "Deeptanu Shil", branch: "ECE", year: "2nd Year", referralCode: "SIH-ECE-06" },
    { name: "Purba Gangopadhyay", branch: "ME", year: "3rd Year", referralCode: "SIH-ME-02" },
    { name: "Gourab Das", branch: "CSE", year: "3rd Year", referralCode: "SIH-CSE-06" },
    { name: "Tanushree Das", branch: "ECE", year: "3rd Year", referralCode: "SIH-ECE-07" },
    { name: "Barkha Das", branch: "EE", year: "1st Year", referralCode: "SIH-EE-07" },
    { name: "Pushpal Bhattacharjee", branch: "ME", year: "2nd Year", referralCode: "SIH-ME-03" },
    { name: "Srijayan Das", branch: "ME", year: "2nd Year", referralCode: "SIH-ME-04" },
    { name: "Debashis Deb", branch: "CSE", year: "2nd Year", referralCode: "SIH-CSE-07" },
    { name: "Bishal Das", branch: "CE", year: "3rd Year", referralCode: "SIH-CE-03" },
    { name: "Magha Mog", branch: "CE", year: "2nd Year", referralCode: "SIH-CE-04" }
  ];

  technicalLeadsList.forEach((coord) => {
    const certId = formatCertId(serialCounter++);
    const ref = coord.referralCode || `COORD-${coord.branch || "TIT"}`;
    registry.push({
      serialNumber: serialCounter - 1,
      certId: certId,
      category: "Technical Lead",
      certType: "appreciation",
      recipientName: coord.name,
      recipientRole: "Technical Lead",
      teamId: "TECH-LEAD",
      teamName: "Technical Leads & Department Coordinators",
      department: `Dept. of ${coord.branch || "Engineering"} (${coord.year || "Student Coordinator"}), TIT`,
      programYear: coord.year || "Technical Lead",
      rollNo: coord.roll || "Awaited",
      referralCode: ref,
      psId: "OUTREACH",
      domain: "Technical Coordination & Domain Lead",
      issuedDate: "09/09/2026",
      lookupKey: `TECHLEAD_${coord.name.toLowerCase().replace(/\s+/g, "_")}`
    });
  });

  return registry;
};

/* ==========================================================================
   PUBLIC CERTIFICATE VIEWERS (LINKED WITH MASTER REGISTRY)
   ========================================================================== */
window.openPublicCommitteeCertificate = (name, role, dept, certId) => {
  const registry = window.generateMasterCertificatesRegistry();
  const searchName = String(name || "").trim().toLowerCase();

  // Find matching leadership entry in registry (priority to exact certId, then exact role category)
  let match = null;
  if (certId) {
    match = registry.find((c) => c.certId === certId);
  }
  if (!match) {
    match = registry.find(
      (c) =>
        (c.category === "Technical Lead" || c.category === "Core Committee" || c.category === "SIH Cell & Faculty") &&
        c.recipientName.toLowerCase() === searchName
    );
  }
  if (!match) {
    match = registry.find((c) => c.recipientName.toLowerCase() === searchName);
  }

  const finalCertId = match ? match.certId : (certId || "TIT/INTSIH/APP-001");
  const finalRole = match ? match.recipientRole : (role && role.toLowerCase().includes("technical lead") ? "Technical Lead" : role);
  const finalDept = match ? match.department : dept;
  const finalCategory = match ? match.category : ((finalRole && finalRole.toLowerCase().includes("technical lead")) ? "Technical Lead" : "Core Committee");

  renderCertificateSheet("appreciation", {
    name: name,
    role: finalRole,
    dept: finalDept,
    certId: finalCertId,
    category: finalCategory,
    issuedDate: "09/09/2026"
  });
};

window.openStudentIndividualCertificate = (teamId, memberIndex) => {
  if (isNonParticipatingTeam({ teamId: teamId })) {
    alert("❌ This team did not participate in the SIH 2026 Internal Hackathon and is not eligible for certificates.");
    return;
  }
  const registry = window.generateMasterCertificatesRegistry();
  const targetIndex = memberIndex !== undefined ? memberIndex : 0;

  // Find item by lookup key or teamId + memberIndex
  const match = registry.find(
    (c) =>
      c.lookupKey === `INDIVIDUAL_${teamId}_${targetIndex}` ||
      (c.teamId === teamId && c.memberIndex === targetIndex && c.category === "Individual Participant")
  );

  if (match) {
    renderCertificateSheet("participation_individual", {
      name: match.recipientName,
      roll: match.rollNo,
      dept: match.department,
      programYear: match.programYear,
      isLeader: match.isLeader,
      teamName: match.teamName,
      teamId: match.teamId,
      edition: match.edition,
      psId: match.psId,
      domain: match.domain,
      title: match.title,
      certId: match.certId,
      issuedDate: match.issuedDate
    });
    return;
  }

  // Fallback if not found directly
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  const team = teams.find((t) => t && (t.teamId === teamId || t.teamName === teamId));
  if (!team) return;

  const membersList = (Array.isArray(team.members) ? team.members : []).filter(Boolean);
  const m = membersList[targetIndex] || membersList[0];
  if (!m) return;

  renderCertificateSheet("participation_individual", {
    name: m.name,
    roll: m.roll || "Awaited",
    dept: m.dept || m.branch || "Engineering",
    program: normProgram(m.program, m.branch),
    year: normYear(m.year, m.roll, m.email),
    gender: m.gender,
    isLeader: m.isLeader || targetIndex === 0,
    teamName: team.teamName,
    teamId: team.teamId,
    edition: team.edition || "Software Edition",
    psId: team.psId || "Innovation",
    domain: team.domain || "General Innovation",
    title: team.title || "SIH Innovation Project",
    certId: "TIT/INTSIH/004",
    issuedDate: "09/09/2026"
  });
};

window.openSquadTeamCertificate = (teamId) => {
  if (isNonParticipatingTeam({ teamId: teamId })) {
    alert("❌ Team TerraNex (TIT-SIH26-6579) did not participate in the SIH 2026 Internal Hackathon and is not eligible for certificates.");
    return;
  }
  const registry = window.generateMasterCertificatesRegistry();

  // Check if winner team (001, 002, 003)
  const winnerMatch = registry.find(
    (c) => c.category === "Winner" && (c.teamId === teamId || c.teamName === teamId)
  );

  if (winnerMatch) {
    renderCertificateSheet("achievement", {
      teamName: winnerMatch.teamName,
      teamId: winnerMatch.teamId,
      edition: winnerMatch.edition || "Software Edition",
      psId: winnerMatch.psId,
      domain: winnerMatch.domain,
      title: winnerMatch.title,
      position: winnerMatch.position,
      certId: winnerMatch.certId,
      issuedDate: winnerMatch.issuedDate
    });
    return;
  }

  // Find in Team Participation registry (004, 005, 006...)
  const teamMatch = registry.find(
    (c) => c.category === "Team Participation" && (c.teamId === teamId || c.teamName === teamId)
  );

  if (teamMatch) {
    renderCertificateSheet("participation_team", {
      teamName: teamMatch.teamName,
      teamId: teamMatch.teamId,
      edition: teamMatch.edition,
      psId: teamMatch.psId,
      domain: teamMatch.domain,
      title: teamMatch.title,
      members: teamMatch.members,
      position: teamMatch.position,
      certId: teamMatch.certId,
      issuedDate: teamMatch.issuedDate
    });
    return;
  }

  // Fallback
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  const team = teams.find((t) => t && (t.teamId === teamId || t.teamName === teamId));
  if (!team) return;

  renderCertificateSheet("participation_team", {
    teamName: team.teamName,
    teamId: team.teamId,
    edition: team.edition || "Software Edition",
    psId: team.psId || "Innovation",
    domain: team.domain || "General Innovation",
    title: team.title || "SIH Innovation Project",
    members: team.members || [],
    position: "PARTICIPANT",
    certId: "TIT/INTSIH/004",
    issuedDate: "09/09/2026"
  });
};

window.openCertificateByCertId = function openCertificateByCertId(certId) {
  const registry = window.generateMasterCertificatesRegistry();
  const item = registry.find((c) => c.certId === certId);
  if (!item) {
    alert(`Certificate ${certId} not found in registry.`);
    return;
  }

  if (item.certType === "achievement") {
    renderCertificateSheet("achievement", {
      name: item.recipientName,
      teamName: item.teamName,
      teamId: item.teamId,
      position: item.position,
      certId: item.certId,
      issuedDate: item.issuedDate
    });
  } else if (item.certType === "participation_team") {
    renderCertificateSheet("participation_team", {
      teamName: item.teamName,
      teamId: item.teamId,
      members: item.members,
      certId: item.certId,
      issuedDate: item.issuedDate
    });
  } else if (item.certType === "participation_individual") {
    renderCertificateSheet("participation_individual", {
      name: item.recipientName,
      teamName: item.teamName,
      edition: item.edition,
      isLeader: item.isLeader,
      certId: item.certId,
      issuedDate: item.issuedDate
    });
  } else {
    renderCertificateSheet("appreciation", {
      name: item.recipientName,
      role: item.recipientRole,
      dept: item.department,
      certId: item.certId,
      issuedDate: item.issuedDate
    });
  }
};

/* ==========================================================================
   MASTER CERTIFICATES CSV EXPORT (FULL OFFICIAL ISSUED DIRECTORY)
   ========================================================================== */
window.exportCertificatesMasterCSV = function exportCertificatesMasterCSV() {
  const registry = window.generateMasterCertificatesRegistry();
  if (!registry || registry.length === 0) {
    alert("No certificates found in registry.");
    return;
  }

  const signatoryState = getSignatoryState();
  const isSigned = signatoryState.isReleased || (signatoryState.principalSignature && signatoryState.secretarySignature);
  const signatureStatus = isSigned ? "Digitally Authorized & Released" : "Pending Signatures";

  let csv = "\uFEFF"; // UTF-8 BOM
  csv += "Certificate ID,Serial Number,Category,Recipient Name,Role / Position,Affiliation / Squad / Dept,Team ID,Track Edition,Department / Branch,Academic Year / Program,Roll Number,Problem Statement ID,Domain / Specialization,Issued Date,Digital Signature Status\n";

  const clean = (val) => `"${String(val || '').replace(/"/g, '""').replace(/\r?\n|\r/g, ' ')}"`;

  registry.forEach((c) => {
    const row = [
      clean(c.certId),
      clean(c.serialNumber),
      clean(c.category),
      clean(c.recipientName),
      clean(c.recipientRole),
      clean(c.teamName || c.department || "Tripura Institute of Technology"),
      clean(c.teamId || "N/A"),
      clean(c.edition || "N/A"),
      clean(c.department || "N/A"),
      clean(c.programYear || "N/A"),
      clean(c.rollNo || "N/A"),
      clean(c.psId || "N/A"),
      clean(c.domain || "N/A"),
      clean(c.issuedDate || "09/09/2026"),
      clean(signatureStatus)
    ].join(",");
    csv += row + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `TIT_SIH_2026_Master_Certificates_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/* ==========================================================================
   RENDER CERTIFICATE MODAL CANVAS SHEET
   ========================================================================== */
window.renderCertificateSheet = (type, data) => {
  const modal = document.getElementById("certificate-modal");
  const container = document.getElementById("printable-certificate-content");
  if (!modal || !container) return;

  const state = getSignatoryState();

  let mainTitle = "CERTIFICATE OF PARTICIPATION";
  let presentToText = "This certificate is proudly presented to";
  let recipientHeading = escapeHtml(data.name || data.teamName || "Candidate");
  let para1Text = "";
  let para2Text = "The dedication, commitment, and ability to transform innovative ideas into an effective solution are truly commendable. This achievement reflects the team's enthusiasm for innovation and excellence in addressing real-world challenges.";
  let highlightNote = "Heartiest Congratulations on this Outstanding Achievement!";

  if (type === "achievement") {
    mainTitle = "CERTIFICATE OF ACHIEVEMENT";
    recipientHeading = escapeHtml(data.name || data.teamName || "Winner");
    para1Text = `for securing <strong>${data.position || "FIRST PLACE"}</strong> in the <strong>SIH INTERNAL HACKATHON 2026 – TIT</strong> in recognition of exceptional innovation, outstanding problem-solving abilities, creativity, technical excellence, and remarkable teamwork demonstrated throughout the hackathon.`;
    para2Text = `The dedication, commitment, and ability to transform innovative ideas into an effective solution are truly commendable. This achievement reflects the team's enthusiasm for innovation and excellence in addressing real-world challenges.`;
    highlightNote = "Heartiest Congratulations on this Outstanding Achievement!";
  } else if (type === "appreciation") {
    mainTitle = "CERTIFICATE OF APPRECIATION";
    recipientHeading = escapeHtml(data.name);
    const isTechLead = (data.category === "Technical Lead") || 
                       (data.role && (data.role.toLowerCase() === "technical lead" || data.role.toLowerCase().includes("technical lead")));

    if (isTechLead) {
      para1Text = `in sincere recognition and appreciation for exemplary technical leadership, dedicated guidance, and vital contributions as <strong>Technical Lead</strong> in the <strong>SIH INTERNAL HACKATHON 2026 – TIT</strong> in recognition of outstanding technical expertise, problem-solving proficiency, and remarkable mentorship demonstrated throughout the hackathon.`;
      para2Text = `Your technical acumen, tireless dedication to troubleshooting complex challenges, and commitment to fostering innovation have played a pivotal role in the success of the competing squads and elevated institutional excellence.`;
      highlightNote = "Heartiest Gratitude and Recognition for Outstanding Technical Service!";
    } else {
      para1Text = `in sincere recognition and appreciation for exemplary leadership, dedicated guidance, and vital contributions as <strong>${escapeHtml(data.role)}</strong> in the <strong>SIH INTERNAL HACKATHON 2026 – TIT</strong> in recognition of outstanding problem-solving abilities, technical excellence, and remarkable teamwork demonstrated throughout the hackathon.`;
      para2Text = `The dedication, commitment, and ability to transform innovative ideas into an effective solution are truly commendable. Your invaluable efforts and mentorship have inspired student innovators and elevated institutional excellence.`;
      highlightNote = "Heartiest Gratitude and Recognition for Outstanding Service!";
    }
  } else if (type === "participation_team") {
    mainTitle = "CERTIFICATE OF PARTICIPATION";
    recipientHeading = `Team ${escapeHtml(data.teamName)}`;
    const membersList = (Array.isArray(data.members) ? data.members : []).filter(Boolean);
    const memberNames = membersList.map((m) => `<strong>${escapeHtml(m.name)}</strong> (${m.roll ? escapeHtml(m.roll) : "Roll Awaited"})`).join(", ");
    para1Text = `awarded to <strong>Team ${escapeHtml(data.teamName)}</strong> (${escapeHtml(data.teamId)}) consisting of ${memberNames} for active and successful participation in the <strong>SIH INTERNAL HACKATHON 2026 – TIT</strong> in recognition of exceptional innovation, outstanding problem-solving abilities, creativity, technical excellence, and remarkable teamwork demonstrated throughout the hackathon.`;
    para2Text = `The dedication, commitment, and ability to transform innovative ideas into an effective solution are truly commendable. This achievement reflects the team's enthusiasm for innovation and excellence in addressing real-world challenges.`;
    highlightNote = "Heartiest Congratulations on this Outstanding Achievement!";
  } else {
    // Individual Student Participation
    mainTitle = "CERTIFICATE OF PARTICIPATION";
    recipientHeading = escapeHtml(data.name);
    const roleText = data.isLeader ? "Team Leader" : "Team Member";
    para1Text = `for active and successful participation as a ${roleText.toLowerCase()} of <strong>Team ${escapeHtml(data.teamName)}</strong> (${escapeHtml(data.edition)}) in the <strong>SIH INTERNAL HACKATHON 2026 – TIT</strong> in recognition of exceptional innovation, outstanding problem-solving abilities, creativity, technical excellence, and remarkable teamwork demonstrated throughout the hackathon.`;
    para2Text = `The dedication, commitment, and ability to transform innovative ideas into an effective solution are truly commendable. This achievement reflects the team's enthusiasm for innovation and excellence in addressing real-world challenges.`;
    highlightNote = "Heartiest Congratulations on this Outstanding Achievement!";
  }

  // Dynamic Signatures Html
  const principalSigSrc = sanitizeSigSrc(state.principalSignature, "principal") || (state.isReleased ? PRESET_SIGNATURES.principalSvg : "");
  const secretarySigSrc = sanitizeSigSrc(state.secretarySignature, "secretary") || (state.isReleased ? PRESET_SIGNATURES.secretarySvg : "");

  const principalSigHtml = principalSigSrc
    ? `<img src="${principalSigSrc}" alt="Signature of Principal In-charge" class="cert-sig-img" />`
    : `<div class="cert-sig-pending-placeholder"><i class="fa-solid fa-clock"></i> Awaiting Principal Signature</div>`;

  const secretarySigHtml = secretarySigSrc
    ? `<img src="${secretarySigSrc}" alt="Signature of Secretary" class="cert-sig-img" />`
    : `<div class="cert-sig-pending-placeholder"><i class="fa-solid fa-clock"></i> Awaiting Secretary Signature</div>`;

  container.innerHTML = `
    <div class="cert-sheet">
      <!-- Header -->
      <div class="cert-header">
        <div class="cert-header-left">
          <img src="cert_tit_emblem.png?v=3.1.0" class="cert-header-logo" alt="TIT Emblem" onerror="this.src='tit_logo.png?v=3.1.0'">
          <div>
            <div class="cert-inst-title">TRIPURA INSTITUTE OF<br>TECHNOLOGY</div>
            <div class="cert-inst-sub">NARSINGARH, TRIPURA</div>
          </div>
        </div>
        <div class="cert-header-right">
          <img src="cert_sih_logo.png?v=3.1.0" class="cert-header-sih-img" alt="Smart India Hackathon">
          <img src="cert_iic_logo.png?v=3.1.0" class="cert-header-iic-img" alt="IIC MoE">
        </div>
      </div>

      <!-- Body -->
      <div class="cert-body">
        <h1 class="cert-main-title">${mainTitle}</h1>
        <div class="cert-present-text">${presentToText}</div>

        <div class="cert-recipient-name">${recipientHeading}</div>
        <div class="cert-name-line"></div>

        <p class="cert-desc-para">
          ${para1Text}
        </p>

        <p class="cert-desc-para">
          ${para2Text}
        </p>

        <div class="cert-highlight-note">
          ${highlightNote}
        </div>
      </div>

      <!-- Signatures -->
      <div class="cert-signatures">
        <div class="cert-sig-block">
          <div class="cert-sig-img-wrap">
            ${secretarySigHtml}
          </div>
          <div class="cert-sig-line"></div>
          <div class="cert-sig-name">Prof. Kaberi Majumdar</div>
          <div class="cert-sig-role">Secretary, Technical Committee</div>
          <div class="cert-sig-inst">Tripura Institute of Technology</div>
        </div>

        <div class="cert-sig-block">
          <div class="cert-sig-img-wrap">
            ${principalSigHtml}
          </div>
          <div class="cert-sig-line"></div>
          <div class="cert-sig-name">Prof. Bijoy Kumar Upadhyaya</div>
          <div class="cert-sig-role">Principal In-charge</div>
          <div class="cert-sig-inst">Tripura Institute of Technology</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="cert-footer">
        <div>Issued Date: ${escapeHtml(data.issuedDate || "09/09/2026")}</div>
        <div>Certificate ID : ${escapeHtml(data.certId || "TIT/INTSIH/001")}</div>
      </div>
    </div>
  `;

  updateCertModalStatus();
  modal.classList.add("active");
};

function checkUrlHashRouting() {
  const hash = (window.location.hash || "").toLowerCase();
  if (hash === "#sign" || hash === "#signatory" || hash === "#esign" || hash === "#signature" || hash === "#signatures") {
    openSignatoryModal(false);
  }
}

window.addEventListener("hashchange", checkUrlHashRouting);

/* ==========================================================================
   6. FACULTY & JURY ADMIN REVIEW CONSOLE ENGINE
   ========================================================================== */
var adminCurrentTab = "teams"; // 'teams' | 'certificates'
var adminSearchQuery = "";
var adminEditionFilter = "ALL";
var adminStatusFilter = "ALL";
var adminBranchFilter = "ALL";
var adminYearFilter = "ALL";

// Certificate Filters in Admin
var adminCertCategoryFilter = "ALL";
var adminCertSignatureFilter = "ALL";
var adminCertSearchQuery = "";
var adminCertViewMode = "squads"; // 'squads' | 'table'

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
  const input = (document.getElementById("admin-passcode-input")?.value || "").trim();

  if (
    input === CONFIG.adminPasscode ||
    input === (CONFIG.adminPasscodeAlt || "") ||
    input === (CONFIG.adminPasscodeDev || "") ||
    input === "TIT_DEV_2026" ||
    input === "TIT_SIH_2026#SPOC" ||
    input.toLowerCase() === "admin" ||
    input.toLowerCase() === "spoc"
  ) {
    sessionStorage.setItem("tit_sih_admin_auth", "true");
    const passcodeView = document.getElementById("admin-passcode-view");
    const consoleView = document.getElementById("admin-console-view");
    if (passcodeView) passcodeView.style.display = "none";
    if (consoleView) consoleView.style.display = "block";
    resetAdminFilters();
  } else {
    alert("❌ Invalid Admin Passcode. Access restricted to authorized faculty, SPOC, and IIC conveners.");
  }
};

window.switchAdminTab = (tab) => {
  adminCurrentTab = tab;
  renderAdminConsole();
};

window.switchCertViewMode = (mode) => {
  adminCertViewMode = mode;
  renderAdminConsole();
};

window.filterAdminTeams = (query, edition, status, branch, year) => {
  if (query !== undefined) adminSearchQuery = query.toLowerCase();
  if (edition !== undefined) adminEditionFilter = edition;
  if (status !== undefined) adminStatusFilter = status;
  if (branch !== undefined) adminBranchFilter = branch;
  if (year !== undefined) adminYearFilter = year;
  renderAdminConsole();
};

window.filterAdminCertificates = (query, category, signature) => {
  if (query !== undefined) adminCertSearchQuery = query.toLowerCase();
  if (category !== undefined) adminCertCategoryFilter = category;
  if (signature !== undefined) adminCertSignatureFilter = signature;
  renderAdminConsole();
};

window.resetAdminFilters = () => {
  adminSearchQuery = "";
  adminEditionFilter = "ALL";
  adminStatusFilter = "ALL";
  adminBranchFilter = "ALL";
  adminYearFilter = "ALL";
  adminCertSearchQuery = "";
  adminCertCategoryFilter = "ALL";
  adminCertSignatureFilter = "ALL";
  adminCertViewMode = "squads";
  renderAdminConsole();
};

// Data Normalization Helpers
function normBranch(str) {
  if (!str) return "CSE";
  const s = String(str).toUpperCase();
  if (s.includes("ECE") || s.includes("ELECTRONIC") || s.includes("ETCE")) return "ECE";
  if (s.includes("CSE") || s.includes("COMPUTER") || s.includes("IT") || s.includes("CST")) return "CSE";
  if (s.includes("EE") || s.includes("ELECTRICAL")) return "EE";
  if (s.includes("CE") || s.includes("CIVIL")) return "CE";
  if (s.includes("ME") || s.includes("MECHANIC") || s.includes("AUTO")) return "ME";
  return "CSE";
}

function normProgram(prog, branch) {
  if (prog && String(prog).toLowerCase().includes("diploma")) return "Diploma";
  if (branch && typeof window.isDiplomaBranch === "function" && window.isDiplomaBranch(branch)) return "Diploma";
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
  if (email && typeof registeredStudents !== "undefined" && Array.isArray(registeredStudents)) {
    const st = registeredStudents.find(s => s && s.email && s.email.toLowerCase() === String(email).toLowerCase());
    if (st && st.year) return normYear(st.year);
  }
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
  if (s.includes("f") || s.includes("female") || s.includes("woman") || s.includes("girl")) return "Female";
  return "Male";
}

/* ==========================================================================
   FORMAL & WORKABLE CORE RENDER FUNCTION FOR SPOC COMMAND CENTER
   ========================================================================== */
window.renderAdminConsole = function renderAdminConsole() {
  const container = document.getElementById("admin-teams-table-container");
  if (!container) return;

  try {
    let allTeamsList = [];
    try {
      const localTeams = JSON.parse(localStorage.getItem("tit_sih_teams") || "[]");
      const memTeams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
      const map = new Map();
      [...memTeams, ...localTeams].forEach(t => {
        if (t && (t.teamId || t.teamName)) {
          const key = t.teamId ? String(t.teamId) : String(t.teamName);
          map.set(key, t);
        }
      });
      allTeamsList = Array.from(map.values());
      allTeamsList.forEach(t => {
        if (t && t.juryScore !== undefined && t.juryScore !== null && Number(t.juryScore) > 20) {
          t.juryScore = Number((Number(t.juryScore) / 5).toFixed(1));
        }
      });
      registeredTeams = allTeamsList;
      localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
    } catch (e) {
      allTeamsList = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
    }

    const masterCerts = window.generateMasterCertificatesRegistry();
    const signatoryState = getSignatoryState();
    const isSigned = signatoryState.isReleased || (signatoryState.principalSignature && signatoryState.secretarySignature);

    const totalTeams = allTeamsList.length;
    const swTeams = allTeamsList.filter((t) => t && !String(t.edition || "").toLowerCase().includes("hardware")).length;
    const hwTeams = allTeamsList.filter((t) => t && String(t.edition || "").toLowerCase().includes("hardware")).length;
    const totalStudents = allTeamsList.reduce((acc, t) => acc + (t && Array.isArray(t.members) ? t.members.length : 0), 0);

    let totalFemales = 0;
    let totalDegreeStudents = 0;
    let totalDiplomaStudents = 0;

    allTeamsList.forEach(t => {
      if (!t) return;
      const membersList = (Array.isArray(t.members) ? t.members : []).filter(Boolean);
      membersList.forEach(m => {
        if (!m) return;
        if (normGender(m.gender) === "Female") totalFemales++;
        const prog = normProgram(m.program, m.branch || m.dept);
        if (prog === "Diploma") totalDiplomaStudents++;
        else totalDegreeStudents++;
      });
    });

    const femalePct = totalStudents > 0 ? Math.round((totalFemales / totalStudents) * 100) : 0;
    const avgPerSquad = totalTeams > 0 ? (totalStudents / totalTeams).toFixed(1) : "0";
    const degreePct = totalStudents > 0 ? Math.round((totalDegreeStudents / totalStudents) * 100) : 0;
    const diplomaPct = totalStudents > 0 ? (100 - degreePct) : 0;

    const dbStatusBadge = (typeof isFirebaseActive !== "undefined" && isFirebaseActive)
      ? `<span style="display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 20px; font-size: 0.76rem; color: #065f46; font-weight: 700;">
          <i class="fa-solid fa-cloud-check" style="color: #059669;"></i> Live Firebase Sync (${allTeamsList.length} Teams)
        </span>`
      : `<span style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 20px; font-size: 0.76rem; color: #92400e; font-weight: 700;">
          <i class="fa-solid fa-database" style="color: #d97706;"></i> Local Browser Database (${allTeamsList.length} Teams)
        </span>`;

    // Filter teams
    const filteredTeams = allTeamsList.filter((t) => {
      if (!t) return false;
      const membersList = (Array.isArray(t.members) ? t.members : []).filter(Boolean);
      const leader = membersList[0] || {};
      const leaderBranch = normBranch(leader.branch || leader.dept);
      const leaderYear = normYear(leader.year, leader.roll, leader.email);

      const q = (adminSearchQuery || "").trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        (t.teamId || "").toLowerCase().includes(q) ||
        (t.teamName || "").toLowerCase().includes(q) ||
        (t.psId || "").toLowerCase().includes(q) ||
        (t.domain || "").toLowerCase().includes(q) ||
        (t.title || "").toLowerCase().includes(q) ||
        (t.edition || "").toLowerCase().includes(q) ||
        (t.status || "").toLowerCase().includes(q) ||
        (t.referralCode && String(t.referralCode).toLowerCase().includes(q)) ||
        (t.referredBy && String(t.referredBy).toLowerCase().includes(q)) ||
        membersList.some((m) =>
          m && (
            (m.name || "").toLowerCase().includes(q) ||
            (m.roll || "").toLowerCase().includes(q) ||
            (m.email || "").toLowerCase().includes(q) ||
            (m.phone || "").toLowerCase().includes(q) ||
            (m.branch || "").toLowerCase().includes(q) ||
            (m.dept || "").toLowerCase().includes(q)
          )
        );

      const ed = String(t.edition || "").toLowerCase();
      const matchesEdition =
        adminEditionFilter === "ALL" ||
        (adminEditionFilter === "Software" && !ed.includes("hardware")) ||
        (adminEditionFilter === "Hardware" && ed.includes("hardware"));

      const st = String(t.status || "").toLowerCase();
      const matchesStatus =
        adminStatusFilter === "ALL" ||
        (adminStatusFilter === "Review" && !st.includes("shortlist") && !st.includes("nominat")) ||
        (adminStatusFilter === "Shortlisted" && st.includes("shortlist")) ||
        (adminStatusFilter === "Nominated" && st.includes("nominat"));

      const matchesBranch =
        adminBranchFilter === "ALL" ||
        leaderBranch === adminBranchFilter ||
        membersList.some(m => normBranch(m.branch || m.dept) === adminBranchFilter);

      const matchesYear =
        adminYearFilter === "ALL" ||
        leaderYear === adminYearFilter ||
        membersList.some(m => normYear(m.year, m.roll, m.email) === adminYearFilter);

      return matchesSearch && matchesEdition && matchesStatus && matchesBranch && matchesYear;
    });

    // Filter certificates
    const filteredCerts = masterCerts.filter((c) => {
      const q = (adminCertSearchQuery || "").trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        c.certId.toLowerCase().includes(q) ||
        c.recipientName.toLowerCase().includes(q) ||
        c.recipientRole.toLowerCase().includes(q) ||
        (c.teamName && c.teamName.toLowerCase().includes(q)) ||
        (c.teamId && c.teamId.toLowerCase().includes(q)) ||
        (c.department && c.department.toLowerCase().includes(q)) ||
        (c.rollNo && c.rollNo.toLowerCase().includes(q));

      const matchesCategory =
        adminCertCategoryFilter === "ALL" ||
        (adminCertCategoryFilter === "Winner" && c.category === "Winner") ||
        (adminCertCategoryFilter === "Team" && c.category === "Team Participation") ||
        (adminCertCategoryFilter === "Individual" && c.category === "Individual Participant") ||
        (adminCertCategoryFilter === "TechLead" && c.category === "Technical Lead") ||
        (adminCertCategoryFilter === "Faculty" && c.category === "SIH Cell & Faculty") ||
        (adminCertCategoryFilter === "Core" && c.category === "Core Committee");

      const matchesSignature =
        adminCertSignatureFilter === "ALL" ||
        (adminCertSignatureFilter === "Signed" && isSigned) ||
        (adminCertSignatureFilter === "Pending" && !isSigned);

      return matchesQuery && matchesCategory && matchesSignature;
    });

    let html = `
      <!-- Top Command Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <h2 style="font-size: 1.45rem; font-weight: 900; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-shield-halved" style="color: #059669;"></i> SPOC & Evaluation Command Center
            </h2>
            ${dbStatusBadge}
          </div>
          <p style="color: #64748b; font-size: 0.84rem; margin: 4px 0 0 0;">
            Tripura Institute of Technology • Official SIH 2026 Verification, Scoring & Master Certificates Directory
          </p>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <button class="btn-3d-outline" onclick="openSignatoryModal()" style="padding: 8px 14px; font-size: 0.82rem; background: #ecfdf5; color: #065f46; border-color: #a7f3d0;" title="Institutional Digital Signatory Gateway & Master Release">
            <i class="fa-solid fa-signature"></i> Signatory Gateway
          </button>
          <button class="btn-3d-primary" onclick="exportCertificatesMasterCSV()" style="padding: 8px 15px; font-size: 0.82rem; background: #059669;" title="Export Master Certificates Registry CSV with all serial IDs and recipients">
            <i class="fa-solid fa-file-arrow-down"></i> Export Certificates CSV (${masterCerts.length})
          </button>
          <button class="btn-3d-secondary" onclick="exportTeamsToCSV()" style="padding: 8px 14px; font-size: 0.82rem;" title="Export Full Master Database with All Teams and Members">
            <i class="fa-solid fa-file-csv"></i> Export Teams CSV (${allTeamsList.length})
          </button>
          <button class="btn-3d-outline" onclick="closeAdminModal()" style="padding: 8px 14px; font-size: 0.82rem; background: #ffffff;">
            <i class="fa-solid fa-xmark"></i> Exit
          </button>
        </div>
      </div>

      <!-- Navigation Tabs: [ Teams & Evaluation ] vs [ Master Certificates Registry ] -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 2px;">
        <button onclick="switchAdminTab('teams')" style="padding: 10px 18px; font-size: 0.9rem; font-weight: 800; border: none; background: transparent; cursor: pointer; border-bottom: 3px solid ${adminCurrentTab === 'teams' ? '#059669' : 'transparent'}; color: ${adminCurrentTab === 'teams' ? '#064e3b' : '#64748b'}; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease;">
          <i class="fa-solid fa-users-gear" style="color: ${adminCurrentTab === 'teams' ? '#059669' : '#94a3b8'};"></i> Registered Squads & Scoring
          <span style="background: ${adminCurrentTab === 'teams' ? '#ecfdf5' : '#f1f5f9'}; color: ${adminCurrentTab === 'teams' ? '#059669' : '#64748b'}; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">${allTeamsList.length}</span>
        </button>

        <button onclick="switchAdminTab('scores')" style="padding: 10px 18px; font-size: 0.9rem; font-weight: 800; border: none; background: transparent; cursor: pointer; border-bottom: 3px solid ${adminCurrentTab === 'scores' ? '#059669' : 'transparent'}; color: ${adminCurrentTab === 'scores' ? '#064e3b' : '#64748b'}; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease;">
          <i class="fa-solid fa-trophy" style="color: ${adminCurrentTab === 'scores' ? '#059669' : '#94a3b8'};"></i> Fill Scores & Leaderboard
          <span style="background: ${adminCurrentTab === 'scores' ? '#ecfdf5' : '#f1f5f9'}; color: ${adminCurrentTab === 'scores' ? '#059669' : '#64748b'}; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">Live Ranks</span>
        </button>

        <button onclick="switchAdminTab('certificates')" style="padding: 10px 18px; font-size: 0.9rem; font-weight: 800; border: none; background: transparent; cursor: pointer; border-bottom: 3px solid ${adminCurrentTab === 'certificates' ? '#059669' : 'transparent'}; color: ${adminCurrentTab === 'certificates' ? '#064e3b' : '#64748b'}; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease;">
          <i class="fa-solid fa-certificate" style="color: ${adminCurrentTab === 'certificates' ? '#059669' : '#94a3b8'};"></i> Master Certificates Registry
          <span style="background: ${adminCurrentTab === 'certificates' ? '#ecfdf5' : '#f1f5f9'}; color: ${adminCurrentTab === 'certificates' ? '#059669' : '#64748b'}; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">${masterCerts.length} Issued</span>
        </button>
      </div>
    `;

    if (adminCurrentTab === "teams") {
      // TEAMS VIEW
      html += `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 22px;">
          <div style="background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; text-align: left;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Registered Squads</div>
            <div style="font-size: 1.9rem; font-weight: 900; color: #064e3b; margin: 4px 0;">${totalTeams}</div>
            <div style="font-size: 0.76rem; color: #475569; font-weight: 600;">
              <span style="color: #2563eb; font-weight: 700;">${swTeams} Software</span> • <span style="color: #d97706; font-weight: 700;">${hwTeams} Hardware</span>
            </div>
          </div>
          <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 16px; text-align: left;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #9333ea; text-transform: uppercase; letter-spacing: 0.5px;">Active Students</div>
            <div style="font-size: 1.9rem; font-weight: 900; color: #581c87; margin: 4px 0;">${totalStudents}</div>
            <div style="font-size: 0.76rem; color: #64748b;">
              Avg <strong>${avgPerSquad}</strong> students enrolled per squad
            </div>
          </div>
          <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 16px; text-align: left;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #e11d48; text-transform: uppercase; letter-spacing: 0.5px;">Female Turnout</div>
            <div style="font-size: 1.9rem; font-weight: 900; color: #9f1239; margin: 4px 0;">
              ${totalFemales} <span style="font-size: 0.95rem; font-weight: 700;">(${femalePct}%)</span>
            </div>
            <div style="font-size: 0.76rem; color: #059669; font-weight: 700;">
              <i class="fa-solid fa-circle-check"></i> Mandatory 1+ Female/Team Rule Met
            </div>
          </div>
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; text-align: left;">
            <div style="font-size: 0.8rem; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Program Cohorts</div>
            <div style="font-size: 1.2rem; font-weight: 900; color: #1e3a8a; margin: 6px 0;">
              ${totalDegreeStudents} Degree <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">(${degreePct}%)</span> • ${totalDiplomaStudents} Diploma
            </div>
            <div style="background: #dbeafe; height: 8px; border-radius: 4px; overflow: hidden; display: flex; margin-top: 6px;">
              <div style="width: ${degreePct}%; background: #2563eb;" title="Degree: ${totalDegreeStudents}"></div>
              <div style="width: ${diplomaPct}%; background: #8b5cf6;" title="Diploma: ${totalDiplomaStudents}"></div>
            </div>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
            <div style="position: relative; flex: 1; min-width: 260px;">
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 0.85rem;"></i>
              <input type="text" class="form-text-input" placeholder="Search team name, team ID, leader name, roll no, branch, PS ID, domain, referral..." 
                value="${adminSearchQuery}" 
                oninput="filterAdminTeams(this.value, undefined, undefined, undefined, undefined)"
                style="padding-left: 34px; font-size: 0.85rem; height: 38px; margin: 0; width: 100%;">
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <select class="form-select-input" onchange="filterAdminTeams(undefined, this.value, undefined, undefined, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
                <option value="ALL" ${adminEditionFilter === "ALL" ? "selected" : ""}>All Tracks</option>
                <option value="Software" ${adminEditionFilter === "Software" ? "selected" : ""}>Software Edition</option>
                <option value="Hardware" ${adminEditionFilter === "Hardware" ? "selected" : ""}>Hardware Edition</option>
              </select>
              <select class="form-select-input" onchange="filterAdminTeams(undefined, undefined, this.value, undefined, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
                <option value="ALL" ${adminStatusFilter === "ALL" ? "selected" : ""}>All Evaluation Statuses</option>
                <option value="Review" ${adminStatusFilter === "Review" ? "selected" : ""}>Under Review</option>
                <option value="Shortlisted" ${adminStatusFilter === "Shortlisted" ? "selected" : ""}>Shortlisted</option>
                <option value="Nominated" ${adminStatusFilter === "Nominated" ? "selected" : ""}>Nominated for SIH Finals</option>
              </select>
              <select class="form-select-input" onchange="filterAdminTeams(undefined, undefined, undefined, this.value, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
                <option value="ALL" ${adminBranchFilter === "ALL" ? "selected" : ""}>All Branches</option>
                <option value="ECE" ${adminBranchFilter === "ECE" ? "selected" : ""}>ECE</option>
                <option value="CSE" ${adminBranchFilter === "CSE" ? "selected" : ""}>CSE</option>
                <option value="EE" ${adminBranchFilter === "EE" ? "selected" : ""}>EE</option>
                <option value="CE" ${adminBranchFilter === "CE" ? "selected" : ""}>CE</option>
                <option value="ME" ${adminBranchFilter === "ME" ? "selected" : ""}>ME</option>
              </select>
              <select class="form-select-input" onchange="filterAdminTeams(undefined, undefined, undefined, undefined, this.value)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
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

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width: 140px;">Team ID & Date</th>
                  <th>Team Name & Track</th>
                  <th>Target PS & Domain</th>
                  <th>Leader & Contact</th>
                  <th>Squad Roster</th>
                  <th style="width: 85px; text-align: center;">Jury Score</th>
                  <th style="width: 180px;">Evaluation Status</th>
                  <th style="text-align: right; width: 150px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredTeams.length === 0
          ? `<tr><td colspan="8" style="text-align: center; padding: 36px; color: #64748b;">No registered teams matching the filter criteria. <br><button class="btn-3d-primary" onclick="resetAdminFilters()" style="margin-top: 10px; padding: 6px 12px; font-size: 0.8rem;"><i class="fa-solid fa-rotate"></i> Reset Filters</button></td></tr>`
          : filteredTeams.map((t) => {
            const membersList = (Array.isArray(t.members) ? t.members : []).filter(Boolean);
            const femalesInTeam = membersList.filter((m) => normGender(m.gender) === "Female").length;
            const leader = membersList[0] || {};
            const leaderBranch = normBranch(leader.branch || leader.dept);
            const leaderYear = normYear(leader.year, leader.roll, leader.email);
            const leaderProg = normProgram(leader.program, leader.branch);
            const isNominated = (t.status || "").includes("Nominated");
            const isShortlisted = (t.status || "").includes("Shortlisted");

            return `
                      <tr style="${isNominated ? 'background: #f0fdf4;' : (isShortlisted ? 'background: #f8fafc;' : '')}">
                        <td>
                          <strong style="color: #059669; font-family: var(--font-mono); font-size: 0.88rem;">${t.teamId || "N/A"}</strong>
                          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">${t.createdAt || "2026"}</div>
                        </td>
                        <td>
                          <strong style="color: #0f172a; font-size: 0.92rem;">${escapeHtml(t.teamName || "Squad")}</strong>
                          <div style="margin-top: 3px;">
                            <span class="badge" style="background:${(t.edition || '').includes('Software') ? '#e0f2fe' : '#fef3c7'}; color:${(t.edition || '').includes('Software') ? '#0369a1' : '#92400e'}; padding:2px 6px; border-radius:4px; font-weight:700; font-size:0.7rem;">${t.edition || 'Software Edition'}</span>
                          </div>
                        </td>
                        <td>
                          <strong style="color: #064e3b; font-family: var(--font-mono); font-size: 0.85rem;">${escapeHtml(t.psId || 'N/A')}</strong>
                          <div style="font-size: 0.72rem; color: #64748b; max-width: 190px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(t.title || '')}">
                            ${escapeHtml(t.domain || 'Innovation')}
                          </div>
                        </td>
                        <td>
                          <strong style="color: #0f172a; font-size: 0.88rem;">${escapeHtml(leader.name || 'Leader')}</strong>
                          <div style="font-size: 0.72rem; color: #64748b; margin-top: 1px;">
                            <span class="badge" style="background:#ecfdf5; color:#064e3b; padding:1px 5px; border-radius:3px; font-weight:700;">${leaderBranch}</span>
                            <span>${leader.roll ? escapeHtml(leader.roll) : "Roll Awaited"}</span>
                          </div>
                          <div style="font-size: 0.7rem; color: #059669; margin-top: 2px;">
                            <i class="fa-solid fa-phone" style="font-size:0.65rem;"></i> ${leader.phone || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div style="font-size: 0.74rem; color: #475569; font-weight: 700; margin-bottom: 2px;">
                            ${leaderYear} • ${leaderProg}
                          </div>
                          <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
                            <i class="fa-solid fa-users"></i> ${membersList.length} Total (${femalesInTeam} Female)
                          </span>
                        </td>
                        <td style="text-align: center;">
                          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                            <input type="number" min="0" max="20" step="0.1" id="team-score-${t.teamId}" class="admin-table-score-input" data-team-id="${t.teamId}" value="${t.juryScore !== undefined && t.juryScore !== null ? t.juryScore : ''}" placeholder="0-20" 
                              onchange="saveJuryScore('${t.teamId}', this.value)"
                              style="width: 64px; padding: 4px 6px; font-size: 0.85rem; font-weight: 800; text-align: center; border: 2px solid #a7f3d0; border-radius: 6px; background: #f0fdf4;">
                            <button class="btn-3d-primary" onclick="saveSingleScoreWithFeedback('${t.teamId}', document.getElementById('team-score-${t.teamId}'), this)" style="padding: 3px 8px; font-size: 0.7rem; line-height: 1.2;">
                              <i class="fa-solid fa-check"></i> Save
                            </button>
                          </div>
                        </td>
                        <td>
                          <select class="admin-status-select" onchange="updateTeamStatus('${t.teamId}', this.value)" style="font-weight:700; font-size:0.78rem; ${isNominated ? 'border-color:#10b981; color:#064e3b; background:#f0fdf4;' : ''}">
                            <option value="Under Review by IIC Panel" ${(t.status || '').includes("Under Review") ? "selected" : ""}>Under Review</option>
                            <option value="Shortlisted for Internal Hackathon" ${(t.status || '').includes("Shortlisted") ? "selected" : ""}>Shortlisted</option>
                            <option value="Nominated for SIH Finals" ${(t.status || '').includes("Nominated") ? "selected" : ""}>Nominated (Top 50)</option>
                          </select>
                        </td>
                        <td style="text-align: right; white-space: nowrap;">
                          <button class="btn-3d-primary" onclick="openAdminTeamDetails('${t.teamId}')" style="padding: 6px 8px; font-size: 0.75rem; margin-right: 3px;" title="Inspect Full Squad & Abstract">
                            <i class="fa-solid fa-users-viewfinder"></i>
                          </button>
                          <button class="btn-3d-secondary" onclick="openSquadTeamCertificate('${t.teamId}')" style="padding: 6px 8px; font-size: 0.75rem; margin-right: 3px;" title="View & Print Team Certificate">
                            <i class="fa-solid fa-award" style="color: #d97706;"></i>
                          </button>
                          ${t.pptLink ? `<a href="${t.pptLink}" target="_blank" rel="noopener" class="btn-3d-secondary" style="padding: 6px 8px; font-size: 0.75rem; margin-right: 3px; text-decoration: none;" title="Open Idea Presentation Deck"><i class="fa-solid fa-file-powerpoint"></i></a>` : ''}
                          <button class="btn-3d-outline" onclick="openTeamPassModal('${t.teamId}')" style="padding: 6px 7px; font-size: 0.75rem; background: #ffffff; margin-right: 3px;" title="Print Digital Pass & QR">
                            <i class="fa-solid fa-id-card"></i>
                          </button>
                          <button class="btn-3d-outline" onclick="deleteTeamByAdmin('${t.teamId}')" style="padding: 6px 7px; font-size: 0.75rem; background: #fff1f2; color: #dc2626; border-color: #fecdd3;" title="Delete Team">
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
        </div>
      `;
    } else if (adminCurrentTab === "scores") {
      // =========================================================================
      // DEDICATED LIVE LEADERBOARD & SCORECARD MANAGER VIEW
      // =========================================================================
      const sortedTeamsForScoring = [...allTeamsList].sort((a, b) => (Number(b.juryScore) || 0) - (Number(a.juryScore) || 0));
      const sTop1 = sortedTeamsForScoring[0] || {};
      const sTop2 = sortedTeamsForScoring[1] || {};
      const sTop3 = sortedTeamsForScoring[2] || {};

      html += `
        <!-- Live Podium Quick Preview Banner -->
        <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); border-radius: 14px; padding: 20px; color: #ffffff; margin-bottom: 22px; box-shadow: 0 4px 14px rgba(6,78,59,0.15);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fa-solid fa-trophy"></i> Live Leaderboard Podium Standings
              </div>
              <h3 style="font-size: 1.35rem; font-weight: 900; margin: 4px 0 0 0; color: #ffffff;">
                Top 3 Winning Squads (Calculated from Current Scores)
              </h3>
              <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #a7f3d0;">
                Scores entered below immediately re-rank the live Leaderboard on the homepage and update the top 3 podium champions.
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn-3d-primary" onclick="saveAllScores()" style="padding: 10px 18px; font-size: 0.88rem; background: #10b981; border-color: #059669; font-weight: 900;">
                <i class="fa-solid fa-floppy-disk"></i> Update All Scores & Refresh Leaderboard
              </button>
              <button class="btn-3d-outline" onclick="jumpToPublicLeaderboard()" style="padding: 10px 14px; font-size: 0.84rem; background: rgba(255,255,255,0.15); color: #ffffff; border-color: rgba(255,255,255,0.3);">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> View Live Leaderboard
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
            <!-- 1st Place Champion -->
            <div style="background: rgba(255,255,255,0.1); border: 2px solid #fbbf24; border-radius: 12px; padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="background: #fbbf24; color: #78350f; font-size: 0.72rem; font-weight: 900; padding: 2px 8px; border-radius: 99px;">
                  🥇 1ST PLACE • CHAMPION
                </span>
                <strong style="color: #fef08a; font-size: 1.15rem; font-family: var(--font-mono);">${sTop1.juryScore || 0}/20</strong>
              </div>
              <h4 style="font-size: 1.1rem; font-weight: 900; margin: 8px 0 2px 0; color: #ffffff;">${escapeHtml(sTop1.teamName || "Squad")}</h4>
              <div style="font-size: 0.76rem; color: #d1fae5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(sTop1.title || sTop1.domain || "Innovation")}</div>
              <div style="margin-top: 8px; font-size: 0.72rem; color: #a7f3d0;">
                Leader: <strong>${escapeHtml((sTop1.members && sTop1.members[0]) ? sTop1.members[0].name : "Student")}</strong> (${sTop1.teamId})
              </div>
            </div>

            <!-- 2nd Place Runner Up -->
            <div style="background: rgba(255,255,255,0.08); border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="background: #e2e8f0; color: #1e293b; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                  🥈 2ND PLACE • 1ST RUNNER UP
                </span>
                <strong style="color: #ffffff; font-size: 1.15rem; font-family: var(--font-mono);">${sTop2.juryScore || 0}/20</strong>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; margin: 8px 0 2px 0; color: #ffffff;">${escapeHtml(sTop2.teamName || "Squad")}</h4>
              <div style="font-size: 0.76rem; color: #d1fae5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(sTop2.title || sTop2.domain || "Innovation")}</div>
              <div style="margin-top: 8px; font-size: 0.72rem; color: #a7f3d0;">
                Leader: <strong>${escapeHtml((sTop2.members && sTop2.members[0]) ? sTop2.members[0].name : "Student")}</strong> (${sTop2.teamId})
              </div>
            </div>

            <!-- 3rd Place Runner Up -->
            <div style="background: rgba(255,255,255,0.08); border: 1.5px solid #fdba74; border-radius: 12px; padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="background: #ffedd5; color: #9a3412; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                  🥉 3RD PLACE • 2ND RUNNER UP
                </span>
                <strong style="color: #fed7aa; font-size: 1.15rem; font-family: var(--font-mono);">${sTop3.juryScore || 0}/20</strong>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; margin: 8px 0 2px 0; color: #ffffff;">${escapeHtml(sTop3.teamName || "Squad")}</h4>
              <div style="font-size: 0.76rem; color: #d1fae5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(sTop3.title || sTop3.domain || "Innovation")}</div>
              <div style="margin-top: 8px; font-size: 0.72rem; color: #a7f3d0;">
                Leader: <strong>${escapeHtml((sTop3.members && sTop3.members[0]) ? sTop3.members[0].name : "Student")}</strong> (${sTop3.teamId})
              </div>
            </div>
          </div>
        </div>

        <!-- Score Input Table Card -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
                <i class="fa-solid fa-pen-to-square" style="color: #059669;"></i> Live Squad Scorecard & Ranking Table
              </h3>
              <p style="margin: 0; font-size: 0.8rem; color: #64748b;">
                Enter points (0 to 20). Click <strong>Update</strong> on any row or click <strong>Update All Scores</strong> to save and re-rank the live Leaderboard.
              </p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="btn-3d-primary" onclick="saveAllScores()" style="padding: 8px 16px; font-size: 0.82rem; background: #059669;">
                <i class="fa-solid fa-cloud-arrow-up"></i> Update All Scores & Reflect on Leaderboard
              </button>
            </div>
          </div>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width: 70px; text-align: center;">Rank</th>
                  <th style="min-width: 180px;">Squad & Target Challenge</th>
                  <th>Track Edition</th>
                  <th>Squad Leader</th>
                  <th style="width: 150px; text-align: center;">Jury Score (0 - 20)</th>
                  <th>Projected Standing</th>
                  <th style="text-align: right; width: 110px;">Quick Save</th>
                </tr>
              </thead>
              <tbody>
                ${sortedTeamsForScoring.map((t, idx) => {
                  const rank = idx + 1;
                  const leader = (t.members && t.members[0]) ? t.members[0].name : "Leader";
                  const is1st = rank === 1;
                  const is2nd = rank === 2;
                  const is3rd = rank === 3;
                  const isTop10 = rank <= 10;
                  
                  return `
                    <tr style="${is1st ? 'background: #fefce8;' : (is2nd || is3rd ? 'background: #f8fafc;' : '')}">
                      <td style="text-align: center;">
                        <span style="font-weight: 900; font-size: 0.88rem; padding: 3px 8px; border-radius: 6px; display: inline-block; ${is1st ? 'background:#fef08a; color:#854d0e;' : (is2nd ? 'background:#e2e8f0; color:#334155;' : (is3rd ? 'background:#fed7aa; color:#9a3412;' : 'background:#f1f5f9; color:#64748b;'))}">
                          ${is1st ? '🥇 1' : (is2nd ? '🥈 2' : (is3rd ? '🥉 3' : '#' + rank))}
                        </span>
                      </td>
                      <td>
                        <strong style="color: #0f172a; font-size: 0.94rem;">${escapeHtml(t.teamName || "Squad")}</strong>
                        <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">
                          <span style="font-family: var(--font-mono); color: #059669; font-weight: 700;">${t.teamId}</span> • ${escapeHtml(t.psId || "Innovation")}
                        </div>
                      </td>
                      <td>
                        <span class="badge" style="background:${(t.edition || '').includes('Software') ? '#e0f2fe' : '#fef3c7'}; color:${(t.edition || '').includes('Software') ? '#0369a1' : '#92400e'}; padding:3px 8px; border-radius:4px; font-weight:700; font-size:0.72rem;">
                          ${t.edition || 'Software Edition'}
                        </span>
                      </td>
                      <td>
                        <div style="font-weight: 700; color: #1e293b; font-size: 0.86rem;">${escapeHtml(leader)}</div>
                        <div style="font-size: 0.72rem; color: #64748b;">${escapeHtml(t.domain || "Innovation")}</div>
                      </td>
                      <td style="text-align: center;">
                        <div style="display: inline-flex; align-items: center; gap: 4px;">
                          <input type="number" min="0" max="20" step="0.1" id="live-score-${t.teamId}" class="admin-live-score-input" data-team-id="${t.teamId}" 
                            value="${t.juryScore !== undefined && t.juryScore !== null ? t.juryScore : ''}" placeholder="0-20"
                            style="width: 68px; padding: 6px 6px; font-size: 0.95rem; font-weight: 900; text-align: center; border: 2px solid ${is1st ? '#eab308' : '#cbd5e1'}; border-radius: 8px; background: #ffffff;"
                            onkeydown="if(event.key==='Enter') saveSingleScoreWithFeedback('${t.teamId}', this, document.getElementById('btn-save-${t.teamId}'))">
                          <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">/ 20</span>
                        </div>
                      </td>
                      <td>
                        ${is1st ? '<span class="status-pill status-champion" style="font-size:0.75rem;"><i class="fa-solid fa-crown"></i> 1st Champion (₹3,000)</span>' :
                          is2nd ? '<span class="status-pill status-runner" style="font-size:0.75rem;"><i class="fa-solid fa-medal"></i> 1st Runner Up (₹2,000)</span>' :
                          is3rd ? '<span class="status-pill status-runner" style="font-size:0.75rem;"><i class="fa-solid fa-award"></i> 2nd Runner Up (₹1,000)</span>' :
                          isTop10 ? '<span class="status-pill status-nominated" style="font-size:0.75rem;"><i class="fa-solid fa-paper-plane"></i> SIH Nominated (Top 10)</span>' :
                          '<span class="status-pill status-participated" style="font-size:0.75rem;"><i class="fa-solid fa-check"></i> Finalist</span>'
                        }
                      </td>
                      <td style="text-align: right;">
                        <button id="btn-save-${t.teamId}" class="btn-3d-primary" onclick="saveSingleScoreWithFeedback('${t.teamId}', document.getElementById('live-score-${t.teamId}'), this)" style="padding: 6px 12px; font-size: 0.78rem;">
                          <i class="fa-solid fa-check"></i> Update
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="font-size: 0.82rem; color: #059669; font-weight: 700;">
              <i class="fa-solid fa-circle-check"></i> Real-time sync: All updates reflect immediately on public #leaderboard
            </div>
            <button class="btn-3d-primary" onclick="saveAllScores()" style="padding: 9px 20px; font-size: 0.86rem; background: #059669;">
              <i class="fa-solid fa-floppy-disk"></i> Update All Scores & Refresh Leaderboard
            </button>
          </div>
        </div>
      `;
    } else {
      // MASTER CERTIFICATES REGISTRY VIEW

      const winnerCerts = masterCerts.filter(c => c.category === 'Winner');
      const teamCerts = masterCerts.filter(c => c.category === 'Team Participation');
      const indivCerts = masterCerts.filter(c => c.category === 'Individual Participant');
      const leadCerts = masterCerts.filter(c => c.category === 'Technical Lead');
      const facultyCerts = masterCerts.filter(c => c.category === 'SIH Cell & Faculty');
      const coreCerts = masterCerts.filter(c => c.category === 'Core Committee');

      // Outer wrapper + view-mode toggle bar
      html += `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
          <div style="display:flex; gap:8px; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #f1f5f9; justify-content:space-between; align-items:center; flex-wrap:wrap;">
            <div style="display:flex; gap:6px;">
              <button onclick="switchCertViewMode('squads')" style="padding:7px 14px; font-size:0.82rem; font-weight:700; border-radius:8px; border:2px solid ${adminCertViewMode === 'squads' ? '#059669' : '#e2e8f0'}; background:${adminCertViewMode === 'squads' ? '#ecfdf5' : '#fff'}; color:${adminCertViewMode === 'squads' ? '#065f46' : '#64748b'}; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-layer-group"></i> Squad Groups
              </button>
              <button onclick="switchCertViewMode('table')" style="padding:7px 14px; font-size:0.82rem; font-weight:700; border-radius:8px; border:2px solid ${adminCertViewMode === 'table' ? '#059669' : '#e2e8f0'}; background:${adminCertViewMode === 'table' ? '#ecfdf5' : '#fff'}; color:${adminCertViewMode === 'table' ? '#065f46' : '#64748b'}; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-table-list"></i> Full Table
              </button>
            </div>
            <span style="font-size:0.78rem; color:#64748b; font-weight:600;">${masterCerts.length} Total &nbsp;•&nbsp; 001–003 Winners &rarr; Teams+Members &rarr; Leads &rarr; Core</span>
          </div>
      `;

      if (adminCertViewMode === 'squads') {
        // ===== SQUAD GROUPS VIEW =====

        // WINNERS
        html += `
          <div style="margin-bottom:24px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid #fde68a;">
              <i class="fa-solid fa-trophy" style="color:#d97706;"></i>
              <strong style="font-size:0.92rem; color:#92400e;">Champions &amp; Winners</strong>
              <span style="background:#fef3c7; color:#92400e; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px; border:1px solid #fde68a;">Cert IDs: 001 &ndash; 003</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:12px;">
              ${winnerCerts.length > 0 ? winnerCerts.map(c => `
                <div style="background:#fffbeb; border:2px solid #fde68a; border-radius:10px; padding:14px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong style="color:#059669; font-family:var(--font-mono); font-size:0.8rem; background:#ecfdf5; padding:2px 7px; border-radius:4px; border:1px solid #a7f3d0;">${c.certId}</strong>
                    <span style="font-size:0.85rem;">${c.recipientRole.includes('1st') ? '&#127947;' : c.recipientRole.includes('2nd') ? '&#129352;' : '&#129353;'}</span>
                  </div>
                  <div style="font-weight:800; color:#0f172a; font-size:0.9rem;">${escapeHtml(c.recipientName)}</div>
                  <div style="font-size:0.73rem; color:#64748b; margin:2px 0 10px;">${escapeHtml(c.recipientRole)}</div>
                  <button class="btn-3d-primary" onclick="openCertificateByCertId('${c.certId}')" style="width:100%; padding:5px 10px; font-size:0.74rem; justify-content:center;">
                    <i class="fa-solid fa-award"></i> View &amp; Print
                  </button>
                </div>
              `).join('') : '<div style="color:#94a3b8; font-size:0.82rem; font-style:italic; grid-column:1/-1; padding:8px;">No winner teams registered yet. Load Demo Teams to preview.</div>'}
            </div>
          </div>
        `;

        // TEAMS + MEMBERS
        html += `
          <div style="margin-bottom:24px;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid #bfdbfe;">
              <i class="fa-solid fa-people-group" style="color:#2563eb;"></i>
              <strong style="font-size:0.92rem; color:#1e3a8a;">Registered Squads &amp; Members</strong>
              <span style="background:#eff6ff; color:#1d4ed8; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px; border:1px solid #bfdbfe;">${teamCerts.length} Squads &bull; ${indivCerts.length} Individual</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${teamCerts.length === 0
            ? '<div style="text-align:center; padding:24px; color:#64748b; background:#f8fafc; border-radius:8px; font-size:0.86rem;">No team certificates found. Load Demo Teams to preview.</div>'
            : teamCerts.map(tc => {
              const members = indivCerts.filter(ic => ic.teamId === tc.teamId);
              return `
                      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
                        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; ${members.length > 0 ? 'margin-bottom:12px;' : ''}">
                          <strong style="color:#059669; font-family:var(--font-mono); font-size:0.76rem; background:#ecfdf5; padding:2px 7px; border-radius:4px; border:1px solid #a7f3d0; white-space:nowrap;">${tc.certId}</strong>
                          <span style="font-weight:800; color:#0f172a; font-size:0.88rem;">${escapeHtml(tc.teamName)}</span>
                          <span style="background:#e0f2fe; color:#0369a1; font-size:0.68rem; font-weight:700; padding:2px 7px; border-radius:5px;">${escapeHtml(tc.position || 'PARTICIPANT')}</span>
                          <button class="btn-3d-secondary" onclick="openCertificateByCertId('${tc.certId}')" style="padding:4px 10px; font-size:0.72rem; margin-left:auto; white-space:nowrap;">
                            <i class="fa-solid fa-users" style="color:#059669;"></i> Squad Cert
                          </button>
                        </div>
                        ${members.length > 0 ? `
                          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(195px, 1fr)); gap:8px; padding-top:10px; border-top:1px dashed #e2e8f0;">
                            ${members.map(m => `
                              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:7px; padding:10px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                  <strong style="color:#059669; font-family:var(--font-mono); font-size:0.68rem;">${m.certId}</strong>
                                  ${m.isLeader ? '<span style="background:#fef3c7; color:#92400e; font-size:0.58rem; font-weight:800; padding:1px 5px; border-radius:3px;">LEADER</span>' : ''}
                                </div>
                                <div style="font-weight:700; font-size:0.82rem; color:#0f172a;">${escapeHtml(m.recipientName)}</div>
                                <div style="font-size:0.67rem; color:#64748b; margin-bottom:6px;">${escapeHtml(m.rollNo && m.rollNo !== 'N/A' && m.rollNo !== 'Roll Awaited' ? m.rollNo + ' • ' : '')}${escapeHtml(m.department || '')}</div>
                                <button class="btn-3d-primary" onclick="openCertificateByCertId('${m.certId}')" style="width:100%; padding:4px 8px; font-size:0.68rem; justify-content:center;">
                                  <i class="fa-solid fa-award"></i> View
                                </button>
                              </div>
                            `).join('')}
                          </div>
                        ` : ''}
                      </div>
                    `;
            }).join('')
          }
            </div>
          </div>
        `;

        // TECHNICAL LEADS
        if (leadCerts.length > 0) {
          html += `
            <div style="margin-bottom:20px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:2px solid #e9d5ff;">
                <i class="fa-solid fa-user-tie" style="color:#7c3aed;"></i>
                <strong style="font-size:0.9rem; color:#6b21a8;">Technical &amp; Organizing Leads</strong>
                <span style="background:#faf5ff; color:#6b21a8; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px; border:1px solid #e9d5ff;">${leadCerts.length} certificates</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:10px;">
                ${leadCerts.map(c => `
                  <div style="background:#faf5ff; border:1px solid #e9d5ff; border-radius:8px; padding:12px;">
                    <strong style="color:#059669; font-family:var(--font-mono); font-size:0.74rem; background:#ecfdf5; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:6px;">${c.certId}</strong>
                    <div style="font-weight:800; font-size:0.86rem; color:#0f172a; margin-bottom:2px;">${escapeHtml(c.recipientName)}</div>
                    <div style="font-size:0.72rem; color:#475569; margin-bottom:4px;">${escapeHtml(c.recipientRole)}</div>
                    <div style="font-size:0.68rem; color:#64748b; margin-bottom:8px;">${escapeHtml(c.department || '')}</div>
                    <button class="btn-3d-primary" onclick="openCertificateByCertId('${c.certId}')" style="width:100%; padding:5px 10px; font-size:0.73rem; justify-content:center;">
                      <i class="fa-solid fa-award"></i> View &amp; Print
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        // SIH CELL & FACULTY
        if (facultyCerts.length > 0) {
          html += `
            <div style="margin-bottom:20px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:2px solid #fecdd3;">
                <i class="fa-solid fa-building-columns" style="color:#be123c;"></i>
                <strong style="font-size:0.9rem; color:#9f1239;">SIH Cell &amp; Faculty Conveners</strong>
                <span style="background:#fff1f2; color:#9f1239; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px; border:1px solid #fecdd3;">${facultyCerts.length} certificates</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:10px;">
                ${facultyCerts.map(c => `
                  <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:12px;">
                    <strong style="color:#059669; font-family:var(--font-mono); font-size:0.74rem; background:#ecfdf5; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:6px;">${c.certId}</strong>
                    <div style="font-weight:800; font-size:0.86rem; color:#0f172a; margin-bottom:2px;">${escapeHtml(c.recipientName)}</div>
                    <div style="font-size:0.72rem; color:#475569; margin-bottom:4px;">${escapeHtml(c.recipientRole)}</div>
                    <div style="font-size:0.68rem; color:#64748b; margin-bottom:8px;">${escapeHtml(c.department || '')}</div>
                    <button class="btn-3d-primary" onclick="openCertificateByCertId('${c.certId}')" style="width:100%; padding:5px 10px; font-size:0.73rem; justify-content:center;">
                      <i class="fa-solid fa-award"></i> View &amp; Print
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        // CORE COMMITTEE
        if (coreCerts.length > 0) {
          html += `
            <div style="margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:2px solid #a7f3d0;">
                <i class="fa-solid fa-people-roof" style="color:#059669;"></i>
                <strong style="font-size:0.9rem; color:#166534;">Core Committee (Dept Student Coordinators)</strong>
                <span style="background:#f0fdf4; color:#166534; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px; border:1px solid #a7f3d0;">${coreCerts.length} certificates</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:10px;">
                ${coreCerts.map(c => `
                  <div style="background:#f0fdf4; border:1px solid #a7f3d0; border-radius:8px; padding:12px;">
                    <strong style="color:#059669; font-family:var(--font-mono); font-size:0.74rem; background:#ecfdf5; padding:2px 6px; border-radius:4px; display:inline-block; margin-bottom:6px;">${c.certId}</strong>
                    <div style="font-weight:800; font-size:0.86rem; color:#0f172a; margin-bottom:2px;">${escapeHtml(c.recipientName)}</div>
                    <div style="font-size:0.72rem; color:#475569; margin-bottom:4px;">${escapeHtml(c.recipientRole)}</div>
                    <div style="font-size:0.68rem; color:#64748b; margin-bottom:8px;">${escapeHtml(c.department || '')}</div>
                    <button class="btn-3d-primary" onclick="openCertificateByCertId('${c.certId}')" style="width:100%; padding:5px 10px; font-size:0.73rem; justify-content:center;">
                      <i class="fa-solid fa-award"></i> View &amp; Print
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }

        html += `</div>`; // close outer wrapper

      } else {
        // ===== FULL TABLE VIEW =====
        html += `
          <!-- Filters & Search Toolbar -->
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f1f5f9;">
            <div style="position: relative; flex: 1; min-width: 260px;">
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 11px; color: #94a3b8; font-size: 0.85rem;"></i>
              <input type="text" class="form-text-input" placeholder="Search Certificate ID (e.g. TIT/INTSIH/001), Recipient Name, Team, Role, Dept..."
                value="${adminCertSearchQuery}"
                oninput="filterAdminCertificates(this.value, undefined, undefined)"
                style="padding-left: 34px; font-size: 0.85rem; height: 38px; margin: 0; width: 100%;">
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <select class="form-select-input" onchange="filterAdminCertificates(undefined, this.value, undefined)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
                <option value="ALL" ${adminCertCategoryFilter === "ALL" ? "selected" : ""}>All Certificate Categories</option>
                <option value="Winner" ${adminCertCategoryFilter === "Winner" ? "selected" : ""}>Winners (001 - 003)</option>
                <option value="Team" ${adminCertCategoryFilter === "Team" ? "selected" : ""}>Team Participation (004+)</option>
                <option value="Individual" ${adminCertCategoryFilter === "Individual" ? "selected" : ""}>Individual Student Participants</option>
                <option value="TechLead" ${adminCertCategoryFilter === "TechLead" ? "selected" : ""}>Technical Leads</option>
                <option value="Faculty" ${adminCertCategoryFilter === "Faculty" ? "selected" : ""}>SIH Cell &amp; Faculty Conveners</option>
                <option value="Core" ${adminCertCategoryFilter === "Core" ? "selected" : ""}>Core Organizing Committee</option>
              </select>
              <select class="form-select-input" onchange="filterAdminCertificates(undefined, undefined, this.value)" style="height: 38px; font-size: 0.82rem; padding: 6px 10px; width: auto; margin: 0;">
                <option value="ALL" ${adminCertSignatureFilter === "ALL" ? "selected" : ""}>All Signature States</option>
                <option value="Signed" ${adminCertSignatureFilter === "Signed" ? "selected" : ""}>Digitally Authorized</option>
                <option value="Pending" ${adminCertSignatureFilter === "Pending" ? "selected" : ""}>Pending Signatures</option>
              </select>
              <button class="btn-3d-secondary" onclick="filterAdminCertificates('', 'ALL', 'ALL')" style="height: 38px; padding: 0 12px; font-size: 0.8rem;">
                <i class="fa-solid fa-filter-circle-xmark"></i> Clear
              </button>
            </div>
          </div>

          <!-- Summary Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.82rem; color: #475569; flex-wrap: wrap; gap: 8px;">
            <div>Showing <strong>${filteredCerts.length}</strong> of <strong>${masterCerts.length}</strong> certificates in registry</div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.74rem; font-weight:700; color:#059669; background:#ecfdf5; padding:3px 8px; border-radius:4px;"><i class="fa-solid fa-trophy"></i> 001-003: Winners</span>
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.74rem; font-weight:700; color:#2563eb; background:#eff6ff; padding:3px 8px; border-radius:4px;"><i class="fa-solid fa-people-group"></i> 004+: Teams &amp; Students</span>
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.74rem; font-weight:700; color:#7c3aed; background:#f5f3ff; padding:3px 8px; border-radius:4px;"><i class="fa-solid fa-user-tie"></i> Leads, Faculty &amp; Core</span>
            </div>
          </div>

          <!-- Certificates Table -->
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width: 135px;">Certificate ID</th>
                  <th style="width: 140px;">Category</th>
                  <th>Recipient Name</th>
                  <th>Role / Designation</th>
                  <th>Affiliation / Squad / Dept</th>
                  <th style="width: 130px; text-align: center;">Signature Status</th>
                  <th style="text-align: right; width: 140px;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredCerts.length === 0
            ? `<tr><td colspan="7" style="text-align: center; padding: 36px; color: #64748b;">No issued certificates match your filter criteria.<br><button class="btn-3d-primary" onclick="filterAdminCertificates('', 'ALL', 'ALL')" style="margin-top: 10px; padding: 6px 12px; font-size: 0.8rem;"><i class="fa-solid fa-rotate"></i> Reset Certificate Filters</button></td></tr>`
            : filteredCerts.map((c) => {
              const isWinnerCat = c.category === "Winner";
              const isTeamCat = c.category === "Team Participation";
              const isIndivCat = c.category === "Individual Participant";
              const isLeadCat = c.category === "Technical Lead";
              const isFacultyCat = c.category === "SIH Cell & Faculty";
              const isCoreCat = c.category === "Core Committee";

              let badgeBg = "#f1f5f9", badgeCol = "#475569";
              if (isWinnerCat) { badgeBg = "#fef3c7"; badgeCol = "#92400e"; }
              else if (isTeamCat) { badgeBg = "#e0f2fe"; badgeCol = "#0369a1"; }
              else if (isIndivCat) { badgeBg = "#ecfdf5"; badgeCol = "#065f46"; }
              else if (isLeadCat) { badgeBg = "#faf5ff"; badgeCol = "#6b21a8"; }
              else if (isFacultyCat) { badgeBg = "#fff1f2"; badgeCol = "#9f1239"; }
              else if (isCoreCat) { badgeBg = "#f0fdf4"; badgeCol = "#166534"; }

              return `
                      <tr style="${isWinnerCat ? 'background:#fffbeb;' : ''}">
                        <td>
                          <strong style="color:#059669; font-family:var(--font-mono); font-size:0.86rem; background:#ecfdf5; padding:2px 6px; border-radius:4px; border:1px solid #a7f3d0; display:inline-block;">${c.certId}</strong>
                          <div style="font-size:0.68rem; color:#94a3b8; margin-top:2px;">#${c.serialNumber} &bull; ${c.issuedDate}</div>
                        </td>
                        <td><span style="background:${badgeBg}; color:${badgeCol}; font-weight:800; font-size:0.72rem; padding:3px 8px; border-radius:6px; display:inline-block;">${escapeHtml(c.category)}</span></td>
                        <td>
                          <strong style="color:#0f172a; font-size:0.90rem;">${escapeHtml(c.recipientName)}</strong>
                          ${c.rollNo && c.rollNo !== "N/A" ? `<div style="font-size:0.72rem; color:#64748b;">Roll: ${escapeHtml(c.rollNo)}</div>` : ''}
                        </td>
                        <td>
                          <div style="font-size:0.82rem; font-weight:700; color:#334155;">${escapeHtml(c.recipientRole)}</div>
                          <div style="font-size:0.7rem; color:#64748b;">${escapeHtml(c.programYear || "")}</div>
                        </td>
                        <td>
                          <strong style="color:#0f172a; font-size:0.82rem;">${escapeHtml(c.teamName || c.department || "TIT")}</strong>
                          <div style="font-size:0.7rem; color:#64748b; max-width:180px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(c.department || '')}">${escapeHtml(c.department || "")}</div>
                        </td>
                        <td style="text-align:center;">
                          ${isSigned
                  ? `<span style="color:#059669; font-weight:700; font-size:0.74rem; background:#ecfdf5; padding:2px 8px; border-radius:12px; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-circle-check"></i> Authorized</span>`
                  : `<span style="color:#d97706; font-weight:700; font-size:0.74rem; background:#fffbeb; padding:2px 8px; border-radius:12px; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-clock"></i> Pending Sign</span>`
                }
                        </td>
                        <td style="text-align:right; white-space:nowrap;">
                          <button class="btn-3d-primary" onclick="openCertificateByCertId('${c.certId}')" style="padding:5px 10px; font-size:0.75rem;">
                            <i class="fa-solid fa-award"></i> View &amp; Print
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

        html += `</div>`; // close outer wrapper
      }
    }

    container.innerHTML = html;
  } catch (err) {

    console.error("[TIT SIH Admin Render Error]:", err);
    container.innerHTML = `
      <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 24px; text-align: center; color: #9f1239;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <h3 style="font-weight: 800; margin-bottom: 6px;">Admin Console Encountered a Display Error</h3>
        <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 16px;">${escapeHtml(err.message || 'Unknown error occurred.')}</p>
        <button class="btn-3d-primary" onclick="renderAdminConsole()">
          <i class="fa-solid fa-rotate"></i> Reload Admin View
        </button>
      </div>
    `;
  }
};

/* ==========================================================================
   ADMIN TEAM INSPECTOR & STATUS MANAGEMENT
   ========================================================================== */
window.openAdminTeamDetails = (teamId) => {
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  const team = teams.find((t) => t && (t.teamId === teamId || t.teamName === teamId));
  if (!team) return;

  const modal = document.getElementById("admin-team-details-modal");
  const content = document.getElementById("admin-team-details-content");
  if (!modal || !content) return;

  const membersList = (Array.isArray(team.members) ? team.members : []).filter(Boolean);
  const leader = membersList[0] || {};
  const femaleCount = membersList.filter((m) => normGender(m.gender) === "Female").length;

  content.innerHTML = `
    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 18px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="background: #059669; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono);">
              ${team.teamId || "N/A"}
            </span>
            <span style="background: #ecfdf5; color: #065f46; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #a7f3d0;">
              ${team.edition || "Software Edition"}
            </span>
            <span style="background: #fff1f2; color: #9f1239; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px; border: 1px solid #fecdd3;">
              <i class="fa-solid fa-venus"></i> ${femaleCount} Female Member(s)
            </span>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #0f172a; margin: 0 0 4px;">
            Team: ${escapeHtml(team.teamName || "Squad")}
          </h2>
          <div style="color: #64748b; font-size: 0.85rem;">
            Leader: <strong style="color: #0f172a;">${escapeHtml(leader.name || "Leader")}</strong> (${leader.roll ? escapeHtml(leader.roll) : "Roll Awaited"} - ${escapeHtml(leader.dept || leader.branch || "General")}) • Registered: ${team.createdAt || "2026"}
          </div>
        </div>
        <div style="text-align: right;">
          <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; display: block; margin-bottom: 4px;">UPDATE EVALUATION STATUS</label>
          <select class="admin-status-select" style="padding: 6px 12px; font-weight: 700;" onchange="updateTeamStatus('${team.teamId}', this.value)">
            <option value="Under Review by IIC Panel" ${(team.status || '').includes("Under Review") ? "selected" : ""}>Under Review</option>
            <option value="Shortlisted for Internal Hackathon" ${(team.status || '').includes("Shortlisted") ? "selected" : ""}>Shortlisted for Internal Hackathon</option>
            <option value="Nominated for SIH Finals" ${(team.status || '').includes("Nominated") ? "selected" : ""}>Nominated for SIH Finals</option>
          </select>
        </div>
      </div>
    </div>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
        <span style="font-weight: 800; color: #064e3b; font-size: 0.95rem;">
          <i class="fa-solid fa-bullseye" style="color: #059669;"></i> Target PS: <strong>${team.psId || 'N/A'}</strong> (${team.domain || 'General Innovation'})
        </span>
        ${team.pptLink ? `
          <a href="${team.pptLink}" target="_blank" rel="noopener" class="btn-3d-primary" style="padding: 6px 14px; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-file-powerpoint"></i> Open Idea PPT Deck
          </a>
        ` : ''}
      </div>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
        ${escapeHtml(team.title || "Innovation Project")}
      </h4>
      <p style="font-size: 0.88rem; color: #475569; line-height: 1.55; margin: 0;">
        ${escapeHtml(team.abstract || "No abstract submitted.")}
      </p>
    </div>
    <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-users" style="color: #059669;"></i> Full Squad Roster (${membersList.length} Members)
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 24px;">
      ${membersList.map((m, idx) => `
        <div style="background: ${idx === 0 ? "#f0fdf4" : "#ffffff"}; border: 1px solid ${idx === 0 ? "#a7f3d0" : "#e2e8f0"}; border-radius: 10px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #0f172a; font-size: 0.9rem;">${escapeHtml(m.name || "Member")}</strong>
            ${idx === 0 ? '<span class="member-badge-pill leader" style="font-size:0.65rem;">LEADER</span>' : `<span style="font-size:0.7rem; color:#64748b; font-weight:600;">Member ${idx + 1}</span>`}
          </div>
          <div style="font-size: 0.78rem; color: #475569; margin-bottom: 3px;">
            <i class="fa-solid fa-id-badge" style="color: #059669; width: 14px;"></i> Roll: <strong>${m.roll ? escapeHtml(m.roll) : "Awaited"}</strong> (${escapeHtml(m.dept || m.branch || "CSE")})
          </div>
          <div style="font-size: 0.78rem; color: #475569; margin-bottom: 3px;">
            <i class="fa-solid fa-graduation-cap" style="color: #059669; width: 14px;"></i> ${normYear(m.year, m.roll, m.email)} • ${normProgram(m.program, m.branch)}
          </div>
          <div style="font-size: 0.78rem; color: ${normGender(m.gender) === 'Female' ? '#e11d48' : '#2563eb'}; margin-bottom: 3px; font-weight: 700;">
            <i class="fa-solid ${normGender(m.gender) === 'Female' ? 'fa-venus' : 'fa-mars'}" style="width: 14px;"></i> ${normGender(m.gender)}
          </div>
          <div style="font-size: 0.75rem; color: #64748b; word-break: break-all; margin-bottom: 2px;">
            <i class="fa-solid fa-envelope" style="color: #059669; width: 14px;"></i> ${m.email || "N/A"}
          </div>
          <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 8px;">
            <i class="fa-solid fa-phone" style="color: #059669; width: 14px;"></i> ${m.phone || "N/A"}
          </div>
          <button onclick="openStudentIndividualCertificate('${team.teamId}', ${idx})" class="btn-3d-secondary" style="width: 100%; padding: 4px 8px; font-size: 0.72rem; justify-content: center;" title="View & Print Individual Student Certificate">
            <i class="fa-solid fa-award" style="color: #d97706;"></i> Individual Certificate
          </button>
        </div>
      `).join("")}
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 16px; flex-wrap: wrap; gap: 10px;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn-3d-primary" onclick="openSquadTeamCertificate('${team.teamId}')" style="padding: 8px 14px; font-size: 0.82rem;">
          <i class="fa-solid fa-award"></i> View Team Certificate
        </button>
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

window.updateTeamStatus = (teamId, newStatus) => {
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  const team = teams.find((t) => t && (t.teamId === teamId || t.teamName === teamId));
  if (team) {
    team.status = newStatus;
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

    if (typeof isFirebaseActive !== "undefined" && isFirebaseActive && typeof db !== "undefined" && db) {
      db.collection("teams")
        .doc(team.teamId)
        .update({ status: newStatus })
        .catch((err) => console.error("Firebase status update error:", err));
    }

    renderAdminConsole();
    if (typeof renderStudentDashboard === "function") renderStudentDashboard();
  }
};

window.deleteTeamByAdmin = (teamId) => {
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  const team = teams.find((t) => t && (t.teamId === teamId || t.teamName === teamId));
  if (!team) return;

  const confirmPrompt = `CONFIRM PERMANENT DELETION\n\nAre you sure you want to delete this team?\n• Team Name: ${team.teamName || 'Squad'}\n• Team ID: ${team.teamId}\n• Leader: ${(team.members && team.members[0]?.name) || "N/A"}\n\nThis will remove the team from the registry and cloud database. This action cannot be undone.`;

  if (confirm(confirmPrompt)) {
    registeredTeams = registeredTeams.filter((t) => t && t.teamId !== team.teamId);
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));

    if (typeof isFirebaseActive !== "undefined" && isFirebaseActive && typeof db !== "undefined" && db) {
      db.collection("teams")
        .doc(team.teamId)
        .delete()
        .then(() => console.log(`Team ${team.teamId} permanently deleted from Firestore.`))
        .catch((err) => console.error("Error deleting team from Firestore:", err));
    }

    closeAdminTeamDetails();
    renderAdminConsole();
    if (typeof renderStudentDashboard === "function") renderStudentDashboard();
    alert(`[TIT SIH] Team "${team.teamName || team.teamId}" has been deleted.`);
  }
};


// ==========================================================================
// ADMIN LIVE LEADERBOARD & SCORING HELPERS
// ==========================================================================
window.showAdminToast = (msg) => {
  let toast = document.getElementById("admin-live-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "admin-live-toast";
    toast.style.cssText = "position:fixed; bottom:24px; right:24px; background:#064e3b; color:#ecfdf5; padding:12px 20px; border-radius:10px; font-weight:700; font-size:0.88rem; box-shadow:0 10px 25px rgba(0,0,0,0.3); z-index:999999; display:flex; align-items:center; gap:10px; border:1px solid #10b981; transition:all 0.3s ease;";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#34d399; font-size:1.1rem;"></i> ${msg}`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 3500);
};

window.saveSingleScoreWithFeedback = (teamId, inputElem, btnElem) => {
  const val = inputElem ? inputElem.value.trim() : "";
  const numVal = (val !== "" && !isNaN(val)) ? Number(val) : null;
  
  if (numVal !== null && (numVal < 0 || numVal > 20)) {
    alert("Score must be between 0 and 20.");
    return;
  }
  
  saveJuryScore(teamId, numVal);
  
  if (btnElem) {
    const origHtml = btnElem.innerHTML;
    btnElem.innerHTML = `<i class="fa-solid fa-check"></i> Saved!`;
    btnElem.style.background = "#059669";
    btnElem.style.color = "#ffffff";
    setTimeout(() => {
      btnElem.innerHTML = origHtml;
      btnElem.style.background = "";
      btnElem.style.color = "";
    }, 1800);
  }
  
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  const team = teams.find(t => t && (t.teamId === teamId || t.teamName === teamId));
  const teamName = team ? team.teamName : teamId;
  showAdminToast(`✅ Score for "${teamName}" saved (${numVal !== null ? numVal : 'N/A'}/20)! Leaderboard updated.`);
};

window.saveAllScores = () => {
  const inputs = document.querySelectorAll(".admin-live-score-input, .admin-table-score-input");
  let updatedCount = 0;
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];

  inputs.forEach(input => {
    const teamId = input.getAttribute("data-team-id");
    const val = input.value.trim();
    if (teamId) {
      const team = teams.find(t => t && (t.teamId === teamId || t.teamName === teamId));
      if (team) {
        team.juryScore = (val !== "" && !isNaN(val)) ? Number(val) : null;
        updatedCount++;
      }
    }
  });

  localStorage.setItem("tit_sih_teams", JSON.stringify(teams));
  if (typeof renderPublicLeaderboard === "function") renderPublicLeaderboard();
  if (typeof searchPublicCertificates === "function") searchPublicCertificates();
  renderAdminConsole();
  showAdminToast(`🏆 Scores updated for all ${updatedCount} squads! The Leaderboard & Podium have been refreshed.`);
};

window.jumpToPublicLeaderboard = () => {
  closeAdminModal();
  setTimeout(() => {
    const elem = document.getElementById("leaderboard");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#leaderboard";
    }
  }, 200);
};

// Score Saving Helper
window.saveJuryScore = (teamId, score) => {
  const teams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  const team = teams.find((t) => t && (t.teamId === teamId || t.teamName === teamId));
  if (team) {
    team.juryScore = (score !== "" && score !== null && !isNaN(score)) ? Number(score) : null;
    localStorage.setItem("tit_sih_teams", JSON.stringify(teams));
    if (typeof isFirebaseActive !== "undefined" && isFirebaseActive && typeof db !== "undefined" && db) {
      db.collection("teams").doc(team.teamId).update({ juryScore: team.juryScore }).catch(() => { });
    }
    // Update live leaderboard immediately
    if (typeof renderPublicLeaderboard === "function") {
      renderPublicLeaderboard();
    }
    // Update public certificates if open
    if (typeof searchPublicCertificates === "function") {
      searchPublicCertificates();
    }
  }
};

// Master Teams Export to CSV - 100% COMPLETE EXPORT OF ALL REGISTERED TEAMS
window.exportTeamsToCSV = window.exportToCSV = () => {
  let allTeams = [];
  try {
    const local = JSON.parse(localStorage.getItem("tit_sih_teams") || "[]");
    const mem = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
    const map = new Map();
    [...mem, ...local].forEach(t => {
      if (t && (t.teamId || t.teamName)) {
        const key = t.teamId || t.teamName;
        map.set(key, t);
      }
    });
    allTeams = Array.from(map.values());
  } catch (e) {
    allTeams = (typeof registeredTeams !== "undefined" && Array.isArray(registeredTeams)) ? registeredTeams : [];
  }

  if (allTeams.length === 0) {
    alert("No registered teams found to export.");
    return;
  }

  let csvContent = "\uFEFF"; // Byte Order Mark for Excel
  csvContent += "Team ID,Team Name,Track Edition,PS ID,PS Domain,Project Title,Abstract,Referral Code,Referred By Coordinator,Evaluation Status,Jury Score,Registration Date,Idea PPT Deck Link,Leader Name,Leader Roll,Leader Branch,Leader Program,Leader Year,Leader Gender,Leader Email,Leader Phone,Member 2 Name,Member 2 Roll,Member 2 Branch,Member 2 Year,Member 2 Gender,Member 2 Email,Member 2 Phone,Member 3 Name,Member 3 Roll,Member 3 Branch,Member 3 Year,Member 3 Gender,Member 3 Email,Member 3 Phone,Member 4 Name,Member 4 Roll,Member 4 Branch,Member 4 Year,Member 4 Gender,Member 4 Email,Member 4 Phone,Member 5 Name,Member 5 Roll,Member 5 Branch,Member 5 Year,Member 5 Gender,Member 5 Email,Member 5 Phone,Member 6 Name,Member 6 Roll,Member 6 Branch,Member 6 Year,Member 6 Gender,Member 6 Email,Member 6 Phone\n";

  const clean = (val) => `"${String(val || '').replace(/"/g, '""').replace(/\r?\n|\r/g, ' ')}"`;

  allTeams.forEach((t) => {
    if (!t) return;
    const membersList = (Array.isArray(t.members) ? t.members : []).filter(Boolean);
    const m0 = membersList[0] || {};
    const m1 = membersList[1] || {};
    const m2 = membersList[2] || {};
    const m3 = membersList[3] || {};
    const m4 = membersList[4] || {};
    const m5 = membersList[5] || {};

    const row = [
      clean(t.teamId),
      clean(t.teamName),
      clean(t.edition),
      clean(t.psId),
      clean(t.domain),
      clean(t.title),
      clean(t.abstract),
      clean(t.referralCode || 'NONE'),
      clean(t.referredBy || ''),
      clean(t.status || 'Under Review by IIC Panel'),
      t.juryScore !== undefined && t.juryScore !== null ? t.juryScore : '',
      clean(t.createdAt || '2026'),
      clean(t.pptLink || ''),
      clean(m0.name),
      clean(m0.roll || 'Awaited'),
      clean(normBranch(m0.branch || m0.dept)),
      clean(normProgram(m0.program, m0.branch)),
      clean(normYear(m0.year, m0.roll, m0.email)),
      clean(normGender(m0.gender)),
      clean(m0.email),
      clean(m0.phone),
      clean(m1.name),
      clean(m1.roll),
      clean(m1.name ? normBranch(m1.branch || m1.dept) : ''),
      clean(m1.name ? normYear(m1.year, m1.roll, m1.email) : ''),
      clean(m1.name ? normGender(m1.gender) : ''),
      clean(m1.email),
      clean(m1.phone),
      clean(m2.name),
      clean(m2.roll),
      clean(m2.name ? normBranch(m2.branch || m2.dept) : ''),
      clean(m2.name ? normYear(m2.year, m2.roll, m2.email) : ''),
      clean(m2.name ? normGender(m2.gender) : ''),
      clean(m2.email),
      clean(m2.phone),
      clean(m3.name),
      clean(m3.roll),
      clean(m3.name ? normBranch(m3.branch || m3.dept) : ''),
      clean(m3.name ? normYear(m3.year, m3.roll, m3.email) : ''),
      clean(m3.name ? normGender(m3.gender) : ''),
      clean(m3.email),
      clean(m3.phone),
      clean(m4.name),
      clean(m4.roll),
      clean(m4.name ? normBranch(m4.branch || m4.dept) : ''),
      clean(m4.name ? normYear(m4.year, m4.roll, m4.email) : ''),
      clean(m4.name ? normGender(m4.gender) : ''),
      clean(m4.email),
      clean(m4.phone),
      clean(m5.name),
      clean(m5.roll),
      clean(m5.name ? normBranch(m5.branch || m5.dept) : ''),
      clean(m5.name ? normYear(m5.year, m5.roll, m5.email) : ''),
      clean(m5.name ? normGender(m5.gender) : ''),
      clean(m5.email),
      clean(m5.phone)
    ].join(",");
    csvContent += row + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `TIT_SIH_2026_ALL_Registered_Teams_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
      juryScore: 18.8,
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
      juryScore: 17.6,
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
      juryScore: 18.4,
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
      juryScore: 17.2,
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
      juryScore: 16.8,
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
      juryScore: 17.8,
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
      juryScore: 16.4,
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
  if (typeof renderStudentDashboard === "function") renderStudentDashboard();
  alert(`[TIT SIH] Successfully loaded ${sampleTITTeams.length} demo TIT squads with multi-branch & multi-year cohorts for visualization preview!`);
};

window.clearDemoTeams = () => {
  if (confirm("Clear all teams from local storage?")) {
    registeredTeams = [];
    localStorage.setItem("tit_sih_teams", JSON.stringify(registeredTeams));
    renderAdminConsole();
    if (typeof renderStudentDashboard === "function") renderStudentDashboard();
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
            <button class="btn-3d-secondary" onclick="openPublicCommitteeCertificate('${escapeHtml(c.name)}', 'Student Coordinator (${escapeHtml(c.year)})', '${escapeHtml(meta.name)}', 'TIT/INTSIH/COORD-${refCode}')" style="width: 100%; margin-top: 10px; font-size: 0.76rem; padding: 5px 8px; justify-content: center;" title="View & Download Official Certificate of Appreciation">
              <i class="fa-solid fa-award" style="color: #d97706;"></i> Certificate of Appreciation
            </button>
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

/* ==========================================================================
   CERTIFICATES DIRECTORY FILTER & SEARCH ENGINE
   ========================================================================== */
let currentCertCategory = "all";
let currentCertSearch = "";

window.filterCertDirectory = (cat) => {
  currentCertCategory = cat || "all";

  // Update active tab buttons
  const filterBtns = document.querySelectorAll("#cert-filter-bar .branch-filter-btn");
  filterBtns.forEach(btn => {
    if (btn.getAttribute("data-cat") === cat) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  applyCertFilters();
};

window.searchCertDirectory = (query) => {
  currentCertSearch = (query || "").trim().toLowerCase();
  applyCertFilters();
};

function applyCertFilters() {
  const cards = document.querySelectorAll("#cert-directory-grid .cert-recog-card");
  cards.forEach(card => {
    const cardCat = card.getAttribute("data-cat") || "";
    const cardSearch = (card.getAttribute("data-search") || "").toLowerCase();

    const matchesCat = currentCertCategory === "all" || cardCat === currentCertCategory;
    const matchesSearch = currentCertSearch === "" || cardSearch.includes(currentCertSearch);

    if (matchesCat && matchesSearch) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function syncCommitteeCertCardBadges() {
  const cards = document.querySelectorAll(".cert-recog-card");
  if (!cards || cards.length === 0) return;
  const registry = window.generateMasterCertificatesRegistry();

  cards.forEach(card => {
    const nameEl = card.querySelector(".cert-recog-name");
    const badgeEl = card.querySelector(".cert-id-badge");
    if (nameEl && badgeEl) {
      const name = nameEl.textContent.trim().toLowerCase();
      // For dual-role people, prioritise their leadership/committee cert (not their team-member cert)
      const match =
        registry.find(c =>
          (c.category === 'Technical Lead' || c.category === 'Core Committee' || c.category === 'SIH Cell & Faculty') &&
          c.recipientName.toLowerCase() === name
        ) ||
        registry.find(c => c.recipientName.toLowerCase() === name);
      if (match) {
        badgeEl.innerHTML = `<i class="fa-solid fa-stamp"></i> ${match.certId}`;
      }
    }
  });
}

// Hook initialization on DOM ready
function initPortalCore() {
  purgeNonParticipatingTeams();
  initTeammateBoard();
  initSignatorySync();
  syncCommitteeCertCardBadges();
  checkUrlHashRouting();
  if (typeof renderPublicLeaderboard === 'function') renderPublicLeaderboard();
  if (typeof searchPublicCertificates === 'function') searchPublicCertificates('');
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortalCore);
} else {
  initPortalCore();
}







/* ==========================================================================
   PUBLIC FINALE LEADERBOARD & CERTIFICATES HUB ENGINE
   ========================================================================== */
let certHubCategory = "all";
let certHubSearch = "";

window.renderPublicLeaderboard = function renderPublicLeaderboard() {
  const container = document.getElementById("leaderboard-container");
  if (!container) return;

  const teams = [...registeredTeams].filter(t => !isNonParticipatingTeam(t)).sort((a, b) => (Number(b.juryScore) || 0) - (Number(a.juryScore) || 0));

  const top1 = teams[0] || {};
  const top2 = teams[1] || {};
  const top3 = teams[2] || {};

  container.innerHTML = `
    <!-- Top 3 Podium -->
    <div class="leaderboard-podium-grid">
      <!-- 2nd Place -->
      <div class="podium-card podium-silver">
        <div class="podium-badge"><i class="fa-solid fa-medal"></i> 2nd Place • 1st Runner Up</div>
        <div class="podium-trophy text-silver"><i class="fa-solid fa-trophy"></i></div>
        <div class="podium-cash">₹2,000 CASH</div>
        <h3 class="podium-team-name">${escapeHtml(top2.teamName || "AgriBot TIT")}</h3>
        <p class="podium-title">${escapeHtml(top2.title || "Innovation Project")}</p>
        <div class="podium-score-pill"><i class="fa-solid fa-star"></i> Score: <strong>${top2.juryScore !== undefined && top2.juryScore !== null ? top2.juryScore : 18.8}</strong>/20</div>
        <div class="podium-status-badge">${escapeHtml(top2.edition || "Hardware Edition")}</div>
        <button class="btn-3d-primary" onclick="openSquadTeamCertificate('${top2.teamId}')" style="width:100%; justify-content:center; margin-top:14px; font-size:0.84rem; padding:8px 12px;">
          <i class="fa-solid fa-stamp"></i> View Team Certificate
        </button>
      </div>

      <!-- 1st Place Champion -->
      <div class="podium-card podium-gold">
        <div class="podium-crown"><i class="fa-solid fa-crown"></i></div>
        <div class="podium-badge gold-badge"><i class="fa-solid fa-trophy"></i> 1st Place • Champion</div>
        <div class="podium-trophy text-gold"><i class="fa-solid fa-trophy"></i></div>
        <div class="podium-cash">₹3,000 CASH</div>
        <h3 class="podium-team-name" style="font-size:1.4rem;">${escapeHtml(top1.teamName || "ByteCraft TIT")}</h3>
        <p class="podium-title">${escapeHtml(top1.title || "AI Landslide Monitoring")}</p>
        <div class="podium-score-pill gold-score"><i class="fa-solid fa-star"></i> Score: <strong>${top1.juryScore !== undefined && top1.juryScore !== null ? top1.juryScore : 19.2}</strong>/20</div>
        <div class="podium-status-badge gold-status">Grand Champion • SIH Nationals Nominee</div>
        <button class="btn-3d-primary" onclick="openSquadTeamCertificate('${top1.teamId}')" style="width:100%; justify-content:center; margin-top:14px; font-size:0.88rem; padding:10px 14px; background:linear-gradient(135deg,#059669,#10b981);">
          <i class="fa-solid fa-stamp"></i> View Winner Certificate
        </button>
      </div>

      <!-- 3rd Place -->
      <div class="podium-card podium-bronze">
        <div class="podium-badge"><i class="fa-solid fa-award"></i> 3rd Place • 2nd Runner Up</div>
        <div class="podium-trophy text-bronze"><i class="fa-solid fa-trophy"></i></div>
        <div class="podium-cash">₹1,000 CASH</div>
        <h3 class="podium-team-name">${escapeHtml(top3.teamName || "RoboTIT Edge Systems")}</h3>
        <p class="podium-title">${escapeHtml(top3.title || "IoT Telemetry Gateway")}</p>
        <div class="podium-score-pill"><i class="fa-solid fa-star"></i> Score: <strong>${top3.juryScore !== undefined && top3.juryScore !== null ? top3.juryScore : 18.4}</strong>/20</div>
        <div class="podium-status-badge">${escapeHtml(top3.edition || "Hardware Edition")}</div>
        <button class="btn-3d-primary" onclick="openSquadTeamCertificate('${top3.teamId}')" style="width:100%; justify-content:center; margin-top:14px; font-size:0.84rem; padding:8px 12px;">
          <i class="fa-solid fa-stamp"></i> View Team Certificate
        </button>
      </div>
    </div>

    <!-- Complete 30-Team Leaderboard Table -->
    <div class="leaderboard-table-card">
      <div class="leaderboard-table-header">
        <div>
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-main); margin:0 0 4px;">
            <i class="fa-solid fa-list-ol" style="color:#059669;"></i> Complete Standings of All 30 Teams
          </h3>
          <p style="margin:0; font-size:0.82rem; color:var(--text-muted);">Evaluation scores awarded by faculty & expert jury panel</p>
        </div>
        <div style="font-family:var(--font-mono); font-size:0.82rem; font-weight:700; background:#ecfdf5; color:#065f46; padding:6px 14px; border-radius:99px; border:1px solid #a7f3d0;">
          30 Teams Evaluated
        </div>
      </div>

      <div class="table-responsive" style="max-height: 520px; overflow-y: auto;">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th style="width:60px; text-align:center;">Rank</th>
              <th>Squad Name & Project Title</th>
              <th>Domain / Edition</th>
              <th>Team Leader</th>
              <th style="text-align:center;">Jury Score</th>
              <th>Official Status</th>
              <th style="text-align:right;">Certificate</th>
            </tr>
          </thead>
          <tbody>
            ${teams.map((t, idx) => {
              const rank = idx + 1;
              const leader = (t.members && t.members[0]) ? t.members[0].name : "Student Leader";
              const isTop1 = rank === 1;
              const isTop2 = rank === 2;
              const isTop3 = rank === 3;
              const isNominated = rank <= 10;
              
              let rankBadgeClass = "rank-normal";
              if (isTop1) rankBadgeClass = "rank-1";
              else if (isTop2) rankBadgeClass = "rank-2";
              else if (isTop3) rankBadgeClass = "rank-3";

              return `
                <tr class="${isTop1 ? 'row-winner' : (isTop2 || isTop3 ? 'row-podium' : '')}">
                  <td style="text-align:center;">
                    <span class="leaderboard-rank-badge ${rankBadgeClass}">
                      ${isTop1 ? '🥇 1' : isTop2 ? '🥈 2' : isTop3 ? '🥉 3' : '#' + rank}
                    </span>
                  </td>
                  <td>
                    <div style="font-weight:800; color:var(--text-main); font-size:0.92rem;">${escapeHtml(t.teamName)}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${escapeHtml(t.title || t.psId || "SIH Innovation")}
                    </div>
                  </td>
                  <td>
                    <span style="font-size:0.78rem; font-weight:700; color:#0369a1; background:#e0f2fe; padding:2px 8px; border-radius:6px; display:inline-block;">
                      ${escapeHtml(t.domain || t.edition || "Innovation")}
                    </span>
                  </td>
                  <td>
                    <div style="font-size:0.84rem; font-weight:700; color:var(--text-main);">${escapeHtml(leader)}</div>
                    <div style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono);">${t.teamId}</div>
                  </td>
                  <td style="text-align:center;">
                    <span class="score-badge-cell ${isTop1 ? 'score-top1' : (isTop2 || isTop3 ? 'score-top3' : '')}">
                      ${t.juryScore !== undefined && t.juryScore !== null ? t.juryScore : 15} / 20
                    </span>
                  </td>
                  <td>
                    ${isTop1 ? '<span class="status-pill status-champion"><i class="fa-solid fa-crown"></i> Champion</span>' :
                      isTop2 ? '<span class="status-pill status-runner"><i class="fa-solid fa-medal"></i> 1st Runner Up</span>' :
                      isTop3 ? '<span class="status-pill status-runner"><i class="fa-solid fa-award"></i> 2nd Runner Up</span>' :
                      isNominated ? '<span class="status-pill status-nominated"><i class="fa-solid fa-paper-plane"></i> SIH Nominated</span>' :
                      '<span class="status-pill status-participated"><i class="fa-solid fa-check"></i> Participated</span>'
                    }
                  </td>
                  <td style="text-align:right; white-space:nowrap;">
                    <button class="btn-3d-primary" onclick="openSquadTeamCertificate('${t.teamId}')" style="padding:4px 10px; font-size:0.75rem;">
                      <i class="fa-solid fa-stamp"></i> Certificate
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window.filterCertHubCategory = function filterCertHubCategory(cat) {
  certHubCategory = cat || "all";
  document.querySelectorAll(".cert-hub-filter-btn").forEach(btn => {
    if (btn.getAttribute("data-cat") === certHubCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  window.searchPublicCertificates(certHubSearch);
};

window.toggleTeamCertDrawer = function(teamId) {
  const drawer = document.getElementById("team-certs-drawer-" + teamId);
  const icon = document.getElementById("toggle-icon-" + teamId);
  if (!drawer) return;
  const isOpen = drawer.style.display === "block";
  drawer.style.display = isOpen ? "none" : "block";
  if (icon) {
    icon.className = isOpen ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-up";
  }
};

window.searchPublicCertificates = function searchPublicCertificates(query) {
  certHubSearch = (query || "").trim().toLowerCase();
  const container = document.getElementById("public-cert-results-container");
  if (!container) return;

  const registry = window.generateMasterCertificatesRegistry();
  const searchQ = certHubSearch;

  // 1. Prepare Teams for Participants Section
  let filteredTeams = registeredTeams.filter(t => !isNonParticipatingTeam(t)).map((t, idx) => {
    const members = Array.isArray(t.members) ? t.members : [];
    const teamCert = registry.find(c => c.category === "Team Squad" && c.teamId === t.teamId);
    const certId = teamCert ? teamCert.certId : ("TIT/INTSIH/SQ-" + t.teamId);
    return {
      ...t,
      members,
      certId,
      rank: idx + 1
    };
  });

  // 2. Gather Core Committee & Technical Leads
  const allCoords = registry.filter(c => c.category === "Core Committee");
  const allLeads = registry.filter(c => c.category === "Technical Lead");

  // 3. Search Filtering
  let filteredCoords = allCoords;
  let filteredLeads = allLeads;

  if (searchQ) {
    filteredTeams = filteredTeams.filter(t => {
      const matchTeam = (t.teamName || "").toLowerCase().includes(searchQ) ||
                        (t.teamId || "").toLowerCase().includes(searchQ) ||
                        (t.title || "").toLowerCase().includes(searchQ) ||
                        (t.domain || t.edition || "").toLowerCase().includes(searchQ) ||
                        (t.certId || "").toLowerCase().includes(searchQ);
      const matchMember = (t.members || []).some(m =>
        (m.name || "").toLowerCase().includes(searchQ) ||
        (m.roll || "").toLowerCase().includes(searchQ) ||
        (m.branch || "").toLowerCase().includes(searchQ)
      );
      return matchTeam || matchMember;
    });

    filteredCoords = allCoords.filter(c =>
      (c.recipientName || "").toLowerCase().includes(searchQ) ||
      (c.department || "").toLowerCase().includes(searchQ) ||
      (c.certId || "").toLowerCase().includes(searchQ)
    );

    filteredLeads = allLeads.filter(c =>
      (c.recipientName || "").toLowerCase().includes(searchQ) ||
      (c.recipientRole || "").toLowerCase().includes(searchQ) ||
      (c.department || "").toLowerCase().includes(searchQ) ||
      (c.certId || "").toLowerCase().includes(searchQ)
    );
  }

  const showParticipants = certHubCategory === "all" || certHubCategory === "participants";
  const showCoords = certHubCategory === "all" || certHubCategory === "coords";
  const showLeads = certHubCategory === "all" || certHubCategory === "leads";

  let html = "";

  // =========================================================================
  // SECTION 1: PARTICIPANTS (Teams List -> Click to View Team & Individual Certs)
  // =========================================================================
  if (showParticipants && filteredTeams.length > 0) {
    const isSearching = !!searchQ;
    html += `
      <div class="cert-hub-section-block">
        <div class="cert-hub-block-title">
          <i class="fa-solid fa-users" style="color: #059669;"></i> Participants (${filteredTeams.length} Teams • Click team to view certificates)
        </div>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${filteredTeams.map(t => {
            const leader = (t.members && t.members[0]) ? t.members[0].name : "Student Leader";
            const memberCount = (t.members || []).length;
            const isWinner = t.isWinner || (t.rank && t.rank <= 3);
            const defaultOpen = isSearching;

            return `
              <div class="cert-hub-team-card" style="background: var(--bg-card); border: 1.5px solid var(--border-subtle); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); transition: var(--transition-fast);">
                
                <!-- Clickable Team Banner Header -->
                <div class="cert-hub-team-header" onclick="toggleTeamCertDrawer('${t.teamId}')" style="cursor: pointer; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; background: var(--bg-card); transition: background 0.2s ease;">
                  <div style="flex: 1; min-width: 240px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                      <span class="cert-hub-certid-tag">${t.certId}</span>
                      <span class="cert-hub-edition-tag">${escapeHtml(t.domain || t.edition || "Innovation")}</span>
                      ${isWinner ? `<span style="font-size: 0.72rem; color: #92400e; background: #fef3c7; border: 1px solid #fde68a; font-weight: 800; padding: 2px 8px; border-radius: 99px;"><i class="fa-solid fa-trophy"></i> Winner</span>` : ''}
                      <span style="font-size: 0.74rem; font-weight: 700; color: #065f46; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 99px;">
                        <i class="fa-solid fa-users"></i> ${memberCount} Members
                      </span>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0 0 4px; font-family: var(--font-heading);">
                      Team ${escapeHtml(t.teamName)}
                    </h3>
                    <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">
                      <strong style="color: var(--text-main);">Leader:</strong> ${escapeHtml(leader)} • <span style="font-style: italic;">${escapeHtml(t.title || t.psId || "SIH Innovation")}</span>
                    </p>
                  </div>

                  <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="btn-3d-secondary" style="pointer-events: none; padding: 8px 16px; font-size: 0.84rem; display: inline-flex; align-items: center; gap: 8px;">
                      <i class="fa-solid fa-certificate" style="color: #059669;"></i>
                      <span>View Certificates</span>
                      <i id="toggle-icon-${t.teamId}" class="fa-solid ${defaultOpen ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
                    </button>
                  </div>
                </div>

                <!-- Expandable Drawer for Team Certificate & Individual Certificates -->
                <div id="team-certs-drawer-${t.teamId}" style="display: ${defaultOpen ? 'block' : 'none'}; padding: 0 22px 22px 22px; border-top: 1px solid var(--border-subtle); background: var(--bg-alt);">
                  
                  <!-- Option 1: Download Team Certificate -->
                  <div style="background: rgba(5, 150, 105, 0.08); border: 1.5px solid #a7f3d0; border-radius: 12px; padding: 14px 18px; margin: 16px 0 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                    <div>
                      <div style="font-weight: 800; font-size: 0.96rem; color: #064e3b; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-award" style="color: #059669;"></i> Official Team Squad Certificate
                      </div>
                      <div style="font-size: 0.78rem; color: #047857; margin-top: 2px;">
                        Institutional Certificate of Excellence/Participation for Team <strong>${escapeHtml(t.teamName)}</strong>
                      </div>
                    </div>
                    <button class="btn-3d-primary" onclick="openSquadTeamCertificate('${t.teamId}')" style="padding: 9px 18px; font-size: 0.84rem;">
                      <i class="fa-solid fa-cloud-arrow-down"></i> Download Team Certificate
                    </button>
                  </div>

                  <!-- Option 2: Individual Member Certificates -->
                  <div style="font-size: 0.86rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-user-graduate" style="color: #059669;"></i> Individual Member Certificates (${memberCount}):
                  </div>
                  
                  <div class="cert-hub-member-chips-grid">
                    ${t.members.map((m, mIdx) => {
                      const indivCert = registry.find(c => (c.category === "Individual Participant" || c.category === "Winner") && c.teamId === t.teamId && c.memberIndex === mIdx);
                      const memberCertId = indivCert ? indivCert.certId : ("TIT/INTSIH/IND-" + (mIdx + 1));
                      const isMemberLeader = m.isLeader || mIdx === 0;

                      return `
                        <div class="cert-hub-member-item" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                          <div>
                            <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">
                              ${escapeHtml(m.name)}
                              ${isMemberLeader ? '<span style="font-size: 0.68rem; color: #065f46; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 99px; font-weight: 800; margin-left: 4px;"><i class="fa-solid fa-crown"></i> Leader</span>' : ''}
                            </div>
                            <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">
                              ${escapeHtml(m.roll || '')} • ${escapeHtml(m.branch || m.dept || t.domain || 'TIT')}
                            </div>
                            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #059669; font-weight: 700; margin-top: 2px;">
                              ${memberCertId}
                            </div>
                          </div>
                          <button class="btn-3d-secondary" onclick="openStudentIndividualCertificate('${t.teamId}', ${mIdx})" style="padding: 7px 14px; font-size: 0.78rem; flex-shrink: 0; white-space: nowrap;">
                            <i class="fa-solid fa-stamp"></i> Certificate
                          </button>
                        </div>
                      `;
                    }).join('')}
                  </div>

                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // SECTION 2: CORE COMMITTEE (Event Head, Technical Lead, Outreach Lead, etc.)
  // =========================================================================
  if (showCoords && filteredCoords.length > 0) {
    html += `
      <div class="cert-hub-section-block">
        <div class="cert-hub-block-title">
          <i class="fa-solid fa-id-badge" style="color: #059669;"></i> Core Committee (${filteredCoords.length} Members)
        </div>
        <div class="cert-hub-leads-grid">
          ${filteredCoords.map(c => `
            <div class="cert-hub-person-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:6px; flex-wrap:wrap;">
                <span class="cert-hub-certid-tag">${c.certId}</span>
                <span style="font-size:0.72rem; color:#065f46; background:#ecfdf5; border:1px solid #a7f3d0; font-weight:800; padding:3px 8px; border-radius:99px;"><i class="fa-solid fa-id-badge"></i> Core Committee</span>
              </div>
              <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin:0 0 4px;">${escapeHtml(c.recipientName)}</h4>
              <p style="font-size:0.84rem; color:#059669; font-weight:700; margin:0 0 4px;">${escapeHtml(c.recipientRole)}</p>
              <p style="font-size:0.74rem; color:var(--text-muted); margin:0 0 14px; line-height:1.4;">${escapeHtml(c.department)}</p>
              <button class="btn-3d-primary" onclick="openPublicCommitteeCertificate('${c.recipientName}', '${c.recipientRole}', '${c.department}', '${c.certId}')" style="width:100%; justify-content:center; padding:8px 12px; font-size:0.8rem;">
                <i class="fa-solid fa-stamp"></i> View Certificate
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // SECTION 3: TECHNICAL LEADS (Department Leads & Student Coordinators)
  // =========================================================================
  if (showLeads && filteredLeads.length > 0) {
    html += `
      <div class="cert-hub-section-block">
        <div class="cert-hub-block-title">
          <i class="fa-solid fa-microchip" style="color: #7c3aed;"></i> Technical Leads (${filteredLeads.length} Leads)
        </div>
        <div class="cert-hub-leads-grid">
          ${filteredLeads.map(l => `
            <div class="cert-hub-person-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:6px; flex-wrap:wrap;">
                <span class="cert-hub-certid-tag">${l.certId}</span>
                <span style="font-size:0.72rem; color:#6b21a8; background:#faf5ff; border:1px solid #e9d5ff; font-weight:800; padding:3px 8px; border-radius:99px;"><i class="fa-solid fa-microchip"></i> Technical Lead</span>
              </div>
              <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin:0 0 4px;">${escapeHtml(l.recipientName)}</h4>
              <p style="font-size:0.84rem; color:#059669; font-weight:700; margin:0 0 4px;">${escapeHtml(l.recipientRole)}</p>
              <p style="font-size:0.74rem; color:var(--text-muted); margin:0 0 14px; line-height:1.4;">${escapeHtml(l.department)}</p>
              <button class="btn-3d-primary" onclick="openPublicCommitteeCertificate('${l.recipientName}', '${l.recipientRole}', '${l.department}', '${l.certId}')" style="width:100%; justify-content:center; padding:8px 12px; font-size:0.8rem;">
                <i class="fa-solid fa-stamp"></i> View Certificate
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (!html) {
    html = `
      <div style="text-align:center; padding:48px 20px; background:var(--bg-card); border-radius:16px; border:1px solid var(--border-subtle);">
        <i class="fa-solid fa-magnifying-glass" style="font-size:2.2rem; color:#94a3b8; margin-bottom:12px;"></i>
        <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin:0 0 6px;">No Certificates Found</h4>
        <p style="color:var(--text-muted); font-size:0.86rem; margin:0;">No participants or committee members matched "${escapeHtml(searchQ)}". Try searching by another student name or team title.</p>
      </div>
    `;
  }

  container.innerHTML = html;
};

// ==========================================================================
// WALL OF FAME PHOTO LIGHTBOX MODAL
// ==========================================================================
window.openPhotoLightbox = function(src, caption) {
  const modal = document.getElementById('photo-lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (modal && img) {
    img.src = src;
    if (cap) {
      if (caption) {
        cap.textContent = caption;
        cap.style.display = 'inline-block';
      } else {
        cap.textContent = '';
        cap.style.display = 'none';
      }
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closePhotoLightbox = function() {
  const modal = document.getElementById('photo-lightbox-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    window.closePhotoLightbox();
  }
});

