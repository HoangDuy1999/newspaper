module.exports = function (req, res, next) {
    if (req.session.isAuthenticated) {
        if (req.session.authUser.r_ID != 4) {
                return res.redirect('http://localhost:3000/');
        }
    }    
    next();
}