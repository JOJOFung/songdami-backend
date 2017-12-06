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

function _queryOrder(sOpenId, fnCallback) {
    var aOrders = [];

    db = new sqlite3.Database('songdami.db');

    db.each("SELECT rowid AS id, item AS name, deliverDate AS date FROM itemorder WHERE openId = '" + sOpenId + "' AND deliverDate >= DATE('now') ORDER BY deliverDate ASC",
        function (err, row) {
            aOrders.push(row);
        },
        function () {
            typeof fnCallback == "function" && fnCallback(aOrders);
        });

    db.close();
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
    deleteOrder: deleteOrder
};