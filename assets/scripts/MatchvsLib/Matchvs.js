let engine;
let response = {};
let MsMatchInfo;
let MsCreateRoomInfo;
let MsRoomFilterEx;
let LocalStore_Clear;
try {
    engine =  new window.MatchvsEngine();
    response = new window.MatchvsResponse();
    MsMatchInfo = window.MsMatchInfo;
    MsCreateRoomInfo = window.MsCreateRoomInfo;
    MsRoomFilterEx  = window.MsRoomFilterEx ;
    LocalStore_Clear = window.LocalStore_Clear;
    console.log('load matchvs success')
} catch (e) {
	console.warn("load matchvs fail,"+e.message);
}
module.exports = {
    engine: engine,
    response: response,
    MsMatchInfo: MsMatchInfo,
    MsCreateRoomInfo: MsCreateRoomInfo,
    MsRoomFilterEx :MsRoomFilterEx ,
    LocalStore_Clear:LocalStore_Clear,
};