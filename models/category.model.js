const db = require('../utils/db');

const TBL_cat = "categories"
module.exports = {
    all: function() {
        return db.load(`SELECT * FROM ${TBL_cat} c JOIN type_catelgories tc on tc.ID=c.tc_ID`);
    },
    getall: function() {
        return db.load(`SELECT * FROM ${TBL_cat} where c_isActive =1`);
    },
    getBytypeCatId: (id) => {
        return db.load(`select * from type_catelgories where ID=${id}`);
    },
    getByCatId: (id) => {
        return db.load(`select * from ${TBL_cat} where tc_ID=${id}`);
    },
    singleCat: function(Id) {
        return db.load(`SELECT tc.ID as tcID,tc.tc_Name as tc_Name,c.c_images as c_images  ,c.ID as ID,c.c_Name as c_Name,c.c_alias as c_alias
        FROM ${TBL_cat} c JOIN type_catelgories tc 
        on tc.ID=c.tc_ID and c.ID= ${Id}`);
    },
    // load byId
    single: function(Id) {
        return db.load(`select * from ${TBL_cat} c join  article a on c.ID=a.c_ID where a.sts_id=2 and tc_ID = ${Id}`);
    },
    // load byAlias
    loadByChild: function(alias, c_alias) {
        return db.load(`select * from ${TBL_cat} c join  article a on c.ID=a.c_ID where 
        a.sts_id=2 and tc_alias = '${alias}' and c_alias = '${c_alias}'`);
    },
    loadByCat: function(alias) {
        return db.load(`select * from ${TBL_cat} c join  article a on c.ID=a.c_ID where a.sts_id=2 and tc_alias = '${alias}'`);
    },
    // lấy dữ liệu và phân trang theo dữ liệu
    pageByCat: function(alias, limit, offset) {
        return db.load(`select * from ${TBL_cat}  c join  article a on c.ID=a.c_ID where 
        a.sts_id=2 and a.isPremium = 0 and a.isActive = 1 and tc_alias = '${alias}' limit ${limit} offset ${offset}`);
    },
    pageByCatPre: function(alias, limit, offset) {
        return db.load(`select * from ${TBL_cat}  c join  article a on c.ID=a.c_ID where 
        a.sts_id=2 and a.isPremium = 1 and a.isActive=1 and tc_alias = '${alias}' limit ${limit} offset ${offset}`);
    },
    countByCat: async function(alias) {
        const rows = await db.load(`select count(*) as total from ${TBL_cat} c join  article a on c.ID=a.c_ID where a.sts_id=2 and a.isActive = 1 and tc_alias = '${alias}'`);
        return rows[0].total;
    },
    countByCatPre: async function(alias) {
        const rows = await db.load(`select count(*) as total from ${TBL_cat}  c join  article a on c.ID=a.c_ID where a.sts_id=2 and a.isPremium = 1 and a.isActive = 1 and tc_alias = '${alias}'`);
        return rows[0].total;
    },
    pageByChild: function(alias, c_alias, limit, offset) {
        return db.load(`select * from ${TBL_cat}  c join  article a on c.ID=a.c_ID where 
        a.sts_id=2 and tc_alias = '${alias}' and c_alias = '${c_alias}' limit ${limit} offset ${offset}`);
    },
    countByChild: async function(alias, c_alias) {
        const rows = await db.load(`select count(*) as total from ${TBL_cat} c join  article a on c.ID=a.c_ID where tc_alias = '${alias}' and c_alias = '${c_alias}'`);
        return rows[0].total;
    },
    getByCat: function(alias) {
        return db.load(`SELECT tc.ID as tcID,tc.tc_Name as tc_Name,c.c_images as c_images,tc.alias as tc_alias  ,c.ID as ID,c.c_Name as c_Name,c.c_alias as c_alias
        FROM ${TBL_cat} c JOIN type_catelgories tc 
        on tc.ID=c.tc_ID where tc_alias = '${alias}'`);
    },
    getByChild: function(c_alias) {
        return db.load(`SELECT tc.ID as tcID,tc.tc_Name as tc_Name,tc.alias as tc_alias  ,c.ID as ID,c.c_Name as c_Name,c.c_alias as c_alias
        FROM ${TBL_cat} c JOIN type_catelgories tc 
        on tc.ID=c.tc_ID and c.c_alias = '${c_alias}'`);
    },
    detailById: (id) => {
        return db.load(`SELECT * FROM ${TBL_cat} where ID =${id} `);
    },
    insertCat: (entity) => {
        return db.add(`insert into  ${TBL_cat} set ?`, entity);
    },
    delCat: function(id) {
        const condition = {
            ID: id
        }
        return db.del(`delete from ${TBL_cat} where ?`, condition);
    },
    updateCat: function(entity) {
        const condition = {
            ID: entity.ID
        }
        delete entity.ID;
        return db.update(TBL_cat, entity, condition);
    },
    delChild: function(id) {
        return db.del(`delete from ${TBL_cat} where ?`, id);
    },





}