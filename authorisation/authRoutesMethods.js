let userDBHelper
const multer = require('multer');
const fs = require('fs');
const email = require('./email');
const handlebars = require('handlebars');
const jsreport = require('jsreport');
let async = require('async');
var schedule = require('node-schedule');
module.exports = injectedUserDBHelper => {
  userDBHelper = injectedUserDBHelper
  return {
    registerUser: registerUser,
    registerGoogle: registerGoogle,
    getToken: getToken,
    getTokenGoogle: getTokenGoogle,
    invite: invite,
    emailExist: emailExist,
    sendInvite: sendInvite,

    groupCreate: groupCreate,
    groupUpdate: groupUpdate,
    groupUpdateInvite: groupUpdateInvite,
    groupCreateInvite: groupCreateInvite,
    deletegroup: deletegroup,

    addTransaction: addTransaction,
    deleteTransaction: deleteTransaction,
    updateTransaction: updateTransaction,
    showTransaction: showTransaction,


    totalmoneypergroup: totalmoneypergroup,
    totalowemoneytouser: totalowemoneytouser,
    totalMoneyPerUserGroup: totalMoneyPerUserGroup,
    totalMoneyPerUser: totalMoneyPerUser,
    recentactivity: recentactivity,

    getuserid: getuserid,
    gettables: gettables,
    getgroupinfo: getgroupinfo,
    getgroupusers: getgroupusers,
    getfriend: getfriend,

    splitTransaction: splitTransaction,
    getTransactionSameid: getTransactionSameid,
    splitupdateTransaction: splitupdateTransaction,

    changesimplify: changesimplify,
    changehideothers: changehideothers,
    changeViewBudget: changeViewBudget,
    changepassword: changepassword,
    democron: democron,
    getUserData: getUserData,
    //login: login
    upload: upload,
    receiptUpload: receiptUpload,
    updateprofile: updateprofile,
    forgotpassword: forgotpassword,
    checktoken: checktoken,
    checksharetoken: checksharetoken,
    resetpassword: resetpassword,
    setsharetoken: setsharetoken,

    showRecurringTransaction: showRecurringTransaction,
    balanceremider: balanceremider,

    search: search,
    checkStatusPerUserPerGroup: checkStatusPerUserPerGroup,
    charts: charts,
    setbudgetController: setbudgetController,

    ///// mainss
    addmembers: addmembers,
    getmembers: getmembers,
    updatemembers: updatemembers,
    downloadpdf: downloadpdf
  }
}
const REDIR = '/home/tirth/form/src/assets/receipts';

const DIR = '/home/tirth/Desktop/web/images/profiles';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file, 'fileee')
    cb(null, DIR)
  },
  filename: (req, file, cb) => {
    let ex = file.originalname.split('.').pop();
    // console.log(ex, 'dsadsads');
    cb(null, file.fieldname + '-' + Date.now() + '.' + ex)
    console.log('ssss');
  }
});
const upload = multer({ storage: storage }).single('file');

const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file, 'fileee')
    cb(null, REDIR)
  },
  filename: (req, file, cb) => {
    let ex = file.originalname.split('.').pop();
    // console.log(ex, 'dsadsads');
    cb(null, file.fieldname + '-' + Date.now() + '.' + ex)
  }
});

function returnDate(Datetime) {
  var newdate = new Date(Datetime);
  var date = '0' + newdate.getDate();
  var month = '0' + newdate.getMonth();
  var year = newdate.getFullYear();
  var formattedTime = year + '-' + month.substr(-2) + '-' + date.substr(-2);
  return formattedTime;
}

const receiptUpload = multer({ storage: receiptStorage }).single('receipts');

async function readHTMLFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
      if (err) {
        reject(err);
      }
      else {
        resolve(html);
      }
    });
  });
};

async function updateprofile(req, res) {
  // console.log(req.file.filename);
  if (req.file.filename) {
    let profiledata = {
      url: '/assets/profiles/' + req.file.filename,
      id: req.body.id
    }
    // console.log(profiledata);
    userDBHelper.updateprofile(profiledata, (datareturn) => {
      res.status(200).json({ message: 'Profile updated successfully.' })
    })
  } else {
    res.status(400).json({ error: 'Error occured in updating profile.' })
  }
}
// async function up(req, res, next) {
//   try {
// console.log('eee');
//     upload(req, res, function (err) {
//       if (err) {
//         // An error occurred when uploading
// console.log(err);
//         throw err;
//       }
//       next();
//     })
//   } catch (error) {
// console.log(error, 'eee');
//   }
// }
async function mail(mailData, replacements) {
  // console.log(mailData, 'dataatatata')
  // console.log(replacements, 'replacements')
  try {
    let html = await readHTMLFile(mailData.path);
    // console.log(html, 'html');
    var template = await handlebars.compile(html);
    // var replacements = {
    //   replace : mailData.createname
    // };
    var htmlToSend = await template(replacements);
    // console.log(html.length, 'length');
    let data = {
      to: mailData.mail,
      subject: mailData.subject,
      html: htmlToSend
    }
    let r = await email.email(data);
    // console.log(r, 'done');
    return ({ message: 'email sent!', data: r });
  } catch (error) {
    // console.log(error);
    return error;
  }
}

// function democron(req, res) {
//   let data = {
//     id: req.body.id,
//     date: req.body.date
//   }
//   userDBHelper.democron(data, (datareturn) => {
//     // console.log(datareturn);
//     res.status(200).json({ data: datareturn });
//   })
// }

async function forgotpassword(req, res) {
  // console.log(req.body);
  try {
    let email = {
      email: req.body.email
    }
    userDBHelper.doesUserExist(email.email, async (sqlError, doesUserExist, userData) => {
      if (doesUserExist && !userData.ispending) {
        // console.log('user exist', doesUserExist);
        let token = Math.random().toString(36).substring(2, 15);
        // console.log(token);
        email.token = token;
        let mailData = {
          mail: email.email,
          url: 'http://192.1.200.64:4200/resetpassword/' + email.token,
          path: '/home/tirth/split6/split/split money/authorisation/resetpassword.html',
          subject: 'Reset Password'
        }
        let replacements = {
          url: mailData.url
        }
        let data = await mail(mailData, replacements);
        // console.log(data, 'email');
        userDBHelper.doesEmailTokenExist(email.email, (doesexist) => {
          if (doesexist) {
            userDBHelper.updatePasswordToken(email, (dataReturn) => {
              // console.log(dataReturn);
              res.status(200).json({ message: 'Reset Password Link sent' })
            });
          } else {
            userDBHelper.addPasswordToken(email, (dataReturn) => {
              // console.log(dataReturn);
              res.status(200).json({ message: 'Reset Password Link sent' })
            });
          }
        })

      }
      else {
        // console.log('user does not exist exist', doesUserExist);
        res.status(400).json({ error: 'Given Email id does not exist' });
      }
    })
  } catch (error) {
    res.status(400).json({ error: error });
  }
}
async function deletegroup(req, res, next) {
  let deletegroupData = {
    groupid: req.params.groupid,
    createdid: req.body.createdid,
    groupname: req.body.groupname,
    action: 3,
    recurringrecent: 1,
    transactionname: null,
    category: null,
    transactionid: null
  }
  // console.log(req.body, deletegroupData, 'sssss')
  try {
    // let recentData = await userDBHelper.recentactivity(deletegroupData);
    // console.log(req.body, deletegroupData, 'delete group');
    userDBHelper.deletegroup(deletegroupData, async (dataReturn) => {
      // console.log(dataReturn);
      message = 'group deleted';
      let recentData = await userDBHelper.recentactivity(deletegroupData);
      // console.log(recentData);
      res.status(200).json({ 'message': message });
    })
  } catch (error) {
    // console.log(error);
    res.status(400).json({ error: error });
  }
}

function suggestSimplifyDebt(changeVariable) {
  let negative = [];
  let positive = [];
  let dataReturns = [];
  let suggestSimplify = [];
  dataReturns = changeVariable.sort(function (a, b) { return a.difference - b.difference; });
  dataReturns.map((object) => {
    if (object.difference > 0) {
      positive.push(object)
    } else if (object.difference < 0) {
      negative.push(object);
    }
  })
  // positive.forEach(function(element) {
  //   negative.forEach(function(element) {

  //   })
  // })(positive, negative, 'mymymyppggg');
  changeVariable = [];
  while (positive.length != 0 && negative.length != 0) {
    // console.log(positive[0],negative[0],'mymymyppggg');
    if (positive[0].difference > Math.abs(negative[0].difference)) {

      changeVariable = {
        toid: positive[0].fromid,
        touser: positive[0].username,
        fromid: negative[0].fromid,
        fromuser: negative[0].username,
        moneySuggest: negative[0].difference * -1,
        groupid: positive[0].groupid,
        groupname: positive[0].groupname,
        profile: positive[0].profile,
        anotherprofile: negative[0].profile
      }
      suggestSimplify.push(changeVariable)
      // console.log(changeVariable, 'posss');
      changeVariable = [];
      positive[0].difference = positive[0].difference + negative[0].difference;
      negative[0].difference = 0;
      positive = positive.sort(function (a, b) { return a.difference - b.difference; });
    }
    else {
      // console.log(positive[0],negative[0],'mymymynnngggg');
      changeVariable = {
        toid: positive[0].fromid,
        touser: positive[0].username,
        fromid: negative[0].fromid,
        fromuser: negative[0].username,
        moneySuggest: positive[0].difference,
        groupid: positive[0].groupid,
        groupname: positive[0].groupname,
        profile: positive[0].profile,
        anotherprofile: negative[0].profile
      }
      suggestSimplify.push(changeVariable);
      // console.log(changeVariable, 'negssss');
      changeVariable = [];
      negative[0].difference = negative[0].difference + positive[0].difference;
      positive[0].difference = 0;

      negative = negative.sort(function (a, b) { return a.difference - b.difference; });
    }
    if (negative[0].difference == 0) {
      negative.splice(0, 1);
    }
    if (positive[0].difference == 0) {
      positive.splice(0, 1);
    }
  }
  // while(positive.length != 0){

  //     changeVariable = {
  //       toid: positive[0].fromid,
  //       touser: positive[0].username,
  //       fromid: negative[0].fromid,
  //       fromuser: negative[0].username,
  //       moneySuggest: negative[0].difference * -1,
  //       groupid: positive[0].groupid,
  //       groupname: positive[0].groupname
  //     }
  //     suggestSimplify.push(changeVariable)
  //     // console.log(changeVariable,'posss');
  //     changeVariable = [];
  //     positive[0].difference = positive[0].difference + negative[0].difference;
  //     negative[0].difference = 0;
  //     positive = positive.sort(function (a, b) { return a.difference - b.difference; });
  // }
  // console.log(dataReturns, suggestSimplify, 'suggestSimplify');
  return suggestSimplify;
}

function addedArray(suggestSimplifyHome) {
  let addArray = [];
  let index;
  suggestSimplifyHome.forEach(element => {
    index = addArray.findIndex(myid => {
      if ((myid.toid == element.toid && myid.fromid == element.fromid) || (myid.toid == element.fromid && myid.fromid == element.toid)) {
        return myid;
      }
    });
    if (index == -1) {
      addArray.push({
        toid: element.toid,
        touser: element.touser,
        fromid: element.fromid,
        fromuser: element.fromuser,
        moneySuggest: element.moneySuggest,
        groupid: element.groupid,
        groupname: element.groupname
      })
    }
    else if ((addArray[index].toid === element.toid) && (addArray[index].fromid === element.fromid)) {
      addArray[index].moneySuggest = addArray[index].moneySuggest + element.moneySuggest;
    }
    else if ((addArray[index].toid === element.fromid) && (addArray[index].fromid === element.toid)) {
      addArray[index].moneySuggest = addArray[index].moneySuggest - element.moneySuggest;
    }
    else {
    }
  });
  addArray.forEach((object) => {
    let toid = 0;
    let touser = '';
    if (object.moneySuggest < 0) {
      // console.log(object,'1111111');
      object.moneySuggest = object.moneySuggest * -1;
      toid = object.toid;
      object.toid = object.fromid;
      object.fromid = toid;

      touser = object.touser;
      object.touser = object.fromuser;
      object.fromuser = touser;
      // console.log(object,'22222222');
    }
  });
  return addArray;
}
//totalMoneyPerUserGroup
function nextBillSuggetions(nextdata) {
  // console.log(nextdata, 'next')
  let nextBillData = nextdata.map(obj => {
    let next = new Date();
    let added = new Date(obj.createtime);
    if (obj.after == 1) {
      next.setDate(1 + next.getDate());
    }
    else if (obj.after == 2) {
      // console.log(next.getDate(), 'b');
      // d.getDate() + (7 - d.getDay()) % 7 + 1
      next.setDate(next.getDate() + (7 - next.getDay()) % 7 + added.getDay());
      // console.log(next.getDate(), 'a');
    }
    else if (obj.after == 3) {
      if (added.getDate() <= next.getDate()) {

        next.setMonth(1 + next.getMonth());
      }
      next.setDate(added.getDate())
    }
    obj.nextDate = next;
    return obj;
  })
  return nextBillData;
}

function totalMoneyPerUserGroup(req, res) {
  let suggestSimplifyHome = [];
  let addArray = [];
  let nextBillData = [];
  let userData = {
    groupid: req.params.groupid,
    fromid: req.params.fromid
  }
  // console.log('fasdfafasafasasdfsdasdsdsd')
  // console.log(userData, 'mymymymy');
  userDBHelper.nextBill(userData.groupid, (returnData) => {
    // console.log(returnData);
    if (returnData.results.length > 0) {
      nextBillData = nextBillSuggetions(returnData.results);
      // console.log('nextBillData');
      // console.log(nextBillData, 'nextBillData')
    }
    else {
      nextBillData = [];
    }
    if (userData.fromid == 0) {  // for shared view link
      userData.simplify = 1;
      // console.log(userData)
      userDBHelper.totalMoneyPerUserGroup(userData, (data) => {
        if (userData.simplify) {
          suggestSimplifyHome = suggestSimplifyDebt(data.data);
          // console.log('1111');
        }
        let message = 'done';
        res.status(200).json({ 'message': message, data: data.data, suggestsimplfy: suggestSimplifyHome, showsimplify: userData.simplify, nextBillData: nextBillData });
        // userDBHelper.nextBill(userData.groupid, (data) => {
        // console.log(data);
        //   nextBillData = nextBillSuggetions(data);
        // console.log('nextBillData');
        // console.log(nextBillData, 'nextBillData')

        // })
      })
    }
    else {
      userDBHelper.getsimplfy(userData, (returnData) => {
        userData.simplify = returnData[0].simplify;
        userDBHelper.totalMoneyPerUserGroup(userData, (data) => {
          // console.log(data, 'dddddd')
          if (userData.simplify) {
            suggestSimplifyHome = suggestSimplifyDebt(data.data);
            // console.log(suggestSimplifyHome, 'ssssuuuuu')
          } else {
            let returnArray = createarray(data.transaction);
            // console.log(returnArray, 'reeeeeee')
            returnArray.forEach(element => {
              let suggestion = suggestSimplifyDebt(element);
              addArray.push(...suggestion);
              suggestion = [];
            });
            // console.log(addArray, 'adddd')
            // toid: positive[0].fromid,
            // fromid: negative[0].fromid,
            // moneySuggest: negative[0].difference * -1,
            // console.log(addArray, 'faaaaaa')
            suggestSimplifyHome = addedArray(addArray);
            // console.log(suggestSimplifyHome, 'addararararara');
          }
          // suggestSimplifyHome = addedArray(addArray);
          // console.log(suggestSimplifyHome, userData.simplify, 'nextBillDataadsdsa');
          userDBHelper.statusLastThirty(userData, (statusData) => {
            // console.log(statusData);
            let statusPaidData = {
              totalPaid: 0,
              totalHaveToPay: 0,
              payment: 0,
              paymentReceived: 0,
              total: 0
            }
            if (statusData.length > 0) {
              statusData.forEach(element => {
                if (element.type == 'Transaction') {
                  statusPaidData.totalPaid = element.paid;
                  statusPaidData.totalHaveToPay = element.havetopay;
                }
                else if (element.type == 'Split') {
                  statusPaidData.payment = element.paid;
                  statusPaidData.paymentReceived = element.havetopay;
                }
                else {
                  // console.log(element, 'element');
                }
              });
            }
            // else{
            //   statusPaidData = {
            //     totalPaid: 0,
            //     totalHaveToPay: 0,
            //     payment: 0,
            //     paymentReceived: 0,
            //     total: 0
            //   }
            // }
            statusPaidData.total = (statusPaidData.totalPaid + statusPaidData.payment) - (statusPaidData.totalHaveToPay + statusPaidData.paymentReceived);
            // console.log(statusPaidData, 'statusPaidData');
            let message = 'done';
            res.status(200).json({ 'message': message, data: data.data, suggestsimplfy: suggestSimplifyHome, showsimplify: userData.simplify, nextBillData: nextBillData, statusPaidData: statusPaidData });
          })
        })
      })
    }
  })
}
async function democron() {
  // console.log('in demo');
  var date;
  var createddate;
  var i = 0;
  var day = 0;
  var rule = new schedule.RecurrenceRule();
  rule.hour = 13;
  rule.minute = 34;

  try {
    var j = schedule.scheduleJob(rule, async function (y) {
      try {
        var query = `SELECT * FROM multiplesingle;`;
        var datareturn = await userDBHelper.promisedData(query);
        // console.log('1');
        // for (var object in datareturn) {
        async.eachSeries(datareturn, async function (object) {
          try {
            date = object.after;
            // console.log('2');
            createddate = new Date(object.createtime);
            var next = new Date();

            if (date == 1) {
              i = 1;
              // console.log('daily');
            } else if (date == 2) {
              day = createddate.getDay();
              if (day == next.getDay()) {
                i = 1;
                // console.log('weekly')
              }
            } else if (date == 3) {
              day = createddate.getDate();

              if (day == next.getDate()) {
                i = 1;
                // console.log('monthly')
              }
            } else {
              i = 0;
            }
            if (i) {
              // console.log('3');
              if (object.type == 'Transaction') {
                // console.log('transaction');
                // i = 0;
                // var addTransactionSingle = {
                //   groupid: object.groupId,
                //   money: object.money,
                //   name: object.name,
                //   type: object.type,
                //   issingle: object.issingle,
                //   isequally: object.isequally,
                //   receipt: object.receipt,
                //   groupmember: object.groupmember
                // }
                // // console.log('4');
                // var singleData = await userDBHelper.multiasyncaddtransactionid(addTransactionSingle);
                // // console.log('5');
                // var dataReturns = await userDBHelper.getMultipleasyncTransaction(object.id);
                // // console.log('6');
                // // console.log(singleData, 'singleData');
                // var addTransactionMoney = [];
                // for (var objects in dataReturns) {
                //   addTransactionMoney.push()
                // }
                // addTransactionMoney = dataReturns.map(objects => {
                //   return {
                //     groupid: objects.groupid,
                //     sameid: singleData.sameid,
                //     fromid: objects.fromid,
                //     share: objects.share,
                //     percentage: objects.percentage,
                //     moneyhavetopay: objects.moneyhavetopay,
                //     moneypaid: objects.moneypaid,
                //     type: objects.type
                //   }
                // })
                // // console.log(addTransactionMoney, '7');
                // var dataResponseObject = await userDBHelper.multiasyncaddTransaction(addTransactionMoney);
                // // console.log('8');
              }
              else {
                // console.log('Split');
                let checkSplit = 1;
                if (object.date) {
                  let payTillDate = new Date(object.date);
                  let nowDate = new Date();
                  if (payTillDate.getDate() >= nowDate.getDate()) {
                    checkSplit = 1;
                  }
                  else {
                    checkSplit = 0;
                  }
                }
                if (checkSplit && object.tillUserId) {

                }
              }
              // console.log(object.type);
            }
          } catch (error) {
            // console.log(error);
            // console.log('errorr, 1');
          }
        })
      } catch (error) {
        //  console.log('errorr, 12');
      }

    }.bind(null));
  } catch (error) {
    // console.log(error, 'eoeoeoeoeoeo')
    // console.log('errorr, 3');
  }
}
democron();

async function splitTransaction(req, res) {
  let splitdataArray = [];
  let splitData = {
    fromid: req.body.form.paidby,
    toid: req.body.form.paidto,
    split: req.body.form.split,
    groupid: req.body.groupid,
    type: 'Split',
    issingle: 1,
    isequally: 1,
    repeat: req.body.form.repeatControl,
    current: req.body.current,
    createdid: req.body.createdid,
    transactionname: 'Payment',
    recurringrecent: 1,
    groupname: req.body.groupname,
    category: 9
  }
  try {
    userDBHelper.splitTransaction(splitData, async (dataReturn) => {
      splitData.transactionid = dataReturn;
      let recentData = await userDBHelper.recentactivity(splitData);
      // console.log(recentData);
      if (splitData.repeat && splitData.repeat != 4) {
        if (req.body.form.date) {
          splitData.date = new Date(new Date(req.body.form.date).setDate(new Date(req.body.form.date).getDate() + 1)).toJSON();
        }
        else {
          splitData.date = null;
        }
        if (parseInt(req.body.form.repeatpayto)) {
          splitData.repeatId = req.body.form.paidto,
            splitData.paidbyUserId = req.body.form.paidby
        }
        else {
          splitData.repeatId = null;
          splitData.paidbyUserId = null;
        }
        // console.log(splitData,'ssslast');
        userDBHelper.multisplitTransaction(splitData, (dataid) => {
          splitdataArray.push({
            fromid: splitData.fromid,
            groupid: splitData.groupid,
            moneypaid: splitData.split,
            moneyhavetopay: 0,
            type: 'Split',
            sameid: dataid.id
          }, {
            fromid: splitData.toid,
            groupid: splitData.groupid,
            moneypaid: 0,
            moneyhavetopay: splitData.split,
            type: 'Split',
            sameid: dataid.id
          })
          splitData.transactionid = dataid.id;
          splitData.recurringrecent = 3;

          // console.log(splitdataArray, 'finalaaa in multiii');
          userDBHelper.multisplitTransactionid(splitdataArray, async (data) => {
            let recentData = await userDBHelper.recentactivity(splitData);
            // console.log(recentData);
            if (data.error === null) {
              let message = "Transcation added successfully";
              res.status(200).json({ 'message': message });
            } else {
              let message = "Failed to create the group.Please try again!";
              res.status(400).json({ 'message': message, 'error': data.error });
            }
          })
        })
      }
      else {
        let message = 'done';
        res.status(200).json({ 'message': message, data: dataReturn });
      }
    })
  } catch (error) {
    // console.log(error);
    res.status(400).json({ 'error': error });
  }

}
async function sendInvite(req, res) {
  try {
    // console.log(req.body);
    let inviteData = {
      email: req.body.email
    }
    userDBHelper.doesUserExist(inviteData.email, async (sqlError, doesUserExist, userData) => {
      // console.log(userData, 'pend')
      if (!userData.ispending) {
        res.status(200).json({ message: 'user exist', userexist: true })
      }
      else {
        let mailData = {
          mail: inviteData.email,
          path: '/home/tirth/split6/split/split money/authorisation/invite.html',
          subject: 'Invite to join SPLIT MONEY'
        }
        let replacements = {};
        // console.log(mailData, replacements);
        let sendMail = await mail(mailData, replacements);
        // console.log(sendMail);
        res.status(200).json({ message: 'email sent', userexist: false })
      }
    })
  } catch (error) {
    res.status(400).json({ error: error });
  }

}
//mix registerUser and register google

function registerUser(req, res, next) {

  // console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);
  let registerData = {
    username: req.body.email,
    email: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    profileType: 'password',
    profileId: 'null'
  }
  // console.log(registerData)
  userDBHelper.doesUserExist(registerData.email, (sqlError, doesUserExist, userData) => {
    // console.log(userData, 'pend')
    if (userData.ispending) {
      if (!doesUserExist) {
        registerData.doesUserExist = 0;
      }
      else {
        registerData.doesUserExist = 1;
      }
      // console.log(userData, registerData, 'pend2');
      userDBHelper.registerUserInDB(registerData, (dataResponseObject, userData) => {
        const message = dataResponseObject ? "Registration was successful" : "Failed to register user"
        if (dataResponseObject) {
          // console.log(message, "in resgister user");
          // console.log(registerData.email, 'koooooooooooooooooook')
          userDBHelper.doesinviteExist(registerData.email, (returnData) => {
            // console.log('slnkdfffffffffffffff');
            next();
          })
        } else {
          res.status(400).json({ 'message': message, 'error': dataResponseObject.error });
        }
      })
    }
    else {
      const message = "User already exists. Please change the Email id"
      const error = sqlError !== null ? sqlError : "User already exists."
      // console.log(error, 'rrrr');
      res.status(sqlError !== null ? 400 : 200).json({ 'message': message, 'error': error, })
    }
  })
}

function registerGoogle(googleId, callback) {
  // console.log(`authRoutesMethods: registerUser: req.body is:`, googleId);
  userDBHelper.doesUserExist(googleId.email, (sqlError, doesUserExist, userData) => {
    if (doesUserExist) {
      const message = "User already exists"
      callback(userData);
    }
    userDBHelper.registerUserInDB(googleId, (dataResponseObject, userData) => {
      if (dataResponseObject.error === null) {
        callback(userData);
      } else {
        const message = "Failed to register user";
        res.status(400).json({ 'message': message, 'error': dataResponseObject.error });
      }
    })
  })
}

function getToken(req, res) {
  // console.log(req.user.id);
  let id = req.user.id;
  userDBHelper.getToken(id, (data) => {
    // console.log(data.results[0].access_token), "in getToken";
    res.status(200).json({ access_token: data.results[0].access_token });
  })
}

function invite(req, res) {
  let inviteData = {
    email: req.body.email,
    groupId: req.body.groupId
  }

  if (typeof inviteData.groupId == 'undefined') {
    inviteData.groupId = null;
  }
  else {
    // console.log('in not null');
  }
  // console.log(inviteData, 'mmkkllnkmj');
  userDBHelper.invite(inviteData, (data) => {
    if (data.error === null) {
      let message = "Invite sent";
      res.status(200).json({ 'message': message });
    } else {
      let message = "Failed to send the invite";
      //sendResponse(res, message, data.error)
      res.status(400).json({ 'message': message, 'error': data.error });
    }
  })
}

async function groupCreate(req, res) {
  let groupData = {
    groupName: req.body.groupname,
    invites: req.body.invites,
    createdemail: req.body.id,
    createdid: req.body.createdid,
    action: 4,
    recurringrecent: 1,
    transactionname: null,
    category: null,
    transactionid: null,
    groupname: req.body.groupname
  }
  sendback = false;
  let dataemail = [];
  let existEmails = [];
  // console.log('In create group');
  // console.log(groupData.invites, 'dkdkdl');
  // groupData.invites.forEach(currentValue)
  try {
    if (groupData.invites.length >= 1) {
      for (let iter = 0; iter < groupData.invites.length; iter++) {
        userDBHelper.doesUserExist(groupData.invites[iter], (sqlError, doesUserExist, userData) => {
          let emails = {
            email: groupData.invites[iter],
            doesExist: doesUserExist
          }
          dataemail.push(emails);
          // console.log(emails, 'emailsss create');
          // console.log(dataemail, 'in invite permis');
          // console.log(doesUserExist, 'usersss');
          if (!doesUserExist) {
            sendback = true;
            // console.log(sendback, 'kkkk');
          }
          if (iter == groupData.invites.length - 1) {
            if (sendback) {
              res.status(200).json({ data: dataemail, askpermission: true });
            }
            else {
              // console.log('In elseee');
              userDBHelper.addUserGroup(groupData, async (returnData, groupid) => {
                groupData.groupid = groupid;
                let groupDatas = await userDBHelper.recentactivity(groupData);
                // console.log(groupDatas, 'ggggaddUSer');
                res.status(200).json({ message: 'user added in group', askpermission: false, groupid: groupid });
              })
            }
          }
        })
      }
    }
    else {
      userDBHelper.groupCreateagain(groupData, async (data, groupid) => {
        groupData.groupid = groupid;
        // console.log('groupCreateagaingroupCreateagain');
        let groupDatas = await userDBHelper.recentactivity(groupData);
        // console.log(groupDatas, 'ggggcreateagain');
        if (data.error === null) {
          res.status(200).json({ 'message': 'group created', groupid: groupid });
        } else {
          res.status(400).json({ 'message': 'Failed to create the group.Please try again!', 'error': data.error });
        }
      })
    }
  } catch (error) {

  }

}

async function addTransaction(req, res) {
  let final;
  let transactionData = {
    name: req.body.form.name,
    money: req.body.form.spent,
    members: req.body.form.members,
    category: req.body.form.category,
    groupid: req.body.groupid,
    issingle: req.body.issingle,
    isequally: req.body.isequally,
    type: 'Transaction',
    repeat: req.body.form.repeatControl,
    percentage: req.body.form.percentage,
    share: req.body.form.share,
    splitmoney: req.body.splitMoney,
    createdid: req.body.createdid,
    action: 1,
    recurringrecent: 1,
    transactionname: req.body.form.name,
    groupname: req.body.groupname
  }
  //console.log(req.files);
  // console.log(req.file, req.files, 'body');
  // if (req.body.uploadDatas) {
  // console.log(req.body.uploadDatas, 'dasdsappppp');
  //   transactionData.uploadData = req.body.uploadDatas
  //   let returns = receiptUpload(req, res, next);
  //   transaction.receipt = '/assets/receipts/' + req.file.filename;
  // }
  if (req.file) {
    // console.log(req.file.filename, 'filesss');
  }
  // console.log(req.body.splitMoney, 'rewrew');
  // console.log(transactionData)
  try {
    userDBHelper.addtransactionid(transactionData, (data) => {
      transactionData.createtime = data.createtime;
      transactionData.transactionid = data.sameid;
      if (transactionData.issingle) {
        transactionData.paidby = req.body.form.paidControl;
        // console.log('single');
        let money;
        let iter = 0;
        final = transactionData.members.map((object) => {
          if (transactionData.paidby == object.userid) {
            money = transactionData.money
          }
          else {
            money = 0
          }
          obj = {
            groupid: transactionData.groupid,
            fromid: object.userid,
            moneypaid: money,
            moneyhavetopay: transactionData.splitmoney[iter],
            share: transactionData.share[iter],
            percentage: transactionData.percentage[iter++],
            type: transactionData.type,
            sameid: data.sameid
          }
          return obj;
        })
      } else {
        transactionData.multi = req.body.form.multi;
        // console.log('multi');
        let iter = 0;
        final = transactionData.members.map((object) => {
          obj = {
            groupid: transactionData.groupid,
            fromid: object.userid,
            moneypaid: transactionData.multi[iter],
            moneyhavetopay: transactionData.splitmoney[iter],
            share: transactionData.share[iter],
            percentage: transactionData.percentage[iter++],
            type: transactionData.type,
            sameid: data.sameid
          }
          return obj;
        })
      }
      // console.log(transactionData);
      // console.log(final, 'finbal');
      userDBHelper.addTransaction(final, async (data) => {
        if (transactionData.repeat) {
          let recentData = await userDBHelper.recentactivity(transactionData);
          // console.log(recentData);
          userDBHelper.multiaddtransactionid(transactionData, (lastdata) => {
            for (let i = 0; i < final.length; i++) {
              final[i].sameid = lastdata.sameid;
            }
            transactionData.transactionid = lastdata.sameid;
            transactionData.recurringrecent = 3;
            // console.log(final, 'finalaaa in multiii');

            userDBHelper.multiaddTransaction(final, async (data) => {
              let recentData = await userDBHelper.recentactivity(transactionData);
              // console.log(recentData);
              if (data.error === null) {
                let message = "Transcation added successfully";
                res.status(200).json({ 'message': message });
              } else {
                let message = "Failed to create the group.Please try again!";
                res.status(400).json({ 'message': message, 'error': data.error });
              }
            })
          })
        }
        else {
          if (data.error === null) {
            let message = "Transcation added successfully";
            res.status(200).json({ 'message': message });
          } else {
            let message = "Failed to add the transaction.Please try again!";
            res.status(400).json({ 'message': message, 'error': data.error });
          }
        }
      })
    })
  } catch (error) {
    // console.log(error);
    res.status(400).json({ 'error': error });
  }
}

async function showTransaction(req, res) {
  let showData = {
    fromid: req.params.fromid,
    groupid: req.params.groupid,
    single: parseInt(req.params.single),
    limit: parseInt(req.params.limit)
  }
  // console.log(showData, 'all');
  // let updateGroupVisitTime = await userDBHelper.updateUserGroupTable(showData);
  // console.log(updateGroupVisitTime);
  userDBHelper.getTransactionSingles(showData, (returnData) => {
    // console.log(returnData.length, showData.single);
    if (returnData) {
      userDBHelper.showTransaction(showData, (data) => {
        // console.log(data.all.length, showData.single, 'singll');
        if (showData.fromid != 0) {
          userDBHelper.getUserData(showData.fromid, hide => {
            // console.log(hide, 'hide');
            if (data) {
              let message = "show data fetched";
              // console.log(message, data, returnData, hide.onlyme);
              res.status(200).json({ 'message': message, data: data, singles: returnData, hide: hide.onlyme });
            } else {
              let message = "Failed retrive transaction data";
              res.status(400).json({ 'message': message, 'error': data.error });
            }
          })
        }
        else {
          if (data) {
            let message = "show data fetched";
            // console.log(message, data, returnData);
            res.status(200).json({ 'message': message, data: data, singles: returnData, hide: true });
          } else {
            let message = "Failed retrive transaction data";
            res.status(400).json({ 'message': message, 'error': data.error });
          }
        }
      })
    }
  })
}

function showRecurringTransaction(req, res) {
  let showData = {
    fromid: req.params.fromid,
    groupid: req.params.groupid,
    recurring: parseInt(req.params.recurring),
    limit: parseInt(req.params.limit)
  }
  // console.log(showData, 'all recurringggg');
  userDBHelper.getRecurringTransactionSingles(showData, (returnData) => {
    // console.log(returnData, 'reeeee sssss');
    if (returnData) {
      userDBHelper.showRecurringTransaction(showData, (data) => {
        // console.log(data, 'mmmm rrrrr');
        if (data) {
          let message = "show data fetched";
          res.status(200).json({ 'message': message, data: data, singles: returnData });
        } else {
          let message = "Failed retrive transaction data";
          res.status(400).json({ 'message': message, 'error': data.error });
        }
      })
    }
  })
}
function createarray(data) {
  let dataArray = [];
  let dataArrayreturn = [];
  let iter = 0;
  let sameid = -1;
  data.forEach((object) => {
    // console.log(object.);
    if (object.id) {
      // console.log(object, 'dsasdasda');
      if (sameid == -1) {
        dataArray.push(object)
        sameid = object.sameid;
      } else if (sameid == object.sameid) {
        dataArray.push(object)
      } else {
        iter++;
        dataArrayreturn.push(dataArray);
        dataArray = [];
        dataArray.push(object)
        sameid = object.sameid;
        // console.log(dataArray, sameid, 'jjjjj');
      }
    }
  })
  // console.log(dataArrayreturn, 'aaaa');
  dataArrayreturn.push(dataArray);
  return dataArrayreturn;
}
function totalmoneypergroup(req, res) {
  // console.log('dddd');
  // console.log(req.body, 'dddd');
  let oweData = {
    id: req.params.id
  }
  // console.log(oweData)
  userDBHelper.totalmoneypergroup(oweData, (data) => {
    // console.log(data, 'dadadadadada');
    if (data) {
      let message = "Total money succesfully calculated!";
      res.status(200).json({ data: data });
    }
  })
}
async function changesimplify(req, res) {
  // console.log(req.body, 'datatatatataa');
  let simplifyData = {
    createdid: req.body.userid,
    isSimplify: req.body.isSimplify,
    action: req.body.isSimplify + 6,
    recurringrecent: 1,
    transactionname: null,
    category: null,
    transactionid: null,
    groupid: null,
    groupname: null
  }
  // console.log(simplifyData)
  try {
    userDBHelper.changesimplify(simplifyData, async (data) => {
      // console.log(data, 'dadadadadada');
      if (data) {
        // let rr = await userDBHelper.check();
        let recentData = await userDBHelper.recentactivity(simplifyData);
        // console.log(recentData);
        let message = "Succesfully changed!";
        res.status(200).json({ data: data });
      } else {
        let message = "Failed to change!";
        res.status(400).json({ 'message': message, 'error': data.error });
      }
    })
  } catch (error) {

  }
}

function changehideothers(req, res) {
  // console.log(req.body, 'datatatatataa');
  let hideothersData = {
    userid: req.body.userid,
    ishideothers: req.body.ishideothers
  }
  // console.log(hideothersData)
  userDBHelper.changehideothers(hideothersData, (data) => {
    // console.log(data, 'dadadadadada');
    if (data) {
      let message = "Succesfully changed!";
      res.status(200).json({ data: data });
    } else {
      let message = "Failed to change!";
      res.status(400).json({ 'message': message, 'error': data.error });
    }
  })
}
async function changeViewBudget(req, res) {
  // console.log(req.body, 'datatatatataa');
  let viewBudgetData = {
    userid: req.body.userid,
    isViewBudget: req.body.isViewBudget
  }
  // console.log(viewBudgetData)
  try {
    let viewBudget = await userDBHelper.changeViewBudget(viewBudgetData);
    console.log(viewBudget);
    res.status(200).json({ message: "Successfully changed" });
  } catch (error) {
    console.log(error, 'errrr')
    res.status(400).json({ message: 'Something went wrong' });
  }
}
async function changepassword(req, res) {
  // console.log(req.body, 'datatatatataa');
  let passwordData = {
    createdid: req.body.id,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
    currentpassword: req.body.currentpassword,
    action: 5,
    recurringrecent: 1,
    transactionname: null,
    category: null,
    transactionid: null,
    groupid: null,
    groupname: null
  }
  // console.log(passwordData)
  try {
    userDBHelper.changepassword(passwordData, async (data) => {
      // console.log(data, 'dadadadadada');
      if (data) {
        let recentData = await userDBHelper.recentactivity(passwordData);
        // console.log(recentData);
        res.status(200).json({ data: data.changed });
      } else {
        let message = "Failed to change!";
        res.status(400).json({ 'message': message, 'error': data.error });
      }
    })
  } catch (error) {

  }
}

function homeBalanceMoney(suggestSimplifyHome, oweData) {
  let data = [];
  let index;
  let indexgroup;
  //console.log(suggestSimplifyHome,'mymym')
  suggestSimplifyHome.forEach(element => {
    if (element.toid == oweData.id) {
      // console.log(element,'toid');
      index = data.findIndex(myid => myid.id == element.fromid);
      if (index != -1) {
        data[index].money = data[index].money + element.moneySuggest;
        indexgroup = data[index].suggestarray.findIndex(obj => obj.groupid == element.groupid)
        if (indexgroup != -1) {
          data[index].suggestarray[indexgroup].money = data[index].suggestarray[indexgroup].money + element.moneySuggest;
        }
        else {
          data[index].suggestarray.push({
            toid: element.toid,
            touser: element.touser,
            fromid: element.fromid,
            fromuser: element.fromuser,
            money: element.moneySuggest,
            group: element.groupname,
            groupid: element.groupid
          })
        }

      }
      else {
        data.push({
          id: element.fromid,
          username: element.fromuser,
          money: element.moneySuggest,
          profile: element.anotherprofile,
          suggestarray: [
            {
              toid: element.toid,
              touser: element.touser,
              fromid: element.fromid,
              fromuser: element.fromuser,
              money: element.moneySuggest,
              group: element.groupname,
              groupid: element.groupid
            }
          ]
        })
      }
    } else if (element.fromid == oweData.id) {
      // console.log(element,'fromid');
      index = data.findIndex(myid => myid.id == element.toid);
      if (index != -1) {
        indexgroup = data[index].suggestarray.findIndex(obj => obj.groupid == element.groupid)
        if (indexgroup != -1) {
          data[index].suggestarray[indexgroup].money = data[index].suggestarray[indexgroup].money - element.moneySuggest;
        }
        else {
          data[index].suggestarray.push({
            toid: element.toid,
            touser: element.touser,
            fromid: element.fromid,
            fromuser: element.fromuser,
            money: - element.moneySuggest,
            group: element.groupname,
            groupid: element.groupid
          })
        }
        data[index].money = data[index].money - element.moneySuggest;
        // console.log(data[index].money);
      } else {
        data.push({
          id: element.toid,
          username: element.touser,
          money: element.moneySuggest * -1,
          profile: element.profile,
          suggestarray: [
            {
              toid: element.toid,
              touser: element.touser,
              fromid: element.fromid,
              fromuser: element.fromuser,
              money: - element.moneySuggest,
              group: element.groupname,
              groupid: element.groupid
            }
          ]
        })
      }
    }
  });
  // console.log(data, 'datatata')
  return data;
}

// function homeBalanceMoney(suggestSimplifyHome, oweData) {
//   let data = [];
//   let index;
//   //console.log(suggestSimplifyHome,'mymym')
//   suggestSimplifyHome.forEach(element => {
//     if (element.toid == oweData.id) {
//       // console.log(element,'toid');
//       index = data.findIndex(myid => myid.id == element.fromid);
//       if (index != -1) {
//         data[index].money = data[index].money + element.moneySuggest;
//         data[index].suggestarray.push({
//           toid: element.toid,
//           touser: element.touser,
//           fromid: element.fromid,
//           fromuser: element.fromuser,
//           money: element.moneySuggest,
//           group: element.groupname,
//           groupid: element.groupid
//         })
//       }
//       else {
//         data.push({
//           id: element.fromid,
//           username: element.fromuser,
//           money: element.moneySuggest,
//           profile: element.anotherprofile,
//           suggestarray: [
//             {
//               toid: element.toid,
//               touser: element.touser,
//               fromid: element.fromid,
//               fromuser: element.fromuser,
//               money: element.moneySuggest,
//               group: element.groupname,
//               groupid: element.groupid
//             }
//           ]
//         })
//       }
//     } else if (element.fromid == oweData.id) {
//       // console.log(element,'fromid');
//       index = data.findIndex(myid => myid.id == element.toid);
//       if (index != -1) {
//         data[index].money = data[index].money - element.moneySuggest;
//         data[index].suggestarray.push({
//           toid: element.toid,
//           touser: element.touser,
//           fromid: element.fromid,
//           fromuser: element.fromuser,
//           money: element.moneySuggest,
//           group: element.groupname,
//           groupid: element.groupid
//         })
//       } else {
//         data.push({
//           id: element.toid,
//           username: element.touser,
//           money: element.moneySuggest * -1,
//           profile: element.profile,
//           suggestarray: [
//             {
//               toid: element.toid,
//               touser: element.touser,
//               fromid: element.fromid,
//               fromuser: element.fromuser,
//               money: element.moneySuggest,
//               group: element.groupname,
//               groupid: element.groupid
//             }
//           ]
//         })
// console.log(data, 'data');
// console.log(element, 'element');
//       }
//     }
//   });
// console.log(data, 'datatata')
//   return data;
// }

async function totalMoneyPerUser(req, res) {
  let oweData = {
    id: req.params.id
  }
  let budget;
  // console.log(oweData)
  userDBHelper.totalMoneyPerUser(oweData, async (data) => {
    // console.log(data, 'dadadadadada');
    let budgetData = await userDBHelper.getBudget(oweData.id);
    // console.log(budgetData, 'tiriiiii')
    if (budgetData.setbudget && budgetData.budget) {
      lastbudget = await userDBHelper.statusLastThirtyHome(oweData.id);
      budget = {
        budgetData: budgetData,
        lastbudget: lastbudget
      }
    }
    else {
      budget = {
        budgetData: budgetData,
        lastbudget: null
      }
    }
    if (data != 0) {
      let suggestSimplifyHome = [];
      let returnArray = createarray(data);
      // console.log(returnArray, 'returnnnnaarray');
      returnArray.forEach(element => {
        let suggestion = suggestSimplifyDebt(element);
        //console.log(element, suggestion,'checkckckckc');
        suggestSimplifyHome.push(...suggestion);
        suggestion = [];
      });
      // console.log(suggestSimplifyHome, 'laalalalal');
      let returnData = homeBalanceMoney(suggestSimplifyHome, oweData);
      //console.log(returnData, 'gandoooo')
      res.status(200).json({ data: returnData, budget: budget, message: 'done' });
    } else {
      res.status(200).json({ data: data, budget: budget });
    }
  })
}

function totalowemoneytouser(req, res) {
  // console.log('dddd');
  // console.log(req.body, 'dddd');
  let oweData = {
    id: req.params.id,
    toid: req.params.toid,
  }
  // console.log(oweData);
  userDBHelper.totalowemoneytouser(oweData, (data) => {
    // console.log(data);
    if (data) {
      let message = "Total money ";
      res.status(200).json({ 'message': message, money: data });
    } else {
      let message = "Failed to calculate the owed money!";
      res.status(400).json({ 'message': message, 'error': data.error });
    }
  })
}

function updateTransaction(req, res) {
  let final;
  let transactionData = {
    name: req.body.form.name,
    money: req.body.form.spent,
    members: req.body.form.members,
    category: req.body.form.category,
    groupid: req.body.groupid,
    issingle: req.body.issingle,
    isequally: req.body.isequally,
    type: 'Transaction',
    percentage: req.body.form.percentage,
    share: req.body.form.share,
    splitmoney: req.body.splitMoney,
    createdid: req.body.createdid,
    sameid: req.body.sameid,
    recurring: req.body.recurring,
    action: 2,
    recurringrecent: 1,
    transactionname: req.body.form.name,
    transactionid: req.body.sameid,
    groupname: req.body.groupname
  }
  // console.log(req.files);
  // console.log(req.body, 'body');
  // if (req.body.form.receipt) {
  //   // console.log('dasdsappppp');
  //   transactionData.uploadData = req.body.form.uploadDatas
  //   let returns = call(req, res);
  // }
  try {
    if (parseInt(transactionData.recurring)) {
      transactionData.repeat = req.body.form.repeatControl
    }
    // console.log(req.body.splitMoney, 'rewrew');
    // console.log(transactionData)
    userDBHelper.updateTransactionid(transactionData, (data) => {
      if (transactionData.issingle) {
        transactionData.paidby = req.body.form.paidControl;
        // console.log('single');
        let money;
        let iter = 0;
        final = transactionData.members.map((object) => {
          if (transactionData.paidby == object.userid) {
            money = transactionData.money
          }
          else {
            money = 0
          }
          obj = {
            groupid: transactionData.groupid,
            fromid: object.userid,
            moneypaid: money,
            moneyhavetopay: transactionData.splitmoney[iter],
            share: transactionData.share[iter],
            percentage: transactionData.percentage[iter++],
            type: transactionData.type,
            sameid: transactionData.sameid
          }
          return obj;
        })
      } else {
        transactionData.multi = req.body.form.multi;
        // console.log('multi');
        let iter = 0;
        final = transactionData.members.map((object) => {
          obj = {
            groupid: transactionData.groupid,
            fromid: object.userid,
            moneypaid: transactionData.multi[iter],
            moneyhavetopay: transactionData.splitmoney[iter],
            share: transactionData.share[iter],
            percentage: transactionData.percentage[iter++],
            type: transactionData.type,
            sameid: transactionData.sameid
          }
          return obj;
        })
      }
      // console.log(transactionData);
      // console.log(final, 'finbal');
      userDBHelper.updateTransaction(final, transactionData.recurring, async (data) => {
        // console.log(final, 'finalaaa in multiii');
        if (data.error === null) {
          let recentData = await userDBHelper.recentactivity(transactionData);
          // console.log(recentData);
          let message = "Transcation Updated successfully";
          res.status(200).json({ 'message': message });
        } else {
          let message = "Failed to update the transaction.Please try again!";
          res.status(400).json({ 'message': message, 'error': data.error });
        }
      })
    })
  } catch (error) {

  }

}

async function splitupdateTransaction(req, res) {
  let splitData = {
    fromid: req.body.form.paidby,
    toid: req.body.form.paidto,
    split: req.body.form.split,
    groupid: req.body.groupid,
    type: 'Split',
    issingle: 1,
    isequally: 1,
    id: req.body.id,
    recurring: req.body.recurring,
    repeat: req.body.form.repeatControl,
    createdid: req.body.createdid,
    action: 2,
    recurringrecent: 1,
    transactionname: 'Payment',
    transactionid: req.body.id,
    groupname: req.body.groupname,
    category: 9
  }
  try {
    // console.log(splitData, req.body, 'daskdsakd');
    if (splitData.repeat && splitData.repeat != 4) {
      if (req.body.form.date) {
        splitData.date = new Date(new Date(req.body.form.date).setDate(new Date(req.body.form.date).getDate() + 1)).toJSON();
      }
      else {
        splitData.date = null;
      }
      if (parseInt(req.body.form.repeatpayto)) {
        splitData.repeatId = req.body.form.paidto,
          splitData.paidbyUserId = req.body.form.paidby
      }
      else {
        splitData.repeatId = null;
        splitData.paidbyUserId = null;
      }
    }
    // console.log(splitData, 'ssss');
    userDBHelper.splitupdateTransaction(splitData, async (dataReturn) => {
      let recentData = await userDBHelper.recentactivity(splitData);
      // console.log(recentData);
      let message = 'Transaction Updated';
      res.status(200).json({ 'message': message, data: dataReturn });
    })
  } catch (error) {

  }

}

async function deleteTransaction(req, res) {
  let transactionData = {
    sameid: req.params.sameid,
    recurring: req.params.recurring,
    createdid: req.body.createdid,
    groupname: req.body.groupname,
    action: 3,
    recurringrecent: 1,
    transactionname: null,
    category: null,
    transactionid: req.params.sameid
  }
  // console.log(transactionData);
  try {
    let deletedData = await userDBHelper.gettransactionname(transactionData);
    transactionData.transactionname = deletedData.name;
    transactionData.category = deletedData.category;
    transactionData.groupid = deletedData.groupid;
    // console.log(transactionData, 'lll');
    userDBHelper.deleteTransaction(transactionData, async (data) => {
      let recentData = await userDBHelper.recentactivity(transactionData);
      // console.log(recentData, 'rrr');
      if (data.error === null) {
        let message = "Transaction deleted successfully";
        res.status(200).json({ 'message': message });
      } else {
        let message = "Failed to delete the transaction.Please try again!";
        res.status(400).json({ 'message': message, 'error': data.error });
      }
    })
  } catch (error) {
    // console.log(error, 'error');
  }

}

function getTokenGoogle(req, res, next) {
  // console.log(req.user.id);
  let id = req.user.id;
  userDBHelper.getToken(id, (data) => {
    // console.log(data.results[0].access_token), "in getToken";
    // res.status(200).json({ access_token: data.results[0].access_token });
    next(data.results[0].access_token);
  })
}

function emailExist(req, res) {
  // console.log(req.body.data);
  userDBHelper.doesUserExist(req.body.data, (sqlError, doesUserExist, userData) => {
    if (doesUserExist) {
      const message = "User already exists. Please change the Email id"
      const error = sqlError !== null ? sqlError : "User already exists."
      res.status(200).json({ 'message': message, 'error': error, doesExist: true })
    }
    else {
      res.status(200).json({ doesExist: false })
    }
  })
}

async function groupCreateInvite(req, res) {
  let groupData = {
    groupName: req.body.groupname,
    inviteEmails: req.body.inviteEmail,
    existEmails: req.body.existEmail,
    createdemail: req.body.id,
    createname: req.body.name,
    mail: req.body.inviteEmail,
    path: '/home/tirth/split6/split/split money/authorisation/mymy.html',
    subject: req.body.name + ' wants to share bills with you!',
    replace: 'username',
    action: 4,
    recurringrecent: 1,
    transactionname: null,
    category: null,
    transactionid: null,
    groupname: req.body.groupname,
    createdid: req.body.createdid
  }
  // console.log(req.body, groupData);
  let replacements = {
    username: groupData.createname
  }
  try {
    let groupMail = await mail(groupData, replacements);
    // console.log(groupMail);
    userDBHelper.groupCreate(groupData, async (data, groupid) => {
      groupData.groupid = groupid;
      let recentData = await userDBHelper.recentactivity(groupData)
      if (data.error === null) {
        let message = "group created successfully";
        res.status(200).json({ 'message': message, groupid: groupid });
      } else {
        let message = "Failed to create the group.Please try again!";
        res.status(400).json({ 'message': message, 'error': data.error });
      }
    })
  } catch (error) {

  }

}

async function groupUpdateInvite(req, res) {
  let groupData = {
    groupname: req.body.groupname,
    inviteEmails: req.body.inviteEmail,
    existEmails: req.body.existEmail,
    groupid: req.params.groupid,
    createdid: req.body.createdid,
    action: 2,
    recurringrecent: 1,
    transactionname: null,
    category: null,
    transactionid: null
  }
  let mails = {
    mail: groupData.inviteEmails,
    createname: req.body.name,
    path: '/home/tirth/split6/split/split money/authorisation/mymy.html',
    subject: req.body.name + ' wants to share bills with you!',
    replace: 'username'
  }
  let replacements = {
    username: mail.createname
  }
  try {
    // console.log(mail, 'gagagagaag');
    let groupMail = await mail(mails, replacements);
    // console.log(mail, groupMail, 'gagagagaag');
    // groupData.inviteEmails.map(obj)
    // console.log(groupData);
    userDBHelper.groupUpdate(groupData, async (data) => {
      if (data.error === null) {
        let recentData = await userDBHelper.recentactivity(groupData);
        // console.log(recentData);
        let message = "group created successfully";
        res.status(200).json({ 'message': message });
      } else {
        let message = "Failed to create the group.Please try again!";
        res.status(400).json({ 'message': message, 'error': data.error });
      }
    })
  } catch (error) {

  }

}

function getuserid(req, res) {
  // console.log(req.body, 'in get userud');
  userDBHelper.getuserid(req.body.email, (data) => {
    // console.log(data, 'get user id');
    if (data) {
      let returnData = {
        username: data.username,
        id: data.id,
        email: data.email,
        profile: data.profile
      }
      res.status(200).json({ data: returnData });
    } else {
      let message = "something went wrong please login again";
      res.status(400).json({ 'message': message });
    }
  })
}

async function gettables(req, res) {
  let gettableData = {
    id: req.params.id,
    groupid: req.query.groupid
  }
  let message = '';
  if (gettableData.groupid) {
    let returnData = await userDBHelper.updateUserGroupTable(gettableData);
    console.log(returnData);
  }
  userDBHelper.gettables(gettableData.id, (dataResponseObject) => {
    // console.log(dataResponseObject);
    userDBHelper.getFriends(gettableData.id, (dataFriend) => {
      if (dataResponseObject.results.length >= 1) {
        message = 'groups fetched';
        res.status(200).json({ message: message, data: dataResponseObject.results, dataFriend: dataFriend })
      }
      else {
        message = 'Please create the group!';
        // console.log(message);
        res.status(200).json({ message: message, data: dataResponseObject.results, dataFriend: dataFriend })
      }
    })
  })
}

function getgroupinfo(req, res) {
  let groupid = req.params.id;
  // console.log(groupid);
  userDBHelper.getgroupinfo(groupid, (dataResponseObject) => {
    // console.log(dataResponseObject);
    if (dataResponseObject.results.length) {
      message = 'group data fetched';
      res.status(200).json({ message: message, data: dataResponseObject.results })
    }
    else {
      message = 'please try again!';
      res.status(200).json({ message: message })
    }
  })
}


function getgroupusers(req, res) {
  let groupid = req.params.id;
  // console.log(groupid);
  userDBHelper.getgroupusers(groupid, (dataResponseObject) => {
    // console.log(dataResponseObject);
    if (dataResponseObject.results.length >= 1) {
      message = 'groups users data fetched';
      res.status(200).json({ message: message, data: dataResponseObject.results })
    } else {
      message = 'no users.';
      res.status(200).json({ message: message, data: dataResponseObject.results });
    }
  })
}

function getfriend(req, res) {
  let dataids = {
    id: req.params.id,
    friendid: req.params.friendid
  }
  userDBHelper.getfriendsingles(dataids, (returnData) => {
    // console.log(returnData,'sdasdasdafrg');
    if (returnData) {
      userDBHelper.getfrinedtransaction(dataids, (data) => {
        // console.log(data, 'alldsa');
        if (data) {
          let message = "show data fetched";
          res.status(200).json({ 'message': message, data: data, singles: returnData });
        } else {
          let message = "Failed retrive transaction data";
          res.status(400).json({ 'message': message, 'error': data.error });
        }
      })
    }
  })
}

async function groupUpdate(req, res) {
  let groupData = {
    groupname: req.body.groupname,
    invites: req.body.invites,
    createdemail: req.body.id,
    groupid: req.params.groupid,
    createdid: req.body.createdid,
    action: 2,
    recurringrecent: 2,
    transactionname: null,
    transactionid: null,
    groupname: req.body.groupname,
    category: null
  }
  sendback = false;
  let dataemail = [];
  let existEmails = [];

  try {
    if (groupData.invites.length >= 1) {
      for (let iter = 0; iter < groupData.invites.length; iter++) {
        userDBHelper.doesUserExist(groupData.invites[iter], (sqlError, doesUserExist, userData) => {
          let emails = {
            email: groupData.invites[iter],
            doesExist: doesUserExist
          }
          dataemail.push(emails);
          if (!doesUserExist) {
            sendback = true;
          }
          if (iter == groupData.invites.length - 1) {
            if (sendback) {
              // console.log(sendback, 'lopolp');
              // ask for permission for invite
              let returnData = dataemail;
              returnData.invitepermission = true;
              // console.log(returnData, 'jkioop');
              res.status(200).json({ data: returnData, askpermission: true });
            }
            else {
              // console.log('In elseee');
              userDBHelper.addUpdateUserGroup(groupData, (returnData) => {
                res.status(200).json({ message: 'user added in group', askpermission: false });
              })
            }
          }
        })
      }
    }
    else {
      userDBHelper.groupUpdateagain(groupData, async (data) => {
        if (data.error === null) {
          // console.log('done');
          let recentData = await userDBHelper.recentactivity(groupData);
          // console.log(recentData);
          message = 'group Updated';
          res.status(200).json({ 'message': message });
        } else {
          let message = "Failed to Update the group.Please try again!";
          res.status(400).json({ 'message': message, 'error': data.error });
        }
      })
    }
  } catch (error) {

  }

}

function getTransactionSameid(req, res) {
  let getTransactionSameData = {
    id: req.params.id,
    recurring: req.params.recurring
  }
  userDBHelper.getTransactionSameid(getTransactionSameData, (data) => {
    // console.log(data);
    res.status(200).json({ data: data });
  })
}

function getUserData(req, res) {
  let dataId = req.params.id;
  // console.log(dataId);
  userDBHelper.getUserData(dataId, (data) => {
    // console.log(data);
    res.status(200).json({ data: data });
  })
}

function checktoken(req, res) {
  let token = req.params.token;
  // console.log(token);
  userDBHelper.doesTokenExist(token, (doesExist, data) => {
    if (doesExist) {
      // console.log(data[0].createtime, 'it actually exist')
      let d = new Date(Date.now());
      // console.log(d.toString());
      let mili = d.getTime();
      // 120000
      let r = new Date(data[0].createtime);
      // console.log(r.toString());
      let milir = r.getTime();
      if ((mili - milir) > 120000) {
        doesExist = false;
      }
      // console.log(mili, milir, 'gggg');
    }
    else {
      // console.log(data, 'does exist');
    }
    res.status(200).json({ doesExist: doesExist, data: data });
  })
}

function checksharetoken(req, res) {
  let shareData = {
    token: req.params.token,
    groupid: req.params.groupid
  }
  userDBHelper.doesShareTokenExist(shareData, (doesExist, data) => {
    if (doesExist) {
      // console.log(data[0].createtime, 'it actually exist')
      let d = new Date(Date.now());
      // console.log(d.toString());
      let mili = d.getTime();
      // 120000
      let r = new Date(data[0].createtime);
      // console.log(r.toString());
      let milir = r.getTime();
      if ((mili - milir) > 120000) {
        doesExist = false;
      }
      // console.log(mili, milir, 'gggg');
    }
    res.status(200).json({ doesExist: doesExist, data: data });
  })
}

function resetpassword(req, res) {
  let resetData = {
    password: req.body.password,
    token: req.params.token
  }
  // console.log(resetData, req.body);
  userDBHelper.doesTokenExist(resetData.token, (doesExist, data) => {
    if (doesExist) {
      // console.log(data[0].email);
      resetData.email = data[0].email
      userDBHelper.resetpassword(resetData, (data) => {
        if (data) {
          res.status(200).json({ message: "Password successfully updated!" });
        }
      })
    }
    else {
      // console.log('does not exist');
      res.status(400).json({ error: "something went wrong!" });
    }
  })
}


async function setsharetoken(req, res) {
  try {
    // console.log(req.body);
    let shareTokenData = {
      notemail: req.body.member,
      groupid: req.body.groupid,
      createdById: req.body.createdata.id,
      createdByUsername: req.body.createdata.username,
      email: []
    }
    let token = Math.random().toString(36).substring(2, 20);
    // console.log(shareTokenData.notemail);
    shareTokenData.notemail.forEach(element => {
      shareTokenData.email.push(element.email);
    });
    // console.log(token);
    shareTokenData.token = token;
    let mailData = {
      mail: shareTokenData.email,
      url: 'http://192.1.200.64:4200/sharedgroup/' + shareTokenData.groupid + '/' + shareTokenData.token,
      path: '/home/tirth/split6/split/split money/authorisation/shareViewLink.html',
      subject: 'View Group'
    }
    let replacements = {
      url: mailData.url,
      username: shareTokenData.createdByUsername
    }
    // console.log(mailData, replacements, shareTokenData);
    let shareMail = await mail(mailData, replacements);
    // console.log(shareMail);
    userDBHelper.setsharetoken(shareTokenData, (dataReturn) => {
      // console.log(dataReturn);
      res.status(200).json({ message: 'Reset Password Link sent' })
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

async function balanceremider(req, res) {
  try {
    let balanceReminderData = {
      to: req.body.to[0].email,
      from: req.body.from,
      messages: req.body.form.messages,
      groupid: req.body.groupid,
      groupname: req.body.groupname
    }
    let mailData = {
      mail: balanceReminderData.to,
      url: 'http://192.1.200.64:4200/groups/' + balanceReminderData.groupid,
      path: '/home/tirth/split6/split/split money/authorisation/balanceremider.html',
      subject: 'Note: Balance Reminder'
    }
    let replacements = {
      url: mailData.url,
      messages: balanceReminderData.messages,
      from: balanceReminderData.from,
      groupname: balanceReminderData.groupname
    }
    let reminderMail = await mail(mailData, replacements);
    // console.log(reminderMail);
    // console.log(req.body, balanceReminderData, 'balancereminddd');

    res.status(200).json({ message: 'sent' });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

async function searchValues(data, searchKey) {
  var re = new RegExp(searchKey, 'i');
  return data.filter(function (object) {
    if (object.name) {
      if (object.name.match(re)) {
        return object;
      }
    }
  })
}

async function search(req, res) {

  let searchData = {
    searchKey: req.query.searchkey,
    id: req.params.id
  }
  // console.log(searchData, 'ssss');
  let searchReturnData = await userDBHelper.search(searchData.id);
  let foundData = await searchValues(searchReturnData, searchData.searchKey);
  let first = foundData.slice(0, 10);
  // console.log(foundData.length, 'foundData');
  res.status(200).json({ search: first });
}

async function recentactivity(req, res) {
  let recentData = {
    id: req.params.id
  }
  try {
    let totalReturnData = await userDBHelper.totalbalance(recentData);
    let getrecentData = await userDBHelper.getrecentactivity(recentData);
    // console.log(totalReturnData);
    res.status(200).json({ total: totalReturnData, recentData: getrecentData });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ error: error });
  }
}

async function checkStatusPerUserPerGroup(req, res) {
  let checkStatusData = {
    id: req.params.id,
    groupid: req.params.groupid
  }
  try {
    // console.log(checkStatusData);
    let checkReturn = await userDBHelper.checkStatusPerUserPerGroup(checkStatusData);
    // console.log(checkReturn);
    res.status(200).json({ data: checkReturn });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ error: error });
  }
}
async function charts(req, res) {
  let chartdata = {
    id: req.params.id,
    groupid: req.query.groupid,
    rangedate: req.query.rangedate,
    friendid: req.query.friendid,
    type: req.query.type
  }

  console.log(chartdata);
}

async function setbudgetController(req, res) {
  let setbudgetData = {
    id: req.body.id,
    setbudget: req.body.setbudget
  }
  console.log(setbudgetData, 'setbudgetData');
  let budget;
  try {
    let setbudgetReturn = await userDBHelper.setbudgetModel(setbudgetData);
    let budgetData = await userDBHelper.getBudget(setbudgetData.id);
    // console.log(budgetData, 'tiriiiii')
    if (budgetData.setbudget && budgetData.budget) {
      lastbudget = await userDBHelper.statusLastThirtyHome(setbudgetData.id);
      budget = {
        budgetData: budgetData,
        lastbudget: lastbudget
      }
    }
    else {
      budget = {
        budgetData: budgetData,
        lastbudget: null
      }
    }
    res.status(200).json({ data: setbudgetReturn, budget: budget });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
}

//mainsss
async function addmembers(req, res) {
  let addMembersData = {
    id: req.body.id,
    allMembersData: req.body.value.allMembersData,
    totalMembers: req.body.value.totalMembers
  }
  console.log(addMembersData, 'adddd');
  try {
    addMembersData.allMembersData.map(obj => {
      obj.profileId = addMembersData.id,
        obj.birthDate = returnDate(obj.birthDate)
      console.log(returnDate(obj.birthDate));
    });
    console.log(addMembersData, 'addMembersData')
    let addMembersResponseData = await userDBHelper.addMembers(addMembersData);
    res.status(200).json({ message: 'great' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
}

function returnDate(Datetime) {
  // 2019-01-30 00:49:24
  console.log(Datetime, 'Datetime');
  var newdate = new Date(Datetime);
  // var hours = '0' + newdate.getHours();
  // var minute = '0' + newdate.getMinutes();
  // var seconds = '0' + newdate.getSeconds();
  var date = '0' + newdate.getDate();
  console.log(date, newdate, 'date');
  var month = '0' + (newdate.getMonth() + 1);
  var year = newdate.getFullYear();
  var formattedTime = year + '-' + month.substr(-2) + '-' + date.substr(-2); //  + ' ' + hours.substr(-2) + ':' + minute.substr(-2) + ':' + seconds.substr(-2);
  console.log(formattedTime, 'formattedTime');
  return formattedTime;
}

async function getmembers(req, res) {
  let getMembersData = {
    id: req.params.id
  }
  try {
    let getMembersResponseData = await userDBHelper.getMembers(getMembersData);
    res.status(200).json({ message: 'great', data: getMembersResponseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
}
async function updatemembers(req, res) {
  let updateMembersData = {
    id: req.body.id,
    allMembersData: req.body.value.allMembersData,
    totalMembers: req.body.value.totalMembers
  }
  try {
    let deleteMembersResponseData = await userDBHelper.deleteMembers(updateMembersData.id);
    updateMembersData.allMembersData.map(obj => {
      obj.profileId = updateMembersData.id,
        obj.birthDate = returnDate(obj.birthDate)
      console.log(returnDate(obj.birthDate));
    });
    console.log(updateMembersData, 'updateMembersData')
    let addMembersResponseData = await userDBHelper.addMembers(updateMembersData);
    res.status(200).json({ message: 'great', data: addMembersResponseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
}
const path = require('path');
async function downloadpdf(req, res) {
  // jsreport.render({
  //   template: {
  //     content: '<h1>hello </h1>',
  //     engine: 'handlebars',
  //     recipe: 'chrome-pdf'
  //   }
  // }).then((out) => {
  //   out.stream.pipe(res);
  // })
  templateDir = '/home/tirth/Desktop/web/server/split money/authorisation/'
let htmlfile = path.join(templateDir, 'mymy.html');
readFile(htmlfile)
  .then(fileContent => {
        return jsreport.render({
          template: {
            content: fileContent,
            engine: 'handlebars',
            // recipe: 'html'
            recipe: 'chrome-pdf'
          },
          data: {
            foo: "world"
          }
        }).then(function (out) {
          // console.log(out.content);
          out.stream.pipe(res);
        })
  });
}


function readFile(file) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, 'utf8', function (err, contents) {
      return resolve(contents);
    })
  });
}
