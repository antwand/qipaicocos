/**
 * XXXX牌型(四张一样的,明杠)
 * @author ""
 */

var ActionType = require('../constant/action-type.js');

module.exports = PatternXXXX;

/**
 * 构造函数
 */
function PatternXXXX() {
	this.num = 4;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternXXXX.prototype.check = function (opts) {
	var myPos = opts.myPos;
	var action = opts.action;
	var actionType = action.type;
	var actionPos = action.pos;
	if (actionType != ActionType.FETCH) { // 不是抓的牌
		return false;
	}
	if (myPos != actionPos) { // 不是自己
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
PatternXXXX.prototype.find = function (playerCard, opts) {
	var retArr = [];
	var cards = playerCard.getLeftCards();
	for (var i = 0; i < cards.length; ++i) {
		var card = cards[i];
		var arr = playerCard.findResponseCards(ActionType.PENG, card);
		if (arr != null) {
			retArr.push([card]);
		}
	}
	return retArr;
};