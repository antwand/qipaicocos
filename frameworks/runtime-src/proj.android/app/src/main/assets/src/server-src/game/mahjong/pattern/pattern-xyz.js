/**
 * XYZ牌型(三张连续的)
 * @author ""
 */

var ActionType = require('../constant/action-type.js');

module.exports = PatternXYZ;

/**
 * 构造函数
 */
function PatternXYZ() {
	this.num = 3;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternXYZ.prototype.check = function (opts) {
	var config = opts.config;
	var myPos = opts.myPos;
	var action = opts.action;
	var actionType = action.type;
	var actionPos = action.pos;
	if (!config.canChi) { // 不允许吃
		return false;
	}
	if (actionType != ActionType.SHOW) { // 不是打的牌
		return false;
	}
	if (myPos != ((actionPos + 1) % config.maxPlayerNum)) { // 不能吃非上家的
		return false;
	}
	return true;
};

/**
 * 找出所有符合牌型的组合
 * @param {PlayerCard} playerCard 玩家的牌实例
 * @param {Object} opts 选项
 * @param {Number|null} card 单张牌(仅其他胡牌型检测时才需要传)
 * @return {Array}
 */
PatternXYZ.prototype.find = function (playerCard, opts, card) {
	if (card == null) {
		var action = opts.action;
		var actionCards = action.cards;
		card = actionCards[0];
	}
	card = Number(card);
	var cards = playerCard.getLeftCards();
	var needNum = this.num - 1;
	if (cards.length < needNum) {
		return [];
	}
	var obj = {};
	for (var i = 0; i < cards.length; ++i) {
		if (cards[i] != card) {
			obj[cards[i]] = 1;
		}
	}
	var cards2 = Object.keys(obj);
	if (cards2.length < needNum) {
		return [];
	}
	cards2.sort();
	for (var i = 0; i < cards2.length; ++i) {
		cards2[i] = Number(cards2[i]);
	}
	var i = 0;
	var arr = [];
	do {
		if (i > cards2.length - 2) {
			break;
		}
		if (cards2[i] == card - 2 && cards2[i + 1] == card - 1) {
			arr.push(cards2.slice(i, i + 2));
		} else if (cards2[i] == card - 1 && cards2[i + 1] == card + 1) {
			arr.push(cards2.slice(i, i + 2));
		} else if (cards2[i] == card + 1 && cards2[i + 1] == card + 2) {
			arr.push(cards2.slice(i, i + 2));
		}
		++i;
	} while (true);
	return arr;
};