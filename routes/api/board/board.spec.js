var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var url = 'http://localhost:3000';

describe('/api/board', function () {

    it('/ GET', function (done) {
        chai.request(url)
            .get('/api/board')
            .end(function(err, res){
                expect(res).to.have.status(200);
                done();
            });
    });

    it('/class/:num GET', function (done) {

        var num = 8143;

        chai.request(url)
            .get('/api/board/class/' + num)
            .end(function(err, res){
                expect(res).to.have.status(200);
                done();
            });
    });

    it('/search GET', function (done) {

        chai.request(url)
            .get('/api/board/search')
            .query({
                'keyword' : '',
                'group' : '0',
                'language' : '0'
            })
            .end(function(err, res){
                expect(res).to.have.status(200);
                done();
            });
    });

    it('/class POST', function (done) {

        chai.request(url)
            .post('/api/board')
            .send({
                'title' : 'Mock Test',
                'content' : 'test',
                'language' : 'c'
                })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/class/request POST', function (done) {

        chai.request(url)
            .post('/api/board/request')
            .send({
                //????
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/class PUT', function (done) {

        var num = 49167;

        chai.request(url)
            .put('/api/board/' + num)
            .send({
                //?????
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/class DELETE', function (done) {

        var num = 49167;

        chai.request(url)
            .delete('/api/board/' + num)
            .send({
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });
});