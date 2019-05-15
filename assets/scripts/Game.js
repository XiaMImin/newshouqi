// let mvs = require("./MatchvsLib/Matchvs");
// let GLB = require("./Glb");
// let msg = require("./MatchvsLib/MatvhvsMessage");
// let engine = require("./MatchvsLib/MatchvsDemoEngine");
cc.Class({
    extends: cc.Component,
    properties: {
        back: cc.Node,
        chessList: {
            default: [],
            type: [cc.Node]
        },
        selectChess: {
            default: null,
            type: cc.Node
        },
        chessNode: {
            default: null,
            type: cc.Node
        },
        //引用地板预制资源
        bg1Prefab: {
            default: null,
            type: cc.Prefab
        },
        btnNode: {
            default: null,
            type: cc.Node
        },
        kongPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        playerLabel: {
            default: null,
            type: cc.Label
        },
        warningLabel: {
            default: null,
            type: cc.Label
        },
        player: 'hong',
        hongNum:8,
        huangNum:8

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log('gameOnload')
        this.back.on(cc.Node.EventType.TOUCH_END, function () {
            cc.director.loadScene('Start');
        });
        var self =this
        this.btnNode.on(cc.Node.EventType.TOUCH_END, function () {
            self.onStartGame()
        });
        this.scorePool = new cc.NodePool('ScoreFX');
        // engine.prototype.getRoomDetail(GLB.roomID);
        this.onStartGame()
    },

    //随机数组
    shuffle: function (arr) {
        var length = arr.length,
            randomIndex,
            temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr[randomIndex];
            arr[randomIndex] = arr[length];
            arr[length] = temp
        }
        return arr;
    },
    warning: function (msg) {
        this.warningLabel.string = msg;
        var self = this
        setTimeout(function () {
            self.warningLabel.string = '';

        }, 2000);
    },
    onStartGame: function () {
        console.log('开始游戏')
        this.btnNode.x = 3000;
        this.chessList =[]
         //清除所有节点
         for(var i=0;i<this.chessNode.childrenCount;i++){
            this.chessNode.children[i].destroy()
        }
        this.playerLabel.string = '该红色玩家了';
        this.spawnBg1()
    },
    gameOver:function(){
        this.btnNode.x=0;
        this.isSpawn =false;
    },
    spawnBg1: function () {
        console.log('创建地图')
        // var bg2 = cc.instantiate(this.bg2Prefab);
        // this.node.addChild(bg2);
        // if (!GLB.isRoomOwner) {
        //     console.log('只有房主可创建地图')
        //     return;    // 只有房主可创建地图
        // }
        // var self = this;

        this.itemIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        this.shuffle(this.itemIndex)
        console.log(this.itemIndex)
        this.createChessNode()


        // let event = new cc.Event(msg.EVENT_SPAWN_CHESS,true);
        // event["data"] = {item:item,type:msg.EVENT_SPAWN_CHESS};
        // cc.systemEvent.dispatchEvent(event);


    },
    createChessNode: function () {
        if (this.isSpawn) {
            return
        }
        var item1 = [{ tag: 'chess', name: 'xiang', color: 'hong', hp: '100', mp: '10', lv: 8 }
            , { tag: 'chess', name: 'shi', color: 'hong', hp: '100', mp: '10', lv: 7 },
        { tag: 'chess', name: 'hu', color: 'hong', hp: '100', mp: '10', lv: 6 },
        { tag: 'chess', name: 'bao', color: 'hong', hp: '100', mp: '10', lv: 5 },
        { tag: 'chess', name: 'lang', color: 'hong', hp: '100', mp: '10', lv: 4 },
        { tag: 'chess', name: 'gou', color: 'hong', hp: '100', mp: '10', lv: 3 },
        { tag: 'chess', name: 'mao', color: 'hong', hp: '100', mp: '10', lv: 2 },
        { tag: 'chess', name: 'shu', color: 'hong', hp: '100', mp: '10', lv: 1 },
        { tag: 'chess', name: 'xiang', color: 'huang', hp: '100', mp: '10', lv: 8 }
            , { tag: 'chess', name: 'shi', color: 'huang', hp: '100', mp: '10', lv: 7 },
        { tag: 'chess', name: 'hu', color: 'huang', hp: '100', mp: '10', lv: 6 },
        { tag: 'chess', name: 'bao', color: 'huang', hp: '100', mp: '10', lv: 5 },
        { tag: 'chess', name: 'lang', color: 'huang', hp: '100', mp: '10', lv: 4 },
        { tag: 'chess', name: 'gou', color: 'huang', hp: '100', mp: '10', lv: 3 },
        { tag: 'chess', name: 'mao', color: 'huang', hp: '100', mp: '10', lv: 2 },
        { tag: 'chess', name: 'shu', color: 'huang', hp: '100', mp: '10', lv: 1 },
        { tag: 'map', name: 'he' }, { tag: 'map', name: 'he' },
        { tag: 'map', name: 'he' }, { tag: 'map', name: 'he' },
        { tag: 'map', name: 'he' }, { tag: 'map', name: 'he' },
        { tag: 'item', name: 'hp' }, { tag: 'item', name: 'mp' }];
        var item = [];
        for (var i = 0; i < 24; i++) {
            item.push(item1[this.itemIndex[i]])
        }
        var index = 0;
        //初始化棋盘上225个棋子节点，并为每个节点添加事件
        for (var y = -2; y < 2; y++) {
            for (var x = -3; x < 3; x++) {
                var newNode = cc.instantiate(this.bg1Prefab);

                newNode.setPosition(cc.v2(x * 128 + 64, y * 128 + 64));
                // newNode.tag = y*15+x;
                // pass Game instance to star
                var bg1OnLine = newNode.getComponent('bg1');

                bg1OnLine.init(this);
                bg1OnLine.x = x;
                bg1OnLine.y = y;
                var bg2 = item[index];
                bg1OnLine.image = bg2.name;
                bg1OnLine.tag = bg2.tag;
                if (bg2.tag == 'chess') {
                    bg1OnLine.hp = bg2.hp;
                    bg1OnLine.mp = bg2.mp;
                    bg1OnLine.color = bg2.color;
                    bg1OnLine.lv = bg2.lv;
                }
                bg1OnLine.index = index;
                // console.log(bg1OnLine.image);
                if (bg1OnLine.tag != 'map') {
                    // console.log('不是map')
                    this.addNode(newNode, index + 24)
                }

                index++;
                this.chessNode.addChild(newNode);
                this.chessList.push(index);

            }
        }
        console.log(this.chessList)

        this.hongNum = 8
        this.huangNum = 8
        this.isSpawn = true
        console.log('棋子创建成功')
    },
    addNode: function (node, index) {
        // console.log('添加空node');
        var newNode = cc.instantiate(this.kongPrefab);
        newNode.setPosition(node.getPosition());
        var bg1OnLine = newNode.getComponent('bg1');
        // bg1OnLine.name = 'kong'
        bg1OnLine.index = index
        bg1OnLine.init(this);
        this.chessNode.addChild(newNode);
        this.chessList.push(index);
    },
    removeChess: function (index) {
        console.log('要删除的index:' + index)
        console.log('删除前棋子的数量' + this.chessList.length)
        for (var i = 0; i < this.chessList.length; i++) {
            if (this.chessList[i] == index) {
                this.chessList.splice(i, 1)
                console.log('剩余棋子的数量' + this.chessList.length)

                return
            }
        }


    },
    hpEffect: function (pos, str) {
        // 播放特效
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.node.children[0].children[0].getComponent(cc.Label).string = str;
        fx.play();
    },
    spawnScoreFX: function () {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            fx.init(this);
            return fx;
        }
    },
    despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
    },
    changePlayer: function () {
        console.log('hongNum'+this.hongNum)
        console.log('huangNum'+this.huangNum)
        if(this.hongNum<=0&&this.huangNum>0){
            this.playerLabel.string = '黄色玩家获胜';
            this.gameOver()
            return
        }else if(this.huangNum<=0&&this.hongNum>0){
            this.playerLabel.string = '红色玩家获胜';
            this.gameOver()
            return
        }else if(this.hongNum<=0&&this.huangNum<=0){
            this.playerLabel.string = '平手';
            this.gameOver()
            return
        }
        console.log('切换玩家');
        this.player = this.player == 'hong' ? 'huang' : 'hong';
        console.log(this.player);
        if (this.player == 'hong') {
            this.playerLabel.string = '该红色玩家了';
        } else {
            this.playerLabel.string = '该黄色玩家了';
        }
    },
    start() {
        // console.log('start')
    },

    // update (dt) {},
});
