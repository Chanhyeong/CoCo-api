var passport = require('../model/passport.js');
var db = require('../../model/mysql.js');
var bcrypt = require('bcrypt');

/*로그인 유저 판단 로직*/
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

router.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/#/sopad');
    });

router.post('/login', function(req,res){
    var userID = req.body.userID,
        password = req.body.password;

    var sql = "select * from USER where userID = ?";
    db.query(sql, userID ,function (err, result){
        if (err) {
            console.log('err :' + err);
        } else {
            if (result.length === 0) {
                res.json({success: false, msg: '해당 아이디가 존재하지 않습니다.'})
            } else {
                console.log(password);
                console.log(result[0].password);
                var hash = bcrypt.hashSync(result[0].password, 10);
                if (!bcrypt.compareSync(password, hash)){
                    res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
                } else {
                    res.json({success: true, msg: '로그인 되었습니다'})
                    //res.redirect('/');
                }
            }
        }
    });
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/auth/login', failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
    });


router.get('/logout', function(req,res){
    req.session.destroy();
    req.logout();
    console.log("logout");
    res.redirect('/');
});


module.exports = router;
