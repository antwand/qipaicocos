/**
 * YYYY牌型(四张一样的,暗杠)
 * @author ""
 */

var ActionType = require('../constant/action-type.js');

module.exports = PatternYYYY;

/**
 * 构造函数
 */
function PatternYYYY() {
	this.num = 4;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternYYYY.prototype.check = function (opts) {
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
PatternYYYY.prototype.find = function (playerCard, opts) {
	var action = opts.action;
	var cards = playerCard.getLeftCards();
	var retArr = [];
	var obj = {};
	for (var i = 0; i < cards.length; ++i) {
		if (obj[cards[i]]) {
			obj[cards[i]] += 1;
		} else {
			obj[cards[i]] = 1;
		}
	}
	for (var id in obj) {
		var id2 = Number(id); // 转成Number
		if (obj[id2] == 4) {
			retArr.push([id2, id2, id2, id2]);
		}
	}
	return retArr;
};