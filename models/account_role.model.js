const db = require('../utils/db');

const TBL_acc_role = 'role_account';
module.exports = {
    getId: async(name) => {
        const rows = db.load(`select ID from ${TBL_acc_role} where Name=${name}`);
        return rows[0].ID;
    },
    getAll: () => {
        return db.load(`select * from ${TBL_acc_role} `);
    },


}