//绳子状态存储在config中
var config = require('config');
var player = config.player;
var target = config.target;
var item = config.item;
cc.Class({
    extends: cc.Component,

    properties: {
        //ropeState:'rotate',//绳子状态，rotate为摇摆，down为抓钩落下，up为抓钩向上
        //背景
        bgNode:{
            default:null,
            type:cc.Node
        },
        //绳子
        ropeNode:{
            default:null,
            type:cc.Node
        },

        //抓钩
        clawNode:{
            default:null,
            type:cc.Node
        },

        //左边抓钩
        clawLeftNode:{
            default:null,
            type:cc.Node
        },
        //右边抓钩
        clawRightNode:{
           default:null,
           type:cc.Node
       },

       //抓勾上获取的物品
        goodsNode:{
           default:null,
           type:cc.Node
       },
        moneyLabel:{
            default:null,
            type:cc.Label
        },

        gameNode: {
            default: null,
            type: cc.Node
        },

        //获取金钱音效
        getmoneyAudio:{
            default:null,
            type:cc.AudioClip
        },

        //显示当前抓取物品价值
        itemValueLabel:{
            default:null,
            type:cc.Node
        },
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化各节点
        this.rope=this.ropeNode.getComponent('rope');
        this.claw=this.clawNode.getComponent('claw');
        this.game = this.gameNode.getComponent('game');
        this.minerAnimation=this.getComponent(cc.Animation);
        //保存矿工原始精灵帧
        this.minerSpriteFrame = this.node.getComponent(cc.Sprite).spriteFrame;
    },


    //切换玩家绳子的状态
    switchRopeState(event){
        switch(event.keyCode){
            case cc.macro.KEY.down:        
                if(player.ropeState=='rotate'){
                    player.ropeState='down';
                }
                break;
        }
    },

    listenRopeDown(){
        //只有在摇摆状态下才能切换为down状态
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.switchRopeState, this);
    },

    //注销监听点击事件
    cancelRopeDownListener(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.switchRopeState, this);
    },

    //绳子操作
    ropeRotate(){
        var drictive=1; //-1为顺时针，1为逆时针
        var rotaMAX=65; //最大旋转角度
        var rota=0;     //选择角度大小
        var y=this.clawNode.y;
        var height=this.ropeNode.y;
        this.listenRopeDown();
        
        this.callback=function(){
            //如果游戏已经结束, 则把绳子上拉, 并注销鼠标点击响应事件
            if(player.gameOver == true){
                this.cancelRopeDownListener();
                player.ropeState = 'up';
                //把钩子上的东西清掉
                this.claw.objHide();
                item.itemSpeed=4*item.speedUp;
                player.preMoney=0;
                this.clawOpen(); 
                this.ropeNode.runAction(cc.rotateTo(1, 0));
            }
            switch(player.ropeState)
            {
                case 'up':
                    up.call(this);
                    break;
                case 'down':
                    down.call(this);
                    break;
                case 'rotate':
                    roate.call(this);
                    break;    
                case 'stop':
                    break;                    
            }
        }
        //每0.012s调用一次
        this.schedule(this.callback,0.012);


        //抓钩上升
        function up(){  
            //上升速度
            var speed=item.itemSpeed; 
            if(player.preMoney != 0){
                this.clawClose();
            }      
            this.ropeNode.height-=speed;
            this.clawNode.y+=speed;

            //钩子拉回原点
            if(this.clawNode.y>=y){ 
                console.log(player.preMoney); 
                //在矿工旁边显示当前拉取到的物品获取的金钱
                //如果获取到的金钱为0,则绳子继续转动
                if(player.preMoney == 0){   
                    this.itemValueLabel.getComponent(cc.Label).string='';
                    player.ropeState = 'rotate';
                }else{
                    //如果获取到的物品价值不为0, 先暂停绳子的计时器以显示金钱
                    this.unschedule(this.callback);
                    //刷新player当前金钱
                    player.money+=player.preMoney;
                    //把获得的金钱数额显示并一边缩小一边移动到moneyLabel上
                    //动作回调函数, 等获得的金钱移动到moneyLabel后再把钱加上去
                    var finished = cc.callFunc(function(){
                        this.itemValueLabel.setPosition(cc.v2(160,0));
                        this.itemValueLabel.setScale(1);
                        this.itemValueLabel.getComponent(cc.Label).string='';
                        this.moneyLabel.string=player.money;
                        player.preMoney=0;
                        //绳子继续转动, 绳子计时器继续进行
                        player.ropeState='rotate';
                        this.schedule(this.callback,0.012);
                    }, this);
                    this.itemValueLabel.getComponent(cc.Label).string='+$'+player.preMoney;
                    this.itemValueLabel.runAction(cc.sequence(cc.spawn(cc.scaleTo(1, 0), cc.moveTo(1, cc.v2(10,40))), finished));
                    if(player.soundState == true){
                        cc.audioEngine.play(this.getmoneyAudio,false,0.3); 
                     }
                }
                this.clawNode.y=y;
                this.ropeNode.height=height+80; 
                //抓到东西上升结束，隐藏钩子上的物品
                this.goodsNode.getComponent(cc.Animation).stop();
                this.goodsNode.opacity=0;
                this.clawOpen(); 

                //若还在游戏中，则停止当前动画
                if(player.gameOver == false){
                    this.minerAnimation.stop();
                    this.node.getComponent(cc.Sprite).spriteFrame = this.minerSpriteFrame;
                }
                

                //如果游戏已经结束, 则当钩子拉回原点的时候, 停止绳子的计时器
                if(player.gameOver == true){
                    this.unschedule(this.callback);
                }

                //玩家不可以再丢炸药
                player.canThrow = false;
            }
        }


        //抓钩下降
        function down(){ 
            this.clawOpen();
            var speend=6;  //下降时的速度
            this.ropeNode.height+=speend;
            this.clawNode.y-=speend;
        }
        


        //抓钩摇摆
        function roate(){
            if(rota>rotaMAX)
            {
                drictive=-0.75;
            }
            if(rota<-rotaMAX)
            {
                drictive=0.75;
            }
            rota+=drictive;
            this.ropeNode.angle = rota;               
        }
    },

    //抓钩下拉打开动画
    clawOpen(){
        this.clawLeftNode.angle=0;
        this.clawRightNode.angle=0;
    },


    //抓钩抓住物品动作动画
    clawClose(){
        this.clawLeftNode.angle=20;
        this.clawRightNode.angle=-20;
    },

    onDestroy(){
        cc.audioEngine.stop(this.getmoneyAudio);
    }
});
