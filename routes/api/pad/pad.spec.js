var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var url = 'http://localhost:3000';

describe('/api/pad', function () {

    it('/ GET', function (done) {
        var classNum = 49167;
        chai.request(url)
            .get('/api/pad/'+classNum)
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/ PUT', function (done) {

        var classNum = 49167;

        chai.request(url)
            .put('/api/pad/'+classNum)
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/directory POST', function (done) {

        chai.request(url)
            .post('/api/pad/directory')
            .send({
                'classNum' : 49167,
                'type' : 'file',
                'path' : '/src',
                'fileName' : 'Mock'
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/directory PUT', function (done) {

        var classNum = 49167;

        chai.request(url)
            .put('/api/pad/directory' + classNum)
            .send({
                'prevName' : 'test',
                'nextName' : 'test2',
                'type' : 'file',
                'path' : '/src'
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/directory DELETE', function (done) {

        chai.request(url)
            .delete('/api/pad/directory')
            .query({
                classNum: 49167,
                type: 'file',
                fileName: 'Mock',
                path: '/src'
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });
});