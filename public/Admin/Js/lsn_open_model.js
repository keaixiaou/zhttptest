$(function(){
	// 插页
	$("#tabs").tabs();
	// 插页点击自动失去焦点
	$("#tabs li a").focus(function(){
		this.blur();
	});
	// 插页点击
	$("#tabs li a").click(function(){
		var tabNow = $("#tabs li a").index(this);
		$("#div_sele dl").each(function(idx,domEle){
			if ( idx <= tabNow ) {
				$(domEle).css('display', 'block');
			}
			else {
				$(domEle).css('display', 'none');
			}
		});
	});
	// 默认插页点击
	$("#tabs li a").eq(0).trigger("click");
	
	//
	$( document ).on( "click", ".close_btn_l", function() {
		$(this).removeClass('close_btn_l').addClass('open_btn_l').val('opened');
		$(this).parent('td').append('<input type="hidden" name="lsn_ids[]" value="'+$(this).attr('lsn_id')+'" />')
	});
	//
	$( document ).on( "click", ".open_btn_l", function() {
		$(this).removeClass('open_btn_l').addClass('close_btn_l').val('closed');
		$(this).siblings("input[type='hidden']").remove();
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
		//
		alert(responseText.info);
	}
	// 提交
	$("#btn_submit_1").click(function(){
		$("#frm1").ajaxSubmit(options);
	});
	$("#btn_submit_2").click(function(){
		$("#frm2").ajaxSubmit(options);
	});
	$("#btn_submit_3").click(function(){
		$("#frm3").ajaxSubmit(options);
	});
	$("#btn_submit_4").click(function(){
		$("#frm4").ajaxSubmit(options);
	});
	$("#btn_submit_5").click(function(){
		$("#frm5").ajaxSubmit(options);
	});
	$("#btn_submit_6").click(function(){
		$("#frm6").ajaxSubmit(options);
	});
	$("#btn_submit_7").click(function(){
		$("#frm7").ajaxSubmit(options);
	});
	
	// 全选
	$("input.sel_all").click(function(){
		$(this).parents('form').find('.close_btn_l').trigger('click');
	});
	// 取消
	$("input.cancel_all").click(function(){
		$(this).parents('form').find('.open_btn_l').trigger('click');
	});
	
	//
	$(".thesame").change(function(){
		//
		var frmNow = $(this).parents('form');
		//
		frmNow.find("input.cancel_all").trigger('click');
		//
		if ( $(this).val() != '' ) {
			//
			$.post(URL + '/ajax_get_mdl_lsns', {
				weekday: $(this).val(),
				tch_id: $("input[name='tch_id']").val()
			}, function(data){
				if ( data.status ) {
					//
					for (key in data.data) {
						frmNow.find('.close_btn_l').each(function(index,domEle){
							if ( $(domEle).attr('lsn_id') == data.data[key]['lsn_id'] ) {
								$(domEle).trigger('click');
							}
						});
					}
				}
				else {
					alert(data.info);
				}
			});
		}
	});


});
