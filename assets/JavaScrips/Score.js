
cc.Class({
    extends: cc.Component,

    properties: {
        score1:{
            default:null,
            type:cc.Label
        },
        score2:{
            default:null,
            type:cc.Label
        },
        score3:{
            default:null,
            type:cc.Label
        },

        //上次游戏分数
        yourScore:{
            default:null,
            type:cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.showScoreTable();
    },

    //返回菜单场景
    btnMenuClick(){
        cc.director.loadScene("Menu");
    },  

    //显示排行榜
    showScoreTable(){
        if(cc.sys.localStorage.getItem('top1')===0){
            this.score1.string=0;
        }
        if(cc.sys.localStorage.getItem('top2')===0){
            this.score2.string=0;
        }
        if(cc.sys.localStorage.getItem('top3')===0){
            this.score3.string=0;
        }

        this.score1.string=cc.sys.localStorage.getItem('top1');
        this.score2.string=cc.sys.localStorage.getItem('top2');
        this.score3.string=cc.sys.localStorage.getItem('top3');
        this.yourScore.string='上次游戏分数：'+cc.sys.localStorage.getItem('pretop');
    },


    // update (dt) {},
});
