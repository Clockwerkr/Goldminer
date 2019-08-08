var player={
    //绳子的状态
    ropeState: 'rotate',
    //抓取到的物品准备获取到的金钱
    preMoney: 0,
    //玩家已获得的金钱
    money: 0,
    //玩家当前到达的关卡
    level: 1,
    //当前关卡是否已经结束
    gameOver : false,
    //玩家的状态, 包括 lucky/ strong/ dynamite/ diamondPolish
    lucky: false,     //购买 luckyColver置为true，   宝藏金钱 x2
    strong: false,     //购买 strengthDrink      拉取速度变快
    dynamite: 0,       //购买 dynamite 自加1       
    diamondPolish: false,  //购买 diamondPolish 置为1      钻石金钱更多
    //音乐状态
    soundState:true,//true 为运行状态，false为暂停状态 
    //玩家丢炸药的权限
    canThrow: false
    //玩家能否跳转
}

var item = {
    itemSpeed : 17,   //拉取物品速度的初值
    luckyPoint:1,      //幸运草翻倍
    diamondPoint:0,  //钻石涨价钱
    speedUp:1,  //速度加速值
}

//每一关的目标
var target = [500, 2000, 5000];

module.exports={
    player: player,
    target: target,
    item: item,
    target: target
}