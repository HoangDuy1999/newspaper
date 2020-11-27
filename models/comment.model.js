const db = require('../utils/db');

const TBL_comment = 'comment';
module.exports = {
    getAll: () => {
        return db.load(`select * from ${TBL_comment} `);
    },
    getByArticle: (title) => {
        return db.load(`select * from ${TBL_comment} co ,article a,account ac
        where co.ID_Article=a.id and a.sts_id=2 and co.ID_Account=ac.ID and title_alias='${title}' `);
    },
    addComment: function (entity) {
        return db.insert(TBL_comment, entity);
    },
    insertComment: function (entity) {
        return db.add(`insert into  ${TBL_comment} set ?`, entity);
    }
    ,
    getId_article: (id) => {
        return db.load(`select DISTINCT(a.id) as id from ${TBL_comment} co join article a on co.ID_Article=a.id
         where a.id=${id}  and a.sts_id=2`);
    }


}