# 🫀 VitaRisk — AI-Powered Cardiovascular Risk Stratification

**VitaRisk** is a clinical decision support system powered by Machine Learning (**Random Forest Classifier**, 73.03% validation accuracy) trained on 65,452 patient records.

🌐 **Live Application:** [https://vitarisk.onrender.com](https://vitarisk.onrender.com)

---

## 🌟 Key Features

- **⚡ Instant AI Risk Stratification**: Calibrated cardiovascular risk probabilities across Low, Moderate, and High clinical tiers.
- **💓 Dynamic ECG Heartbeat Waveform**: Live animated cardiac pulse line with adaptive dark/light mode switching.
- **🔍 Interpretable Risk Driver Attribution**: Factor-by-factor risk attribution breakdown (Hypertension, Cholesterol, BMI, Smoking, Alcohol, Sedentary Lifestyle).
- **🏃 Quick Clinical Demo Presets**: One-click preset profiles for rapid evaluation (Healthy Adult, Borderline Case, Hypertensive Patient).
- **🖨️ Clinical Diagnostic PDF Export**: Hospital-style printable diagnostic reports.

---

## 📊 Model Performance Metrics

| Metric | Score |
|---|---|
| **Algorithm** | Random Forest Classifier (100 Estimators) |
| **Validation Accuracy** | **73.03%** |
| **Precision** | **76.43%** |
| **Recall** | **67.39%** |
| **F1-Score** | **71.62%** |
| **Training Records** | 65,452 patients |

---

## 🏗️ Architecture & Tech Stack

- **Machine Learning**: Scikit-Learn, NumPy, Pandas
- **Backend API**: Python, Flask, Gunicorn, Waitress
- **Frontend UI**: React, Custom Carbon Theme, SVG Radial Gauges, CSS3 Animations
