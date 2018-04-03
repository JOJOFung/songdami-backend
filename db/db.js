var wx = require('../wx/wx.js');
var sqlite3 = require('sqlite3').verbose();
var db = null;

function save2DB(oOrder) {
    _getOrderTable();
    wx.getOpenId(oOrder.code, _insertOrder, oOrder);
}

function getOrders(sCode, fnCallback) {
    wx.getOpenId(sCode, _queryOrder, fnCallback);
}

function getPendingOrdersOfTomorrow(){
   return _getPendingOrdersOfTomorrow();
}

function deleteOrder(iId, sCode, fnCallback) {
    _deleteOrder(iId, sCode, fnCallback);
}

function _insertOrder(sOpenId, oOrder) {

    db.run("INSERT INTO itemorder VALUES (?, ?, ?, ?, ?, ?, ?)",
        sOpenId,
        oOrder.name + oOrder.sex,
        oOrder.telephone,
        oOrder.itemName,
        oOrder.address,
        oOrder.date,
        new Date()
    );

    db.close();
}

function _queryOrder(sOpenId) {
    console.log(sOpenId);

    var aOrders = [];

    db = new sqlite3.Database('songdami.db');

    db.each("SELECT rowid AS id, item AS name, deliverDate AS date FROM itemorder WHERE openId = '" + sOpenId + "' AND deliverDate >= DATE('now') ORDER BY deliverDate ASC",
        function (err, row) {
            aOrders.push(row);
        });

    db.close();
}

function _getPendingOrdersOfTomorrow(){
    var aOrders = [];

    db = new sqlite3.Database('songdami.db');

    db.each("SELECT rowid AS id, name AS name, telephone AS telephone, item AS item, address AS address FROM itemorder WHERE deliverDate = DATE('now','+1 day') ORDER BY id ASC",
        function (err, row) {
            aOrders.push(row);
        });

    db.close();

    return aOrders;
}

function _deleteOrder(iId, sCode, fnCallback) {
    db = new sqlite3.Database('songdami.db');

    db.run("DELETE FROM itemorder WHERE rowid =" + iId + " AND deliverDate > DATE('now')", function (error) {
        getOrders(sCode, fnCallback);
    });

    db.close();
}

function _getOrderTable() {
    db = new sqlite3.Database('songdami.db');
    db.run("CREATE TABLE IF NOT EXISTS itemorder (openId TEXT, name TEXT, telephone TEXT, item TEXT, address TEXT, deliverDate date, createTime datetime)");
}

module.exports = {
    save2DB: save2DB,
    getOrders: getOrders,
    deleteOrder: deleteOrder,
    getPendingOrdersOfTomorrow: getPendingOrdersOfTomorrow
};