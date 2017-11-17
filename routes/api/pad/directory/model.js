var mongodb = require('../../../../middleware/database')('mongodb').directoryDb;

exports.create = function (num) {
    var defaultDirectoryForm = {
        _id: num,
        subdir: [
            {
                name: 'src',
                type: 'directory'
                subdir: [
                    {
                        name: 'main.c',
                        type: 'file'
                    }
                ]
            }
        ]
    }


};

exports.update = function (num) {

};