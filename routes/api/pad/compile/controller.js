var exec = require('child_process');
var model = require('./model');
var Connect = require('../../../../middleware/terminal-connect');

exports.TerminalConnect = function (req, res){

    exec('docker start '+ req.body.classNum, function (err){
        if (err) console.log('exec error : docker start');
    });

    var language, classNum = req.params.classNum;

    model.getLanguage(classNum, function (err, result) {
        if (err) {
            console.log('DB select error', err);
            res.status(500).send('Err: DB select error');
        } else {
            language = result[0];
        }
    });

    new Connect(req.get('io'), classNum, language, function(err){
        if(err) {
            console.log('connect error');
            res.status(500).send('terminal connect error');
        }
        else{
            res.status(200);
        }
    });

};

