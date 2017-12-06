
module.exports = {
    serverPort: 3000,
    mysqlConfig: {
        connectionLimit : 10,
        host:'external.cocotutor.ml',
        port: 3306,
        user: 'coco',
        password: 'whdtjf123@',
        database:'coco'
    },
    knexMysqlConfig: {
        client: 'mysql',
        connection: {
            host: 'external.cocotutor.ml',
            user: 'coco',
            password: 'whdtjf123@',
            database: 'coco'
        },
        pool: { min: 0, max: 10 }
    },
    mongoUrl: {
        chat: 'mongodb://external.cocotutor.ml:27017/chat',
        editor: 'mongodb://external.cocotutor.ml:27017/editor'
    },
    jwtSecret: process.env.JWT || 'coco_token_secret'
};