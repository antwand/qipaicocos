local game_command = require('server-src.common.constant.game-command');
local scheduler = require("framework.scheduler")

local LoginScene = class("LoginScene", function()
    return display.newScene("LoginScene")
end)

function LoginScene:ctor()
    display.newTTFLabel({text = "Hello, World", size = 64})
        :align(display.CENTER, display.cx, display.cy)
        :addTo(self)
        
--        "auth" = {
--[2.9701] -     "deviceID"        = 3
--[2.9709] -     "spreader"        = ""
--[2.9716] -     "thirdPlatformID" = 0
--[2.9723] -     "thirdToken"      = "123456"
--[2.9729] -     "timestamp"       = 1513651399
--[2.9736] -     "userName"        = "robot373"
--[2.9743] -     "version"         = "0.0.0.0"
--[2.9750] - }
--        session = 1, dstEndPoint = 2, keyAction = 1, roomId = nil
    NetTool.init();  
    local param = {
    userName = "robot373", 
    thirdToken = "123456", 
    thirdPlatformID = 0, 
      version = "0.0.0.0", 
      deviceID = 3, 
      extraData = "", 
      timestamp =  1513651399, 
      spreader = "",
      newSpreader = nil
    }
--    param = {
--    uid = "111",
--    token = "111"
--    }
    
    
    scheduler.performWithDelayGlobal(function()
    -- load chunks
--     NetTool.request("login",param,nil)  
      NetTool.request("auth",param,nil)  
  end, 1)
   
   
--        local session = SocketClient:getInstance():requestUserLogin(name, token, platformId, version, deviceID, extra, timestamp)
--      self:addSessionCallback(session, function(data)
--        self:onLogonMsgBack(data)
--      end)
end

function LoginScene:onEnter()
end

function LoginScene:onExit()
end

return LoginScene
