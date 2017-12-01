/**
 * ZZZZ牌型(四张一样的,放杠)
 * @author ""
 */

var ActionType = require('../constant/action-type.js');

module.exports = PatternZZZZ;

/**
 * 构造函数
 */
function PatternZZZZ() {
	this.num = 4;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternZZZZ.prototype.check = function (opts) {
	var myPos = opts.myPos;
	var action = opts.action;
	var actionType = action.type;
	var actionPos = action.pos;
	if (actionType != ActionType.SHOW) { // 不是打的牌
		return false;
	}
	if (myPos == actionPos) { // 是自己
		return false;
	}
	return true;
};

/**
 * 找出所有符合牌型的组合
 * @param {PlayerCard} playerCard 玩家的牌实例
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternZZZZ.prototype.find = function (playerCard, opts) {
	var action = opts.action;
	var actionCards = action.cards;
	var card = actionCards[0];
	var cards = playerCard.getLeftCards();
	var needNum = this.num - 1;
	if (cards.length < needNum) {
		return [];
	}
	var arr = [];
	for (var i = 0; i < cards.length; ++i) {
		if (cards[i] == card) {
			arr.push(cards[i]);
		}
	}
	if (arr.length < needNum) {
		return [];
	} else {
		return [arr.slice(0, needNum)];
	}
};