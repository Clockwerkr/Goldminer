var config=require('config');
var player=config.player;
cc.Class({
    extends: cc.Component,

    properties: {  
         // 首页背景音效资源
        menubgAudio: {
            default: null,
            type: cc.AudioClip
        },
        btnstartgame:{
            default:null,
            type:cc.Node
        },
        mouse: {
            default: null,
            type: cc.Node
        }, 
        mask: {
            default: null,
            type: cc.Node
        },
        //菜单弹出按钮
        settingBoard: {
            default: null,
            type: cc.Node
        },
        starBtn:{
            default:null,
            type:cc.Node
        },
    },
    settingbuttonClick:function(){
        cc.find("menu").getComponent("menu").menushow();
    }, 
    startgameClick:function(){ 
        cc.director.loadScene('Game');
    },
    // use this for initialization
    onLoad: function () {  
        //老鼠的动画
        var mouseAni = this.mouse.getComponent(cc.Animation);
        mouseAni.play('start_mouse');
        this.schedule(function(){
            mouseAni.play('start_mouse');
        }, 8);

        cc.find("menu").getComponent("menu").setcurrentbgAudio(this.menubgAudio);
    },
    btnTopscoreClick(){
        cc.director.loadScene("Topscore");
    },
    
});