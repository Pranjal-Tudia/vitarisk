# Cardiovascular Disease Risk Predictor - Project Guide

## 📁 Project Structure

```text
C:\pranjal\ML\Project\
│
├── START_PROJECT.bat           <-- Double-click to run everything in Chrome!
│
├── app.py                      <-- Flask API Backend (Port 5000)
├── model.pkl                   <-- Saved Trained ML Model (Logistic Regression)
├── scaler.pkl                  <-- Saved MinMaxScaler
├── columns.pkl                 <-- Saved Column Names
│
├── cardio_cleaned.csv          <-- Cleaned Dataset
├── cardio_cleaned_scaled.csv   <-- Scaled Dataset
│
├── 01_Problem_Definition_and_Exploration.ipynb  <-- Week 1
├── 02_Data_Preprocessing.ipynb                 <-- Week 2
├── 03_Model_Creation.ipynb                     <-- Week 3
├── 04_Model_Evaluation.ipynb                   <-- Week 4
├── task4_table.docx                            <-- Filled Evaluation Word Document
│
└── cardio-frontend/            <-- React Web Application (Port 3000)
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js              <-- Main React UI Component
        ├── App.css             <-- Dark/Light Mode & Masterblast UI Styling
        ├── index.js
        └── index.css
```

---

## 🚀 How to Run in Google Chrome (2 Ways)

### Method 1: 1-Click Launch (Easiest)
1. Open Windows File Explorer and go to `C:\pranjal\ML\Project`.
2. Double-click on **`START_PROJECT.bat`**.
3. It will automatically start both backend & frontend and open **Google Chrome** at `http://localhost:3000`.

---

### Method 2: Manual Terminal / VS Code

#### Step 1: Open VS Code
1. Open **VS Code**.
2. Click **File** -> **Open Folder...**
3. Select `C:\pranjal\ML\Project` and click **Select Folder**.

#### Step 2: Open Terminal 1 (Start Flask Backend API)
In VS Code, press `` Ctrl + ` `` (or menu: **Terminal -> New Terminal**):
```powershell
cd C:\pranjal\ML\Project
python app.py
```
*(You will see: Running on http://127.0.0.1:5000)*

#### Step 3: Open Terminal 2 (Start React Frontend)
In VS Code, click the **`+`** icon in the terminal panel to open a 2nd terminal:
```powershell
cd C:\pranjal\ML\Project\cardio-frontend
npm start
```

#### Step 4: Open in Chrome
Your browser will open automatically. If not, open **Google Chrome** and go to:
**http://localhost:3000**
