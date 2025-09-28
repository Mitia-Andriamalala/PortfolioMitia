@echo off
echo ========================================
echo   ORGANISATION COMPLETE DU PORTFOLIO
echo ========================================
echo.
echo Ce script va deplacer TOUTES les images de la racine
echo vers le dossier assets/images/archives/
echo.
echo Cela va nettoyer completement votre dossier racine
echo et garder seulement les fichiers essentiels:
echo - index.html
echo - assets/ (avec la structure organisee)
echo - projects/
echo - fichiers de configuration (.git, etc.)
echo.
set /p choice=Voulez-vous continuer? (O/N):
if /i "%choice%"=="O" goto :organize
if /i "%choice%"=="o" goto :organize
goto :end

:organize
echo.
echo Deplacement des images en cours...

:: Deplacer toutes les images PNG
move *.png assets\images\archives\ 2>nul

:: Deplacer toutes les images JPG
move *.jpg assets\images\archives\ 2>nul

:: Deplacer tous les fichiers SVG
move *.svg assets\images\archives\ 2>nul

:: Deplacer les PDFs (sauf celui dans assets/docs)
move *.pdf assets\images\archives\ 2>nul

:: Deplacer les autres fichiers media
move *.html assets\images\archives\ 2>nul

echo.
echo ========================================
echo   ORGANISATION TERMINEE !
echo ========================================
echo.
echo Votre dossier racine est maintenant propre !
echo.
echo Structure finale:
echo   Portfolio/
echo   ├── index.html              (fichier principal)
echo   ├── assets/                 (tous les assets organises)
echo   │   ├── images/
echo   │   │   ├── profile/        (photo de profil)
echo   │   │   ├── tools/          (logos outils)
echo   │   │   ├── skills/         (icones competences)
echo   │   │   ├── projects/       (captures projets)
echo   │   │   └── archives/       (TOUTES les autres images)
echo   │   ├── docs/               (CV)
echo   │   ├── styles.css          (CSS principal)
echo   │   └── script.js           (JavaScript principal)
echo   └── projects/               (pages des projets)
echo.
echo IMPORTANT: Testez votre site pour verifier que tout fonctionne !

:end
pause