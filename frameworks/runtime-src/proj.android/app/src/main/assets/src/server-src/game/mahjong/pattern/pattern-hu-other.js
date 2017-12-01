/**
 * 胡牌牌型(其他)
 * @author ""
 */

var PatternType = require('../constant/pattern-type.js');
var PlayerCard = require('../model/player-card.js');
var ActionType = require('../constant/action-type.js');

module.exports = PatternHuOther;

/**
 * 构造函数
 */
function PatternHuOther() {
	this.num = 14;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternHuOther.prototype.check = function (opts) {
	// find里处理了,这里直接返回true
	return true;
};

/**
 * 找出所有符合牌型的组合
 * @param {PlayerCard} playerCard 玩家的牌实例
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternHuOther.prototype.find = function (playerCard, opts) {
	var config = opts.config;
	var myPos = opts.myPos;
	var action = opts.action;
	var actionType = action.type;
	var lastType = action.last;
	var actionPos = action.pos;
	var actionCards = action.cards;
	var leftCards = playerCard.getLeftCards();
	var cards = leftCards.slice();
	switch (actionType) {
		case ActionType.FETCH: // 抓的牌
			if (myPos != actionPos) { // 不是自摸
				return [];
			}
			break;
		case ActionType.MING_GANG: // 开明杠
			if (!config.canHuMingGangCard) { // 不能抢明杠胡
				return [];
			}
			if (myPos == actionPos) { // 自己开的杠
				return [];
			}
			cards.push(actionCards[0]);
			break;
		case ActionType.FANG_GANG: // 放杠
			if (!config.canHuFangGangCard) { // 不能抢放杠胡
				return [];
			}
			if (myPos == actionPos) { // 自己开的杠
				return [];
			}
			cards.push(actionCards[0]);
			break;
		case ActionType.SHOW: // 打出的牌
			if (!config.canHuGangShowCard) { // 不能点炮胡
				return [];
			}
			if (lastType != ActionType.MING_GANG && lastType != ActionType.AN_GANG) { // 不是明暗杠打出的字
				return [];
			}
			if (myPos == actionPos) { // 自己打出的
				return [];
			}
			cards.push(actionCards[0]);
			break;
		default :
			return [];
	}
	var cardNumMap = this.getValNumMap(cards);
	var playerCard2 = new PlayerCard();
	for (var card2 in cardNumMap) {
		if (cardNumMap[card2] < 2) { // 大于等于两张的,才可以做将
			continue;
		}
		playerCard2.setLeftCards(cards.slice());
		// 移除将(两张)
		playerCard2.removeFromLeftCards(card2);
		playerCard2.removeFromLeftCards(card2);
		var result = this.find2(playerCard2, opts);
		if (result.length > 0) {
			return result;
		}
	}
	return [];
};


/**
 * 查找剩余牌是否能胡牌
 * @param {PlayerCard} playerCard
 * @param {Object} opts
 * @return {Array}
 */
PatternHuOther.prototype.find2 = function (playerCard, opts) {
	var leftCards = playerCard.getLeftCards();
	if (leftCards.length == 0) { // 没剩余牌,胡了
		return [PatternType.HU_OTHER];
	}
	var card = leftCards[0]; // 挑剩余牌里的第一张
	var patterns = opts.patterns || [];
	for (var i = 0; i < patterns.length; ++i) {
		var pattern = patterns[i];
		var arr = pattern.find(playerCard, opts, card);
		if (arr.length == 0) { // 一种组合也没找到
			continue;
		}
		for (var j = 0; j < arr.length; ++j) {
			playerCard.removeFromLeftCards(card);
			playerCard.removeFromLeftCards(arr[j]);
			var result = this.find2(playerCard, opts);
			if (result.length > 0) {
				return result;
			}
		}
	}
	return []; // 所的牌型都检查过了,没找到一种胡牌的方案
};

/**
 * 获取指定数组值与个数组成的map
 * @param {Array} arr 数组
 * @return {Object}
 */
PatternHuOther.prototype.getValNumMap = function (arr) {
	var obj = {};
	for (var i = 0; i < arr.length; ++i) {
		if (obj[arr[i]]) {
			obj[arr[i]] += 1;
		} else {
			obj[arr[i]] = 1;
		}
	}
	return obj;
};

/**
 * 将指定数组中的元素去重
 * @param {Array} arr 数组
 * @return {Array}
 */
PatternHuOther.prototype.getUniqueVals = function (arr) {
	var obj = {};
	for (var i = 0; i < arr.length; ++i) {
		obj[arr[i]] = 1;
	}
	return Object.keys(obj);
};