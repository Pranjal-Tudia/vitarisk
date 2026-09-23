@echo off
title CardioSense AI - Cardiovascular Risk Predictor
echo ========================================================
echo   Starting CardioSense AI Application...
echo ========================================================
echo.

cd /d "C:\pranjal\ML\Project"

echo Starting Server...
start "CardioSense AI Server" /min cmd /k "python app.py"

timeout /t 2 >nul

echo Opening browser at http://127.0.0.1:5000 ...
start http://127.0.0.1:5000

echo.
echo ========================================================
echo   Application is now running!
echo   You can close this window anytime.
echo ========================================================
