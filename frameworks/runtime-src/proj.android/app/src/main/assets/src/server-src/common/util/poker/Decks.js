/**
 * 外部使用：
 *    var numberOfDecks = 1;//当前为几副牌
 *    this.decks = new Decks(numberOfDecks);
 *
 *    随机获取一张牌 ：
 *     this.decks.draw();
 *     获取桌上还没发的牌：
 *     this.decks.getCardIds();
 *    打乱重新使用整副牌：
 *     this.decks.reset();


 * @author antwand@sina.com
 * @type {{}}
 */

var Poker = require('Poker');

/**
 * 扑克管理类，用来管理一副或多副牌
 * @class Decks
 * @constructor
 * @param {number} numberOfDecks - 总共几副牌
 */
function Decks (numberOfDecks) {
    // 总共几副牌
    this._numberOfDecks = numberOfDecks;
    // 还没发出去的牌
    this._pokerIds = new Array(numberOfDecks * 52);

    this.reset();
}

/**
 * 重置所有牌
 * @method reset
 */
Decks.prototype.reset = function () {
    this._pokerIds.length = this._numberOfDecks * 52;
    var index = 0;
    var fromId = Poker.fromId;
    for (var i = 0; i < this._numberOfDecks; ++i) {
        for (var pokerId = 0; pokerId < 52; ++pokerId) {
            this._pokerIds[index] = fromId(pokerId);//赋值
            ++index;
        }
    }
};

/**
 * 随机抽一张牌，如果已经没牌了，将返回 null
 * @method draw
 * @return {Card}
 */
Decks.prototype.draw = function () {
    var pokerIds = this._pokerIds;
    var len = pokerIds.length;
    if (len === 0) {
        return null;
    }

    var random = Math.random();
    var index = (random * len) | 0;
    var result = pokerIds[index];

    // 保持数组紧凑
    var last = pokerIds[len - 1];
    pokerIds[index] = last;
    pokerIds.length = len - 1;

    return result;
};





/**
 * 获取桌上剩余的所有牌
 */
//Decks.prototype.getCardIds= function () {
//    return this._cardIds;
//};
///**
// * 发一张牌
// * @method deal
// * @return {Card}
// */
//Decks.prototype.deal = function () {
//    this._cardIds.pop();
//};
///**
// * 洗牌
// * @method shuffle
// */
//Decks.prototype.shuffle = function () {
//    shuffleArray(this._cardIds);
//};
//
///**
// * Randomize array element order in-place.
// * Using Durstenfeld shuffle algorithm.
// * http://stackoverflow.com/a/12646864
// */
//function shuffleArray(array) {
//    for (var i = array.length - 1; i > 0; i--) {
//        var j = (Math.random() * (i + 1)) | 0;
//        var temp = array[i];
//        array[i] = array[j];
//        array[j] = temp;
//    }
//    return array;
//}

module.exports = Decks;
