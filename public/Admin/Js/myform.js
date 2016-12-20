$(function(){
	// jquery.form
	var options_bd = {
        beforeSubmit:  showRequest,  // pre-submit callback
        success:       showResponse_bd	 // post-submit callback
    };
	var options_fj = {
	    beforeSubmit:  showRequest,  // pre-submit callback
	    success:       showResponse_fj	 // post-submit callback
	};
	// pre-submit callback
	function showRequest(formData, jqForm, options) {
	    var queryString = $.param(formData);
	    //alert('About to submit: \n\n' + queryString);
	    return true;
	}
	// post-submit callback 表单
	function showResponse_bd(responseText, statusText, xhr, $form)  {
		//
		if ( responseText.status ) {
			my_show_dialog(responseText.info, 1000);
			//
			if ( responseText.url != undefined ) {
				my_ajax_get(responseText.url, responseText.param);
			}
			//
			if ( responseText.close != undefined ) {
				$(".fancybox-close").trigger('click');
			}
		}
		else {
			my_show_dialog(responseText.info);
		}
	}
	
	
	// post-submit callback 附件
	function showResponse_fj(responseText, statusText, xhr, $form) {
		//
		my_close_prograssbar();
		//
		var result = responseText.split('|');
		//
		if ( result[0] ) {
			my_show_dialog(result[1], 1000);
			//
			var idNow = result[2];
			var picNow = result[3];
			var size = result[4];
			$("#"+idNow).val(picNow);
			$("#file_"+idNow).val('');
			$("#file_"+idNow).blur();
			var src_str = "../Public/Image/"+picNow;
			if ( $("#img_"+idNow)[0] ) {	// 图片
				$("#img_"+idNow).attr("src", src_str).css("display", "inline-block");
				
				//
				var img = new Image;
				img.onload = function(){
					window.setTimeout(function(){setPointer();}, 300);
				};
				//
				img.src = src_str;
				
			}else{
				if($("#img-div-id")){
					//$("#"+idNow).hide();
					var append_img = '<div><img id="" src="'+src_str
						+'" class="frm_img" style="display inline-block">'
						+'<input type="text" class="medium middle"  name="images[]"'
						+' value="'+picNow+'"readonly />&nbsp;<input class="btn btn-green" value="删除" onclick="removeRow(this)"/></div>';
					$("#img-div-id").append(append_img);
				}
			}
			
			
			if ( $("#size_"+idNow)[0] ) {	// 图片尺寸、文件大小
				$("#size_"+idNow).val(size);
			}
		}
		else {
			my_show_dialog(result[1]);
		}
	}

	// 验证
	$("#frm1").validate({
		errorPlacement: function(error, element) { 
		    error.appendTo( element.parent().next() ); 
		},
		submitHandler:function(form) { 
			$(form).ajaxSubmit(options_bd);
			return false;
		}
	});
	
	// 定位
	function setPointer() {
		$(":file").each(function(index,domEle){
			var tempstr = $(domEle).attr("id").replace('file_','');
			if($("#"+tempstr)[0]){
				var topNow = $("#"+tempstr).offset().top - $(".div_scroll").offset().top;
				var leftNow = $("#"+tempstr).offset().left - $(".div_scroll").offset().left + 170;
			}
			$(domEle).css( {top:topNow, left:leftNow} );
		});
	}
	// ajax图文上传
	if ( $(":file")[0] ) {
		// ajax提交
		$(".file_frm").submit(function() {
			//
			my_show_prograssbar();
			//
			$(this).ajaxSubmit(options_fj); 
			return false;
		});
		// 自动提交
		$(":file").change(function(){
	    	if ( $(this).val() != '' ) {
	    		$(this).parent(".file_frm").submit();
	    	}
	    });
//		setPointer();
//		// 图片载入后定位
//		var img = new Image;
//		img.onload = function(){
//			setPointer();
//		};
		//
//		$("img").each(function(index,domEle){
//			img.src = $(domEle).attr("src");
//		});
		// 图片载入失败情况下的定位
		window.setTimeout(function(){setPointer();}, 500);
	}
	
	// 文本编辑器
	var editors = new Array();
	if ( $("#btn_show_editor")[0] ) {
		$("#btn_show_editor").click(function() {
			$.getScript( PUBLIC+"/Editor/kindeditor-min.js", function() {
				KindEditor.basePath = PUBLIC+"/Editor/";
				$("#frm1 textarea.edt").each(function(index, domEle){
					editors.push(KindEditor.create(domEle, {
						allowFileManager : true,
						pasteType: 1
					}));
				});
			});
		});
		$("#btn_show_editor").trigger("click");
	}
	
	// 提交
	$("#btn_submit").click(function(){
		$("#frm1 textarea.edt").each(function(index, domEle){
			$(domEle).val(editors[index].html());
		});
		$("#frm1").submit();
	});


});