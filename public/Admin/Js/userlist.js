$(function() {
	
	// 角色选择
	$("#sele_role").change(function(){
		var url = GROUP + "/Role/userlist/";
		var param = { 'id':$(this).val() };
		my_ajax_get(url, param);
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
		
		
		var role_id = $("#sele_role").val();
		//
		var url = GROUP + "/Role/saveUserList/";
		var param = {'role_id':role_id,'user_ids':bandids};
		my_ajax_sub(url, param);
	});

});