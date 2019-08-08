var config = require('config');
var player = config.player;

//购买物品需要消耗的金钱
var cost = 0;
//购买的商品总类
var type = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        luckyClover: {
            default: null,
            type: cc.Node
        },
        strengthDrink: {
            default: null,
            type: cc.Node
        },
        dynamite: {
            default: null,
            type: cc.Node
        },
        diamondPolish: {
            default: null,
            type: cc.Node
        },
        moneyLabel: {
            default: null,
            type: cc.Node
        },
        mask: {
            default: null,
            type: cc.Node
        },
        confirmWindow: {
            default: null,
            type: cc.Node
        },
        declineWindow: {
            default: null,
            type: cc.Node
        },
        score1:{
            default:null,
            type:cc.AudioClip
        },
    },

    //弹出确认窗口
    showWindow(){
        this.mask.active = true;
        this.confirmWindow.active = true;
    },

    //点击购买幸运草
    buyLuckyClover(event, customEventData){
        this.showWindow();
        cost = parseInt(customEventData);
        type = 1;
    },

    //点击购买力量饮料
    buyStrengthDrink(event, customEventData){
        this.showWindow();
        cost = parseInt(customEventData);
        type = 2;
    },

    //点击购买炸药
    buyDynamite(event, customEventData){
        this.showWindow();
        cost = parseInt(customEventData);
        type = 3;
    },

    //点击购买钻石抛光水
    buyDiamondPolish(event, customEventData) {
        this.showWindow();
        cost = parseInt(customEventData);
        type = 4;
    },

    onLoad() {
        //玩家拥有的金钱
        var money = player.money;
        //在商店把玩家拥有的金钱数显示
        this.moneyLabel.getComponent(cc.Label).string = '余额：￥' + money;
    },

    
    //confirmWindow确认按钮
    confirmBuy(){
        //播放音效
        if(player.soundState == true){
            this.playBuy(this.score1);
        }
        //获取金钱
        var money = player.money;
        this.confirmWindow.active = false;
        this.mask.active = false;
        if(money >= cost){
            var balance = money - cost;
            //更新玩家拥有的金钱
            player.money = balance;
            this.moneyLabel.getComponent(cc.Label).string = '余额：￥' + balance;
            switch(type){
                case 1:
                    this.luckyClover.destroy();
                    //给玩家添加幸运的属性
                    player.lucky = true;
                    break;
                case 2:
                    this.strengthDrink.destroy();
                    //给玩家添加强壮的属性
                    player.strong = true;
                    break;
                case 3:
                    this.dynamite.destroy();
                    //给玩家添加一个炸药
                    player.dynamite ++;
                    break;
                case 4:
                    this.diamondPolish.destroy();
                    //给玩家添加钻石更加值钱
                    player.diamondPolish = true;
                    
            }           
        }else{
            this.declineWindow.active = true; 
        }              
    },

    //confirmWindow取消按钮
    cancelBuy(){
        this.mask.active = false;
        this.confirmWindow.active = false;
    },

    //declineWindow确认按钮
    declineAccept() {
        this.mask.active = false;
        this.declineWindow.active = false;
    },

    //跳转到下一关卡
    nextLevel() {
        player.gameOver = false;
        cc.director.loadScene('Game');
    },
    playBuy:function(clip){
        cc.audioEngine.playEffect(clip,false);
    },
});
