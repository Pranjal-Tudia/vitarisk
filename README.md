# 🫀 VitaRisk — AI-Powered Cardiovascular Risk Stratification

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Pranjal-Tudia/vitarisk)

**VitaRisk** is a clinical decision support web application powered by Machine Learning (**Random Forest Classifier**, 73.03% validation accuracy) trained on 65,452 patient records.

---

## 🌟 Key Features

- **⚡ Instant AI Risk Stratification**: Computes calibrated cardiovascular risk probability scores (Low / Moderate / High tiers).
- **💓 Dynamic ECG Heartbeat Waveform**: Moving cardiac pulse animation with adaptive dark/light theme switching.
- **🔍 Interpretable Risk Driver Attribution**: Color-coded breakdown of contributing risk factors (Hypertension, Cholesterol, BMI, Tobacco, Sedentary activity).
- **🏃 Quick Clinical Demo Presets**: Instant load presets for rapid evaluation (Healthy Adult, Borderline Case, Hypertensive Patient).
- **🖨️ One-Click Clinical Diagnostic PDF Report**: Generates print-ready diagnostic summaries.

---

## 🏗️ Architecture

- **Backend**: Python, Flask, Waitress / Gunicorn, Scikit-Learn, NumPy, Pandas
- **Frontend**: React (Custom Carbon Dark Theme, Mobile-First Responsive Grid, SVG Radial Gauges)
- **Model**: Random Forest (100 Estimators, max_depth=10)

---

## 🚀 Live Cloud Deployment (Render)

Click the button below to deploy this repository directly to Render for free:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Pranjal-Tudia/vitarisk)

Or deploy manually on [Render.com](https://render.com):
- **Environment**: Python
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

---

## 💻 Local Setup

```bash
# Clone the repository
git clone https://github.com/Pranjal-Tudia/vitarisk.git
cd vitarisk

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.
