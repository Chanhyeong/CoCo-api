# CoCo-api
The back-end of [CoCo](https://github.com/highalps/CoCo)

Resolve requests (Rest API) from clients

Structure reference - [auth-example-api](https://github.com/kimdhoe/auth-example-api/)

## Features
* Interactive text editor service using [ShareDB](https://github.com/share/sharedb)
* Immediate updates of text chat and directory using [socket.io](https://socket.io)
* Authentication using [JWT](https://jwt.io)
* Independent container for each class using [docker](https://www.docker.com)
* CRUD operations about class and user


(The followings weren't be tested, they may not work well.)
## Prerequisites
Install MySQL, MongoDB, Docker on Ubuntu 16.04 LTS
```
apt install mysql mongodb
curl -s https://get.docker.com/ | sudo sh
sudo usermod -aG docker $USER
```

Access to MySQL and create database 'coco'
```
:~# mysql
mysql> create database coco;
mysql> GRANT ALL PRIVILEGES ON coco.* TO 'your_username'@'localhost' IDENTIFIED BY 'your_password';
mysql> GRANT ALL PRIVILEGES ON coco.* TO 'your_username'@'%' IDENTIFIED BY 'your_password';
```

Modify `config/index.js` to match your database settings and docker url
```js
mysqlConfig: {
    client: 'mysql',
    connection: {
        host: 'database_url',
        user: 'your_username',
        password: 'your_password',
        database: 'coco'
    },
    pool: { min: 0, max: 10 }
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
```

Default username/password of container are coco/whdtjf123@.

If you changed them on this, please change all `Dockerfile` under directory `default/docker_files/`.

Build Dockerfiles
```
:~# cd ./default_files/docker_file
docker build ./c_cpp/ --tag coco:c
docker build ./java/ --tag coco:java
docker build ./python/ --tag coco:python
```

Install node modules using npm
```
npm install
```

## Start
```
npm start
```

## Test
You can run API test, only about /auth.

The others are complicated to test because they need user information and jwt token.

Before progress, start server.
```
npm start
```


And do test on another shell.
```
npm run test
```
