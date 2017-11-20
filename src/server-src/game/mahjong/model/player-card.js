/**
 * 玩家的牌
 * @author ""
 */
module.exports = PlayerCard;

/**
 * 构造函数
 */
function PlayerCard() {
	this.leftCards = []; // 剩余的牌
	this.shownCards = []; // 已经出过的牌
	this.responseCards = []; // 已经响应过的牌(如吃、碰、杠过的牌等)
}

/**
 * 设置剩余的牌
 * @param {Array} leftCards
 */
PlayerCard.prototype.setLeftCards = function (leftCards) {
	this.leftCards = leftCards;
};

/**
 * 获取剩余的牌
 * @param {Boolean} sort 是否排序
 * @return {Array}
 */
PlayerCard.prototype.getLeftCards = function (sort) {
	if (sort) {
		this.leftCards.sort();
	}
	return this.leftCards;
};

/**
 * 追加指定的牌到剩余的牌
 * @param {Number|Array} cards 单张或多张牌
 */
PlayerCard.prototype.appendToLeftCards = function (cards) {
	if (!Array.isArray(cards)) {
		this.leftCards.push(cards);
	} else {
		for (var i = 0; i < cards.length; ++i) {
			this.leftCards.push(cards[i]);
		}
	}
};

/**
 * 检查给定的牌是否存在剩余的牌中
 * @param {Number|Array} cards 单张或多张牌
 * @return {Boolean}
 */
PlayerCard.prototype.isInLeftCards = function (cards) {
	var cardIdArr = [];
	if (!Array.isArray(cards)) {
		cardIdArr = [cards];
	} else {
		cardIdArr = cards.slice();
	}
	var exists = true;
	var leftCards = this.leftCards.slice(); // clone
	do {
		var found = false;
		var cardId = cardIdArr.shift();
		if (cardId == null) {
			break;
		}
		for (var i = leftCards.length - 1; i >= 0; --i) {
			if (leftCards[i] == cardId) {
				leftCards.splice(i, 1);
				found = true;
				break;
			}
		}
		if (!found) {
			return false;
		}
	} while (cardIdArr.length != 0);
	return exists;
};

/**
 * 将指定的牌从剩余的牌中移除
 * @param {Number|Array} cards 单张或多张牌
 */
PlayerCard.prototype.removeFromLeftCards = function (cards) {
	var cardIdArr = [];
	if (!Array.isArray(cards)) {
		cardIdArr = [cards];
	} else {
		cardIdArr = cards.slice();
	}
	do {
		var cardId = cardIdArr.shift();
		if (cardId == null) {
			break;
		}
		for (var i = this.leftCards.length - 1; i >= 0; --i) {
			if (this.leftCards[i] == cardId) {
				this.leftCards.splice(i, 1);
				break;
			}
		}
	} while (cardIdArr.length != 0);
};

/**
 * 设置已经出过的牌
 * @param {Array} shownCards
 */
PlayerCard.prototype.setShownCards = function (shownCards) {
	this.shownCards = shownCards;
};

/**
 * 获取已经出过的牌
 * @return {Array}
 */
PlayerCard.prototype.getShownCards = function () {
	return this.shownCards;
};

/**
 * 将指定的牌追加到已经出过的牌
 * @param {Number|Array} cards 单张或多张牌
 */
PlayerCard.prototype.appendToShownCards = function (cards) {
	this.shownCards.push(cards);
};

/**
 * 移除最后一张出过的牌
 */
PlayerCard.prototype.removeLastShownCards = function () {
	this.shownCards.pop();
};

/**
 * 设置响应过的牌
 * @param {Array} responseCards
 */
PlayerCard.prototype.setResponseCards = function (responseCards) {
	this.responseCards = responseCards;
};

/**
 * 获取响应过的牌
 * @return {Array}
 */
PlayerCard.prototype.getResponseCards = function () {
	return this.responseCards;
};

/**
 * 将指定的牌追加到响应过的牌
 * @param {Number} type 动作类型(见ActionType)
 * @param {Number|Array} cards 单张或多张牌
 * @param {Object|null} opts 选项(仅后端的杠才需要传)
 * 详细：
 * {Boolean} opts.valid 杠是否有效
 * {Number} opts.pos 放杠的人(仅放杠动作需要传)
 */
PlayerCard.prototype.appendToResponseCards = function (type, cards, opts) {
	cards.sort();
	if (opts == null) {
		this.responseCards.push([type, cards]);
	} else {
		this.responseCards.push([type, cards, opts]);
	}
};

/**
 * 找到指定类型响应过的牌
 * @param {Number} type 动作类型(见ActionType)
 * @param {Number} cardId 单张牌
 * @return {Array|null}
 */
PlayerCard.prototype.findResponseCards = function (type, cardId) {
	for (var i = 0; i < this.responseCards.length; ++i) {
		var arr = this.responseCards[i];
		if (arr[0] == type && arr[1][0] == cardId) {
			return [i, arr]; // 格式：[位置, 响应牌信息]
		}
	}
	return null;
};

/**
 * 更新指定响应过的牌
 * @param {Number} idx
 * @param {Number} type 动作类型(见ActionType)
 * @param {Number|Array} cards 单张或多张牌
 * @param {Object|null} opts 选项(仅后端的杠才需要传)
 * 详细：
 * {Boolean} opts.valid 杠是否有效
 * {Number} opts.pos 放杠的人(仅放杠动作需要传)
 */
PlayerCard.prototype.updateResponseCards = function (idx, type, cards, opts) {
	if (opts == null) {
		this.responseCards[idx] = [type, cards];
	} else {
		this.responseCards[idx] = [type, cards, opts];
	}
};

/**
 * 获取所有的牌(调试用)
 * @return {Object}
 */
PlayerCard.prototype.getAllCards = function () {
	return {
		leftCards: this.leftCards,
		responseCards: this.responseCards,
		shownCards: this.shownCards
	};
};
