module.exports = function (express, mailer) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // posts mail
    Router.post('/', postMail);

    // IMPLEMENTATION

    function postMail(req, res) {

        if (req.isAuthenticated()) {

            var params = req.body.params;
            var mail = params.mail;
            var vars = params.vars;

            if (!mail.to || !mail.subject || !mail.template) {
                console.log('Error in mailing request!');
                return res.status(400).json({status: 'error', message: 'Error in mailing request!'})
            }

            // Setup email data.
            var mailOptions = {
                to: mail.to,
                subject: mail.subject
            };

            mailOptions = _.merge(mailOptions, vars);

            console.log('email is: ', mailOptions);

            // TODO: template file checking
            mailer.send('mail-templates/' + mail.template, mailOptions, function (err) {
                if (err) {
                    console.log("Mailer error: ", err);
                    return res.status(500).send({status: 'error', message: 'forbidden'});
                } else {
                    return res.status(200).send({status: 'success'});
                }
            })

        } else {
            return res.status(403).send('forbidden');
        }
    }

    return Router;
};