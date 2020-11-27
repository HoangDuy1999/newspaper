const db = require('../utils/db');

const TBL_tag = "tag";
module.exports = {
    getAll: () => {
        return db.load(`select * from ${TBL_tag} `);
    },
    getByName: (name, limit, offset) => {
        return db.load(`SELECT * FROM tag_article ta ,article a,${TBL_tag} t,categories c
        WHERE ta.id_article=a.id and a.sts_id=2 and a.isPremium = 0 and a.isActive=1  and t.ID=ta.id_tag and c.ID=a.c_ID and t.tg_alias ='${name}' limit ${limit} offset ${offset}`);
    },
    getByNamePre: (name, limit, offset) => {
        return db.load(`SELECT * FROM tag_article ta ,article a,${TBL_tag} t,categories c
        WHERE ta.id_article=a.id and a.sts_id=2 and a.isPremium = 1 and a.isActive=1  and t.ID=ta.id_tag and c.ID=a.c_ID and t.tg_alias ='${name}' limit ${limit} offset ${offset}`);
    },
    countByTags: async function (name) {
        const rows = await db.load(`select count(*) as total FROM tag_article ta ,article a,${TBL_tag} t
        WHERE ta.id_article=a.id and a.sts_id=2 and t.ID=ta.id_tag and a.isActive=1 and t.tg_alias = '${name}'`);
        return rows[0].total;
    },
    countByTagPre: async function (name) {
        const rows = await db.load(`select count(*) as total FROM tag_article ta ,article a,${TBL_tag} t
        WHERE ta.id_article=a.id and a.sts_id=2 and t.ID=ta.id_tag and a.isActive=1 and a.isPremium = 1 and t.tg_alias = '${name}'`);
        return rows[0].total;
    },
    detailById: (id) => {
        return db.load(`SELECT DISTINCT t.ID,t.Name,t.tg_alias,a.id,a.title,a.sts_id,a.images,a.public_date,a.isActive,ta.id_article,ta.id_tag 
FROM tag t join tag_article ta on t.ID=ta.id_tag JOIN article a on ta.id_article=a.id
 WHERE t.ID=${id} and a.sts_id=2 and a.isActive=1`);
    },
    delTag: function (id) {
        return db.del(`delete from ${TBL_tag} where ?`, id);
    },
    addTag: function (entity) {
        return db.insert(TBL_tag, entity);
    },
    updateTag: function (entity) {
        const condition = {
            ID: entity.ID
        }
        delete entity.ID;
        return db.update(TBL_tag, entity, condition);
    },
    single: function (Id) {
        return db.load(`select * from ${TBL_tag} where ID = ${Id}`);
    },
    alltag: function(id) {
    return db.load(`SELECT t.*, ta.id_article from tag t join tag_article ta on t.ID=ta.id_tag WHERE ta.id_article=${id}`)    
}
  
}