const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const restrictadmin = require("../../middlewares/restrictadmin.mdw");
const moment = require('moment');
const mkdirp = require('mkdirp');
const bcrypt = require('bcrypt');
const accountModles = require('../../models/_account.model');
const adminusermodel = require("../../models/adminusers.model");
const router = express.Router();
const validUrl = require('valid-url');
const fs = require('fs');
const multer  = require('multer');
const path  = require('path');
var path_img="";
const saltRounds = 12;
const storage = multer.diskStorage({
  destination: './Public/img/profile/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage }).single('Image');

router.get('/', restrict, restrictadmin, async (req, res) => {
    var choose = req.query.value || "all";
    if(choose == "all"){
       var rows = await adminusermodel.getallaccount();
    }else{
        var rows = await adminusermodel.getbyroleaccount(choose);
    }
    rows.forEach(function(value){
        value.cre_Date = moment(value.cre_Date, 'YYYY/MM/DD').format('DD-MM-YYYY');
        if(value.Image == "" || value.Image == null){
            value.Image = "default-avatar-male.png";
        }
        if(value.premium == true){
            value.premium = true;
        }else{
            value.premium = false;
        }
        if (validUrl.isUri(value.Image)){
            value.url = true;
        }
        else {
            path_img = value.Image;
            value.url = false;
        }
    });
    res.render('vwAccount/vwAdvantage/admin/user/list', { layout: 'mainAdmin.hbs', rows, title: 'Quản Lý Tài Khoản' });
});

//detail
router.get('/detail', restrict, restrictadmin, async (req, res) => {
    var id = req.query.id;
    row = await adminusermodel.getaccountbyID(id);
    roleacc = await adminusermodel.getallRoldeAccount();
    typecategory = await adminusermodel.getalltypecategory();
    row.forEach(function(value){
        value.DOB = moment(value.DOB, 'YYYY/MM/DD').format('DD-MM-YYYY');
        value.cre_Date = moment(value.cre_Date, 'YYYY/MM/DD').format('DD-MM-YYYY');
        if(value.date_create_premium !="0000-00-00 00:00:00"){
           value.date_create_premium = moment(value.date_create_premium, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
        }else{
            value.date_create_premium="";
        }
        if(value.Image == "" || value.Image == null){
            value.Image = "default-avatar-male.png";
        }
        if(value.premium == true){
            value.premium = true;
        }else{
            value.premium = false;
        }
        if (validUrl.isUri(value.Image)){
            value.url = true;
        } 
        else {
            value.url = false;
        }
        });
    roleacc.forEach(function(value){
        if(row[0].r_ID == value.ID) value.selected = true;
        else value.selected = false;
    })
    typecategory.forEach(function(value){
        if(row[0].tc_ID == value.ID) value.selected = true;
        else value.selected = false;
    })
       if(row[0].time_premium ==  null){
            row[0].time_premium = 0;
       }
    res.render("vwAccount/vwAdvantage/admin/user/detail", { layout: 'mainAdmin.hbs', row: row[0], roleacc, typecategory, title: row[0].username});
})
//edit
router.get('/edit', restrict, restrictadmin, async (req, res) => {
    var id = req.query.id;
    row = await adminusermodel.getaccountbyID(id);
    roleacc = await adminusermodel.getallRoldeAccount();
    typecategory = await adminusermodel.getalltypecategory();
    row.forEach(function(value){
        value.DOB = moment(value.DOB, 'YYYY/MM/DD').format('DD-MM-YYYY');
        value.cre_Date = moment(value.cre_Date, 'YYYY/MM/DD').format('DD-MM-YYYY');
        if(value.date_create_premium !="0000-00-00 00:00:00"){
           value.date_create_premium = moment(value.date_create_premium, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
        }else{
            value.date_create_premium="";
        }
        if(value.Image == "" || value.Image == null){
            value.Image = "default-avatar-male.png";
        }
        if(value.premium == true){
            value.premium = true;
        }else{
            value.premium = false;
        }
        if (validUrl.isUri(value.Image)){
            value.url = true;
        } 
        else {
            path_img = value.Image;
            value.url = false;
        }
        });
    roleacc.forEach(function(value){
        if(row[0].r_ID == value.ID) value.selected = true;
        else value.selected = false;
    })
    typecategory.forEach(function(value){
        if(row[0].tc_ID == value.ID) value.selected = true;
        else value.selected = false;
    })
       if(row[0].time_premium ==  null){
            row[0].time_premium = 0;
    }
    res.render("vwAccount/vwAdvantage/admin/user/edit", { layout: 'mainAdmin.hbs', row: row[0], roleacc, typecategory, title: 'Chỉnh Sửa Tài Khoản: ' + row[0].username});
})
router.post('/edit', restrict, restrictadmin, upload, async (req, res) => {
    var id = req.body.ID;
    delete req.body.ID;
    delete req.body.cf_password;
    req.body.DOB = moment(req.body.DOB, 'DD-MM-YYYY').format('YYYY/MM/DD');
    req.body.cre_Date = moment(req.body.cre_Date, 'DD-MM-YYYY').format('YYYY/MM/DD');
    if(parseFloat(req.body.time_premium) > 0 && req.body.time_premium != ""){
        req.body.premium = 1;
        req.body.date_create_premium = moment(req.body.date_create_premium, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    }else{
        req.body.premium = 0;
        req.body.time_premium = 0;
        req.body.date_create_premium = null;
    }
    if(req.body.password !=""){
        req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    }else{
        delete req.body.password;
    }
    if(req.file){
        const data = {...req.body, Image: req.file.filename};

        if(path_img !=""){
            if(path_img != "default-avatar-male.png"){
            fs.unlinkSync('public/img/profile/'+ path_img);
            path_img=req.file.filename;
            }
        }
        await accountModles.patch_account(data, {ID: id});
        res.redirect(req.headers.referer);
    }else{
        await accountModles.patch_account(req.body, {ID: id});
        res.redirect(req.headers.referer);
    }

})

router.get('/edit/is-available', async function (req, res) {
    const user = await accountModles.singleByUserNameID(req.query.user, req.query.ID);
   // if(req.query.user.toLowerCase() != req.session.req.session.authUser.username.toLowerCase()){
        if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
        return res.json(true);
        }
    //}
  
    res.json(false);
})
router.get('/edit/is-available-email', async function (req, res) {
    //if(req.query.email.toLowerCase() != req.session.req.session.authUser.Email.toLowerCase()){
        const email = await accountModles.singleByEmailID(req.query.email, req.query.ID);
        if (typeof email != "undefined" && email != null && email.length != null && email.length > 0) {
        return res.json(true);
        }
    //}
    res.json(false);
})


//add
router.get('/add', restrict, restrictadmin, async (req, res) => {
    roleacc = await adminusermodel.getallRoldeAccount();
    typecategory = await adminusermodel.getalltypecategory();
    res.render("vwAccount/vwAdvantage/admin/user/add", { layout: 'mainAdmin.hbs', roleacc, typecategory, title: 'Thêm Tài Tài Khoản'});
})
router.get('/add/is-available', async function (req, res) {
    const user = await accountModles.singleByUserName(req.query.user);
    if (typeof user != "undefined" && user != null && user.length != null && user.length > 0) {
      return res.json(true);
    }
  
    res.json(false);
  })
router.get('/add/is-available-email', async function (req, res) {
    const email = await accountModles.singleByEmail(req.query.email);
    if (typeof email != "undefined" && email != null && email.length != null && email.length > 0) {
      return res.json(true);
    }
  
    res.json(false);
  })

router.post('/add', restrict, restrictadmin, upload, async function(req, res){
    req.body.dob = moment(req.body.dob, 'DD-MM-YYYY').format('YYYY/MM/DD');
    delete req.body.cf_password;
    if(req.body.tc_ID == ""){
        delete req.body.tc_ID;
    }
    req.body.cre_Date = moment(req.body.cre_Date, 'DD-MM-YYYY').format('YYYY/MM/DD');
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    if(req.body.premium){
        req.body.premium = 1;
        req.body.date_create_premium = moment(req.body.date_create_premium, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    }
    else{
        req.body.premium = 0;
        delete req.body.date_create_premium;
        req.body.time_premium = 0;
    }
    if(req.file){
        const data = {...req.body, Image: req.file.filename};
        await accountModles.addNewAccount(data);
        res.redirect(req.headers.referer);
    }else{
        await accountModles.addNewAccount(req.body);
        res.redirect(req.headers.referer);
    }
});

//xoa
router.post('/', restrict, restrictadmin, async (req, res) => {
    if(req.body.id != ""){
        await adminusermodel.delaccount({ID: req.body.id});
    }
    res.redirect(req.headers.referer);
});
module.exports = router;