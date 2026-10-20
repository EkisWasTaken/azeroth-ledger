@echo off
rem Builds AzerothLedger.exe with the C# compiler that ships with Windows (.NET Framework 4).
rem The FunStats addon files are bundled inside, so the app installs and updates the addon.
rem logo.ico comes from logo.py (python logo.py .), the same pixel logo the website uses.
setlocal
cd /d "%~dp0"
set CSC=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe
if not exist "%CSC%" set CSC=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe
"%CSC%" /nologo /optimize+ /target:winexe /out:AzerothLedger.exe /win32icon:logo.ico ^
  /resource:logo.ico,logo.ico ^
  /reference:System.Windows.Forms.dll /reference:System.Drawing.dll ^
  /resource:..\FunStats\FunStats.toc,addon.FunStats.toc ^
  /resource:..\FunStats\FunStats.lua,addon.FunStats.lua ^
  /resource:..\FunStats\Sync.lua,addon.Sync.lua ^
  LedgerApp.cs
if errorlevel 1 exit /b 1
copy /y AzerothLedger.exe ..\site\AzerothLedger.exe >nul
echo Built app\AzerothLedger.exe (and copied it to site\ for download)
