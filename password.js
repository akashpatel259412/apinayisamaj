const passport = require('passport');
// const Strategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const modelUser = require('./authorisation/authRoutesMethods')
const token = require('./authorisation/accessTokenModel')

//
const mySql = require('mysql')
let connection = null

function initConnection() {
    connection = mySql.createConnection({

        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mymy'
    })
}

function query(queryString, callback) {
    initConnection()
    connection.connect()
    connection.query(queryString, function (error, results, fields) {
        console.log('mySql: query: error is: ', error, ' and results are: ', results);
        connection.end();
        callback(createDataResponseObject(error, results))
    })
}

function createDataResponseObject(error, results) {
    return {
        error: error,
        results: results === undefined ? null : results === null ? null : results
    }
}
function registerUserInDB(registerData, registrationCallback) {
    console.log(registerData);
    const registerUserQuery = `INSERT INTO users (username, user_password,email,profileType,profileId) VALUES ('${registerData.username}', SHA('${registerData.password}'),'${registerData.email}','${registerData.profiletype}','${registerData.profileid}')`
    console.log(registerUserQuery);
    query(registerUserQuery, (dataResponseObject) => {
        //console.log(dataResponseObject);
        console.log(dataResponseObject, "in registed");
        doesUserExist(registerData.email, (dataResponseObject, doesUserExist, userData) => {
            registrationCallback(dataResponseObject, userData);
        })
        // if (dataResponseObject.error) {
        //   registrationCallback(dataResponseObject, null);
        // } else {

        // }
    })
}
function doesUserExist(email, callback) {

    const doesUserExistQuery = `SELECT * FROM users WHERE email = '${email}'`
    console.log(doesUserExistQuery, "in exist");
    let userData = {}
    let dataResponseObject = {}
    query(doesUserExistQuery, (dataResponseObject) => {

        if (dataResponseObject.results.length > 0) {
            console.log(dataResponseObject, "in does user exist");
            userData = {
                username: dataResponseObject.results[0].username,
                id: dataResponseObject.results[0].id,
                email: dataResponseObject.results[0].email,
                profileType: dataResponseObject.results[0].profileType
            }
            console.log(userData, "in does user exist");
        }
        const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null
        console.log(doesUserExist, "in my");
        console.log(dataResponseObject.error, "in ookk");
        callback(dataResponseObject, doesUserExist, userData);
    })
}

function registerGoogle(googleId, callback) {
    console.log(`authRoutesMethods: registerUser: req.body is:`, googleId);
    doesUserExist(googleId.email, (sqlError, doesUserExist, userData) => {
        if (doesUserExist) {
            const message = sqlError.error !== null ? "Operation unsuccessful" : "User already exists"
            const error = sqlError.error !== null ? sqlError.error : "User already exists"
            //sendResponse(res, message, sqlError)
            //return
            userData.err = sqlError.error
            userData.login = sqlError.error === null ? true : false;
            console.log(userData, "in does it exist");
            callback(userData);
        }
        else {
            registerUserInDB(googleId, (dataResponseObject, userData) => {
                userData.err = dataResponseObject.error
                //const message = dataResponseObject.error === null ? "Registration was successful" : "Failed to register user"
                console.log(userData, "in registeraaaaaaa");
                userData.login = dataResponseObject.error === null ? true : false;
                callback(userData);
                // if (dataResponseObject.error === null) {
                //     callback(userData);
                // } else {
                //     const message = "Failed to register user";
                //     callback(userData)
                //     //sendResponse(res, message, dataResponseObject.error)
                // }
            })
        }
    })
}
function checkUserByID(id, callback) {
    const doesUserExistQuery = `SELECT * FROM users WHERE id = '${id}'`
    console.log(doesUserExistQuery, "in checkby by by");
    let userData = {}
    let dataResponseObject = {}
    query(doesUserExistQuery, (dataResponseObject) => {
        console.log(dataResponseObject, "hey i am");
    })

    //     let data = await promisedData(query);
    //     if (data.rowCount > 0) {
    //         let userData = {
    //             id: data.rows[0].id,
    //             email: data.rows[0].email,
    //             username: data.rows[0].username
    //         }
    //         return ({ login: true, userData: userData });
    //     } else {
    //         return ({ login: false });
    //     }
    // } catch (err) {
    //     return ({ err: true, err: err });
    // }
}
function saveAccessToken(accessToken, userID, callback) {
    // const getUserQuery = `INSERT INTO access_tokens (access_token, user_id) VALUES ("${accessToken}", ${userID}) ON DUPLICATE KEY UPDATE access_token = "${accessToken}";`
    const getUserQuery = `INSERT INTO access_tokens (access_token, user_id) VALUES ("${accessToken}", ${userID});`
    console.log(getUserQuery);
    query(getUserQuery, (dataResponseObject) => {
        callback(dataResponseObject.error)
    })
}

module.exports = function () {
    passport.use(new GoogleStrategy({
        clientID: '364245687634-k2ncvpr0hpebhl8m6n5r8h2ngv5hp4pa.apps.googleusercontent.com',
        clientSecret: 'dJJ3x7tFZkH6oTOh3NXwDM3H',
        callbackURL: 'http://localhost:8080/auth/google/callback'
    },
        async function (accessToken, refreshToken, profile, cb) {
            console.log(accessToken, 'accesss');
            let googleId = {
                profileid: profile.id,
                email: profile.emails[0].value,
                username: profile.displayName,
                profiletype: "google"
            }
            registerGoogle(googleId, (userSession) => {
                console.log(userSession.id, "in llll");
                //token.saveAccessToken(accessToken, null, 3600, userSession,(dataReturn)=>{
                saveAccessToken(accessToken, userSession.id, (dataReturn) => {
                    if (userSession.err) {
                        return cb(err, false);
                    }
                    if (userSession.login) {
                        return cb(null, userSession);
                    }
                    else {
                        console.log("in else");
                        return cb(null, false);
                    }
                });
            });

        }
    ));
    passport.serializeUser(
        async function (data, cb) {
            console.log(data.id, "in hhh");
            cb(null, data.id);
        }
    );

    passport.deserializeUser(
        async function (id, cb) {
            console.log(id, "kkkk");
            checkUserByID(id, (checkUser) => {
                if (checkUser.err) {
                    return cb(err, false);
                }
                else {
                    console.log(checkUser, "in der");
                    cb(null, checkUser);
                }
            });
        }
    );
}