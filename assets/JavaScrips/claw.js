var config=require('config');
var player=config.player;
var item = config.item;

cc.Class({
    extends: cc.Component,

    properties: {
        minerNode:{
            default:null,
            type:cc.Node
        },
        goodsNode:{
            default:null,
            type:cc.Node
        },
        dynamite: {
           default: null,
           type: cc.Prefab
        },

        //爆炸音效
       boomAudio:{
            default:null,
            type:cc.AudioClip
       },

       //没抓到的音效
       lowvalueAudio:{
           default:null,
           type:cc.AudioClip
       },
       //高分音效
       highvalueAudio:{
            default:null,
            type:cc.AudioClip
       },
       //高分音效
       normalvalueAudio:{
            default:null,
            type:cc.AudioClip
       },

       //炸药的数量
       dynamiteCount: {
           default: null,
           type: cc.Label
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //开启碰撞相关组件
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        //获取miner的动画
        this.minerAni=this.minerNode.getComponent(cc.Animation);

        //获取miner脚本
        this.miner=this.minerNode.getComponent('miner');
        //是否有力量药水
        if(player.strong){
            item.speedUp=1.7;
        }else{
            item.speedUp = 1;
        }
        //是否有幸运草
        if(player.lucky){
            item.luckyPoint=2;
        }else{
            item.luckyPoint = 1;
        }
        //是否有钻石超级加钱
        if(player.diamondPolish){
            item.diamondPoint=200;
        }else{
            item.diamondPoint = 0;
        }

        //注册空格按键扔炸药的监听事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.throwDynamite, this);

        //获取矿工原本的精灵帧
        this.minerSprite = this.minerNode.getComponent(cc.Sprite).spriteFrame;
    },

    onDestroy(){
        //注销键盘监听事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.throwDynamite, this);
    },

    //抓钩抓到物体产生动作
    onCollisionEnter:function(other,self){
        var goodsAnimation = this.goodsNode.getComponent(cc.Animation);
        if(player.ropeState!='down'){
            return false;
        }
        switch(other.tag){
            case 1://大金块
                item.itemSpeed=0.7*item.speedUp;
                player.preMoney=400;
                this.minerAni.play('miner_pull_heavy');
                goodsAnimation.play('gold1');
                break;
            case 2://中金块
                item.itemSpeed=1.2*item.speedUp;
                player.preMoney=200;
                this.minerAni.play('miner_pull_heavy');
                goodsAnimation.play('gold2');
                break;
            case 3://小金块
                item.itemSpeed=1.6*item.speedUp;
                player.preMoney=70;
                this.minerAni.play('miner_pull_light');
                goodsAnimation.play('gold3');
                break;
            case 4://石头1
                item.itemSpeed=0.7*item.speedUp;
                player.preMoney=20;
                this.minerAni.play('miner_pull_heavy');
                break;
            case 5://石头2
                item.itemSpeed=0.7*item.speedUp;
                player.preMoney=20;
                this.minerAni.play('miner_pull_heavy');
                break;
            case 6://钻石
                item.itemSpeed=1.2*item.speedUp;
                player.preMoney=550+item.diamondPoint;
                this.minerAni.play('miner_pull_light');
                goodsAnimation.play('diamond');
                break;
            case 7://有黄金的老鼠
                item.itemSpeed=1.4*item.speedUp;
                player.preMoney=100;
                this.minerAni.play('miner_pull_light');
                break;
            case 8://有钻石的老鼠
                item.itemSpeed=1*item.speedUp;
                player.preMoney=650+item.diamondPoint;
                this.minerAni.play('miner_pull_light');
                break;
            case 9://treasure
                item.itemSpeed=(Math.round(Math.random()*2)+1)*item.speedUp;
                player.preMoney=Math.round(Math.random()*600)*item.luckyPoint;
                if(item.itemSpeed<=1.2){
                    this.minerAni.play('miner_pull_heavy');
                }else{
                    this.minerAni.play('miner_pull_light');
                }
                break;
            case 10://wall
                item.itemSpeed=2.5*item.speedUp;
                player.preMoney=0;
                this.minerAni.play('miner_pull_light');
                break;
        }

        //播放得分音效
        if(player.soundState == true){
            cc.log("play");
             this.playAudio();
        }

        //产生碰撞后设置抓钩状态为上升
        player.ropeState='up';
        
        //如果钩子抓到的东西不是墙壁，则如下处理
        if(other.tag != 10){
            var objNode=this.goodsNode;
            //根据抓取到的物品种类设置goodsNode的位置
            if(other.tag == 1){
                objNode.setPosition(cc.v2(-3.5,-42.5));
            }else{
                objNode.setPosition(cc.v2(-3.7,-30.7));
            }

            //如果抓到的不是金块和钻石,则直接把精灵帧赋值过去
            if(other.tag!= (1||2||3||6) ){
                var objsprite=other.node.getComponent(cc.Sprite);   //获取抓到的物品结点
                objNode.getComponent(cc.Sprite).spriteFrame=objsprite.spriteFrame;  //将抓到的结点的图片放置到goodsNode中显示
                objNode.height = other.node.height;
                objNode.width = other.node.width;
            }
            
            
            this.objShow(); 
            other.node.destroy();   //销毁抓到的结点

            //玩家可以决定是否丢炸药
            player.canThrow = true;
        }
    },

    //监听点击事件
    throwDynamite(event){
        //只有在有炸药的情况下才能调用
        switch(event.keyCode){
            case cc.macro.KEY.space:
                if(player.canThrow == true && player.dynamite > 0){
                    //玩家拥有的炸药数 -1
                    player.dynamite --;
                    this.dynamiteCount.string = 'x' + player.dynamite;

                    //播放矿工扔炸药的动画
                    this.miner.getComponent(cc.Animation).play('miner_throw');
                    player.preMoney = 0;
                    player.canThrow = false;
                    //生成一个炸药
                    this.scheduleOnce(function(){
                        var dynamite = cc.instantiate(this.dynamite);
                        dynamite.parent = this.node.parent;
                        dynamite.setPosition(cc.v2(0,0)); 
                        //炸药移动到钩子处
                        var dynamiteAction = cc.moveTo(0.25, this.node.getPosition());
                        // dynamiteAction.easing(cc.easeIn()); 
                        dynamite.runAction(dynamiteAction);
                        //炸药移动到钩子处后，播放炸药爆炸动画，
                        this.scheduleOnce(function(){
                            this.objHide();
                            //矿工恢复原样      
                            this.minerNode.getComponent(cc.Sprite).spriteFrame = this.minerSprite; 
                            var dynamiteAnima = dynamite.getComponent(cc.Animation);
                            dynamiteAnima.play('boom');
                            //播放爆炸音效
                            if(player.soundState == true){
                                cc.audioEngine.play(this.boomAudio,false,0.3);
                            }
                            dynamiteAnima.on('finished', function(){
                                dynamite.destroy();
                            }, this);
                            this.miner.clawOpen();
                            item.itemSpeed=5*item.speedUp;
                        }, 0.25);
                    }, 0.25);
                }     
        }
    },

    //抓取物体显示在钩子上
    objShow(){
        this.goodsNode.opacity=255;
    },

    //抓到原位后隐藏物体
    objHide(){
        this.goodsNode.opacity=0;
    },

    //根据分数判断播放音效
    playAudio(){
        if(player.preMoney>=400){
            cc.audioEngine.play(this.highvalueAudio,false,0.3);
        }else if(player.preMoney<10){
            cc.audioEngine.play(this.lowvalueAudio,false,0.3);
        }else{
            cc.audioEngine.play(this.normalvalueAudio,false,0.3)
        }
    },

    onDestroy(){
      cc.audioEngine.stop(this.boomAudio);  
    },
});
