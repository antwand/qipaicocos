
module.exports = Room;

/**
 * 构造函数
 * @param {Number} id
 * @param {Object|null} opts
 */
function Room(id, opts) {
    opts = opts || {};
    this.id = this.rid = this.rmid = this.room_id = this.roomid  = this.roomId = id// ID

    this.masterId="GIMXDpPzfJWFqL7XAAAA"//房主的userid
    this.seat_uid_list=opts.seat_uid_list//所有的用户id
    // this.watcherPlayerIds=[]//观众的用户id
    this.game_config=opts.game_config//房间的配置数据


    this.roundIds =[] //所有的round 牌局信息的id
}



/**
*   获取风味
* @param room
* @param userId
* @returns {*}
*/
Room.prototype.getPosByUserId = function (uid) {
   var seat_uid_list =  this.seat_uid_list;
   for(var i = 0;i<seat_uid_list.length;i++){
       var one = seat_uid_list[i];
       if(one == uid){
           return i;
       }
   }
   return null;
}
