/**
 * 胡牌牌型(大对碰)
 * @author ""
 */

var PatternType = require('../constant/pattern-type.js');
var ActionType = require('../constant/action-type.js');

module.exports = PatternHuDaduipeng;

/**
 * 构造函数
 */
function PatternHuDaduipeng() {
	this.num = 14;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternHuDaduipeng.prototype.check = function (opts) {
	// find里处理了,这里直接返回true
	return true;
};

/**
 * 找出所有符合牌型的组合
 * @param {PlayerCard} playerCard 玩家的牌实例
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternHuDaduipeng.prototype.find = function (playerCard, opts) {
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
	var obj = {};
	for (var i = 0; i < cards.length; ++i) {
		if (obj[cards[i]]) {
			obj[cards[i]] += 1;
		} else {
			obj[cards[i]] = 1;
		}
	}
	var count = 0;
	for (var k in obj) {
		if (obj[k] == 2) { // 是将
			++count;
			continue;
		}
		if (obj[k] != 3) {
			return [];
		}
	}
	if (count != 1) { // 只能有一对将
		return [];
	}
	var cards2 = playerCard.getResponseCards();
	for (var i = 0; i < cards2.length; ++i) {
		var arr = cards2[i];
		if (arr[0] != ActionType.PENG && arr[0] != ActionType.MING_GANG
				&& arr[0] != ActionType.AN_GANG && arr[0] != ActionType.FANG_GANG) {
			return [];
		}
	}
	return [PatternType.HU_DADUIPENG];
};