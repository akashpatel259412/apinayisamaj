const squel = require('squel');
let mySqlConnection;
let connection = require('./mySqlWrapper');
let async = require('async');
var schedule = require('node-schedule');
module.exports = injectedMySqlConnection => {
  mySqlConnection = injectedMySqlConnection
  return {
    registerUserInDB: registerUserInDB,
    getUserFromCrentials: getUserFromCrentials,
    doesUserExist: doesUserExist,
    getToken: getToken,
    invite: invite,
    deleteInvite: deleteInvite,
    doesinviteExist: doesinviteExist,

    groupCreate: groupCreate,
    groupUpdate: groupUpdate,
    groupCreateagain: groupCreateagain,
    groupUpdateagain: groupUpdateagain,
    deletegroup: deletegroup,

    addTransaction: addTransaction,
    addtransactionid: addtransactionid,
    deleteTransaction: deleteTransaction,
    updateTransactionid: updateTransactionid,
    updateTransaction: updateTransaction,
    showTransaction: showTransaction,

    addUserGroup: addUserGroup,
    addUpdateUserGroup: addUpdateUserGroup,

    totalmoneypergroup: totalmoneypergroup,
    totalowemoneytouser: totalowemoneytouser,
    totalMoneyPerUserGroup: totalMoneyPerUserGroup,
    totalMoneyPerUser: totalMoneyPerUser,
    totalbalance: totalbalance,

    getuserid: getuserid,
    gettables: gettables,
    getgroupinfo: getgroupinfo,
    getgroupusers: getgroupusers,
    getTransactionSingles: getTransactionSingles,

    getFriends: getFriends,
    getTransactionSameid: getTransactionSameid,
    getfriendsingles: getfriendsingles,
    getfrinedtransaction: getfrinedtransaction,

    getUserData: getUserData,

    splitupdateTransaction: splitupdateTransaction,
    splitTransaction: splitTransaction,
    getsimplfy: getsimplfy,

    changesimplify: changesimplify,
    changehideothers: changehideothers,
    changeViewBudget: changeViewBudget,
    // democron: democron,
    multiaddtransactionid: multiaddtransactionid,
    multiaddTransaction: multiaddTransaction,
    multisplitTransaction: multisplitTransaction,
    multisplitTransactionid: multisplitTransactionid,
    changepassword: changepassword,

    updateprofile: updateprofile,
    addPasswordToken: addPasswordToken,
    doesEmailTokenExist: doesEmailTokenExist,
    updatePasswordToken: updatePasswordToken,
    doesTokenExist: doesTokenExist,
    resetpassword: resetpassword,
    setsharetoken: setsharetoken,
    doesShareTokenExist: doesShareTokenExist,

    showRecurringTransaction: showRecurringTransaction,
    getRecurringTransactionSingles: getRecurringTransactionSingles,

    nextBill: nextBill,
    statusLastThirty: statusLastThirty,
    promisedData: promisedData,
    multiasyncaddtransactionid: multiasyncaddtransactionid,
    getMultipleasyncTransaction: getMultipleasyncTransaction,
    multiasyncaddTransaction: multiasyncaddTransaction,

    search: search,
    checkStatusPerUserPerGroup: checkStatusPerUserPerGroup,
    recentactivity: recentactivity,
    getrecentactivity: getrecentactivity,
    gettransactionname: gettransactionname,
    updateUserGroupTable: updateUserGroupTable,

    getBudget: getBudget,
    statusLastThirtyHome: statusLastThirtyHome,
    setbudgetModel: setbudgetModel,


    //mainsss
    addMembers: addMembers,
    getMembers: getMembers,
    deleteMembers: deleteMembers
  }
}
function promisedData(query) {
  return new Promise((resolve, reject) => {
    // console.log('00978');
    connection.query(query, (error, results) => {
      // console.log(error);
      if (error.error) {
        console.log(error.error, 'erororrr');
        return reject({ err: "something went wrong" });
      }
      if (error.results) {
        // console.log('0');
        return resolve(error.results);
      }
    });
  });
}



async function getMultipleasyncTransaction(sameid) {
  var multipleQuery = squel.select()
    .from("multipletransaction")
    .where("sameid=?", sameid)
    .toString();
  try {
    var dataResponseObject = await promisedData(multipleQuery);
    return dataResponseObject;
  } catch (error) {
    // console.log(error);
  }
}

function registerUserInDB(registerData, registrationCallback) {
  // console.log(registerData);
  // let registerUserQuery = squel.insert()
  //   .into("users")
  //   .set("username", registerData.username)
  //   .set("user_password", registerData.password)
  //   .set("email", registerData.email)
  //   .set("profileType", registerData.profileType)
  //   .set("profileId", registerData.profileId)
  //   .toString()
  registerData.ispending = 0;
  if (registerData.doesUserExist) {
    registerUserQuery = `UPDATE users SET username= '${registerData.username}',user_password=  SHA('${registerData.password}'),profileType= '${registerData.profileType}', ispending= '${registerData.ispending}' WHERE email='${registerData.email}'`;
  } else {
    registerUserQuery = `INSERT INTO users (username, user_password,email,firstname, lastname, profileType,ispending) VALUES ('${registerData.username}', SHA('${registerData.password}'),'${registerData.email}', '${registerData.firstname}', '${registerData.lastname}' ,'${registerData.profileType}','${registerData.ispending}')`;
  }
  // console.log(registerUserQuery, 'in here stop here');
  mySqlConnection.query(registerUserQuery, (dataResponseObject) => {
    // console.log(dataResponseObject);
    // console.log(dataResponseObject, "in registed");
    registrationCallback(1, dataResponseObject);
  })
}

function getUserFromCrentials(email, password, callback) {
  const getUserQuery = `SELECT * FROM users WHERE email = '${email}' AND user_password = SHA('${password}')`
  // console.log('getUserFromCrentials query is: ', getUserQuery);
  mySqlConnection.query(getUserQuery, (dataResponseObject) => {
    // console.log(dataResponseObject.results[0], 'in user credentials');
    callback(false, dataResponseObject.results !== null && dataResponseObject.results.length === 1 ? dataResponseObject.results[0] : null)
  })
}
function getuserid(email, callback) {
  const doesUserExistQuery = `SELECT * FROM users WHERE email = '${email}'`
  // console.log(doesUserExistQuery, "in exist");
  mySqlConnection.query(doesUserExistQuery, (dataResponseObject) => {
    // console.log(dataResponseObject);
    callback(dataResponseObject.results[0]);
  })
}
function doesUserExist(email, callback) {
  const doesUserExistQuery = `SELECT * FROM users WHERE email = '${email}'`
  // console.log(doesUserExistQuery, "in exist");
  let userData = {}
  mySqlConnection.query(doesUserExistQuery, (dataResponseObject) => {
    // console.log(dataResponseObject, "in does user exist");
    if (dataResponseObject.results.length > 0) {
      // console.log(dataResponseObject, "in does user exist");
      userData = {
        username: dataResponseObject.results[0].username,
        id: dataResponseObject.results[0].id,
        email: dataResponseObject.results[0].email,
        profileType: dataResponseObject.results[0].profileType,
        ispending: dataResponseObject.results[0].ispending,
      }
      // console.log(userData, "in does user exist");
    }
    // console.log(dataResponseObject.results);
    if (dataResponseObject.results.length == 0) {
      userData.ispending = 1
    }
    const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null
    // console.log(doesUserExist, "in my");
    const datareturn = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? "User exist" : "user does not exist" : null
    // console.log(datareturn, userData);
    callback(datareturn, doesUserExist, userData);
  })
}

function invite(inviteData, callback) {

  let inviteQuery;
  if (inviteData.groupId) {
    // inviteQuery = squel.insert()
    // .into("inviteduserstable")
    // .set("email", inviteData.email)
    // .set("groupid", inviteData.groupId)
    // .toString()
    inviteQuery = `INSERT INTO inviteduserstable (email,groupid) VALUES ('${inviteData.email}','${inviteData.groupId}')`
  }
  else {
    // inviteQuery = squel.insert()
    // .into("inviteduserstable")
    // .set("email", inviteData.email)
    // .toString()
    inviteQuery = `INSERT INTO inviteduserstable (email) VALUES ('${inviteData.email}')`
  }
  // console.log(inviteQuery, 'in invite model here');
  mySqlConnection.query(inviteQuery, (dataResponseObject) => {
    // console.log(dataResponseObject, "in invite");
    callback(dataResponseObject)
  })
}

function deleteInvite(inviteData, callback) {

  let groupQuery = ` DELETE FROM inviteduserstable WHERE email='${inviteData.email}'`

  // console.log(groupQuery, 'in deleteInvite model here');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {

    // console.log(dataResponseObject, "in group");
    callback(dataResponseObject)
  })
}
//done
function addUserGroup(userData, callback) {
  let groupid;
  existEmails = [];
  // console.log(userData, 'in  hehehehe');
  let groupQuery = `INSERT INTO grouptable (groupname) VALUES ('${userData.groupName}')`;

  // console.log(groupQuery, 'in group  model here');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    let query = `SELECT * FROM grouptable ORDER BY groupid DESC LIMIT 1`;
    mySqlConnection.query(query, (dataResponseObject1) => {
      groupid = dataResponseObject1.results[0].groupid;

      allemails = userData.invites;
      allemails.push(userData.createdemail);
      // console.log(allemails);
      querystring = allemails.join("','");
      let querys = `select * from users where email IN ('${querystring}')`;

      mySqlConnection.query(querys, (dataResponseObjectinvitelast) => {


        //callback(dataResponseObject1);
        existEmails = dataResponseObjectinvitelast.results.map(obj => {
          return {
            invite: obj.ispending,
            userid: obj.id,
            groupid: groupid,
            email: obj.email
          }
        })

        let existquery1 = squel.insert()
          .into("usergrouptable")
          .setFieldsRows(existEmails)
          .toString()
        // console.log(existquery1, 'in group  model here');
        mySqlConnection.query(existquery1, (dataResponseObject1) => {
          callback(dataResponseObject1, groupid);
        })
      })
    })
  })
}

//done
function addUpdateUserGroup(userData, callback) {
  existEmails = [];
  let groupQuery = squel.update()
    .table("grouptable")
    .set("groupname", userData.groupname)
    .where("groupid = ?", userData.groupid)
    .toString();
  // console.log('addUpdateUserGroup  in group  model here');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    let query = squel.delete()
      .from("usergrouptable")
      .where("groupid = ?", userData.groupid)
      .toString();
    mySqlConnection.query(query, (dataResponseObject1) => {
      // console.log(userData.groupId);
      allemails = userData.invites;
      // allemails.push(userData.createdemail);
      // console.log(allemails);
      querystring = allemails.join("','");
      let querys = `select * from users where email IN ('${querystring}')`;

      mySqlConnection.query(querys, (dataResponseObjectinvitelast) => {

        existEmails = dataResponseObjectinvitelast.results.map(obj => {
          return {
            invite: obj.ispending,
            userid: obj.id,
            groupid: userData.groupid,
            email: obj.email
          }
        })
        let existquery1 = squel.insert()
          .into("usergrouptable")
          .setFieldsRows(existEmails)
          .toString();

        // console.log(existquery1, 'in group  model here');
        mySqlConnection.query(existquery1, (dataResponseObject1) => {
          callback(dataResponseObject1);
        })
      })
    })
  })
}
// done
function groupCreateagain(groupData, callback) {
  let groupQuery = squel.insert()
    .into("grouptable")
    .set("groupname", groupData.groupName)
    //.set("createdby", groupData.createdBy)
    .toString();
  let groupid;
  // console.log(groupData, 'fffffffffffffffffffffffffffffffffk');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    // console.log(dataResponseObject1.results[0].id);
    let query = `SELECT * FROM grouptable ORDER BY groupid DESC LIMIT 1`;
    mySqlConnection.query(query, (dataResponseObject1) => {
      // callback(dataResponseObject);
      let querys = `select * from users where email = '${groupData.createdemail}'`;

      mySqlConnection.query(querys, (dataResponseObjectinvitelast) => {
        groupid = dataResponseObject1.results[0].groupid;
        let existquery1 = squel.insert()
          .into("usergrouptable")
          .set('email', groupData.createdemail)
          .set('groupid', dataResponseObject1.results[0].groupid)
          .set('userid', dataResponseObjectinvitelast.results[0].id)
          .toString();
        // console.log(existquery1, 'in group  model here');
        mySqlConnection.query(existquery1, (dataResponseObject1) => {
          callback(dataResponseObject1, groupid);
        })
      })
    })
  })
}

// done but check
function groupUpdateagain(groupData, callback) {
  let groupQuery = squel.update()
    .table("grouptable")
    .set("groupname", groupData.groupName)
    .where("groupid = ?", groupData.groupId)
    .toString();

  // console.log(groupData, 'fffffffffffffffffffffffffffffffffk');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    // console.log(dataResponseObject1.results[0].id);
    let query = squel.delete()
      .from("usergrouptable")
      .where("groupid = ?", groupData.groupId)
      .toString();

    mySqlConnection.query(query, (dataResponseObject1) => {
      // callback(dataResponseObject);
      // console.log(dataResponseObject1.results[0].groupid);
      let querys = `select * from users where email = '${groupData.createdemail}'`;

      mySqlConnection.query(querys, (dataResponseObjectinvitelast) => {
        let existquery1 = squel.insert()
          .into("usergrouptable")
          .set('email', groupData.createdemail)
          .set('groupid', groupData.groupId)
          .set('userid', dataResponseObjectinvitelast.results[0].id)
          .toString();
        // console.log(existquery1, 'in group  model here');
        mySqlConnection.query(existquery1, (dataResponseObject1) => {
          callback(dataResponseObject1);
        })
      })
    })
  })
}
// done 
function groupCreate(groupData, callback) {
  let groupid;
  let inviteEmails = [];
  let invited = [];
  let allemails = [];
  let groupQuery = `INSERT INTO grouptable (groupname) VALUES ('${groupData.groupName}')`;

  // console.log('in groupCreate');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {

    let query = `SELECT * FROM grouptable ORDER BY groupid DESC LIMIT 1`;
    mySqlConnection.query(query, (dataResponseObject1) => {
      // console.log(dataResponseObject1.results[0].groupid);
      groupid = dataResponseObject1.results[0].groupid;
      invited = groupData.inviteEmails.map(obj => {
        return {
          username: obj,
          email: obj,
          profileType: 'password',
          ispending: 1
        }
      })

      let existquery2 = squel.insert()
        .into("users")
        .setFieldsRows(invited)
        .toString()

      mySqlConnection.query(existquery2, (dataResponseObjectinvite) => {
        allemails = groupData.inviteEmails.concat(groupData.existEmails);
        allemails.push(groupData.createdemail);
        // console.log(allemails);
        querystring = allemails.join("','");
        let querys = `select * from users where email IN ('${querystring}')`;

        mySqlConnection.query(querys, (dataResponseObjectinvitelast) => {


          //callback(dataResponseObject1);
          inviteEmails = dataResponseObjectinvitelast.results.map(obj => {
            return {
              invite: obj.ispending,
              userid: obj.id,
              groupid: groupid,
              email: obj.email
            }
          })
          let existquery = squel.insert()
            .into("usergrouptable")
            .setFieldsRows(inviteEmails)
            .toString()
          // console.log(existquery, 'in group  model here');
          mySqlConnection.query(existquery, (dataResponseObject1) => {
            callback(dataResponseObject1, groupid);
          })
        })
      })
    })
  })
}

// done 
function groupUpdate(groupData, callback) {
  // let groupQuery = squel.insert()`
  //   .into("grouptable")
  //   .set("groupname", groupData.groupName)
  //   .set("createdby", groupData.createdBy)
  //   .toString()
  let inviteEmails = [];
  let existEmails = [];
  let allemails = [];

  let groupQuery = squel.update()
    .table("grouptable")
    .set("groupname", groupData.groupname)
    .where("groupid = ?", groupData.groupid)
    .toString();

  mySqlConnection.query(groupQuery, (dataResponseObject) => {

    let query = squel.delete()
      .from("usergrouptable")
      .where("groupid = ?", groupData.groupid)
      .toString();

    mySqlConnection.query(query, (dataResponseObject) => {
      invited = groupData.inviteEmails.map(obj => {
        return {
          username: obj,
          email: obj,
          profileType: 'password',
          ispending: 1
        }
      })

      let existquery2 = squel.insert()
        .into("users")
        .setFieldsRows(invited)
        .toString()

      mySqlConnection.query(existquery2, (dataResponseObjectinvite) => {

        allemails = groupData.inviteEmails.concat(groupData.existEmails);
        // console.log(allemails);
        querystring = allemails.join("','");
        let querys = `select * from users where email IN ('${querystring}')`;

        mySqlConnection.query(querys, (dataResponseObjectinvitelast) => {
          inviteEmails = dataResponseObjectinvitelast.results.map(obj => {
            return {
              invite: obj.ispending,
              userid: obj.id,
              groupid: groupData.groupid,
              email: obj.email
            }
          })
          let existquery = squel.insert()
            .into("usergrouptable")
            .setFieldsRows(inviteEmails)
            .toString();
          mySqlConnection.query(existquery, (dataResponseObject1) => {
            callback(dataResponseObject1);
          })
        })
      })
    })
  })
}

// function addUserGroup(userGroupData, callback) {
//   // let groupQuery = squel.insert()
//   //   .into("usergrouptable")
//   //   .set("userid", userGroupData.userId)
//   //   .set("groupid", userGroupData.groupId)
//   //   .toString()
//   let groupQuery = `INSERT INTO usergrouptable (userid, groupid) VALUES ('${userGroupData.userId}','${userGroupData.groupId}')`

//   mySqlConnection.query(groupQuery, (dataResponseObject) => {

// console.log(dataResponseObject, "in group");
//     callback(dataResponseObject)
//   })
// }
async function multiasyncaddtransactionid(transactionData) {
  var groupmember;
  // console.log(transactionData.members);
  if (transactionData.groupmember) {
    groupmember = transactionData.groupmember
  }
  else {
    groupmember = transactionData.members.length;
  }
  var groupQuery = squel.insert()
    .into("grouptransactionsingleanother")
    .set("groupid", transactionData.groupid)
    .set("money", transactionData.money)
    .set("type", transactionData.type)
    .set("name", transactionData.name)
    .set("groupmember", groupmember)
    .set("issingle", transactionData.issingle)
    .set("isequally", transactionData.isequally)
    .set("category", transactionData.category)
    .toString();

  try {
    var dataResponseObject1 = await promisedData(groupQuery);
    var groudidquery = `SELECT * FROM grouptransactionsingleanother ORDER BY id DESC LIMIT 1`;
    var dataResponseObject = await promisedData(groudidquery);
    return ({
      sameid: dataResponseObject[0].id,
      createTime: dataResponseObject[0].createtime
    })
  } catch (error) {
    // console.log(error, 'error add multi');
  }
}
function addtransactionid(transactionData, callback) {
  let groupmember;
  if (transactionData.members) {
    groupmember = transactionData.members.length;
  }
  else {
    groupmember = transactionData.groupmember
  }
  let groupQuery = squel.insert()
    .into("grouptransactionsingleanother")
    .set("groupid", transactionData.groupid)
    .set("money", transactionData.money)
    .set("type", transactionData.type)
    .set("name", transactionData.name)
    .set("groupmember", groupmember)
    .set("issingle", transactionData.issingle)
    .set("isequally", transactionData.isequally)
    .set("category", transactionData.category)
    .toString();
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    let groudidquery = `SELECT * FROM grouptransactionsingleanother ORDER BY id DESC LIMIT 1`;
    mySqlConnection.query(groudidquery, (dataResponseObject) => {
      // console.log(dataResponseObject.results[0], "in group");
      let data = {
        sameid: dataResponseObject.results[0].id,
        createTime: dataResponseObject.results[0].createtime
      }
      callback(data);
    })
  })
}

function updateTransactionid(updateTransactionData, callback) {
  let groupQuery;
  let query = squel.update()
    .set("groupid", updateTransactionData.groupid)
    .set("money", updateTransactionData.money)
    .set("type", updateTransactionData.type)
    .set("name", updateTransactionData.name)
    .set("groupmember", updateTransactionData.members.length)
    .set("issingle", updateTransactionData.issingle)
    .set("isequally", updateTransactionData.isequally)
    .set("category", updateTransactionData.category)
    .where('id =?', updateTransactionData.sameid)

  // console.log(updateTransactionData.recurring)
  if (parseInt(updateTransactionData.recurring)) {
    // console.log(updateTransactionData.repeat)
    groupQuery = query.table("multiplesingle")
      .set("after", updateTransactionData.repeat)
      .toString();
  }
  else {
    // console.log(updateTransactionData.repeat)
    groupQuery = query.table("grouptransactionsingleanother")
      .toString();
  }
  // console.log(groupQuery, 'group');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}
function multiaddtransactionid(transactionData, callback) {
  let groupQuery = squel.insert()
    .into("multiplesingle")
    .set("groupid", transactionData.groupid)
    .set("money", transactionData.money)
    .set("type", transactionData.type)
    .set("name", transactionData.name)
    .set("groupmember", transactionData.members.length)
    .set("issingle", transactionData.issingle)
    .set("isequally", transactionData.isequally)
    .set("after", transactionData.repeat)
    .set("category", transactionData.category)
    .toString();
  // console.log(groupQuery, 'ggg');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    let groudidquery = `SELECT * FROM multiplesingle ORDER BY id DESC LIMIT 1`;
    mySqlConnection.query(groudidquery, (dataResponseObject) => {
      // console.log(dataResponseObject.results[0], "in group");
      let data = {
        sameid: dataResponseObject.results[0].id,
        createTime: dataResponseObject.results[0].createtime
      }
      let sameid =
        // console.log(sameid, 'sameeee')
        callback(data);
    })
  })
}

function showTransaction(showData, callback) {
  var showquery = `SELECT
    c.groupid,
    c.fromid,
    f.username AS fromusername,
    c.moneypaid,
    c.moneyhavetopay,
    c.sameid,
    c.id,
    f.email,
    f.profile
FROM
    groupstransactiontableanother c
INNER JOIN(
    SELECT
       DISTINCT an.sameid AS sameid 
    FROM
        groupstransactiontableanother an
    WHERE
        an.groupid = '${showData.groupid}'
        ORDER BY an.sameid DESC
    limit ${showData.single},${showData.limit}
) a 
ON 
a.sameid = c.sameid
LEFT JOIN users f ON
    c.fromid = f.id
WHERE
    c.groupid = '${showData.groupid}'`;
  // console.log(showquery, 'shwtranss');
  mySqlConnection.query(showquery, (dataResponseObject1) => {
    let data = {
      all: dataResponseObject1.results
    }
    callback(data);
  })
}

function showRecurringTransaction(showData, callback) {
  var showquery = `SELECT
  c.groupid,
  c.fromid,
  f.username AS fromusername,
  c.moneypaid,
  c.moneyhavetopay,
  c.sameid,
  c.id,
  f.email,
  f.profile
FROM
multipletransaction c
INNER JOIN(
  SELECT
     DISTINCT an.sameid AS sameid 
  FROM
  multipletransaction an
  WHERE
      an.groupid = '${showData.groupid}'
      ORDER BY an.sameid DESC
  limit ${showData.recurring},${showData.limit}
) a 
ON 
a.sameid = c.sameid
LEFT JOIN users f ON
  c.fromid = f.id
WHERE
  c.groupid ='${showData.groupid}'
  ORDER BY c.id DESC`;

  mySqlConnection.query(showquery, (dataResponseObject1) => {
    let data = {
      all: dataResponseObject1.results
    }
    callback(data);
  })
}
async function multiasyncaddTransaction(transactionData) {
  var groupQuery = squel.insert()
    .into("groupstransactiontableanother")
    .setFieldsRows(transactionData)
    .toString()

  try {
    var dataResponseObject = await promisedData(groupQuery);
    return dataResponseObject;
  } catch (error) {

  }
}
function addTransaction(transactionData, callback) {
  let groupQuery = squel.insert()
    .into("groupstransactiontableanother")
    .setFieldsRows(transactionData)
    .toString()
  // console.log(groupQuery);
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    // console.log(dataResponseObject, "in group");
    callback(dataResponseObject)
  })
}

function multiaddTransaction(transactionData, callback) {
  let groupQuery = squel.insert()
    .into("multipletransaction")
    .setFieldsRows(transactionData)
    .toString()
  // console.log(groupQuery);
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    // console.log(dataResponseObject, "in group");
    callback(dataResponseObject)
  })
}
function updateTransaction(transactionData, recurring, callback) {
  // console.log(transactionData[0], 'in fefefefe')
  let deleteQuery, groupQuery;
  let query = squel.delete()
    .where('sameid = ?', transactionData[0].sameid)

  let querygroup = squel.insert()
    .setFieldsRows(transactionData)

  if (parseInt(recurring)) {
    deleteQuery = query.from("multipletransaction")
      .toString();
    groupQuery = querygroup.into("multipletransaction")
      .toString();
  }
  else {
    deleteQuery = query.from("groupstransactiontableanother")
      .toString();
    groupQuery = querygroup.into("groupstransactiontableanother")
      .toString();
  }
  // console.log(deleteQuery, groupQuery, 'ddd');
  mySqlConnection.query(deleteQuery, (dataResponseObject1) => {
    // console.log(dataResponseObject1, 'eee')
    mySqlConnection.query(groupQuery, (dataResponseObject) => {
      callback(dataResponseObject)
    })
  })
}


function splitupdateTransaction(splitUpdateData, callback) {
  let splitdataArray = [];
  let groupQuery, deleteQuery;

  let query = squel.update()
    .set("groupid", splitUpdateData.groupid)
    .set("money", splitUpdateData.split)
    .set("issingle", splitUpdateData.issingle)
    .set("isequally", splitUpdateData.isequally)
    .set("type", splitUpdateData.type)
    .set("groupmember", 2)
    .where("id = ?", splitUpdateData.id)

  let queryDelete = squel.delete()
    .where("sameid = ?", splitUpdateData.id)

  if (parseInt(splitUpdateData.recurring)) {
    groupQuery = query.table("multiplesingle")
      .set("after", splitUpdateData.repeat)
      .set("payTillTime", splitUpdateData.date)
      .set("tillUserId", splitUpdateData.repeatId)
      .set("paidbyUserId", splitUpdateData.paidbyUserId)
      .toString();
    deleteQuery = queryDelete.from("multipletransaction")
      .toString();
    // .set("after", splitUpdateData.repeat)
  }
  else {
    groupQuery = query.table("grouptransactionsingleanother")
      .toString();
    deleteQuery = queryDelete.from("groupstransactiontableanother")
      .toString();
  }
  // console.log(groupQuery, deleteQuery, 'dasuoidsa');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {

    mySqlConnection.query(deleteQuery, (dataResponseObject) => {
      splitdataArray.push({
        fromid: splitUpdateData.fromid,
        groupid: splitUpdateData.groupid,
        moneypaid: splitUpdateData.split,
        moneyhavetopay: 0,
        type: 'Split',
        sameid: splitUpdateData.id
      }, {
        fromid: splitUpdateData.toid,
        groupid: splitUpdateData.groupid,
        moneypaid: 0,
        moneyhavetopay: splitUpdateData.split,
        type: 'Split',
        sameid: splitUpdateData.id
      })
      let splitQuery;
      let querys = squel.insert()
        .setFieldsRows(splitdataArray)
      if (parseInt(splitUpdateData.recurring)) {
        splitQuery = querys.into("multipletransaction")
          .toString();
      }
      else {
        splitQuery = querys.into("groupstransactiontableanother")
          .toString();
      }
      mySqlConnection.query(splitQuery, (dataResponseObject) => {
        callback(dataResponseObject)
      })
    })
  })
}

function getToken(id, callback) {
  const doesUserExistQuery = `SELECT * FROM access_tokens WHERE user_id = '${id}' ORDER BY id DESC LIMIT 1`
  // console.log(doesUserExistQuery, "in checkby by by");
  mySqlConnection.query(doesUserExistQuery, (dataResponseObject) => {
    // console.log(dataResponseObject, "hey i am");
    callback(dataResponseObject);
  })
}
//var squel = require('squel');

function totalmoneypergroup(oweData, callback) {
  // let doesUserExistQuery = `SELECT groupid, money as paid FROM transactionData WHERE fromid = '${oweData.id}' GROUP BY 'groupid'`
  let borrowQuery = `SELECT
  SUM(moneypaid) AS paid,
  SUM(moneyhavetopay) AS borrow,
  SUM(moneypaid) - SUM(moneyhavetopay) AS difference
FROM
  groupstransactiontableanother
WHERE
  fromid = '${oweData.id}'
GROUP BY fromid`;

  mySqlConnection.query(borrowQuery, (dataResponseObject1) => {
    if (dataResponseObject1.error) {
      // console.log(dataResponseObject1.error, 'in here errorrrrss');
    }
    callback(dataResponseObject1.results);
  })
}


function totalowemoneytouser(oweData, callback) {
  let doesUserExistQuery = `SELECT sum(money) as paid FROM transactionData WHERE fromid = '${oweData.id}' AND toid = '${oweData.toid}' `
  // console.log(doesUserExistQuery, "in checkby by by");
  mySqlConnection.query(doesUserExistQuery, (dataResponseObject) => {
    let paid = dataResponseObject.results[0].paid;
    // console.log(dataResponseObject.results[0].paid, "hey i am");
    let doesUserExistQuery1 = `SELECT sum(money) as owe FROM transactionData WHERE toid = '${oweData.id}' AND fromid = '${oweData.toid}'`
    // console.log(doesUserExistQuery1, "in checkby by by");
    mySqlConnection.query(doesUserExistQuery1, (dataResponseObject1) => {
      // console.log(dataResponseObject1.results[0].owe, "hey i am");
      let owe = dataResponseObject1.results[0].owe
      let total = paid - owe;
      // console.log(total);
      callback(total);
    })
  })
}
//
function doesinviteExist(email, callback) {
  // let existData = [];
  let query = `SELECT email FROM usergrouptable WHERE email= '${email}' AND invite = 1`;
  // console.log(query, 'in doesinvite exist');
  mySqlConnection.query(query, (dataResponseObject1) => {
    console.log(dataResponseObject1);
    if (dataResponseObject1.results.length >= 1) {

      let query1 = squel.update()
        .table("usergrouptable")
        .set('invite', 0)
        .where('email = ?', email)
        .toString();
      // console.log(query1);
      mySqlConnection.query(query1, (dataResponseObject2) => {
        callback(dataResponseObject2);
      })
    }
    else {
      callback(dataResponseObject1);
      // console.log(groupQuery);
    }
  })
}
//done
function gettables(id, callback) {
  let query = `SELECT
  c.groupname groupname,
  c.groupid AS groupid,
  o.visittime,
  MAX(gs.createtime) AS createtime,
  SUM(
      IF(
          gs.createtime > o.visittime,
          1,
          0
      )
  ) AS notification
FROM
  usergrouptable o
INNER JOIN grouptable c ON
  c.groupid = o.groupid
RIGHT OUTER JOIN grouptransactionsingleanother gs ON
  o.groupid = gs.groupid
RIGHT OUTER JOIN groupstransactiontableanother gt ON
  gt.sameid = gs.id
WHERE
  o.userid = '${id}' AND gt.fromid = '${id}'
GROUP BY
  c.groupid
ORDER BY
  notification
DESC
  ,
  createtime
DESC`;
  // console.log(query, 'adadssd');
  mySqlConnection.query(query, (dataResponseObject2) => {
    // console.log(dataResponseObject2.results, 'adadssd');
    callback(dataResponseObject2);
  })
}
// done for now change it
function getFriends(id, callback) {
  let friendQuery = `SELECT DISTINCT
  (us.id) AS id,
  ug.groupid AS groupid,
  us.username,
  us.profile,
  us.ispending,
  us.profile,
  ug.email,
  ug.invite
FROM
  grouptable c
LEFT JOIN usergrouptable o ON
  c.groupid = o.groupid
LEFT JOIN users u ON
  o.email = u.email
LEFT JOIN usergrouptable ug ON
  ug.groupid = c.groupid
LEFT JOIN users us ON
  us.email = ug.email
WHERE
  u.id = '${id}' AND us.id <> '${id}'
GROUP By us.id`;
  mySqlConnection.query(friendQuery, (dataReturn) => {
    // console.log(dataReturn.results);
    callback(dataReturn.results);
  })
}
//done
function getgroupinfo(groupid, callback) {
  let query = `SELECT c.groupname, o.email,o.userid, f.username, f.profile,f.ispending FROM grouptable c LEFT JOIN usergrouptable o ON c.groupid = o.groupid LEFT JOIN users f ON o.userid = f.id WHERE c.groupid = '${groupid}'`;
  mySqlConnection.query(query, (dataResponseObject2) => {
    // console.log(dataResponseObject2.results[0]);
    callback(dataResponseObject2);
  })
}
//done
function getgroupusers(groupid, callback) {
  let query = `SELECT f.username AS itemName, f.id AS userid, f.ispending, o.email FROM grouptable c LEFT JOIN usergrouptable o ON c.groupid = o.groupid LEFT JOIN users f ON o.userid = f.id WHERE c.groupid = '${groupid}'`;
  mySqlConnection.query(query, (dataResponseObject2) => {
    // console.log(dataResponseObject2.results);
    callback(dataResponseObject2);
  })
}
function deletegroupTransaction(groupData, callback) {
  let query = squel.delete()
    .from("groupstransactiontableanother")
    .where("groupid = ?", groupData.groupid)
    .toString();
  mySqlConnection.query(query, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}
function deletegroupTransactionSingle(groupData, callback) {
  let query = squel.delete()
    .from("grouptransactionsingleanother")
    .where("groupid = ?", groupData.groupid)
    .toString();
  mySqlConnection.query(query, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}

function deletegrouptable(groupData, callback) {
  let query = squel.delete()
    .from("grouptable")
    .where("groupid = ?", groupData.groupid)
    .toString();
  mySqlConnection.query(query, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}
///
// function deleteinvitetable(groupData, callback) {
//   let query = squel.delete()
//     .from("usergrouptable")
//     .where("groupid = ?", groupData.groupid)
//     .where("invite =?", 1)
//     .toString();
//   mySqlConnection.query(query, (dataResponseObject) => {
//     callback(dataResponseObject);
//   })
// }
function deleteusergrouptable(groupData, callback) {
  let query = squel.delete()
    .from("usergrouptable")
    .where("groupid = ?", groupData.groupid)
    .toString();
  mySqlConnection.query(query, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}

function deletegroup(groupData, callback) {
  deleteusergrouptable(groupData, (dataResponseObject) => {
    deletegrouptable(groupData, (dataResponseObject) => {
      deletegroupTransactionSingle(groupData, (dataResponseObject) => {
        deletegroupTransaction(groupData, (dataResponseObject) => {
          callback(dataResponseObject);
        })
      })
    })
  })
}

function deletegroupTransactionSame(sameData, callback) {
  let deleteQuery;
  let query = squel.delete()
    .where("sameid = ?", sameData.sameid)
  if (parseInt(sameData.recurring)) {
    deleteQuery = query.from("multipletransaction")
      .toString();
  }
  else {
    deleteQuery = query.from("groupstransactiontableanother")
      .toString();
  }
  // console.log(deleteQuery, 'in deleteeeee')
  mySqlConnection.query(deleteQuery, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}

function deletegroupTransactionSingleSame(sameData, callback) {
  let deleteQuery;
  let query = squel.delete()
    .where("id = ?", sameData.sameid)
  if (parseInt(sameData.recurring)) {
    deleteQuery = query.from("multiplesingle")
      .toString();
  }
  else {
    deleteQuery = query.from("grouptransactionsingleanother")
      .toString();
  }
  // console.log(deleteQuery);
  mySqlConnection.query(deleteQuery, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}

function deleteTransaction(sameData, callback) {
  deletegroupTransactionSingleSame(sameData, (dataResponseObject) => {
    deletegroupTransactionSame(sameData, (dataResponseObject) => {
      callback(dataResponseObject);
    })
  })
}
function getsimplfy(userData, callback) {
  let getsimplifyQuery = `SELECT simplify FROM users WHERE id = '${userData.fromid}'`;
  mySqlConnection.query(getsimplifyQuery, (dataResponseObject) => {
    let simplify = dataResponseObject.results;
    // console.log(simplify);
    callback(simplify);
  })
}
// DONE USERGROUPTABLE
function totalMoneyPerUserGroup(userData, callback) {
  let paidQuery = `
  SELECT
    *
FROM
    (
    SELECT
        f.username AS username,
        f.profile AS profile,
        f.ispending AS ispending,
        f.email AS email,
        o.userid AS userid
    FROM
        usergrouptable o
    LEFT JOIN users f ON
        o.userid = f.id
    WHERE
        o.groupid = '${userData.groupid}'
) userdata
LEFT JOIN(
    SELECT
        c.id AS id,
        c.fromid AS fromid,
        SUM(c.moneypaid) AS paid,
        SUM(c.moneyhavetopay) AS havepays,
        (SUM(c.moneypaid) - SUM(c.moneyhavetopay)) AS difference,
        (SUM(c.moneypaid) - SUM(c.moneyhavetopay)) AS anotherdifference,
        c.groupid AS groupid,
        g.groupname AS groupname
    FROM
        groupstransactiontableanother c
    Left JOIN 
        grouptable g ON g.groupid = c.groupid
    WHERE
        c.groupid = '${userData.groupid}'
    GROUP BY
        c.fromid
) gg 
ON userdata.userid = gg.fromid`;
  // console.log(paidQuery, 'pppp');
  mySqlConnection.query(paidQuery, (dataResponseObject) => {
    let totalmoney = dataResponseObject.results;
    // console.log(totalmoney, 'in elseee')
    if (userData.simplify) {
      // console.log('in ifffff')
      callback({ data: totalmoney });
    }
    else {
      let hardQuery = `SELECT
id,
SUM(paid) AS paids,
SUM(havepay) AS havepays,
(SUM(paid) - SUM(havepay)) AS difference,
(SUM(paid) - SUM(havepay)) AS anotherdifference,
groupid,
username,
fromid,
profile,
ispending,
email,
groupname,
sameid
FROM
(
SELECT DISTINCT
    (c.id) AS id,
    c.fromid AS fromid,
    c.moneypaid AS paid,
    c.moneyhavetopay AS havepay,
    c.groupid AS groupid,
    f.username AS username,
    f.profile AS profile,
    f.ispending AS ispending,
    f.email AS email,
    g.groupname AS groupname,
    c.sameid AS sameid
FROM
    usergrouptable o
LEFT JOIN groupstransactiontableanother c ON
    c.groupid = o.groupid
LEFT JOIN users f ON
    c.fromid = f.id
LEFT JOIN grouptable g ON
    g.groupid = c.groupid
WHERE
    o.groupid = '${userData.groupid}'
) X
GROUP BY
X.sameid,
X.fromid`;
      mySqlConnection.query(hardQuery, (dataResponseObject) => {
        let idmoney = dataResponseObject.results;
        // console.log(totalmoney,'kkkkkkk')
        // console.log(idmoney, 'tititit');
        callback({ data: totalmoney, transaction: idmoney });
      })
    }
  })
}
function multisplitTransaction(splitData, callback) {
  // console.log('ssslast');
  let groupQuery = squel.insert()
    .into("multiplesingle")
    .set("groupid", splitData.groupid)
    .set("money", splitData.split)
    .set("issingle", splitData.issingle)
    .set("isequally", splitData.isequally)
    .set("type", splitData.type)
    .set("groupmember", 2)
    .set("after", splitData.repeat)
    .set("payTillTime", splitData.date)
    .set("tillUserId", splitData.repeatId)
    .set("paidbyUserId", splitData.paidbyUserId)
    .toString();
  // console.log(groupQuery, 'ggg');
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    let groudidquery = `SELECT * FROM multiplesingle ORDER BY id DESC LIMIT 1`;
    mySqlConnection.query(groudidquery, (dataResponseObject) => {
      callback(dataResponseObject.results[0])
    })
  })
}
function multisplitTransactionid(splitdataArray, callback) {
  let splitQuery = squel.insert()
    .into("multipletransaction")
    .setFieldsRows(splitdataArray)
    .toString();
  mySqlConnection.query(splitQuery, (dataResponseObject) => {
    callback(dataResponseObject)
  })
}
function splitTransaction(splitData, callback) {
  let splitdataArray = [];
  let groupQuery = squel.insert()
    .into("grouptransactionsingleanother")
    .set("groupid", splitData.groupid)
    .set("money", splitData.split)
    .set("issingle", splitData.issingle)
    .set("isequally", splitData.isequally)
    .set("type", splitData.type)
    .set("groupmember", 2)
    .toString();
  mySqlConnection.query(groupQuery, (dataResponseObject) => {
    let groudidquery = `SELECT * FROM grouptransactionsingleanother ORDER BY id DESC LIMIT 1`;
    mySqlConnection.query(groudidquery, (dataResponseObject) => {

      splitdataArray.push({
        fromid: splitData.fromid,
        groupid: splitData.groupid,
        moneypaid: splitData.split,
        moneyhavetopay: 0,
        type: 'Split',
        sameid: dataResponseObject.results[0].id
      }, {
        fromid: splitData.toid,
        groupid: splitData.groupid,
        moneypaid: 0,
        moneyhavetopay: splitData.split,
        type: 'Split',
        sameid: dataResponseObject.results[0].id
      })

      let splitQuery = squel.insert()
        .into("groupstransactiontableanother")
        .setFieldsRows(splitdataArray)
        .toString();
      mySqlConnection.query(splitQuery, (dataResponseObject) => {
        callback(splitdataArray[0].sameid)
      })
    })
  })
}

function getTransactionSingles(showData, callback) {
  // let singleQuery = squel.select()
  //   .from("grouptransactionsingleanother")
  //   .where("groupid=?", showData.groupid)
  //   .where("type =?", "Transaction")
  //   .toString();
  let singleQuery = `SELECT
  DATE_FORMAT(c.createtime, "%b %d %y") AS createtime,
  DATE_FORMAT(c.createtime, "%b") AS createmonth,
  c.createtime AS createtime,
  c.id,
  c.groupid,
  c.name,
  c.money,
  c.type,
  c.groupmember,
  c.issingle,
  c.isequally,
  c.updatetime AS updatetime,
  c.receipt,
  c.category AS categoryno,
  cat.categoryurl AS category
FROM
  grouptransactionsingleanother c
  LEFT JOIN category cat ON
      cat.id = c.category
WHERE
  c.groupid = '${showData.groupid}'
  ORDER BY  c.id DESC
  LIMIT ${showData.single}, ${showData.limit}`;

  // console.log(singleQuery, "asd");
  mySqlConnection.query(singleQuery, (dataResponseObject) => {
    // console.log(dataResponseObject.results, 'mytiri');
    callback(dataResponseObject.results);
  })
}

function getRecurringTransactionSingles(showData, callback) {
  // let singleQuery = squel.select()
  //   .from("grouptransactionsingleanother")
  //   .where("groupid=?", showData.groupid)
  //   .where("type =?", "Transaction")
  //   .toString();
  let singleQuery = `SELECT
  DATE_FORMAT(c.createtime, "%b %d %y") AS createtime,
  DATE_FORMAT(c.createtime, "%b") AS createmonth,
  c.createtime AS createtime,
  c.id,
  c.updatetime AS updatetime,
  c.groupid,
  c.name,
  c.money,
  c.type,
  c.groupmember,
  c.issingle,
  c.isequally,
  c.receipt,
  c.after,
  c.category AS categoryno,
  cat.categoryurl AS category
FROM
multiplesingle c
LEFT JOIN category cat ON
      cat.id = c.category
WHERE
  c.groupid = '${showData.groupid}'
  ORDER BY  c.id DESC
  LIMIT ${showData.recurring}, ${showData.limit}`;

  // console.log(singleQuery, "asd");
  mySqlConnection.query(singleQuery, (dataResponseObject) => {
    // console.log(dataResponseObject.results, 'mytirirrrr');
    callback(dataResponseObject.results);
  })
}
// done
function totalMoneyPerUser(userData, callback) {
  // console.log('usssss', userData);
  let borrowQuery = `SELECT
  id AS id,
  SUM(paid) AS paids,
  SUM(havepay) AS havepays,
  (SUM(paid) - SUM(havepay)) AS difference,
  (SUM(paid) - SUM(havepay)) AS anotherdifference,
  groupid,
  username,
  fromid,
  profile,
  ispending,
  email,
  groupname,
  sameid
FROM
  (
  SELECT DISTINCT
      (c.id) AS id,
      c.fromid AS fromid,
      c.moneypaid AS paid,
      c.moneyhavetopay AS havepay,
      c.groupid AS groupid,
      c.sameid AS sameid,
      f.username AS username,
      f.profile AS profile,
      f.ispending AS ispending,
      f.email AS email,
      g.groupname AS groupname
  FROM
     groupstransactiontableanother c
  LEFT JOIN users f ON
      c.fromid = f.id
  LEFT JOIN grouptable g ON
      g.groupid = c.groupid
   LEFT JOIN usergrouptable o ON o.groupid = c.groupid 
      where o.userid = '${userData.id}'
) X
GROUP BY
  X.sameid,
  X.fromid`;

  mySqlConnection.query(borrowQuery, (dataResponseObject1) => {
    let paid;
    // console.log(dataResponseObject1.results.length, "hey i am");
    if (dataResponseObject1.error) {
      // console.log(dataResponseObject1.error, 'in here errorrrrss');
    }
    if (dataResponseObject1.results[0]) {
      paid = dataResponseObject1.results
      // console.log(paid, 'oweee');
    } else {
      paid = 0;
    }
    // console.log(paid, 'paid');
    callback(paid);
  })
}

async function totalbalance(recentData) {
  let query = `SELECT
  (SUM(moneypaid) - SUM(moneyhavetopay) ) AS totalbalance
FROM
  groupstransactiontableanother
WHERE
  fromid = '${recentData.id}'
GROUP BY
  fromid`;
  try {
    let totalreturnData = await promisedData(query);
    // console.log(totalreturnData);
    return totalreturnData;
  } catch (error) {
    // console.log(error);
    return error;
  }
}

function getTransactionSameid(data, callback) {
  let getQuery;
  // console.log(data.recurring, typeof data.recurring);
  if (parseInt(data.recurring)) {
    // console.log(data.recurring, 'true')
    getQuery = `SELECT
  g.fromid,
  g.groupid,
  g.moneypaid,
  g.moneyhavetopay,
  g.type,
  g.share,
  g.percentage,
  gs.groupmember,
  gs.issingle,
  gs.isequally,
  gs.receipt,
  gs.after,
  gs.name,
  gs.tillUserId	,
  gs.payTillTime,
  gs.money AS money,
  gs.createtime AS TIME,
  gs.category AS category,
  us.username AS fromname
FROM
multipletransaction g
LEFT JOIN
multiplesingle gs ON gs.id = g.sameid
LEFT JOIN
  users us ON us.id = g.fromid
WHERE
  g.sameid = '${data.id}'`;
  } else {
    // console.log(data.recurring, 'false')
    getQuery = `SELECT
  g.fromid,
  g.groupid,
  g.moneypaid,
  g.moneyhavetopay,
  g.type,
  g.share,
  g.percentage,
  gs.groupmember,
  gs.issingle,
  gs.isequally,
  gs.receipt,
  gs.name,
  gs.money AS money,
  gs.createtime AS TIME,
  gs.category AS category,
  us.username AS fromname
FROM
  groupstransactiontableanother g
LEFT JOIN
  grouptransactionsingleanother gs ON gs.id = g.sameid
LEFT JOIN
  users us ON us.id = g.fromid
WHERE
  g.sameid = '${data.id}'`;
  }
  // console.log(getQuery, 'queryryr')
  mySqlConnection.query(getQuery, (dataReturn) => {
    // console.log(dataReturn, 'fdsdfs');
    callback(dataReturn.results);
  })
}

function getfriendsingles(dataids, callback) {
  let query = `SELECT
  *
FROM
  grouptransactionsingleanother g
WHERE
  g.fromid = '${dataids.id}' OR g.fromid = '${dataids.friendid}'`;
  mySqlConnection.query(query, (dataReturn) => {
    // console.log(dataReturn.results);
    callback(dataReturn.results);
  })
}

function getfrinedtransaction(dataids, callback) {
  let query = `
  SELECT
    *
FROM
groupstransactiontableanother g
WHERE
    g.fromid = '${dataids.id}' AND g.toid = '${dataids.friendid}' OR g.toid = '${dataids.id}' AND g.fromid = '${dataids.friendid}' AND g.type = 'Transaction'`;
  mySqlConnection.query(query, (dataReturn) => {
    // console.log(dataReturn.results);
    callback(dataReturn.results);
  })
}

function changesimplify(simplifyData, callback) {
  let simplifyQuery = squel.update()
    .table("users")
    .set("simplify", simplifyData.isSimplify)
    .where("id = ?", simplifyData.createdid)
    .toString();
  // console.log(simplifyQuery, simplifyData, 'simplifyquery')
  mySqlConnection.query(simplifyQuery, (dataReturn) => {
    callback(dataReturn);
  })
}

function changehideothers(hideothersData, callback) {
  let hideothersQuery = squel.update()
    .table("users")
    .set("onlyme", hideothersData.ishideothers)
    .where("id = ?", hideothersData.userid)
    .toString();
  console.log(hideothersQuery, hideothersData, 'hideothersquery')
  mySqlConnection.query(hideothersQuery, (dataReturn) => {
    callback(dataReturn);
  })
}
async function changeViewBudget(viewBudgetData) {
  let viewBudgetDataQuery = squel.update()
    .table("users")
    .set("setbudget", viewBudgetData.isViewBudget)
    .where("id = ?", viewBudgetData.userid)
    .toString();
  console.log(viewBudgetDataQuery, viewBudgetData, 'viewBudgetData')
  try {
    let viewBudget = await promisedData(viewBudgetDataQuery);
    console.log(viewBudget);
    return viewBudget;
  } catch (error) {
    console.log(error);
    return error;
  }
}
function changepassword(passwordData, callback) {
  let passwordQuery = `UPDATE users SET user_password = SHA('${passwordData.password}') WHERE id = '${passwordData.createdid}' AND user_password = SHA('${passwordData.currentpassword}')`;
  // console.log(passwordQuery, passwordData, 'passwordquery')
  mySqlConnection.query(passwordQuery, (dataReturn) => {
    let changed;
    // console.log(dataReturn.results.changedRows, 'passss');
    if (dataReturn.results.changedRows) {
      changed = true;
    }
    else {
      changed = false;
    }
    callback({ changed: changed });
  })
  // ff53bed8cf9528df252886b612499fb247f85d47
}

function getUserData(dataId, callback) {
  const doesUserExistQuery = `SELECT * FROM users WHERE id = '${dataId}'`
  // console.log(doesUserExistQuery, "in exist");
  mySqlConnection.query(doesUserExistQuery, (dataResponseObject) => {
    // console.log(dataResponseObject.results);
    callback(dataResponseObject.results[0]);
  })
}
function updateprofile(profiledata, callback) {
  let updateproflieQuery = squel.update()
    .table("users")
    .set("profile", profiledata.url)
    .where("id = ?", profiledata.id)
    .toString();
  mySqlConnection.query(updateproflieQuery, (dataResponseObject) => {
    // console.log(dataResponseObject.results);
    callback(dataResponseObject);
  })
}

function addPasswordToken(emailData, callback) {
  let addtokenQuery = squel.insert()
    .into("passwordtoken")
    .set("email", emailData.email)
    .set("token", emailData.token)
    .toString()
  mySqlConnection.query(addtokenQuery, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}
function setsharetoken(shareTokenData, callback) {
  let sharetokenQuery = squel.insert()
    .into("shareviewtoken")
    .set("createdbyid", shareTokenData.createdById)
    .set("token", shareTokenData.token)
    .set("groupid", shareTokenData.groupid)
    .toString()
  mySqlConnection.query(sharetokenQuery, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}
function updatePasswordToken(emailData, callback) {
  let addtokenQuery = squel.update()
    .table("passwordtoken")
    .set("token", emailData.token)
    .where("email = ?", emailData.email)
    .toString()
  mySqlConnection.query(addtokenQuery, (dataResponseObject) => {
    callback(dataResponseObject);
  })
}

function doesEmailTokenExist(email, callback) {
  const doesUserExistQuery = `SELECT * FROM passwordtoken WHERE email = '${email}'`
  // console.log(doesUserExistQuery, "in exist");
  mySqlConnection.query(doesUserExistQuery, (dataResponseObject) => {
    const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null;
    // console.log(doesUserExist);
    callback(doesUserExist);
  })
}

function doesTokenExist(token, callback) {
  const doestokenQuery = `SELECT * FROM passwordtoken WHERE token = '${token}'`
  // console.log(doestokenQuery, "in exist");
  mySqlConnection.query(doestokenQuery, (dataResponseObject) => {
    let doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null;
    // console.log(doesUserExist, dataResponseObject.results);
    callback(doesUserExist, dataResponseObject.results);
  })
}

function doesShareTokenExist(shareData, callback) {
  const doestokenQuery = `SELECT * FROM shareviewtoken WHERE token = '${shareData.token}' AND groupid = '${shareData.groupid}'`
  // console.log(doestokenQuery, "in exist");
  mySqlConnection.query(doestokenQuery, (dataResponseObject) => {
    let doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null;
    // console.log(doesUserExist, dataResponseObject.results);
    callback(doesUserExist, dataResponseObject.results);
  })
}

function resetpassword(resetData, callback) {
  let resetPasswordQuery = `UPDATE users SET user_password = SHA('${resetData.password}') WHERE email = '${resetData.email}'`;
  // console.log(resetPasswordQuery, resetData, 'passwordquery')
  mySqlConnection.query(resetPasswordQuery, (dataReturn) => {
    callback(dataReturn);
  })
  // ff53bed8cf9528df252886b612499fb247f85d47
}

function nextBill(groupid, callback) {
  let nextBillQuery = `SELECT money,name,createtime,after,id,type FROM multiplesingle where groupId ='${groupid}'`;
  // console.log(nextBillQuery, groupid, 'passwordquery')
  mySqlConnection.query(nextBillQuery, (dataReturn) => {
    callback(dataReturn);
  })
}

function statusLastThirty(statusData, callback) {
  let stausQuery = `SELECT
  gs.createtime,
  gs.type AS type,
  gt.fromid AS fromid,
  SUM(gt.moneypaid) AS paid,
  SUM(gt.moneyhavetopay) AS havetopay
FROM
  grouptransactionsingleanother gs
LEFT JOIN groupstransactiontableanother gt ON
  gs.id = gt.sameid
WHERE
  gs.groupid = '${statusData.groupid}' AND gt.fromid = '${statusData.fromid}' AND  gs.createtime BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND NOW()
GROUP BY
  gs.type`;

  mySqlConnection.query(stausQuery, (datareturn) => {
    callback(datareturn.results);
  })
}
//done
async function search(id) {
  //one change in where
  let searchquery = `SELECT
  X.name,
  X.ids,
  X.money,
  X.groupid,
  X.createtime,
  X.usid,
  SUM(IF(X.fromid = X.usid, 1, 0)) AS sumss
FROM
  (
  SELECT
      c.name AS name,
      c.id AS ids,
      c.createtime AS createtime,
      c.money AS money,
      o.groupid AS groupid,
      o.email,
      o.userid AS usid,
      gt.fromid
  FROM
      usergrouptable o
  LEFT JOIN grouptransactionsingleanother c ON
      c.groupid = o.groupid
  LEFT JOIN groupstransactiontableanother gt ON
      c.id = gt.sameid
  WHERE
      o.userid = '${id}'
) AS X
WHERE
  X.ids IS NOT NULL
GROUP BY
  X.ids`;

  try {
    let searchdata = await promisedData(searchquery);
    return searchdata;
  } catch (error) {
    //  console.log(error);
  }
}

async function recentactivity(recentData) {
  let recentInsertQuery = squel.insert()
    .into("recent")
    .set("groupid", recentData.groupid)
    .set("fromid", recentData.createdid)
    .set("transactionid", recentData.transactionid)
    .set("action", recentData.action)
    .set("recurring", recentData.recurringrecent)
    .set("category", recentData.category)
    .set("groupname", recentData.groupname)
    .set("transactionname", recentData.transactionname)
    .toString()
  // `money`,  `onwhat`,
  console.log(recentInsertQuery, 'recentInsertQuery');
  try {
    let resentReturnData = await promisedData(recentInsertQuery);
    // console.log(resentReturnData);
    return resentReturnData;
  } catch (error) {
    // console.log(error, 'In recent');
    return error;
  }
}

// SELECT * from(
//   SELECT
//     r.groupid,
//     r.fromid,
//     r.transactionid,
//     r.time,
//     r.money,
//     r.action,
//     r.recurring AS recurrings,
//     r.category,
//     r.groupname,
//     r.transactionname,
//     a.actionname,
//      ur.username,
//     c.categoryurl,
//     c.categoryname,
//     rc.recurring
//   FROM
//     recent r
//   LEFT JOIN action a 
//     ON a.id = r.action
//   LEFT JOIN 
//     users ur ON  ur.id = r.fromid
//   LEFT JOIN 
//     category c ON c.id = r.category
//   LEFT JOIN 
//     recurringrecent rc ON rc.id = r.recurring
//   WHERE
//     r.fromid = 61 AND (
//       r.groupid IS NULL OR (
//         r.groupid IS NOT NULL AND r.transactionid IS NULL AND r.action = 3
//       )
//     )
//   UNION
//   SELECT
//     r.groupid,
//     r.fromid,
//     r.transactionid,
//     r.time,
//     r.money,
//     r.action,
//     r.recurring AS recurrings,
//     r.category,
//     r.groupname,
//     r.transactionname,
//     a.actionname,
//     ur.username,
//     c.categoryurl,
//     c.categoryname,
//     rc.recurring
//   FROM
//     usergrouptable u
//   LEFT JOIN
//     recent r ON r.groupid = u.groupid
//   INNER JOIN 
//     users ur ON  ur.id = r.fromid
//   LEFT JOIN action a 
//     ON a.id = r.action
//   LEFT JOIN 
//     category c ON c.id = r.category
//   LEFT JOIN 
//     recurringrecent rc ON rc.id = r.recurring
//   WHERE
//     u.userid = 61
//      ) X 
//      ORDER BY
//      X.time DESC
//      LIMIT 10, 10
async function getrecentactivity(userData) {
  let query = `SELECT
  r.groupid,
  r.fromid,
  r.transactionid,
  r.time,
  r.money,
  r.action,
  r.recurring,
  r.category,
  r.groupname,
  r.transactionname,
  a.actionname,
   ur.username,
  c.categoryurl,
  c.categoryname,
  rc.recurringname
FROM
  recent r
LEFT JOIN action a 
  ON a.id = r.action
LEFT JOIN 
  users ur ON  ur.id = r.fromid
LEFT JOIN 
  category c ON c.id = r.category
LEFT JOIN 
  recurringrecent rc ON rc.id = r.recurring
WHERE
  r.fromid = '${userData.id}' AND (
    r.groupid IS NULL OR (
      r.groupid IS NOT NULL AND r.transactionid IS NULL AND r.action = 3
    )
  )
UNION
SELECT
  r.groupid,
  r.fromid,
  r.transactionid,
  r.time,
  r.money,
  r.action,
  r.recurring,
  r.category,
  r.groupname,
  r.transactionname,
  a.actionname,
  ur.username,
  c.categoryurl,
  c.categoryname,
  rc.recurringname
FROM
  usergrouptable u
LEFT JOIN
  recent r ON r.groupid = u.groupid
INNER JOIN 
  users ur ON  ur.id = r.fromid
LEFT JOIN action a 
  ON a.id = r.action
LEFT JOIN 
  category c ON c.id = r.category
LEFT JOIN 
  recurringrecent rc ON rc.id = r.recurring
WHERE
  u.userid = '${userData.id}'`;
  try {
    let recentData = await promisedData(query);
    recentsort = recentData.sort(function (a, b) { return new Date(b.time) - new Date(a.time); })
    console.log(recentData);
    return recentData;
  } catch (error) {
    console.log(error);
    return error;
  }

}

async function checkStatusPerUserPerGroup(checkStatusData) {
  let statusQuery = `SELECT
  (SUM(moneypaid) - SUM(moneyhavetopay)) AS difference
FROM
  groupstransactiontableanother
WHERE
  fromid = '${checkStatusData.id}' AND groupid = '${checkStatusData.groupid}'
GROUP BY
  fromid`;
  try {
    let statusReturn = await promisedData(statusQuery);
    // console.log(statusQuery, statusReturn);
    return statusReturn[0];
  } catch (error) {
    // console.log(error);
    return error;
  }

}

async function gettransactionname(transactionData) {
  let getnameQuery;
  let query = squel.select()
    .where("id=?", transactionData.sameid)

  try {
    if (parseInt(transactionData.recurring)) {
      getnameQuery = query.from('multiplesingle').toString();
    }
    else {
      getnameQuery = query.from('grouptransactionsingleanother').toString();
    }
    // console.log(getnameQuery);
    let getname = await promisedData(getnameQuery);
    // console.log(getname[0].name);
    return getname[0];
  } catch (error) {
    // console.log(error);
    return error;
  }
}
async function updateUserGroupTable(usergroupData) {

  var timestamp = Date.now();

  let updateQuery = squel.update()
    .table("usergrouptable")
    .set("vs", timestamp)
    .where("groupid = ?", usergroupData.groupid)
    .where("userid = ?", usergroupData.id)
    .toString();
  try {
    console.log(updateQuery);
    let updateData = await promisedData(updateQuery);
    // console.log(updateData);
    return updateData;
  } catch (error) {
    return error;
  }
}
function returnDate(Datetime) {
  // 2019-01-30 00:49:24
  var newdate = new Date(Datetime);
  // var hours = '0' + newdate.getHours();
  // var minute = '0' + newdate.getMinutes();
  // var seconds = '0' + newdate.getSeconds();
  var date = '0' + newdate.getDate();
  var month = '0' + (newdate.getMonth() + 1);
  var year = newdate.getFullYear();
  var formattedTime = year + '-' + month.substr(-2) + '-' + date.substr(-2); //  + ' ' + hours.substr(-2) + ':' + minute.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}

// async function aa() {
//   created = '2019-01-23T19:00:36.000Z'
//   aa = returnDate(created);
// console.log(aa, 'time');
//   // dd = created.toUTCString()
//   let qu = `SELECT
//   *
// FROM
// grouptransactionsingleanother
//   WHERE  id = 38 AND updatetime >= '${aa}'`;
// console.log(qu);
//   let updateData = await promisedData(qu);
// console.log(updateData);
// }
// aa();

async function getBudget(id) {
  try {
    let query = `SELECT setbudget,budget FROM users where id = '${id}'`;
    let returnData = await promisedData(query);
    return returnData[0];
  } catch (error) {
    console.log(error);
  }
}

async function statusLastThirtyHome(id) {
  try {
    let query = `SELECT
    gs.createtime,
    gt.fromid,
    SUM(gt.moneypaid) AS paid,
    SUM(gt.moneyhavetopay) AS havetopay
  FROM
    groupstransactiontableanother gt
  LEFT JOIN
    grouptransactionsingleanother gs ON gs.id = gt.sameid
  WHERE
    gt.fromid = '${id}' AND gs.createtime BETWEEN DATE_FORMAT(NOW(),
    '%Y-%m-01') AND NOW()
  GROUP BY
    gt.fromid`;
    let lastData = await promisedData(query);
    console.log(lastData);
    return lastData[0];
  } catch (error) {
    console.log(error);
  }
}

async function setbudgetModel(setbudgetData) {
  try {
    let updateQuery = squel.update()
      .table("users")
      .set("budget", setbudgetData.setbudget)
      .where("id = ?", setbudgetData.id)
      .toString();
    console.log(updateQuery);
    let setbudgetReturn = await promisedData(updateQuery);
    return setbudgetReturn;
  } catch (error) {
    console.log(error);
  }
}

async function addMembers(addMembersData) {

  console.log(addMembersData, 'addMembersin ');

  try {
    let insertaddMembersQuery = squel.insert()
      .into("members")
      .setFieldsRows(addMembersData.allMembersData)
      .toString();
    console.log(insertaddMembersQuery);
    let insertaddMembersReturn = await promisedData(insertaddMembersQuery);
    return insertaddMembersReturn;
  } catch (error) {

  }
}

async function getMembers(getMembersData) {

  console.log(getMembersData, 'getMembersData ');

  try {
    let getMembersQuery = `SELECT  profileImage , email , firstName , lastName , birthDate,
    presentAddress, permanentAddress , maritalStatus , gender , occupation ,
    middleName , mobile ,isMobilePublic,mobilePrivate , addTime , updateTime FROM members WHERE profileId='${getMembersData.id}' and isDeleted = 0`;
    let getMembersReturn = await promisedData(getMembersQuery);
    return getMembersReturn;
  } catch (error) {

  }
}

async function deleteMembers(getMembersid) {
  try {
    let getMembersQuery = squel.update()
      .table("members")
      .set("isDeleted", 1)
      .where("profileId = ?", getMembersid)
      .toString();

    let getMembersReturn = await promisedData(getMembersQuery);
    return getMembersReturn;
  } catch (error) {

  }
}

