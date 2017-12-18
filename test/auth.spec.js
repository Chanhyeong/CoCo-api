var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var should = chai.should();
chai.use(chaiHttp);

var url = 'http://localhost:3000';

var mockUser = {
    'id' : 'Mock',
    'password' : 'test',
    'email' : 'hhk2945@naver.com',
    'nickname' : 'MockTest'
};

var access_token;

describe('/auth', function () {
    it('login user who doesn\'t signed up', function (done) {
        chai.request(url)
            .post('/auth/login')
            .send({
                'id': 'Mock',
                'password': 'test'
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it('create new user', function (done) {
        chai.request(url)
            .post('/auth/signup')
            .send(mockUser)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('user duplicate check', function (done) {
        chai.request(url)
            .post('/auth/signup')
            .send(mockUser)
            .end(function (err, res) {
                res.should.have.status(409);
                done();
            });
    });

    it('user login', function (done) {
        chai.request(url)
            .post('/auth/login')
            .send({
                'id': 'Mock',
                'password': 'test'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                access_token = 'Bearer ' + res.body.access_token;
                done();
            });
    });

    it('user delete', function (done) {
        chai.request(url)
            .delete('/auth')
            .set('authorization', access_token)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    })
});