// Initialize app and store it to myApp variable for futher access to its methods
var myApp = new Framework7({
    pushState: true,
    swipePanel: 'left',
});

// We need to use custom DOM library, let's save it to $$ variable:
var $$ = Framework7.$;

// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});
var mySwiper = myApp.swiper('.swiper-container', {
   pagination:'.swiper-pagination'
});

// 加载flag
var loading = false;
 
// 上次加载的序号
var lastIndex = $$('.list-block li').length;
 
// 每次加载添加多少条目
var itemsPerLoad = 3;
 
// 注册'infinite'事件处理函数
$$('.infinite-scroll').on('infinite', function () {
 
  // 如果正在加载，则退出
  if (loading) return;
 
  // 设置flag
  loading = false;
 
  // 模拟1s的加载过程
    // 重置加载flag
    loading = true;
    // 生成新条目的HTML
    var html = '';
    var i = lastIndex + 1;
    $$.get("json/wage.json", function(data) {
        data = JSON.parse(data);
        if (data.EmployeeInfoEntity.length > lastIndex) {
            var strHtml = ''
          	for (i; i <= lastIndex + itemsPerLoad; i++) {
          		if (i%2 ==0) { 
                  strHtml +='<div class="moneyList moneyRight moneyred">'
                  for (var j =0; j <data.EmployeeInfoEntity[i].A_List.length; j++) {
                      strHtml +='<p>'+ data.EmployeeInfoEntity[i].A_List[j].Name +':<span>¥'+ data.EmployeeInfoEntity[i].A_List[j].Money +'</span></p>'
                  };
                  strHtml +='<p><i class="icon demo-icon-1"></i><a href="#" class="tabbar-label">工资详细</a></p>'
                  strHtml +='</div>'
                }else{
                  strHtml +='<div class="moneyList moneyLeft moneyBule">'
                  for (var j =0; j <data.EmployeeInfoEntity[i].A_List.length; j++) {
                      strHtml +='<p>'+ data.EmployeeInfoEntity[i].A_List[j].Name +':<span>¥'+ data.EmployeeInfoEntity[i].A_List[j].Money +'</span></p>'
                  };
                  strHtml +='<p><i class="icon demo-icon-1"></i><a href="#" class="tabbar-label">工资详细</a></p>'
                  strHtml +='</div>'
                }
            }
        }else{
            myApp.alert("暂时没有数据");
        }

          var monthNum = '';
          var i = lastIndex + 1;
          for (i; i <= lastIndex ; i++) {
            monthNum += '<li class="moneyred"><span>'+ data.EmployeeInfoEntity[i].PayPeriod +'</span><span>月份</span></li>'
          };
          if (data.EmployeeInfoEntity.length > lastIndex) {
            $$(".wageAlllist").append(monthNum);
          }
    })

    // 更新最后加载的序号
    lastIndex = $$('.monthMoney .moneyList').length;

    var mNum = $$(".wageAlllist li").length;

  	for (var i = 0; i < mNum; i++) {
  		var mlength = ( i==0 ? '62' : '260'* + i +'');
  		$(".wageAlllist li").eq(i).attr("style","top:"+ mlength +"px")
  		$(".monthMoney .moneyList").eq(i).attr("style","top:"+ mlength +"px")
  	};

  	var initNum = ($(".wageAlllist li").length-1) * 280 +62 ;
      $$(".rightLine").attr("style","height:"+initNum+"px");
   
});  


$$("body").on("click",".newLeft ul li",function(){
    $$(".newLeft ul li").removeClass("newIcon2");
    $$(this).addClass("newIcon2");
});

//首页读取新闻
$$.get("json/newlist.json", function(data) {
      data = JSON.parse(data)
      var strHtml = '';     
      for (var i =0; i <data.NewsList.length; i++) {
          strHtml +='<li id="newDetail" new-data="'+ data.NewsList[i].ID +'">'
          strHtml +='<a href="newDetail.html?id='+ data.NewsList[i].ID +'">';
          strHtml +='<div class="content-block-title">'+ data.NewsList[i].Title +'</div>';
          strHtml +='<p>';
          strHtml +=''+data.NewsList[i].Body+'';
          strHtml +='</p>';
          strHtml +='<span>'+data.NewsList[i].ModifyDate+'</span>';
          strHtml +='</a>';
          strHtml +='</li>'
      };

      $$(".newRight ul").html(strHtml)
      
      for (var i =0; i <data.NewsList.length; i++) {
          if (data.NewsList[i].Tabs === '公告通知') {
            var strHtml2 = '';     
            strHtml2 +='<li id="newDetail" new-data="'+ data.NewsList[i].ID +'"><a href="newDetail.html?id='+ data.NewsList[i].ID +'" class="item-link item-content index_list">'
            strHtml2 +='<div class="item-media"><img src="public/images/logo1.png"></div>';
            strHtml2 +='<div class="item-inner">';
            strHtml2 +='<div class="item-title-row">';
            strHtml2 +='<div class="item-title">'+ data.NewsList[i].Title +'</div>';
            strHtml2 +='</div>';
            strHtml2 +='<div class="item-subtitle">'+ data.NewsList[i].Body +'</div>';
            strHtml2 +='<div class="item-subtitle dataTime">'+ data.NewsList[i].ModifyDate +'</div>';
            strHtml2 +='</div></a></li>'
            $$("#newType1 ul").append(strHtml2)
          } 
          else{
            var strHtml3 = '';     
            strHtml3 +='<li id="newDetail" new-data="'+ data.NewsList[i].ID +'"><a href="newDetail.html?id='+ data.NewsList[i].ID +'" class="item-link item-content index_list">'
            strHtml3 +='<div class="item-media"><img src="public/images/logo1.png"></div>';
            strHtml3 +='<div class="item-inner">';
            strHtml3 +='<div class="item-title-row">';
            strHtml3 +='<div class="item-title">'+ data.NewsList[i].Title +'</div>';
            strHtml3 +='</div>';
            strHtml3 +='<div class="item-subtitle">'+ data.NewsList[i].Body +'</div>';
            strHtml3 +='<div class="item-subtitle dataTime">'+ data.NewsList[i].ModifyDate +'</div>';
            strHtml3 +='</div></a></li>'
            $$("#newType2 ul").append(strHtml3)
          }
      };
});


$$(document).on('pageInit', function (e) {

    //新闻列表
    $$.get("json/newlist.json", function(data) {
        data = JSON.parse(data)
        var strHtml = '';     
        for (var i =0; i <data.NewsList.length; i++) {
            strHtml +='<li id="newDetail" new-data="'+ data.NewsList[i].ID +'">'
            strHtml +='<a href="newDetail.html?id='+ data.NewsList[i].ID +'">';
            strHtml +='<div class="content-block-title">'+ data.NewsList[i].Title +'</div>';
            strHtml +='<p>';
            strHtml +=''+data.NewsList[i].Body+'';
            strHtml +='</p>';
            strHtml +='<span>'+data.NewsList[i].ModifyDate+'</span>';
            strHtml +='</a>';
            strHtml +='</li>'
        };
        
        $$(".newRight ul").html(strHtml);
        var page = e.detail.page;
        // Code for About page
        if (page.name === 'newdetail') {
            var _num = $(this).index();
            var strHtml =''+ data.NewsList[0].Body +'';
            $$(page.container).find('.newH3').append(data.NewsList[0].Title);
            $$(page.container).find('.newspan2 span').append(data.NewsList[0].ModifyDate);
            $$(page.container).find('#pageBody').append(strHtml);
            
        }
          
    });

    //工资列表
    $$.get("json/wage.json", function(data) {
        data = JSON.parse(data)
        $$("#leftname").html('欢迎您，'+data.EmployeeInfoEntity[0].StaffName)+'!';
        $$("#username").html(data.EmployeeInfoEntity[0].StaffName);
        $$("#userpleace").html(data.EmployeeInfoEntity[0].DepartmentName);
        $$("#userLogin").html(data.EmployeeInfoEntity[0].PrintDate);
        $$("#userBegin").html(data.EmployeeInfoEntity[0].BeginDate);
        $$("#userEnd").html(data.EmployeeInfoEntity[0].EndDate);
        $$('#wageMonth').html(data.EmployeeInfoEntity[0].PayPeriod);
        $$("#moneyB").html(data.EmployeeInfoEntity[0].DeductToalValue)
        $$("#moneyD").html(data.EmployeeInfoEntity[0].ActualToalValue)
        $$("#moneyE").html(data.EmployeeInfoEntity[0].CompToalCost)
        $$('#wageIncome').html(data.EmployeeInfoEntity[0].IncomeTotalValue);
        $$('#wageIncome2').html(data.EmployeeInfoEntity[0].IncomeTotalValue);
        var strHtml = '';  
        for (var i =0; i <data.EmployeeInfoEntity[0].A_List.length; i++) {
            strHtml +='<p>'+ data.EmployeeInfoEntity[0].A_List[i].Name +':<span>¥'+ data.EmployeeInfoEntity[0].A_List[i].Money +'</span></p>'
        };
        $$("#wageList").append(strHtml);

        var strHtml2 = '';  
        for (var i =0; i <data.EmployeeInfoEntity[0].A_List.length; i++) {
            strHtml2 +='<p>'+ data.EmployeeInfoEntity[0].A_List[i].Name +':<span>¥'+ data.EmployeeInfoEntity[0].A_List[i].Money +'</span></p>'
        };
        $$("#wageA").append(strHtml2);

        var strHtml3 = '';  
        for (var i =0; i <data.EmployeeInfoEntity[0].B_List.length; i++) {
            strHtml3 +='<p>'+ data.EmployeeInfoEntity[0].B_List[i].Name +':<span>¥'+ data.EmployeeInfoEntity[0].B_List[i].Money +'</span></p>'
        };
        $$("#wageB").append(strHtml3);

        var strHtml4 = '';  
        for (var i =0; i <data.EmployeeInfoEntity[0].D_List.length; i++) {
            strHtml4 +='<p>'+ data.EmployeeInfoEntity[0].D_List[i].Name +':<span>¥'+ data.EmployeeInfoEntity[0].D_List[i].Money +'</span></p>'
        };
        $$("#wageD").append(strHtml4);

        var strHtml5 = '';  
        for (var i =0; i <data.EmployeeInfoEntity[0].Remarks.length; i++) {
            strHtml5 +='<p>'+ data.EmployeeInfoEntity[0].Remarks[i].Remarks +'</p>'
        };
        $$("#wageRemarks").append(strHtml5);
    });
})
  

  //倒计时方法
  var wait=60;
  function time(o) {
        if (wait == 0) {
            o.removeAttribute("disabled");   
            o.removeAttribute("style")        
            o.value="获取验证码";
            wait = 60;
        } else {
            o.setAttribute("disabled", true);
            o.setAttribute("style","background-color:#f6f6f8;color:#241e20;border: 1px #241e20 solid;")
            o.value="重新发送(" + wait + ")";
            wait--;
            setTimeout(function() {
                time(o)
            },
            1000)
        }
    }

    $$("#txtPhoneNumber").keyup(function() {
        var val = $(this).val();
        val = val.replace(/[^\d]/g,'');
        $(this).val(val);
    });

//    $("#txtPhoneNumber").on("paste",function() {
//        var val = clipboardData.setData('text',clipboardData.getData('text').replace(/[^/d]/g,''));
//        $(this).val(val);
//    });

    $$(function() {
        $(document).ajaxStop($.unblockUI);
    });

    

    $$("body").on("click","#btnSubmit",function(){
        if(validateInputFields() == false) {
            return;
        }

        $.blockUI();
        var txtUserNameVal = $("#txtUserName").val();
        var txtNewPasswordVal = $("#txtNewPassword").val();
        var txtValidationCodeVal = $("#txtValidationCode").val();
        sendResetPasswordRequest(txtUserNameVal,txtNewPasswordVal,txtValidationCodeVal);
    });

    $$("body").on("click","#btCancel",function(){
        var txtUserNameVal = $("#txtUserName").val();
        gotoLoginPage(txtUserNameVal);
    });


    function validatePhoneNumberField() {
        var txtPhoneNumberVal = $("#txtPhoneNumber").val();
        txtPhoneNumberVal = txtPhoneNumberVal.replace(/[^\d]/g,'');
        $("#txtPhoneNumber").val(txtPhoneNumberVal);

        if(!txtPhoneNumberVal || txtPhoneNumberVal.length != 11) {
            var errorMessage = "请输入正确的手机号码";
            popupErrorMessage(errorMessage);
            return false;
        }

        return true;
    }

    function validateInputFields() {
        var txtUserNameVal = $("#txtUserName").val();

        var txtNewPasswordVal = $("#txtNewPassword").val();
        var txtNewPassword2Val = $("#txtNewPassword2").val();

        if(!txtUserNameVal) {
            var errorMessage = "请输入正确的用户账号";
            popupErrorMessage(errorMessage);
            return false;
        }

        if(validatePhoneNumberField() == false) {
            return false;
        }

        if(checkPasswordStrength(txtNewPasswordVal) == false ) {
            return false;
        }

        if(txtNewPasswordVal!=txtNewPassword2Val) {
            popupErrorMessage("输入的两次密码不一致！");
            return false;
        }

        if(checkAdUserCantResetPassword(txtUserNameVal) == false) {
            return false;
        }

        return true;
    }

  $$("body").on("click","#btnSendValidationCode",function(){
        var txtUserNameVal = $("#txtUserName").val();
        var txtPhoneNumberVal = $("#txtPhoneNumber").val();

        if(validatePhoneNumberField() == false) {
            return;
        }

      time(this);
        sendValidationCodeRequest(txtUserNameVal,txtPhoneNumberVal);
  });

    function sendValidationCodeRequest(userName, phone) {
        var sendTag = 0; //reset password
        var post_data = "UserName=" + userName.toString() + "&" + "Phone=" + phone.toString() + "&SendTag=0";
        $.ajax({
            type       : "POST",
            url: "http://localhost:52846/api/login/SendValidationCode",
            data: post_data,
            dataType   : "json",
            success    :sendValidationCodeSucceeded,
            error:sendValidationCodeFailed
        });
    }//sendValidationCodeRequest

    function sendValidationCodeSucceeded(data,status,xhr) {
        //none
    }//sendValidationCodeSucceeded

    function sendValidationCodeFailed(xhr,status,error) {
        popupErrorMessage(error);
    }

    function sendResetPasswordRequest(userName,newPassword,validationCode) {
        var moduleSource = 4; //mEmployee
        var post_data = "UserName=" + userName.toString() + "&" + "NewPassword=" + newPassword.toString() + "&ValidateCode=" + validationCode.toString() + "&ModuleSource=" + moduleSource ;
        $.ajax({
            type       : "POST",
            url: "http://localhost:52846/api/login/ResetPassword",
            data: post_data,
            dataType   : "json",
            success    :sendResetPasswordSucceeded,
            error:sendResetPasswordFailed
        });
    }

    function sendResetPasswordSucceeded(data,status,xhr) {
        if(data.Head.ResultCode == 0) {
            var txtUserNameVal = $("#txtUserName").val();
            gotoLoginPage(txtUserNameVal);
        }else {
            popupErrorMessage(data.Head.ResultMessage);
        }

    }//sendResetPasswordSucceeded

    function sendResetPasswordFailed(xhr,status,error) {
        popupErrorMessage(error);
    }