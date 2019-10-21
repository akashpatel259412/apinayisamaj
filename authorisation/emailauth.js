let emailData = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        "type": "OAuth2",
        "user": "tpatel@argusoft.in",
        "clientId": "597636280030-n73n7sgnpubc7mk2uiu4gvol1nde0sbn.apps.googleusercontent.com",
        "clientSecret": "lvpxXxqVO4r0NzH7cGHoT9O1",
        "refreshToken": "1/e3CGzDk_eiOZLc8sQJhLNC9nSWlX10gpBAzMPPR-6wY",
        "accessToken": "ya29.GltvBhLfb-6NB7WB1IkVfyh1kZhbiOFnbCKVxhXJezs4nuc3ezk7MK1UP1wAkVYfkLaKzrykVaa68HV1hpMZ9Q53iP1Et5kDv8HHwj6E5ULC9N4Tx_ldSMbqBzSE"
    },
    from: 'tpatel@argusoft.in'
}

module.exports = emailData;

