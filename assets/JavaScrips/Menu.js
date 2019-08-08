
cc.Class({
    extends: cc.Component,

    properties: {
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
        settingBoard: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var mouseAni = this.mouse.getComponent(cc.Animation);
        mouseAni.play('start_mouse');
        this.schedule(function(){
            mouseAni.play('start_mouse');
        }, 8);
    },

    start () {

    },

    toMainGame:function(){
        cc.director.loadScene("Game");
    },

    btnOptionClick() {
        this.mask.active = true;
        this.settingBoard.getComponent(cc.Animation).play('option');
    }    

    // update (dt) {},
});
