@echo off


SET CUR_DIR=%~dp0
SET CUR_DIR=E:\workspace\lua\qipaicocos


echo "将res的所有资源加密处理  http://cocos2d-lua.org/doc/encryptres/index.md"

SET p=%CUR_DIR%\
echo p = "%p%"


SET encryptkey=%CUR_DIR%\tools\quick\bin\EncodeRes.py
SET encryptsign=XXTEA
echo encryptkey = "%encryptkey%"  ",encryptsign" = "%encryptsign%"

START /B  python .\bin\DecodeRes.py  -p %p% -k %encryptkey% -s %encryptsign%

@pause;