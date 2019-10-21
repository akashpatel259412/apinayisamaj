let userDBHelper
let accessTokensDBHelper
module.exports =  (injectedUserDBHelper, injectedAccessTokensDBHelper) => {
  userDBHelper = injectedUserDBHelper
  accessTokensDBHelper = injectedAccessTokensDBHelper
  return  {
    getClient: getClient,
    saveAccessToken: saveAccessToken,
    getUser: getUser,
    grantTypeAllowed: grantTypeAllowed,
    getAccessToken: getAccessToken,
    //saveAuthorizationCode: saveAuthorizationCode
    }
}
// function saveAuthorizationCode(){

// }
function getClient(clientID, clientSecret, callback){
  const client = {
    clientID,
    clientSecret,
    grants: null,
    redirectUris: null
  }
  callback(false, client);
}

function grantTypeAllowed(clientID, grantType, callback) {
  console.log('grantTypeAllowed called and clientID is: ', clientID, ' and grantType is: ', grantType);
  callback(false, true);
}

function getUser(username, password, callback){
  userDBHelper.getUserFromCrentials(username, password, callback)
}

function saveAccessToken(accessToken, clientID, expires, user, callback){
  console.log('saveAccessToken() called and accessToken is: ', accessToken,
  ' and clientID is: ',clientID, ' and user is: ', user, ' and accessTokensDBhelper is: ', accessTokensDBHelper)
    accessTokensDBHelper.saveAccessToken(accessToken, user.id, callback)
}

function getAccessToken(bearerToken, callback) {
  console.log('lll');
  accessTokensDBHelper.getUserIDFromBearerToken(bearerToken, (userID) => {
    const accessToken = {
      user: {
        id: userID,
      },
      expires: null
    }
    callback(userID == null ? true : false, userID == null ? null : accessToken)
  })
}


exports.saveAccessToken = saveAccessToken;