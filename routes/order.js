var express = require('express');
var router = express.Router();
var db = require('../db/db.js');

/* TODO */
router
    .get('/', function (req, res, next) {
        var query = req.query;
        var sCode = query.code;
        db.getOrders(sCode, function(aOrders){
            res.send(aOrders);
        });
    })
    /* Persist a new order */
    .post('/', function (req, res) {
        /*
        * { name: '冯',
        *   sex: '女士',
        *   telephone: '',
        *   itemName: '宝骏大米20斤／70元',
        *   address: '上海市徐汇区',
        *   date: '2017-12-8'
        * }
        * */
        var oOrder = req.body;
        db.save2DB(oOrder);
        res.status(200);
        res.send('OK');
    });

module.exports = router;
