
local LauncherScene = class("LauncherScene", function()
    return display.newScene("LauncherScene")
end)

function LauncherScene:ctor()
    local Updater = require("launcher.launcher1.Updater")
   -- call init before initUI
   Updater.init("launcher.launcher1.LauncherScene", "http://localhost/qipaicocos/", function(code, param1, param2)
    
    --[[
          1 success
          2 update(param1:total, param2:remain)
          3 Network connect fail
          4 HTTP Server error(param1:httpCode)
          5 HTTP request error(param1:requestCode)
          6 EngineVersion old, need apk or ipa update
    ]]
    print("LauncherScene:ctor:",code, param1, param2)
    
    if 1 == code then
      app:enterScene("app.login.LoginScene")
    elseif 2 == code then
      local totalGetSize = param2;
      local currentGetSize = param1;
    end
    -- TODO other code deal
  end)
  --self:initUI() -- init Loading scene UI
   
   
   
end

function LauncherScene:onEnter()
end

function LauncherScene:onExit()
end

return LauncherScene
