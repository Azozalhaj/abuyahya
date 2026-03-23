// ━━━━━━━━━━━━━━━━━━━━ FIREBASE IMPORTS ━━━━━━━━━━━━━━━━━━━━
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, addDoc,
  orderBy, limit, serverTimestamp, Timestamp,
  onSnapshot, runTransaction, increment
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const LOGO_URI = "data:image/jpeg;base64,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";

// ━━━━━━━━━━━━━━━━━━━━ CONFIG ━━━━━━━━━━━━━━━━━━━━
const firebaseConfig = {
  apiKey: "AIzaSyD09NScw5j8M1hgqwSRyxlyYg6nmepwDbg",
  authDomain: "abuyahyh.firebaseapp.com",
  projectId: "abuyahyh",
  storageBucket: "abuyahyh.firebasestorage.app",
  messagingSenderId: "407316224957",
  appId: "1:407316224957:web:01ad0e123a48623e4150d4",
  measurementId: "G-0ERS518ERD"
};

const EMAILJS_PUBLIC_KEY    = "DJHdez73CWCvMq9gH";
const EMAILJS_SERVICE_ID    = "service_3thehes";
const EMAILJS_TMPL_WASH     = "template_26yqltv";
const EMAILJS_TMPL_WELCOME  = "template_welcome";
const EMAILJS_TMPL_REJECTED = "template_rejected";

// ━━━━━━━━━━━━━━━━━━━━ INIT ━━━━━━━━━━━━━━━━━━━━
const fbApp = initializeApp(firebaseConfig);
const auth  = getAuth(fbApp);
const db    = getFirestore(fbApp);
if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

// ━━━━━━━━━━━━━━━━━━━━ STATE ━━━━━━━━━━━━━━━━━━━━
let currentUser     = null;
let currentUserData = null;

// ── Real-time listener cleanup ──
const _unsubs = [];
function clearListeners() {
  _unsubs.forEach(fn => { try { fn(); } catch(_){} });
  _unsubs.length = 0;
}

// ━━━━━━━━━━━━━━━━━━━━ UTILS ━━━━━━━━━━━━━━━━━━━━

function toast(msg, type = 'info', duration = 4000) {
  const icons = { success:'✓', error:'✕', info:'★', warning:'⚠' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove());
  }, duration);
}

function fmtDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('ar-SA', { weekday:'short', year:'numeric', month:'long', day:'numeric' });
}

function fmtDateTime(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('ar-SA', { weekday:'short', year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

async function sendEmail(templateId, params) {
  try {
    if (typeof emailjs === 'undefined') return;
    await emailjs.send(EMAILJS_SERVICE_ID, templateId, params);
  } catch(e) { console.warn('EmailJS:', e); }
}

async function logAction({ action, clientId='', clientName='', details='' }) {
  try {
    await addDoc(collection(db,'logs'), {
      timestamp:  serverTimestamp(),
      action, clientId, clientName, details,
      adminId:   currentUser.uid,
      adminName: currentUserData.name,
    });
  } catch(e) { console.warn('Log failed:', e); }
}

// ━━━━━━━━━━━━━━━━━━━━ MODAL ━━━━━━━━━━━━━━━━━━━━
function openModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ━━━━━━━━━━━━━━━━━━━━ ROUTER ━━━━━━━━━━━━━━━━━━━━
function route(role) {
  if (role === 'client') return renderClientView();
  if (role === 'admin')  return renderAdminView();
  if (role === 'owner')  return renderOwnerView();
  renderLandingPage();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//              LANDING PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderLandingPage() {
  clearListeners();
  document.getElementById('app').innerHTML = `
    <div class="landing-view view">
      <nav class="land-nav">
        <div class="nav-logo"><img src="${LOGO_URI}" alt="كلين فوم" class="logo-img" style="height:36px"/></div>
        <div style="display:flex;align-items:center;gap:12px;">
          <a href="#features" class="land-nav-link">المميزات</a>
          <a href="#how" class="land-nav-link">كيف يعمل</a>
          <button class="theme-toggle" onclick="toggleTheme()" title="تبديل المظهر" id="landThemeBtn">🌙</button>
          <button class="btn btn-ghost btn-sm" onclick="goToLogin()">تسجيل الدخول</button>
          <button class="btn btn-gold btn-sm"  onclick="goToRegister()">ابدأ الآن ←</button>
        </div>
      </nav>

      <section class="hero-section">
        <div class="hero-badge"><span class="hero-badge-dot"></span>الحل الأذكى لإدارة خدمات التنظيف</div>
        <h1 class="hero-title">إدارة اشتراكات<br/><span class="hero-title-gold">غسيل المباني</span><br/>بأسلوب احترافي</h1>
        <p class="hero-desc">منصة سحابية متكاملة تمنحك تحكماً كاملاً في اشتراكات عملائك، تتبع الغسلات، إشعارات تلقائية، وسجل شفاف لا يُمسح.</p>
        <div class="hero-btns">
          <button class="btn btn-gold btn-lg" onclick="goToRegister()">سجّل طلبك الآن <span style="font-size:1.1rem">←</span></button>
          <button class="btn btn-ghost btn-lg" onclick="goToLogin()">تسجيل الدخول</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat-pill"><span class="hero-stat-num">+200</span><span class="hero-stat-lbl">عميل نشط</span></div>
          <div class="hero-stat-pill"><span class="hero-stat-num">%99</span><span class="hero-stat-lbl">رضا العملاء</span></div>
          <div class="hero-stat-pill"><span class="hero-stat-num">24/7</span><span class="hero-stat-lbl">إشعارات فورية</span></div>
        </div>
        <div class="hero-card-wrap">
          <div class="hero-mockup-card">
            <div class="hmc-header">
              <div style="display:flex;gap:6px;">
                <div style="width:10px;height:10px;border-radius:50%;background:var(--danger)"></div>
                <div style="width:10px;height:10px;border-radius:50%;background:var(--warning)"></div>
                <div style="width:10px;height:10px;border-radius:50%;background:var(--success)"></div>
              </div>
              <span style="font-size:.78rem;color:var(--text-muted)">لوحة التحكم</span>
            </div>
            <div class="hmc-body">
              <div class="hmc-label">تقدم الباقة</div>
              <div class="hmc-progress-wrap"><div class="hmc-progress-fill" id="hmcFill"></div></div>
              <div style="display:flex;justify-content:space-between;font-size:.75rem;color:var(--text-muted);margin-top:6px;"><span>6 غسلات منجزة</span><span>8 إجمالي</span></div>
              <div class="hmc-rows">
                ${['شركة الفجر','برج النخيل','مجمع الياسمين'].map((n,i)=>`
                  <div class="hmc-row" style="animation-delay:${i*0.12}s">
                    <div class="hmc-dot" style="background:${['var(--success)','var(--teal)','var(--gold)'][i]}"></div>
                    <span>${n}</span>
                    <span class="badge badge-${['success','teal','gold'][i]}" style="font-size:.7rem">${['مكتمل','نشط','نشط'][i]}</span>
                  </div>`).join('')}
              </div>
            </div>
          </div>
          <div class="hero-notif">
            <span style="font-size:1.1rem">🧹</span>
            <div><div style="font-size:.78rem;font-weight:700;color:var(--text)">تم إنجاز غسلة!</div><div style="font-size:.7rem;color:var(--text-muted)">شركة الفجر • الآن</div></div>
          </div>
        </div>
      </section>

      <section class="features-section" id="features">
        <div class="section-label">المميزات</div>
        <h2 class="features-title">كل ما تحتاجه في مكان واحد</h2>
        <div class="features-grid">
          ${[
            {icon:'🧹',title:'تتبع الغسلات',    desc:'سجّل كل غسلة بنقرة واحدة، وتابع تقدم كل عميل بشكل بصري واضح.'},
            {icon:'📱',title:'تواصل واتساب',    desc:'يصلك إشعار واتساب فور اعتماد طلبك أو إنجاز أي غسلة.'},
            {icon:'💰',title:'إحصائيات مالية', desc:'تتبع الإيرادات الشهرية والأسبوعية بتقارير واضحة للمالك.'},
            {icon:'🔢',title:'ترقيم تلقائي',   desc:'كل عميل يُعتمد يحصل على رقم تسلسلي فريد يسهّل المتابعة.'},
            {icon:'🔒',title:'سجل لا يُمسح',  desc:'كل إجراء يُوثَّق تلقائياً في سجل رقابي محمي لصاحب المنشأة.'},
            {icon:'⚡',title:'تحديث فوري',     desc:'كل تغيير يظهر لحظياً بدون إعادة تحميل الصفحة.'},
          ].map(f=>`
            <div class="feature-card">
              <div class="feature-icon">${f.icon}</div>
              <div class="feature-title">${f.title}</div>
              <div class="feature-desc">${f.desc}</div>
            </div>`).join('')}
        </div>
      </section>

      <section class="how-section" id="how">
        <div class="section-label">كيف يعمل</div>
        <h2 class="features-title">ثلاث خطوات فقط</h2>
        <div class="steps-row">
          <div class="step-card"><div class="step-num">1</div><div class="step-icon">✍️</div><div class="step-title">سجّل طلبك</div><div class="step-desc">أنشئ حسابك وأدخل بيانات المبنى، وانتظر اتصال الفريق.</div></div>
          <div class="step-arrow">←</div>
          <div class="step-card"><div class="step-num">2</div><div class="step-icon">📦</div><div class="step-title">احصل على باقتك</div><div class="step-desc">يختار الموظف باقتك وسعرها ويعتمد حسابك.</div></div>
          <div class="step-arrow">←</div>
          <div class="step-card"><div class="step-num">3</div><div class="step-icon">📱</div><div class="step-title">تابع التقدم</div><div class="step-desc">شاهد كل غسلة تُسجَّل لحظياً في لوحتك الخاصة.</div></div>
        </div>
      </section>

      <section class="cta-section">
        <div class="cta-card">
          <h2 class="cta-title">جاهز للبدء؟</h2>
          <p class="cta-desc">سجّل طلبك الآن وسيتواصل معك فريقنا عبر الواتساب</p>
          <button class="btn btn-gold btn-lg" onclick="goToRegister()">سجّل طلبك مجاناً ←</button>
        </div>
      </section>

      <footer class="land-footer">
        <div class="nav-logo" style="margin-bottom:8px"><img src="data:image/png;base64,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" alt="كلين فوم" class="logo-img" style="height:40px"/></div>
        <p style="color:var(--text-dim);font-size:.8rem">منصة إدارة اشتراكات غسيل المباني © 2025</p>
      </footer>
    </div>`;

  setTimeout(() => { const f=document.getElementById('hmcFill'); if(f) f.style.width='75%'; }, 500);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                    AUTH VIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderAuthView() {
  clearListeners();
  const DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const SERVICE_TYPES = ['غسيل واجهات زجاجية','غسيل خزانات','تنظيف مسابح','غسيل أسطح','تنظيف شامل للمبنى','خدمة أخرى'];

  document.getElementById('app').innerHTML = `
    <div class="auth-view view">
      <div class="auth-card" style="max-width:520px">

        <button onclick="renderLandingPage()" class="back-btn">← العودة للرئيسية</button>

        <div class="auth-logo">
          <div class="auth-logo-mark"><img src="data:image/png;base64,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" alt="كلين فوم" class="logo-img" style="height:60px"/></div>
          <div class="auth-logo-tagline">منصة إدارة اشتراكات غسيل المباني</div>
        </div>

        <div class="auth-tabs" id="authTabs">
          <button class="auth-tab active" id="tabLogin" onclick="switchTab('login')">تسجيل الدخول</button>
          <button class="auth-tab"        id="tabReg"   onclick="switchTab('register')">حساب جديد</button>
          <div class="auth-tab-slider on-login" id="tabSlider"></div>
        </div>

        <!-- ═══ LOGIN ═══ -->
        <div class="auth-panel" id="panelLogin">
          <div class="input-group">
            <label class="input-label">البريد الإلكتروني</label>
            <input class="input-field" type="email" id="loginEmail" placeholder="example@email.com" dir="ltr"/>
          </div>
          <div class="input-group" style="position:relative">
            <label class="input-label">كلمة المرور</label>
            <input class="input-field" type="password" id="loginPass" placeholder="••••••••" dir="ltr"/>
          </div>
          <div id="loginError" class="auth-error hidden">⚠ البريد الإلكتروني أو كلمة المرور غير صحيحة</div>
          <button class="btn btn-gold btn-full btn-lg mt-16" id="loginBtn" onclick="handleLogin()">
            <span>دخول</span> <span>←</span>
          </button>
          <div style="text-align:center;margin-top:14px">
            <button onclick="showForgotPassword()" style="background:none;border:none;color:var(--text-muted);font-size:.82rem;font-family:var(--font);cursor:pointer;transition:.2s" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--text-muted)'">
              نسيت كلمة المرور؟
            </button>
          </div>

        </div>

        <!-- ═══ REGISTER ═══ -->
        <div class="auth-panel hidden-panel" id="panelRegister">

          <!-- قسم 1: البيانات الشخصية -->
          <div class="reg-section-title">👤 البيانات الشخصية</div>
          <div class="input-group">
            <label class="input-label">الاسم الكامل</label>
            <input class="input-field" type="text" id="regName" placeholder="محمد أحمد العلي"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="input-group mb-0">
              <label class="input-label">رقم الواتساب</label>
              <input class="input-field" type="tel" id="regPhone" placeholder="05xxxxxxxx" dir="ltr"/>
            </div>
            <div class="input-group mb-0">
              <label class="input-label">البريد الإلكتروني</label>
              <input class="input-field" type="email" id="regEmail" placeholder="example@email.com" dir="ltr"/>
            </div>
          </div>
          <div class="input-group mt-12">
            <label class="input-label">كلمة المرور (8 أحرف على الأقل)</label>
            <input class="input-field" type="password" id="regPass" placeholder="••••••••" dir="ltr"/>
          </div>

          <!-- قسم 2: بيانات المبنى -->
          <div class="reg-section-title" style="margin-top:20px">🏢 بيانات المبنى</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="input-group mb-0">
              <label class="input-label">الحي</label>
              <input class="input-field" type="text" id="regNeighborhood" placeholder="حي النزهة"/>
            </div>
            <div class="input-group mb-0">
              <label class="input-label">الدور / الطابق</label>
              <input class="input-field" type="text" id="regFloor" placeholder="مثال: دور 3، بدروم"/>
            </div>
          </div>
          <div class="input-group mt-12">
            <label class="input-label">رابط الموقع (Google Maps)</label>
            <input class="input-field" type="url" id="regLocation" placeholder="https://maps.google.com/..." dir="ltr"/>
          </div>

          <!-- قسم 3: تفاصيل الخدمة -->
          <div class="reg-section-title" style="margin-top:20px">🧹 تفاصيل الخدمة</div>
          <div class="input-group">
            <label class="input-label">نوع الخدمة</label>
            <select class="input-field" id="regServiceType">
              <option value="">— اختر نوع الخدمة —</option>
              ${SERVICE_TYPES.map(s=>`<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="input-group mb-0">
              <label class="input-label">عدد الأدوار / الوحدات</label>
              <input class="input-field" type="number" id="regFloorCount" placeholder="مثال: 5" min="1"/>
            </div>
            <div class="input-group mb-0">
              <label class="input-label">تاريخ البداية المقترح</label>
              <input class="input-field" type="date" id="regStartDate"/>
            </div>
          </div>
          <div class="input-group mt-12">
            <label class="input-label">أيام الخدمة المفضّلة</label>
            <div class="days-picker" id="daysPicker">
              ${DAYS.map((d,i)=>`
                <button type="button" class="day-btn" data-day="${d}" onclick="toggleDay(this)">${d.slice(0,3)}</button>
              `).join('')}
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">ملاحظات إضافية (اختياري)</label>
            <textarea class="input-field" id="regNotes" rows="2" placeholder="أي تفاصيل إضافية تريد إضافتها..."></textarea>
          </div>

          <button class="btn btn-gold btn-full btn-lg mt-16" id="regBtn" onclick="handleRegister()">
            <span>إرسال الطلب</span> <span>✓</span>
          </button>
          <p style="text-align:center;font-size:.78rem;color:var(--text-dim);margin-top:14px;line-height:1.6;">
            سيتم التواصل معك عبر الواتساب بعد مراجعة طلبك
          </p>
        </div>

      </div>
    </div>`;

  document.getElementById('loginEmail').addEventListener('keydown', e => { if(e.key==='Enter') handleLogin(); });
  document.getElementById('loginPass').addEventListener('keydown',  e => { if(e.key==='Enter') handleLogin(); });
  document.getElementById('regPass').addEventListener('keydown',    e => { if(e.key==='Enter') handleRegister(); });
  ['loginEmail','loginPass'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById('loginError').classList.add('hidden');
      document.getElementById('loginEmail').classList.remove('error');
      document.getElementById('loginPass').classList.remove('error');
    });
  });

  // Set default start date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('regStartDate').value = today;
}

// Days picker toggle
window.toggleDay = function(btn) {
  btn.classList.toggle('active');
};

function getSelectedDays() {
  return Array.from(document.querySelectorAll('.day-btn.active')).map(b => b.dataset.day);
}

window.switchTab = function(tab) {
  const slider = document.getElementById('tabSlider');
  const panelL = document.getElementById('panelLogin');
  const panelR = document.getElementById('panelRegister');
  const tabL   = document.getElementById('tabLogin');
  const tabR   = document.getElementById('tabReg');
  if (tab === 'login') {
    slider.className = 'auth-tab-slider on-login';
    tabL.classList.add('active'); tabR.classList.remove('active');
    panelL.classList.remove('hidden-panel'); panelR.classList.add('hidden-panel');
  } else {
    slider.className = 'auth-tab-slider on-register';
    tabR.classList.add('active'); tabL.classList.remove('active');
    panelR.classList.remove('hidden-panel'); panelL.classList.add('hidden-panel');
  }
};

// ──────────── تسجيل الدخول ────────────
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  document.getElementById('loginError').classList.add('hidden');
  document.getElementById('loginEmail').classList.remove('error');
  document.getElementById('loginPass').classList.remove('error');

  if (!email || !pass) { toast('يرجى ملء البريد وكلمة المرور','warning'); return; }

  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="pulse">جارٍ التحقق...</span>';

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch(err) {
    const errEl = document.getElementById('loginError');
    if (['auth/user-not-found','auth/wrong-password','auth/invalid-credential','auth/invalid-email','auth/user-disabled'].includes(err.code)) {
      errEl.textContent = '⚠ البريد الإلكتروني أو كلمة المرور غير صحيحة';
    } else if (err.code === 'auth/too-many-requests') {
      errEl.textContent = '⚠ محاولات كثيرة، يرجى الانتظار قليلاً';
    } else {
      errEl.textContent = '⚠ حدث خطأ، تحقق من اتصالك بالإنترنت';
    }
    errEl.classList.remove('hidden');
    document.getElementById('loginEmail').classList.add('error');
    document.getElementById('loginPass').classList.add('error');
    btn.disabled = false;
    btn.innerHTML = '<span>دخول</span> <span>←</span>';
  }
}

// ──────────── إنشاء حساب جديد ────────────
async function handleRegister() {
  const name         = document.getElementById('regName').value.trim();
  const phone        = document.getElementById('regPhone').value.trim();
  const email        = document.getElementById('regEmail').value.trim();
  const pass         = document.getElementById('regPass').value;
  const neighborhood = document.getElementById('regNeighborhood').value.trim();
  const floor        = document.getElementById('regFloor').value.trim();
  const location     = document.getElementById('regLocation').value.trim();
  const serviceType  = document.getElementById('regServiceType').value;
  const floorCount   = document.getElementById('regFloorCount').value.trim();
  const startDate    = document.getElementById('regStartDate').value;
  const notes        = document.getElementById('regNotes').value.trim();
  const visitDays    = getSelectedDays();

  if (!name || !phone || !email || !pass) { toast('يرجى ملء البيانات الشخصية الأساسية','warning'); return; }
  if (pass.length < 8) { toast('كلمة المرور يجب أن تكون 8 أحرف على الأقل','warning'); return; }
  if (!/^05\d{8}$/.test(phone)) { toast('رقم الواتساب غير صحيح (05xxxxxxxx)','warning'); return; }
  if (!serviceType) { toast('يرجى اختيار نوع الخدمة','warning'); return; }
  if (visitDays.length === 0) { toast('يرجى اختيار يوم خدمة واحد على الأقل','warning'); return; }

  const btn = document.getElementById('regBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="pulse">جارٍ إرسال الطلب...</span>';

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, 'users', cred.user.uid), {
      name, phone, email,
      neighborhood, floor, location,
      serviceType, floorCount, startDate,
      visitDays, notes,
      role:        'client',
      status:      'pending',
      package:     0,
      washesUsed:  0,
      washHistory: [],
      price:       0,
      clientNumber: 0,
      createdAt:   serverTimestamp(),
      approvedAt:  null,
    });
    showSuccessScreen(name, phone);
  } catch(err) {
    const msgs = {
      'auth/email-already-in-use': 'هذا البريد الإلكتروني مسجل مسبقاً',
      'auth/invalid-email':        'البريد الإلكتروني غير صالح',
      'auth/weak-password':        'كلمة المرور ضعيفة جداً'
    };
    toast(msgs[err.code] || 'خطأ في التسجيل، حاول مجدداً','error');
    btn.disabled = false;
    btn.innerHTML = '<span>إرسال الطلب</span> <span>✓</span>';
  }
}

function showSuccessScreen(name, phone) {
  document.getElementById('app').innerHTML = `
    <div class="auth-view view">
      <div class="auth-card" style="text-align:center;max-width:460px;">
        <div style="font-size:4rem;margin-bottom:16px;animation:pendingSpin 4s linear infinite">✅</div>
        <h2 style="font-size:1.5rem;font-weight:900;color:var(--text);margin-bottom:12px;">وصل طلبك بنجاح! 🎉</h2>
        <p style="color:var(--text-muted);font-size:.95rem;line-height:1.8;margin-bottom:28px;">
          شكراً <strong style="color:var(--gold)">${name}</strong>،<br/>
          سيتواصل معك فريقنا قريباً على واتساب لتأكيد الاشتراك وتحديد السعر.
        </p>
        <div style="background:var(--success-dim);border:1px solid var(--success-border);border-radius:var(--radius-sm);padding:18px 22px;margin-bottom:24px;display:flex;align-items:center;gap:14px;">
          <span style="font-size:1.8rem">📱</span>
          <div style="text-align:right;">
            <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">رقم الواتساب المسجل</div>
            <div style="font-size:1.1rem;font-weight:800;color:var(--success);font-family:var(--font-num)" dir="ltr">${phone}</div>
          </div>
        </div>
        <div style="background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:var(--radius-sm);padding:14px 20px;margin-bottom:24px;font-size:.85rem;color:var(--gold);line-height:1.6;">
          ⏰ سيتم معالجة طلبك خلال ساعات قليلة.
        </div>
        <div style="display:flex;gap:10px;flex-direction:column;">
          <button class="btn btn-gold btn-full" onclick="goToLogin()">تسجيل الدخول ←</button>
          <button class="btn btn-ghost btn-full" onclick="renderLandingPage()">العودة للرئيسية</button>
        </div>
      </div>
    </div>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//           CLIENT VIEW  (onSnapshot)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderClientView() {
  clearListeners();
  document.getElementById('app').innerHTML = `
    <div class="client-view view">
      ${navBar(currentUserData)}
      <div id="clientBody"></div>
    </div>`;

  const userRef = doc(db, 'users', currentUser.uid);
  const unsub = onSnapshot(userRef, snap => {
    if (!snap.exists()) return;
    currentUserData = snap.data();
    if (currentUserData.status === 'pending') renderPendingState(currentUserData);
    else renderActiveState(currentUserData);
  }, err => console.warn('Client snapshot:', err));
  _unsubs.push(unsub);
}

function renderPendingState(ud) {
  let hoursLeft = 72;
  if (ud.createdAt) {
    const c = ud.createdAt.toDate ? ud.createdAt.toDate() : new Date();
    hoursLeft = Math.max(0, Math.ceil(72 - (Date.now() - c.getTime()) / 3600000));
  }

  document.getElementById('clientBody').innerHTML = `
    <div class="pending-view">
      <div class="pending-card">
        <div class="pending-icon">⏳</div>
        <div class="pending-title">طلبك قيد المراجعة</div>
        <p class="pending-desc">
          شكراً لتسجيلك في <strong style="color:var(--gold)">كلين فوم</strong>!<br/>
          سيتواصل معك فريقنا على الواتساب قريباً لتأكيد الاشتراك وتحديد السعر.
        </p>
        <div style="background:var(--success-dim);border:1px solid var(--success-border);border-radius:var(--radius-sm);padding:16px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.4rem">📱</span>
          <div>
            <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:3px;">سنتواصل معك على الواتساب</div>
            <div style="font-size:1rem;font-weight:800;color:var(--success);font-family:var(--font-num)" dir="ltr">${ud.phone}</div>
          </div>
        </div>
        <div class="pending-countdown">
          <span class="pending-countdown-icon">⏰</span>
          <span class="pending-countdown-text">متبقي على انتهاء صلاحية الطلب: <strong>${hoursLeft} ساعة</strong></span>
        </div>
        <button class="btn btn-ghost btn-full mt-16" onclick="handleLogout()">تسجيل الخروج</button>
      </div>
    </div>`;
}

function renderActiveState(ud) {
  const used          = ud.washesUsed   || 0;
  const total         = ud.package      || 4;
  const remaining     = total - used;
  const pct           = total > 0 ? (used / total) : 0;
  const circumference = 2 * Math.PI * 52;
  const washLogs      = ((ud.washHistory || []).slice()).reverse();
  const clientNum     = ud.clientNumber || '';
  const price         = ud.price || 0;

  document.getElementById('clientBody').innerHTML = `
    <div class="client-content">

      <!-- بطاقة ترحيب -->
      <div class="client-welcome-card">
        <div>
          <div style="font-size:.82rem;color:var(--text-muted);margin-bottom:4px">مرحباً بك</div>
          <div style="font-size:1.4rem;font-weight:800;color:var(--text)">${ud.name}</div>
          ${clientNum ? `<div style="font-size:.82rem;color:var(--gold);margin-top:4px">رقم العميل: <strong style="font-family:var(--font-num)">#${String(clientNum).padStart(4,'0')}</strong></div>` : ''}
        </div>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          ${ud.serviceType ? `<span class="badge badge-teal">${ud.serviceType}</span>` : ''}
          ${ud.neighborhood ? `<span class="badge badge-dim">📍 ${ud.neighborhood}</span>` : ''}
          ${price > 0 ? `<span class="badge badge-gold">💰 ${price.toLocaleString()} ريال</span>` : ''}
        </div>
      </div>

      <!-- تفاصيل العقد -->
      ${(ud.visitDays?.length || ud.startDate || ud.floorCount) ? `
      <div class="client-details-card">
        ${ud.visitDays?.length ? `
        <div class="detail-item">
          <span class="detail-icon">📅</span>
          <div><div class="detail-label">أيام الخدمة</div><div class="detail-val">${ud.visitDays.join(' — ')}</div></div>
        </div>` : ''}
        ${ud.floorCount ? `
        <div class="detail-item">
          <span class="detail-icon">🏢</span>
          <div><div class="detail-label">عدد الأدوار</div><div class="detail-val">${ud.floorCount}</div></div>
        </div>` : ''}
        ${ud.startDate ? `
        <div class="detail-item">
          <span class="detail-icon">🗓️</span>
          <div><div class="detail-label">تاريخ البداية</div><div class="detail-val">${ud.startDate}</div></div>
        </div>` : ''}
        ${ud.location ? `
        <div class="detail-item">
          <span class="detail-icon">🗺️</span>
          <div><div class="detail-label">الموقع</div><a href="${ud.location}" target="_blank" class="detail-val" style="color:var(--gold)">فتح في الخريطة ↗</a></div>
        </div>` : ''}
      </div>` : ''}

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card"><div class="stat-card-icon">🧹</div><div class="stat-card-value">${used}</div><div class="stat-card-label">غسلة منجزة</div></div>
        <div class="stat-card"><div class="stat-card-icon">✨</div><div class="stat-card-value" style="color:var(--teal)">${remaining}</div><div class="stat-card-label">غسلة متبقية</div></div>
        <div class="stat-card"><div class="stat-card-icon">📦</div><div class="stat-card-value" style="color:var(--text-muted)">${total}</div><div class="stat-card-label">إجمالي الباقة</div></div>
      </div>

      <!-- Circular Progress -->
      <div class="progress-section">
        <div class="circular-progress-wrap">
          <svg class="circular-progress" width="150" height="150" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="cpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="var(--teal)"/>
                <stop offset="100%" stop-color="var(--gold)"/>
              </linearGradient>
            </defs>
            <circle class="cp-track" cx="60" cy="60" r="52"/>
            <circle class="cp-fill" cx="60" cy="60" r="52"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" id="cpFill"/>
          </svg>
          <div class="cp-center-text">
            <div class="cp-value">${used}/${total}</div>
            <div class="cp-sub">الباقة</div>
          </div>
        </div>
        <div class="progress-info">
          <div class="progress-info-title">
            ${remaining === 0 ? '🎉 اكتملت باقتك!' : `تبقى لك ${remaining} ${remaining===1?'غسلة':'غسلات'}`}
          </div>
          <p class="progress-info-desc">
            ${remaining === 0
              ? 'لقد استهلكت كامل باقتك. اضغط على زر التجديد لطلب اشتراك جديد.'
              : `باقتك تتضمن ${total} غسلات. أُنجز منها ${used} حتى الآن.`}
          </p>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" id="pbFill" style="width:0%"></div>
          </div>
          <div class="progress-bar-labels">
            <span>0</span><span>${Math.round(pct*100)}% مكتمل</span><span>${total}</span>
          </div>
        </div>
      </div>

      <!-- زر التجديد -->
      ${remaining === 0 ? `
      <div style="background:linear-gradient(135deg,rgba(14,165,233,.12),rgba(16,185,129,.08));border:1px solid var(--gold-border);border-radius:var(--radius-xl);padding:28px 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
        <div>
          <div style="font-size:1.1rem;font-weight:800;color:var(--text);margin-bottom:6px;">🎉 اكتملت باقتك!</div>
          <div style="font-size:.88rem;color:var(--text-muted);">اطلب تجديد الاشتراك وسيتواصل معك الفريق عبر الواتساب</div>
        </div>
        <button class="btn btn-gold btn-lg" onclick="requestRenewal()">🔄 طلب تجديد الاشتراك</button>
      </div>` : ''}

      <!-- Timeline -->
      <div class="timeline-section">
        <div class="section-title">📅 سجل الزيارات</div>
        <div class="timeline">
          ${washLogs.length === 0
            ? `<div class="timeline-empty"><div style="font-size:2rem;margin-bottom:8px;opacity:.4">🧹</div>لم يتم إنجاز أي غسلة بعد</div>`
            : washLogs.map((log,i) => `
              <div class="timeline-item" style="animation-delay:${i*0.08}s">
                <div class="timeline-dot"></div>
                <div class="timeline-body">
                  <div class="timeline-date">${log.ts ? new Date(log.ts).toLocaleString('ar-SA',{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'}</div>
                  <div class="timeline-action">🧹 إنجاز غسلة — بواسطة ${log.adminName || 'الإدارة'}</div>
                </div>
              </div>`).join('')}
        </div>
      </div>
    </div>`;

  requestAnimationFrame(() => setTimeout(() => {
    const fill = document.getElementById('cpFill');
    const pb   = document.getElementById('pbFill');
    if (fill) fill.style.strokeDashoffset = circumference * (1 - pct);
    if (pb)   pb.style.width = `${pct * 100}%`;
  }, 100));
}

window.requestRenewal = async function() {
  openModal(`
    <div class="modal-title" style="color:var(--gold)">🔄 طلب تجديد الاشتراك</div>
    <p style="color:var(--text-muted);font-size:.9rem;line-height:1.6;">
      بالضغط على تأكيد، سيتم إرسال طلب التجديد للإدارة.<br/>
      سيتواصل معك الفريق عبر الواتساب لاختيار الباقة والسعر الجديدين.
    </p>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-gold" onclick="confirmClientRenewal()">✓ إرسال الطلب</button>
    </div>`);
};

window.confirmClientRenewal = async function() {
  closeModal();
  try {
    await updateDoc(doc(db,'users',currentUser.uid), {
      status:'pending', package:0, washesUsed:0, washHistory:[],
      approvedAt:null, renewedAt:serverTimestamp(), price:0
    });
    toast('تم إرسال طلب التجديد! سنتواصل معك قريباً 🎉','success',5000);
  } catch(e) { toast('خطأ: '+e.message,'error'); }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//          ADMIN + OWNER SHARED FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function adminPanelHTML(role) {
  return `
    ${navBar(currentUserData, role)}
    <div class="admin-content">

      ${role === 'owner' ? `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:8px;">
        <div style="font-size:.82rem;color:var(--text-muted)">لوحة تحكم المالك</div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost btn-sm" onclick="showAllUsers()" style="color:var(--gold);border-color:var(--gold-border)">👥 المستخدمين</button>
          <button class="btn btn-ghost btn-sm" onclick="exportReport()" style="color:var(--teal);border-color:var(--teal-border)">📥 تقرير Word</button>
        </div>
      </div>
      <div class="owner-stats" id="ownerStats">
        ${[0,1,2,3,4].map(()=>`<div class="owner-stat"><div class="skeleton" style="height:14px;width:60%;margin-bottom:12px;border-radius:4px"></div><div class="skeleton" style="height:40px;width:50%;border-radius:4px"></div></div>`).join('')}
      </div>` : ''}
    
    <!-- Dispatch System -->
    <div id="dispatchSection"></div>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon-gold">⏳</div>
            <div>
              <div class="panel-title">الطلبات المعلقة</div>
              <div class="panel-count" id="pendingCount">جارٍ التحميل...</div>
            </div>
          </div>
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="pendingSearch" placeholder="بحث بالاسم أو الجوال..." oninput="filterTable('pending')"/>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>#</th><th>الاسم</th><th>الواتساب</th><th>الحي</th><th>الخدمة</th><th>أيام</th><th>تاريخ التقديم</th><th>الإجراء</th></tr>
            </thead>
            <tbody id="pendingBody"><tr><td colspan="8"><div class="empty-state skeleton" style="height:60px"></div></td></tr></tbody>
          </table>
        </div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon-teal">✅</div>
            <div>
              <div class="panel-title">العملاء النشطون</div>
              <div class="panel-count" id="activeCount">جارٍ التحميل...</div>
            </div>
          </div>
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="activeSearch" placeholder="بحث بالاسم أو الجوال..." oninput="filterTable('active')"/>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>#</th><th>الاسم</th><th>الواتساب</th><th>الحي</th><th>الباقة</th><th>السعر</th><th>التقدم</th><th>الإجراء</th></tr>
            </thead>
            <tbody id="activeBody"><tr><td colspan="8"><div class="empty-state skeleton" style="height:60px"></div></td></tr></tbody>
          </table>
        </div>
      </div>

      ${role === 'owner' ? `
      <div class="chart-section">
        <div class="section-title">📊 نشاط الغسلات (آخر 7 أيام)</div>
        <div class="chart-area" id="activityChart">
          ${[0,1,2,3,4,5,6].map(()=>`<div class="chart-bar-wrap"><div class="skeleton" style="width:100%;height:80px;border-radius:4px"></div></div>`).join('')}
        </div>
      </div>
      <div class="audit-section">
        <div class="audit-header">
          <div class="panel-header-left">
            <div class="panel-icon panel-icon-gold">📋</div>
            <div><div class="panel-title">سجل النظام</div><div class="panel-count" id="logCount">جارٍ التحميل...</div></div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <div class="audit-badge">🔒 سجل غير قابل للمسح</div>
            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" id="logSearch" placeholder="بحث في السجل..." oninput="filterLogs()"/>
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>التاريخ والوقت</th><th>الإجراء</th><th>المسؤول</th><th>العميل</th><th>التفاصيل</th></tr></thead>
            <tbody id="logBody"><tr><td colspan="5"><div class="empty-state skeleton" style="height:60px"></div></td></tr></tbody>
          </table>
        </div>
      </div>` : ''}

    </div>`;
}

// ──── Admin View ────
async function renderAdminView() {
  clearListeners();
  document.getElementById('app').innerHTML = `<div class="admin-view view">${adminPanelHTML('admin')}</div>`;
  await runAutoCleanup();
  startAdminListeners();
}

// ──── Owner View ────
async function renderOwnerView() {
  clearListeners();
  document.getElementById('app').innerHTML = `<div class="owner-view view">${adminPanelHTML('owner')}</div>`;
  await runAutoCleanup();
  startAdminListeners();
  startOwnerListeners();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//     REAL-TIME LISTENERS (onSnapshot)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _pendingData = [];
let _activeData  = [];
let _logData     = [];

function startAdminListeners() {
  // ── Pending ──
  const pendingQ = query(collection(db,'users'),
    where('role','==','client'), where('status','==','pending'), orderBy('createdAt','asc'), limit(50));
  const u1 = onSnapshot(pendingQ, snap => {
    _pendingData = [];
    snap.forEach(d => _pendingData.push({ id:d.id, ...d.data() }));
    renderPendingTable(_pendingData);
  }, e => toast('خطأ: '+e.message,'error'));
  _unsubs.push(u1);

  // ── Active ──
  const activeQ = query(collection(db,'users'),
    where('role','==','client'), where('status','==','active'), orderBy('clientNumber','asc'), limit(50));
  const u2 = onSnapshot(activeQ, snap => {
    _activeData = [];
    snap.forEach(d => _activeData.push({ id:d.id, ...d.data() }));
    renderActiveTable(_activeData);
    renderDispatch(); // تحديث جدول العمل اليومي
    if (document.getElementById('ownerStats')) refreshOwnerStats();
  }, e => toast('خطأ: '+e.message,'error'));
  _unsubs.push(u2);
}

function startOwnerListeners() {
  // ── Logs ──
  const logsQ = query(collection(db,'logs'), orderBy('timestamp','desc'), limit(200));
  const u3 = onSnapshot(logsQ, snap => {
    _logData = [];
    snap.forEach(d => _logData.push({ id:d.id, ...d.data() }));
    renderLogs(_logData);
    renderActivityChart(buildChartData(_logData));
    refreshOwnerStats();
  }, e => toast('خطأ في السجلات: '+e.message,'error'));
  _unsubs.push(u3);
}

function refreshOwnerStats() {
  const el = document.getElementById('ownerStats');
  if (!el) return;
  const totalActive  = _activeData.length;
  const totalPending = _pendingData.length;
  const weekAgo      = Date.now() - 7 * 24 * 3600 * 1000;
  const weeklyWashes = _logData.filter(l => {
    if (l.action !== 'إنجاز غسلة' || !l.timestamp) return false;
    return (l.timestamp.toDate ? l.timestamp.toDate().getTime() : 0) > weekAgo;
  }).length;

  // Financial stats
  const totalRevenue  = _activeData.reduce((s, u) => s + (u.price || 0), 0);
  const monthAgo      = Date.now() - 30 * 24 * 3600 * 1000;
  const monthRevenue  = _activeData
    .filter(u => {
      if (!u.approvedAt) return false;
      const t = u.approvedAt.toDate ? u.approvedAt.toDate().getTime() : 0;
      return t > monthAgo;
    })
    .reduce((s, u) => s + (u.price || 0), 0);

  renderOwnerStats({ totalActive, totalPending, weeklyWashes, totalRevenue, monthRevenue });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//          TABLE RENDERERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderPendingTable(data) {
  const tbody   = document.getElementById('pendingBody');
  const countEl = document.getElementById('pendingCount');
  if (!tbody) return;
  countEl && (countEl.textContent = `${data.length} طلب`);
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">لا توجد طلبات معلقة</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map((u, i) => {
    let hoursElapsed = 0;
    if (u.createdAt) {
      const c = u.createdAt.toDate ? u.createdAt.toDate() : new Date();
      hoursElapsed = (Date.now() - c.getTime()) / 3600000;
    }
    const isUrgent = hoursElapsed > 48;
    return `
      <tr class="${isUrgent?'row-warning':''}" data-id="${u.id}">
        <td style="font-family:var(--font-num);color:var(--text-dim);font-size:.8rem">${i+1}</td>
        <td class="td-name">${u.name}</td>
        <td dir="ltr" style="font-family:var(--font-num)">${u.phone}</td>
        <td>${u.neighborhood || '—'}</td>
        <td style="font-size:.82rem">${u.serviceType || '—'}</td>
        <td style="font-size:.78rem;color:var(--text-muted)">${(u.visitDays||[]).join('، ')||'—'}</td>
        <td style="font-size:.82rem">${fmtDate(u.createdAt)}</td>
        <td>
          <div class="kebab-wrap">
            <button class="kebab-btn" onclick="toggleMenu(this, event)">⋮</button>
            <div class="kebab-menu">
              <button class="kebab-item kebab-success" onclick="closeMenus();approveClient('${u.id}','${u.name}','${u.email}')">✔️ اعتماد</button>
              <button class="kebab-item kebab-info"    onclick="closeMenus();viewClientDetails('${u.id}')">👁 عرض التفاصيل</button>
              <div class="kebab-divider"></div>
              <button class="kebab-item kebab-danger"  onclick="closeMenus();rejectClient('${u.id}','${u.name}','${u.email}')">✕ رفض الطلب</button>
            </div>
          </div>
        </td>
      </tr>`;
  }).join('');
}

function renderActiveTable(data) {
  const tbody   = document.getElementById('activeBody');
  const countEl = document.getElementById('activeCount');
  if (!tbody) return;
  countEl && (countEl.textContent = `${data.length} عميل`);
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">لا يوجد عملاء نشطون</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(u => {
    const used      = u.washesUsed || 0;
    const total     = u.package    || 4;
    const remaining = total - used;
    const pct       = total > 0 ? (used/total)*100 : 0;
    const isComplete = remaining === 0;
    const isLow      = !isComplete && remaining === 1;
    const numStr     = u.clientNumber ? `<span style="font-family:var(--font-num);color:var(--gold);font-weight:800">#${String(u.clientNumber).padStart(4,'0')}</span>` : '—';
    return `
      <tr class="${isComplete?'row-complete':isLow?'row-warning':''}" data-id="${u.id}">
        <td>${numStr}</td>
        <td class="td-name">${u.name}</td>
        <td dir="ltr" style="font-family:var(--font-num)">${u.phone}</td>
        <td>${u.neighborhood || '—'}</td>
        <td><span class="badge badge-${total===8?'gold':'teal'}">${total} غسلات</span></td>
        <td style="font-family:var(--font-num);font-weight:700;color:var(--teal)">${u.price ? u.price.toLocaleString()+' ﷼' : '—'}</td>
        <td>
          <div class="mini-progress">
            <div class="mini-bar"><div class="mini-bar-fill" style="width:${pct}%"></div></div>
            <span class="mini-fraction">${used}/${total}</span>
            ${isLow      ? '<span class="badge badge-warning" style="margin-right:4px">⚠ أخيرة</span>'  : ''}
            ${isComplete ? '<span class="badge badge-success" style="margin-right:4px">✓ مكتمل</span>'  : ''}
          </div>
        </td>
        <td>
          <div class="kebab-wrap">
            <button class="kebab-btn" onclick="toggleMenu(this, event)">⋮</button>
            <div class="kebab-menu">
              ${!isComplete ? `<button class="kebab-item kebab-teal" onclick="closeMenus();completeWash('${u.id}','${u.name}','${u.email}',${used},${total})">🧹 إنجاز غسلة</button>` : ''}
              <button class="kebab-item kebab-info"   onclick="closeMenus();viewClientDetails('${u.id}')">👁 عرض التفاصيل</button>
              <button class="kebab-item kebab-gold"   onclick="closeMenus();renewClient('${u.id}','${u.name}')">🔄 تجديد الاشتراك</button>
              ${currentUserData?.role==='owner' ? `<div class="kebab-divider"></div><button class="kebab-item kebab-danger" onclick="closeMenus();hardDeleteClient('${u.id}','${u.name}',${u.clientNumber||0})">🗑️ حذف نهائي</button>` : ''}
            </div>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//          OWNER STATS & CHART
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderOwnerStats({ totalActive, totalPending, weeklyWashes, totalRevenue, monthRevenue }) {
  const el = document.getElementById('ownerStats');
  if (!el) return;
  const stats = [
    { label:'العملاء النشطون',          value:totalActive,                            colorClass:'glow-teal',   icon:'✅' },
    { label:'طلبات قيد المراجعة',       value:totalPending,                           colorClass:'glow-gold',   icon:'⏳' },
    { label:'غسلات هذا الأسبوع',        value:weeklyWashes,                           colorClass:'glow-indigo', icon:'🧹' },
    { label:'إجمالي الإيرادات الحالية', value:(totalRevenue||0).toLocaleString()+' ﷼', colorClass:'glow-money',  icon:'💰' },
    { label:'إيرادات هذا الشهر',        value:(monthRevenue||0).toLocaleString()+' ﷼', colorClass:'glow-danger', icon:'📈' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="owner-stat ${s.colorClass}">
      <div class="owner-stat-glow"></div>
      <div class="owner-stat-label">${s.icon} ${s.label}</div>
      <div class="owner-stat-value" style="font-family:var(--font-num);font-size:${s.value.toString().length > 8 ? '1.4rem':'2.4rem'}">${s.value}</div>
    </div>`).join('');
}

function buildChartData(logs) {
  const dayLabels = ['أحد','إثن','ثلا','أرب','خمس','جمع','سبت'];
  return Array.from({length:7}, (_,i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6-i));
    d.setHours(0,0,0,0);
    const count = logs.filter(log => {
      if (log.action !== 'إنجاز غسلة' || !log.timestamp) return false;
      const ld = log.timestamp.toDate ? log.timestamp.toDate() : new Date();
      return new Date(new Date(ld).setHours(0,0,0,0)).getTime() === d.getTime();
    }).length;
    return { label: dayLabels[d.getDay()], count };
  });
}

function renderActivityChart(data) {
  const container = document.getElementById('activityChart');
  if (!container) return;
  const maxVal = Math.max(...data.map(d=>d.count), 1);
  container.innerHTML = data.map(d => {
    const h = Math.max(4, Math.round((d.count/maxVal)*130));
    return `
      <div class="chart-bar-wrap">
        <div class="chart-bar-value">${d.count||''}</div>
        <div class="chart-bar" style="height:${h}px" title="${d.count} غسلة"></div>
        <div class="chart-bar-label">${d.label}</div>
      </div>`;
  }).join('');
}

function renderLogs(data) {
  const tbody   = document.getElementById('logBody');
  const countEl = document.getElementById('logCount');
  if (!tbody) return;
  countEl && (countEl.textContent = `${data.length} سجل`);
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">لا توجد سجلات بعد</div></div></td></tr>`;
    return;
  }
  const actionBadge = { 'اعتماد اشتراك':'badge-success','إنجاز غسلة':'badge-teal','رفض طلب':'badge-danger','حذف تلقائي':'badge-warning','طلب تجديد':'badge-gold' };
  tbody.innerHTML = data.map((log,i) => `
    <tr style="animation:itemSlide .3s ease ${i*0.03}s both">
      <td style="font-family:var(--font-num);font-size:.82rem;white-space:nowrap">${fmtDateTime(log.timestamp)}</td>
      <td><span class="badge ${actionBadge[log.action]||'badge-dim'}">${log.action}</span></td>
      <td class="td-name">${log.adminName||'—'}</td>
      <td style="color:var(--text)">${log.clientName||'—'}</td>
      <td style="font-size:.82rem;color:var(--text-muted)">${log.details||'—'}</td>
    </tr>`).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//          SEARCH FILTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.filterTable = function(type) {
  const term = document.getElementById(type==='pending'?'pendingSearch':'activeSearch').value.toLowerCase().trim();
  const data = type === 'pending' ? _pendingData : _activeData;
  const f = term ? data.filter(u => u.name.toLowerCase().includes(term) || (u.phone||'').includes(term) || (u.neighborhood||'').toLowerCase().includes(term)) : data;
  type === 'pending' ? renderPendingTable(f) : renderActiveTable(f);
};

window.filterLogs = function() {
  const term = document.getElementById('logSearch').value.toLowerCase().trim();
  renderLogs(term ? _logData.filter(l =>
    (l.action||'').toLowerCase().includes(term) ||
    (l.adminName||'').toLowerCase().includes(term) ||
    (l.clientName||'').toLowerCase().includes(term) ||
    (l.details||'').toLowerCase().includes(term)) : _logData);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       VIEW CLIENT DETAILS MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.viewClientDetails = async function(uid) {
  const snap = await getDoc(doc(db,'users',uid));
  if (!snap.exists()) return;
  const u = snap.data();
  openModal(`
    <div class="modal-title">👁 تفاصيل العميل</div>
    <div style="display:flex;flex-direction:column;gap:10px;font-size:.88rem">
      ${[
        ['👤 الاسم',        u.name||'—'],
        ['📱 الواتساب',     u.phone||'—'],
        ['📧 البريد',       u.email||'—'],
        ['📍 الحي',         u.neighborhood||'—'],
        ['🏢 الدور',        u.floor||'—'],
        ['🧹 نوع الخدمة',  u.serviceType||'—'],
        ['🏗️ عدد الأدوار', u.floorCount||'—'],
        ['📅 أيام الخدمة', (u.visitDays||[]).join(' — ')||'—'],
        ['🗓️ تاريخ البداية',u.startDate||'—'],
        ['💰 السعر',        u.price ? u.price.toLocaleString()+' ريال' : 'لم يُحدد'],
        ['📝 ملاحظات',      u.notes||'—'],
      ].map(([l,v])=>`
        <div style="display:flex;gap:12px;padding:10px 14px;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid var(--border)">
          <span style="color:var(--text-muted);min-width:120px">${l}</span>
          <span style="color:var(--text);font-weight:600;word-break:break-all">${v}</span>
        </div>`).join('')}
      ${u.location ? `<a href="${u.location}" target="_blank" class="btn btn-ghost btn-sm" style="text-align:center">🗺️ فتح الموقع في الخريطة</a>` : ''}
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إغلاق</button>
      ${currentUserData?.role==='owner' ? `<button class="btn btn-danger" onclick="closeModal();hardDeleteClient('${u.id}','${u.name||''}')" style="margin-right:auto">🗑️ حذف نهائي</button>` : ''}
    </div>`);;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       APPROVE CLIENT  (with number + price)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.approveClient = async function(uid, name, email) {
  openModal(`
    <div class="modal-title">✅ اعتماد اشتراك</div>
    <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:20px;">
      اختر الباقة وأدخل السعر المتفق عليه مع <strong style="color:var(--gold)">${name}</strong>
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <button class="btn btn-ghost pkg-btn" id="pkg4" onclick="selectPkg(4)" style="padding:20px;flex-direction:column;gap:4px">
        <span style="font-size:1.8rem">🧹</span>
        <span style="font-size:1.3rem;font-weight:800;color:var(--teal);font-family:var(--font-num)">4</span>
        <span style="font-size:.78rem;color:var(--text-muted)">غسلات</span>
      </button>
      <button class="btn btn-ghost pkg-btn" id="pkg8" onclick="selectPkg(8)" style="padding:20px;flex-direction:column;gap:4px">
        <span style="font-size:1.8rem">✨</span>
        <span style="font-size:1.3rem;font-weight:800;color:var(--gold);font-family:var(--font-num)">8</span>
        <span style="font-size:.78rem;color:var(--text-muted)">غسلات</span>
      </button>
    </div>
    <div class="input-group">
      <label class="input-label">💰 السعر المتفق عليه (ريال)</label>
      <input class="input-field" type="number" id="approvePrice" placeholder="مثال: 500" min="0" style="font-family:var(--font-num);font-size:1.1rem"/>
    </div>
    <div id="approveError" class="auth-error hidden">يرجى اختيار الباقة وإدخال السعر</div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-success" onclick="confirmApprove('${uid}','${name}','${email}')">✔️ تأكيد الاعتماد</button>
    </div>
    <input type="hidden" id="selectedPkg" value=""/>
  `);
};

window.selectPkg = function(n) {
  document.querySelectorAll('.pkg-btn').forEach(b => b.classList.remove('active-pkg'));
  document.getElementById('pkg'+n).classList.add('active-pkg');
  document.getElementById('selectedPkg').value = n;
};

window.confirmApprove = async function(uid, name, email) {
  const pkg   = parseInt(document.getElementById('selectedPkg').value);
  const price = parseFloat(document.getElementById('approvePrice').value) || 0;
  const errEl = document.getElementById('approveError');

  if (!pkg) { errEl.textContent='يرجى اختيار الباقة أولاً'; errEl.classList.remove('hidden'); return; }
  if (price <= 0) { errEl.textContent='يرجى إدخال سعر صحيح أكبر من 0'; errEl.classList.remove('hidden'); return; }

  closeModal();
  try {
    // احصل على رقم تسلسلي فريد باستخدام transaction
    let clientNumber = 0;
    await runTransaction(db, async (tx) => {
      const counterRef = doc(db, 'meta', 'clientCounter');
      const counterDoc = await tx.get(counterRef);
      if (counterDoc.exists()) {
        clientNumber = (counterDoc.data().count || 0) + 1;
        tx.update(counterRef, { count: increment(1) });
      } else {
        clientNumber = 1;
        tx.set(counterRef, { count: 1 });
      }
    });

    await updateDoc(doc(db,'users',uid), {
      status:'active', package:pkg, washesUsed:0, washHistory:[],
      approvedAt:serverTimestamp(), clientNumber, price
    });
    await logAction({
      action:'اعتماد اشتراك', clientId:uid, clientName:name,
      details:`باقة ${pkg} غسلات — السعر: ${price.toLocaleString()} ريال — رقم العميل: #${String(clientNumber).padStart(4,'0')}`
    });
    await sendEmail(EMAILJS_TMPL_WELCOME, { to_name:name, to_email:email, package:pkg });
    toast(`✅ تم اعتماد ${name} — رقم العميل #${String(clientNumber).padStart(4,'0')}`, 'success', 5000);
  } catch(e) { toast('خطأ: '+e.message,'error'); }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       REJECT / WASH / RENEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.rejectClient = async function(uid, name, email) {
  openModal(`
    <div class="modal-title" style="color:var(--danger)">⚠ تأكيد الرفض</div>
    <p style="color:var(--text-muted);font-size:.9rem;line-height:1.6;">
      هل أنت متأكد من رفض طلب <strong style="color:var(--text)">${name}</strong>؟ سيتم حذف بياناته نهائياً.
    </p>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-danger" onclick="confirmReject('${uid}','${name}','${email}')">تأكيد الرفض</button>
    </div>`);
};

window.confirmReject = async function(uid, name, email) {
  closeModal();
  try {
    // Soft delete: نحتفظ بالبيانات لأغراض التسويق لكن نخفيها من الجداول
    await updateDoc(doc(db,'users',uid), {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      rejectedBy: currentUserData.name
    });
    await logAction({ action:'رفض طلب', clientId:uid, clientName:name, details:'حذف منطقي — البيانات محفوظة' });
    await sendEmail(EMAILJS_TMPL_REJECTED, { to_name:name, to_email:email });
    toast(`تم رفض طلب ${name} (البيانات محفوظة في الأرشيف)`,'info');
  } catch(e) { toast('خطأ: '+e.message,'error'); }
};

window.completeWash = async function(uid, name, email, used, total) {
  if (used >= total) { toast('هذه الباقة مكتملة','warning'); return; }
  const newUsed = used + 1, remaining = total - newUsed;
  openModal(`
    <div class="modal-title">🧹 تأكيد إنجاز غسلة</div>
    <div style="background:var(--teal-dim);border:1px solid var(--teal-border);border-radius:10px;padding:16px 20px;margin-bottom:16px;">
      <div style="font-weight:700;color:var(--text);margin-bottom:4px">${name}</div>
      <div style="font-size:.85rem;color:var(--text-muted)">
        الغسلة رقم <strong style="color:var(--teal);font-family:var(--font-num)">${newUsed}</strong>
        من أصل <strong style="font-family:var(--font-num)">${total}</strong>
        — ستبقى <strong style="color:var(--gold);font-family:var(--font-num)">${remaining}</strong> غسلة
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-teal" onclick="confirmWash('${uid}','${name}','${email}',${newUsed},${remaining})">✓ تأكيد</button>
    </div>`);
};

window.confirmWash = async function(uid, name, email, newUsed, remaining) {
  closeModal();
  try {
    const washEntry = { ts: new Date().toISOString(), adminName: currentUserData.name };
    const userRef   = doc(db,'users',uid);
    const userSnap  = await getDoc(userRef);
    const existing  = (userSnap.data().washHistory || []);
    await updateDoc(userRef, { washesUsed:newUsed, washHistory:[...existing, washEntry] });
    await logAction({ action:'إنجاز غسلة', clientId:uid, clientName:name, details:`غسلة رقم ${newUsed} — متبقٍ ${remaining}` });
    await sendEmail(EMAILJS_TMPL_WASH, { to_name:name, to_email:email, wash_number:newUsed, remaining });
    toast(`✅ تم تسجيل غسلة ${name}`,'success');
  } catch(e) { toast('خطأ: '+e.message,'error'); }
};

window.renewClient = async function(uid, name) {
  openModal(`
    <div class="modal-title" style="color:var(--gold)">🔄 تأكيد تجديد الاشتراك</div>
    <p style="color:var(--text-muted);font-size:.9rem;line-height:1.6;">
      إعادة <strong style="color:var(--text)">${name}</strong> إلى قائمة الانتظار؟<br/>
      سيحتاج لاعتماد جديد واختيار باقة وسعر جديدين.
    </p>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-gold" onclick="confirmRenew('${uid}','${name}')">✓ تأكيد التجديد</button>
    </div>`);
};

window.confirmRenew = async function(uid, name) {
  closeModal();
  try {
    await updateDoc(doc(db,'users',uid), {
      status:'pending', package:0, washesUsed:0, washHistory:[],
      approvedAt:null, renewedAt:serverTimestamp(), price:0
    });
    await logAction({ action:'طلب تجديد', clientId:uid, clientName:name, details:'أُعيد للانتظار' });
    toast(`تم إعادة ${name} لقائمة الانتظار 🔄`,'info');
  } catch(e) { toast('خطأ: '+e.message,'error'); }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       AUTO CLEANUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function runAutoCleanup() {
  try {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 72);
    const snap = await getDocs(query(
      collection(db,'users'),
      where('role','==','client'), where('status','==','pending'),
      where('createdAt','<',Timestamp.fromDate(cutoff))
    ));
    let count = 0;
    for (const d of snap.docs) {
      const u = d.data();
      await updateDoc(doc(db,'users',d.id), {
        status: 'expired',
        expiredAt: serverTimestamp()
      });
      await logAction({ action:'انتهاء مهلة', clientId:d.id, clientName:u.name||'غير معروف', details:'انتهت مهلة الـ 72 ساعة — محفوظ في الأرشيف' });
      count++;
    }
    if (count > 0) toast(`🔄 المكنسة الآلية: حُذف ${count} طلب منتهٍ`,'info',5000);
  } catch(e) { console.warn('Cleanup error:',e); }
}



window.editProfile = function() {
  const ud = currentUserData;
  openModal(`
    <div class="modal-title">✏️ تعديل الملف الشخصي</div>
    <div class="input-group">
      <label class="input-label">الاسم الكامل</label>
      <input class="input-field" type="text" id="editName" value="${ud.name||''}"/>
    </div>
    <div class="input-group">
      <label class="input-label">رقم الواتساب</label>
      <input class="input-field" type="tel" id="editPhone" value="${ud.phone||''}" dir="ltr"/>
    </div>
    <div class="input-group">
      <label class="input-label">الحي</label>
      <input class="input-field" type="text" id="editNeighborhood" value="${ud.neighborhood||''}"/>
    </div>
    <div class="input-group">
      <label class="input-label">رابط الموقع (Google Maps)</label>
      <input class="input-field" type="url" id="editLocation" value="${ud.location||''}" dir="ltr"/>
    </div>
    <div class="input-group mb-0">
      <label class="input-label">ملاحظات</label>
      <textarea class="input-field" id="editNotes" rows="2">${ud.notes||''}</textarea>
    </div>
    <div id="editError" class="auth-error hidden"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-gold" id="editSaveBtn" onclick="saveProfile()">💾 حفظ التعديلات</button>
    </div>`);
};

window.saveProfile = async function() {
  const name         = document.getElementById('editName').value.trim();
  const phone        = document.getElementById('editPhone').value.trim();
  const neighborhood = document.getElementById('editNeighborhood').value.trim();
  const location     = document.getElementById('editLocation').value.trim();
  const notes        = document.getElementById('editNotes').value.trim();
  const errEl        = document.getElementById('editError');
  const btn          = document.getElementById('editSaveBtn');

  if (!name) { errEl.textContent='الاسم مطلوب'; errEl.classList.remove('hidden'); return; }
  if (phone && !/^05\d{8}$/.test(phone)) { errEl.textContent='رقم الجوال غير صحيح'; errEl.classList.remove('hidden'); return; }

  btn.disabled = true;
  btn.textContent = 'جارٍ الحفظ...';
  try {
    const updates = {};
    if (name)         updates.name         = name;
    if (phone)        updates.phone        = phone;
    if (neighborhood) updates.neighborhood = neighborhood;
    if (location)     updates.location     = location;
    updates.notes = notes;
    await updateDoc(doc(db,'users',currentUser.uid), updates);
    closeModal();
    toast('✅ تم تحديث بياناتك بنجاح', 'success');
  } catch(e) {
    errEl.textContent = 'خطأ في الحفظ: '+e.message;
    errEl.classList.remove('hidden');
    btn.disabled = false;
    btn.textContent = '💾 حفظ التعديلات';
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       DISPATCH SYSTEM — جدول العمل اليومي
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderDispatch() {
  const DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const today = DAYS[new Date().getDay()];

  const todayClients = _activeData.filter(u => {
    if (u.washesUsed >= u.package) return false; // مكتمل
    return (u.visitDays || []).includes(today);
  });

  const el = document.getElementById('dispatchSection');
  if (!el) return;

  el.innerHTML = `
    <div class="panel-card" style="border-color:var(--gold-border)">
      <div class="panel-header" style="background:linear-gradient(135deg,var(--gold-dim),transparent)">
        <div class="panel-header-left">
          <div class="panel-icon panel-icon-gold" style="font-size:1.4rem">📋</div>
          <div>
            <div class="panel-title" style="color:var(--gold)">جدول عمل اليوم — ${today}</div>
            <div class="panel-count">${todayClients.length} مبنى يجب غسيله اليوم</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <span class="badge badge-gold" style="font-size:.82rem">📅 ${new Date().toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
        </div>
      </div>
      ${todayClients.length === 0
        ? `<div class="empty-state" style="padding:32px"><div class="empty-state-icon">✅</div><div class="empty-state-text">لا توجد مباني مجدولة لغسيلها اليوم</div></div>`
        : `<div class="table-wrap"><table class="data-table">
            <thead><tr><th>#</th><th>رقم العميل</th><th>الاسم</th><th>الواتساب</th><th>الحي</th><th>الخدمة</th><th>التقدم</th><th>الموقع</th><th>إنجاز</th></tr></thead>
            <tbody>
              ${todayClients.map((u,i) => {
                const used = u.washesUsed || 0;
                const total = u.package || 4;
                const numStr = u.clientNumber ? '#'+String(u.clientNumber).padStart(4,'0') : '—';
                return `
                  <tr data-id="${u.id}" class="dispatch-row">
                    <td style="color:var(--text-dim);font-size:.8rem">${i+1}</td>
                    <td style="font-family:var(--font-num);color:var(--gold);font-weight:800">${numStr}</td>
                    <td class="td-name">${u.name}</td>
                    <td dir="ltr" style="font-family:var(--font-num)">${u.phone}</td>
                    <td>${u.neighborhood||'—'}</td>
                    <td style="font-size:.82rem">${u.serviceType||'—'}</td>
                    <td>
                      <div class="mini-progress">
                        <div class="mini-bar"><div class="mini-bar-fill" style="width:${total>0?(used/total)*100:0}%"></div></div>
                        <span class="mini-fraction">${used}/${total}</span>
                      </div>
                    </td>
                    <td>${u.location ? `<a href="${u.location}" target="_blank" class="btn btn-ghost btn-sm" style="font-size:.75rem">🗺️</a>` : '—'}</td>
                    <td>
                      <div class="kebab-wrap">
                        <button class="kebab-btn" onclick="toggleMenu(this,event)">⋮</button>
                        <div class="kebab-menu">
                          <button class="kebab-item kebab-teal"  onclick="closeMenus();completeWash('${u.id}','${u.name}','${u.email||''}',${used},${total})">🧹 إنجاز غسلة</button>
                          <button class="kebab-item kebab-info"  onclick="closeMenus();viewClientDetails('${u.id}')">👁 عرض التفاصيل</button>
                        </div>
                      </div>
                    </td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table></div>`
      }
    </div>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       RESET + EXPORT (مالك فقط)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.showResetConfirm = function() {
  openModal(`
    <div class="modal-title" style="color:var(--danger)">⚠️ تصفير النظام</div>
    <div style="background:var(--danger-dim);border:1px solid var(--danger-border);border-radius:10px;padding:16px 20px;margin-bottom:16px;">
      <p style="color:var(--danger);font-size:.9rem;font-weight:700;margin-bottom:8px">تحذير: هذا الإجراء لا يمكن التراجع عنه!</p>
      <p style="color:var(--text-muted);font-size:.85rem;line-height:1.6;">سيتم:
        <br/>• تحميل تقرير CSV شامل بجميع البيانات على جهازك
        <br/>• تصفير عداد الغسلات لجميع العملاء النشطين (washesUsed = 0)
        <br/>• مسح سجل الغسلات (washHistory) لكل العملاء
        <br/>• حذف جميع سجلات النظام (logs)
      </p>
    </div>
    <div class="input-group">
      <label class="input-label">اكتب "تصفير" للتأكيد</label>
      <input class="input-field" type="text" id="resetConfirmInput" placeholder="اكتب: تصفير"/>
    </div>
    <div id="resetConfirmError" class="auth-error hidden"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-danger" onclick="executeReset()">🗑️ تأكيد التصفير</button>
    </div>`);
};

window.executeReset = async function() {
  const input = document.getElementById('resetConfirmInput')?.value.trim();
  const errEl = document.getElementById('resetConfirmError');
  if (input !== 'تصفير') {
    errEl.textContent = 'يرجى كتابة كلمة "تصفير" بالضبط للتأكيد';
    errEl.classList.remove('hidden');
    return;
  }

  closeModal();

  // Step 1: Generate comprehensive CSV report BEFORE reset
  await exportFullReport();

  toast('جارٍ تصفير النظام...', 'warning', 3000);

  try {
    // Step 2: Reset all active clients' wash counters
    const activeSnap = await getDocs(query(
      collection(db,'users'),
      where('role','==','client'), where('status','==','active')
    ));
    const batch1 = [];
    activeSnap.forEach(d => {
      batch1.push(updateDoc(doc(db,'users',d.id), {
        washesUsed: 0,
        washHistory: [],
        lastResetAt: serverTimestamp(),
        lastResetBy: currentUserData.name
      }));
    });
    await Promise.all(batch1);

    // Step 3: Delete all logs
    const logsSnap = await getDocs(collection(db,'logs'));
    const batch2 = [];
    logsSnap.forEach(d => batch2.push(deleteDoc(doc(db,'logs',d.id))));
    await Promise.all(batch2);

    // Step 4: Log the reset action
    await addDoc(collection(db,'logs'), {
      timestamp:  serverTimestamp(),
      action:     'تصفير النظام',
      adminId:    currentUser.uid,
      adminName:  currentUserData.name,
      clientId:   '',
      clientName: '',
      details:    `تم تصفير ${activeSnap.size} عميل وحذف ${logsSnap.size} سجل`
    });

    toast(`✅ تم تصفير النظام — ${activeSnap.size} عميل، ${logsSnap.size} سجل — التقرير نزّل على جهازك`, 'success', 8000);
  } catch(e) {
    toast('خطأ أثناء التصفير: '+e.message, 'error');
  }
};

async function exportFullReport() {
  const [clientsSnap, logsSnap] = await Promise.all([
    getDocs(query(collection(db,'users'), where('role','==','client'))),
    getDocs(query(collection(db,'logs'), orderBy('timestamp','desc')))
  ]);

  const clients = [];
  clientsSnap.forEach(d => clients.push({ id:d.id, ...d.data() }));
  const logs = [];
  logsSnap.forEach(d => logs.push({ id:d.id, ...d.data() }));

  const now    = new Date().toLocaleDateString('ar-SA');
  const nowISO = new Date().toISOString().split('T')[0];

  const activeClients  = clients.filter(u => u.status === 'active');
  const pendingClients = clients.filter(u => u.status === 'pending');
  const rejClients     = clients.filter(u => u.status === 'rejected' || u.status === 'expired');
  const totalRevenue   = activeClients.reduce((s,u) => s+(u.price||0), 0);
  const totalWashes    = activeClients.reduce((s,u) => s+(u.washesUsed||0), 0);
  const completeCount  = activeClients.filter(u => u.washesUsed >= u.package && u.package > 0).length;

  // Revenues by service type
  const revenueByType = {};
  activeClients.forEach(u => {
    const t = u.serviceType || 'أخرى';
    revenueByType[t] = (revenueByType[t] || 0) + (u.price || 0);
  });

  // ── Styles ──
  const css = \`
    @page { margin:1.5cm 1.8cm; size: A4; }
    * { box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; direction:rtl; color:#1a1a1a; font-size:9pt; line-height:1.4; }
    h1 { color:#1a3d08; font-size:16pt; border-bottom:3px solid #94ce3b; padding-bottom:6px; margin:0 0 4px; }
    h2 { color:#1a3d08; font-size:11pt; margin:18px 0 8px; padding:5px 10px;
         background:#f0f7e8; border-right:4px solid #94ce3b; }
    h3 { color:#2d5a1b; font-size:9.5pt; margin:12px 0 6px; }
    p.meta { color:#666; font-size:8pt; margin:0 0 16px; }
    /* Summary cards */
    .cards { display:table; width:100%; border-collapse:separate; border-spacing:6px; margin-bottom:12px; }
    .card  { display:table-cell; background:#f0f7e8; border:1px solid #c5e89a;
             padding:8px 6px; text-align:center; width:20%; vertical-align:middle; }
    .c-val { font-size:16pt; font-weight:bold; color:#1a3d08; display:block; line-height:1.1; }
    .c-lbl { font-size:7.5pt; color:#5a7a3a; display:block; }
    /* Revenue table */
    .rev-table { width:100%; border-collapse:collapse; margin-bottom:4px; }
    .rev-table td, .rev-table th {
      border:1px solid #ddd; padding:4px 8px; font-size:8.5pt; text-align:right; }
    .rev-table thead { background:#94ce3b; color:#fff; }
    .rev-table tr:nth-child(even) td { background:#f7fff0; }
    /* Client tables — split into two columns */
    .client-grid { display:table; width:100%; border-spacing:0; }
    .client-col  { display:table-cell; width:50%; vertical-align:top; padding:0 4px 0 0; }
    .client-col:last-child { padding:0 0 0 4px; }
    /* Small table style */
    .sm-table { width:100%; border-collapse:collapse; font-size:7.8pt; margin-bottom:10px; page-break-inside:avoid; }
    .sm-table th { background:#94ce3b; color:#fff; border:1px solid #7ab52c;
                   padding:4px 6px; text-align:right; font-size:7.5pt; }
    .sm-table td { border:1px solid #ddd; padding:3px 6px; text-align:right; }
    .sm-table tr:nth-child(even) td { background:#f9fff4; }
    .sm-table tr:hover td { background:#edffd8; }
    /* Log table */
    .log-table { width:100%; border-collapse:collapse; font-size:7.5pt; margin-bottom:10px; }
    .log-table th { background:#2d5a1b; color:#fff; border:1px solid #1a3d08;
                    padding:4px 7px; text-align:right; }
    .log-table td { border:1px solid #ccc; padding:3px 6px; text-align:right; }
    .log-table tr:nth-child(even) td { background:#f5f5f5; }
    /* Badge */
    .badge-green { background:#94ce3b; color:#fff; padding:1px 6px; border-radius:3px; font-size:7pt; }
    .badge-red   { background:#e74c3c; color:#fff; padding:1px 6px; border-radius:3px; font-size:7pt; }
    .badge-orange{ background:#f39c12; color:#fff; padding:1px 6px; border-radius:3px; font-size:7pt; }
    /* Page break helper */
    .pb { page-break-before:always; }
    .no-break { page-break-inside:avoid; }
  \`;

  // ── Helper: mini client card ──
  function clientCard(u, idx) {
    const used  = u.washesUsed || 0;
    const total = u.package    || 0;
    const pct   = total > 0 ? Math.round(used/total*100) : 0;
    const complete = used >= total && total > 0;
    const numStr = u.clientNumber ? '#'+String(u.clientNumber).padStart(4,'0') : String(idx+1);
    return \`<div class="no-break" style="margin-bottom:8px;border:1px solid #dde;border-radius:4px;overflow:hidden">
      <div style="background:#f0f7e8;padding:4px 8px;display:flex;justify-content:space-between;align-items:center">
        <strong style="font-size:8.5pt;color:#1a3d08">\${u.name||'—'}</strong>
        <span style="font-size:7.5pt;color:#5a7a3a;font-weight:bold">\${numStr}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:7.5pt">
        <tr><td style="padding:2px 8px;color:#555;width:40%">الواتساب</td><td style="padding:2px 8px" dir="ltr">\${u.phone||'—'}</td></tr>
        <tr style="background:#f9fff4"><td style="padding:2px 8px;color:#555">الحي</td><td style="padding:2px 8px">\${u.neighborhood||'—'}</td></tr>
        <tr><td style="padding:2px 8px;color:#555">الخدمة</td><td style="padding:2px 8px">\${u.serviceType||'—'}</td></tr>
        <tr style="background:#f9fff4"><td style="padding:2px 8px;color:#555">أيام</td><td style="padding:2px 8px">\${(u.visitDays||[]).join(' | ')||'—'}</td></tr>
        <tr><td style="padding:2px 8px;color:#555">الغسلات</td>
          <td style="padding:2px 8px">\${used}/\${total}
            \${complete ? '<span class="badge-orange">مكتمل</span>' : ''}
          </td>
        </tr>
        <tr style="background:#f9fff4"><td style="padding:2px 8px;color:#555">السعر</td>
          <td style="padding:2px 8px;font-weight:bold;color:#1a3d08">
            \${u.price ? u.price.toLocaleString()+' ﷼' : '—'}
          </td>
        </tr>
        \${u.notes ? \`<tr><td style="padding:2px 8px;color:#555">ملاحظات</td><td style="padding:2px 8px;font-size:7pt;color:#888">\${u.notes}</td></tr>\` : ''}
      </table>
    </div>\`;
  }

  // Split clients into two columns for compact layout
  const half = Math.ceil(activeClients.length / 2);
  const col1 = activeClients.slice(0, half);
  const col2 = activeClients.slice(half);

  // Revenue by type table
  const revByTypeRows = Object.entries(revenueByType)
    .sort((a,b) => b[1]-a[1])
    .map(([type, rev]) => {
      const cnt = activeClients.filter(u=>(u.serviceType||'أخرى')===type).length;
      return \`<tr><td>\${type}</td><td>\${cnt} عميل</td><td style="font-weight:bold;color:#1a3d08">\${rev.toLocaleString()} ﷼</td></tr>\`;
    }).join('');

  // Log rows grouped by action type
  const logsByAction = {};
  logs.forEach(l => {
    logsByAction[l.action] = (logsByAction[l.action]||0) + 1;
  });
  const logSummaryRows = Object.entries(logsByAction)
    .map(([a,c]) => \`<tr><td>\${a}</td><td style="font-weight:bold">\${c}</td></tr>\`).join('');

  // Recent 50 logs only (last records)
  const recentLogs = logs.slice(0, 50);

  const html = \`
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8"/>
      <meta name="ProgId" content="Word.Document"/>
      <!--[if gte mso 9]><xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>90</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml><![endif]-->
      <style>\${css}</style>
    </head>
    <body>

      <!-- ══ COVER / HEADER ══ -->
      <h1>تقرير كلين فوم</h1>
      <p class="meta">
        تاريخ الإنشاء: \${now} &nbsp;·&nbsp;
        أعده: \${currentUserData?.name||'المالك'} &nbsp;·&nbsp;
        إجمالي العملاء المسجلين: \${clients.length}
      </p>

      <!-- ══ SUMMARY CARDS ══ -->
      <h2>الملخص التنفيذي</h2>
      <div class="cards">
        <div class="card"><span class="c-val">\${activeClients.length}</span><span class="c-lbl">نشط</span></div>
        <div class="card"><span class="c-val">\${pendingClients.length}</span><span class="c-lbl">انتظار</span></div>
        <div class="card"><span class="c-val">\${totalWashes}</span><span class="c-lbl">غسلة منجزة</span></div>
        <div class="card" style="background:#fff8e1;border-color:#f5c842">
          <span class="c-val" style="color:#b8860b">\${totalRevenue.toLocaleString()}</span>
          <span class="c-lbl" style="color:#8a6900">إيراد إجمالي ﷼</span>
        </div>
        <div class="card"><span class="c-val">\${completeCount}</span><span class="c-lbl">باقة مكتملة</span></div>
      </div>

      <!-- ══ REVENUE BREAKDOWN ══ -->
      <table style="width:100%;border-collapse:collapse" class="no-break">
        <tr>
          <td style="width:55%;vertical-align:top;padding-left:12px">
            <h3>الإيرادات حسب نوع الخدمة</h3>
            <table class="rev-table">
              <thead><tr><th>نوع الخدمة</th><th>عدد العملاء</th><th>الإيراد (﷼)</th></tr></thead>
              <tbody>\${revByTypeRows||'<tr><td colspan="3">لا توجد بيانات</td></tr>'}</tbody>
            </table>
          </td>
          <td style="width:45%;vertical-align:top">
            <h3>ملخص السجلات حسب الإجراء</h3>
            <table class="rev-table">
              <thead><tr><th>الإجراء</th><th>العدد</th></tr></thead>
              <tbody>\${logSummaryRows||'<tr><td colspan="2">لا توجد سجلات</td></tr>'}</tbody>
            </table>
          </td>
        </tr>
      </table>

      <!-- ══ CLIENTS — TWO COLUMN CARDS ══ -->
      <h2 class="pb">العملاء النشطون (\${activeClients.length} عميل)</h2>
      <div class="client-grid">
        <div class="client-col">
          \${col1.map((u,i) => clientCard(u,i)).join('')}
        </div>
        <div class="client-col">
          \${col2.map((u,i) => clientCard(u, i+half)).join('')}
        </div>
      </div>

      <!-- ══ PENDING ══ -->
      \${pendingClients.length > 0 ? \`
      <h2 class="pb">الطلبات المعلقة (\${pendingClients.length})</h2>
      <table class="sm-table">
        <thead><tr><th>الاسم</th><th>الواتساب</th><th>الحي</th><th>الخدمة</th><th>أيام التقديم</th></tr></thead>
        <tbody>
          \${pendingClients.map(u=>\`<tr>
            <td>\${u.name||'—'}</td>
            <td dir="ltr">\${u.phone||'—'}</td>
            <td>\${u.neighborhood||'—'}</td>
            <td>\${u.serviceType||'—'}</td>
            <td>\${u.createdAt?(u.createdAt.toDate?u.createdAt.toDate().toLocaleDateString('ar-SA'):'—'):'—'}</td>
          </tr>\`).join('')}
        </tbody>
      </table>\` : ''}

      <!-- ══ RECENT LOGS (last 50) ══ -->
      <h2 class="pb">آخر \${recentLogs.length} عملية مسجلة</h2>
      <table class="log-table">
        <thead>
          <tr><th>التاريخ</th><th>الإجراء</th><th>المسؤول</th><th>العميل</th><th>التفاصيل</th></tr>
        </thead>
        <tbody>
          \${recentLogs.map(l=>\`<tr>
            <td style="white-space:nowrap;font-size:7pt">
              \${l.timestamp?(l.timestamp.toDate?l.timestamp.toDate().toLocaleString('ar-SA',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—'):'—'}
            </td>
            <td>\${l.action||'—'}</td>
            <td>\${l.adminName||'—'}</td>
            <td>\${l.clientName||'—'}</td>
            <td style="font-size:7pt;color:#555">\${l.details||'—'}</td>
          </tr>\`).join('')}
        </tbody>
      </table>

      <!-- ══ ARCHIVE ══ -->
      \${rejClients.length > 0 ? \`
      <h2 class="pb">أرشيف العملاء المرفوضين/المنتهين (\${rejClients.length})</h2>
      <table class="sm-table">
        <thead><tr><th>الاسم</th><th>الواتساب</th><th>البريد</th><th>الحالة</th><th>التاريخ</th></tr></thead>
        <tbody>
          \${rejClients.map(u=>\`<tr>
            <td>\${u.name||'—'}</td>
            <td dir="ltr">\${u.phone||'—'}</td>
            <td dir="ltr" style="font-size:7.5pt">\${u.email||'—'}</td>
            <td>\${u.status==='rejected'?'<span class="badge-red">مرفوض</span>':'<span class="badge-orange">منتهي</span>'}</td>
            <td>\${u.createdAt?(u.createdAt.toDate?u.createdAt.toDate().toLocaleDateString('ar-SA'):'—'):'—'}</td>
          </tr>\`).join('')}
        </tbody>
      </table>\` : ''}

    </body>
    </html>\`;

  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = \`cleanfoam-report-\${nowISO}.doc\`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('📥 تم تحميل التقرير الشامل (Word)', 'success');
}

// Direct export without reset (owner can download anytime)
window.exportReport = async function() {
  toast('جارٍ تجهيز التقرير...', 'info', 2000);
  await exportFullReport();
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  OWNER: Hard Delete Client
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.hardDeleteClient = async function(uid, name) {
  openModal(`
    <div class="modal-title" style="color:var(--danger)">🗑️ حذف نهائي</div>
    <div style="background:var(--danger-dim);border:1px solid var(--danger-border);border-radius:10px;padding:14px 18px;margin-bottom:16px;">
      <p style="color:var(--danger);font-weight:700;margin-bottom:6px">⚠️ تحذير: هذا الإجراء غير قابل للتراجع!</p>
      <p style="color:var(--text-muted);font-size:.88rem;line-height:1.6;">سيتم حذف جميع بيانات <strong style="color:var(--text)">${name}</strong> نهائياً من قاعدة البيانات بما فيها من الأرشيف.</p>
    </div>
    <div class="input-group">
      <label class="input-label">اكتب اسم العميل للتأكيد</label>
      <input class="input-field" type="text" id="hardDeleteInput" placeholder="${name}"/>
    </div>
    <div id="hardDeleteError" class="auth-error hidden"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-danger" onclick="confirmHardDelete('${uid}','${name}')">🗑️ حذف نهائي</button>
    </div>`);
};

window.confirmHardDelete = async function(uid, name) {
  const input = document.getElementById('hardDeleteInput')?.value.trim();
  const errEl = document.getElementById('hardDeleteError');
  if (input !== name) {
    errEl.textContent = 'الاسم المكتوب لا يطابق اسم العميل';
    errEl.classList.remove('hidden');
    return;
  }
  closeModal();
  try {
    await deleteDoc(doc(db,'users',uid));
    await logAction({ action:'حذف نهائي', clientId:uid, clientName:name, details:'حذف نهائي من قِبَل المالك' });
    toast(`تم الحذف النهائي لـ ${name}`, 'info');
  } catch(e) { toast('خطأ: '+e.message,'error'); }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  OWNER: All Users Panel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.showAllUsers = async function() {
  openModal(`
    <div class="modal-title">👥 جميع المستخدمين</div>
    <p style="color:var(--text-muted);font-size:.8rem;margin-bottom:16px;background:var(--warning-dim);border:1px solid var(--warning-border);border-radius:8px;padding:10px 14px;">
      ⚠️ ملاحظة: كلمات المرور مشفّرة في Firebase ولا يمكن لأحد —
      بما فيهم المالك والمطوّر — الاطلاع عليها. هذا لحماية أمان جميع المستخدمين.
    </p>
    <div id="usersListBody" style="max-height:400px;overflow-y:auto">
      <div class="skeleton" style="height:60px;border-radius:8px"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إغلاق</button>
    </div>`);

  try {
    const snap = await getDocs(collection(db,'users'));
    const users = [];
    snap.forEach(d => users.push({ id:d.id, ...d.data() }));
    users.sort((a,b) => (a.role==='owner'?0:a.role==='admin'?1:2) - (b.role==='owner'?0:b.role==='admin'?1:2));

    const roleLabel = { owner:'مالك', admin:'موظف', client:'عميل' };
    const roleCls   = { owner:'badge-gold', admin:'badge-teal', client:'badge-dim' };

    document.getElementById('usersListBody').innerHTML = `
      <table class="data-table" style="width:100%">
        <thead><tr><th>#</th><th>الاسم</th><th>البريد الإلكتروني</th><th>الواتساب</th><th>الدور</th><th>الحالة</th><th>إجراء</th></tr></thead>
        <tbody>
          ${users.map((u,i) => `
            <tr>
              <td style="color:var(--text-dim);font-size:.8rem">${i+1}</td>
              <td class="td-name">${u.name||'—'}</td>
              <td dir="ltr" style="font-size:.82rem">${u.email||'—'}</td>
              <td dir="ltr" style="font-family:var(--font-num)">${u.phone||'—'}</td>
              <td><span class="badge ${roleCls[u.role]||'badge-dim'}">${roleLabel[u.role]||u.role}</span></td>
              <td><span class="badge ${u.status==='active'?'badge-success':u.status==='pending'?'badge-warning':'badge-danger'}">${u.status||'—'}</span></td>
              <td>
                ${u.role==='client' ? `<button class="btn btn-danger btn-sm" onclick="closeModal();hardDeleteClient('${u.id}','${u.name||''}')">🗑️</button>` : ''}
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } catch(e) {
    document.getElementById('usersListBody').innerHTML = `<p style="color:var(--danger)">خطأ: ${e.message}</p>`;
  }
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  نسيت كلمة المرور
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.showForgotPassword = function() {
  openModal(`
    <div class="modal-title">🔑 استعادة كلمة المرور</div>
    <p style="color:var(--text-muted);font-size:.9rem;line-height:1.7;margin-bottom:18px;">
      أدخل بريدك الإلكتروني المسجل وسيصلك رابط لإعادة تعيين كلمة المرور خلال دقائق.
    </p>
    <div class="input-group">
      <label class="input-label">البريد الإلكتروني</label>
      <input class="input-field" type="email" id="resetEmailInput" placeholder="example@email.com" dir="ltr" autocomplete="email"/>
    </div>
    <div id="resetFeedback" class="hidden" style="border-radius:var(--radius-sm);padding:12px 16px;font-size:.86rem;font-weight:600;margin-top:4px"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn-gold" id="sendResetBtn" onclick="sendResetEmail()">📧 إرسال الرابط</button>
    </div>`);
  setTimeout(() => {
    const inp = document.getElementById('resetEmailInput');
    if (inp) {
      inp.focus();
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') sendResetEmail(); });
    }
  }, 80);
};

window.sendResetEmail = async function() {
  const email  = document.getElementById('resetEmailInput')?.value.trim();
  const fb     = document.getElementById('resetFeedback');
  const btn    = document.getElementById('sendResetBtn');
  if (!fb || !btn) return;

  if (!email) {
    fb.className = '';
    fb.style.background = 'var(--danger-dim)';
    fb.style.border     = '1px solid var(--danger-border)';
    fb.style.color      = 'var(--danger)';
    fb.textContent      = '⚠ يرجى إدخال البريد الإلكتروني';
    return;
  }

  btn.disabled    = true;
  btn.textContent = 'جارٍ الإرسال...';

  try {
    await sendPasswordResetEmail(auth, email);
    fb.className        = '';
    fb.style.background = 'var(--success-dim)';
    fb.style.border     = '1px solid var(--success-border)';
    fb.style.color      = 'var(--success)';
    fb.textContent      = '✓ تم الإرسال! تحقق من بريدك الإلكتروني (تحقق من Spam أيضاً)';
    btn.disabled    = true;
    btn.textContent = '✓ تم الإرسال';
  } catch(e) {
    const msgs = {
      'auth/user-not-found':  '⚠ لا يوجد حساب بهذا البريد الإلكتروني',
      'auth/invalid-email':   '⚠ البريد الإلكتروني غير صالح',
      'auth/too-many-requests': '⚠ محاولات كثيرة، انتظر قليلاً',
    };
    fb.className        = '';
    fb.style.background = 'var(--danger-dim)';
    fb.style.border     = '1px solid var(--danger-border)';
    fb.style.color      = 'var(--danger)';
    fb.textContent      = msgs[e.code] || ('خطأ: '+e.message);
    btn.disabled    = false;
    btn.textContent = '📧 إرسال الرابط';
  }
};
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  KEBAB MENU HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.toggleMenu = function(btn, e) {
  e.stopPropagation();
  const menu = btn.nextElementSibling;
  const isOpen = menu.classList.contains('open');
  closeMenus();
  if (!isOpen) {
    menu.classList.add('open');
    btn.classList.add('active');
    // Flip if near bottom
    const rect = menu.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 20) {
      menu.style.top = 'auto';
      menu.style.bottom = '100%';
    }
  }
};

window.closeMenus = function() {
  document.querySelectorAll('.kebab-menu.open').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.kebab-btn.active').forEach(b => b.classList.remove('active'));
};

// Close menus on outside click
document.addEventListener('click', () => closeMenus());
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       NAVBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function navBar(ud, role='client') {
  const initial    = ud?.name?.charAt(0) || '?';
  const roleBadge  = { client:{label:'عميل',cls:'badge-dim'}, admin:{label:'موظف',cls:'badge-teal'}, owner:{label:'مالك',cls:'badge-gold'} };
  const rb         = roleBadge[role] || roleBadge.client;
  return `
    <nav class="navbar">
      <div class="nav-logo"><img src="${LOGO_URI}" alt="كلين فوم" class="logo-img" style="height:36px"/></div>
      <div class="nav-user">
        <span class="badge ${rb.cls}" style="font-size:.75rem">${rb.label}</span>
        <div class="nav-name">${ud?.name||''}</div>
        <div class="nav-avatar">${initial}</div>
        <button class="theme-toggle" onclick="toggleTheme()" title="تبديل المظهر" id="themeBtn">🌙</button>
        ${role==='client' ? '<button class="btn btn-ghost btn-sm" onclick="editProfile()">✏️ تعديل</button>' : ''}
        <button class="btn btn-ghost btn-sm" onclick="handleLogout()">خروج</button>
      </div>
    </nav>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       GLOBAL FUNCTIONS & AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.goToLogin    = () => renderAuthView();
window.goToRegister = () => { renderAuthView(); setTimeout(() => window.switchTab?.('register'), 60); };
window.renderLandingPage = renderLandingPage;
window.closeModal   = closeModal;

window.handleLogout = async function() {
  clearListeners();
  try {
    await signOut(auth);
    toast('تم تسجيل الخروج','info');
    renderLandingPage();
  } catch(e) { toast('خطأ في تسجيل الخروج','error'); }
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//       THEME TOGGLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function applyTheme() {
  const isDark = localStorage.getItem('cleanfoam_theme') !== 'light';
  document.body.classList.toggle('light-mode', !isDark);
  document.querySelectorAll('.theme-toggle, #themeBtn, #landThemeBtn').forEach(btn => {
    if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  });
}

window.toggleTheme = function() {
  const isDark = localStorage.getItem('cleanfoam_theme') !== 'light';
  localStorage.setItem('cleanfoam_theme', isDark ? 'light' : 'dark');
  applyTheme();
};

// Apply theme on load
applyTheme();

// ── عرض الصفحة الرئيسية فوراً ──
renderLandingPage();

// ── Firebase Auth listener ──
onAuthStateChanged(auth, async user => {
  if (user) {
    currentUser = user;
    try {
      const snap = await getDoc(doc(db,'users',user.uid));
      if (snap.exists()) {
        currentUserData = snap.data();
        route(currentUserData.role);
      } else {
        await signOut(auth);
        toast('لم يتم العثور على بيانات الحساب','error');
        renderLandingPage();
      }
    } catch(e) {
      toast('خطأ في الاتصال — تحقق من إعدادات Firebase','error');
      const btn = document.getElementById('loginBtn');
      if (btn) { btn.disabled=false; btn.innerHTML='<span>دخول</span> <span>←</span>'; }
    }
  } else {
    currentUser = null; currentUserData = null;
  }
});
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
