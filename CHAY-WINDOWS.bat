@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Hay cai Node.js LTS mien phi tai https://nodejs.org truoc.
 pause
 exit /b 1
)
node verify-package.cjs
if errorlevel 1 (
 pause
 exit /b 1
)
start "Kho website - may chu local" cmd /k node local-server.cjs
timeout /t 2 /nobreak >nul
start "" http://localhost:8080
