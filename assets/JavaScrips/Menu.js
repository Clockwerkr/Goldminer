var config=require('config');
var player=config.player;

cc.Class({
    extends: cc.Component,

    properties: {
        //点击时候的音效
        clicksound:{
            default:null,
            type:cc.AudioClip
        },
        isSound:true,
        isMusic:true,
        // 游戏背景音效资源
        currentbgAudio: null,
        //菜单关闭按钮
        closeMenubutton:{
            type:cc.Node,
            default:null
        },
        soundonbtn:{
            type:cc.Node,
            default:null
        },
        soundoffbtn:{
            type:cc.Node,
            default:null
        },
        musiconbtn:{
            type:cc.Node,
            default:null
        },
        musicoffbtn:{
            type:cc.Node,
            default:null
          }, 
        exitGameBtn:{
            default:null,
            type:cc.Node
        },
        menu:{
            default:null,
            type:cc.Node
        },
        mask:{
            default:null,
            type:cc.Node
        },
         //排行榜
         btnTopscore:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        //声明为常驻节点，不会随场景切换销毁
        cc.game.addPersistRootNode(this.node);

        if(cc.sys.localStorage.getItem('top1')==null){
            console.log("清零执行")
            cc.sys.localStorage.setItem('top1',0);
            cc.sys.localStorage.setItem('top2',0);
            cc.sys.localStorage.setItem('top3',0);
            }
    },

    //关闭菜单
    menuhide:function(){
        player.pause=false;
        // this.settingBoard.getComponent(cc.Animation).play('optionHide');
        var moveH = cc.moveTo(1,cc.v2(488,880));
        this.node.runAction(moveH);
        var finished = cc.callFunc(function(target,numb){
            this.mask.active=false;
        }, this,0);
        var menuHide =cc.sequence(moveH,finished);
        this.node.runAction(menuHide);
        cc.log("menuhide");
    },

    start () {

    },

    //菜单弹出
    menushow:function() {
        player.pause=true;
        this.mask.active = true;
        var moveS = cc.moveTo(1,cc.v2(536,292));
        this.node.runAction(moveS);
        cc.log("menushow!");
    },

    btnExitClick:function(){
        cc.game.end();
    },

    btnMusicOff:function(){
        player.soundState = false;
        this.musciCtrl(true); 
        this.playClickSound();
    },
    btnMusicOn:function(){
        player.soundState = true;
        this.musciCtrl(false); 
        this.playClickSound();
        
    },
    btnSoundOn:function(){
        this.soundCtrl(false);
        this.playClickSound();
    },
    btnSoundOff:function(){
        this.soundCtrl(true);
        this.playClickSound();
    },
    initsound:function(){  
        this.soundCtrl(player.isSound!=='false');
        this.musciCtrl(player.isMusic!=='false');  
     }, 
     playClickSound:function(){  
        if(player.isSound){   
            cc.audioEngine.playEffect(this.clicksound,false,true); 
        } 
    },
    //声音控制(true 播放)
    soundCtrl:function(isplay){
            console.log(isplay)
            player.isSound=isplay; 
            this.soundonbtn.active=isplay;
            this.soundoffbtn.active=!isplay;  
    },
    musciCtrl:function(isplay){  
            player.isMusic=isplay;  
            this.musiconbtn.active=isplay;
            this.musicoffbtn.active=!isplay; 
            this.menuSoundCtrl(isplay);
    },
    //设置现在背景音乐
    setcurrentbgAudio:function(currentbgAudio){ 
        this.currentbgAudio&&cc.audioEngine.stopMusic();
        this.currentbgAudio=currentbgAudio;
        this.initsound();
    },
    menuSoundCtrl: function (isplay) {
        // 调用声音引擎播放声音
        if(isplay){
            cc.audioEngine.playMusic(this.currentbgAudio,true); 
        }else{
            cc.audioEngine.stopMusic(); 
        }
        
    },
     //进入排行榜
    //  btnTopscoreClick(){
    //     cc.director.loadScene("Topscore");
    // },

    // update (dt) {},
});
