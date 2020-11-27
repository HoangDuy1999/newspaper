const db = require('../utils/db');

const TBL_article = 'article'
module.exports = {
    // get all article
    all: function() {
        return db.load(`select * from ${TBL_article} a ,categories c,article_status at
         where a.c_ID=c.ID and a.sts_id=at.asts_id and  a.sts_id=2 and isActive=1`);
    },
    getAll: function() {
        return db.load(`select * from ${TBL_article} a ,categories c,article_status at
         where a.c_ID=c.ID and a.sts_id=at.asts_id and a.isActive=1`);
    },
    getarticlebyID: function(id) {
        return db.load(`select * from ${TBL_article} where id=${id}`);
    },
    getNameCategorybya_ID: function(id) {
        return db.load(`SELECT * FROM article, categories WHERE article.id=${id} and article.c_ID = categories.ID`);
    },
    // 10 newest article
    newest: function() {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID
        join account ac 
        on a.writerID=ac.ID
         where isActive=1 and  a.sts_id=2 order by public_date DESC limit 10`);
    },
    // 3-4 best featured article:chứng khoán,doanh nghiệp,tài chính in the weekend
    // get 1 featured article
    bestnew1: function() {
        return db.load(`select ac.pseudonym , c.c_alias,a.title_alias,a.public_date,a.c_ID ,a.id,a.title,a.abstract,DATEDIFF(CURDATE(), a.public_date) AS day,a.featured,a.views,a.isActive,a.images,c.ID,c.tc_ID,c.c_Name,c.c_Large 
        from article a join categories c on a.c_ID=c.ID join account ac 
        on a.writerID=ac.ID
        where a.isActive=1 and  a.sts_id=2 and a.featured=1 and (a.c_ID=1 OR a.c_ID=2 OR a.c_ID=8) having (day>0 and day<=7) order by rand() LIMIT 1`);
    },
    bestnew2: function() {
        return db.load(`select ac.pseudonym , c.c_alias,a.title_alias,a.public_date,a.c_ID ,a.id,a.title,a.abstract,DATEDIFF(CURDATE(), a.public_date) AS day,a.featured,a.views,a.isActive,a.images,c.ID,c.tc_ID,c.c_Name,c.c_Large 
        from article a join categories c on a.c_ID=c.ID join account ac 
        on a.writerID=ac.ID
        where a.isActive=1 and  a.sts_id=2 and a.featured=1 and (a.c_ID=3 OR a.c_ID=4 OR a.c_ID=17) having (day>0 and day<=7) order by rand() LIMIT 1`);
    },
    bestnew3: function() {
        return db.load(`select ac.pseudonym ,c.c_alias,a.title_alias,a.public_date,a.c_ID , a.id,a.title,a.abstract,DATEDIFF(CURDATE(), a.public_date) AS day,a.featured,a.views,a.isActive,a.images,c.ID,c.tc_ID,c.c_Name,c.c_Large 
        from article a join categories c on a.c_ID=c.ID  join account ac 
        on a.writerID=ac.ID
        where a.isActive=1 and a.featured=1 and  (a.sts_id=2 and a.c_ID=5 OR a.c_ID=6) having (day>0 and day<=7)
        order by rand() LIMIT 1`);
    },
    bestnew4: function() {
        return db.load(`select ac.pseudonym ,c.c_alias,a.title_alias,a.public_date,a.c_ID , a.id,a.title,a.abstract,DATEDIFF(CURDATE(), a.public_date) AS day,a.featured,a.views,a.isActive,a.images,c.ID,c.tc_ID,c.c_Name,c.c_Large 
        from article a join categories c on a.c_ID=c.ID  join account ac 
        on a.writerID=ac.ID
        where a.isActive=1 and a.featured=1 and  a.sts_id=2 and (a.c_ID=18 OR a.c_ID=19) having (day>0 and day<7)
        order by rand() LIMIT 1`);
    },
    // 10 the viewest  article
    viewest: function() {
        return db.load(`select * from ${TBL_article} a join categories c on a.c_ID=c.ID  join account ac 
        on a.writerID=ac.ID
        where a.isActive=1 AND  a.sts_id=2 order by views DESC limit 10`)
    },
    //top 10 categories
    top10_chungkhoan: function() {
        return db.load(`(SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID 
            WHERE a.c_ID=1 and a.sts_id=2 and a.isActive=1 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1) 
            UNION (SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID
                 WHERE a.c_ID=2 and a.isActive=1 and a.sts_id=2 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1)
             UNION (SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID
                 WHERE a.c_ID=8 and a.isActive=1 and a.sts_id=2 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1)`);
    },
    top10_doanhnghiep: function() {
        return db.load(`(SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID 
            WHERE a.c_ID=3 and a.sts_id=2 and a.isActive=1 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1) 
            UNION (SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID
                 WHERE a.c_ID=4 and a.isActive=1 and a.sts_id=2 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1)
             UNION (SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID
                 WHERE a.c_ID=17 and a.isActive=1 and a.sts_id=2 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1)`);
    },
    top10_taichinh: function() {
        return db.load(`(SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID 
            WHERE a.c_ID=5 and a.sts_id=2  and a.isActive=1 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1) 
            UNION (SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID
                 WHERE a.c_ID=6 and a.isActive=1 and a.sts_id=2 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1)`);
    },
    top10_kienthucdautu: function() {
        return db.load(`(SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID 
            WHERE a.c_ID=18 and a.isActive=1 and a.sts_id=2 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1) 
            UNION (SELECT * FROM article a join categories c on a.c_ID=c.ID join account ac on a.writerID=ac.ID
                 WHERE a.c_ID=19 and a.isActive=1 and a.sts_id=2 and c.c_isActive=1 ORDER BY a.public_date DESC LIMIT 1)`);
    },
    detailById: function(Id) {
        return db.load(`select * from ${TBL_article} where id = ${Id}`);
    },
    // get 5 articles same categories
    ArtSameCat: function(c_alias,title) {
        return db.load(`SELECT * FROM ${TBL_article} a join categories c on a.c_ID=c.ID
            WHERE c.c_alias='${c_alias}' and a.isActive=1 and sts_id=2 and a.title_alias!='${title}'  ORDER BY rand() LIMIT 5`)
    },
    detailByTitle: function(title,id) {
        return db.load(`select * from ${TBL_article}  a
         where title_alias = '${title}' and a.id=${id}  and sts_id=2`);
    },
    allSearch: function(key) {
        return db.load(`SELECT * FROM ${TBL_article} a join categories c on a.c_ID= c.ID
         WHERE  a.sts_id=2 AND MATCH(title,abstract,content) AGAINST('${key}')`);
    },
    alldraft: function(c_id, limit, offset) {
        return db.load(`SELECT * FROM ${TBL_article} WHERE c_ID=${c_id} and (sts_id = 4 OR sts_id = 3) and isActive=1 limit ${limit} offset ${offset}`);
    },
    demListDraft: async function(c_id) {
        const row = await db.load(`SELECT COUNT(*) as dem FROM ${TBL_article} WHERE sts_id=4 and isActive=1 and c_ID=${c_id}`);
        return row[0].dem;
    },
    draft: function(id) {
        return db.load(`SELECT * FROM ${TBL_article} WHERE id= ${id}`)
    },
    single: function(id) {
        return db.load(`select * from ${TBL_article} where id = ${id}`);
    },
    getbytitlealias: function(title_alias) {
        return db.load(`select * from ${TBL_article} where title_alias = '${title_alias}' and sts_id=2`);
    },
    getallaricledefusebyeditor: function(id) {
        return db.load(`select * from ${TBL_article} where e_id = ${id} and sts_id = 3`);
    },
    update: function(entity, condition) {
        return db.update(TBL_article, entity, condition);
    },
    insertnote: function(entity) {
        return db.insert(TBL_article, entity);
    },
    // lấy dữ liệu và phân trang theo dữ liệu
    pageByCatPre: function(key, limit, offset) {
        return db.load(`SELECT * FROM ${TBL_article} a, categories c WHERE  a.c_ID = c.ID and a.sts_id = 2 and a.isPremium = 1 and a.isActive = 1 and MATCH(title,abstract,content) AGAINST('${key}') limit ${limit} offset ${offset}`);
    },
    pageByCat_temp: function(key) {
        return db.load(`SELECT * FROM ${TBL_article} a join categories c on a.c_ID= c.ID WHERE a.isActive=1 and a.sts_id = 2 and a.isPremium = 0 AND MATCH(title,abstract,content) AGAINST('${key}')`);
    },
    pageByCat: function(key, limit, offset) {
        return db.load(`SELECT * FROM ${TBL_article} a join categories c on a.c_ID= c.ID WHERE a.isActive=1 and a.sts_id = 2  and a.isPremium = 0 AND MATCH(title,abstract,content) AGAINST('${key}') limit ${limit} offset ${offset}`);
    },
    /*countByCat: async function(key) {
        const rows = await db.load(`select count(*) as total from ${TBL_article} a join categories c on a.c_ID= c.ID WHERE a.isActive=1 AND MATCH(title,abstract,content) AGAINST('${key}')`);
        return db.load(`SELECT * FROM ${TBL_article} a, categories c WHERE  a.c_ID = c.ID and a.isPremium = 0 and a.isActive = 1 and MATCH(title,abstract,content) AGAINST('${key}') limit ${limit} offset ${offset}`);
    },*/
    countByCatpre: async function(key) {
        const rows = await db.load(`select count(*) as total FROM ${TBL_article} a, categories c WHERE a.c_ID = c.ID and a.sts_id = 2 and a.isPremium = 1 and a.isActive = 1 and MATCH(title,abstract,content) AGAINST('${key}')`);
        return rows[0].total;
    },
    countByCat: async function(key) {
        const rows = await db.load(`select count(*) as total FROM ${TBL_article} a, categories c WHERE a.c_ID = c.ID  and a.sts_id = 2 and a.isActive = 1 and MATCH(title,abstract,content) AGAINST('${key}')`);
        return rows[0].total;
    },
    countByAll: async function () {
        const rows = await db.load(`select count(*) as total FROM ${TBL_article} where sts_id=2 and isActive=1`);
        return rows[0].total;
    },
    pageByAll: function (limit, offset) {
        return db.load(`select * from ${TBL_article}  where sts_id=2  limit ${limit} offset ${offset}`);
    },
    getArticleByStatusC_IDandPulic_date: function(e_id) {
        return db.load(`SELECT * FROM article WHERE sts_id = 1 and e_id = ${e_id} and isActive = 1
        and (TIMESTAMPDIFF(second,NOW(), public_date)) <= 0`);
    },
    getArticleByStatusC_IDandPulic_date_Flase: function(e_id) {
        return db.load(`SELECT * FROM article WHERE sts_id = 1 and e_id = ${e_id} and isActive = 1
        and (TIMESTAMPDIFF(second,NOW(), public_date)) > 0`);
    },
    getArticletrue: function(e_id) {
        return db.load(`SELECT * FROM article WHERE sts_id = 1 and isActive = 1 AND e_id = ${e_id}`);
    },
    addNewTagArticle: function(entity) {
        return db.insert('tag_article', entity);
    },
    delArticle: function(id) {
        const condition1 = {
            ID: id
        }
        const condition2 = {
            id_article: id
        }
        return db.del(`delete from tag_article where ?`, condition2), db.del(`delete from comment where ?`, condition2), db.del(`delete from ${TBL_article} where ?`, condition1);
    },
}