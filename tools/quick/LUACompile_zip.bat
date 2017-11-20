@echo off


SET CUR_DIR=%~dp0
SET CUR_DIR=E:\workspace\lua\qipaicocos


echo "编译成luajit的zip包"

SET p=%CUR_DIR%\
echo p = "%p%"


SET o=game
echo o = "%o%"

START /B  python .\bin\PackageScripts.py  -p %p% -o %o% 

@pause;