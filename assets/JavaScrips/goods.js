cc.Class({
    extends: cc.Component,

    properties: {
        gold1: {
            default: null,
            type: cc.Prefab
        },
        gold2: {
            default: null,
            type: cc.Prefab
        },
        gold3: {
            default: null,
            type: cc.Prefab
        },
        stone1: {
            default: null,
            type: cc.Prefab
        },
        stone2: {
            default: null,
            type: cc.Prefab
        } ,
        diamond: {
            default: null,
            type: cc.Prefab
        },
        'mouse&gold': {
            default: null,
            type: cc.Prefab
        },
        'mouse&diamond': {
            default: null,
            type: cc.Prefab
        },
        treasure: {
            default: null,
            type: cc.Prefab
        },
        goldMouseDelayTime : 0,     //每隔多久跑出一只带黄金的老鼠
        goldMouseRunTime: 0,        //带黄金的老鼠跑完场景需要的时间
        diamondMouseDelayTime: 0,   //每隔多久跑出一只带钻石的老鼠
        diamondMouseRunTime: 0      //带钻石的老鼠跑完场景需要的时间

    },

    //传入当前的关卡，初始化货物的位置
    init(level) {
        var goods, mouse1, mouse2, mouse1Action, mouse2Action;
        switch(level){
            case 1:
                goods = {
                    gold1: [cc.v2(110,110), cc.v2(720,100)],
                    gold2: [cc.v2(380,240), cc.v2(520,80)],
                    gold3: [cc.v2(170,340), cc.v2(840,200), cc.v2(880,350)],
                    stone1: [cc.v2(230,220)],
                    stone2: [cc.v2(480,200),  cc.v2(680,240)],
                    diamond: [cc.v2(520,35)],
                }
                break;

            case 2:
                goods = {
                    gold1: [cc.v2(627,144), cc.v2(118,115), cc.v2(838,88)],
                    gold2: [cc.v2(85, 341), cc.v2(363,315), cc.v2(495,96)],
                    gold3: [cc.v2(230,237), cc.v2(537,243), cc.v2(792,336)],
                    stone1: [cc.v2(123,253), cc.v2(232,154)],
                    stone2: [cc.v2(398,168), cc.v2(635,240), cc.v2(874,286)],
                    diamond: [cc.v2(282,52), cc.v2(881,187)],
                    treasure: [cc.v2(431,49), cc.v2(744,59)]
                };
                this.runGoldMouse(cc.v2(-50,300), cc.v2(1000,300));
                break;

            case 3:    
                goods = {
                    gold3: [cc.v2(402,331), cc.v2(596,127), cc.v2(77,349), cc.v2(854,246)],
                    stone1: [cc.v2(65,180), cc.v2(552,195), cc.v2(188,286)],
                    stone2: [cc.v2(307,161), cc.v2(725,245)],
                    diamond: [cc.v2(157,85), cc.v2(501,180), cc.v2(409,52), cc.v2(818,87), cc.v2(71,284), cc.v2(862,165)],
                    treasure: [cc.v2(270,72), cc.v2(472,283), cc.v2(700,59), cc.v2(895,326)]
                }
                this.runGoldMouse(cc.v2(-50,250), cc.v2(1000,250));
                this.runDiamondMouse(cc.v2(-50,100), cc.v2(1000,100));
        }
        var type,obj, i;
        for(type in goods){
            for(i = 0; i < goods[type].length; i++ ){
                obj = cc.instantiate(this[type]);
                obj.parent = this.node,
                obj.setPosition(goods[type][i]);
            }           
        }
    },

    //跑黄金老鼠，传入老鼠开始出现的坐标
    runGoldMouse(fromPosition, toPosition){
        this.schedule(function(){
            cc.log('生成了一只带黄金的老鼠');
            var mouse = cc.instantiate(this['mouse&gold']);
            mouse.parent = this.node;
            mouse.setPosition(fromPosition);
            var mouseAction = cc.moveTo(this.goldMouseRunTime, toPosition);
            mouse.runAction(mouseAction);
            this.scheduleOnce(function(){
                //如果该只老鼠没有被钩子抓住并销毁，则自销毁
                if(cc.isValid(mouse)){
                    cc.log('带黄金的老鼠自动销毁了');
                    mouse.destroy();
                }
            }, this.goldMouseRunTime)
        }, this.goldMouseDelayTime);
    },

    //跑钻石老鼠，传入老鼠开始出现的坐标
    runDiamondMouse(fromPosition, toPosition){
        this.schedule(function(){
            cc.log('生成了一只带钻石的老鼠');
            var mouse = cc.instantiate(this['mouse&diamond']);
            mouse.parent = this.node;               
            mouse.setPosition(fromPosition);               
            var mouseAction = cc.moveTo(this.diamondMouseRunTime, toPosition);   
            mouse.runAction(mouseAction);
            this.scheduleOnce(function(){
                if(cc.isValid(mouse)){
                    cc.log('带钻石的老鼠自动销毁了');
                    mouse.destroy();
                }
            }, this.diamondMouseRunTime);                 
        }, this.diamondMouseDelayTime);
    }    
});
