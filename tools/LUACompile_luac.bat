@echo off


SET CUR_DIR=%~dp0
SET CUR_DIR=E:\workspace\lua\qipaicocos


echo "编译成luac字节码"

SET src=%CUR_DIR%\src\
echo src = "%src%"


SET d=%CUR_DIR%\res\
echo d = "%src%"




SET encrypt=--encrypt
echo encrypt = "%encrypt%"
SET encryptkey=2dxLua
SET encryptsign=XXTEA
echo encryptkey = "%encryptkey%"  ",encryptsign" = "%encryptsign%"


START /B  cocos luacompile %encrypt% --src %src% -d %d% --encryptkey %encryptkey% --encryptsign %encryptsign% 

@pause;