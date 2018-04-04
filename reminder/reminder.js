var schedule = require('node-schedule');
var db = require('../db/db.js');
var wx = require('../wx/wx.js');

var sendPendingOrders = function(){
var orders = db.getPendingOrdersOfTomorrow();
wx.sendOrders2Dad(orders);
};

//If scheduled time is changed, should change getPendingOrdersOfTomorrow accordingly
var send2DadJob = function(){
    schedule.scheduleJob('* 21 * * *', sendPendingOrders);
};

module.exports = {
    startSend2DadJob: send2DadJob
}