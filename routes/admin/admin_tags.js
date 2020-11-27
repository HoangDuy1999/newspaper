const express = require('express');
const restrict = require("../../middlewares/auth.mdw");
const restrictadmin = require("../../middlewares/restrictadmin.mdw");
const articleModel = require('../../models/article.model');
const tagModel = require('../../models/tag.model');
const moment = require('moment');
var fs = require('fs');
const mkdirp = require('mkdirp');
const router = express.Router();

// hiển thị trang danh sách
router.get('/', restrict, restrictadmin,async (req, res) => {
    const list = await tagModel.getAll();
    res.render('vwAccount/vwAdvantage/admin/tag/list', { list, layout: 'mainAdmin.hbs', title: 'Quản Lý Nhãn' })
});
// hiển thị trang thêm
router.get('/add', restrict, restrictadmin,(req, res) => {
    res.render('vwAccount/vwAdvantage/admin/tag/add', { layout: 'mainAdmin.hbs', title: 'Thêm Nhãn' })
});
// hiển thị trang chi tiết
router.get('/details/:id', restrict, restrictadmin, async(req, res) => {
    const list = await tagModel.detailById(req.params.id);
    const single = await tagModel.single(req.params.id);
    res.render('vwAccount/vwAdvantage/admin/tag/details', {
        title: 'Chi Tiết Nhãn',
        list,
        single,
        empty: list.length === 0,
        layout: 'mainAdmin.hbs',
    });
});
// hiển thị trang cập nhật
router.get('/edit/:id', restrict, restrictadmin, async (req, res) => {
    const id = +req.params.id || -1;
    const rows = await tagModel.single(id);
    if (rows.length === 0)
        return res.send('Biến không có giá trị.');
    const tags = rows[0];

    res.render('vwAccount/vwAdvantage/admin/tag/edit', {
        tags, layout: 'mainAdmin.hbs', title: 'Chỉnh Sửa Nhãn'
    })
});
// xử lý thêm  tag
router.post('/add', restrict, restrictadmin, async (req, res) => {
    const addTag= await tagModel.addTag(req.body)
    res.redirect('/admin/tag/add');
    // console.log(addTag);
});
// xử lý xóa tag
router.post('/delTag', restrict, restrictadmin, async (req, res) => {
    if (req.body.ID != "") {
        await tagModel.delTag({ ID: req.body.ID });
    }
    res.redirect('/admin/tag');
});
// xử lý cập nhật
router.post('/update', restrict, restrictadmin, async function (req, res) {
    console.log(req.body);
    await tagModel.updateTag(req.body);
    res.redirect('/admin/tag');

})

module.exports = router;