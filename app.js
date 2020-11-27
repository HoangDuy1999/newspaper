const express = require('express');
const app = express();
//const port = 3000;
const cookieParser = require('cookie-parser')
app.use(cookieParser())
require('express-async-errors');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public/'));
require('./middlewares/view.mdw')(app);
require('./middlewares/session.mdw')(app);
require('./middlewares/locals.mdw')(app);

app.use('/', require('./routes/home.route'));
app.use('/account', require('./routes/_account.route'));
app.use('/article', require('./routes/article.route'));
app.use('/categories', require('./routes/categories.route'));
app.use('/tags', require('./routes/tag.route'));
app.use('/admin', require('./routes/admin.route'));
app.use('/admin/article', require('./routes/admin/admin_article'));
app.use('/admin/user', require('./routes/admin/admin_users'));
app.use('/admin/tag', require('./routes/admin/admin_tags'));

app.use(function(req, res) {
    res.render('404');
})

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500');
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server start port at http://localhost:3000`);
})