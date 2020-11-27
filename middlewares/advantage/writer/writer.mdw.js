const express = require('express');
const accountModles = require('../../../models/_account.model');
const router = express.Router();
const moment = require('moment');
const restrict = require("../../auth.mdw");
//const multer  = require('multer');
//const path  = require('path');
const fs = require('fs');
const validUrl = require('valid-url');
const moveFile = require('move-file');
const multer  = require('multer');
const path  = require('path');
const { getalltypecategory } = require('../../../models/_account.model');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        //add
        var pathimg = "";
        if(req.body.c_ID){
            var arr_path_img_category = await accountModles.getCategorybyID(req.body.c_ID);
            pathimg =arr_path_img_category[0].path;
        }
        cb(null, 'public/article/'+ pathimg);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })
const upload = multer({ storage: storage }).single('images');

module.exports = function (router) {
//advantage    
    router.get('/advantage/2', restrict, async function(req, res){
        if(req.session.authUser.r_ID == 2){
            var rows = await accountModles.getalltypecategory();
            res.render('vwAccount/vwAdvantage/writer/home', { layout: 'mainWriter.hbs', rows, title: 'Trang Chủ Phóng Viên'});
        }else{
            res.redirect('/');
        }
    });

    // đang bài
    router.get('/advantage/2/write', restrict, async function(req, res){
        var id = req.query.type;
        var category = await accountModles.getCategorybytcID(id);
        var tags = await accountModles.getAllTag();
        if(category.length > 0){
            res.render('vwAccount/vwAdvantage/writer/postarticle', { layout: 'mainWriter.hbs', category, title:'Đăng Bài: '+ category[0].c_Large, tags, status: true, isedit: true});
        }
        else{
            res.render('500', {layout: 'mainWriter.hbs'});
        }
    });

    router.get('/advantage/2/write/is_valueable', restrict, async function(req, res){
        var check = await accountModles.CheckTabExists(req.query.Name);
        if(check.length < 1){
            await accountModles.addNewTab({Name: req.query.Name, tg_alias: req.query.tg_alias});
            tag = await accountModles.singleByTag(req.query.Name);
            return res.json(`${tag[0].ID}`);
        }else{
            res.json("0");
        }
    })

    router.post('/advantage/2/write', restrict, upload, async function(req, res){
        //add update dùng chung 1 form
        var id_article = req.body.id_article;
        req.body.isActive = 1;
        delete req.body.url_img;
        delete req.body.id_article;
        req.body.sts_id = 4;
        req.body.WriterID = req.session.authUser.ID; 
        var arr_path_img_category = await accountModles.getCategorybyID(req.body.c_ID);

        // delelte tag_aricle
        var tags = req.body.tags;
        if(typeof tags != "undefined" && tags != null && id_article != ""){
            await accountModles.delTagArticlebyID({id_article: id_article});
            // thêm tag
            var i = 0;
            while(i < tags.length){
                await accountModles.addNewTagArticle({id_article: id_article, id_tag: tags[i]});
                i++;
            }
        }
        delete req.body.tags;
        // nó đổi ảnh        
        if(req.file){
            const data = {...req.body, images: arr_path_img_category[0].path + req.file.filename};
            if(id_article == ""){//add 
                await accountModles.addNewArticle(data);
                var id = await accountModles.getArticlebyAll(req.body.title, req.body.content);
                var i = 0;
                while(i < tags.length){
                    await accountModles.addNewTagArticle({id_article: id[0].id, id_tag: tags[i]});
                    i++;
                }
                res.redirect(req.headers.referer);
            }
            else{//update // xử lý đổi ảnh , đôi chuyên mục đổi ảnh
                delete req.body.sts_id;
                var tam = await accountModles.getArticle(id_article);
                await accountModles.patch_article(data, {id:id_article});
                fs.unlinkSync(`public/article/${tam[0].images}`);// xóa ảnh cũ 
                res.redirect(req.headers.referer);
            }
        }else{//ko đổi ảnh chắc ảnh chắc ăn là update
            if(id_article != ""){
                var tam = await accountModles.getArticle(id_article);
                var nameimgold = tam[0].images.split('/');
                nameimgold  = nameimgold[nameimgold.length - 1];
                // đổi chuyển mục di chuyển ảnh
                if(tam[0].c_ID != req.body.c_ID){
                    await moveFile(`public/article/${tam[0].images}`, `public/article/${arr_path_img_category[0].path}${nameimgold}`);
                    req.body.images = arr_path_img_category[0].path + nameimgold;
                }
                delete req.body.sts_id;
                await accountModles.patch_article(req.body, {id:id_article});
                res.redirect(req.headers.referer);
            }
        }
    })

    // chi tiết bài báo
    router.get('/advantage/2/newspaper', restrict, async function(req, res){
        res.render('vwAccount/vwAdvantage/writer/newspaper', {layout: 'mainWriter.hbs',title:'Trạng Thái Bài Viết'});
    })
    router.get('/advantage/2/newspaper/tablenewspaper', restrict, async function(req, res){
        var statusid = req.query.type;
        var rows = await accountModles.GetDataArticleByWriteridAndStatus(statusid, req.session.authUser.ID);

        /*var today = new Date();
        var publicday = new Date(`${rows[0].public_date}`);
        var active_time = moment.utc(publicday, 'YYYY-MM-DD[T]HH:mm[Z]');
        var current_time = moment.utc(today, 'YYYY-MM-DD[T]HH:mm[Z]');
        if(rows.length > 0){
            console.log(active_time.format());
            console.log(current_time.format());
            console.log( active_time.isAfter(current_time));
        }*/
        // không có nút sửa
        if(statusid == 1 || statusid == 2){
            res.render('vwAccount/vwAdvantage/writer/tablenewspaper', {
                layout: 'mainWriter.hbs', rows, statusid, title: 'Trạng Thái Bài Viết',
                helpers: {
                    isedit: function (status_id){
                      if(status_id == 3 || status_id == 4){
                        return true;
                      }
                      return false;
                    }
                }
            });
        }else if(statusid == 3 || statusid == 4){ 
            res.render('vwAccount/vwAdvantage/writer/tablenewspaper', {
                layout: 'mainWriter.hbs', rows, statusid, title: 'Trạng Thái Bài Viết',
                helpers: {
                    isedit: function (status_id){
                      if(status_id == 3 || status_id == 4){
                        return true;
                      }
                      return false;
                    }
                }
            });
        }
        else{
            res.render('500');
        }
    })
    // view, edit
    router.get('/advantage/2/newspaper/tablenewspaper/detail', restrict, async function(req, res){
        var id = req.query.id;
        var isedit = req.query.isedit;
        var articles = await accountModles.getArticle(id);
        var tag = await accountModles.getTagArticlebyID(id);
        var alltag = "";
        tag.forEach(function(value){
            alltag += value.Name + "; ";
        })
        var tags = await accountModles.getAllTag();
        var category = await accountModles.getCategory();
        category.forEach(function(value){
            if(value.ID == articles[0].c_ID){
                value.selected = true;
            }
            else{
                value.selected = false;
            }
        });
        if(isedit == 'true'){
            res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: 'mainWriter.hbs', id, isedit,
                row: articles[0], category, title: articles[0].title, alltag, tags
            });
        }else{
            res.render('vwAccount/vwAdvantage/writer/postarticle', {layout: 'mainWriter.hbs', id, 
                row: articles[0], category, title: articles[0].title, alltag, tags
            });
        }
    })
  
}