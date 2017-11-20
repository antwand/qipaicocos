--[[

 纯lua的热更新方案  


http://cocos2d-lua.org/doc/hotupdate/luaupdater.md



纯Lua的热更新方案

适用于3.7.1以及以后版本.
设计要点

支持game.zip分包，但是基础包为game32.zip(game64.zip), 基础包必须含有Updater以及其界面代码。基础包由cpp自动加载。扩展包由lua加载。
项目无需特别的结构调整，热更新模块基于引擎基础模块编写，对应UI需在独立的scene中完成。
自动判断手机cpu位数，避免下载无用的game_xxx.zip.
热更中程序退出，再次启动会自动判断已下载的文件，节省流量。
不支持断点续传，对离散的文件下载更友好。
支持多文件同时下载。
只要引擎版本不变，可以任意版本直升。每个人下载的内容不一样。
Updater.lua

可在https://github.com/u0u0/Lua-utils/blob/master/src/app/utils/Updater.lua获取热更新核心逻辑代码。配套脚本工具位https://github.com/u0u0/Lua-utils/blob/master/tools/GenResMD5.py.

GenResMD5.py拷贝到项目的res同级目录下，命令行运行自动生成versong.json文件。

用法示例：

local Updater = require("app.utils.Updater")

-- hot update scene
local LoadingScene = class("LoadingScene", function()
  return display.newScene("LoadingScene")
end)

function LoadingScene:ctor()
  -- call init before initUI
  Updater.init("LoadingScene", "http://127.0.0.1:8080/v1", function(code, param1, param2)
    print(code, param1, param2)
    if 1 == code then
      app:enterScene("MainScene")
    end
    -- TODO other code deal
  end)
  self:initUI() -- init Loading scene UI
end



]]

local Updater = {}

local scheduler = require("framework.scheduler")
local FileUtils = cc.FileUtils:getInstance()
local maxHTTPRequest = 5
local configFileName = "version.json"
local extName = "URes"
local extTmpName = "UTmp"
local extPath = FileUtils:getWritablePath() .. extName .. "/"
local extTmp = FileUtils:getWritablePath() .. extTmpName .. "/"
local cpu = "32"
if jit.arch == "arm64" then
	cpu = "64"
end

-- ********** internal function ********
local function copyFile(src, dest)
	local pInfo = io.pathinfo(dest)
	FileUtils:createDirectory(pInfo.dirname) -- Create path recursively
	local buf = io.readfile(src)
	if buf then
		io.writefile(dest, buf, "wb")
	end
end

local function saveFile(path, buf)
	local pInfo = io.pathinfo(path)
	FileUtils:createDirectory(pInfo.dirname) -- Create path recursively
	io.writefile(path, buf, "wb")
end

-- compare the string version, return true if need doUpdate
local function checkVersion(my, server)
	my = string.split(my, ".")
	server = string.split(server, ".")
	for i, ver in ipairs(my) do
		if tonumber(ver) < tonumber(server[i]) then
			return true
		end
	end
	return false
end

local function isNeedDownload(name, md5)
	-- check game packages is need for this device
	if string.sub(name, #name - 3) == ".zip" then
		if string.sub(name, #name - 5, #name - 4) ~= cpu then
			return false
		end
	end
	-- check if downloaded
	local path = extTmp .. name
	if FileUtils:isFileExist(path) and crypto.md5file(path) == md5 then
		return false
	end
	return true
end

-- check if the remain file is OK
local function isRemainOK(name, md5)
	local path = FileUtils:fullPathForFilename(name)
	if string.find(path, extPath) == 1 then -- ext files
		if FileUtils:isFileExist(path) and crypto.md5file(path) == md5 then
			copyFile(path, extTmp .. name) -- copy extPath => extTmp
			return true
		end
		return false
	end
	-- apk files always OK
	return true
end

local function getDiff(my, server)
	local change = {}
	local size = 0

	local serverAsserts = server.asserts
	for k, v in pairs(my.asserts) do
		local value = serverAsserts[k]
		if value then
			-- get changing files
			if value[1] ~= v[1] then
				if isNeedDownload(k, value[1]) then
					table.insert(change, {k})
					size = size + value[2]
				end
			else
				-- XXX:need check? just do copy??
				if not isRemainOK(k, value[1]) then
					table.insert(change, {k})
					size = size + value[2]
				end
			end
			value.checked = true
		end
	end

	for k, value in pairs(serverAsserts) do
		if value.checked then -- clean tmp value
			value.checked = nil
		else -- get new adding files
			if isNeedDownload(k, value[1]) then
				size = size + value[2]
				table.insert(change, {k})
			end
		end
	end

	return {
		change = change,
		size = size,
		packages = server.packages,
	}
end

local function doUpdate(url, callback, info)
	-- info UI to update the size
	callback(2, info.size, 0)

	-- http download dealing
	local curHttp = 0
	local totalGetSize = 0
	local totalErrorCount = 0

	local notifySize = function(diff)
		totalGetSize = totalGetSize + diff
		callback(2, info.size, totalGetSize)
	end

	local notifyError = function(downInfo)
		curHttp = curHttp - 1
		totalErrorCount = totalErrorCount + 1
		notifySize(-downInfo[3]) -- cancel getting size
		downInfo[2] = nil
		downInfo[3] = nil
	end

	local newRequest = function(index)
		local downInfo = info.change[index]
		local downUrl = url .. "/" .. downInfo[1]
		local request = network.createHTTPRequest(function(event)
			local request = event.request
			if event.name == "completed" then
				local code = request:getResponseStatusCode()
				if code ~= 200 then
					notifyError(downInfo)
					return
				end

				-- info size
				curHttp = curHttp - 1
				local diff = request:getResponseDataLength() - downInfo[3]
				notifySize(diff)
				-- save file
				saveFile(extTmp .. downInfo[1], request:getResponseData())
				info.change[index] = nil -- mark downloaded
			elseif event.name == "progress" then
				local diff = event.dltotal - downInfo[3]
				notifySize(diff)
				downInfo[3] = event.dltotal
			else
				notifyError(downInfo)
			end
		end, downUrl, "GET")

		-- add downloading mark
		downInfo[2] = true -- is downloading
		downInfo[3] = 0 -- downloaded size
		curHttp = curHttp + 1
		request:start()
	end

	Updater._scheduler = scheduler.scheduleUpdateGlobal(function()
		-- check exit
		if 0 == table.nums(info.change) then
			scheduler.unscheduleGlobal(Updater._scheduler)
			-- remove extPath, then rename extTmp -> extPath
			FileUtils:removeDirectory(extPath)
			FileUtils:renameFile(FileUtils:getWritablePath(), extTmpName, extName)
			FileUtils:purgeCachedEntries() -- clear filename search cache
			-- reload game.zip, purgeCachedData
			for _, zip in ipairs(info.packages) do
				cc.LuaLoadChunksFromZIP(zip .. cpu .. ".zip")
			end
			cc.Director:getInstance():purgeCachedData()
			-- notify to start play scene
			callback(1)
			return
		end
		if totalErrorCount >= maxHTTPRequest then -- error count just same with request count
			scheduler.unscheduleGlobal(Updater._scheduler)
			callback(5, -1)
			return
		end
		-- a request per frame event
		if curHttp < maxHTTPRequest and table.nums(info.change) > curHttp then
			for index, downInfo in pairs(info.change) do
				if not downInfo[2] then
					newRequest(index)
					break
				end
			end
		end
	end)
end

local function checkUpdate(url, callback)
	-- we had set SearchPath, so we will get the right file
	local data = FileUtils:getDataFromFile(configFileName)
	assert(data, "Error: fail to get data from config.json")
	data = json.decode(data)
	assert(data, "Error: fail to parser config.json")

	-- get server info
	if not network.isInternetConnectionAvailable() then
		callback(3)
		return
	end

	local request = network.createHTTPRequest(function(event)
		local request = event.request
		if event.name == "completed" then
			local code = request:getResponseStatusCode()
			if code ~= 200 then
				callback(4, code)
				return
			end

			-- do the real things
			local response = request:getResponseString()
			response = json.decode(response)
			if checkVersion(data.EngineVersion, response.EngineVersion) then
				callback(6)
			elseif checkVersion(data.GameVersion, response.GameVersion) then
				-- save config
				saveFile(extTmp .. configFileName, request:getResponseData())
				local info = getDiff(data, response)
				doUpdate(url, callback, info)
			else
				print("== no need update")
				callback(1)
			end
		elseif event.name == "progress" then
			-- print("progress" .. event.dltotal)
		else
			callback(5, request:getErrorCode())
		end
	end, url .. "/" .. configFileName, "GET")
	request:start()
end

--[[ apk's "res/game32.zip" had been loaded by cpp code.
check and load the right package's, then restart the LoadingScene
callback(code, param1, param2)
	1 success
	2 update(param1:total, param2:remain)
	3 Network connect fail
	4 HTTP Server error(param1:httpCode)
	5 HTTP request error(param1:requestCode)
	6 EngineVersion old, need apk or ipa update
--]]
function Updater.init(sceneName, url, callback)
	if app.__UpdateInited then
		-- extends loaded, start the network checking now
		checkUpdate(url, callback)
		app.__UpdateInited = nil
		return
	end
	app.__UpdateInited = true

	-- get config in apk
	local sandbox = FileUtils:getDataFromFile("res/" .. configFileName)
	sandbox = json.decode(sandbox)
	-- add extPath before apk path
	FileUtils:setSearchPaths{extPath, "res/"}
	-- get config in URes or apk
	local data = FileUtils:getDataFromFile(configFileName)
	data = json.decode(data)
	if checkVersion(data.EngineVersion, sandbox.EngineVersion) then
		-- apk has update, so remove old URes.
		FileUtils:removeDirectory(extPath)
		FileUtils:purgeCachedEntries()
		data = sandbox -- use apk data to init
	end

	-- let the first frame display, and avoid to replaceScene in the scene ctor(BUG)
	scheduler.performWithDelayGlobal(function()
		-- load chunks
		for _, zip in ipairs(data.packages) do
			cc.LuaLoadChunksFromZIP(zip .. cpu .. ".zip")
		end
		print("== restarting scene")
		app:enterScene(sceneName)
	end, 0)
end

return Updater
