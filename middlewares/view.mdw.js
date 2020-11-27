const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
//const numeral = require('numeral');

module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        helpers:{
            section: express_handlebars_sections()        
        }
    }))
    app.set('view engine', 'hbs');
}