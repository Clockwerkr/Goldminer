//绳子状态存储在config中
var config=require('config');
var player=config.player;
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
        goodNode:{
           default:null,
           type:cc.Node
       },

       //积分榜
        moneyNode:{
            default:null,
            type:cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化各节点
        this.rope=this.ropeNode.getComponent('rope');
        this.claw=this.clawNode.getComponent('hook');
        this.moneyLabel=this.moneyNode.getComponent('moneyLabel');
        this.minerAnimation=this.getComponent(cc.Animation);

        //启动运动
        this.node.active=true;
        this.ropeRotate();
        this.minerSprite = this.node.getComponent(cc.Sprite).spriteFrame;
    },



    //绳子操作
    ropeRotate:function(){
        //this.ropeState='rotate';
        var drictive=1; //-1为顺时针，1为逆时针
        var rotaMAX=65; //最大旋转角度
        var rota=0;     //选择角度大小
        var y=this.clawNode.y;
        var height=this.ropeNode.y;

        this.callback=function(){
            listenRopeDown.call(this);
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
            }
        }
        //每0.012s调用一次
        this.schedule(this.callback,0.012);

        //监听点击事件
        function listenRopeDown(){
            //只有在摇摆状态下才能切换为down状态
            this.bgNode.on('touchstart',function(){
                if(player.ropeState=='rotate'){
                    player.ropeState='down';
                }
            });
        }

        //抓钩上升
        function up(){  
            //上升速度
            var speed=item.itemSpeed; 
            this.clawClose();
            this.ropeNode.height-=speed;
            this.clawNode.y+=speed;

            //钩子拉回原点
            if(this.clawNode.y>=y){  
                //刷新player当前金钱
                player.money+=player.preMoney;
                player.preMoney=0;
                this.moneyNode.string=player.money;
                //改变绳子的状态
                player.ropeState='rotate';
                this.clawNode.y=y;
                this.ropeNode.height=height+80; 
                //抓到东西上升结束，隐藏钩子上的物品
                this.goodNode.opacity=0;
                this.clawOpen(); 

                //停止当前动画
                this.minerAnimation.stop();
                this.node.getComponent(cc.Sprite).spriteFrame = this.minerSprite;

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
                drictive=-1;
            }
            if(rota<-rotaMAX)
            {
                drictive=1;
            }
            rota+=drictive;
            this.ropeNode.setRotation(rota);               
        }
    },

    //抓钩下拉打开动画
    clawOpen(){
        var action1 = cc.rotateTo(0.2,0); 
        var action2 = cc.rotateTo(0.2,0); 
        this.clawLeftNode.runAction(action1);
        this.clawRightNode.runAction(action2);
    },


    //抓钩抓住物品动作动画
    clawClose(){
        var action1 = cc.rotateTo(0.1, -15); 
        var action2 = cc.rotateTo(0.1, 15); 
        this.clawLeftNode.runAction(action1);
        this.clawRightNode.runAction(action2);
    },
});
