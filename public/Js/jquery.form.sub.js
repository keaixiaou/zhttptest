$(function(){
	
	// 重载验证码
	$("#verifyImg").click(function(){
		var timenow = new Date().getTime();
		$(this).attr("src", GROUP+"/verify/" + timenow);
	});
	
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
	// post-submit callback 表单
	function showResponse(responseText, statusText, xhr, $form)  {
		// 信息
		if ( '' != responseText.info ) {
			alert(responseText.info);
		}
		// 重置
		if ( responseText.status ) {
			if ( $("#btn_reset")[0] ) {
				$("#btn_reset").trigger("click");
			}
		}
		// 刷新
		if ( '1' == responseText.reload ) {
			window.location.reload();
		}
		// 跳转
		if ( undefined != responseText.url ) {
			window.location.href = responseText.url;
		}
		// 弹出
		if ( undefined != responseText.pop ) {
			$("#"+responseText.pop).trigger('click');
		}
		// 关闭
		if ( '1' == responseText.close ) {
			$(".fancybox-close").trigger('click');
		}
	}

	//
	function frm_do( frm, btn ) {
	  	// 验证
		frm.validate({
			rules: {
				username: {
					required: true,
					minlength: 2
				},
				password: {
					required: true,
					minlength: 1
				},
				confirm_password: {
					required: true,
					minlength: 1,
					equalTo: "#password"
				},
				mobile: {
					number: true,
					minlength: 11
				},
				confirm_mobile: {
					number: true,
					equalTo: "#mobile"
				},
				email: {
					email: true
				},
				confirm_email: {
					email: true,
					equalTo: "#email"
				},
				agree: "required"
			},
			messages: {
				mobile: "手机号码必须为11位数字",
				agree: "请阅读服务使用协议，若无问题，请点选同意"
			},
			errorPlacement: function(error, element) {
				element.parents('li').append(error);
			},
			submitHandler:function(form) { 
				$(form).ajaxSubmit(options);
				return false;
			}
		});
		
		// 提交
		btn.click(function(){
			frm.submit();
		});
	}
	
	/* frm1 */
	if ( $("#frm1")[0] ) {
		frm_do( $("#frm1"), $("#btn_submit") );
	}

	/* frm2 */
	if ( $("#frm2")[0] ) {
		frm_do( $("#frm2"), $("#btn_submit_2") );
	}
	
	/* frm_3 */
	if ( $("#frm3")[0] ) {
		frm_do( $("#frm3"), $("#btn_submit_3") );
	}
	
	/* frm_sch */
	if ( $("#frm_sch")[0] ) {
		frm_do( $("#frm_sch"), $("#btn_submit_sch") );
	}

});
