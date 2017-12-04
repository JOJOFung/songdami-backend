var wx = require('../wx/wx.js');
var sqlite3 = require('sqlite3').verbose();
var db = null;

function save2DB(oOrder) {
    _getOrderTable();
    wx.getOpenId(oOrder.code, _insertOrder, oOrder);
}

function _insertOrder(sOpenId, oOrder) {
    db.serialize(function () {
        db.run("INSERT INTO itemorder VALUES (?, ?, ?, ?, ?, ?, ?)",
            sOpenId,
            oOrder.name + oOrder.sex,
            oOrder.telephone,
            oOrder.itemName,
            oOrder.address,
            oOrder.date,
            new Date()
        );

        db.each("SELECT * FROM itemorder", function (err, row) {
            console.log(row);
        });
    });
    db.close();
}

function _getOrderTable() {
    db = new sqlite3.Database(':memory:');
    // db.run("DROP TABLE IF EXISTS itemorder");
    db.run("CREATE TABLE IF NOT EXISTS itemorder (openId TEXT PRIMARY KEY, name TEXT, telephone TEXT, item TEXT, address TEXT, deliverDate date, createTime datetime)");
}

module.exports = {save2DB: save2DB};