var config = require('config');
var player = config.player;
var target = config.target;
var item = config.item;

cc.Class({
    extends: cc.Component,

    properties: {
        minerNode: {
            default: null,
            type: cc.Node
        },
        goodsNode: {
            default: null,
            type: cc.Node
        },
        //当前游戏的四个Label
        levelLabel: {
            default: null,
            type: cc.Label
        },
        timeLabel: {
            default: null,
            type: cc.Label
        },
        moneyLabel: {
            default: null,
            type: cc.Label
        },
        targetLabel: {
            default: null,
            type: cc.Label
        },
        timeLevelBanner: {
            default: null,
            type: cc.Node
        },
        popupWindow: {
            default: null,
            type: cc.Node
        },
        popupLabel1: {
            default: null,
            type: cc.Node
        },
        popupLabel2: {
            default: null,
            type: cc.Node
        },
        popButtonLabel: {
            default: null,
            type: cc.Label
        },

        //暂停与播放
        pause:{
            default:null,
            type:cc.Node
        },
        resume:{
            default:null,
            type:cc.Node
        },
        //背景音乐
        levelbg:{
            default:null,
            type:cc.AudioClip
        },

        resumeSoundBtn:{
            default:null,
            type:cc.Node
        },
        pauseSoundBtn:{
            default:null,
            type:cc.Node
        },

        //游戏成功失败音效
        failAudio:{
            default:null,
            type:cc.AudioClip
        },

        successAudio:{
            default:null,
            type:cc.AudioClip
        },

        //烟花爆炸音效
        fireworkAudio:{
            default:null,
            type:cc.AudioClip
        },

        fireworks: {
            default: null,
            type: cc.Prefab
        },
        fireworks1: {
            default: null,
            type: cc.Prefab
        },

        dynamiteNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad () {
        cc.log(player);
        cc.log(item);
        
        this.pauseSoundBtn.active = player.soundState;
        this.resumeSoundBtn.active = !player.soundState;

        this.miner = this.minerNode.getComponent('miner');
        this.minerAnimation = this.minerNode.getComponent(cc.Animation);

        //获取矿工的初始精灵帧
        this.minerSpriteFrame = this.minerNode.getComponent(cc.Sprite).spriteFrame;

        //开始初始化当前关卡
        this.initLevel();

        var menuNode = cc.director.getScene().getChildByName('menu');
        this.menu = menuNode.getComponent('menu');
        cc.log(this.menu);
        //设置背景音乐
        if(player.soundState == true){
            this.setLevelmusic();
        }

    },


    //初始化当前关卡
    initLevel() {
        //初始化物品
        this.goodsNode.getComponent('goods').init(player.level);
        cc.log('初始化第' + player.level + '关');
        this.moneyLabel.string = player.money;
        this.levelLabel.string = player.level;
        this.targetLabel.string = target[player.level - 1];
        //矿工、计时器进入场景
        this.minerAnimation.play('miner_appear');
        this.timeLevelBanner.runAction(cc.moveTo(1, cc.v2(300, 256)));
        var strong = 0;     //如果玩家有strong状态, 则需要延时更长时间开启游戏
        if(player.strong == true){
            strong = 1.1;
            this.scheduleOnce(function(){
                this.minerAnimation.play('miner_strong');
            }, 2);
        }
        //绳子开始摇摆, 计时器开始倒计时
        this.scheduleOnce(function(){
            //显示炸药
            this.dynamiteNode.active = true;
            this.dynamiteNode.getChildByName('count').getComponent(cc.Label).string = 'x' + player.dynamite;
            this.minerNode.getComponent(cc.Sprite).spriteFrame = this.minerSpriteFrame;
            player.ropeState = 'rotate';
            this.miner.ropeRotate();
            this.countdown();
        }, 2 + strong);  
    },

    setLevelmusic:function(){
        this.menu.setcurrentbgAudio(this.levelbg);
    },

    //倒计时
    countdown(){
        var timer = 60;
        player.gameOver = false;
        cc.log('关卡开始倒计时');
        var callback = function(){
            timer = timer -1;
            if((this.timeLabel.string = timer) == 0){    
                cc.log('关卡计时器结束');        
                this.gameEnd();
                this.unschedule(callback);
            }
        };
        this.schedule(callback, 1);
    },

    //通关成功
    gameSuccess() {
        player.level ++;
        //弹出通关成功信息, 倒计时板上升, 矿工往右走出当前场景, 准备加载商店场景,
        this.timeLevelBanner.runAction(cc.moveTo(1, cc.v2(300, 380)));
        this.scheduleOnce(function(){
            this.minerAnimation.play('miner_disappear');
            this.scheduleOnce(function(){
                cc.director.loadScene('Shop');
            }, 2);
        }, 1);
    },

    //通关失败,弹出提示框是否重新游戏还是退出游戏
    gameFailOrClear(){
        //判断分数是否可以进入排行榜
        this.checkScore();
        cc.audioEngine.stopAll();

        player.level = 1;
        player.money = 0;
        player.dynamite = 0;
        cc.director.loadScene('Menu');
    },

    //当前关卡结束
    gameEnd(){
        player.gameOver = true;
        player.lucky = false;
        player.strong = false;
        player.diamondPolish = false;

        if(player.money >= target[player.level - 1]){
            this.minerAnimation.play('miner_happy');
        }else{
            this.minerAnimation.play('miner_sad');
        }

        //弹出确认窗口
        this.popupWindow.active = true;
        this.popButtonLabel.string = '确定';
        if(player.money < target[player.level - 1]){  //没有通过本关卡
            cc.log('第' + player.level + '关通关失败');
            this.popupLabel1.active = true;
            this.popupLabel1.getComponent(cc.Label).string = this.popupLabel1.getComponent(cc.Label).string + '失败';
            if(player.soundState==true){
                cc.audioEngine.play(this.failAudio,false,0.4);
            }
        }else if(player.level < target.length){  //通过本关卡, 且当前关卡不是最后一关
            cc.log('第' + player.level + '关通关成功');
            this.popupLabel1.active = true;
            this.popupLabel1.getComponent(cc.Label).string = this.popupLabel1.getComponent(cc.Label).string + '成功';   
            if(player.soundState==true){
                cc.audioEngine.play(this.successAudio,false,0.4);
            }
        }else{  //通过本关卡,且本关卡是最后一关
            cc.log('本游戏关卡已全部通关');
            this.popButtonLabel.string = '返回主菜单';
            this.showFireWorks();
            this.popupLabel2.active = true;
            if(player.soundState==true){
                cc.audioEngine.play(this.successAudio,false,0.4);
            }
            cc.audioEngine.play(this.fireworkAudio,true,0.3);
        }
    },

    confirmButtonClick(){
        this.dynamiteNode.active = false;

        if(player.money < target[player.level - 1]){   //通关失败
            this.gameFailOrClear();
            this.popupLabel1.active = false;
        }else if(player.level < target.length){  //通过成功,且不是最后一关
            this.gameSuccess();
            this.popupLabel1.active = false;
        }else{  //通关成功,且当前关卡是最后一关
            this.gameFailOrClear();
            this.popupLabel2.active = false;
        }
        this.popupWindow.active = false;
    },

    //判断分数是否可以进入排行榜
    checkScore(){
        //分数存入排行榜
        cc.sys.localStorage.setItem('pretop',player.money);
        var pretopMoney=parseInt(cc.sys.localStorage.getItem('pretop'));
        var top1Money=parseInt(cc.sys.localStorage.getItem('top1'));
        var top2Money=parseInt(cc.sys.localStorage.getItem('top2'));
        var top3Money=parseInt(cc.sys.localStorage.getItem('top3'));
        console.log('top1'+top1Money);
        console.log('top2'+top2Money);
        console.log('top3'+top3Money);
        console.log('pretop'+pretopMoney);
        if(pretopMoney>top1Money){
            cc.sys.localStorage.setItem('top1',pretopMoney);
            cc.sys.localStorage.setItem('top2',top1Money);
            cc.sys.localStorage.setItem('top3',top2Money);
            console.log("top1");
        }else if(pretopMoney>top2Money){
            cc.sys.localStorage.setItem('top2',pretopMoney);
            cc.sys.localStorage.setItem('top3',top2Money);
            console.log("top2")
        }else if(pretopMoney>top3Money){
            cc.sys.localStorage.setItem('top3',pretopMoney);
            console.log("top3");
        }
    },

    onDestroy(){
        cc.audioEngine.stop(this.failAudio);
        cc.audioEngine.stop(this.successAudio);
    },

    //放烟花
    showFireWorks(){

        this.initFireWorks(1, cc.v2(0,-250), cc.v2(0,150), cc.v2(0,200), 0.7);
        this.scheduleOnce(function(){
            this.initFireWorks(2, cc.v2(-170,-220), cc.v2(-300,90), cc.v2(-360,160), 1);
            this.initFireWorks(2, cc.v2(170,-220), cc.v2(300,90), cc.v2(360,160), 1);
        }, 0.2);
        
        this.scheduleOnce(function(){
            this.initFireWorks(1, cc.v2(-350,-250), cc.v2(-150,100), cc.v2(-100,180), 0.7);
            this.initFireWorks(1, cc.v2(350,-250), cc.v2(150,100), cc.v2(100,180), 0.7);
            this.scheduleOnce(function(){
                this.initFireWorks(2, cc.v2(-350,-250), cc.v2(-150,100), cc.v2(-100,180), 0.7);
                this.initFireWorks(2, cc.v2(350,-250), cc.v2(150,100), cc.v2(100,180), 0.7);
            }, 1);
        }, 0.5);
    },

    //烟花的种类,开始释放的位置,开花的位置,最终位置,从释放的位置到开花的位置需要的时间
    initFireWorks(type, fromPosition, firePosition, toPosition, relaseSpeendTime){ 
        var fireworks;
        if(type == 1){
            fireworks = cc.instantiate(this.fireworks);
        }else{
            fireworks = cc.instantiate(this.fireworks1);
        }
        fireworks.setScale(0);
        var fwSpriteFrame = fireworks.getComponent(cc.Sprite).spriteFrame;
        fireworks.parent = this.node;
        fireworks.setPosition(fromPosition);
        this.schedule(function(){
            //使用同步动作使得烟花节点在上升的同时变大
            fireworks.runAction(cc.spawn(cc.moveTo(relaseSpeendTime, firePosition), cc.scaleTo(relaseSpeendTime, 1)));
            //烟花节点上升到指定位置后, 开始播放动画
            this.scheduleOnce(function(){
                fireworks.runAction(cc.moveTo(1, toPosition));
                fireworks.getComponent(cc.Animation).play();
            }, relaseSpeendTime);
            //重置烟花节点返回原状态准备再发射
            this.scheduleOnce(function(){
                fireworks.setScale(0);
                fireworks.setPosition(fromPosition);
                fireworks.getComponent(cc.Sprite).spriteFrame = fwSpriteFrame;
            }, 1.1 + relaseSpeendTime);
        }, 1.2 + relaseSpeendTime);
    },
    
    //游戏暂停与播放
    pauseGame:function(){
        this.stateControl(false);
        cc.director.pause();
    },

    resumeGame:function(){
        this.stateControl(true);
        cc.director.resume();
    },
    stateControl:function(state){
        this.pause.active = state;
        this.resume.active = !state;
    },

    pauseSound:function(){
        player.soundState = false;
        this.soundControl();
        cc.audioEngine.pauseAll();
    },

    resumeSound:function(){
        player.soundState = true;
        this.soundControl();
        cc.audioEngine.resumeAll();
    },

    soundControl:function(){
        this.pauseSoundBtn.active = player.soundState;
        this.resumeSoundBtn.active = !player.soundState;
    },
});
