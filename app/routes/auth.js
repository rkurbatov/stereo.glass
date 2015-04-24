module.exports = function (express, passport, Account) {
    'use strict';

    var Router = express.Router();

    //displays our signup page
	Router.get(['/', '/login'], function(req, res){
		if (req.isAuthenticated()) {
			res.redirect('../admin');
		} else {
			res.render('auth');
		}
	});

	Router.get('/register', function(req, res){
		if (req.isAuthenticated()) {
			res.redirect('../admin');
		} else {
			res.render('register');
		}
	});


    //sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
	Router.post('/login', passport.authenticate('local', { 
			successRedirect: '../admin',
			failureRedirect: '/auth'
		})
	);

	//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
	Router.post('/register', function(req, res) {
		Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    		// http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/#.VS7RauQvDVM
    		if (err) {
        		return res.render('register', { account : account });
    		}

    		passport.authenticate('local')(req, res, function () {
      			res.redirect('../admin');
    		});
		});	
	});

	//logs user out of site, deleting them from the session, and returns to homepage
	Router.get('/logout', function(req, res, next){
		if (req.isAuthenticated()) {
			var name = req.user.username
			console.log("LOGGIN OUT " + name)
			req.logout();
			req.session.notice = "You have successfully been logged out " + name + "!";
		}
		res.redirect('/auth');
	});
    return Router;
};
