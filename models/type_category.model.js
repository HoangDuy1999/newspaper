const db = require('../utils/db');

const TBL_tp_cat = 'type_catelgories';
module.exports = {
    getAll: () => {
        return db.load(`select * from ${TBL_tp_cat} where tc_isActive=1 `);
    },
    singleCat: (id) => {
        return db.load(`select * from ${TBL_tp_cat}  where ID=${id}`);
    },
    insertCat: (entity) => {
        return db.add(`insert into  ${TBL_tp_cat} set ?`, entity);
    },
    delCat: function (id) {
        return db.del(`delete from ${TBL_tp_cat} where ?`, id);
    },
    updateCat: function (entity) {
        const condition = {
            ID: entity.ID
        }
        delete entity.ID;
        return db.update(TBL_tp_cat, entity, condition);
    },
}