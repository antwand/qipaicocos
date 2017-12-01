
local LoginScene = class("LoginScene", function()
    return display.newScene("LoginScene")
end)

function LoginScene:ctor()
    display.newTTFLabel({text = "Hello, World", size = 64})
        :align(display.CENTER, display.cx, display.cy)
        :addTo(self)
end

function LoginScene:onEnter()
end

function LoginScene:onExit()
end

return LoginScene
