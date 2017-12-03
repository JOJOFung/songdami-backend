var express = require('express');
var router = express.Router();

/* TODO */
router
    .get('/', function (req, res, next) {
        res.send('respond with a resource');
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
        res.send('POST request recieved.')
    });

module.exports = router;
