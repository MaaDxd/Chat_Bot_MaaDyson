@echo off
:: Este comando asegura que la consola se ubique en la carpeta del proyecto
cd /d "%~dp0"

:: Arrancar el Backend (usando py como pediste)
start "Backend API" cmd /k "cd backend && py app.py"

:: Arrancar el Frontend
start "Frontend React" cmd /k "cd frontend && npm start"

:: (Opcional) Esto cierra la ventanita negra inicial del launcher para que no estorbe
exit