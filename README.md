# CoCo-api
The back-end of [CoCo](https://github.com/highalps/CoCo)

Resolve requests (Rest API) from clients

## Features
* Interactive text editor service using [ShareDB](https://github.com/share/sharedb)
* Immediate updates of text chat and directory using [socket.io](https://socket.io)
* Authentication using [JWT](https://jwt.io)
* Independent container for each class using [docker](https://www.docker.com)
* CRUD operations about class and user

## Prerequisites
Install MySQL, MongoDB, Docker on Ubuntu 16.04 LTS
```
apt install mysql mongodb
curl -s https://get.docker.com/ | sudo sh
sudo usermod -aG docker $USER
```

Install node modules using npm
```
npm install
```

## Start
```
npm start
```

### Structure reference
[auth-example-api](https://github.com/kimdhoe/auth-example-api/)