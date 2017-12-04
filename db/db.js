var sqlite3 = require('sqlite3').verbose();
var db = null;

function _save2DB(oOrder) {
    _getOrderTable();
    db.serialize(function () {
        db.run("INSERT INTO itemorder VALUES (?, ?, ?, ?, ?, ?)",
            oOrder.name + oOrder.sex,
            oOrder.telephone,
            oOrder.itemName,
            oOrder.address,
            oOrder.date,
            new Date());

        db.each("SELECT rowid FROM itemorder", function (err, row) {
            console.log(row);
        });
    });
    db.close();
}

function _getOrderTable() {
    db = new sqlite3.Database(':memory:');
    // db.run("DROP TABLE IF EXISTS itemorder");
    db.run("CREATE TABLE IF NOT EXISTS itemorder (name TEXT, telephone TEXT, item TEXT, address TEXT, deliverDate date, createTime datetime)");
}

module.exports = {_save2DB: _save2DB};