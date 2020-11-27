const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const restrictadmin = require("../../middlewares/restrictadmin.mdw");
const articleModel = require('../../models/article.model');
const accountModles = require('../../models/_account.model')
const tagModel = require('../../models/tag.model');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const validUrl = require('valid-url');
const moveFile = require('move-file');
const { Console } = require('console');
const storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        //add
        var pathimg = "";
        if (req.body.c_ID) {
            var arr_path_img_category = await accountModles.getCategorybyID(req.body.c_ID);
            pathimg = arr_path_img_category[0].path;
        }
        cb(null, 'public/article/' + pathimg);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage }).single('images');
const router = express.Router();

function getDatime() {
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

//hiện thị danh sách bài
router.get('/', restrict, restrictadmin, async(req, res) => {
    const list = await articleModel.getAll();
    res.render('vwAccount/vwAdvantage/admin/article/list', {
        title: 'Quản Lý Bài Viết',
        list,
        layout: 'mainAdmin.hbs',
        helpers: {
            format_DOB: function(date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY')
            },
            isedit: function(status_id) {
                if (status_id == 4) {
                    return true;
                }
                return false;
            }
        }
    })
});
// load view thêm bài
router.get('/add', restrict, restrictadmin, async function(req, res) {
    var tags = await accountModles.getAllTag();
    var category = await accountModles.getCategory();
    var witer = await accountModles.getWrite();
    res.render('vwAccount/vwAdvantage/admin/article/add', { category, witer, tags, layout: 'mainAdmin.hbs', title: 'Thêm Bài Viết' })

});

router.get('/add/is_valueable', restrict, restrictadmin, async function(req, res){
    var check = await accountModles.CheckTabExists(req.query.Name);
    if(check.length < 1){
        await accountModles.addNewTab({Name: req.query.Name, tg_alias: req.query.tg_alias});
        tag = await accountModles.singleByTag(req.query.Name);
        return res.json(`${tag[0].ID}`);
    }else{
        res.json("0");
    }
})

// thêm bài viết
router.post('/add', restrict, restrictadmin, upload, async function(req, res) {
    var arr_path_img_category = await accountModles.getCategorybyID(req.body.c_ID);
    var tags = req.body.tags;
    var i = 0;
    delete req.body.tags;
    req.body.WriterID = req.session.authUser.ID;
    if (req.file) {
        const data = {...req.body, images: arr_path_img_category[0].path + req.file.filename };
        await accountModles.addNewArticle(data);
        var id = await accountModles.getArticlebyAll(req.body.title, req.body.content);
        //thêm tab
        while(i < tags.length){
            await accountModles.addNewTagArticle({id_article: id[0].id, id_tag: tags[i]});
            i++;
        }
        res.redirect(req.headers.referer);
    } else {
        res.render('500', { layout: 'mainAdmin.hbs' });
    }

});
// Hiển thị trang chi tiết bài báo admin
router.get('/details/:id', restrict, restrictadmin, async function(req, res) {
    const detai = await articleModel.draft(req.params.id);
    for (const key in detai) {
        tags = [];

        const tag = await tagModel.alltag(detai[key].id);
        for (const key in tag) {

            tags.push(tag[key]);
        }
        detai[key].tags = tags;

    }
    res.render('vwAccount/vwAdvantage/admin/article/details', {
        title: detai[0].title,
        detai,
        tags,
        layout: 'mainAdmin.hbs',
        helpers: {
            splitTitle: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[0];
                }
            },
            splitTitle1: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[1];
                }
            },
            splitTitle2: function(tag) {
                for (var i = 0; i < tag.length; i++) {
                    var t = tag.split(';');
                    return t[2];
                }
            }

        }
    })

});

router.get('/edit/is_valueable', restrict, restrictadmin, async function(req, res){
    var check = await accountModles.CheckTabExists(req.query.Name);
    if(check.length < 1){
        await accountModles.addNewTab({Name: req.query.Name, tg_alias: req.query.tg_alias});
        tag = await accountModles.singleByTag(req.query.Name);
        return res.json(`${tag[0].ID}`);
    }else{
        res.json("0");
    }
})

// chỉnh sửa bài viết
router.get('/edit/:id', restrict, restrictadmin, async function(req, res) {
    var category = await accountModles.getCategory();
    var articles = await accountModles.getArticle(req.params.id);
    var tag = await accountModles.getTagArticlebyID(req.params.id);
    var alltag = "";
    tag.forEach(function(value){
        alltag += value.Name + "; ";
    })
    var tags = await accountModles.getAllTag();
    category.forEach(function(value) {
        if (value.ID == articles[0].c_ID) {
            value.selected = true;
        } else {
            value.selected = false;
        }
    });
    res.render('vwAccount/vwAdvantage/admin/article/edit', {
        title: 'Chỉnh Sửa: ' + articles[0].title,
        layout: 'mainAdmin.hbs',
        category,
        tags,
        alltag,
        row: articles[0]
    })

});

// cập nhật
router.post('/edit/:id', upload, restrict, restrictadmin, async function(req, res) {
    var id_article = req.body.id;
    delete req.body.url_img;
    delete req.body.id_article;
    req.body.WriterID = req.session.authUser.ID;
    var tags = req.body.tags;
    //nếu đổi tag
    if(typeof tags != "undefined" && tags != null && id_article != ""){
        await accountModles.delTagArticlebyID({id_article: id_article});
        // thêm tag
        var i = 0;
        while(i < tags.length){
            await accountModles.addNewTagArticle({id_article: id_article, id_tag: tags[i]});
            i++;
        }
     }
     /*
    // có thay đổi chuyên mục thì phải di chuyển ảnh cập nhật lại đường dẫn
    var images = req.body.images;
    var temp = images;
    images = images.split('/');
    var c_id =  req.body.categoryold;
    if(c_id != req.body.c_ID){
        // lây ra nơi lưu ảnh mới
        var position = await accountModles.getCategorybyID(req.body.c_ID);
        // di chuyển ảnh
        await moveFile(`public/article/${temp}`, `public/article/${position[0].path}${images[images.length - 1]}`);
        req.body.images = position[0].path + images[images.length - 1];
    }else{
        delete  req.body.images;
    }*/
    delete req.body.categoryold
    delete req.body.tags;

    var arr_path_img_category = await accountModles.getCategorybyID(req.body.c_ID);
    if (req.file) {
        const data = {...req.body, images: arr_path_img_category[0].path + req.file.filename };
        var tam = await accountModles.getArticle(id_article);
        await accountModles.patch_article(data, { id: id_article });
        fs.unlinkSync(`public/article/${tam[0].images}`); // xóa ảnh cũ 
        res.redirect('/admin/article');
    } else {
        var tam = await accountModles.getArticle(id_article);
        if (tam[0].c_ID != req.body.c_ID) {
            var nameimgold = tam[0].images.split('/');
            nameimgold = nameimgold[nameimgold.length - 1];
            await moveFile(`public/article/${tam[0].images}`, `public/article/${arr_path_img_category[0].path}${nameimgold}`);
            req.body.images = arr_path_img_category[0].path + nameimgold;
        }
        await accountModles.patch_article(req.body, { id: id_article });
        res.redirect('/admin/article');
    }

});

//Xóa bài viết
router.post('/delArticle', restrict, restrictadmin, async function(req, res) {
        if (req.body.ID != "") {
            //await tpCatModel.delCat({ ID: req.body.ID });
            await articleModel.update({ isActive: 0 }, { ID: req.body.ID });
        }
        res.redirect('/admin/article');

    })
    //Duyệt thẳng
router.post('/', restrict, restrictadmin, async function(req, res) {
    id = req.body.id;
    delete req.body.id;
    if (req.body.featured) {
        req.body.featured = 1;
    } else {
        req.body.featured = 0;
    }
    if (req.body.isPremium) {
        req.body.isPremium = 1;
    } else {
        req.body.isPremium = 0;
    }
    req.body.note = "";
    req.body.sts_id = 2;
    req.body.isActive = 1;
    req.body.public_date = getDatime();
    await articleModel.update(req.body, { id: id });
    await articleModel.addNewTagArticle({ id_tag: 1, id_article: id });
    res.redirect(req.headers.referer);

})


module.exports = router;