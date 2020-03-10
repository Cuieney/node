var express = require('express');
var router = express.Router();
var fun_aes = require('../public/javascripts/aes')

function Encrypt(word) {
    var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
    var key = fun_aes.CryptoJS.enc.Utf8.parse("5b9c2ed3e19c40e5");
    var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, {
        mode: fun_aes.CryptoJS.mode.ECB,
        padding: fun_aes.CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function Decrypt(word) {
    var key = fun_aes.CryptoJS.enc.Utf8.parse("5b9c2ed3e19c40e5");
    var decrypt = fun_aes.CryptoJS.AES.decrypt(word, key, {
        mode: fun_aes.CryptoJS.mode.ECB,
        padding: fun_aes.CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

function run_cmd(cmd, args, callBack) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function () { callBack(resp) });
};

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
            return `${year}/${month}/${date} ${hours}:${mins}:${seconds}`;
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


router.post('/getTimeLine', function (req, res, next) {
    let username = req.body.username
    let timestamp = req.body.since
    run_cmd("twint", ["-u",username,"--since","\""+formatDate(timestamp*1000,'Lllss')+"\""], function (text) { 
        let array = text.split(/r?n/)
        let respArray = []
        for(let line in array){
            let detail = array[line].split(" ")
            let wrapper = []
            for(let index in detail){
                wrapper[index] = detail[index]
            }
            let encryptItem = wrapper[5]
            wrapper[5] = Decrypt(encryptItem)
            respArray[line] = wrapper
        }
        console.log(JSON.stringify(respArray))
        res.send(JSON.stringify(respArray));
     });
  

});





module.exports = router;
