/**
 * 游戏状态常量定义
 * @author ""
 */
exports.WAIT = 0; // 等待状态(玩家可以加入离开等)
exports.INIT = 1; // 初始化状态(发牌等)
exports.STARTED = 2; // 已经开始(玩家不可以加入)
exports.PAUSED = 3; // 已经暂停
exports.ENDED = 4; // 已经结束(结算处理等)
exports.CLOSED = 5; // 已经关闭




//百家乐 流程
exports.BAIJIALE = {
    WAIT : 0, // 等待状态(玩家可以加入离开等)
    RESET_CARD:1,//切牌  洗牌
    BET : 2, // 下注阶段
    DEAL : 3, // 发牌阶段
    ENDED : 4, // 已经结束(结算处理等)
    CLOSED : 5, // 已经关闭 房间结束
}
