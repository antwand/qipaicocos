
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
    cc.FileUtils:getInstance():addSearchPath("res/")
    --self:enterScene("launcher.launcher1.LauncherScene")
    --self:enterScene("app.test.PbTestScene")
    --self:enterScene("app.test.SprotoTestScene")
    self:enterScene("app.login.LoginScene")
end

return MyApp
