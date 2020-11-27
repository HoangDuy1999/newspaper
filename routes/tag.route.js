const express = require('express');
const tagModel = require('../models/tag.model');
const moment = require('moment');
const config = require('../config/config.json');

const router = express.Router();

// getbyTags
router.get('/:name', async function (req, res) {
    const name = req.params.name;
    var listnor = [];
    var page = +req.query.page || 1;
    if (page < 0) page = 1;
    var offset = (page - 1) * config.pagination.limit;
    const [listArticle_tagsPre, total] = await Promise.all([
        tagModel.getByNamePre(name, config.pagination.limit, offset),
        tagModel.countByTags(name)
    ]);

    if (listArticle_tagsPre.length < 5) {
        var countpre = await tagModel.countByTagPre(name);
        if (offset - countpre < 0) {
            offset = 0;            
        } else {
            offset = offset - countpre;
        }
        listnor = await tagModel.getByName(name, config.pagination.limit-listArticle_tagsPre.length, offset);
    }

    // tính số trang
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    // duyệt số trang và  tính
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }
    var list = listArticle_tagsPre.concat(listnor);


    for (const key in list) {
        tags = [];

        const tag = await tagModel.alltag(list[key].id);
        for (const key in tag) {

            tags.push(tag[key]);
        }
        list[key].tags = tags;

    }
    // console.log(list[0].id);
    // var ID = list[0].id
    // const tag = await tagModel.alltag(ID)
    // console.log(tag);
    // const listArticle = await catModel.loadByChild(req.params.alias, req.params.c_alias);
    res.render('vwArticle/byTag', {
        title:'Theo Nhãn: '+ list[0].Name,
        list,
        tags,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        helpers: {
            format_DOB: function (date) {
                return moment(date, 'YYYY/MM/DD').format('DD-MM-YYYY');
            }
        }
    });
})


module.exports = router;