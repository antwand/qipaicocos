

var PlayerList = {};
PlayerList.players = {};
PlayerList.meId = null;


// private
PlayerList.setPlayer = function(opts){
    var playerId = opts.id || opts.uid || opts.playerId;

    var Player = require('Player');
    var player = new Player(playerId, opts);
    this.players[playerId] = player;

    return player;
};
// private
PlayerList.deletePlayer = function(playerId){
    var player = this.players[playerId];
    this.players[playerId] = null;

    return player;
};
// private
PlayerList.getPlayerByPlayerId = function(playerId){
    var player = this.players[playerId];

    return player;
};





if(module) {
    module.exports = PlayerList;
}
