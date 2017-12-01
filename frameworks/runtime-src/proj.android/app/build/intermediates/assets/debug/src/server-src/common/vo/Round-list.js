var Roundlist = {};
Roundlist.rounds = {};

// private
Roundlist.setRound = function(opts){
    var roundId = opts.id || opts.rdid;

    var Round = require('Round');
    var round = new Round(roundId, opts);
    this.rounds[roundId] = round;

    return round;
};
// private
Roundlist.deleteRound = function(roundId){

    if(roundId) {
        var round = this.rounds[roundId];
        this.rounds[roundId] = null;

        return round;
    }
};
// private
Roundlist.getRoundByRoundId = function(roundId){
    var round = this.rounds[roundId];

    return round;
};






if(module) {
    module.exports = Roundlist;
}
