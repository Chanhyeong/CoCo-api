
module.exports = {
    mysqlConfig: {
        host:'external.cocotutor.ml',
        port: 3306,
        user: 'coco',
        password: 'whdtjf123@',
        database:'coco'
    },
    mongoUrl: {
        chat: 'mongodb://external.cocotutor.ml:27017/chat',
        directory: 'mongodb://external.cocotutor.ml:27017/directory',
        editor: 'mongodb://external.cocotutor.ml:27017/editor'
    },
    jwtSecret: process.env.JWT || 'coco_token_secret'
};