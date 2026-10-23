@echo off
title Lanzador Ecommerce OnePage (PocketBase + Vue 3)
echo ========================================================
echo   Iniciando Tienda Ecommerce OnePage
echo   Backend: PocketBase (http://127.0.0.1:8090/_/)
echo   Frontend: Vue 3 + Vite (http://localhost:5173)
echo ========================================================

:: Iniciar PocketBase en nueva ventana
start "PocketBase Backend" cmd /k "cd backend && pocketbase.exe serve --http=127.0.0.1:8090"

:: Iniciar Frontend Vite en nueva ventana
start "Vue 3 Frontend" cmd /k "cd frontend && npm run dev"

echo Ambos servidores han sido iniciados en consolas independientes.
echo Puedes ingresar a:
echo - Frontend: http://localhost:5173
echo - PocketBase Admin: http://127.0.0.1:8090/_/
pause
