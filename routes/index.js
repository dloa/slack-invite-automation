var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('/', function(req, res) {
  res.render('index', { community: config.community,
                        tokenRequired: !!config.inviteToken });
});

router.post('/invite', function(req, res) {
  if (config.enabled && req.body.email && (!config.inviteToken || (!!config.inviteToken && req.body.token === config.inviteToken))) {
    request.post({
        url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
        form: {
          email: req.body.email,
          token: config.slacktoken,
          set_active: true
        }
      }, function(err, httpResponse, body) {
        // body looks like:
        //   {"ok":true}
        //       or
        //   {"ok":false,"error":"already_invited"}
        if (err) { return res.send('Error:' + err); }
        body = JSON.parse(body);
        if (body.ok) {
          res.render('result', {
            community: config.community,
            message: 'Success! Check your email.'
          });
          if (config.channel && (config.bottoken || config.slacktoken)) {
            request.post({
              url: 'https://' + config.slackUrl + '/api/chat.postMessage',
              form: {
                text: 'Magics: _' + req.body.email + '_ has just entered the valid token: *' + req.body.token + '*',
                channel: config.channel,
                token: config.bottoken || config.slacktoken,
                as_user: true
              }
            });
          }
        } else {
          var error = body.error;
          if (error === 'already_invited' || error === 'already_in_team') {
            res.render('result', {
              community: config.community,
              message: 'Success! You were already invited.<br>' +
                       'Visit to <a href="https://'+ config.slackUrl +'">'+ config.community +'</a>'
            });
            return;
          } else if (error === 'invalid_email') {
            error = 'The email you entered is an invalid email.';
          } else if (error === 'invalid_auth') {
            error = 'Something has gone wrong. Please contact a system administrator.';
          }

          res.render('result', {
            community: config.community,
            message: 'Failed! ' + error,
            isFailed: true
          });
        }
      });
  } else {
    var errMsg = [];
    if (!req.body.email) {
      errMsg.push('Your email is required');
    }

    if (!!config.inviteToken) {
      if (!req.body.token) {
        errMsg.push('You must enter a valid token');
      }

      if (req.body.token && req.body.token !== config.inviteToken) {
        errMsg.push('The token you entered is incorrect');
      }
    }

    if (!config.enabled) {
      errMsg.push('Registrations are currently closed');
    }

    res.render('result', {
      community: config.community,
      message: 'Failed! ' + errMsg.join(' and ') + '.',
      isFailed: true
    });
  }
});

module.exports = router;
