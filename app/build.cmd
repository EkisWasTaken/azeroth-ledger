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
rem The installed apps check site\app-version.txt ("<version> <sha256>") and update themselves to a newer version.
rem Raise AssemblyVersion in LedgerApp.cs for every release, or nobody gets the new build (or the addon inside it).
powershell -NoProfile -Command "$v = [Reflection.AssemblyName]::GetAssemblyName('%CD%\AzerothLedger.exe').Version; $h = (Get-FileHash AzerothLedger.exe -Algorithm SHA256).Hash; [IO.File]::WriteAllText('..\site\app-version.txt', \"$v $h\")"
if errorlevel 1 exit /b 1
rem The same addon, zipped for players without the app (forward slashes, so it unzips on a Mac too).
powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression; $z = [IO.Compression.ZipArchive]::new([IO.File]::Create('%CD%\..\site\FunStats.zip'), 'Create'); foreach ($f in 'FunStats.toc', 'FunStats.lua', 'Sync.lua') { $e = $z.CreateEntry('FunStats/' + $f); $s = $e.Open(); $b = [IO.File]::ReadAllBytes('%CD%\..\FunStats\' + $f); $s.Write($b, 0, $b.Length); $s.Close() }; $z.Dispose()"
if errorlevel 1 exit /b 1
echo Built app\AzerothLedger.exe (copied to site\ for download, with FunStats.zip and app-version.txt)
