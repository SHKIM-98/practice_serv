const User = require('../models/user');

// passport 모듈 호출
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    crypto = require("crypto");

// 사용자 인증에 성공했을 때 호출
passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    done(null, user);
});

// 사용자 인증 후, 사용자 요청시마다 호출
passport.deserializeUser(function(user, done)  {
    console.log("deserializeUser");
    done(null, user);
});

// login 시
passport.use('local-login',new LocalStrategy(
    {
        usernameField : 'id',
        passwordField : 'password',
    },
    function(username, password, done)  {
    // password 암호화

    // id, password 확인
    User.findOne({"id" : username, "password" : crypto.createHash('sha512').update(password).digest('base64')}, function(err,user)  {
        console.log("USER INFO : " + user);
        if (err)    {   // err 처리
            console.log(err);
            return done(err);
        }
        
        if (!user) {   // login 실패
            console.log("Login Fault");
            return done(null,false);
        }
        else    {           // login 성공
            console.log("Login Success");
            session_list.push(user.nickname);
            console.log(session_list);
            return done(null, user);
        }
    })
}));

// main page
const index = (req,res) =>  {
    console.log(req.user);
    if (req.user)   {   // login 상태일 때
        res.render('index', { session : true, nickname : req.user.nickname });
    }
    else    {      // logout 상태일 때
        res.render('index', { session : false });
    }
};

const login_g = (req,res) =>  {
    res.render('login');
};

const logout_g = (req,res) =>  {
    // delete session
    session_list.splice(session_list.indexOf(req.user.username),1);
    req.logout();
    console.log(session_list);
    res.redirect('/');
};

const signup_g = (req,res) =>  {
    res.render('signup');
};

const login_p =
    passport.authenticate('local-login',
        {
            successRedirect : '/',
            failureRedirect : '/login',
            failureFlash : false ,
        }
    );

const signup_p = (req,res) =>  {
    var id = req.body.id;
    var password = crypto.createHash('sha512').update(req.body.password).digest('base64');
    var nickname = req.body.nickname;

    const user = new User({
        id : id,
        password : password,
        nickname : nickname,
    });

    user.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });
};


module.exports = {
    index,
    login_g,
    logout_g,
    signup_g,
    login_p,
    signup_p,
}