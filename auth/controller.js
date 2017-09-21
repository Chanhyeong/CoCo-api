var passport = require('../modules/passport');

exports.login = function (req, res) {
    if (req.isAuthenticated()) {
        // TODO: user nickname을 리액트로 보내주기
        res.send();
    }
    else { res.send(false); }
}

exports.logout = function(req, res){
    console.log("logout");
    req.logout();
    res.send('logout');
}