
NetManager = class("NetManager")
local session = 0
local proto = require("app.model.proto")
local sproto = require "app.sproto.sproto"
local host = sproto.new(proto.s2c):host("package")
local request = host:attach(sproto.new(proto.c2s))
local scheduler = require("framework.scheduler")
--连接3个socket，保持一个先连接上的，其它的关闭
function NetManager.connectToServer()
	NetManager.contented = false
	local sockets = {}
	local Socket = require("app.net.Socket")
	for i=1,#CONFIG.server do
		scheduler.performWithDelayGlobal(function ( ... ) --异步去连接，只使用最快连接上的那个socket
			sockets[i] = Socket.new(CONFIG.server[i],CONFIG.port[i],true)
			sockets[i]:addEventListener("contented", function(event)
				if not NetManager.contented then
					NetManager.socket = sockets[i]
					NetManager.socket:setSprotoHost(host)
					NetManager.send("login",{uid = USER.uid,token = USER.token })
					-- sockets[i]:removeEventListenersByTag("contented")
				else
					-- sockets[i]:removeEventListenersByTag("contented")
				end

			end)

			sockets[i]:connect()
		end,0)
	end
end


--send_request("get",{what = "hello"})
function NetManager.send(name, args)
	args = args or {}
	session = session + 1
	dump(args,name,5)
    local request_data = request(name, args, session)
    local pack_ = string.pack(">HA",string.len(request_data), request_data)
    NetManager.socket:send(pack_)
end

function NetManager.close()

	if NetManager.socket == nil then
		return
	end

	NetManager.socket:close()
	NetManager.parseSocket:removeEvent()
end

function NetManager.addEvent(cmd,fun)
	NetManager.socket:addEventListener(cmd.."",fun)
end

function NetManager.removeEvent(cmd)
	NetManager.socket:removeEventListenersByEvent(cmd.."")
end

return NetManager