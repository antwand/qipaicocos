

local MainScene = class("MainScene", function()
  return display.newScene("MainScene")
end)

local SimpleTCP = require("framework.cc.net.SimpleTCP")

function MainScene:ctor()
  self.stcp = SimpleTCP.new("192.168.0.27", 1234, handler(self, self.onTCPEvent))
  self.stcp:connect()

  -- Reconnect
  local button = display.newSprite("connect.png"):center():addTo(self)
  button:setTouchEnabled(true)
  button:addNodeEventListener(cc.NODE_TOUCH_EVENT, function(event)
    if event.name == "began" then
      self.stcp:connect()
      return true
    end
  end)

  -- close for Reconnet testing
  self:performWithDelay(function()
    self.stcp:close()
  end, 3)
end

function MainScene:onTCPEvent(even, data)
  if even == SimpleTCP.EVENT_DATA then
    print("==receive data:", data)
  elseif even == SimpleTCP.EVENT_CONNECTING then
    print("==connecting")
  elseif even == SimpleTCP.EVENT_CONNECTED then
    print("==connected")
    self.stcp:send("Hello server, i'm SimpleTCP")
  elseif even == SimpleTCP.EVENT_CLOSED then
    print("==closed")
    -- you can call self.stcp:connect() again or help user exit game.
  elseif even == SimpleTCP.EVENT_FAILED then
    print("==failed")
    -- you can call self.stcp:connect() again or help user exit game.
  end
end

function MainScene:onEnter()
end

function MainScene:onExit()
end

return MainScene