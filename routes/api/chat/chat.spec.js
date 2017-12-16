var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var url = 'http://localhost:3000';

describe('/api/chat', function () {

    it('/list GET', function (done) {
        chai.request(url)
            .get('/api/chat/list')
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/:chatNumber GET', function (done) {

        var chatNumber = 1;

        chai.request(url)
            .get('/api/chat/' + chatNumber)
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/chat/request/:chatNumber PUT', function (done) {

        var chatNumber = 4;

        chai.request(url)
            .put('/api/chat/request/' + chatNumber)
            .send({
                //?????
            })
            .end(function(err, res){
                expect(res).to.have.status(500);
                done();
            });
    });

    it('/chat/:chatNumber PUT', function (done) {

        var chatNumber = 4;

        chai.request(url)
            .put('/api/chat/' + chatNumber)
            .send({
                'message' : 'test',
                'mode' : '??'
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/chat DELETE', function (done) {

        var chatNumber = 4;

        chai.request(url)
            .delete('/api/chat/' + chatNumber)
            .send({
            })
            .end(function(err, res){
                expect(res).to.have.status(200);
                done();
            });
    });
});