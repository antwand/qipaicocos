--[[
/**
 * Created by Administrator on 2016/5/9 0009.
 */
 ]]

local app_channel_type = require('app-channel-type');
local app_pay_type = require('app-pay-type');
local GameConstants = require('GameConstants');
local net_type = require('net-type');
local GameConfig = {};



GameConfig.serverListType = 0;--serverListType 0是测试服   1正式服
if(GameConfig.serverListType == 0) then 
    GameConfig.port = "8203";
    --// GameConfig.port = "8011";
     GameConfig.ip = "ws://192.168.31.254:8203/ws";
    --// GameConfig.ip = "ws://192.168.31.254:8203/ws";
    --// GameConfig.ip = "ws://127.0.0.1:8203/ws";
else
    GameConfig.port = "8203";
    --// GameConfig.ip = "ws://119.29.94.78:8011";
    GameConfig.ip = "ws://192.168.31.236:8203/ws";
end
GameConfig.httpIp = "https://www.baidu.com/";
GameConfig.netType = net_type.NETTYPE_NET;--//0是单机  1是网络







--//语言包
GameConfig.language = cc.sys.language;--系统自带的语言



--//上线渠道
GameConfig.CONFIG_CHANNEL_ID = app_channel_type.APP_CHANNEL_DINGDING;
--//支付渠道
GameConfig.CONFIG_PAY_NAME = app_pay_type.APP_PAY_GOOGLE;
--//第三方支付渠道
GameConfig.CONFIG_PAY3_NAME = app_pay_type.APP_PAY_GOOGLE;



cc.exports.GameConfig = GameConfig;