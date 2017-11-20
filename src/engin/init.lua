
local _require = require;
require = function(name)
  local v = import(name) -- _require(name);
--  if  v == nil then 
--    v= import(name)
--  end
  return v;
end

require("engin.config.GameConfig")
require("engin.config.GameConstants")


