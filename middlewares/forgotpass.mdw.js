const express = require('express');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const accountModles = require('../models/_account.model.js');
const saltRounds = 12;
module.exports = function (router) {
    //forgot password
    var isforgotpassword = false;
    var otp="";
    var username=""

    router.get('/login/forgotpassword', async function (req, res) {
    if(otp == ""){
        res.render('vwAccount/forgotpassword');
    }else{
        res.redirect('/account/login/forgotpassword/otp');
    }
    })
    router.post('/login/forgotpassword', async function (req, res) {
    isforgotpassword = true;
    username= req.body.username;
    var rows = await accountModles.singleByUserName(req.body.username);
    otp = Math.floor(100000 + Math.random() * 900000);

    var transporter =  nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user: 'tranhoangduy.911@gmail.com',
            pass: 'duy13051999'
        }
    });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'tranhoangduy.911@gmail.com',
        to: rows[0].Email,
        subject: 'Xác Nhận Email Từ Sàn Chướng Khoán DK',
        text: 'Chạo bạn ' + username + ',',
        html: `<p>Chào Bạn <b>${username}</b>,</p>
                <p>Mã OTP để xác nhận lấy lại mật khẩu từ trang web <b>tradebull</b> của bạn là: <b>${otp}</b></p>
                <p style="color: red;  font-style: italic;">Vui lòng không cung cấp mã OTP này cho ai khác. Xin cảm ơn! </p>
                <div>Tạm biệt</div>
                `
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });
    res.redirect('/account/login/forgotpassword/otp');
    })
    router.get('/login/forgotpassword/otp', async function (req, res) {
    if(isforgotpassword){
        res.render('vwAccount/otp');
    }else{
        res.redirect('/account/login/forgotpassword');
    }
    })
    router.post('/login/forgotpassword/otp', async function (req, res) {
    res.redirect('/account/login/forgotpassword/newpassword');
    })

    router.get('/login/forgotpassword/newpassword', async function (req, res) {
    if(isforgotpassword){
        res.render('vwAccount/newpass');

    }else{
        res.redirect('/account/login/forgotpassword');
    }
    })
    router.post('/login/forgotpassword/newpassword', async function (req, res) {
    if(otp){
        var entity={
        password: bcrypt.hashSync(req.body.password, saltRounds)
        }
        await accountModles.patch_account(entity, {username: username})
        res.redirect('/account/login');
        isforgotpassword = false;
        otp="";
        username="";

    }else{
        res.redirect('/account/login/forgotpassword');
    }
    })

    // check username có tồn tại
    router.get('/login/forgotpassword/is-available_forgotpass', async function (req, res) {
    var user = await accountModles.singleByUserName(req.query.user);
    if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
        return res.json(true);
    }

    res.json(false);
    })
    // check email tồn tại không
    router.get('/login/forgotpassword/is-available_email', async function (req, res) {
    var user = await accountModles.singleByUserName(req.query.user);
    if (user[0].Email !="") {
        return res.json(true);
    }
    res.json(false);
    })
    // check OTP
    router.get('/login/forgotpassword/is-available_otp', async function (req, res) {
    if (req.query.otp == otp) {
        return res.json(true);
    }
    res.json(false);
    })

}