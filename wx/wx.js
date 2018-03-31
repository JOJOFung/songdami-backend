//https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
var https = require("https");
var querystring = require('querystring');
var constants = require('constants');
var hostname = "api.weixin.qq.com";
var appid = constants.appid;
var secret = constants.secret;
var grant_type_authorization_code = "authorization_code";
var grant_type_client_credential = "client_credential";
var jojo = constants.jojo;
var andy= constants.andy;

function _getOptions(sCode) {
    return {
        hostname: hostname,
        path: "/sns/jscode2session" + _constructParams(sCode),
    };
}

function getOpenId(sCode, fnCallback, oMoreParamters) {
    https.get(_getOptions(sCode), function (res) {
        res.on('data', function (d) {
            var parsedData = JSON.parse(d);
            var openId = parsedData.openid;
            typeof fnCallback == "function" && fnCallback(openId, oMoreParamters);
        });
    }).on('error', function (e) {
        console.error(e);
    });
}

function _constructParams(sCode) {
    return "?appid=" + appid + "&secret=" + secret + "&js_code=" + sCode + "&grant_type_authorization_code=" + grant_type_authorization_code;
}

function sendOrders2Dad(oOrders) {
    _getAccessToken(_sendOrders2Dad, oOrders);
}

function _sendOrders2Dad(sAccessToken, oOrders) {
    //Always send tomorrow's orders to Dad
    var req =https.request(_pOSTOptions(sAccessToken, oOrders), function (res) {
        res.on('data', function (d) {
            var parsedData = JSON.parse(d);
            if (parsedData !== 0) {
                console.error(parsedData);
            }
        });
    }).on('error', function (e) {
        console.error(e);
    });

    req.write(_postData(oOrders));
    req.end();
}

function _postData(oOrders) {
    return JSON.stringify({
        "touser": jojo,
        "msgtype": "text",
        "text":
            {
                "content": JSON.stringify(oOrders)
            }
    });
}

function _pOSTOptions(sAccessToken, oOrders) {
    return {
        hostname: hostname,
        port: 443,
        path: "/cgi-bin/message/custom/send" + _constructPOSTParams(sAccessToken),
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(_postData(oOrders))
        }
    };
}

function _constructPOSTParams(sAccessToken) {
    return "?access_token=" + sAccessToken;
}

function _getAccessToken(fnCallback, oMoreParameters) {
    //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    https.get(_getAcessTokenOptions(), function (res) {
        res.on('data', function (d) {
            var parsedData = JSON.parse(d);
            var accessToken = parsedData.access_token;
            typeof fnCallback == "function" && fnCallback(accessToken, oMoreParameters);
        });
    }).on('error', function (e) {
        console.error(e);
    });
}

function _getAcessTokenOptions() {
    return {
        hostname: hostname,
        path: "/cgi-bin/token" + _constructAcessTokenParams()
    };
}

function _constructAcessTokenParams() {
    return "?grant_type=" + grant_type_client_credential + "&appid=" + appid + "&secret=" + secret;
}

module.exports = {
    getOpenId: getOpenId,
    sendOrders2Dad: sendOrders2Dad
};