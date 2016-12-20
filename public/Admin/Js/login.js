$(function(){
	// jquery.form
	var options = {
        beforeSubmit:  showRequest,  // pre-submit callback
        success:       showResponse	 // post-submit callback
    };
	// pre-submit callback
	function showRequest(formData, jqForm, options) {
	    var queryString = $.param(formData);
	    //alert('About to submit: \n\n' + queryString);
	    return true;
	}
	// post-submit callback
	function showResponse(responseText, statusText, xhr, $form)  {
		console.log(responseText);
		if ( !responseText.status ) {
			my_show_dialog( "登录失败！</p><p>" + responseText.info );
		}
		else {
			window.location.href = GROUP;
		}
	}

	// 验证
	$("#frm_login").validate({
		errorPlacement: function(error, element) { 
		    error.appendTo( element.parent().next() ); 
		},
		submitHandler:function(form) { 
			$(form).ajaxSubmit(options);
			return false;
		}
	});
	
	// 用户名获得焦点
	$("#frm_login input[name='account']").focus();
	
	// 重载验证码
	$("#verifyImg").click(function(){
		var timenow = new Date().getTime();
		$(this).attr("src", GROUP+"/APublic/verify/" + timenow);
	});
	
	// 回车键判断
	$("#frm_login input[name='verify']").keydown(function(event){
		if( event.keyCode == 13 ) {
			$(".btn_sub_login").trigger("click");
		}
	});
	
	// 提交
	$(".btn_sub_login").click(function(){
		$("#frm_login").submit();
	});

});