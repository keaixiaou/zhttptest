$(function() {

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
	
	// 角色选择
	$("#sele_role").change(function(){
		var url = GROUP + "/Role/accredit/";
		var param = { 'id':$(this).val() };
		my_ajax_get(url, param);
	});
	
	// 应用选择
	$("#sele_yy").change(function(){
		if ( $(this).val() != '' ) {
			$.post( GROUP+"/Role/getNodesByPid/", {
				pid: $(this).val(),
				role_id: $("#sele_role").val()
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
				$("#tabs-2").html(htmlstr1);
				$("#tabs-2 label .checker").click(function(){
					my_checkbox_click( $(this), false );
				});
				//
				$("#sele_mk").html(htmlstr2);
				$("#sele_mk").trigger("liszt:updated");
			});
		}
		else {
			$("#tabs-2").html('');
		}
		$("#tabs-3").html('');
	});
	
	// 模块选择
	$("#sele_mk").change(function(){
		if ( $(this).val() != '' ) {
			$.post( GROUP+"/Role/getNodesByPid/", {
				pid: $(this).val(),
				role_id: $("#sele_role").val()
			},function(data){
				var htmlstr = '';
				for( var x in data ) {
					htmlstr += '<label><div class="checker"><span';
					if ( data[x].access == 1 ) {
						htmlstr += ' class="checked"';
					}
					htmlstr += '><input type="checkbox"';
					if ( data[x].access == 1 ) {
						htmlstr += ' checked="true"';
					}
					htmlstr += ' value="'+data[x].id+'" /></span></div>'+data[x].title+'</label>';
				}
				//
				$("#tabs-3").html(htmlstr);
				$("#tabs-3 label .checker").click(function(){
					my_checkbox_click( $(this), false );
				});
			});
		}
		else {
			$("#tabs-3").html('');
		}
	});
	
	
	// 全选
	$("#btn_select_all").click(function(){
		$(".checker:visible").children("span").addClass("checked");
		$(".checker:visible").children("span").children("input").attr('checked', true);
	});
	
	// 反选
	$("#btn_toggle").click(function(){
		$(".checker:visible").trigger("click");
	});
	
	// 全否
	$("#btn_cancel_all").click(function(){
		$(".checker:visible").children("span").removeClass("checked");
		$(".checker:visible").children("span").children("input").attr('checked', false);
	});
	
	// 保存
	$("#btn_save").click(function(){
		var tabNow = $(".tab_con:visible");
		var level = $(".tab_con").index(tabNow) + 1;
		var role_id = $("#sele_role").val();
		var pid = 0;
		switch(level) {
		case 2:
			pid = $("#sele_yy").val();
			break;
		case 3:
			pid = $("#sele_mk").val();
			break;
		}
		var node_ids = '';
		var cbxNow = '';
		$(".checker:visible").each(function(idx,domEle){
			cbxNow = $(domEle).find('input');
			if ( cbxNow.is(":checked") ) {
				node_ids += cbxNow.val() + ",";
			}
		});
		if ( node_ids != '' ) {
			node_ids = node_ids.substr(0, node_ids.length-1);
		}
		//
		var url = GROUP + "/Role/saveAccess/";
		var param = {'role_id':role_id,'node_ids':node_ids,'level':level,'pid':pid};
		my_ajax_sub(url, param);
	});

});