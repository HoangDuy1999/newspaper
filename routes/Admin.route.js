const express = require('express');
const restrict = require("../middlewares/auth.mdw");
const restrictadmin = require("../middlewares/restrictadmin.mdw");
const articleModel = require('../models/article.model');
const tpCatModel = require('../models/type_category.model');
const catModel = require('../models/category.model');
const moment = require('moment');
var fs = require('fs');
const mkdirp = require('mkdirp');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
     filename(req, file, cb) {
          cb(null, file.originalname);
     },
     destination(req, file, cb) {
          cb(null, './public/admin/img/');
     }
})
const upload = multer({ storage });


router.get('/', restrict, restrictadmin, (req, res) => {
      res.render('vwAccount/vwAdvantage/admin/home', { layout: 'mainAdmin.hbs' ,title:'Trang chủ Quản Trị Viên'}) //: res.render('403');
});

router.post('/logout', restrict, async function (req, res) {
     req.session.isAuthenticated = false;
     req.session.authUser = null;
     res.redirect(req.headers.referer);
})


// quản lý chuyên mục //

// hiện danh sách
router.get('/categories', restrict, async (req, res) => {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {

          const [typeCat, Cat] = await Promise.all([
               tpCatModel.getAll(),
               catModel.getall()]);

          res.render('vwAccount/vwAdvantage/admin/categories/list', { typeCat, Cat, layout: 'mainAdmin.hbs', title: 'Quản Lý Chuyên Mục' })
     }
     else {
          res.render('403');
     }
});
// hiện trang thêm chuyên mục
router.get('/categories/add', restrict, async (req, res) => {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          const [typeCat, Cat] = await Promise.all([
               tpCatModel.getAll(),
               catModel.getall()]);
          res.render('vwAccount/vwAdvantage/admin/categories/add', { typeCat, Cat, layout: 'mainAdmin.hbs', title: 'Thêm chuyên mục' })
     }
     else {
          res.render('403');
     }
});
// hiện trang thêm chuyên mục cha
router.get('/categories/addCat', restrict,restrictadmin, async (req, res) => {
          const [typeCat] = await Promise.all([
               tpCatModel.getAll()]);
     res.render('vwAccount/vwAdvantage/admin/categories/addCat', { typeCat, layout: 'mainAdmin.hbs', title: 'Thêm Loại Chuyên Mục' })
});
// Hiển thị chyên mục con theo chuyên mục cha (chi tiết chuyên mục cha)
router.get('/categories/:alias', restrict, async function (req, res) {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          for (const c of res.locals.lcCat) {
               if (c.tc_alias === +req.params.alias) {
                    c.isActive = true;
               }
          }
          const list = await catModel.getByCat(req.params.alias);
          res.render('vwAccount/vwAdvantage/admin/categories/byCat', {
               title: list[0].tc_Name,
               list,
               empty: list.length === 0,
               layout: 'mainAdmin.hbs'
          });
     }
     else {
          res.render('403');
     }

})
// chỉnh sửa chuyên mục theo id
router.get('/categories/editCat/:id', restrict, restrictadmin,async (req, res) => {
          const id = +req.params.id || -1;
     const rows = await tpCatModel.singleCat(id);
          if (rows.length === 0)
               return res.send('Biến không có giá trị.');
          const cats = rows[0];

          res.render('vwAccount/vwAdvantage/admin/categories/editCat', {
               cats, layout: 'mainAdmin.hbs', title: 'Chỉnh Sửa: ' + cats.tc_Name,
          })
});
// chỉnh sửa chuyên mục con theo id
router.get('/categories/edit/:id', restrict, async (req, res) => {
     var user = req.session.authUser;

     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          const id = +req.params.id || -1;
          const rows = await catModel.singleCat(id);
          if (rows.length === 0)
               return res.send('Invalid parameter.');
          const cats = rows[0];

          res.render('vwAccount/vwAdvantage/admin/categories/edit', {
               cats, layout: 'mainAdmin.hbs', title: 'Chỉnh Sửa: ' + cats.c_Name,
          })
     }
     else {
          res.render('403');
     }
});
// hiển thị trang chi tiết chuyên mục theo id
router.get('/categories/details/:conId', restrict, async function (req, res) {
     var user = req.session.authUser;
     if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
          const list = await catModel.detailById(req.params.conId);
          res.render('vwAccount/vwAdvantage/admin/categories/details', {
               title: list[0].c_Name,
               list,
               empty: list.length === 0,
               layout: 'mainAdmin.hbs',
          });
     }
     else {
          res.render('403');
     }

})
// xử lý thêm chuyên mục con
router.post('/categories/add', upload.single('c_images'), restrictadmin, restrict, async function (req, res) {
     if (req.file) {
     var row = await catModel.getBytypeCatId(req.body.tc_ID);
          mkdirp.sync('public/article/'+ row[0].tc_Name + "/" + req.body.c_Name);
          req.body.path = row[0].tc_Name + "/" + req.body.c_Name + "/";
          c_Large = req.body.tc_ID
          if (c_Large == 1) {
               c_Large = 'Chứng Khoán'
          }
          else if (c_Large == 2) {
               c_Large = 'Doanh Nghiệp'
          }
          else if(c_Large == 3){
               c_Large = 'Tài Chính'
          }
          else{
               c_Large ="Kiến Thức Đầu Tư";
     }
          var entity = {
               ...req.body,
               c_Large,
               c_images: req.file.filename,
               c_isActive:1
          }
               const addCat = await catModel.insertCat(entity);
               res.redirect('/admin/categories/add');
               //console.log(addCat);
     }
     else {
          res.render('500')
     }
})
// xử lý xóa chuyên mục con theo id
// router.post('/categories/del', restrict, async function (req, res) {
//      var user = req.session.authUser;
//      if (user.r_ID === 4 && user !== "undefined" && user !== null && user.r_ID !== null && user.r_ID !== "undefined") {
//           await catModel.delCat(req.body.ID);
//           res.redirect('/admin/categories');
//      }
//      else {
//           res.render('403');
//      }

// })
// xử lý xóa chuyên mục con theo id
router.post('/categories/del', restrict, restrictadmin, async (req, res) => {
     if (req.body.ID != "") {
          await catModel.delChild({ ID: req.body.ID });
     }
     res.redirect('/admin/categories');
});

// xử lý cập nhật chuyên mục con
router.post('/categories/update', upload.single('c_images'), restrictadmin, restrict, async function (req, res) {
     if (req.file) {
               var entity = {
                    ...req.body,
                    c_images:req.file.filename
              }
               await catModel.updateCat(entity);
               //console.log(entity);
               res.redirect('/admin/categories');
     }
     else if (req.file === undefined) {
          var entity = {
               ...req.body,
               /// images: req.file.filename
          }
          await catModel.updateCat(entity);
          //console.log(entity);
          res.redirect('/admin/categories');
     }
     else {
          res.render('500');
     }
})
// xử  lý thêm chuyên mục cha
router.post('/categories/addCat', upload.single('images'),  restrict, restrictadmin, async function (req, res) {
     if (req.file) {
         // console.log(req.body);
          var entity = {
               ...req.body,
               images: req.file.filename,
               tc_isActive: 1
          }
          mkdirp.sync('public/article/'+ req.body.tc_Name);
          const addCat = await tpCatModel.insertCat(entity);
          res.redirect('/admin/categories/addCat');
         // console.log(entity)
     }
})
// xử lý xóa chuyên mục cha theo id
router.post('/categories/delCat', restrict, restrictadmin, async function (req, res) {
     if (req.body.ID != "") {
          await tpCatModel.delCat({ ID: req.body.ID });
     }
     res.redirect('/admin/categories');

})

// cập nhật chuyên mục cha
router.post('/categories/updateCat', upload.single('images'), restrictadmin, restrict, async function (req, res) {
     if (req.file) {
               var entity = {
                    ...req.body,
                    images: req.file.filename
               }
               await tpCatModel.updateCat(entity);
               //console.log(entity);
               res.redirect('/admin/categories');
     }
     else if (req.file===undefined) {
          var entity = {
               ...req.body,
              /// images: req.file.filename
          }
          await tpCatModel.updateCat(entity);
          //console.log(entity);
          res.redirect('/admin/categories');
     }
     else {
          res.render('500');
     }
})
module.exports = router;