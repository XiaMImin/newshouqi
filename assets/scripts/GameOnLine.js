let mvs = require("./MatchvsLib/Matchvs");
let GLB = require("./interface/Glb");
let msg = require("./MatchvsLib/MatvhvsMessage");
let engine = require("./MatchvsLib/MatchvsDemoEngine");

cc.Class({
    extends: cc.Component,
    properties: {
        // leaveRoom:cc.Button,
        // chessList: {
        //     default: [],
        //     type: [cc.Node]
        // },
        isSpawn: false,
        chessList: [],
        selectChess: {
            default: null,
            type: cc.Node
        },
        chessNode: {
            default: null,
            type: cc.Node
        },
        buttonLeaveRoom: {
            default: null,
            type: cc.Node
        },
        //引用地板预制资源
        bg1OnLinePrefab: {
            default: null,
            type: cc.Prefab
        },
        // btnNode: {
        //     default: null,
        //     type: cc.Node
        // },
        kongOnLinePrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        titleLabel: {
            default: null,
            type: cc.Label
        },
        playerLabel: {
            default: null,
            type: cc.Label
        },
        timeLabel: {
            default: null,
            type: cc.Label
        },
        warningLabel: {
            default: null,
            type: cc.Label
        },
        player: 'hong',
        hongNum: 8,
        huangNum: 8,
        userInfos: [],
        itemIndex: [],
        timeLeft:20
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        engine.prototype.getRoomDetail(GLB.roomID);
        let self = this;
        this.initEvent();
        GLB.isGameOver = false;
        this.scorePool = new cc.NodePool('ScoreFX');
        this.onStartGame()
        this.buttonLeaveRoom.on(cc.Node.EventType.TOUCH_END, function () {
            console.log('离开房间')
            // for (let i = 0, l = self.players.length; i < l; i++) {
            //     self.players[i].stopAllActions()
            // }
            GLB.isGameOver = true;
            engine.prototype.leaveRoom();
            cc.director.loadScene('Lobby');
        });
    },
    /**
      * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
      */
    initEvent: function () {
        cc.systemEvent.on(msg.MATCHVS_ROOM_DETAIL, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SEND_EVENT_RSP, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_FRAME_UPDATE, this.onEvent, this);
        // cc.systemEvent.on(msg.EVENT_SPAWN_CHESS,this.onEvent,this);
        // cc.systemEvent.on(msg.EVENT_TOUCH_CHESS,this.onEvent,this);
        // cc.systemEvent.on(msg.EVENT_NEW_START,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SET_FRAME_SYNC_RSP, this.onEvent, this);
    },

    onEvent: function (event) {
        console.log(event)
        let eventData = event.data;
        switch (event.type) {
            case msg.MATCHVS_ROOM_DETAIL:
                console.log('msg.MATCHVS_ROOM_DETAIL')
                console.log('房间信息' + eventData.rsp)
                GLB.ownew = eventData.rsp.owner;
                // for (let i = 0; i <eventData.rsp.userInfos.length;i++) {
                //     if (eventData.rsp.userInfos[i].userID !== GLB.userID) {
                //         this.userInfos.push(eventData.rsp.userInfos[i]);
                //         // let userScore = {userID:0,Score:0};
                //         // userScore.userID = eventData.rsp.userInfos[i].userID;
                //         // userScore.Score = 0;
                //         // this.userScores.push(userScore);
                //     }
                // }
                // if (eventData.rsp.owner === GLB.userID) {
                //     GLB.isRoomOwner = true;
                //     this.playerLabel.string='该玩家'+GLB.userID
                //     // // 创建星星
                //     // this.spawnNewStar();
                //     // if (GLB.syncFrame === true) {
                //     //     this.setFrameRate();
                //     // }
                // }
                // let result = engine.prototype.sendEvent('123')
                // console.log(result)
                // if (result !== 0)
                //     return console.error('创建EVENT_TOUCH_CHESS事件发送失败');
                if (eventData.rsp.owner === GLB.userID) {
                    console.log('是房主')
                    GLB.isRoomOwner = true;
                    GLB.playerColor = 'hong'
                    this.playerLabel.string = '我方红色';
                    // this.titleLabel.string = '该我方了';
                    // 创建棋子
                    this.spawnbg1OnLine();
                    if (GLB.syncFrame === true) {
                        this.setFrameRate();
                    }
                }else{
                    GLB.playerColor = 'huang'
                    this.playerLabel.string = '我方黄色';
                    // this.titleLabel.string = '该对方了';
                }
                this.playerTimer()
                //没有创建棋盘
                if (!GLB.isRoomOwner && !this.isSpawn) {
                    //发送消息，让房主再次发送棋盘信息
                    let event1 = {
                        action: msg.EVENT_RESEND_SPAWN_CHESS,
                        // chess: this.itemIndex
                    };
                    console.log(event1)
                    console.log(JSON.stringify(event1))
                    let result = engine.prototype.sendEvent(JSON.stringify(event1))
                    console.log(result)
                    if (result == 0) {
                        console.log('通知房主成功')
                        // if(!this.isSpawn){
                        //     this.createChessNode()
                        // }

                    } else {
                        console.error('通知房主失败')
                        return 1;
                    }
                }
                // for (let i = 1; i < this.players.length; i++) {
                //     (!this.players[i]) && (this.players[i] = this.node.getChildByName("Player" + (i + 1)).node);
                //     this.players[i].getChildByName("playerLabel").getComponent(cc.Label).string = this.userScores[i].userID;
                //     this.scoreDisplays[i].string = this.userScores[i].userID + ":"+this.userScores[i].Score ;
                // }
                // GLB.number2 = this.userScores[1].userID + ':' + this.userScores[1].Score;
                // GLB.number3 = this.userScores[2].userID + ':' + this.userScores[2].Score;
                // this.players[0].getChildByName("playerLabel").getComponent(cc.Label).string = GLB.userID;
                break;
            case msg.MATCHVS_SEND_EVENT_RSP:


                console.log('msg.MATCHVS_SEND_EVENT_RSP')
                // console.log('eventData'+eventData.)
                break;
            case msg.MATCHVS_SEND_EVENT_NOTIFY:
                console.log('msg.MATCHVS_SEND_EVENT_NOTIFY')
                if (eventData.eventInfo.srcUserId !== GLB.userID) {
                this.onNewWorkGameEvent(eventData.eventInfo);
                }
                break;
            case msg.MATCHVS_ERROE_MSG:
                console.log('msg.MATCHVS_ERROE_MSG')
                this.labelLog("[Err]errCode:" + eventData.errorCode + " errMsg:" + eventData.errorMsg);
                cc.director.loadScene('Start');
                break;
            // case msg.EVENT_SPAWN_CHESS:
            //     console.log('msg.EVENT_SPAWN_CHESS')
            //     this.createChessNode(eventData.item)
            //     break;
            // case msg.EVENT_TOUCH_CHESS:
            //     console.log('msg.EVENT_TOUCH_CHESS')
            //     this.touchChess(eventData.chessPos)
            //     break;
            // case msg.MATCHVS_FRAME_UPDATE:
            // console.log('msg.MATCHVS_FRAME_UPDATE')
            //     // let rsp = event.detail;
            //     for (let i = 0; i < eventData.data.frameItems.length; i++) {
            //         let info = eventData.data.frameItems[i];
            //         this.onNewWorkGameEvent(info);
            //     }
            //     break;
            // case msg.PLAYER_POSINTON:
            // console.log('msg.PLAYER_POSINTON')
            //     try{
            //         if (this.newStar !== undefined) {
            //             if (Math.abs(eventData.x - GLB.NEW_STAR_POSITION) < 15) {
            //                 if (this.newStar.active !== null && this.newStar.active !== undefined) {
            //                     this.newStar.active = false;
            //                     let frameData = JSON.stringify({
            //                         "action": msg.EVENT_GAIN_SCORE,
            //                         "userID": GLB.userID,
            //                     });
            //                     engine.prototype.sendEventEx(0,frameData);
            //                     let event = {
            //                         action: msg.EVENT_NEW_START,
            //                         position: this.getNewStarPosition()
            //                     };
            //                     this.createStarNode(event.position);
            //                     engine.prototype.sendEvent(JSON.stringify(event));
            //                 }
            //             }
            //         }
            //     } catch(error){
            //         console.log(error.message);
            //     }
            //     break;
            case msg.MATCHVS_LEAVE_ROOM_NOTIFY:
                this.labelLog("leaveRoomNotify");
                if (!GLB.isGameOver) {
                    this.gameOver('对方离开房间，我方获胜');
                }
                break;
            case msg.MATCHVS_NETWORK_STATE_NOTIFY:
                this.networkStateNotify(eventData.netNotify);
                break;
        }
    },
    /**
   * 设置帧率
   */
    setFrameRate() {
        let result = engine.prototype.setFrameSync(GLB.FRAME_RATE);
        if (result !== 0) {
            this.labelLog('设置帧同步率失败,错误码:' + result);
        }
    },
    update: function (dt) {
        // if (this.timer > this.gameTime)
        //     if (!GLB.isGameOver) {
        //         this.gameOver();
        //     }
        // this.timer += dt
    },
    setFrameSyncResponse: function (rsp) {
        this.labelLog('setFrameSyncResponse, status=' + rsp.detail.status);
        if (rsp.detail.status !== 200) {
            this.labelLog('设置同步帧率失败，status=' + rsp.status);
        } else {
            this.labelLog('设置同步帧率成功, 帧率为:' + GLB.FRAME_RATE);
        }
    },
    subscribeEventGroupResponse: function (status, groups) {
        this.labelLog("[Rsp]subscribeEventGroupResponse:status=" + status + " groups=" + groups);
    },

    sendEventGroupResponse: function (status, dstNum) {
        this.labelLog("[Rsp]sendEventGroupResponse:status=" + status + " dstNum=" + dstNum);
    },
    onNewWorkGameEvent: function (info) {
        console.log('onNewWorkGameEvent')
        console.log(info)
        if (info && info.cpProto) {
            let event = JSON.parse(info.cpProto);
            console.log(event)
            console.log(event.userID)
            if (event.action === msg.EVENT_SPAWN_CHESS) {
                // 收到创建棋子的消息通知，根据消息给的坐标创建棋子
                this.itemIndex = event.chess
                this.createChessNode()
            }
            else if (event.action === msg.EVENT_TOUCH_CHESS) {
                // console.log(new Date().getSeconds(), "收到位移消息"+event.x);
                this.updateTouchChess(event);
            } else if (event.action === msg.EVENT_RESEND_SPAWN_CHESS) {
                console.log("重新发送棋盘信息")
            
                    console.log(this.itemIndex)
                    let event1 = {
                        action: msg.EVENT_SPAWN_CHESS,
                        chess: this.itemIndex
                    };
                    console.log(event1)
                    console.log(JSON.stringify(event1))
                    let result = engine.prototype.sendEvent(JSON.stringify(event1))
                    console.log(result)
                    if (result == 0) {
                        console.log('创建chess事件发送成功')
                        // if(!this.isSpawn){
                        //     this.createChessNode()
                        // }

                    } else {
                        console.error('创建chess事件发送失败')
                        return 1;
                    }
                


            }
            else if (event.action === msg.EVENT_GAME_OVER) {
                // console.log(new Date().getSeconds(), "收到位移消息"+event.x);
               console.log('gameover')
               GLB.isGameOver=true
                   this.gameOver(event.title)
               
            }
            // else if (event.action === msg.EVENT_PLAYER_POSINTON_CHANGED) {
            //     // console.log(new Date().getSeconds(), "收到位移消息"+event.x);
            //     this.updatePlayerMoveDirection(event);
            // } 
            // else if (event.action === msg.EVENT_GAIN_SCORE) {
            //     this.refreshScore(event);
            // } 
            // else if (event.action === msg.GAME_RECONNECT) {
            //     this.reconnection(event.cpProto);

            // }
        }
    },

    /**
     * 重连进来的玩家
     * @param event
     */
    reconnection: function (event) {
        for (let a = 0; a < this.userScores.length; a++) {
            for (let i = 0; i < event.length; i++) {
                if (this.userScores[a].userID === event[i].userID) {
                    console.log(this.userScores[a].Score, event[i].Score);
                    this.userScores[a].Score = event[i].Score;
                }
            }
            this.scoreDisplays[a].string = this.userScores[a].userID + ":" + this.userScores[a].Score;
        }
    },

    sendEventGroupNotify: function (srcUid, groups, cpProto) {
        this.labelLog("收到分组消息：" + cpProto);
    },
    // 更新每个玩家的移动方向
    //  updatePlayerMoveDirection: function (event) {
    //     if (event.userID !== GLB.userID) {
    //         let player = this.getPlayerByUserId(event.userID);
    //         if (player) {
    //             player.onPostionChanged(event.x, event.arrow);
    //         } else {
    //             console.warn("Not Found the user:" + event.userID);
    //         }
    //     }
    // },
    //更新打开的棋子
    updateTouchChess: function (event) {
        console.log('更新点击的棋子' + event.chessPos)
        console.log('伤害数组' + event.dame)
        console.log('当前棋子的数量' + this.chessList.length)
        //如果不是本人操作

            // for (var i = 0; i < this.chessList.length; i++) {

            //     if (this.chessList[i] == event.chessPos) {
            //         bg1OnLine.dame = event.dame
            //         bg1OnLine.touchChess()
            //         return
            //     }

            // }
            for (var i = 0; i < this.chessNode.childrenCount; i++) {
                var bg1OnLine = this.chessNode.children[i].getComponent('bg1OnLine');
                if (bg1OnLine.index == event.chessPos) {
                    bg1OnLine.dame = event.dame
                    bg1OnLine.touchChess()
                    return
                }
            }

            // let player = this.getPlayerByUserId(event.userID);
            // if (player) {
            //     player.onPostionChanged(event.x, event.arrow);
            // } else {
            //     console.warn("Not Found the user:" + event.userID);
            // }
        
    },

    // 随机返回'新的星星'的位置
    // getNewStarPosition: function () {
    //     let randX = this.randomMinus1To1() * this.starMaxX;
    //     let randY = -90;
    //     return cc.v2(randX, randY)
    // },
    // getPlayerByUserId: function (userId) {
    //     for (let i = 0; i < this.players.length; i++) {
    //         if (this.players[i].getChildByName("playerLabel").getComponent(cc.Label).string == userId) {
    //             return this.players[i].getComponent("Player");
    //         }
    //     }
    // },
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
        // this.btnNode.x = 3000;
        this.chessList = []
        //清除所有节点
        for (var i = 0; i < this.chessNode.childrenCount; i++) {
            this.chessNode.children[i].destroy()
        }

    },
    gameOver: function (str) {
        console.log(str)
        this.titleLabel.string = str;
       
        if(!GLB.isGameOver){
            let event = {
                action: msg.EVENT_GAME_OVER,
                // action: msg.EVENT_TOUCH_CHESS,
                title: str,
            };
            let result = engine.prototype.sendEvent(JSON.stringify(event))
            console.log(result)
            if (result !== 0) {
                console.error('EVENT_GAME_OVER失败');
            } else {
                console.log('EVENT_GAME_OVER成功')
            }
        }
        // this.btnNode.x=0;
        GLB.isGameOver = true;
     
        // for (let i = 0, l = this.players.length; i < l; i++) {
        //     this.players[i].stopAllActions();
        //     this.players[i].destroy();
        // }
        setTimeout(function () {

            engine.prototype.leaveRoom();
            cc.director.loadScene('Lobby');
            // console.log('棋子销毁成功')
        }.bind(this), 5000)




    },

    labelLog: function (info) {
        // this.labelInfo.string += '\n' + info;
        console.log('info:' + info)
    },

    networkStateNotify: function (netNotify) {
        console.log("netNotify");
        console.log("netNotify.owner:" + netNotify.owner);
        if (netNotify.owner === GLB.userID) {
            GLB.isRoomOwner = true;
        }
        if (netNotify.userID === GLB.userID && netNotify.state === 1) {
            console.log("netNotify.userID :" + netNotify.userID + "netNotify.state: " + netNotify.state);
            cc.director.loadScene("Start");
        }

        console.log("玩家：" + netNotify.userID + " state:" + netNotify.state);
        if (netNotify.state === 2) {
            console.log("玩家已经重连进来");
            let event = {
                action: msg.GAME_RECONNECT,
                cpProto: this.userScores
            };
            setTimeout(function () {
                mvs.engine.sendEventEx(0, JSON.stringify(event), 0, [netNotify.userID]);
            }, 500
            );
        }
    },
    /**
     * 移除监听
     */
    removeEvent: function () {
        cc.systemEvent.off(msg.MATCHVS_ROOM_DETAIL, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SEND_EVENT_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SEND_EVENT_RSP, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_FRAME_UPDATE, this.onEvent);
        // cc.systemEvent.off(msg.EVENT_SPAWN_CHESS,this.onEvent);
        // cc.systemEvent.off(msg.EVENT_TOUCH_CHESS,this.onEvent);
        // cc.systemEvent.off(msg.EVENT_NEW_START,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SET_FRAME_SYNC_RSP, this.onEvent);
    },

    onDestroy: function () {
        this.removeEvent();
        if (this.countDown != null) {
            clearInterval(this.countDown);
        }
        GLB.syncFrame = false;
        GLB.isGameOver = true;
    },

    randomMinus1To1: function () {
        return 2 * (Math.random() - .5);
    },
    //点击棋子事件
    eventTouchChess: function (index, dame) {
        console.log('发送点击棋子事件' + index)
        let event = {
            action: msg.EVENT_TOUCH_CHESS,
            // action: msg.EVENT_TOUCH_CHESS,
            chessPos: index,
            dame: dame

        };
        console.log(JSON.stringify(event))
        let result = engine.prototype.sendEvent(JSON.stringify(event))
        console.log(result)
        if (result !== 0) {
            console.error('创建EVENT_TOUCH_CHESS事件发送失败');

            return 1
        } else {
            console.log('发送点击事件成功')
            return 0
        }

        // let event = new cc.Event(msg.EVENT_TOUCH_CHESS,true);
        // event["data"] = {chessPos:index,type:msg.EVENT_TOUCH_CHESS};
        // cc.systemEvent.dispatchEvent(event);
    },
    spawnbg1OnLine: function () {
        console.log('创建地图')
        // var bg2 = cc.instantiate(this.bg2Prefab);
        // this.node.addChild(bg2);
        if (!GLB.isRoomOwner) {
            console.log('只有房主可创建地图')
            return;    // 只有房主可创建地图
        }
        // var self = this;

        this.itemIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        this.shuffle(this.itemIndex)
        console.log(this.itemIndex)
        let event1 = {
            action: msg.EVENT_SPAWN_CHESS,
            chess: this.itemIndex
        };
        // console.log(event1)
        // console.log(JSON.stringify(event1))
        let result = engine.prototype.sendEvent(JSON.stringify(event1))
        console.log(result)
        if (result == 0) {
            console.log('创建chess事件发送成功')
            if (!this.isSpawn) {
                this.createChessNode()
            }

        } else {
            console.error('创建chess事件发送失败')
            return 1;
        }


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
                var newNode = cc.instantiate(this.bg1OnLinePrefab);

                newNode.setPosition(cc.v2(x * 128 + 64, y * 128 + 64));
                // newNode.tag = y*15+x;
                // pass Game instance to star
                var bg1OnLine = newNode.getComponent('bg1OnLine');

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
        var newNode = cc.instantiate(this.kongOnLinePrefab);
        newNode.setPosition(node.getPosition());
        var bg1OnLine = newNode.getComponent('bg1OnLine');
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
            // var bg1OnLine= this.chessList[i].getComponent('bg1OnLine');
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
        console.log('hongNum' + this.hongNum)
        console.log('huangNum' + this.huangNum)
        if (this.hongNum <= 0 && this.huangNum > 0) {
        

            this.gameOver('黄色玩家获胜')
            return
        } else if (this.huangNum <= 0 && this.hongNum > 0) {
           
            this.gameOver('红色玩家获胜')
            return
        } else if (this.hongNum <= 0 && this.huangNum <= 0) {
         
            this.gameOver('平手')
            return
        }

        console.log('切换玩家');

        this.player = this.player == 'hong' ? 'huang' : 'hong';
        console.log(this.player);
       this.playerTimer()
        // if (this.player == 'hong') {
        //     if(GLB.playerColor=='hong'){
        //         this.titleLabel.string = '该我方了';
        //     }else{
        //         this.titleLabel.string = '该对方了';
        //     }
            
        // } else {
        //     if(GLB.playerColor=='hong'){
        //         this.titleLabel.string = '该对方了';
        //     }else{
        //         this.titleLabel.string = '该我方了';
        //     }
        
        // }
    },
    // timeCount:function(){

    // },
    playerTimer:function(){
        this.callback = function () {
            this.timeLeft--;
            console.log(this.timeLeft)
            if(this.timeLeft<0){
                if(this.player==='hong'){
                    this.gameOver('红方超时，黄色玩家获胜')
                 
                }else{
                    this.gameOver('黄方超时，红色玩家获胜')
             
                }
                this.unschedule(this.callback);
               
            }else{
                console.log('剩余时间:'+this.timeLeft)
                this.timeLabel.string = ''+this.timeLeft;
            }
            
          
        }
        this.unscheduleAllCallbacks();
        if(this.player===GLB.playerColor){
            this.titleLabel.string = '该我方了';
      
            
            this.schedule(this.callback, 1);
            // setTimeout(function () {
            
                
                
            //   }.bind(this), 1000);
        }else{
            
            this.titleLabel.string = '该对方了';
            this.timeLeft=20
            this.timeLabel.string = '';
        }
    },
    start() {
        // console.log('start')
    },

    // update (dt) {},
});
