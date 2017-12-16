var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var url = 'http://localhost:3000';

describe('/auth', function () {

    it('/auth/signIn POST', function (done) {

        chai.request(url)
            .post('/auth/login')
            .send({
                'id': 'Mock',
                'password': 'test'
            })
            .end(function(err, res){
                expect(res).to.have.status(200);
            done();
        });
    });

    it('/auth/signup POST', function (done) {

        chai.request(url)
            .post('/auth/signup')
            .send({
                'id' : 'Mock',
                'password' : 'test',
                'email' : 'hhk2945@naver.com',
                'nickname' : 'MockTest'
            })
            .end(function(err, res){
                //아이디가 이미 있으므로
                expect(res).to.have.status(409);
                done();
            });
    });

    it('/auth/ DELETE', function (done) {

        chai.request(url)
            .delete('/auth')
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });
});