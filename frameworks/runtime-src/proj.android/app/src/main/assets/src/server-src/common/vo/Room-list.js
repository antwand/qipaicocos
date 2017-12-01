var RoomList = {};
RoomList.rooms = {};
RoomList.meId = null;

// private
RoomList.setRoom = function(opts){
    var roomid = opts.id || opts.rid || opts.rmid || opts.room_id || opts.roomid || opts.roomId;

    var Room = require('Room');
    var room = new Room(roomid, opts);
    this.rooms[roomid] = room;

    return room;
};
// private
RoomList.deleteRoom = function(roomid){

    if(roomid) {
        var room = this.rooms[roomid];
        this.rooms[roomid] = null;

        return room;
    }
};
// private
RoomList.getRoomByRoomId = function(roomid){
    var room = this.rooms[roomid];

    return room;
};






if(module) {
    module.exports = RoomList;
}
