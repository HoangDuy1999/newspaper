const db = require('../utils/db');

const TABLE_account="account"
module.exports = {
    singleByUserName: function (username) {
        return db.load(`select * from ${TABLE_account} where username= N'${username}'`);
    },
    singleByUserNameID: function (username, id) {
        return db.load(`select * from ${TABLE_account} where username= N'${username}' and ID != ${id}`);
    },
    singleByEmail: function (email) {
        return db.load(`select * from ${TABLE_account} where email='${email}'`);
    },
    singleByTag: function (Name) {
        return db.load(`select * from tag where Name like N'${Name}'`);
    },
    singleArticleByID: function (id) {
        return db.load(`select * from article where id = '${id}'`);
    },
    CheckTabExists: function (Name) {
        return db.load(`select * from tag where Name like N'${Name}'`);
    },
    singleByEmailID: function (email, id) {
        return db.load(`select * from ${TABLE_account} where email='${email}' and ID != ${id}`);
    },
    addNewAccount: function (entity) {
        return db.insert(TABLE_account, entity);
    },
    addNewTab: function (entity) {
        return db.insert('tag', entity);
    },
    addNewTagArticle: function (entity) {
        return db.insert('tag_article', entity);
    },
    patch_account: function (entity, condition) {
        return db.update(TABLE_account, entity, condition);
    },
    patch_article: function (entity, condition) {
        return db.update('article', entity, condition);
    },
    getCategorybytcID: function(id){
        return db.load(`SELECT * FROM categories WHERE tc_ID = ${id}`);
    },
    getAllArticleByEditorAndPublished: function(e_id){
        return db.load(`SELECT * FROM article WHERE e_id = ${e_id} and sts_id = 2`);
    },
    getAllTag: function(){
        return db.load(`SELECT * FROM tag`);
    },
    getTagArticlebyID: function(id){
        return db.load(`SELECT t.Name FROM tag_article ta, tag t where ta.id_article = ${id} and ta.id_tag = t.ID`);
    },
    getCategory: function(){
        return db.load(`SELECT * FROM categories`);
    },
    getCategorybyID: function(id){
        return db.load(`SELECT * FROM categories where ID= ${id}`);
    },
    addNewArticle: function (entity) {
        return db.insert('article', entity);
    },
    GetDataArticleByWriteridAndStatus:function (statusid, writerid) {
        return db.load(`SELECT * FROM article art, article_status ats WHERE art.sts_id = ${statusid} and art.writerID = ${writerid} and art.sts_id=ats.asts_id`);
    },
    getArticle:function (id) {
        return db.load(`SELECT * FROM article WHERE id =${id}`);
    },
    getArticlebyAll:function (title, content) {
        return db.load(`SELECT id FROM article WHERE title like N'${title}' and content like N'${content}'`);
    },
    getWrite:function(){
        return db.load(`SELECT * FROM account where r_ID=2`);
    },
    getpathimagecategotybyc_id:function(c_id){
        return db.load(`SELECT * FROM pathimagecategory where c_id = ${c_id}`);
    },
    getalltypecategory:function(){
        return db.load(`SELECT * FROM type_catelgories`);
    },
    delTagArticlebyID: function (id) {
        return db.del(`delete from tag_article where ?`, id);
    }

}