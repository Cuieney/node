const WebSocket = require('ws');
const request = require('request');
const cmdJson = {
    cmd: "sub",
    codes: ["XAU", "USD", "AU9999"]
}

var show = require('./user')

const getAccTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx8806c763d6ea5bf4&secret=c0fb63d07b1edb24fdddae6d75d4f6f7"
const postSubscribeUrl = "https://api.weixin.qq.com/cgi-bin/message/subscribe/send"
// accToken = content['access_token']
// params = { 'access_token': accToken.encode('utf-8') }
const userId = 'oG0br0HA-pjL5Df5EeKazVsUKMcc'

var token = {
    access_token: "",
    isSend: false
}

function connectWS() {
    let ws = new WebSocket('ws://39.97.117.240:9506/');
    ws.on('open', function open() {
        console.log('open')
        ws.send(JSON.stringify(cmdJson), () => {
            console.log('发送成功')
        });
    });

    ws.on('message', function incoming(data) {
        // console.log(data)
        recevieData(data)
    });
    ws.on('close', function open() {
        console.log('close')
        connectWS()
    });
    ws.on('error', function open(msg) {
        console.log('error', msg)
        connectWS()
    });
}

Promise.all([connectWS()])
    .then(() => {
        console.log('启动socket链接')
    }).catch((error) => {
        console.log('启动socket链接异常', error)
    })

async function recevieData(data) {
    var resData = JSON.parse(data)
    var name = resData.C
    
    if ('XAU'.indexOf(name) >= 0) {
        // JSON.stringify(resData.Sell)
        // // console.log('XAU', JSON.stringify(resData.Sell))
        let result = await show.show();
        if(result.length >0 ){
            for(let index in result){
                let height = result[index].height
                let low  = result[index].low
                let openId = result[index].openId
                if(resData.Sell > height){
                    nofityUser(openId,"当前已涨到" + JSON.stringify(resData.Sell))
                }
                if(resData.Sell < low){
                    nofityUser(openId,"当前已跌到" + JSON.stringify(resData.Sell))
                }
            }
        }

    }
    if ('USD'.indexOf(name) >= 0) {
        // console.log(recevieData.Sell)
        // JSON.stringify('USD',resData.Sell)
    }
    if ('AU9999'.indexOf(name) >= 0) {
        // JSON.stringify(resData.Sell)
        // console.log('AU9999',recevieData.Sell)
    }
}

request(getAccTokenUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        token.access_token = JSON.parse(body).access_token
    } else {
        console.error('error:', error);
        console.log('statusCode:', response && response.statusCode);
    }
});

setInterval(() => {
    token.isSend = false
}, 50 * 1000)

function nofityUser(openId,result) {
    if (token.isSend) {
        // console.log('已发送')
        return
    }
    token.isSend = true
    let data = {
        "touser": openId,
        "template_id": 'TujC6M699Qq68iivGaH2NN3h2BgPrXXyHFKeXH6X1yk',
        "page": "pages/index/index",
        "data": {
            "thing4": {
                "value": result
            },
            "time5": {
                "value": formatDate(new Date().getTime(), 'Lllss')
            }
        }
    }
    const options = {
        url: postSubscribeUrl + "?access_token=" + token.access_token,
        body: JSON.stringify(data),
        method: 'POST',
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log('nofity success', response.body)
        } else {
            console.error('error:', error);
            console.log('statusCode:', response && response.statusCode);
        }
    });

}



function padStart(sourceString, targetLength, padString = ' ') {
    padString = typeof padString === 'string' ? padString : String(padString);
    targetLength = targetLength >> 0;
    if (sourceString.length > targetLength) {
        return sourceString;
    } else {
        targetLength = targetLength - sourceString.length;
        if (targetLength > padString.length) {
            padString += stringRepeat(padString, targetLength / padString.length);
        }
        return padString.slice(0, targetLength) + sourceString;
    }
};

function formatDate(val, format) {
    let deFormat; let theDate; let month; let year; let date; let hours; let mins; let
        seconds;
    let formats = {
        Llls: function () {
            return `${year}/${month}/${date}`;
        },
        Lllss: function () {
            return `${year}-${month}-${date} ${hours}:${mins}:${seconds}`;
        },
        Lllmm: function () {
            return `${year}-${month}-${date}  ${hours}:${mins}`;
        },
        hhmm: function () {
            return `${hours}:${mins}`;
        }
    };
    if (!val && typeof val !== 'number') {
        return '';
    }
    deFormat = format || 'LLL';
    theDate = new Date(val);
    year = theDate.getFullYear();
    month = padStart(String(theDate.getMonth() + 1), 2, '0');
    date = padStart(String(theDate.getDate()), 2, '0');
    hours = padStart(String(theDate.getHours()), 2, '0');
    mins = padStart(String(theDate.getMinutes()), 2, '0');
    seconds = padStart(String(theDate.getSeconds()), 2, '0');
    return formats[deFormat]();
}
