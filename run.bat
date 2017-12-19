@echo off

SET CUR_DIR=%~dp0


SET EXE_DIR_PLAY=%CUR_DIR%\simulator\win32\player3.exe
SET EXE_DIR=%CUR_DIR%\simulator\win32\qipaiquick3cocos.exe
SET WORK_DIR=%CUR_DIR%
SET FILE=%CUR_DIR%\src\main.lua
SET SIZE=640x960
SET CONSOLE=1

@echo START /B %EXE_DIR_PLAY% -workdir %WORK_DIR% -file %FILE% -size %SIZE%
START /B %EXE_DIR% -workdir %WORK_DIR% -file %FILE% -size %SIZE%