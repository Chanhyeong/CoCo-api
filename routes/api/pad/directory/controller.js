var model = require('./model');

exports.getDirectoryInformation = function (req, res, next) {
    var classNumber = req.params.classNumber;

    model.getDirectoryFromContainer(classNumber, function () {

    })
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