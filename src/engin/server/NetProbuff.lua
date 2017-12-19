--[[
 NetProbuff.lua 
 
 谷歌的probuff

]] 

local SimpleTCP = require("framework.SimpleTCP")
local NetProbuff = class("NetProbuff");



    
--NetProbuff._serverConfig = null;
 function NetProbuff:prepareWebSocket (_serverConfig,port)
    print("NetProbuff:prepareWebSocket");
    self:close();
    
    self.stcp = SimpleTCP.new(_serverConfig, port, handler(self, self.onTCPEvent))
    self.stcp:connect()
end
 function NetProbuff:onTCPEvent(even, data) 
 
   
   if even == SimpleTCP.EVENT_DATA then
     print("==receive data:", data)
     GameNotify:dispatchEvent({name = "CMD",data = data})
  elseif even == SimpleTCP.EVENT_CONNECTING then
    print("==connecting")
  elseif even == SimpleTCP.EVENT_CONNECTED then
    print("==connected")
    --self.stcp:send("Hello server, i'm SimpleTCP")
  elseif even == SimpleTCP.EVENT_CLOSED then
    print("==closed")
    -- you can call self.stcp:connect() again or help user exit game.
  elseif even == SimpleTCP.EVENT_FAILED then
    print("==failed")
    -- you can call self.stcp:connect() again or help user exit game.
  end
  
 
end




 --[[
 *  判断当前是否已经连接
 * @param json
 * @returns {boolean}
 ]]
function NetProbuff:isConnect()
  local ret = false;
  
  if self.stcp then 
    ret =  self.stcp.stat -- SimpleTCP.STAT_CONNECTING
    return true;
  end

  return false --SimpleTCP.STAT_CLOSED
        
end



 --[[
 * 发送数据
 * @param json
]]
function NetProbuff:send (cmd ,data) 

    local session = 1;
    local proto = require("engin.server.skynet.model.proto")
    local sproto = require "engin.server.skynet.sproto.sproto"
    local host = sproto.new(proto.s2c):host("package")
    local request = host:attach(sproto.new(proto.c2s))
    local request_data = request(cmd, data, session)
    
    cc.utils = require("engin.server.skynet.utils.init")
    local ByteArray = cc.utils.ByteArray
    local ByteArrayVarint = cc.utils.ByteArrayVarint

    local pack_ = string.pack(">HA",string.len(request_data), request_data)
  
  print("NetProbuff:send (json) ");
  if self.stcp then 
        --local json = json.encode(data)
        self.stcp:send(pack_)
  end
end



 --[[
     * 关闭
]]
function NetProbuff:close(json) 
    if self.stcp then 
        self.stcp:close()
    end
end




  









return NetProbuff;