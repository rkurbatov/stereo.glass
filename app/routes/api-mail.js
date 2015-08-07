module.exports = function (express, mailer) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // posts mail
    Router.post('/', postMail);

    // IMPLEMENTATION

    function postMail(req, res) {

        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var params = req.body.params;
        var mail = params.mail;
        var vars = params.vars;

        if (!mail.to || !mail.subject || !mail.template) {
            console.log('Error in mailing request!');
            return res.sendStatus(400);
        }

        // Setup email data.
        var mailOptions = {
            to: mail.to,
            subject: mail.subject
        };

        mailOptions = _.merge(mailOptions, vars);

        // TODO: template file checking
        mailer.send('mail-templates/' + mail.template, mailOptions, mailerCallback)

        function mailerCallback(err) {
            if (err) {
                console.log('Mailer error! ', err);
                return res.sendStatus(500);
            }
            console.log('Mail is sent to ', mailOptions.to);
            return res.sendStatus(200);
        }
    }

    return Router;
};