// Local Database Setup
let database = JSON.parse(localStorage.getItem('gc_db')) || {
    "GC-NIKE-9912": { name: "Air Jordan Retro", brand: "Nike", signature: "hmac_8a92f1b", scanCount: 0 },
    "GC-APPLE-5541": { name: "AirPods Pro v2", brand: "Apple", signature: "hmac_3f71c9e", scanCount: 3 },
    "GC-APPL-1448": { name: "iPhone 15 Pro", brand: "Apple", signature: "hmac_9k21a4f", scanCount: 1 }
};

let auditLogs = JSON.parse(localStorage.getItem('gc_audit')) || [];

// NETFLIX-STYLE INTRO TIMELINE CONTROLLER
// PWA INSTALLATION & INTRO CONTROLLER (Blocking Modal)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

document.addEventListener('DOMContentLoaded', () => {
    const installModal = document.getElementById('pwa-install-modal');
    const installBtn = document.getElementById('pwa-install-btn');
    const continueBtn = document.getElementById('pwa-continue-btn');

    // Function to start Netflix Intro and App execution
    function startAppAndIntro() {
        // Netflix Intro Timeline
        setTimeout(() => {
            const netflixIntro = document.getElementById('netflixIntro');
            if (netflixIntro) {
                netflixIntro.classList.add('fade-out');
            }
        }, 2500);

        // Load initial recent verifications
        renderRecentVerifications();
    }

    // Check if user already clicked an option in this session
    if (sessionStorage.getItem('pwa_dismissed') === 'true') {
        if (installModal) installModal.style.display = 'none';
        startAppAndIntro(); // Start app immediately if already dismissed
    } else {
        if (installModal) installModal.style.display = 'flex';
        // App and Intro will WAIT here until user clicks!
    }

    // Install Button Click Action
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (installModal) installModal.style.display = 'none';
            sessionStorage.setItem('pwa_dismissed', 'true');
            
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            }

            // Now start the intro and app experience!
            startAppAndIntro();
        });
    }

    // Continue with Browser Click Action
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (installModal) installModal.style.display = 'none';
            sessionStorage.setItem('pwa_dismissed', 'true');
            
            // Now start the intro and app experience!
            startAppAndIntro();
        });
    }
});

// Multi-Language Translations Dictionary (English, Hindi, Kannada)
const translations = {
    en: {
        navHome: "Home", navVerify: "Consumer Verification", navAdmin: "Brand Manager", installApp: "Install App",
        homeTitle: "Protect Purchases with GenuineCheck", homeDesc: "Cryptographically signed HMAC verification and anti-cloning scan engine.",
        startVerify: "Verify Product Now", verifyTitle: "Verify Product Authenticity", verifySub: "Scan QR code using camera, upload image, or enter serial number.",
        openCamera: "Scan with Camera", uploadQr: "Upload QR Image", verifyBtn: "Verify", recentVerifications: "Recent Verifications",
        brandTitle: "Brand Management Portal", brandSub: "Register products, generate secure QR seals, and monitor scan analytics.",
        statRegistered: "Total Registered", statScans: "Total Scans", statClones: "Clones Flagged",
        regTitle: "Product Registration & QR Generator", regSub: "Enter details to generate a cryptographically signed secure QR code.",
        lblBrand: "BRAND NAME", lblProduct: "PRODUCT NAME",
        lblDoc: "PROOF OF REGISTRATION DOCUMENT", filePrompt: "Click or Drag Business Certificate File", btnIssueQR: "Verify License & Issue Secure QR",
        qrGeneratedSuccess: "Secure QR Code Generated!", auditLogs: "Security Audit Logs",
        homeImpactBadge: "GLOBAL COUNTERFEIT IMPACT REPORT",
        homeImpactTitle: "Trust Every Scan. Protect Every Purchase.",
        homeImpactDesc: "One platform connecting brands and buyers through product authenticity verification.",
        statLossDesc: "Global economic loss & brand revenue drain projected by OECD & ICC research reports.",
        statRiskDesc: "Consumers unintentionally pay full price for counterfeit goods across e-commerce channels.",
        statTechDesc: "Cryptographic signature security prevents unauthorized QR code cloning and tamper attempts.",
        consumerTagline: "“Before You Buy, Make Sure It's Genuine.”",
        consumerDesc: "Scan the QR code. Check the verification result. Buy with greater confidence.",
        brandTagline: "“Counterfeits Hurt Your Brand. GenuineCheck Helps You Fight Back.”",
        brandDesc: "Register your brand. Secure your products. Strengthen customer trust."
    },
    hi: {
        navHome: "होम", navVerify: "उपभोक्ता जांच", navAdmin: "ब्रांड मैनेजर", installApp: "ऐप इंस्टॉल करें",
        homeTitle: "GenuineCheck के साथ सुरक्षित खरीदारी करें", homeDesc: "HMAC डिजिटल हस्ताक्षर और डुप्लीकेट रोकथाम स्कैन इंजन।",
        startVerify: "अभी उत्पाद जांचें", verifyTitle: "उत्पाद की प्रामाणिकता जांचें", verifySub: "कैमरा से QR स्कैन करें, इमेज अपलोड करें या सीरियल कोड दर्ज करें।",
        openCamera: "कैमरा से स्कैन करें", uploadQr: "QR इमेज अपलोड करें", verifyBtn: "जांचें", recentVerifications: "हाल की जांच",
        brandTitle: "ब्रांड प्रबंधन पोर्टल", brandSub: "उत्पाद पंजीकृत करें, सुरक्षित QR कोड बनाएं और विश्लेषण देखें।",
        statRegistered: "कुल पंजीकृत", statScans: "कुल स्कैन", statClones: "नकली फ्लैग किए गए",
        regTitle: "उत्पाद पंजीकरण और QR जनरेटर", regSub: "डिजिटल हस्ताक्षरित सुरक्षित QR जनरेट करने के लिए विवरण दर्ज करें।",
        lblBrand: "ब्रांड का नाम", lblProduct: "उत्पाद का नाम",
        lblDoc: "पंजीकरण प्रमाण पत्र", filePrompt: "बिजनेस सर्टिफिकेट फाइल पर क्लिक या ड्रैग करें", btnIssueQR: "लाइसेंस जांचें और QR जारी करें",
        qrGeneratedSuccess: "सुरक्षित QR कोड सफलतापूर्वक बन गया!", auditLogs: "सुरक्षा ऑडिट लॉग्स",
        homeImpactBadge: "ग्लोबल काउंटरफीट इम्पैक्ट रिपोर्ट",
        homeImpactTitle: "हर स्कैन पर भरोसा करें। हर खरीद को सुरक्षित रखें।",
        homeImpactDesc: "एक ऐसा प्लेटफ़ॉर्म जो प्रामाणिकता सत्यापन के माध्यम से ब्रांडों और खरीदारों को जोड़ता है।",
        statLossDesc: "OECD और ICC रिसर्च रिपोर्ट द्वारा अनुमानित वैश्विक आर्थिक नुकसान।",
        statRiskDesc: "ई-कॉमर्स चैनलों पर उपभोक्ता अनजाने में नकली सामान के लिए पूरी कीमत चुकाते हैं।",
        statTechDesc: "क्रिप्टोग्राफिक हस्ताक्षर सुरक्षा अनधिकृत क्यूआर कोड क्लोनिंग को रोकती है।",
        consumerTagline: "“खरीदने से पहले, सुनिश्चित करें कि यह असली है।”",
        consumerDesc: "क्यूआर कोड स्कैन करें। सत्यापन परिणाम जांचें। पूरे भरोसे के साथ खरीदारी करें।",
        brandTagline: "“नकली उत्पाद आपके ब्रांड को नुकसान पहुंचाते हैं। GenuineCheck आपको मुकाबला करने में मदद करता है।”",
        brandDesc: "अपने ब्रांड को पंजीकृत करें। अपने उत्पादों को सुरक्षित करें। ग्राहक विश्वास को मजबूत करें।"
    },
    kn: {
        navHome: "ಮುಖಪುಟ", navVerify: "ಗ್ರಾಹಕ ಪರಿಶೀಲನೆ", navAdmin: "ಬ್ರ್ಯಾಂಡ್ ಮ್ಯಾನೇಜರ್", installApp: "ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ",
        homeTitle: "GenuineCheck ನೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಖರೀದಿ ಮಾಡಿ", homeDesc: "HMAC ಡಿಜಿಟಲ್ ಸಹಿ ಮತ್ತು ನಕಲಿ ತಡೆಗಟ್ಟುವಿಕೆ ಸ್ಕ್ಯಾನ್ ಎಂಜಿನ್.",
        startVerify: "ಈಗಲೇ ಉತ್ಪನ್ನ ಪರಿಶೀಲಿಸಿ", verifyTitle: "ಉತ್ಪನ್ನದ ದೃಢೀಕರಣ ಪರಿಶೀಲಿಸಿ", verifySub: "ಕ್ಯಾಮೆರಾ ಬಳಸಿ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.",
        openCamera: "ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", uploadQr: "QR ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", verifyBtn: "ಪರಿಶೀಲಿಸಿ", recentVerifications: "ಇತ್ತೀಚಿನ ಪರಿಶೀಲನೆಗಳು",
        brandTitle: "ಬ್ರ್ಯಾಂಡ್ ನಿರ್ವಹಣೆ ಪೋರ್ಟಲ್", brandSub: "ಉತ್ಪನ್ನಗಳನ್ನು ನೋಂದಾಯಿಸಿ, ಸುರಕ್ಷಿತ QR ಜನರೇಟ್ ಮಾಡಿ.",
        statRegistered: "ಒಟ್ಟು ನೋಂದಾಯಿತ", statScans: "ಒಟ್ಟು ಸ್ಕ್ಯಾನ್‌ಗಳು", statClones: "ನಕಲಿ ಗುರುತಿಸಲಾಗಿದೆ",
        regTitle: "ಉತ್ಪನ್ನ ನೋಂದಣಿ ಮತ್ತು QR ಜನರೇಟರ್", regSub: "ಡಿಜಿಟಲ್ ಸಹಿ ಮಾಡಿದ QR ಪಡೆಯಲು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
        lblBrand: "ಬ್ರ್ಯಾಂಡ್ ಹೆಸರು", lblProduct: "ಉತ್ಪನ್ನದ ಹೆಸರು",
        lblDoc: "ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ", filePrompt: "ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ", btnIssueQR: "ಪರಿಶೀಲಿಸಿ & QR ನೀಡಿ",
        qrGeneratedSuccess: "ಸುರಕ್ಷಿತ QR ಕೋಡ್ ಸಿದ್ಧವಾಗಿದೆ!", auditLogs: "ಭದ್ರತಾ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
        homeImpactBadge: "ಜಾಗತಿಕ ನಕಲಿ ಉತ್ಪನ್ನಗಳ ಪರಿಣಾಮ ವರದಿ",
        homeImpactTitle: "ಪ್ರತಿ ಸ್ಕ್ಯಾನ್ ಅನ್ನು ನಂಬಿ. ಪ್ರತಿ ಖರೀದಿಯನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಿ.",
        homeImpactDesc: "ಉತ್ಪನ್ನದ ಅಧಿಕೃತತೆಯ ಪರಿಶೀಲನೆಯ ಮೂಲಕ ಬ್ರ್ಯಾಂಡ್‌ಗಳು ಮತ್ತು ಗ್ರಾಹಕರನ್ನು ಸಂಪರ್ಕಿಸುವ ಒಂದು ವೇದಿಕೆ.",
        statLossDesc: "OECD ಮತ್ತು ICC ಸಂಶೋಧನಾ ವರದಿಗಳಿಂದ ಅಂದಾಜಿಸಲಾದ ಜಾಗತಿಕ ಆರ್ಥಿಕ ನಷ್ಟ.",
        statRiskDesc: "ಇ-ಕಾಮರ್ಸ್ ಚಾನೆಲ್‌ಗಳಲ್ಲಿ ಗ್ರಾಹಕರು ನಕಲಿ ಸರಕುಗಳಿಗೆ ಪೂರ್ಣ ಬೆಲೆಯನ್ನು ಪಾವತಿಸುತ್ತಾರೆ.",
        statTechDesc: "ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಸಿಗ್ನೇಚರ್ ಭದ್ರತೆಯು ಅನಧಿಕೃತ QR ಕೋಡ್ ಕ್ಲೋನಿಂಗ್ ಅನ್ನು ತಡೆಯುತ್ತದೆ.",
        consumerTagline: "“ಖರೀದಿಸುವ ಮೊದಲು, ಅದು ಅಸಲಿ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.”",
        consumerDesc: "QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ. ಪರಿಶೀಲನಾ ಫಲಿತಾಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ. ಹೆಚ್ಚಿನ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಖರೀದಿಸಿ.",
        brandTagline: "“ನಕಲಿ ಉತ್ಪನ್ನಗಳು ನಿಮ್ಮ ಬ್ರ್ಯಾಂಡ್‌ಗೆ ಹಾನಿ ಮಾಡುತ್ತವೆ. GenuineCheck ಹೋರಾಡಲು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.”",
        brandDesc: "ನಿಮ್ಮ ಬ್ರ್ಯಾಂಡ್ ಅನ್ನು ನೋಂದಾಯಿಸಿ. ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಿ."
    }
};

let currentLang = 'en';

const themeToggleBtn = document.getElementById('themeToggleBtn');
const langSelect = document.getElementById('langSelect');

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.innerHTML = document.body.classList.contains('light-theme') ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    });
}

if (langSelect) {
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        applyLanguage(currentLang);
    });
}

function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// TAB SWITCHING LOGIC
const homeSection = document.getElementById('homeSection');
const verifySection = document.getElementById('verifySection');
const adminSection = document.getElementById('adminSection');
const tabLoaderOverlay = document.getElementById('tabLoaderOverlay');

function switchTab(targetId) {
    if (tabLoaderOverlay) tabLoaderOverlay.classList.remove('hidden');

    setTimeout(() => {
        [homeSection, verifySection, adminSection].forEach(s => {
            if(s) {
                s.classList.add('hidden');
                s.classList.remove('tab-animate');
            }
        });

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            activeSection.classList.remove('hidden');
            activeSection.classList.add('tab-animate');
        }

        if (targetId === 'homeSection' && document.getElementById('navHomeBtn')) document.getElementById('navHomeBtn').classList.add('active');
        if (targetId === 'verifySection' && document.getElementById('navVerifyBtn')) document.getElementById('navVerifyBtn').classList.add('active');
        if (targetId === 'adminSection') {
            if(document.getElementById('navAdminBtn')) document.getElementById('navAdminBtn').classList.add('active');
            updateAnalytics();
        }

        if (tabLoaderOverlay) tabLoaderOverlay.classList.add('hidden');
    }, 300);
}

if (document.getElementById('navHomeBtn')) document.getElementById('navHomeBtn').addEventListener('click', () => switchTab('homeSection'));
if (document.getElementById('navVerifyBtn')) document.getElementById('navVerifyBtn').addEventListener('click', () => switchTab('verifySection'));
if (document.getElementById('navAdminBtn')) document.getElementById('navAdminBtn').addEventListener('click', () => switchTab('adminSection'));

// ==========================================
// FIXED VERIFICATION & RECENT LIST LOGIC
// ==========================================

const serialInput = document.getElementById('serialInput');
const verifyBtn = document.getElementById('verifyBtn');
const resultCard = document.getElementById('resultCard');

if (verifyBtn) {
    verifyBtn.addEventListener('click', () => verifyToken(serialInput.value.trim()));
}

function verifyToken(code) {
    if (!code) return alert("Please enter or scan a product code!");

    let product = database[code];
    let recordStatus = "";

    if (!product) {
        // INVALID PRODUCT
        renderVerdict("fake", "INVALID PRODUCT TOKEN!", `Code <b>${code}</b> is not registered or failed signature check.`, code);
        logAudit(code, "Unregistered", "FAILED (FAKE)");
        
        saveToRecentVerifications({
            token: code,
            name: "Unregistered Token",
            brand: "Unknown Brand",
            status: "INVALID"
        });
        return;
    }

    // UPDATE SCAN COUNT
    product.scanCount += 1;
    saveDatabase();

    // CONSUMER ALWAYS GETS VERIFIED (VALID) STATUS
    renderVerdict("genuine", "AUTHENTIC PRODUCT VERIFIED", `Verified by ${product.brand} Engine. Total Scans Verified: <b>${product.scanCount}</b>`, code, product);
    logAudit(code, product.brand, `AUTHENTIC (Scan #${product.scanCount})`);

    // SAVE TO RECENT VERIFICATION HISTORY
    saveToRecentVerifications({
        token: code,
        name: product.name || "Genuine Product",
        brand: product.brand || "Verified Brand",
        status: "GENUINE"
    });
}

function renderVerdict(status, title, message, code, prod = {}) {
    if (!resultCard) return;
    resultCard.classList.remove('hidden', 'genuine', 'fake');
    resultCard.classList.add(status);
    resultCard.innerHTML = `
        <h3><i class="fa-solid ${status === 'genuine' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> ${title}</h3>
        <p style="margin-top: 6px;">${message}</p>
        ${prod.signature ? `<p style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px;">Cryptographic Signature: <code>${prod.signature}</code></p>` : ''}
    `;
}

// SAVE & RENDER RECENT VERIFICATIONS
// SAVE & RENDER RECENT VERIFICATIONS
function saveToRecentVerifications(record) {
    let recentList = JSON.parse(localStorage.getItem('gc_recent_verifications')) || [];
    
    // Remove duplicates to push new scan to top
    recentList = recentList.filter(item => item.token !== record.token);
    
    // Add new scan at top
    recentList.unshift(record);
    
    // Keep top 5 items
    if (recentList.length > 5) recentList.pop();

    localStorage.setItem('gc_recent_verifications', JSON.stringify(recentList));
    renderRecentVerifications();
}

function renderRecentVerifications() {
    // Sahi HTML Element ID 'historyList' ko target kiya gaya hai
    const container = document.getElementById('historyList');

    if (!container) return;

    const recentList = JSON.parse(localStorage.getItem('gc_recent_verifications')) || [];

    if (recentList.length === 0) {
        container.innerHTML = `<li class="empty-msg">No products verified yet.</li>`;
        return;
    }

    container.innerHTML = recentList.map(item => `
        <li class="recent-item ${item.status.toLowerCase()}" style="
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 12px 16px; 
            margin-bottom: 8px; 
            background: rgba(255, 255, 255, 0.05); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            border-radius: 8px;
            list-style: none;
        ">
            <div>
                <strong style="display: block; font-size: 0.95rem; color: #fff;">${item.name}</strong>
                <span style="font-size: 0.8rem; opacity: 0.7; color: #94a3b8;">${item.brand} | Code: <code>${item.token}</code></span>
            </div>
            <span style="
                padding: 4px 10px; 
                border-radius: 20px; 
                font-size: 0.75rem; 
                font-weight: bold;
                background: ${item.status === 'GENUINE' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
                color: ${item.status === 'GENUINE' ? '#4ade80' : '#f87171'};
                border: 1px solid ${item.status === 'GENUINE' ? '#22c55e' : '#ef4444'};
            ">
                ${item.status}
            </span>
        </li>
    `).join('');
}

// CAMERA SCANNER LOGIC
const startCamBtn = document.getElementById('startCamBtn');
const cameraScannerContainer = document.getElementById('cameraScannerContainer');
const videoPreview = document.getElementById('videoPreview');
const closeCameraBtn = document.getElementById('closeCameraBtn');
let videoStream = null;
let animationFrameId = null;

if (startCamBtn) {
    startCamBtn.addEventListener('click', async () => {
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            videoPreview.srcObject = videoStream;
            videoPreview.setAttribute("playsinline", true);
            videoPreview.play();
            if(cameraScannerContainer) cameraScannerContainer.classList.remove('hidden');
            animationFrameId = requestAnimationFrame(scanVideoFrame);
        } catch (err) {
            alert("Unable to access camera. Please check permissions or upload an image instead.");
        }
    });
}

if (closeCameraBtn) closeCameraBtn.addEventListener('click', stopCamera);

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if(cameraScannerContainer) cameraScannerContainer.classList.add('hidden');
}

function scanVideoFrame() {
    if (videoPreview && videoPreview.readyState === videoPreview.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement("canvas");
        canvas.width = videoPreview.videoWidth;
        canvas.height = videoPreview.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        if (typeof jsQR !== 'undefined') {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                stopCamera();
                if(serialInput) serialInput.value = code.data;
                verifyToken(code.data);
                return;
            }
        }
    }
    animationFrameId = requestAnimationFrame(scanVideoFrame);
}

// FILE UPLOAD READERS
const regFileInput = document.getElementById('regFile');
const fileNameDisplay = document.getElementById('fileNameDisplay');
if (regFileInput) {
    regFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
        } else {
            fileNameDisplay.textContent = "No file chosen";
        }
    });
}

const qrImageInput = document.getElementById('qrImageInput');
if (qrImageInput) {
    qrImageInput.addEventListener('change', (e) => {
        if (e.target.files.length === 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                if (typeof jsQR !== 'undefined') {
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        if(serialInput) serialInput.value = code.data;
                        verifyToken(code.data);
                    } else {
                        alert("No valid QR code detected in the uploaded image!");
                    }
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// BRAND MANAGER QR GENERATOR LOGIC
let currentGeneratedCode = "";
const registerProdBtn = document.getElementById('registerProdBtn');

if (registerProdBtn) {
    registerProdBtn.addEventListener('click', () => {
        const brand = document.getElementById('regBrand').value.trim();
        const name = document.getElementById('regProdName').value.trim();

        if (!brand || !name) return alert("Please enter Brand Name and Product Name!");

        currentGeneratedCode = `GC-${brand.toUpperCase().slice(0,4)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const mockHmac = 'hmac_' + Math.random().toString(36).substring(2, 9);

        database[currentGeneratedCode] = { name, brand, license: "AUTO-VERIFIED", signature: mockHmac, scanCount: 0 };
        saveDatabase();
        updateAnalytics();

        const qrContainer = document.getElementById('qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = "";
            if (typeof QRCode !== 'undefined') {
                new QRCode(qrContainer, {
                    text: currentGeneratedCode,
                    width: 180,
                    height: 180
                });
            }
        }

        if(document.getElementById('qrSignatureText')) {
            document.getElementById('qrSignatureText').innerText = `HMAC Seal: ${mockHmac} | Code: ${currentGeneratedCode}`;
        }
        if(document.getElementById('qrResultContainer')) {
            document.getElementById('qrResultContainer').classList.remove('hidden');
        }

        document.getElementById('regBrand').value = '';
        document.getElementById('regProdName').value = '';
        if(fileNameDisplay) fileNameDisplay.textContent = "No file chosen";
    });
}

// DOWNLOAD HANDLERS
if (document.getElementById('downloadImageBtn')) {
    document.getElementById('downloadImageBtn').addEventListener('click', () => {
        const qrImg = document.querySelector('#qrcode img');
        if (!qrImg) return alert("QR Code not generated yet!");

        const link = document.createElement('a');
        link.href = qrImg.src;
        link.download = `GenuineCheck_QR_${currentGeneratedCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

if (document.getElementById('downloadPdfBtn')) {
    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        const printArea = document.getElementById('qrPrintArea');
        if (!printArea) return;

        const opt = {
            margin:       10,
            filename:     `GenuineCheck_Label_${currentGeneratedCode}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a6', orientation: 'portrait' }
        };

        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(printArea).save();
        }
    });
}

// HELPERS & ANALYTICS
function saveDatabase() { localStorage.setItem('gc_db', JSON.stringify(database)); }

function logAudit(code, brand, result) {
    auditLogs.unshift({ code, brand, result, time: new Date().toLocaleTimeString() });
    localStorage.setItem('gc_audit', JSON.stringify(auditLogs));
    updateAnalytics();
}

function updateAnalytics() {
    if(document.getElementById('statRegistered')) {
        document.getElementById('statRegistered').innerText = Object.keys(database).length;
    }
    let totalScans = 0, clones = 0;
    Object.values(database).forEach(p => {
        totalScans += p.scanCount;
        if (p.scanCount > 3) clones++;
    });
    if(document.getElementById('statScans')) {
        document.getElementById('statScans').innerText = totalScans;
    }
    if(document.getElementById('statClones')) {
        document.getElementById('statClones').innerText = clones;
    }
}

// PWA INSTALLATION POPUP CONTROLLER
// CLEAN PWA CONTROLLER (NO ALERT)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

document.addEventListener('DOMContentLoaded', () => {
    const installModal = document.getElementById('pwa-install-modal');
    const installBtn = document.getElementById('pwa-install-btn');
    const continueBtn = document.getElementById('pwa-continue-btn');

    // Dismiss check
    if (sessionStorage.getItem('pwa_dismissed') === 'true') {
        if (installModal) installModal.style.display = 'none';
    } else {
        if (installModal) installModal.style.display = 'flex';
    }

    // Install Button Click Action
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (installModal) installModal.style.display = 'none';
            
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            }
        });
    }

    // Continue with Browser Click Action
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (installModal) installModal.style.display = 'none';
            sessionStorage.setItem('pwa_dismissed', 'true');
        });
    }
});
