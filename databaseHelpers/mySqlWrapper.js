const mySql = require('mysql')
let connection = null

function initConnection() {
  connection = mySql.createConnection({

   host: 'localhost',
    user: 'username',
   password: 'master',
   database: 'database',

    // host: 'localhost',
    // user: 'limbachp_userjig',
    // password: 'Qmfpj*e?1[z=',
    // database: 'limbachp_samajdbwiz',
    
    // host: 'localhost',
    // user: 'username',
    // password: 'password',
    // database: 'database',
    port: 3307
  })
}
try {
  initConnection();
  connection.connect();
} catch (error) {
  console.log('start the server');
}

function query(queryString, callback) {

  connection.query(queryString, function (error, results, fields) {
    //console.log('mySql: query: error is: ', error, ' and results are: ', results);
    callback(createDataResponseObject(error, results))
  })
}

function createDataResponseObject(error, results) {
  return {
    error: error,
    results: results === undefined ? null : results === null ? null : results
  }
}
module.exports = {
  query: query,
  connection: connection
}

