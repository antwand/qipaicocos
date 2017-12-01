/**
 * 胡牌牌型(七小对/龙七对)
 * @author ""
 */

var PatternType = require('../constant/pattern-type.js');
var ActionType = require('../constant/action-type.js');

module.exports = PatternHu7xiaodui;

/**
 * 构造函数
 */
function PatternHu7xiaodui() {
	this.num = 14;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternHu7xiaodui.prototype.check = function (opts) {
	// find里处理了,这里直接返回true
	return true;
};

/**
 * 找出所有符合牌型的组合
 * @param {PlayerCard} playerCard 玩家的牌实例
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternHu7xiaodui.prototype.find = function (playerCard, opts) {
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
	if (cards.length < this.num) {
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
	for (var k in obj) {
		if (obj[k] != 2 && obj[k] != 4) {
			return [];
		}
	}
	if (Object.keys(obj).length == 7) { // 七小对
		return [PatternType.HU_7XIAODUI];
	}
	return [PatternType.HU_LONG7DUI]; // 龙七对
};