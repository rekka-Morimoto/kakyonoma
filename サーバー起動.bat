@echo off
title かきょの間 - サーバー起動
cd /d "%~dp0"
echo サーバーを起動しています...
echo ブラウザで http://localhost:3000 を開いてください。
echo.
npm run dev
pause
