import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/* ── App Identity ──────────────────────────────────── */
// Friend's project = "HeatDieasis Project" (heart.csv, basic notebook)
// This project = VitaRisk — completely different brand, color, layout

/* ── Clinical Presets ─────────────────────────────── */
const PRESETS = [
  {
    id: 'athlete',
    emoji: '🏃',
    label: 'Fit Profile',
    form: { age: 27, gender: '2', height: 178, weight: 72, ap_hi: 112, ap_lo: 73, cholesterol: '1', gluc: '1', smoke: false, alco: false, active: true },
  },
  {
    id: 'middle',
    emoji: '⚖️',
    label: 'Borderline',
    form: { age: 50, gender: '1', height: 163, weight: 79, ap_hi: 136, ap_lo: 87, cholesterol: '2', gluc: '1', smoke: false, alco: false, active: false },
  },
  {
    id: 'highrisk',
    emoji: '⚠️',
    label: 'Critical Risk',
    form: { age: 64, gender: '2', height: 169, weight: 94, ap_hi: 162, ap_lo: 101, cholesterol: '3', gluc: '2', smoke: true, alco: true, active: false },
  },
];

const INIT = {
  age: 45, gender: '2', height: 165, weight: 70,
  ap_hi: 120, ap_lo: 80, cholesterol: '1', gluc: '1',
  smoke: false, alco: false, active: true,
};

const NORMS = {
  age:    [18, 80],
  height: [140, 210],
  weight: [40, 150],
  ap_hi:  [90,  140],
  ap_lo:  [60,  90],
};

function flagged(name, val) {
  const r = NORMS[name];
  if (!r) return false;
  const v = parseFloat(val);
  return v < r[0] || v > r[1];
}

function bmiCategory(b) {
  if (b < 18.5) return { label: 'Underweight',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' };
  if (b < 25)   return { label: 'Healthy',       color: '#34d399', bg: 'rgba(52,211,153,0.12)' };
  if (b < 30)   return { label: 'Overweight',    color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  };
  return               { label: 'Obese',          color: '#f87171', bg: 'rgba(248,113,113,0.12)' };
}

function riskLevel(p) {
  if (p < 35) return { tier: 'LOW',      color: '#34d399', glow: 'rgba(52,211,153,0.3)',  bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)'  };
  if (p < 65) return { tier: 'MODERATE', color: '#fb923c', glow: 'rgba(251,146,60,0.3)',  bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.25)'  };
  return             { tier: 'HIGH',     color: '#f87171', glow: 'rgba(248,113,113,0.3)', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' };
}

/* ── PDF Report Generator ─────────────────────────── */
function exportPDF(form, res, bmi) {
  const lvl  = riskLevel(res.probability);
  const now  = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });
  const sex  = form.gender === '2' ? 'Male' : 'Female';
  const chol = { '1': 'Normal', '2': 'Above Normal', '3': 'Well Above Normal' }[form.cholesterol];
  const gluc = { '1': 'Normal', '2': 'Above Normal', '3': 'Well Above Normal' }[form.gluc];

  const driverHTML = (res.breakdown || []).map(b => `
    <div class="driver-row ${b.type}">
      <div class="driver-main">
        <span class="dot"></span>
        <div>
          <strong>${b.factor}</strong>
          <span>${b.detail}</span>
        </div>
      </div>
      <strong class="impact">${b.impact}</strong>
    </div>`).join('');

  const recHTML = (res.recommendations || []).map((r, i) =>
    `<div class="rec-row"><span class="num">${i + 1}</span><span>${r}</span></div>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>VitaRisk · Clinical Assessment Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; padding: 48px; font-size: 13px; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.03em; }
    .logo span { color: #dc2626; }
    .meta { text-align: right; font-size: 11px; color: #6b7280; line-height: 1.8; }
    .score-banner { display: flex; align-items: center; justify-content: space-between; padding: 24px 28px; border-radius: 12px; margin-bottom: 28px; background: ${lvl.bg}; border: 1.5px solid ${lvl.border}; }
    .score-num { font-size: 56px; font-weight: 900; color: ${lvl.color}; line-height: 1; }
    .score-tier { font-size: 20px; font-weight: 800; color: ${lvl.color}; }
    .score-sub { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; }
    .box-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #9ca3af; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; border-bottom: 1px dashed #f3f4f6; }
    .row strong { font-weight: 700; color: #111; }
    h3 { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #374151; margin-bottom: 12px; }
    .driver-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px; margin-bottom: 6px; background: #f9fafb; }
    .driver-row.risk { border-left: 3px solid #dc2626; }
    .driver-row.safe { border-left: 3px solid #10b981; }
    .driver-main { display: flex; align-items: center; gap: 8px; }
    .driver-row.risk .dot::before { content: '●'; color: #dc2626; margin-right: 4px; }
    .driver-row.safe .dot::before { content: '●'; color: #10b981; margin-right: 4px; }
    .driver-main strong { font-size: 12px; display: block; }
    .driver-main span { font-size: 11px; color: #6b7280; }
    .impact { font-weight: 800; }
    .driver-row.risk .impact { color: #dc2626; }
    .driver-row.safe .impact { color: #10b981; }
    .rec-row { display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
    .num { width: 20px; height: 20px; background: #dc2626; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
    .footer { margin-top: 36px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; }
  </style></head><body>
  <div class="header">
    <div><div class="logo">Vita<span>Risk</span></div><div style="color:#6b7280;font-size:11px;margin-top:4px">AI-Powered Cardiovascular Risk Assessment</div></div>
    <div class="meta"><div>Report Date: <strong>${now}</strong></div><div>Model: Random Forest (100 Estimators)</div><div>Validation Accuracy: 73.03%</div></div>
  </div>
  <div class="score-banner">
    <div><div class="score-tier">${lvl.tier} CARDIOVASCULAR RISK</div><div class="score-sub">${res.result}</div></div>
    <div style="text-align:right"><div class="score-num">${res.probability}%</div><div style="font-size:10px;font-weight:700;color:${lvl.color}">COMPOSITE RISK SCORE</div></div>
  </div>
  <div class="two-col">
    <div class="box">
      <div class="box-title">Patient Profile</div>
      <div class="row"><span>Age / Sex</span><strong>${form.age} yrs · ${sex}</strong></div>
      <div class="row"><span>Height / Weight</span><strong>${form.height} cm · ${form.weight} kg</strong></div>
      <div class="row"><span>BMI</span><strong>${bmi} kg/m²</strong></div>
    </div>
    <div class="box">
      <div class="box-title">Clinical Values</div>
      <div class="row"><span>Blood Pressure</span><strong>${form.ap_hi}/${form.ap_lo} mmHg</strong></div>
      <div class="row"><span>Cholesterol</span><strong>${chol}</strong></div>
      <div class="row"><span>Glucose / Smoking / Alcohol / Active</span><strong>${gluc} / ${form.smoke?'Yes':'No'} / ${form.alco?'Yes':'No'} / ${form.active?'Yes':'No'}</strong></div>
    </div>
  </div>
  <h3 style="margin-bottom:12px">Risk Attribution Breakdown</h3>
  <div style="margin-bottom:28px">${driverHTML}</div>
  <h3 style="margin-bottom:12px">Personalized Clinical Recommendations</h3>
  ${recHTML}
  <div class="footer"><span>VitaRisk AI · Academic & Research Prototype · Not a Substitute for Medical Advice</span><span>Precision: 76.43% · Recall: 67.39% · F1: 71.62%</span></div>
  </body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}

/* ── ECG Background Animation ─────────────────────── */
function EcgBackground() {
  // Realistic ECG waveform: P wave → QRS complex → T wave
  // One cycle = 500 SVG units wide, centered at y=40 in 80-unit tall space
  const cycle = 'M0,40 L120,40 L138,35 L158,25 L178,35 L198,40 L228,40 L244,52 L262,4 L278,62 L296,40 L348,40 L374,30 L412,10 L452,30 L484,40 L500,40';
  const REPEAT = 7; // enough copies to fill any screen + one full cycle buffer

  return (
    <div className="ecg-bg-wrap" aria-hidden="true">
      <svg
        width="100%" height="100%"
        viewBox="0 0 1500 80"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0,0"
            to="-500,0"
            dur="3.2s"
            repeatCount="indefinite"
          />
          {Array.from({ length: REPEAT }, (_, i) => (
            <path
              key={i}
              d={cycle}
              transform={`translate(${i * 500}, 0)`}
              className="ecg-wave-path"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ── Main Component ───────────────────────────────── */
export default function App() {
  const [form, setForm]       = useState(INIT);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [history, setHistory] = useState([]);
  const [preset, setPreset]   = useState(null);
  const [dark, setDark]       = useState(() => localStorage.getItem('vitarisk-theme') !== 'light');
  const resultRef             = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('vitarisk-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreset(null);
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const loadPreset = (p) => {
    setForm(p.form);
    setPreset(p.id);
    setResult(null);
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, smoke: form.smoke ? 1 : 0, alco: form.alco ? 1 : 0, active: form.active ? 1 : 0 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setHistory(h => [{ id: Date.now(), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), prob: data.probability, age: form.age, bp: `${form.ap_hi}/${form.ap_lo}`, bmi }, ...h].slice(0, 5));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch {
      setError('Server unreachable. Make sure python app.py is running.');
    } finally {
      setLoading(false);
    }
  };

  const bmi    = (form.weight && form.height) ? (form.weight / Math.pow(form.height / 100, 2)).toFixed(1) : '—';
  const bmiCat = bmiCategory(parseFloat(bmi));
  const lvl    = result ? riskLevel(result.probability) : null;

  // Gauge arcs
  const R    = 54;
  const CIRC = 2 * Math.PI * R;
  const p    = result?.probability ?? 0;
  const gArc = Math.min(p, 35) / 35 * (CIRC * 0.35);
  const yArc = p > 35 ? Math.min(p - 35, 30) / 30 * (CIRC * 0.30) : 0;
  const rArc = p > 65 ? Math.min(p - 65, 35) / 35 * (CIRC * 0.35) : 0;

  return (
    <div className="root-shell">

      {/* ── NAV ───────────────────────────────────── */}
      <nav className="topnav">
        <div className="nav-brand">
          <span className="brand-dot" />
          <span className="brand-wordmark">Vita<em>Risk</em></span>
          <span className="brand-tagline">Cardiovascular Screening</span>
        </div>

        <div className="nav-center">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => loadPreset(p)}
              className={`preset-chip ${p.id} ${preset === p.id ? 'active' : ''}`}
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-end">
          {result && (
            <button className="btn-ghost" onClick={() => exportPDF(form, result, bmi)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export PDF
            </button>
          )}
          <button className="btn-icon" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* ── HERO BANNER ───────────────────────────── */}
      <div className="hero-band">
        <EcgBackground />
        <div className="hero-text">
          <h1 className="hero-title">AI Cardiovascular Risk <span>Screening</span></h1>
          <p className="hero-sub">Enter clinical parameters to receive an instant machine-learning based cardiovascular risk stratification report.</p>
        </div>
        <div className="hero-stat-row">
          <div className="hstat"><span className="hstat-num">73.03%</span><span className="hstat-lbl">Model Accuracy</span></div>
          <div className="hstat-div" />
          <div className="hstat"><span className="hstat-num">65K+</span><span className="hstat-lbl">Training Records</span></div>
          <div className="hstat-div" />
          <div className="hstat"><span className="hstat-num">Random Forest</span><span className="hstat-lbl">ML Algorithm</span></div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ───────────────────────────── */}
      <div className="page-body">

        {/* LEFT — Input Form ─────────────────────── */}
        <div className="col-left">
          <form className="form-card" onSubmit={onSubmit}>

            {/* Section 1: Demographics */}
            <div className="form-section">
              <div className="section-label">
                <span className="section-num">01</span>
                <span>Demographic &amp; Biometric Data</span>
              </div>
              <div className="field-row-3">
                <div className={`fld ${flagged('age', form.age) ? 'fld-warn' : ''}`}>
                  <label>Age<em>yrs</em></label>
                  <input type="number" name="age" min="18" max="100" value={form.age} onChange={onChange} required />
                </div>
                <div className="fld">
                  <label>Biological Sex</label>
                  <select name="gender" value={form.gender} onChange={onChange}>
                    <option value="2">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
                <div className={`fld ${flagged('height', form.height) ? 'fld-warn' : ''}`}>
                  <label>Height<em>cm</em></label>
                  <input type="number" name="height" min="100" max="230" value={form.height} onChange={onChange} required />
                </div>
              </div>
              <div className="field-row-2">
                <div className={`fld ${flagged('weight', form.weight) ? 'fld-warn' : ''}`}>
                  <label>Weight<em>kg</em></label>
                  <input type="number" name="weight" min="30" max="200" step="0.5" value={form.weight} onChange={onChange} required />
                </div>
                <div className="bmi-live-box">
                  <div className="bmi-live-left">
                    <span className="bmi-live-val">{bmi}</span>
                    <span className="bmi-live-unit">kg/m²</span>
                  </div>
                  <span className="bmi-pill" style={{ color: bmiCat.color, background: bmiCat.bg }}>{bmiCat.label}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Hemodynamics */}
            <div className="form-section">
              <div className="section-label">
                <span className="section-num">02</span>
                <span>Hemodynamics &amp; Biomarkers</span>
              </div>
              <div className="field-row-2">
                <div className={`fld ${flagged('ap_hi', form.ap_hi) ? 'fld-warn' : 'fld-ok'}`}>
                  <label>
                    Systolic BP<em>mmHg</em>
                    <span className={`fld-flag ${flagged('ap_hi', form.ap_hi) ? 'danger' : 'safe'}`}>
                      {form.ap_hi >= 140 ? 'Stage 2 HTN' : form.ap_hi >= 130 ? 'Pre-HTN' : '✓ Normal'}
                    </span>
                  </label>
                  <input type="number" name="ap_hi" min="60" max="240" value={form.ap_hi} onChange={onChange} required />
                </div>
                <div className={`fld ${flagged('ap_lo', form.ap_lo) ? 'fld-warn' : 'fld-ok'}`}>
                  <label>
                    Diastolic BP<em>mmHg</em>
                    <span className={`fld-flag ${flagged('ap_lo', form.ap_lo) ? 'danger' : 'safe'}`}>
                      {form.ap_lo >= 90 ? '↑ High' : '✓ Normal'}
                    </span>
                  </label>
                  <input type="number" name="ap_lo" min="40" max="180" value={form.ap_lo} onChange={onChange} required />
                </div>
              </div>
              <div className="field-row-2">
                <div className="fld">
                  <label>Cholesterol Level</label>
                  <select name="cholesterol" value={form.cholesterol} onChange={onChange}>
                    <option value="1">Normal (Level 1)</option>
                    <option value="2">Above Normal (Level 2)</option>
                    <option value="3">Well Above Normal (Level 3)</option>
                  </select>
                </div>
                <div className="fld">
                  <label>Fasting Glucose</label>
                  <select name="gluc" value={form.gluc} onChange={onChange}>
                    <option value="1">Normal (Level 1)</option>
                    <option value="2">Above Normal (Level 2)</option>
                    <option value="3">Well Above Normal (Level 3)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Lifestyle */}
            <div className="form-section">
              <div className="section-label">
                <span className="section-num">03</span>
                <span>Lifestyle &amp; Behavioral Factors</span>
              </div>
              <div className="toggle-trio">
                {[
                  { name: 'smoke',  icon: '🚬', label: 'Smoker'  },
                  { name: 'alco',   icon: '🍺', label: 'Alcohol' },
                  { name: 'active', icon: '🏃', label: 'Active'  },
                ].map(({ name, icon, label }) => (
                  <label className={`toggle-card ${form[name] ? 'on' : ''}`} key={name}>
                    <input type="checkbox" name={name} checked={form[name]} onChange={onChange} />
                    <span className="toggle-icon">{icon}</span>
                    <span className="toggle-label">{label}</span>
                    <span className={`toggle-badge ${form[name] ? 'on' : 'off'}`}>{form[name] ? 'YES' : 'NO'}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="cta-submit" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Analyzing Patient Data...</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Run Risk Stratification</>}
            </button>

            {error && <p className="error-msg">⚠ {error}</p>}
          </form>
        </div>

        {/* RIGHT — Results Panel ─────────────────── */}
        <div className="col-right" ref={resultRef}>

          {/* GAUGE + VERDICT ─────────────────── */}
          <div className="card result-primary">
            <div className="rp-header">
              <div className="rp-label">Risk Assessment</div>
              {lvl && <span className="tier-pill" style={{ color: lvl.color, background: lvl.bg, borderColor: lvl.border }}>{lvl.tier} RISK</span>}
            </div>

            <div className="rp-body">
              {/* Radial gauge */}
              <div className="gauge-block">
                <div className="gauge-wrap">
                  <svg viewBox="0 0 124 124" className="gauge-svg">
                    <defs>
                      <linearGradient id="lgG" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                      <linearGradient id="lgY" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                      <linearGradient id="lgR" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#f87171" />
                      </linearGradient>
                    </defs>
                    <circle cx="62" cy="62" r={R} className="gauge-track" />
                    <circle cx="62" cy="62" r={R} className="gauge-arc" stroke="url(#lgG)"
                      strokeDasharray={`${result ? gArc : 0} ${CIRC}`} transform="rotate(-90 62 62)"
                      style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }} />
                    <circle cx="62" cy="62" r={R} className="gauge-arc" stroke="url(#lgY)"
                      strokeDasharray={`${result ? yArc : 0} ${CIRC}`}
                      strokeDashoffset={result ? -(CIRC * 0.35) : 0}
                      transform="rotate(-90 62 62)"
                      style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }} />
                    <circle cx="62" cy="62" r={R} className="gauge-arc" stroke="url(#lgR)"
                      strokeDasharray={`${result ? rArc : 0} ${CIRC}`}
                      strokeDashoffset={result ? -(CIRC * 0.65) : 0}
                      transform="rotate(-90 62 62)"
                      style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }} />
                  </svg>
                  <div className="gauge-inner">
                    {result
                      ? <><span className="gauge-pct" style={{ color: lvl.color }}>{result.probability}%</span><span className="gauge-sub">Risk Score</span></>
                      : <><span className="gauge-pct gauge-idle">—</span><span className="gauge-sub">Submit form</span></>}
                  </div>
                </div>
                <div className="gauge-legend">
                  <span className="gl-item" data-c="green">Low &lt;35%</span>
                  <span className="gl-item" data-c="amber">Mid 35–65%</span>
                  <span className="gl-item" data-c="red">High &gt;65%</span>
                </div>
              </div>

              {/* Verdict + Stat Row */}
              <div className="verdict-block">
                {result ? (
                  <div className="verdict-box" style={{ background: lvl.bg, borderColor: lvl.border }}>
                    <span className="v-icon">{result.prediction === 1 ? '⚠️' : '✅'}</span>
                    <div>
                      <p className="v-title">{result.prediction === 1 ? 'Elevated CVD Risk Detected' : 'Profile Within Healthy Limits'}</p>
                      <p className="v-sub">{result.result}</p>
                    </div>
                  </div>
                ) : (
                  <div className="verdict-box idle">
                    <span className="v-icon">💡</span>
                    <div>
                      <p className="v-title">Awaiting Submission</p>
                      <p className="v-sub">Select a preset or fill the form, then click Run Risk Stratification.</p>
                    </div>
                  </div>
                )}

                <div className="stat-grid">
                  <div className="stat-tile">
                    <span className="st-val">{bmi}</span>
                    <span className="st-key">BMI</span>
                    <span className="st-sub" style={{ color: bmiCat.color }}>{bmiCat.label}</span>
                  </div>
                  <div className={`stat-tile ${flagged('ap_hi', form.ap_hi) ? 'st-warn' : ''}`}>
                    <span className="st-val">{form.ap_hi}/{form.ap_lo}</span>
                    <span className="st-key">Blood Pressure</span>
                    <span className="st-sub">mmHg</span>
                  </div>
                  <div className="stat-tile">
                    <span className="st-val">{form.age}</span>
                    <span className="st-key">Age</span>
                    <span className="st-sub">years</span>
                  </div>
                  <div className="stat-tile">
                    <span className="st-val">L-{form.cholesterol}</span>
                    <span className="st-key">Cholesterol</span>
                    <span className="st-sub">{form.cholesterol === '1' ? 'Normal' : 'Elevated'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER 2-COL: DRIVERS + RECOMMENDATIONS */}
          <div className="lower-grid">

            {/* Risk Driver Attribution */}
            <div className="card">
              <div className="card-head">
                <span className="card-head-icon">🔍</span>
                <span className="card-head-title">Risk Driver Breakdown</span>
              </div>
              {result?.breakdown
                ? <div className="driver-list">
                    {result.breakdown.map((b, i) => (
                      <div key={i} className={`drv-row ${b.type}`}>
                        <div className="drv-left">
                          <span className={`drv-dot ${b.type}`} />
                          <div>
                            <p className="drv-name">{b.factor}</p>
                            <p className="drv-detail">{b.detail}</p>
                          </div>
                        </div>
                        <span className={`drv-pct ${b.type}`}>{b.impact}</span>
                      </div>
                    ))}
                  </div>
                : <p className="empty-hint">Run the analysis to see risk driver attribution.</p>}
            </div>

            {/* Clinical Action Plan */}
            <div className="card">
              <div className="card-head" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="card-head-icon">📋</span>
                  <span className="card-head-title">Clinical Action Plan</span>
                </div>
                {result && (
                  <button className="pdf-micro" onClick={() => exportPDF(form, result, bmi)}>🖨 PDF</button>
                )}
              </div>
              {result?.recommendations
                ? <div className="rec-list">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="rec-row">
                        <span className="rec-num">{i + 1}</span>
                        <span className="rec-text">{r}</span>
                      </div>
                    ))}
                  </div>
                : <p className="empty-hint">Clinical recommendations will appear after analysis.</p>}
            </div>

          </div>

          {/* SESSION HISTORY */}
          {history.length > 0 && (
            <div className="card history-card">
              <div className="card-head" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="card-head-icon">📜</span>
                  <span className="card-head-title">Session History</span>
                </div>
                <button className="link-btn" onClick={() => setHistory([])}>Clear</button>
              </div>
              <div className="history-row">
                {history.map(h => {
                  const l = riskLevel(h.prob);
                  return (
                    <div key={h.id} className="hist-chip">
                      <span className="hist-pct" style={{ color: l.color }}>{h.prob}%</span>
                      <div className="hist-meta">
                        <span style={{ color: l.color, fontWeight: 700, fontSize: '0.7rem' }}>{l.tier}</span>
                        <span>Age {h.age} · BP {h.bp} · BMI {h.bmi}</span>
                      </div>
                      <span className="hist-time">{h.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* STATUS BAR */}
      <footer className="status-bar">
        <span>Random Forest · 100 Estimators · 73.03% Acc · 65,452 patient records</span>
      </footer>

    </div>
  );
}
