const Joi = require('joi');

module.exports = {
    register: register,
    login: login
}

//***********************Register Schema*/

const registerSchema = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(8).max(15).required(), // strip() check it
    confirmpassword: Joi.string().required().valid(Joi.ref('password')).options({
        language: {
            any: {
                allowOnly: '!!Passwords do not match',
            }
        }
    })
});

//***********************Login Schema*/

const loginSchema = Joi.object().keys({
    username: Joi.string().required(),
   // password: Joi.string().min(5).max(15).required(),
    password:  Joi.string().required()
});

//***********************Common If else Function to print error or Call next */

function ifelse(err, res, next) {
    if (err) {
        console.log(err);
        var message = [];
        for (let iter = 0; iter < err.details.length; iter++) {
            // message[message][iter] = err.details[iter].message;
            message.push({messages:err.details[iter].message})
        }
        res.status(400).json(message);
    }
    else
        console.log("in else");
        next();
}

//*********************Register Login Data */

function register(req, res, next) {
    var registerData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        checkpassword: req.body.checkpassword
    };
    Joi.validate(registerData, registerSchema, { abortEarly: false }, (err, value) => {
        ifelse(err, res, next);
    });
}

//*********************Login Data */

function login(req, res, next) {
    var loginData = {
        username: req.body.username,
        password: req.body.password
    };
    Joi.validate(loginData, loginSchema, { abortEarly: false }, (err, value) => {
        ifelse(err, res, next);
    });
}
