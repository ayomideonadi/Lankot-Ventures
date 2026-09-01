@echo off
cd /d c:\Users\DELL\Desktop\lankot-b2b-platform
npm run build
if %errorlevel% neq 0 (
    echo Build failed with error code %errorlevel%
    exit /b %errorlevel%
)
echo Build completed successfully!
