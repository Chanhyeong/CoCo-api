var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var url = 'http://localhost:3000';

describe('/api/user', function () {

    it('/ GET', function (done) {
        chai.request(url)
            .get('/api/user')
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });

    it('/tutor/id/:id GET', function (done) {

        var id = 'hhk2945';

        chai.request(url)
            .get('/api/user/tutor/id/' + id)
            .end(function(err, res){
                expect(res).to.have.status(200);
                done();
            });
    });

    it('/tutor/nickname/:nickname GET', function (done) {

        var nickname = 'hhk';

        chai.request(url)
            .get('/api/user/tutor/nickname/'+nickname)
            .end(function(err, res){
                expect(res).to.have.status(200);
                done();
            });
    });

    it('/tutor POST', function (done) {

        chai.request(url)
            .post('/api/user/tutor')
            .send({
                'id' : 'Mock',
                'degree' : 'test',
                'intro' : 'test',
                'github' : 'test',
                'career' : 'test',
                'language' : 'test'
            })
            .end(function(err, res){
                expect(res).to.have.status(403);
                done();
            });
    });
});