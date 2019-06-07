const common_func = require('../utils/common_func');
const config = require('config');

module.exports = {
    sendEmailForActivate: function (email, code) {
        var feUrl = config.get('environment.feUrl');
        var content = "Hello, please click the link bellow to verify: " + feUrl+ '/admin/verify?code='+code+'&email='+email;
        common_func.sendEmail('Wedding Dress - NO REPLY', email, 'Activate Email', content, '');
    },
    sendEmailForgotPass:function(email, code){
        var feUrl = config.get('environment.feUrl');
        var content = "Hello, please click the link bellow to reset password: " + feUrl+ '/admin/forgot?code='+code+'&email='+email;
        common_func.sendEmail('Wedding Dress - NO REPLY', email, 'Reset Password', content, '');
    }
}