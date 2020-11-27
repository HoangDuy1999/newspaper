const express = require('express');
const accountModles = require('../models/_account.model');
const configAuth = require('../config/auth');

const someOtherPlaintextPassword = 'not_bacon';
var isAuthenticated = false;
var authUser={}
var isfalse=false;
var datetime = new Date();
//passport
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {done(null, user);});
passport.deserializeUser(function(user, done) { done(null, user);});
function getDatime(){
  var date_ob = new Date();
  var date = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  var seconds = date_ob.getSeconds();
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  datetime_pre = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  return datetime_pre;
}
//google
passport.use(new GoogleStrategy({
  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL
  },
  async function(accessToken, refreshToken, profile, done) {
    var row = await accountModles.singleByEmail(profile._json.email);
      if(row.length > 0){// da co trong db
        isAuthenticated = true;
        authUser = row[0];
      }else{// chua co trong db
        var data={
          email: profile._json.email, username: profile._json.name, r_ID: 1,
          cre_Date: datetime.toISOString().slice(0,10),
          Image: profile._json.picture,
          premium: 1,
          date_create_premium: getDatime(),
          time_premium: configAuth.tryvip.n,
        }
        isAuthenticated = true;
        authUser = data;
        await accountModles.addNewAccount(data);
      }
      return done(null, profile);
  }
));
// facebook
passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: ['id', 'emails', 'name', 'picture.type(large)']
},
  async function (accessToken, refreshToken, profile, done) {
    //console.log(profile._json.last_name);
    //fb này ko có email
    if(typeof profile._json.email == 'undefined' ||  profile._json.email ==""){
      isfalse = true;
    }else{
      // kiểm tra xem email đã đang ký chưa(đang nhập fb thì cũng dùng lại email và username chỉ có điều là pass rỗng())
      //hack vô sao được pass word phải có 6 kí tự haha
      var row = await accountModles.singleByEmail(profile._json.email);
      if (row.length == 0) {// chưa có trong db
        var data = {
          username: profile._json.last_name + profile._json.first_name, r_ID: 1,
          Email: profile._json.email,
          Image: profile.photos[0].value,
          cre_Date: datetime.toISOString().slice(0, 10),
          premium: 1,
          date_create_premium: getDatime(),
          time_premium: configAuth.tryvip.n,
        }
        await accountModles.addNewAccount(data);
        // thiết lập dữ liêu để tạo section
        isAuthenticated = true;
        authUser = data;
      } else {// email đã có
        isAuthenticated = true;
        authUser = row[0];
      }
    }
    

    done(null, profile);
  },
));
//github
passport.use(new GitHubStrategy({
  clientID: configAuth.githubAuth.clientID,
  clientSecret: configAuth.githubAuth.clientSecret,
  callbackURL: configAuth.githubAuth.callbackURL,
  scope: 'user:email'
},
async function(accessToken, refreshToken, profile, cb, done) {
  // tai khoản đang nhập được nhưng không có email
  if(typeof cb.emails == 'undefined' ||  cb.emails[0].value =="" || cb.emails[0].value == null){
    isfalse = true;
  }else{// có email
    // kiểm tra xem đã tồn tại trong db
    var row = await accountModles.singleByEmail(cb.emails[0].value);
    if (row.length == 0) {// chưa có trong db
      var data = {
        username: cb.username, r_ID: 1,
        Email: cb.emails[0].value,
        Image: cb.photos[0].value,
        cre_Date: datetime.toISOString().slice(0, 10),
        premium: 1,
        date_create_premium: getDatime(),
        time_premium: configAuth.tryvip.n,
      }
      await accountModles.addNewAccount(data);
      // thiết lập dữ liêu để tạo section
      isAuthenticated = true;
      authUser = data;
    } else {// email đã có
      isAuthenticated = true;
      authUser = row[0];
    }
  }


  return done(null, profile);
}));

module.exports = function (router) {
    router.use(passport.initialize());
    //đăng nhập sử dụng passport
    //google
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        req.session.isAuthenticated = isAuthenticated;
        req.session.authUser = authUser;
        if(req.session.authUser.r_ID == 4){
          return res.redirect('/admin');
        }else{
          return res.redirect('/');
        }
    }
    );
    //facebook
    router.get('/auth/facebook', passport.authenticate('facebook',  { scope: [ 'email' ]}));
    router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/account/login' }),
    function (req, res) {
        if(isfalse == true){// login thành công nhưng ko có email thì lỗi
          res.locals.islogin=true;
          res.redirect('/account/register');
          res.locals.islogin=false;
          isfalse = false;
        }else{
          req.session.isAuthenticated = isAuthenticated;
          req.session.authUser = authUser;
          if(req.session.authUser.r_ID == 4){
            return res.redirect('/admin');
          }else{
            return res.redirect('/');
          }
        }
    }
    );

    //github
    router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

    router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/account/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        if(isfalse == true){//
          res.locals.islogin=true;
          res.redirect('/account/register');
          res.locals.islogin=false;
          isfalse = false;
        }else{
          req.session.isAuthenticated = isAuthenticated;
          req.session.authUser = authUser;
          if(req.session.authUser.r_ID == 4){
            return res.redirect('/admin');
          }else{
            return res.redirect('/');
          }
        }
    });
}




