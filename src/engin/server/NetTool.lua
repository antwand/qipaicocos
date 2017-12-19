
local GameConfig = require("engin.config.GameConfig")
local net_type = require('server-src.common.constant.net-type');
local NetTool = {}




--[[
 * 网络初始化请求
 ]]
NetTool.init = function()
   
    local self  = NetTool;
    local this = NetTool;
    
    --//给__BaseNet赋值
    print(GameConfig.BaseNet_CLA );
    if(GameConfig.BaseNet_CLA == "NetSFS") then
        local cla = require('NetSFS')
        this.__BaseNet = new cla();
    elseif(GameConfig.BaseNet_CLA == "NetProbuff") then
        local cla = require('engin.server.NetProbuff')
        this.__BaseNet = cla.new();
    else
        local cla = require('NetWebSocket')
        this.__BaseNet = new cla();
    end


    if(net_type.NETTYPE_NET == GameConfig.netType  and this.__BaseNet:isConnect() == false ) then --//先创建连接
        this.__BaseNet:prepareWebSocket(GameConfig.ip,GameConfig.port);
        --//监听
        GameNotify:removeEventListener("CMD",this._CMDcallBack)
        this._CMDcallBack = function(event) 
            local eventData = event.data;
            self.__onResponseHandle(eventData)
        end
        GameNotify:addEventListener("CMD",this._CMDcallBack)

        GameNotify:removeEventListener("DISCONNECT",this._DISCONNECTcallBack)
        self._DISCONNECTcallBack = function(event)
        end
        GameNotify:addEventListener("DISCONNECT",this._DISCONNECTcallBack)
    end
end

 --[[
   * 关闭
   ]]
NetTool.close = function()
    local this = NetTool;
    --给__BaseNet赋值
    if(this.__BaseNet == nil) then
        this.__BaseNet:close();
    end
end


 --[[
   * 网络请求
   * @param action 请求的action
   * @param method 对应的方法
   * @param arge
   ]]
NetTool.request = function(cmd,param,callBack)
--    local senddata = {
--        n = cmd,
--        t = "q",
--        s = param.sn or 0,
--        sn=param.sn or 0,
--        param = param
--    };
      local senddata = param
print("aaa");


    local this = NetTool;
    --console.log("发送消息:cmd:" +cmd+ ", netType:"+GameConfig.netType + ",param:" + JSON.stringify(param) );
    if(net_type.NETTYPE_NOT == GameConfig.netType ) then--{//单机
        --[[
        //消息处理
        //var currentCallBack = function(CMDParam){
        //    //var _ = require('_');
        //    var data = _.clone(CMDParam.data);
        //    //过滤公共接口
        //    NetWork.Filter(data);
        //
        //    if(callBack != null){
        //        callBack(data);
        //    }
        //}
        //var paramFun = function(){
        //    return param;
        //}
        //eval(action +"." + method + "(currentCallBack,paramFun())");
        ]]
        if(cmd == game_command.CMD.loginThird) then
            local data = "{\"cmd\":\"user_login\",\"code\":0,\"status\":\"success\",\"data\":{\"id\":\"GIMXDpPzfJWFqL7XAAAA\",\"name\":\"001\",\"avatar\":\"http://img6.bdstatic.com/img/image/smallpic/touxiang1227.jpeg\",\"gender\":1}}"
            local json = JSON.parse(data)
            this.__onResponseHandle(json);
        end

    else--{--网络
        if (this.__BaseNet) then 
            this.__BaseNet:send(cmd,senddata);
         end
    end
end











--//////////// 私有方法  ////////////////////////////////////////////////////////////////////////////
--[[**
 *  处理返回消息
 * @param data
 * @private
 *]]
NetTool.__onResponseHandle = function(params)
        
end


  --[[**
   * 过滤公共的错误码接口
    *]]
NetTool.__Filter = function(data) 
    local code = data.code;
    local err = data.err;


    if (code == error_code.SUCCESS) then
        return;
    elseif (code ==  error_code.FAILURE) then
        --console.log("错误码："+err);
        print("");
    else
        print("");
        --console.log("不明码："+err);
    end
end




return NetTool