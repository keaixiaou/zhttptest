$(function() {
	//
	if ( $("#tabs")[0] ) {
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
		
		// 应用选择
		$("#sele_yy").change(function(){
			if ( $(this).val() != '' ) {
				$.post( GROUP+"/Role/getNodesByPid/", {
					pid: $(this).val()
				},function(data){
					var htmlstr = '';
					for( var x in data ) {
						htmlstr += '<label><div class="checker"><span><input type="checkbox" name="chk_yy[]" value="'+data[x].id+'" /></span></div>'+data[x].title+'</label>';
					}
					$("#tabs-2").html(htmlstr);
					//
					$("label .checker:visible").click(function(){
						my_checkbox_click( $(this), false );
					});
				});
			}
			else {
				$("#tabs-2").html('');
			}
		});
		
		// 全选
		$("#btn_select_all").click(function(){
			$(".checker:visible").children("span").addClass("checked");
		});
		
		// 反选
		$("#btn_toggle").click(function(){
			$(".checker:visible").trigger("click");
		});
		
		// 全否
		$("#btn_cancel_all").click(function(){
			$(".checker:visible").children("span").removeClass("checked");
		});
	}
	

});