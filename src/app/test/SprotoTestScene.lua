
--[[
 http://cocos2d-lua.org/doc/protobuffer/index.md
 
  

]]
-- 引用文件
require("pack")
require("app.config.config")
NetManager = require("app.net.NetManager")

local MainScene = class("MainScene", function()
    return display.newScene("MainScene")
end)

function MainScene:ctor()
  self:testRoom()
end

function MainScene:testRoom()
 NetManager.connectToServer()
end

function MainScene:onEnter()
end

function MainScene:onExit()
end

return MainScene