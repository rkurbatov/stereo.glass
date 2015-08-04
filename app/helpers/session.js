module.exports = {
    persistCookies: function persistCookies(req, res, next) {

        // set usermail cookie to response
        if (req.user) {
            if (req.user.usermail) res.cookie('usermail', req.user.usermail);
            if (req.user.username) res.cookie('username', req.user.username);
            res.cookie('userrole', req.user.role);
        }

        // set locals user variable
        res.locals.user = req.user;
        next();
    },
    persistLocals: function persistLocals(req, res, next) {
        var err = req.session.error,
            msg = req.session.notice,
            success = req.session.success;

        delete req.session.error;
        delete req.session.success;
        delete req.session.notice;

        if (err) res.locals.error = err;
        if (msg) res.locals.notice = msg;
        if (success) res.locals.success = success;

        if (process.env.NODE_ENV === 'development') {
            res.locals.env = 'dev';
        }

        next();
    }
};