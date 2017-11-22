var model = require('./model');
var exec = require('child_process').exec;


exports.getDir = function (req, res) {
    exec('tree -J ~/store/' + req.params.classNum , function (err, stdout, stderr){
        if (err) {
            console.log('exec error : tree error');
            res.status(500).send('Err: exec tree error');
        }
        else{
	    res.status(200).send({
                dir : JSON.parse(stdout)
            });
        }
    });
};

exports.update = function (req, res) {
    var data = req.body;
    var classNumber = data.classNumber;
    var mode = data.mode;

    delete data.classNumber;
    delete data.mode;

    if(model.update(mode, classNumber, data)) {
        res.status(200).send();
    } else {
        res.status(500).send('MongoDB update error');
    }

};
