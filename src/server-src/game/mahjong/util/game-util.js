/**
 * 游戏工具类
 * @author ""
 */

var Card = require('../constant/card.js');
var ActionType = require('../constant/action-type.js');
var PatternType = require('../constant/pattern-type.js');
var PatternXYZ = require('../pattern/pattern-xyz.js');
var PatternXXX = require('../pattern/pattern-xxx.js');
var PatternXXXX = require('../pattern/pattern-xxxx.js');
var PatternYYYY = require('../pattern/pattern-yyyy.js');
var PatternZZZZ = require('../pattern/pattern-zzzz.js');
var PatternHu13yao = require('../pattern/pattern-hu-13yao.js');
var PatternHu7xiaodui = require('../pattern/pattern-hu-7xiaodui.js');
var PatternHuDaduipeng = require('../pattern/pattern-hu-daduipeng.js');
var PatternHuOther = require('../pattern/pattern-hu-other.js');

var gameUtil = new GameUtil();
module.exports = gameUtil;

/**
 * 构造函数
 */
function GameUtil() {
	this.patterns = {};
	this.patterns[PatternType.XYZ] = new PatternXYZ();
	this.patterns[PatternType.XXX] = new PatternXXX();
	this.patterns[PatternType.XXXX] = new PatternXXXX();
	this.patterns[PatternType.YYYY] = new PatternYYYY();
	this.patterns[PatternType.ZZZZ] = new PatternZZZZ();
	this.patterns[PatternType.HU_13YAO] = new PatternHu13yao();
	this.patterns[PatternType.HU_7XIAODUI] = new PatternHu7xiaodui();
	this.patterns[PatternType.HU_DADUIPENG] = new PatternHuDaduipeng();
	this.patterns[PatternType.HU_OTHER] = new PatternHuOther();
	this.actionDetectsAll = [
		[PatternType.XYZ, ActionType.CHI],
		[PatternType.XXX, ActionType.PENG],
		[PatternType.XXXX, ActionType.MING_GANG],
		[PatternType.YYYY, ActionType.AN_GANG],
		[PatternType.ZZZZ, ActionType.FANG_GANG],
		[PatternType.HU_13YAO, ActionType.HU],
		[PatternType.HU_7XIAODUI, ActionType.HU],
		[PatternType.HU_DADUIPENG, ActionType.HU],
		[PatternType.HU_OTHER, ActionType.HU]
	];
	this.actionDetectsHu = [
		[PatternType.HU_13YAO, ActionType.HU],
		[PatternType.HU_7XIAODUI, ActionType.HU],
		[PatternType.HU_DADUIPENG, ActionType.HU],
		[PatternType.HU_OTHER, ActionType.HU]
	];
}

/**
 * 初始化配置
 * @param {Number} gameId 游戏ID
 * @param {Object|null} opts 房间创建选项
 * @return {Object}
 */
GameUtil.prototype.loadConfig = function (gameId, opts) {
	opts = opts || {};
	var config;
	if (typeof (module) != 'undefined' && module.exports) {
		config = require('../config/config-' + gameId + '.js');
	} else {
		config = window['Config' + gameId];
	}
	if (config == null) {
		throw new Error('config is null');
	}
	var obj = {};
	for (var k in config) {
		obj[k] = config[k];
	}
	for (var k in opts) {
		if (config[k] != null) {
			obj[k] = opts[k];
		}
	}
	obj.maxPlayerNum = parseInt(obj.maxPlayerNum);
	obj.showCardTimeout = parseInt(obj.showCardTimeout);
	obj.responseCardTimeout = parseInt(obj.responseCardTimeout);
	if (typeof (obj.canChi) != 'boolean') {
		obj.canChi = (obj.canChi == 'true' || obj.canChi == '1');
	}
	return obj;
};

/**
 * 预测牌动作
 * @param {PlayerCard} playerCard 玩家的牌实例
 * @param {Object} opts 选项
 * 详细：
 * {Object} opts.config 游戏配置
 * {Object} opts.action 动作数据
 * {Number} opts.myPos 我的位置
 * {Number} opts.type 动作类型
 * @return {Array}
 */
GameUtil.prototype.detectAction = function (playerCard, opts) {
	if (opts == null) {
		throw new Error('opts is null');
	}
	if (opts.config == null) {
		throw new Error('opts.config is null');
	}
	if (opts.action == null) {
		throw new Error('opts.action is null');
	}
	if (opts.myPos == null) {
		throw new Error('opts.myPos is null');
	}
	opts.patterns = [
		this.patterns[PatternType.XXX],
		this.patterns[PatternType.XYZ]
	];
	var retArr = [];
	var action = opts.action;
	var actionType = action.type;
	switch (actionType) {
		case ActionType.SHOW:
		case ActionType.FETCH:
		case ActionType.CHI:
		case ActionType.PENG:
		case ActionType.MING_GANG:
		case ActionType.AN_GANG:
		case ActionType.HU:
		case ActionType.FANG_GANG:
			break;
		default : // 非以上动作都不能带来其他响应
			return retArr;
	}
	if (action.cards == null) {
		return retArr;
	}
	if (!Array.isArray(action.cards)) {
		throw new Error('action.cards must be array');
	}
	if (opts.onlyHu) { // 仅胡牌牌型
		opts.type = ActionType.HU;
		console.log('opts.onlyHu is deprecated, please use opts.type instead');
	}
	var actionDetects;
	switch (opts.type) {
		case ActionType.CHI:
			actionDetects = [[PatternType.XYZ, ActionType.CHI]];
			break;
		case ActionType.PENG:
			actionDetects = [[PatternType.XXX, ActionType.PENG]];
			break;
		case ActionType.MING_GANG:
			actionDetects = [[PatternType.XXXX, ActionType.MING_GANG]];
			break;
		case ActionType.AN_GANG:
			actionDetects = [[PatternType.YYYY, ActionType.AN_GANG]];
			break;
		case ActionType.FANG_GANG:
			actionDetects = [[PatternType.ZZZZ, ActionType.FANG_GANG]];
			break;
		case ActionType.HU:
			actionDetects = this.actionDetectsHu;
			break;
		default :
			actionDetects = this.actionDetectsAll;
			break;
	}
	var huArr = [];
	for (var i = 0; i < actionDetects.length; ++i) {
		var conf = actionDetects[i];
		var patternType = conf[0];
		var actionType = conf[1];
		var pattern = this.patterns[patternType];
		if (pattern == null) {
			throw new Error('unknown pattern type ' + patternType);
		}
		if (!pattern.check(opts)) {
			continue;
		}
		var arr = pattern.find(playerCard, opts);
		if (arr.length > 0) {
			if (actionType == ActionType.HU) {
				huArr.push(arr);
			} else {
				retArr.push([actionType, arr]);
			}
		}
	}
	if (huArr.length > 0) {
		retArr.push([ActionType.HU, huArr]);
	}
	return retArr;
};

/**
 * 检查结果
 * @param {Array} result
 * @param {Array} cards
 * @return {Boolean}
 */
GameUtil.prototype.checkResult = function (result, cards) {
	if (result == null) {
		throw new Error('param result is null');
	}
	if (result.length == 0) {
		return false;
	}
	var cards2 = cards.slice();
	var str = cards2.sort().toString();
	for (var i = 0; i < result.length; ++i) {
		var arr = result[i][1];
		for (var j = 0; j < arr.length; ++j) {
			var arr2 = arr[j];
			if (arr2.length != cards2.length) {
				continue;
			}
			if (arr2.slice().sort().toString() == str) {
				return true;
			}
		}
	}
	return false;
};

/**
 * 计算胡牌分数
 * @param {Number} pos 座位编号
 * @param {PlayerCard} playerCard
 * @param {Array|null} playerResult 胡牌结果
 * @param {Array} scoreRatios 玩家计分倍数数组
 * @param {Array} playerScores 玩家分数数组
 * @return {Object}
 */
GameUtil.prototype.calcScore = function (pos, playerCard, playerResult, scoreRatios, playerScores) {
	var playerNum = playerScores.length;
	var responseCards = playerCard.getResponseCards();
	var score, score2;
	var responseCount = 0; // 响应牌计数(不含暗杠)
	for (var i = 0; i < responseCards.length; ++i) { // 计算杠分
		var arr = responseCards[i];
		var actionType = arr[0];
		var opts = arr[2]; // 杠选项
		if (actionType != ActionType.AN_GANG) {
			++responseCount;
		}
		switch (actionType) {
			case ActionType.MING_GANG: // 明杠
			case ActionType.AN_GANG: // 暗杠
				if (!opts.valid) { // 杠无效
					continue;
				}
				score = (actionType == ActionType.AN_GANG) ? 2 : 1;
				for (var j = 0; j < playerNum; ++j) {
					if (j != pos) {
						score2 = score * Math.pow(2, scoreRatios[pos] + scoreRatios[j]);
						playerScores[pos] += score2;
						playerScores[j] -= score2;
					}
				}
				break;
			case ActionType.FANG_GANG: // 放杠
				if (!opts.valid) { // 杠无效
					continue;
				}
				var dstPos = opts.pos; // 放杠人的座位编号
				score = 1;
				score2 = score * Math.pow(2, scoreRatios[pos] + scoreRatios[dstPos]);
				score2 *= (playerNum - 1);
				playerScores[pos] += score2;
				playerScores[dstPos] -= score2;
				break;
		}
	}
	if (playerResult == null) { // 没胡牌
		return;
	}
	var color = this.getCardsColor(playerCard);
	var maxScore = 0;
	var result = playerResult[0];
	for (var i = 0; i < result.length; ++i) {
		var arr2 = result[i];
		var actionType = arr2[0];
		if (actionType != ActionType.HU) {
			continue;
		}
		var patternTypes = arr2[1];
		for (var k = 0; k < patternTypes.length; ++k) {
			var patternType = patternTypes[k][0];
			score = this.calcHuBaseScore(color, patternType, responseCount);
			maxScore = Math.max(score, maxScore); // 取最大分
		}
	}
	score = maxScore;
	var lastAction = playerResult[1];
	var actionType = lastAction.type;
	switch (actionType) {
		case ActionType.FETCH: // 自摸
		case ActionType.MING_GANG: // 抢明杠胡
		case ActionType.AN_GANG: // 抢暗杠胡
		case ActionType.FANG_GANG: // 抢放杠胡
			// 自己加分,其他人都扣分
			for (var j = 0; j < playerNum; ++j) {
				if (j != pos) {
					score2 = score * Math.pow(2, scoreRatios[pos] + scoreRatios[j]);
					playerScores[pos] += score2;
					playerScores[j] -= score2;
				}
			}
			break;
		case ActionType.SHOW: // 放炮
			// 胡牌人加分,放炮人扣分,其他人分数不变
			var dstPos = lastAction.pos; // 放炮人坐位编号
			score2 = score * Math.pow(2, scoreRatios[pos] + scoreRatios[dstPos]);
			score2 *= (playerNum - 1);
			playerScores[i] += score2;
			playerScores[dstPos] -= score2;
			break;
		default :
			throw new Error('invalid action type ' + actionType);
	}
};

/**
 * 获取胡牌颜色
 * @param {PlayerCard} playerCard
 * @return {Number} 0=混色,1=青一色,2=风一色
 */
GameUtil.prototype.getCardsColor = function (playerCard) {
	var leftCards = playerCard.getLeftCards();
	var types = {};
	for (var i = 0; i < leftCards.length; ++i) {
		var type = this.getCardType(leftCards[i]);
		types[type] = 1;
	}
	if (Object.keys(types).length > 1) { // 混色
		return 0;
	}
	var responseCards = playerCard.getResponseCards();
	for (var i = 0; i < responseCards.length; ++i) {
		var cards = responseCards[i][1];
		for (var j = 0; j < cards.length; ++j) {
			var type = this.getCardType(cards[j]);
			types[type] = 1;
		}
	}
	if (Object.keys(types).length > 1) { // 混色
		return 0;
	}
	if (types[4] == null) { // 青一色
		return 1;
	} else { // 风一色
		return 2;
	}
};

/**
 * 获取指定牌的类型
 * @param {Number} card
 * @return {Number} 1=万子,2=条子,3=饼子,4=风子
 */
GameUtil.prototype.getCardType = function (card) {
	card = Number(card);
	if (card >= Card.WZ_1 && card <= Card.WZ_9) {
		return 1;
	} else if (card >= Card.TZ_1 && card <= Card.TZ_9) {
		return 2;
	} else if (card >= Card.BZ_1 && card <= Card.BZ_9) {
		return 3;
	} else {
		return 4;
	}
};

/**
 * 计算胡牌基础数
 * @param {Number} color 胡牌颜色(0=混色,1=青一色,2=风一色)
 * @param {Number} patternType 牌型
 * @param {Number} responseCount 响应牌次数(不含暗杠)
 * @return {Number}
 */
GameUtil.prototype.calcHuBaseScore = function (color, patternType, responseCount) {
	if (color == 2) { // 风一色
		return 24;
	}
	switch (patternType) {
		case PatternType.HU_13YAO: // 13幺
			return 24;
		case PatternType.HU_7XIAODUI: // 7小对
			if (color == 1) { // 青一色
				return 16;
			} else {
				return 8;
			}
		case PatternType.HU_LONG7DUI: // 龙七对
			return 16;
		case PatternType.HU_DADUIPENG: // 大对碰
			if (color == 1) { // 青一色
				return 16;
			} else {
				return 8;
			}
		case PatternType.HU_OTHER:
			if (color == 1) { // 青一色
				return 8;
			} else if (responseCount == 0) { // 门前清
				return 4;
			} else { // 平胡
				return 2;
			}
		default :
			throw new Error('unknown pattern type ' + patternType);
	}
};
