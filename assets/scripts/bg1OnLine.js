let GLB = require("./interface/Glb");
// let engine = require("./MatchvsLib/MatchvsDemoEngine");
// let msg = require("./MatchvsLib/MatvhvsMessage");
cc.Class({
    extends: cc.Component,

    properties: {
        posX: 0,
        posY: 0,
        index: 0,
        color: '',
        image: '',
        hp: 0,
        mp: 0,
        lv: 0,
        tag: '',
        isOpen: false,
        isSelect: false,
        time: 0,
        dame:[]
        // inHe:false,
        // hpLabel: {
        //     default: null,
        //     type: cc.Label
        // },
        // mpLabel: {
        //     default: null,
        //     type: cc.Label
        // },

        // isClick:false
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    init: function (game) {
        this.game = game;
        // console.log("init")
        // this.enabled = true;
        // this.node.opacity = 255;
    },

    reuse(game) {
        this.init(game);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("onload" + this.node.name);

        // load the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
        //  cc.loader.loadRes('imgs/cocos', cc.SpriteFrame, function (err, spriteFrame) {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     }
        //     cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
        // });

        var self = this;
        // console.log("颜色：" + this.color);


        // var self = this;
        //    this.node.
        // console.log(this.node.children);
        //    console.log(this.tag);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {

            if(GLB.playerColor!==self.game.player){
                console.log('该另一个玩家了')
                return
            }
            if(self.game.selectChess){
                var node1 = self.game.selectChess;
                var bg1OnLine = node1.getComponent('bg1OnLine');
                if(bg1OnLine.hp!=0&&self.hp!=0){
                    //bg1OnLine.lv>this.lv
                    var hp3 = bg1OnLine.hp * Math.round(self.getRandomNum(100, 120) / 100)+10
                    var hp4 = Math.round(self.hp * self.getRandomNum(20, 40) / 100);
                    //bg1OnLine.lv<this.lv
                    var hp5 = self.hp * Math.round(self.getRandomNum(100, 120) / 100)+10
                    var hp6 = Math.round(bg1OnLine.hp * self.getRandomNum(20, 40) / 100);
                    self.dame = [hp3,hp4,hp5,hp6]
                }
            }
            
          
            if(self.game.eventTouchChess(self.index,self.dame)==0){
                self.touchChess()
            }

          



            // self.hpLabel.string = 'HP: ' + self.hp.toString();
            // self.mpLabel.string = 'MP: ' + self.mp.toString();

            // cc.rotateBy(90);
            // cc.flipX
            // self.offEvent();
            // if(self.isClick){
            //     console.log('已经点击过了');
            //     return;
            // }
            // var rto = cc.fadeOut(0.5);
            // self.node.runAction(rto);
            // self.isClick=true;

            // this.enabled
            // self.enabled=false;
            // self.node.x=self.node.x+128
            // 5 秒后销毁目标节点
            // setTimeout(function () {
            //     self.node.destroy();
            //   }.bind(this), 500);
            // self.node.destroy();
            // if(self.gameState ===  'white' && this.getComponent(cc.Sprite).spriteFrame === null){
            //     this.getComponent(cc.Sprite).spriteFrame = self.whiteSpriteFrame;//下子后添加棋子图片使棋子显示
            //     self.judgeOver();
            //     if(self.gameState == 'black'){
            //         self.scheduleOnce(function(){self.ai()},1);//延迟一秒电脑下棋
            //     }
            // }
        });
    },
    //点击棋子
    touchChess:function(){
        console.log('点击节点')
        var self = this
        console.log(self.node.name);
        if (self.node.name === 'kongOnline') {
            console.log('点击空节点');
            if (self.game.selectChess != null) {
                console.log('已经选择了棋子')
                self.move();
            } else {
                console.log('没有选择棋子')
                return
            }

        }

        else if (self.isOpen) {
            console.log('点击打开的节点')
            // self.touchChess = this;
            // console.log(self.game.node.childrenCount);
   
            console.log("index" + self.index);
            console.log("点击了" + self.x + self.y);
            console.log(self.image);
            console.log(self.tag);
            //判断是否翻开
            console.log('已经翻开');
            //只有棋子才能选择
            if (self.tag == 'chess') {
                self.node.setSiblingIndex(100);
                console.log(self.game.player);
                if (self.color == self.game.player) {
                    if (self.isSelect) {
                        console.log('已经选择,取消选择');
                        self.deSelect();
                    } else {
                        console.log('选择棋子');
                        // self.isSelect=true;
                        // self.node.setScale(1.2);
                        //取消其他选择的棋子
                        if (self.game.selectChess == null) {

                        } else {
                            self.game.selectChess.getComponent('bg1OnLine').deSelect();

                        }
                        self.select();
                    }
                } else {
                    //
                    //已经选择了自己的棋子，然后点击对方的棋子
                    //这属于吃子，这个时候需要判断距离，等级，hp等因数
                    //
                    if (self.game.selectChess != null && self.game.selectChess.getComponent('bg1OnLine').color == self.game.player) {
                        console.log('移动');
                        // console.log()

                        self.move();
                    } else {
                        //没有选择自己的棋子，然后点击对方棋子，

                        console.log('不是自己颜色的棋子');
                        if (self.game.player == 'hong') {

                            self.game.warning('请选择红色的棋子');
                        } else {
                            // self.game.warningLabel.string = '请选择黄色的棋子';
                            self.game.warning('请选择黄色的棋子');
                        }

                     
                    }
                }


            } else if (self.image == 'hp' && self.game.selectChess != null) {

                self.move()
            } else if (self.image == 'mp' && self.game.selectChess != null) {
                self.move()
            } else if (self.image == 'he' && self.game.selectChess != null) {
                self.move()
            }


        } else {
            //切换玩家
            self.game.changePlayer();
            //选择的取消选择
            if (self.game.selectChess != null) {
                self.game.selectChess.getComponent('bg1OnLine').deSelect();
            }

            self.isOpen = true;
            cc.loader.loadRes(self.image, cc.SpriteFrame, function (err, spriteFrame) {
                self.node.children[2].getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            if (self.tag == 'chess') {
                cc.loader.loadRes(self.color, cc.SpriteFrame, function (err, spriteFrame) {
                    self.node.children[1].getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    self.node.children[1].active = true;
                });
                self.node.children[3].getComponent(cc.Label).string = 'HP' + self.hp;

                console.log(self.hp)
                console.log(self.mp)
                self.node.children[3].active = true;
                self.node.children[4].getComponent(cc.Label).string = 'MP' + self.mp;
                self.node.children[4].active = true;
            }
            self.node.children[0].active = false;
            self.node.children[2].active = true;
        }
    },
    move: function () {
        console.log('开始移动')

        var node1 = this.game.selectChess;
        var pos1 = node1.getPosition();
        var pos2 = this.node.getPosition();
        console.log(pos1);
        console.log(pos2)
        var offsetX = Math.abs(pos2.x - pos1.x);
        var offsetY = Math.abs(pos2.y - pos1.y);
        console.log(offsetX)
        console.log(offsetY)
        if (offsetX < 64) {
            console.log('纵向移动')
            if (Math.abs(offsetY - 128) < 64) {

            } else {
                return
            }
        } else if (offsetY < 64) {
            console.log('横向移动')
            if (Math.abs(offsetX - 128) < 64) {

            } else {
                return
            }
        } else {
            console.log('不能移动')
            return
        }

        var ab = node1.getComponent('bg1OnLine');
        if (ab.mp <= 0) {
            this.game.warning('mp小于0没法移动');
            return;
        }

        //【规则】
        //等级高的攻击等级低的，对方受到自身hp*100%伤害，自己受到对方hp*20-40%的伤害
        //等级低的攻击等级高的，对方受到自身hp*20-40%的伤害，自身受到对方hp*100%伤害
        //每休息一个回合hp增加10,mp增加1
        //每杀死一个动物获得2点mp
        //每走1步减1点mp,过河减少2点mp,mp为0时需要下休息3个回合，然后mp增加5点
        //hp最大100，mp最大10
        //吃mp增加5点mp,吃hp增加5点hp

        var blink = cc.blink(0.5, 5);
        var fade = cc.fadeOut(0.5);
        if (this.tag == 'chess') {
            console.log('进入chess')
            console.log('伤害数组'+this.dame)
            // this.node.setLocalZOrder(100);
            ab.mp--;
            console.log("this.lv" + this.lv);
            console.log("ab.lv" + ab.lv);
            var hp1 = this.hp;
            var hp2 = ab.hp;
            if ((this.lv < ab.lv&&!(this.lv == 1 && ab.lv == 8)) || this.lv == 8 && ab.lv == 1) {
                // if (this.lv == 1 && ab.lv == 8) {
                //     return
                // }
                console.log('点击等级小');
                // var hp3 = hp2 * Math.round(this.getRandomNum(100, 120) / 100)+10
                this.hp = this.hp - this.dame[0];

                // node1.runAction(blink)
                var hp4 = Math.round(hp1 * this.getRandomNum(20, 40) / 100);
                ab.hp = ab.hp - this.dame[1];

                //    this.node.runAction(blink)
                if (this.hp <= 0) {
                    this.game.hpEffect(this.node.getPosition(), 'x_X')
                    console.log('移动位置')
                    console.log(node1.getPosition());
                    //在原来位置放一个空节点
                    // this.addNode(node1);
                    // cc.jumpTo
                    var actionTo = cc.jumpTo(0.5, this.node.getPosition(), 50, 2);

                    var seq = cc.sequence(blink, actionTo);
                    node1.runAction(seq);
                    this.node.runAction(fade)
                    // setTimeout(function () {

                } else {
                    this.game.hpEffect(this.node.getPosition(), 'hp-' + this.dame[0])
                    // node1.runAction(blink)
                    this.node.runAction(blink)
                }
                if (ab.hp <= 0) {
                    this.game.hpEffect(node1.getPosition(), 'x_X')
                    node1.runAction(fade)
                    // this.addNode(node1);
                } else {

                    this.game.hpEffect(node1.getPosition(), 'hp-' + this.dame[1])
                    // node1.runAction(blink)
                    // this.node.runAction(blink)
                }

                // this.node.setPosition(node1.getPosition());
            } else if (this.lv == ab.lv) {
                console.log('等于');
                ab.hp = ab.hp - hp1;

                this.hp = this.hp - hp2;

                if (ab.hp <= 0) {
                    this.game.hpEffect(node1.getPosition(), 'x_X')
                    node1.runAction(fade)
                    //在原来位置放一个空节点
                    // this.addNode(node1);
                } else {
                    this.game.hpEffect(node1.getPosition(), 'hp-' + hp2)
                    // node1.runAction(blink)
                    // node1.runAction(blink)
                }
                if (this.hp <= 0) {
                    this.game.hpEffect(this.node.getPosition(), 'x_X')
                    this.node.runAction(fade)
                    var actionTo = cc.jumpTo(0.5, this.node.getPosition(), 50, 2);

                    var seq = cc.sequence(blink, actionTo);
                    node1.runAction(seq)
                } else {
                    this.game.hpEffect(this.node.getPosition(), 'hp-' + hp1)
                    this.node.runAction(blink)
                }
            } else if ((this.lv > ab.lv&&!(this.lv == 8 && ab.lv == 1)) || this.lv == 1 && ab.lv == 8) {
                // if (this.lv == 8 && ab.lv == 1) {
                //     return
                // }
                console.log('点击等级大');
                // var hp3 = Math.round(this.hp * this.getRandomNum(120, 140) / 100);
                ab.hp = ab.hp - this.dame[2]

                // var hp4 = Math.round(hp2 * this.getRandomNum(20, 40) / 100);
                this.hp = this.hp - this.dame[3]

                if (this.hp <= 0) {

                    // this.addNode(node1);
                    console.log('移动位置')
                    // node1.setPosition(this.node.getPosition());
                    this.game.hpEffect(this.node.getPosition(), 'x_X')

                    var actionTo = cc.jumpTo(0.5, this.node.getPosition(), 50, 2);

                    var seq = cc.sequence(blink, actionTo);
                    node1.runAction(seq)
                    this.node.runAction(fade)
                } else {
                    this.node.runAction(blink)
                    this.game.hpEffect(this.node.getPosition(), 'hp-' + this.dame[3])
                }
                if (ab.hp <= 0) {
                    this.game.hpEffect(node1.getPosition(), 'x_X')
                    // this.addNode(node1);
                    node1.runAction(fade)
                } else {
                    // node1.runAction(blink)
                    this.game.hpEffect(node1.getPosition(), 'hp-' + this.dame[2])
                }
                //    node1.setPosition(this.node.getPosition());
                // this.node.setPosition(node1.getPosition());
            }


        } else if (this.node.name == 'kongOnline') {
            console.log('进入空')
            ab.mp--;
            // console.log('移动位置空')
            //在原来位置放一个空节点
            // this.addNode(node1);
            var actionTo = cc.jumpTo(0.5, this.node.getPosition(), 50, 2);
            node1.runAction(actionTo)
            // node1.setPosition(this.node.getPosition());
            // this.node.destroy();
        }
        else if (this.image == 'he') {
            console.log('进入河流');

            // node1.setSiblingIndex(100);
            // this.node.setSiblingIndex(1);
            // console.log("he");
            if (ab.mp < 2) {
                this.game.warning('mp小于2没法移动到河里');
                return;
            }
            ab.mp = ab.mp - 2;
            ab.hp = ab.hp - 10;
            
            // this.addNode(node1);
            // node1.setPosition(this.node.getPosition());
            var actionTo = cc.jumpTo(0.5, this.node.getPosition(), 50, 2);
            node1.runAction(actionTo)
            this.game.hpEffect(node1.getPosition(), 'hp-10,mp-2')
            // ab.inHe=true
        } else if (this.image == 'hp') {
            ab.mp--;
            console.log("进入hp");
            ab.hp = ab.hp + 50;
            if (ab.hp > 100) {
                ab.hp = 100;
            }
            var actionTo = cc.jumpTo(0.5, this.node.getPosition(), 50, 2);
            node1.runAction(actionTo)
            this.game.hpEffect(node1.getPosition(), 'hp+50')
            this.node.active =false
            setTimeout(function () {
                this.node.destroy();
            }.bind(this), 5000)

        } else if (this.image == 'mp') {
            ab.mp--;
            console.log("进入mp");
            ab.mp = ab.mp + 5;
            if (ab.mp > 10) {
                ab.mp = 10;
            }
            var actionTo = cc.jumpTo(0.5, this.node.getPosition(), 50, 2);
            node1.runAction(actionTo)
            this.game.hpEffect(node1.getPosition(), 'mp+5')

            this.node.active =false
            setTimeout(function () {
                this.node.destroy();
            }.bind(this), 5000)
            
        }
        if(ab.mp<=0){
            ab.hp=ab.hp-10
            ab.mp=1
            this.game.hpEffect(node1.getPosition(), 'hp-10')
        }
        if(this.tag=='chess'&&this.mp<=0){
            this.hp=this.hp-10
            this.mp=1
            this.game.hpEffect(this.node.getPosition(), 'hp-10')
        }
        console.log("this.hp" + this.hp);
        console.log("ab.hp" + ab.hp);
        if (this.node != null && this.tag == 'chess') {
            this.node.children[3].getComponent(cc.Label).string = 'HP' + this.hp;
            this.node.children[4].getComponent(cc.Label).string = 'MP' + this.mp;
        }
        if (node1 != null) {
            node1.children[3].getComponent(cc.Label).string = 'HP' + ab.hp;
            node1.children[4].getComponent(cc.Label).string = 'MP' + ab.mp;
        }

        if (ab.hp <= 0) {
            console.log('ab.hp小于0');
            if(ab.color=='hong'){
                this.game.hongNum--;
            }else if(ab.color=='huang'){
                this.game.huangNum--;
            }
            node1.active = false
           this.game.removeChess(ab.index)
            setTimeout(function () {
                
        
                node1.destroy()
                // console.log('棋子销毁成功')
            }.bind(this), 5000)
        }
       
        if (this.tag == 'chess' && this.hp <= 0) {
            if(this.color=='hong'){
                this.game.hongNum--;
            }else if(this.color=='huang'){
                this.game.huangNum--;
            }
            this.node.active = false
            console.log('this.hp小于0');
            // var self = this
            this.game.removeChess(this.index)
            setTimeout(function () {
                this.node.destroy();
            }.bind(this), 5000)
        }
      
        console.log("index" + ab.index)


        ab.deSelect();
        this.game.changePlayer();

    },

    getRandomNum: function (Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    },
    deSelect: function () {
        this.isSelect = false;
        this.node.setScale(1);
        this.game.selectChess = null;
    },
    select: function () {
        this.isSelect = true;
        this.node.setScale(1.2);
        this.game.selectChess = this.node;
    },
    start() {

    },
});
