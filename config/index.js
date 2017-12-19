
module.exports = {
    serverPort: 3000,
    knexMysqlConfig: {
        client: 'mysql',
        connection: {
            host: 'database_url',
            user: 'your_username',
            password: 'your_password',
            database: 'coco'
        },
        pool: { min: 0, max: 20 }
    },
    mongoUrl: {
        chat: 'mongodb://database_url:27017/chat',
        editor: 'mongodb://database_url:27017/editor'
    },
    containerInformation: {
        host: 'docker_located_url',
        username: 'coco',
        password: 'whdtjf123@'
    },
    jwtSecret: process.env.JWT || 'coco_token_secret'
};