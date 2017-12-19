local Socket = class("Socket")
--local SocketTCP = require("framework.cc.net.SocketTCP")
local SocketTCP = require("framework.SimpleTCP")

local ByteArray = require("framework.cc.utils.ByteArray")



local REQ_REQUEST = 0    -- 读包头
local REQ_BODY = 2       -- 读包数据
local REQ_DONE = 3       -- 完成 
local PACKET_HEADER_SIZE = 2 -- 头部6字节


function Socket:ctor(host,pot,__retryConnectWhenFailure)

    self.parts = {}
    -- self.parts["tid"] = self:heart()
    self:reset()
    self.parts["buf"] = ByteArray.new(ByteArray.ENDIAN_BIG)
    cc(self):addComponent("components.behavior.EventProtocol"):exportMethods()
	local socket = SocketTCP.new(host, pot, __retryConnectWhenFailure)
    socket:addEventListener(SocketTCP.EVENT_CONNECTED, handler(self, self.onConnect))
    socket:addEventListener(SocketTCP.EVENT_CLOSE, handler(self, self.onClose))
    socket:addEventListener(SocketTCP.EVENT_CLOSED, handler(self, self.onClosed))
    socket:addEventListener(SocketTCP.EVENT_CONNECT_FAILURE, handler(self, self.onConnectFailure))
    socket:addEventListener(SocketTCP.EVENT_DATA, handler(self, self.onData))
    self.parts["socket"] = socket
    
    self.parts["need_heart"] = true
end

function Socket:removeEvent()
    self.parts["socket"]:removeEventListenersByEvent(SocketTCP.EVENT_CONNECTED)
    self.parts["socket"]:removeEventListenersByEvent(SocketTCP.EVENT_CLOSE)
    self.parts["socket"]:removeEventListenersByEvent(SocketTCP.EVENT_CLOSED)
    self.parts["socket"]:removeEventListenersByEvent(SocketTCP.EVENT_CONNECT_FAILURE)
    self.parts["socket"]:removeEventListenersByEvent(SocketTCP.EVENT_DATA)
end

function Socket:connect(host,pot,__retryConnectWhenFailure)
    self.parts["socket"]:connect(host,pot,__retryConnectWhenFailure)
end

function Socket:setSprotoHost(_host)
    self.parts["s_host"] = _host
end

function Socket:close()
    if self.parts["socket"] ~= nil then
        self.parts["socket"]:close()
        self.parts["socket"] = nil
    end
end

function Socket:send(packet)
    -- if not self.parts["socket"] or not self.parts["socket"].tcp then
    --     print("connection not exist")
    --     return
    -- end
    if self.parts["socket"].isConnected then
        self.parts["socket"]:send(packet)
    end
end

function Socket:onClose(__event)
    NetManager.contented = false
    print(__event.target.host .."  --- socket status: ".. __event.name)
    self.parts["need_heart"] = false
end

function Socket:onClosed(__event)
    NetManager.contented = false
    print("onClosed --> socket status: ".. __event.name)
    -- self.parts["socket"] = nil
    self.parts["need_heart"] = false
    -- if not GAME.relogin then
    --     self:reCon()
    -- end
    device.showActivityIndicator()
    showDialog({
            title = "",
            msg = "连接断开，请重新连接！",
            btn = "确定",
            listener = function ( flag )
                if flag then
                    -- NetManager.close()
                    -- NetManager.connectToServer()
                end
            end
        })
end

function Socket:onConnectFailure(__event)
    NetManager.contented = false
    print("socket status: ".. __event.name)
end

function Socket:onConnect(__event)
    device.hideActivityIndicator()
    hideDialog()
    print("socket status: ".. __event.name)
    self:dispatchEvent({name = "contented"})
    --保持一个先连接上的，其它的关闭
    if NetManager.contented then
        self:close()
        self:removeEvent()
    else
        NetManager.contented = true
    end

end

function Socket:reset()
    self.parts["nStatus"] = REQ_REQUEST
    self.parts["nBodyLen"] = 0
    self.parts["readPacket"] = ByteArray.new(ByteArray.ENDIAN_BIG)
end

function Socket:read_header()
    if self.parts["buf"]:getAvailable() < PACKET_HEADER_SIZE then
        return false
    end
    self.parts["buf"]:readBytes(self.parts["readPacket"], 1, 1)
    self.parts["readPacket"]:setPos(1)
    local len = self.parts["readPacket"]:readByte() * 256 + self.parts["readPacket"]:readByte()
    self.parts["nBodyLen"] = len
    -- dump(self.parts["nBodyLen"])
    -- dump(len)
    -- dump(self.parts["buf"]:getAvailable())
    if self.parts["buf"]:getAvailable() < self.parts["nBodyLen"] then
        return false
    end
    return true
end

function Socket:parse_body(self)
    if self.parts["buf"]:getAvailable() < self.parts["nBodyLen"] then
        return false
    end
    -- dump(self.parts["buf"]:getAvailable())
    self.parts["buf"]:readBytes(self.parts["readPacket"], 1, self.parts["nBodyLen"]-1)
    -- dump(self.parts["readPacket"]:getAvailable())
    -- dump(self.parts["buf"]:getAvailable())
    return true
end


function Socket:loopParse ()
    if not self.parts["socket"].isConnected then
        return
    end
    -- 读头
    if (self.parts["nStatus"] == REQ_REQUEST) then
        if not self:read_header() then
            self:reset()
            if self.parts["buf"]:getAvailable() >= PACKET_HEADER_SIZE then
                self:loopParse()
            end
            return
        end
        self.parts["nStatus"] = REQ_BODY
    end

    -- 包体
    if self.parts["nStatus"] == REQ_BODY then
        if not self:parse_body(self) then
            return
        end
        self.parts["nStatus"] = REQ_DONE
    end

    -- 完成向外派发事件并继续读取
    if self.parts["nStatus"] == REQ_DONE then
        self:processServerMsg()
        self:reset()
        self:loopParse()
    end
end

function Socket:onData(__event)
    local oldPos = 1
    if self.parts["buf"]:getAvailable() == 0 then
        self.parts["buf"] = ByteArray.new(ByteArray.ENDIAN_LITTLE)
        self.parts["buf"]:setPos(1)
    else
        oldPos =  self.parts["buf"]:getPos()
        self.parts["buf"]:setPos(#self.parts["buf"]._buf + 1)
    end
    -- dump(__event.data)
    -- dump(#__event.data)
    self.parts["buf"]:writeBuf(__event.data)
    -- dump(oldPos)
    -- dump(self.parts["buf"]:getAvailable())
    self.parts["buf"]:setPos(oldPos)
    -- dump(self.parts["buf"]:getAvailable())

    self:loopParse()


end

--解析接收报文
function Socket:processServerMsg()
    local packet = self.parts["readPacket"]
    packet:setPos(1)
    -- dump(packet:getAvailable())
    -- dump(self.parts["buf"]:getAvailable())
    ---------------------------------------------------------------
    local _type,_session_or_name,_result,_ud,_gen_response,_header_ud = self.parts["s_host"]:dispatch(packet:getBytes(1,self.parts["nBodyLen"]))
    -- dump(_type)
    -- dump(_session_or_name)
    -- dump(_result)
    -- dump(_ud)
    -- dump(_gen_response)
    -- dump(_header_ud)
    -- if _result.cmd == 1000 then --hart
    --     self.parts["timeout_num"] = 0
    -- else
        app:dispatchEvent({name = "onServerData" , data = _result})
        -- self:dispatchEvent({name = "onServerData", data= _result})
    -- end
    ------------------------------------------------------------------------------------
end


function Socket:heart()
    return scheduler.scheduleGlobal(function()
        self.parts["timeout_num"] = self.parts["timeout_num"] or 0
        if not self.parts["need_heart"] then 
            self.parts["timeout_num"] = 0
            if self.parts["tid"] then
                scheduler.unscheduleGlobal(self.parts["tid"])
                self.parts["tid"] = nil
            end
            return 
        end
        
        if self.parts["timeout_num"] >= 5 then
            self:reCon("连接超时，请重新连接")
        else
            -- dump("heartbeat")
            -- NetManager.send("heartbeat",{y="yyyy"})
            self.parts["timeout_num"] = self.parts["timeout_num"] + 1
        end
    end, 9)
end

function Socket:reCon (msg)
    msg = msg or "连接超时，请重新连接"
    self.parts["need_heart"] = false
    showDialog({
            title = "",
            msg = msg,
            btn = "确定",
            listener = function ( flag )
                if flag then
                    -- NetManager.close()
                    -- NetManager.connectToServer()
                end
            end
        })
end




return Socket
