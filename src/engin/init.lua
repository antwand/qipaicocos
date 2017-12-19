
--local _require = require;
--require = function(name)
--  local v = import(name) -- _require(name);
----  if  v == nil then 
----    v= import(name)
----  end
--  return v;
--end


-- export global variable
local __g = _G
cc.exports = {}
setmetatable(cc.exports, {
    __newindex = function(_, name, value)
        rawset(__g, name, value)
    end,

    __index = function(_, name)
        return rawget(__g, name)
    end
})

-- disable create unexpected global variable
function cc.disable_global()
    setmetatable(__g, {
        __newindex = function(_, name, value)
            error(string.format("USE \" cc.exports.%s = value \" INSTEAD OF SET GLOBAL VARIABLE", name), 0)
        end
    })
end

if CC_DISABLE_GLOBAL then
    cc.disable_global()
end



GameConfig = require("engin.config.GameConfig")
GameConstants = require("engin.config.GameConstants")

GameNotify = require("engin.util.GameNotify")
EventProtocol = require("engin.util.EventProtocol")


NetProbuff = require("engin.server.NetProbuff")
NetTool = require("engin.server.NetTool")

