/**
 * XXX牌型(三张一样的)
 * @author ""
 */

var ActionType = require('../constant/action-type.js');

module.exports = PatternXXX;

/**
 * 构造函数
 */
function PatternXXX() {
	this.num = 3;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternXXX.prototype.check = function (opts) {
	var myPos = opts.myPos;
	var action = opts.action;
	var actionType = action.type;
	var actionPos = action.pos;
	if (actionType != ActionType.SHOW) { // 不是打的牌
		return false;
	}
	if (myPos == actionPos) { // 不能碰自己的
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
PatternXXX.prototype.find = function (playerCard, opts, card) {
	var needNum = this.num;
	if (card == null) {
		var action = opts.action;
		var actionCards = action.cards;
		card = actionCards[0];
		--needNum;
	}
	var cards = playerCard.getLeftCards();
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