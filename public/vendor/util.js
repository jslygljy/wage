
$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name){
        return $.getUrlVars()[name];
    }
});
/*
function request(paras)
{
    var url = location.href;
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
    var paraObj = {}
    for (i=0; j=paraString[i]; i++){
        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if(typeof(returnValue)=="undefined"){
        return "";
    }else{
        return returnValue;
    }
}
*/

function isError(resultCode) {
    return (resultCode & 16) == 16;
}

function isPhoneNumberNotBind(resultCode) {
    return (resultCode & 1) == 1;
}

function isSecurityCodeNotSet(resultCode) {
    return (resultCode & 2) == 2;
}

function isPasswordExpiring(resultCode) {
    return (resultCode & 4) == 4
}

function isPasswordExpired(resultCode) {
    return (resultCode & 8) == 8;
}

function popupErrorMessage(errorMessage) {
    if(!errorMessage) {
        errorMessage = "未知错误信息!";
    }
    $.msgbox(errorMessage, {
        type : 'error',
        buttons : [
            {type: 'submit', value:'确定'}
        ]
    });
}

function checkPhoneNumberBind(loginResultCode) {
    if(isPhoneNumberNotBind(loginResultCode)) {
        var loginResponseMessage = JSON.parse(localStorage.LoginResponseMessage);
        $.msgbox(loginResponseMessage.MsgPhoneNumberNotBind, { //"您还没有绑定手机号码，请绑定!"
            type: "alert",
            buttons : [
                {type: "submit", value: "Ok"},
            ]
        }, function(result) {
            if(result === "Ok") {
                goToBindPhoneNumberPage();
                return;
            }
        });
    } else { //已绑定手机
        checkSecretCodeSet(loginResultCode);// & (~1 + 256)
    }
}

function checkSecretCodeSet(loginResultCode) {
    if(isSecurityCodeNotSet(loginResultCode)) {
        //提醒设置安全码
        var loginResponseMessage = JSON.parse(localStorage.LoginResponseMessage);
        $.msgbox(localStorage.LoginResponseMessage.MsgSecretCodeNotSet, { //"您还没有输入安全码，是否需要设置安全码?"
            type: "confirm",
            buttons : [
                {type: "submit", value: "是"},
                {type: "submit", value: "否"},
            ]
        }, function(result) {
            if(result === "是") {
                goToResetSecretCodePage(loginResultCode);
            }else { //result === "No"
                checkPasswordExpiringOrExpired(loginResultCode);
            }
        });
    }else{//已设置过安全码
        checkPasswordExpiringOrExpired(loginResultCode);
    }
}

function checkPasswordExpiringOrExpired(loginResultCode) {
    if(isPasswordExpiring(loginResultCode)) {
        var loginResponseMessage = JSON.parse(localStorage.LoginResponseMessage);
        var messageExpiring = loginResponseMessage.MsgPasswordExpring || "您的密码即将过期，是否需要修改密码?";
        $.msgbox(messageExpiring, { //"您的密码即将过期，是否需要修改密码?"
            type: "confirm",
            buttons : [
                {type: "submit", value: "是"},
                {type: "submit", value: "否"},
            ]
        }, function(result) {
            if(result === "是") {
                //loginResultCode = loginResultCode & (~1+256); //去除绑定手机号码的标记
                goToChangePasswordPage();//loginResultCode
            }else { //result === "No"
                goToHomePage(loginResultCode);
            }
        });
    }else if(isPasswordExpired(loginResultCode)) {
        $.msgbox(localStorage.LoginResponseMessage.MsgPasswordExpired, { //"您的密码已过期，请修改密码!"
            type: "alert",
            buttons : [
                {type: "submit", value: "确定"},
            ]
        }, function(result) {
            if(result === "确定") {
                goToChangePasswordPage(loginResultCode);
                return;
            }
        });
    }
    else {
        goToHomePage(loginResultCode);
    }
}


function goToBindPhoneNumberPage() {
    //goto phone number binding page
    var mobileNoMasked = localStorage.MobileNoMasked;
    var userName = localStorage.UserName;
    window.location.href = "BindPhoneNumber.html?UserName=" + userName + "&MobileNoMasked="+mobileNoMasked;
}

function goToResetSecretCodePage(loginResultCode) {
    var mobileNoMasked = localStorage.MobileNoMasked;
    var userName = localStorage.UserName;
    window.location.href = "ResetSecretCode.html?resultCode="+loginResultCode + "&UserName=" + userName + "&MobileNoMasked="+mobileNoMasked;
}

function goToChangePasswordPage() {
    var userName = localStorage.UserName || "";
    window.location.href = "ChangePassword.html?UserName="+userName;
}

function goToHomePage() {
    localStorage.LoginResponseMessage = "";//clear
    var loginAccount = localStorage.LoginAccount || "";
    window.location.href = "http://localhost:52846/Home.aspx?LoginAccount="+loginAccount;
    localStorage.LoginAccount = "";
}

function gotoLoginPage(userName) {
    userName = userName || "";
    window.location.href = "Login.html?UserName="+userName;
}

function isAdUser(userName) {
    userName = userName || "";
    return userName.indexOf('\\') != -1;
}

function checkAdUserCantResetPassword(userName) {
    if(isAdUser(userName)) {
        var errorMessage = "您的账户为AD账户，需要拨打SBIT热线支持12580进行重设账户密码";
        popupErrorMessage(errorMessage);
        return false;
    }
}

function checkAdUserCantChangePassword(userName) {
    if(isAdUser(userName)) {
        var errorMessage = "您的账户为AD账户，需要拨打SBIT热线支持12580进行修改账户密码";
        popupErrorMessage(errorMessage);
        return false;
    }
    return true;
}

function checkPasswordStrength(password) {
    if(!password) {
        var errorMessage = "密码不能为空";
        popupErrorMessage(errorMessage);
        return false;
    }
    if(password.length < 6 ) {
        var errorMessage = "密码至少为6位";
        popupErrorMessage(errorMessage);
        return false;
    }
    if (escape(password).indexOf("%u") >= 0) {
        popupErrorMessage("密码不能为中文！");
        return false;
    }

    return true;
}

function checkMobileNoMatchesMobileNoMasked(mobileNo, mobileNoMasked) {
    mobileNo = mobileNo || "";
    mobileNoMasked = mobileNoMasked || "";
    if(mobileNo.length == 0) {
        popupErrorMessage("手机号码不能为空！");
        return false;
    }
    else if (mobileNo.length != mobileNoMasked.length) {
        popupErrorMessage("填写的手机号码和预留的号码长度不一致！");
        return false;
    }

    for(i=0;i<mobileNo.length;i++){ //挨个进行比对
        if(mobileNoMasked.charAt(i) != "*" && mobileNoMasked.charAt(i) != mobileNo.charAt(i)) {
            popupErrorMessage("填写的手机号码和预留的号码不一致！");
            return false;
        }
    }

    return true;
}

function loadingMessage(message,loading) {
    if(!message) {
        return { message: '<h1><img src="loading.gif" /> 正在加载...</h1>',css: {backgroundColor: '#f00', color: '#fff' }};
    }
    else if(!!loading) {
        var msg =  '<h1><img src="loading.gif" /> '+ message + '.</h1>';
        return { message: msg,css: {backgroundColor: '#f00', color: '#fff' }};
    }
    else {
        var msg = '<h1> ' + message + '</h1>';
        return { message: msg ,css: {backgroundColor: '#f00', color: '#fff' }};
    }

}