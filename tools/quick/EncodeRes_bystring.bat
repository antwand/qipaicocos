@echo off


SET CUR_DIR=%~dp0
SET CUR_DIR=E:\workspace\lua\qipaicocos\tools\quick
echo ע������·����һ��Ҫ��res�ļ��� ��Ϊ����ȥ�������µ�res�ļ��� 

echo "��res��������Դ���ܴ���  http://cocos2d-lua.org/doc/encryptres/index.md"

SET p=%CUR_DIR%\
echo p = "%p%"


SET encryptsign=LKOXENCRYPTION
SET encryptkey=lkcpgame
echo encryptkey = "%encryptkey%"  ",encryptsign" = "%encryptsign%"

START /B  python .\bin\EncodeRes_bystring.py  -p %p% -k %encryptkey% -s %encryptsign%

@pause;