/**
 * 胡牌牌型(13幺)
 * @author ""
 */

var Card = require('../constant/card.js');
var PatternType = require('../constant/pattern-type.js');
var ActionType = require('../constant/action-type.js');

module.exports = PatternHu13yao;

/**
 * 构造函数
 */
function PatternHu13yao() {
	this.num = 14;
	this.cards = {};
	this.cards[Card.WZ_1] = 1;
	this.cards[Card.WZ_9] = 1;
	this.cards[Card.TZ_1] = 1;
	this.cards[Card.TZ_9] = 1;
	this.cards[Card.BZ_1] = 1;
	this.cards[Card.BZ_9] = 1;
	this.cards[Card.DF] = 1;
	this.cards[Card.NF] = 1;
	this.cards[Card.XF] = 1;
	this.cards[Card.BF] = 1;
	this.cards[Card.HZ] = 1;
	this.cards[Card.FC] = 1;
	this.cards[Card.BB] = 1;
}

/**
 * 检查是否满足条件
 * @param {Object} opts 选项
 * @return {Array}
 */
PatternHu13yao.prototype.check = function (opts) {
	var config = opts.config;
	if (!config.canHu13Yao) { // 不能胡13幺
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
PatternHu13yao.prototype.find = function (playerCard, opts) {
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
		case ActionType.AN_GANG: // 开暗杠
			if (!config.canHuAnGangCard) { // 不能抢暗杠胡
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
		if (this.cards[cards[i]]) {
			obj[cards[i]] = 1;
		}
	}
	if (Object.keys(obj).length != this.num - 1) {
		return [];
	} else {
		return [PatternType.HU_13YAO];
	}
};