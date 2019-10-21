const port = 8000
const bodyParser = require('body-parser')
// const fileUpload = require('express-fileupload');
//const config = require('./config');
const mySqlConnection = require('./databaseHelpers/mySqlWrapper')//config
const accessTokenDBHelper = require('./databaseHelpers/accessTokensDBHelper')(mySqlConnection)
const userDBHelper = require('./databaseHelpers/userDBHelper')(mySqlConnection)
const oAuthModel = require('./authorisation/accessTokenModel')(userDBHelper, accessTokenDBHelper)
const authRoutesMethods = require('./authorisation/authRoutesMethods')(userDBHelper)

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const checksession = require('./password')(passport);  // config and inject

const oAuth2Server = require('oauth2-server');

const express = require('express')
const app = express()
const cors = require('cors');

app.oauth = new oAuth2Server({
  model: oAuthModel,
  grants: ['password'],
  debug: true
})

app.use(cors({ credentials: true, origin: '*' }));
// app.use(
//   bodyParser.raw({ type: 'application/x-www-form-urlencoded' }),
//   function (req, res, next) {
//     try {

//       req.body = JSON.parse(req.body)
//     } catch (e) {
//       req.body = require('qs').parse(req.body.toString());
//     }
//     next();
//   }
// );

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('./public'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false, cookie: { maxAge: 60000 } }));

app.use(passport.initialize());
app.use(passport.session());

app.post('/profileupload', authRoutesMethods.upload, authRoutesMethods.updateprofile); // ,

app.post('/registeruser', authRoutesMethods.registerUser, app.oauth.grant());

app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/profile' }));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.post('/oauth/token', app.oauth.grant());

app.get('/profile', (req, res, next) => {
  next();
}, authRoutesMethods.getToken);

app.get('/logout', async function logout(req, res) {
  // add delete query
  req.logout();
  res.json({ success: "you successfully logged out" });
});

// app.post('/enter', app.oauth.authorise(), )

app.post('/emailexist', authRoutesMethods.emailExist); // 

app.post('/invite', authRoutesMethods.invite); // check before one

app.post('/groupcreate', authRoutesMethods.groupCreate); // 

app.post('/groupcreateinvite', authRoutesMethods.groupCreateInvite);

app.put('/groupupdate/:groupid', authRoutesMethods.groupUpdate); // 

app.put('/groupupdateinvite/:groupid', authRoutesMethods.groupUpdateInvite);

app.delete('/deletegroup/:groupid', authRoutesMethods.deletegroup);

app.post('/addtransaction', authRoutesMethods.addTransaction);

app.delete('/deletetransaction/:sameid/:recurring', authRoutesMethods.deleteTransaction);

app.put('/updatetransaction/:id', authRoutesMethods.updateTransaction);

app.put('/splitupdateTransaction/:id', authRoutesMethods.splitupdateTransaction);

app.get('/totalmoneypergroup/:id', authRoutesMethods.totalmoneypergroup);

app.get('/totalMoneyPerUser/:id', authRoutesMethods.totalMoneyPerUser);

app.get('/totalowemoney/:id/:toid', authRoutesMethods.totalowemoneytouser);

app.get('/showTransaction/:fromid/:groupid/:single/:limit', authRoutesMethods.showTransaction);

app.get('/showRecurringTransaction/:fromid/:groupid/:recurring/:limit', authRoutesMethods.showRecurringTransaction);

app.post('/getuserid', authRoutesMethods.getuserid);

app.get('/gettables/:id/:groupid?', authRoutesMethods.gettables);

app.get('/getUserData/:id', authRoutesMethods.getUserData);

app.get('/getgroupinfo/:id', authRoutesMethods.getgroupinfo);

app.get('/getgroupusers/:id', authRoutesMethods.getgroupusers);

app.get('/totalmoneyperusergroup/:fromid/:groupid', authRoutesMethods.totalMoneyPerUserGroup);

app.post('/splitTransaction', authRoutesMethods.splitTransaction);

app.get('/getfriends/:id/:friendid', authRoutesMethods.getfriend);

app.get('/getTransactionSameid/:id/:recurring', authRoutesMethods.getTransactionSameid);

app.post('/changesimplify', authRoutesMethods.changesimplify);

app.post('/changehideothers', authRoutesMethods.changehideothers);

app.post('/changeViewBudget', authRoutesMethods.changeViewBudget);

app.post('/changepassword', authRoutesMethods.changepassword);

app.post('/democron', authRoutesMethods.democron);

app.post('/forgotpassword', authRoutesMethods.forgotpassword);

app.get('/checktoken/:token', authRoutesMethods.checktoken);

app.put('/resetpassword/:token', authRoutesMethods.resetpassword);

app.post('/setsharetoken', authRoutesMethods.setsharetoken);

app.get('/checksharetoken/:groupid/:token', authRoutesMethods.checksharetoken);

app.post('/sendinvite', authRoutesMethods.sendInvite);

app.post('/balancereminder', authRoutesMethods.balanceremider);

app.post('/upload_avatar', authRoutesMethods.upload, (req, res) => {
  console.log('ssss', req.file);
  res.status(200).json({ message: 'Profile updated successfully.', file: req.file });
});

app.get('/activity/:id', authRoutesMethods.recentactivity);


app.get('/search/:id/:searchkey?', authRoutesMethods.search);

app.get('/charts/:id/:type?/:groupid?/:friendid?/:rangedate?', authRoutesMethods.charts);

app.get('/checkStatusPerUserPerGroup/:id/:groupid', authRoutesMethods.checkStatusPerUserPerGroup);

app.post('/setbudget', authRoutesMethods.setbudgetController);


/// mains
app.post('/addmembers', authRoutesMethods.addmembers);

app.get('/getmembers/:id', authRoutesMethods.getmembers);

app.put('/updatemembers', authRoutesMethods.updatemembers);

app.get('/pdf', authRoutesMethods.downloadpdf);

app.all('*', (req, res) => {
  console.log('no no no')
  res.json({ message: "oh snap! no page found." })
});
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
