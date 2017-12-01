
require("config")
require("cocos.init")
require("framework.init")


--engin =》 init 
require("engin.init")



local AppBase = require("framework.AppBase")
local MyApp = class("MyApp", AppBase)

function MyApp:ctor()
    MyApp.super.ctor(self)
end

function MyApp:run()
print("cc.exports.GameConfig:",cc.exports.GameConfig);
    cc.FileUtils:getInstance():addSearchPath("res/")
    self:enterScene("launcher.launcher1.LauncherScene")
end

return MyApp
