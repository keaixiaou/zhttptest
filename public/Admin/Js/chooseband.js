$(function() {

	// 插页
	$("#tabs").tabs();
	
	// 插页点击自动失去焦点
	$("#tabs li a").focus(function(){
		//this.blur();
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
	

	
	// 应用选择
	$("#select_type").change(function(){
		if ( $(this).val() != '' ) {
			$.post( GROUP+"/Activity/getTypeBand/", {
				typeid: $(this).val(),
				id: $("#act-id").val()
			},function(data){
				var htmlstr1 = '';
				var htmlstr2 = '<option value="">请选择模块</option>';
				for( var x in data ) {
					htmlstr1 += '<label><div class="checker"><span';
					if ( data[x].access == 1 ) {
						htmlstr1 += ' class="checked"';
					}
					htmlstr1 += '><input type="checkbox"';
					if ( data[x].access == 1 ) {
						htmlstr1 += ' checked="true"';
					}
					htmlstr1 += ' value="'+data[x].id+'" /></span></div>'+data[x].title+'</label>';
					//
					if ( data[x].access == 1 ) {
						htmlstr2 += '<option value="'+data[x].id+'">'+data[x].title+'</option>';
					}
				}
				//
				$("#tabs-1").html(htmlstr1);
				$("#tabs-1 label .checker").click(function(){
					zy_checkbox_click( $(this), false );
				});
				//
			});
		}
		
	});
	
	// 模块选择

	
	
	// 全选
	$("#btn_select_all").click(function(){
		$(".checker:visible").children("span").addClass("checked");
		$(".checker:visible").children("span").children("input").attr('checked', true);
	});
	
	// 反选
	$("#btn_toggle").click(function(){
		$(".checker:visible").each(function(idx,domEle){
			zy_checkbox_click($(domEle), false);
		});
	});
	
	// 全否
	$("#btn_cancel_all").click(function(){
		$(".checker:visible").children("span").removeClass("checked");
		$(".checker:visible").children("span").children("input").attr('checked', false);
	});
	
	// 保存
	$("#btn_save").click(function(){
		var tabNow = $(".tab_con:visible");
		var actid = $("#act-id").val();
		var type = $("#select_type").val();
		var bandids = '';
		var cbxNow = '';
		$(".checker:visible").each(function(idx,domEle){
			if($(domEle).find('span').hasClass('checked')){
				cbxNow = $(domEle).find('input');
					bandids += cbxNow.val() + ",";
			}
			
		});
		if ( bandids != '' ) {
			bandids = bandids.substr(0, bandids.length-1);
		}
		//
		var url = GROUP + "/Activity/saveChoose/";
		var param = {'actid':actid,'bandids':bandids,'type':type};
		my_ajax_sub(url, param);
	});

});