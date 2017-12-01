
var Suit = cc.Enum({
    Spade: 1,   // 黑桃
    Heart: 2,   // 红桃
    Club: 3,    // 梅花(黑)
    Diamond: 4, // 方块(红)
});
//十三张牌  1-13
var A2_10JQK = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');


/**
 * 扑克牌类，只用来表示牌的基本属性，不包含游戏逻辑，所有属性只读，
 * 因此全局只需要有 52 个实例（去掉大小王），不论有多少副牌
 * @class Poker
 * @constructor
 * @param {Number} point - 可能的值为 1 到 13
 * @param {Suit} suit
 */
function Poker (point, suit) {
    Object.defineProperties(this, {
        point: {
            value: point,
            writable: false
        },
        suit: {
            value: suit,
            writable: false
        },
        /**
         * @property {Number} id - 可能的值为 0 到 51
         */
        id: {
            value: (suit - 1) * 13 + (point - 1),
            writable: false
        },
        //牌点 A-k
        pointName: {
            get: function () {
                return A2_10JQK[this.point];
            }
        },
        //牌花
        suitName: {
            get: function () {
                return Suit[this.suit];
            }
        },

        ////当前花色是 梅花或者黑桃
        //isBlackSuit: {
        //    get: function () {
        //        return this.suit === Suit.Spade || this.suit === Suit.Club;
        //    }
        //},
        ////当前花色红桃或者方块
        //isRedSuit: {
        //    get: function () {
        //        return this.suit === Suit.Heart || this.suit === Suit.Diamond;
        //    }
        //},
        //获取虚拟点数 1-10  其中JQK = 10点
        virtualPoint:{
            get: function () {
                if(this.point>10){
                    return 10;
                }
                return this.point
            }
        },
    });
}

//调试显示 当前card的花数以及点数
Poker.prototype.toString = function () {
    return this.suitName + ' ' + this.pointName;
};










///////////////////////////////////private///////////////////////////////////////////////////////////////////////

// 存放 52 张扑克的实例
var pokers = new Array(52);

// 初始化所有扑克牌
(function createPokerss () {
    for (var s = 1; s <= 4; s++) {
        for (var p = 1; p <= 13; p++) {
            var poker = new Poker(p, s);
            pokers[pokers.id] = poker;

            cc.log("one poker :"+ poker.toString());
        }
    }
})();




//////////////////////////////exports/////////////////////////////////////////
/**
 * 返回指定 id 的实例
 * @param {Number} id - 0 到 51
 */
Poker.fromId = function (id) {
    return pokers[id];
};

/**
 *  通过id 获取卡牌的 花色和点
 * @param id
 * @returns {*[]}
 */
Poker.getSuitPointById = function(id){
    var p = id %13 + 1;
    var s = (id - (p -1))/13 +1;
    return [s,p];
}


module.exports = Poker;

//module.exports = {
//    Suit: Suit,
//    Poker:Poker,
//};