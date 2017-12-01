/**
 *  每一个牌局
 *
 * @type {Round}
 */
module.exports = Round;

/**
 * 构造函数
 * @param {Number} id
 * @param {Object|null} opts
 */
function Round(id, opts) {
    opts = opts || {};
    this.id = this.rdid = this.roundId = this.round_id = this.roundID  = id // roundId 牌局ID

    this.banker_id= opts.banker_id//"GIMXDpPzfJWFqL7XAAAA"//庄家的用户id
    this.round= opts.round//当前第几局


    this.status = opts.status // 当前状态 详见  game-status.js



    // this.roomid = null//当前round对应的房间id
    // this.seatPlayerIds=[]//所有坐下来的用户信息
    // this.WatcherIds=[]//所有坐下来的用户信息


    // this.gameConfig=null//当前牌局的配置数据
    // this.cmdsRecord = [];//记录当前round牌局的cmd命令流程

    // ....
}



///**
// * Round
// * Created by root on 2016/1/15.
// */
//var underscore_min= require('underscore-min');
//var player_card_client = require('player_card_client');
//var RoomList = require('RoomList');
//var UserList = require('UserList');
//
//var Round = {
//    seatPlayer_player_card :[],//坐下的人的四个 player_card_client.js 对象
//    dealerPos:0,//庄家
//    round:0,//当前是第几牌局
//
//
//
//
//    //下面是一些临时存储的变量
//    _myPos:-1,//我的pos位置
//
//
//    //---------- 游戏局过程中的临时变量 -----------------------
//    _playstate:-1,//当前状态
//    _pos:-1,//-1表示当前准备的pos 所有人都得准备  （0,1,2,3）
//}
//
//
//
//
////设置新的牌局
////@param  {"cmd":"gameInitPush","ret":0,"msg":"success","data":{"cards":[209,304,202,301,206,102,106,309,302,107,201,301,307,206],"dealer":0,"round":0}}
//Round.setRound = function(data,parent){
//
//    underscore_min.each(data, function (v, k) {
//        console.log("Round 数据初始化：k:"+k +",v:"+v);
//        if(k != "cards")
//            Round[k] = v;
//    });
//    Round.seatPlayer_player_card.length =0;
//
//
//    //设置剩余的牌
//    var room = RoomList.getRoomByRoomId(RoomList.meId);
//    for(var i= 0;i<room.seatPlayerIds.length;i++){
//        var oneseatPlayerId = room.seatPlayerIds[i];
//
//        var onePlayerCard = new player_card_client();
//        onePlayerCard.init(parent,i);
//        if (oneseatPlayerId == UserList.meId){//和我的一样
//            onePlayerCard.leftCards = data.cards;
//            Round._myPos = i;//设置我的位置
//        }else{
//            onePlayerCard.leftCards =[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
//            if(Round.dealerPos == i){//庄家多一张牌
//                onePlayerCard.leftCards.push(-1);
//            }
//        }
//        onePlayerCard.shownCards = []; // 已经出过的牌
//        onePlayerCard.responseCards = []; // 已经响应过的牌(如麻将中的碰、吃、杠过的牌等)
//        Round.seatPlayer_player_card.push(onePlayerCard)
//    }
//}
//
//
//
////设置当前局 新的状态
//Round.setPlaystate = function(pos,playstate){
//    this._playstate = playstate;
//    this._pos = pos;
//}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//// ------------------------------- 一些基础工具类  -------------------------------------------------------------------------------------------------------
//
///**
// *  通过pos 获取 sitpos
// * @param pos
// */
//Round.getSitposBypos= function(pos){
//    var seatPlayer_player_card = Round.seatPlayer_player_card;
//    var oneseatPlayer_player_card = seatPlayer_player_card[pos];
//    var sitPos =oneseatPlayer_player_card.sitPos;//自己的座位号  以自己为0点 开始逆时针数
//
//   return parseInt(sitPos);
//}
///**
// *  通过 sitpos 获取  pos
// * @param pos
// */
//Round.getposBySitpos= function(sitPos){
//    var seatPlayer_player_card = Round.seatPlayer_player_card;
//
//    for(var i=0;i<seatPlayer_player_card.length;i++){
//        var oneseatPlayer_player_card = seatPlayer_player_card[i];
//        var currentSitPos =oneseatPlayer_player_card.sitPos;//自己的座位号  以自己为0点 开始逆时针数
//
//        if(currentSitPos == sitPos){
//            return i;
//            break;
//        }
//    }
//}
//
//
//
//
//Round.PLAYSTATE_TYPE = {
//    NONE :"NONE",
//    SHOW:"SHOW",//出牌状态
//    SHOW_END:"SHOW_END",//出牌完毕
//
//    TING:"TING",//听牌  // TING_END:"TING_END",//听牌完毕
//}
//Round.DISPLAY_CARD_TYPE = {
//    fetchCards:"fetchCards",
//    leftCards : "leftCards",
//    shownCards : "shownCards",
//    responseCards: "responseCards"//已经响应过的牌(如麻将中的碰、吃、杠过的牌等)
//};
//
//
//
//
//
//
//
//
//
//
//// _________________ gameaction的操作动作  __________________________________________________________________________________________________________________________________________
//
//
/////**
//// *  谁出了牌  需要更新数据层的东西
//// * @param pos
//// * @private
//// */
////Round.__gameActionPushResponse_show = function(script_pokerMaJiang,newscript_pokerMaJiang,pos){
////    var seatPlayer_player_card = Round.seatPlayer_player_card;
////    var currentseatPlayer_player_card = seatPlayer_player_card[pos];
////
////
////
////    var leftCards = currentseatPlayer_player_card.leftCards;
////    var leftCards_view = currentseatPlayer_player_card.leftCards_view;
////    for(var i = 0;i<leftCards_view.length;i++){
////        var oneleftCards_view = leftCards_view[i];
////        if(oneleftCards_view == script_pokerMaJiang){//找到了这个对象
////
////
////            console.log("__gameActionPushResponse_show当前比对的是=》  leftCards: " + leftCards[i] + ",oneleftCards_view._pokerid:"+oneleftCards_view._pokerid)
////            //if(oneleftCards_view._pokerid == leftCards[i]) {//确实是同一个元素 因为你出牌的时候 看到对方的
////                leftCards_view.splice(i, 1);
////                leftCards.splice(i, 1);
////
////                //存储到新的地方
////                currentseatPlayer_player_card.shownCards.push(newscript_pokerMaJiang._pokerid)
////                currentseatPlayer_player_card.shownCards_view.push(newscript_pokerMaJiang)
////            //}else{
////            //    throw "Round.__gameActionPushResponse_show line 148  is error ";
////            //}
////
////            break;
////        }
////    }
////}
////
////
/////**
//// *  抓牌操作
//// * @param newscript_pokerMaJiang
//// * @param pos
//// * @private
//// */
////Round.__gameActionPushResponse_fetch = function(newscript_pokerMaJiang,pos){
////    var seatPlayer_player_card = Round.seatPlayer_player_card;
////    var currentseatPlayer_player_card = seatPlayer_player_card[pos];
////
////    currentseatPlayer_player_card.leftCards.push(newscript_pokerMaJiang._pokerid);
////    currentseatPlayer_player_card.leftCards_view.push(newscript_pokerMaJiang);
////}
////
////
////
////
////
/////**
//// *   碰牌的三张操作
//// * @param arr
//// * @private
//// */
////Round.__gameActionPushResponse_PENG = function(pos,arr){
////    var seatPlayer_player_card = Round.seatPlayer_player_card;
////    var currentseatPlayer_player_card = seatPlayer_player_card[pos];
////
////    var responseCards = currentseatPlayer_player_card.responseCards;
////    var responseCards_view = currentseatPlayer_player_card.responseCards_view;
////
////    var lastShowscript_pokerMaJiang = arr[0];
////
////
////    //吧自己的两张牌拿走
////    for(var j=1;i<arr.length;j++){
////        Round.__gameActionPushResponse_cut (Round.DISPLAY_CARD_TYPE.leftCards,pos,arr[j]);
////    }
////
////
////    //插进自己的碰杠牌中
////    for(var i =0;i<arr.length;i++){
////        var oneArr = arr[i];
////        responseCards.push(oneArr._pokerid)
////        responseCards_view.push(oneArr)
////    }
////
////}
////
////
/////**
//// *   吃牌的三张操作
//// * @param arr
//// * @private
//// */
////Round.__gameActionPushResponse_CHI = function(pos,arr){
////    var seatPlayer_player_card = Round.seatPlayer_player_card;
////    var currentseatPlayer_player_card = seatPlayer_player_card[pos];
////
////    var responseCards = currentseatPlayer_player_card.responseCards;
////    var responseCards_view = currentseatPlayer_player_card.responseCards_view;
////
////    var lastShowscript_pokerMaJiang = arr[0];
////
////
////    //吧自己的两张牌拿走
////    for(var j=1;i<arr.length;j++){
////        Round.__gameActionPushResponse_cut (Round.DISPLAY_CARD_TYPE.leftCards,pos,arr[j]);
////    }
////
////
////    //插进自己的碰杠牌中
////    for(var i =0;i<arr.length;i++){
////        var oneArr = arr[i];
////        responseCards.push(oneArr._pokerid)
////        responseCards_view.push(oneArr)
////    }
////
////}
////
////
/////**
//// *   明杠 三张牌的操作
//// * @param arr
//// * @private
//// */
////Round.__gameActionPushResponse_MING_GANG = function(pos,arr){
////    var seatPlayer_player_card = Round.seatPlayer_player_card;
////    var currentseatPlayer_player_card = seatPlayer_player_card[pos];
////
////    var responseCards = currentseatPlayer_player_card.responseCards;
////    var responseCards_view = currentseatPlayer_player_card.responseCards_view;
////
////    var lastShowscript_pokerMaJiang = arr[0];
////
////
////    //吧自己的两张牌拿走
////    for(var j=1;i<arr.length;j++){
////        Round.__gameActionPushResponse_cut (Round.DISPLAY_CARD_TYPE.leftCards,pos,arr[j]);
////    }
////
////
////    //插进自己的碰杠牌中
////    for(var i =0;i<arr.length;i++){
////        var oneArr = arr[i];
////        responseCards.push(oneArr._pokerid)
////        responseCards_view.push(oneArr)
////    }
////
////}
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
////
//////-----------------公共操作方法--------------------------------------------------------------------------------------------------------
////
//////吧一张牌从pos地位拿走牌  并吧数据重置
////Round.__gameActionPushResponse_cut = function(mark,pos,script_pokerMaJiang){
////    var seatPlayer_player_card = Round.seatPlayer_player_card;
////    var currentseatPlayer_player_card = seatPlayer_player_card[pos];
////
////    var cardsArr = null;
////    var cardsView = null;
////    if(mark == Round.DISPLAY_CARD_TYPE.leftCards){
////        cardsArr = currentseatPlayer_player_card.leftCards;
////        cardsView = currentseatPlayer_player_card.leftCards_view;
////    }else if(mark ==Round.DISPLAY_CARD_TYPE.shownCards){
////        cardsArr = currentseatPlayer_player_card.shownCards;
////        cardsView = currentseatPlayer_player_card.shownCards_view;
////    }else if(mark ==Round.DISPLAY_CARD_TYPE.responseCards){//已经响应过的牌(如麻将中的碰、吃、杠过的牌等)
////        cardsArr = currentseatPlayer_player_card.responseCards;
////        cardsView = currentseatPlayer_player_card.responseCards_view;
////    }
////
////    for(var i = 0;i<cardsView.length;i++){
////        var onecardsView = cardsView[i];
////        if(onecardsView == script_pokerMaJiang ){
////
////            console.log("__gameActionPushResponse_cut当前比对的是=》  pokerid : " + cardsArr[i] + ",oneleftCards_view._pokerid:"+onecardsView._pokerid)
////            //if(onecardsView._pokerid == cardsArr[i]) {
////                cardsView.splice(i, 1);
////                cardsArr.splice(i, 1);
////            //}else{
////            //    throw  "Round.__gameActionPushResponse_cut is error "
////            //}
////
////            return onecardsView;
////            break;
////        }
////    }
////}
////
////
/////**
//// *  排序
//// * @param pos
//// * @private
//// */
////Round.__sort_leftCards_view  = function(pos){
////    var seatPlayer_player_card = Round.seatPlayer_player_card;
////    var currentseatPlayer_player_card = seatPlayer_player_card[pos];
////
////    var cardsArr = currentseatPlayer_player_card.leftCards;
////    var cardsView = currentseatPlayer_player_card.leftCards_view;
////
////    cardsArr.sort(function(a,b){//数组从小到大排序
////        return a-b;
////    });
////    //cardsView.sort(function(a,b){
////    //    return a._pokerid- b._pokerid;
////    //});
////    for(var i = 0;i<cardsView.length;i++ ){
////        if(cardsArr[i] != cardsView[i]._pokerid){
////            cardsView[i].init(cardsArr[i]);
////        }
////    }
////
////    for(var i = 0;i<cardsArr.length;i++ ){
////        //cardsView.node.setLocalZOrder(cardsArr[i]);
////        if(cardsArr[i] != cardsView[i]._pokerid){
////            throw  "Round.__sort_leftCards_view is error "
////        }
////    }
////}
//
//
//
//
//if(module)
//    module.exports = Round;
//
//
//
//
