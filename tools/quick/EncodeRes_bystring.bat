@echo off


SET CUR_DIR=%~dp0
SET CUR_DIR=E:\workspace\lua\qipaicocos\tools\quick
echo 注意这里路径下一定要有res文件夹 因为其是去加密其下的res文件夹 

echo "将res的所有资源加密处理  http://cocos2d-lua.org/doc/encryptres/index.md"

SET p=%CUR_DIR%\
echo p = "%p%"


SET encryptsign=LKOXENCRYPTION
SET encryptkey=lkcpgame
echo encryptkey = "%encryptkey%"  ",encryptsign" = "%encryptsign%"

START /B  python .\bin\EncodeRes_bystring.py  -p %p% -k %encryptkey% -s %encryptsign%

@pause;