@echo off

SET CUR_DIR=%~dp0

SET EXE_DIR=%CUR_DIR%\simulator\win32\player3.exe
SET WORK_DIR=%CUR_DIR%
SET FILE=%CUR_DIR%\src\main.lua
SET SIZE=960x640
SET CONSOLE=1

START /B %EXE_DIR% -workdir %WORK_DIR% -file %FILE% -size %SIZE%