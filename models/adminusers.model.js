const db = require('../utils/db');

const TABLE_account="account"
module.exports = {
    getbyroleaccount: function (role_id) {
        return db.load(`select acc.*, r.Name from ${TABLE_account} acc, role_account r where acc.r_ID = r.ID and acc.r_ID= ${role_id}`);
    },
    getallaccount: function () {
        return db.load(`select acc.*, r.Name from ${TABLE_account} acc, role_account r where acc.r_ID = r.ID`);
    },
    getaccountbyID: function (id) {
        return db.load(`select acc.*, r.Name from ${TABLE_account} acc, role_account r where acc.r_ID = r.ID and acc.ID = ${id}`);
    },
    getallRoldeAccount: function () {
        return db.del("SELECT * FROM role_account");
    },
    getalltypecategory: function () {
        return db.del("SELECT * FROM type_catelgories");
    },
    delaccount: function (id) {
        return db.del(`delete from account where ?`, id);
    },
}