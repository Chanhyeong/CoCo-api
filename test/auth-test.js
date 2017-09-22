var assert = require('assert');
var httpMocks = require('node-mocks-http');
var authController = require('../routes/auth/controller')

var req, res;

describe('New user', function () {
    beforeEach(function() {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    it('user creation', function () {
        authController.signUp(req, res);
        assert.equal(true, JSON.parse(res._getData()));
    });
});