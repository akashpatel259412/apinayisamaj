const nodemailer = require('nodemailer');
const emailData = require('./emailauth');
const transporter = nodemailer.createTransport({
    host: emailData.host,
    port: emailData.port,
    secure: emailData.secure,
    auth: emailData.auth
});

module.exports = {
    email: email
}

async function email(data) {
    try {
        console.log(data, 'email data')
        let mailOptions = {
            from: emailData.from,
            bcc: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html
        }
        console.log(mailOptions, 'mail')
        let res = await transporter.sendMail(mailOptions);
        console.log(res);
        return res;
    } catch (error) {
        console.log(error, 'email error')
        return;
    }

}
