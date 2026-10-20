@echo off
title Azeroth Ledger sync
cd /d "%~dp0"
python ledger_sync.py --watch
pause
