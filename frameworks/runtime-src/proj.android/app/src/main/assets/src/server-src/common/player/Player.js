/**
 * 玩家类
 * @author ""
 */

var PlayerType = require('../constant/player-type.js');
var OnlineStatus = require('../constant/online-status.js');
var ReadyStatus = require('../constant/ready-status.js');
var ControlMode = require('../constant/control-mode.js');

module.exports = Player;

/**
 * 构造函数
 * @param {Number} id
 * @param {Object|null} opts
 */
function Player(id, opts) {
	opts = opts || {};
	this.id = this.uid = this.playerId = id // ID
	this.type = opts.type; // 玩家类型
	this.name = opts.name; // 名字
	this.gender = opts.gender; // 性别
	this.avatar = opts.avatar; // 头像
	this.diamonds=opts.diamonds//钻石
	this.roomCard=opts.roomCard//房卡

	this.onlineStatus = opts.onlineStatus; // 是否在线
	this.readyStatus = opts.readyStatus; // 游戏准备状态
	this.controlMode = opts.controlMode; // 游戏控制模式


	this.loginTime = null; // 登录时间(毫秒)
	this.logoutTime = null; // 登出时间(毫秒)
	this.socket = null; // socket连接
	this.rid = this.rmid = this.room_id = this.roomid  = this.roomId= null;
	// this.room = null; // 玩家所在房间

}

/**
 * 设置玩家ID
 * @param {Number} id
 */
Player.prototype.setId = function (id) {
	this.id = id;
};

/**
 * 获取玩家ID
 * @return {Number}
 */
Player.prototype.getId = function () {
	return this.id;
};

/**
 * 设置玩家名字
 * @param {String} name
 */
Player.prototype.setName = function (name) {
	this.name = name;
};

/**
 * 获取玩家名字
 * @return {String}
 */
Player.prototype.getName = function () {
	return this.name;
};

/**
 * 设置玩家类型
 * @param {Number} type
 */
Player.prototype.setType = function (type) {
	this.type = type;
};

/**
 * 获取玩家类型
 * @return {Number}
 */
Player.prototype.getType = function () {
	return this.type;
};

/**
 * 是否是机器人
 * @return {Boolean}
 */
Player.prototype.isRobot = function () {
	return (this.type == PlayerType.ROBOT);
};

/**
 * 是否是普通用户
 * @return {Boolean}
 */
Player.prototype.isUser = function () {
	return (this.type == PlayerType.USER);
};

/**
 * 设置玩家性别
 * @param {Number} gender
 */
Player.prototype.setGender = function (gender) {
	this.gender = gender;
};

/**
 * 获取玩家性别
 * @return {Number}
 */
Player.prototype.getGender = function () {
	return this.gender;
};

/**
 * 设置玩家头像
 * @param {String} avatar
 */
Player.prototype.setAvatar = function (avatar) {
	this.avatar = avatar;
};

/**
 * 获取玩家头像
 * @return {String}
 */
Player.prototype.getAvatar = function () {
	return this.avatar;
};

/**
 * 设置玩家在线状态
 * @param {Number} onlineStatus
 */
Player.prototype.setOnlineStatus = function (onlineStatus) {
	this.onlineStatus = onlineStatus;
};

/**
 * 获取玩家在线状态
 * @return {Number}
 */
Player.prototype.getOnlineStatus = function () {
	return this.onlineStatus;
};

/**
 * 玩家是否在线
 * @return {Boolean}
 */
Player.prototype.isOnline = function () {
	return (this.onlineStatus = OnlineStatus.ONLINE);
};

/**
 * 玩家是否离线
 * @return {Boolean}
 */
Player.prototype.isOffline = function () {
	return (this.onlineStatus = OnlineStatus.OFFLINE);
};


/**
 * 设置游戏准备状态
 * @param {Number} readyStatus
 */
Player.prototype.setReadyStatus = function (readyStatus) {
	console.log('player(id=%s) ready status change to %s', this.id, readyStatus);
	this.readyStatus = readyStatus;
};

/**
 * 获取游戏准备状态
 * @return {Number}
 */
Player.prototype.getReadyStatus = function () {
	return this.readyStatus;
};

/**
 * 游戏是否已准备
 * @return {Boolean}
 */
Player.prototype.isReady = function () {
	return (this.readyStatus == ReadyStatus.READY);
};

/**
 * 游戏是否未准备
 * @return {Boolean}
 */
Player.prototype.isUnready = function () {
	return (this.readyStatus == ReadyStatus.UNREADY);
};

/**
 * 设置游戏控制模式
 * @param {Number} controlMode
 */
Player.prototype.setControlMode = function (controlMode) {
	console.log('player(id=%s) control mode change to %s', this.id, controlMode);
	this.controlMode = controlMode;
};

/**
 * 获取游戏控制模式
 * @return {Number}
 */
Player.prototype.getControlMode = function () {
	return this.controlMode;
};

/**
 * 游戏是否由系统控制
 * @return {Boolean}
 */
Player.prototype.isControlBySystem = function () {
	return (this.controlMode == ControlMode.BY_SYSTEM);
};

/**
 * 游戏是否由玩家控制
 * @return {Boolean}
 */
Player.prototype.isControlByUser = function () {
	return (this.controlMode == ControlMode.BY_USER);
};

/**
 * 设置登录时间(毫秒)
 * @param {Number|null} loginTime
 */
Player.prototype.setLoginTime = function (loginTime) {
	if (loginTime == null) {
		loginTime = new Date().getTime();
	}
	this.loginTime = loginTime;
};

/**
 * 获取登录时间(毫秒)
 * @return {Number|null}
 */
Player.prototype.getLoginTime = function () {
	return this.loginTime;
};

/**
 * 设置登出时间(毫秒)
 * @param {Number|null} logoutTime
 */
Player.prototype.setLogoutTime = function (logoutTime) {
	if (logoutTime == null) {
		logoutTime = new Date().getTime();
	}
	this.logoutTime = logoutTime;
};

/**
 * 获取登出时间(毫秒)
 * @return {Number|null}
 */
Player.prototype.getLogoutTime = function () {
	return this.logoutTime;
};

/**
 * 绑定socket
 * @param {socket} socket
 */
Player.prototype.bindSocket = function (socket) {
	this.socket = socket;
};

/**
 * 获取绑定的socket
 * @return {socket|null}
 */
Player.prototype.getBindSocket = function () {
	return this.socket;
};

/**
 * 取消socket绑定
 */
Player.prototype.unbindSocket = function () {
	this.socket = null;
};















/**
 * 进入房间
 * @param {Room} room
 */
Player.prototype.enterRoom = function (roomid) {
	 this.rid = this.rmid = this.room_id = this.roomid  = this.roomId= roomid;
	// if (this.socket) {
	// 	this.socket.join(this.room.getId());
	// }
};

/**
 * 获取所在房间
 * @return {Room|null}
 */
Player.prototype.getInRid = function () {
	return  this.rid || this.rmid || this.room_id || this.roomid  || this.roomId ;
};

/**
 * 离开房间
 */
Player.prototype.leaveRoom = function () {
	// if (this.room && this.socket) {
	// 	this.socket.leave(this.room.getId());
	// 	this.room = null;
	// }
	// this.setReadyStatus(ReadyStatus.UNREADY);
	// this.setControlMode(ControlMode.BY_SYSTEM);

	var roomid = this.getInRid();
	if(roomid){
		this.rid = this.rmid = this.room_id = this.roomid  = this.roomId= null;
	}
};
