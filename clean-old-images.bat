@echo off
echo Script de nettoyage des images dupliquees
echo ==========================================
echo.
echo Ce script va deplacer les images utilisees dans le portfolio
echo vers un dossier 'old_images' pour garder une sauvegarde.
echo.
echo Images qui seront deplacees:
echo - photo1.png
echo - xd.png, photoshop1.png, illustrator.png, vs.png
echo - Php2.png, JetBrains.svg, dg.png, github2.png
echo - php.png, java.png, C.png, database1.png
echo - layers.png, brainstorm.png
echo - back.png, compta.png, index.png, mobile.png
echo - affiche.png, Flyers1.png
echo - MitiaCV.pdf
echo.
set /p choice=Voulez-vous continuer? (O/N):
if /i "%choice%"=="O" goto :clean
if /i "%choice%"=="o" goto :clean
goto :end

:clean
mkdir old_images 2>nul
move photo1.png old_images\ 2>nul
move xd.png old_images\ 2>nul
move photoshop1.png old_images\ 2>nul
move illustrator.png old_images\ 2>nul
move vs.png old_images\ 2>nul
move Php2.png old_images\ 2>nul
move JetBrains.svg old_images\ 2>nul
move dg.png old_images\ 2>nul
move github2.png old_images\ 2>nul
move php.png old_images\ 2>nul
move java.png old_images\ 2>nul
move C.png old_images\ 2>nul
move database1.png old_images\ 2>nul
move layers.png old_images\ 2>nul
move brainstorm.png old_images\ 2>nul
move back.png old_images\ 2>nul
move compta.png old_images\ 2>nul
move index.png old_images\ 2>nul
move mobile.png old_images\ 2>nul
move affiche.png old_images\ 2>nul
move Flyers1.png old_images\ 2>nul
move MitiaCV.pdf old_images\ 2>nul
echo.
echo Nettoyage termine! Les images ont ete deplacees vers old_images/
echo Votre portfolio utilise maintenant les images du dossier assets/

:end
pause