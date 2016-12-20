$(function(){
	// 设置正文部分高度
	if ( $(".div_scroll")[0] ) {
		var newHeight = mainHeight - $("div.title").height()  - 8;	// 包括margin-bottom
		if ( $(".rSearch")[0] ) {
			newHeight = newHeight - $(".rSearch").height() - 20;	// 包括margin-bottom
		}
		//
		$(".div_scroll").css('height', newHeight+'px');
	}
	
	// 当前查询参数
	var paramNow = anaParams( SEARCH_PARAMS );
	if ( $("#frm_sch")[0] ) {
		$("#frm_sch input[name='order']").val(paramNow.order);
		$("#frm_sch input[name='sort']").val(paramNow.sort);
	}
	
	// 返回列表页
	$("div.title a").click(function(){
		var url = $(this).attr('url');
		var param = anaParams( $(this).attr('param') );
		//
		my_ajax_get(url, param);
	});
	
	// 头部操作按钮
	$(".operate input").click(function(){
		var url = $(this).attr("url");
		var ids = '';
		var param = '';
		if ( $(this).attr('param') != undefined ) {
			param = anaParams( $(this).attr('param') );
		}
		//
		switch ( $(this).attr('id') ) {
			case 'btn_add':	// 新增
			case 'btn_grp_add':	// 批新增
				my_ajax_get(url, param );
				break;
			case 'btn_del':	// 删除
				ids = get_chekced_ids();
				if ( ids == '' ) {
					my_show_dialog('请选择需操作的记录！');
				}
				else {
					param = 'id=' + ids;
					my_show_dialog_confirm( "确定要删除么？", url, param );
				}
				break;
			case 'btn_moveto':	// 转移
				ids = get_chekced_ids();
				if ( ids == '' ) {
					my_show_dialog('请选择需操作的记录！');
				}
				else {
					param = 'id=' + ids;
					my_show_dialog_confirm( "<div style='height:150px;'>转移到：<select name='cat_id' id='moveto' class='chzn-select-width3 cfm_param'>"+$("#frm_sch select[name='cat_id']").html()+"</select></div>", url, param );
					$("#moveto").children("option").eq(0).remove();
					$("#moveto").chosen({width:"200px",disable_search_threshold:20});
				}
				break;
			case 'btn_publish':	// 发布
				ids = get_chekced_ids();
				if ( ids == '' ) {
					my_show_dialog('请选择需操作的记录！');
				}
				else {
					param = 'id=' + ids + '&stt=1';
					my_show_dialog_confirm( "确定要发布么？", url, param );
				}
				break;
			case 'btn_pay':	// 发工资
				ids = get_chekced_ids();
				if ( ids == '' ) {
					my_show_dialog('请选择已发放的记录！');
				}
				else {
					param = 'id=' + ids + '&stt=1';
					my_show_dialog_confirm( "确定工资已发放么？", url, param );
				}
				break;
			case 'btn_sort':	// 排序
			case 'btn_sort_top':	// 置顶排序
				ids = get_chekced_ids();
				if ( ids != '' ) {
					param['id'] = ids;
				}
				my_ajax_get( url, param );
				break;
			case 'btn_balance_ym':	// 亿美余额查询
			case 'btn_balance_kx':	// 快信余额查询
				my_ajax_sub( url, param );
				break;
			case 'btn_create_sn':	// 生成序列号
				my_show_dialog_confirm( $(this).attr("msg"), url, param );
				break;
			case 'btn_export_sn':	// 导出序列号
			case 'btn_sttt': // 教师课时统计
				break;
			case 'btn_shouqian': // 指定售前
			case 'btn_shouhou':	//指定售后
				ids = get_chekced_ids();
				if ( ids == '' ) {
					my_show_dialog('请选择学员！');
				}
				else {
					param = 'id=' + ids;
					my_show_dialog_confirm( $(this).attr("msg"), url, param );
				}
				break;
			default:
				my_ajax_get(url, param );
				break;
		}
	});
	
	// 下拉列表框
	if ( $("select").length ) {
		var config_chosen = {
			'.chzn-select': {width:$("select").width()+'px',disable_search_threshold:20},
			'.chzn-select-width1': {width:$("select").width()+'px',disable_search_threshold:20},
			'.chzn-select-width2': {width:$("select").width()+'px',disable_search_threshold:20},
			'.chzn-select-width3': {width:$("select").width()+'px',disable_search_threshold:20},
		}
		for (var selector in config_chosen) {
			$(selector).chosen(config_chosen[selector]);
		}
	}
	
	/* 排序 */
	// 排序图标
	$("table.list .img_sort").each(function(){
		if ( paramNow.order != undefined ) {
			if ( $(this).parent('a').attr('name') == paramNow.order ) {
				if ( paramNow.sort == 'asc' ) {
					$(this).css("background-position", "left -215px");
				}
				else {
					$(this).css("background-position", "-9px -215px");
				}
			}
		}
	});
	// 按栏目排序
	$(".list thead td.title a").click(function(){
		var url = URL + "/index/";
		var param = paramNow;
		param.p = 1;
		var order_old = param.order;
		var sort_old = param.sort;
		//
		param.order = $(this).attr('name');
		param.sort = 'asc';
		if ( order_old == $(this).attr('name') && sort_old == 'asc' ) {
			param.sort = 'desc';
		}
		//
		my_ajax_get(url, param);
	});
	
	// 表格内链接（获取）
	$(".list tbody td a.a_get").click(function(){
		var url = $(this).attr('url');
		var param = anaParams( $(this).attr('param') );
		//
		my_ajax_get(url, param);
	});
	// 表格内链接（提交）
	$(".list tbody td a.a_sub").click(function(){
		var url = $(this).attr('url');
		var param = anaParams( $(this).attr('param') );
		//
		my_ajax_sub(url, param);
	});
	// 表格内链接（确认）
	$(".list tbody td a.a_confirm").click(function(){
		var msg = $(this).attr('msg');
		var url = $(this).attr('url');
		var param = $(this).attr('param');
		my_show_dialog_confirm(msg, url, param);
	});

	/* 翻页 */
	// 页码单击
	$(".page a").click(function(){
		var url = URL + "/index/";
		var param = paramNow;
		param.p = $(this).attr('p');
		//
		my_ajax_get(url, param);
	});
	// 直达某页
	$(".pg_right input").keydown(function(event){
		if( event.keyCode == 13 ) {
			var url = URL + "/index/";
			var param = paramNow;
			param.p = $(this).val();
			//
			my_ajax_get(url, param);
		}
	});
	// 每页记录条数
	$(".pg_left input").keydown(function(event){
		if( event.keyCode == 13 ) {
			var url = URL + "/index/";
			var param = paramNow;
			param.p = 1;
			param['listRows'] = $(this).val();
			//
			my_ajax_get(url, param);
		}
	});

	/* 复选框 */
	// 全选
	$(".btn_all").click(function(){
		my_check_all( $(this) );
	});
	// 列表复选框点击
	$(".chkbox .checker").click(function(){
		my_checkbox_click( $(this), true );
	});
	// 表单复选框点击
	$("label .checker").click(function(){
		my_checkbox_click( $(this), false );
	});
	// 表单单选框点击
	$("label .radio").click(function(){
		my_radio_click( $(this) );
	});

	/* 快速编辑 */
	if ( $("#quick_datepicker")[0] ) {
		$("#quick_datepicker").datepicker({
			showAnim: 'slideDown',
			onClose: function(){ $("#quick_datepicker").focus(); }
		});
	}
	//
	if ( $("#quick_timepicker")[0] ) {
		$("#quick_timepicker").datetimepicker({
			showAnim: 'slideDown',
			onClose: function(){ $("#quick_timepicker").focus(); }
		});
	}
	// 弹出快速编辑框
	$("tbody tr td").dblclick(function(){
		// 文本
		if ( $(this).attr('aqe')=='1' ) {
			$('.td_qe_now').removeClass('td_qe_now');
			$(this).addClass('td_qe_now');
			$("#quick_edit").val($(this).text());
			var leftNow = $(this).offset().left - $('.div_scroll').offset().left + 1,
				topNow = $(this).offset().top - $('.div_scroll').offset().top + $('.div_scroll').scrollTop();
			$("#quick_edit").css( { 'left':leftNow,'top':topNow,'width':$(this).width(),"display":"block"} );
			$("#quick_edit").focus();
		}
		// 日期
		if ( $(this).attr('aqdpk')=='1' ) {
			$('.td_qdpk_now').removeClass('td_qdpk_now');
			$(this).addClass('td_qdpk_now');
			$("#quick_datepicker").val($(this).text());
			var leftNow = $(this).offset().left - $('.div_scroll').offset().left + 1,
				topNow = $(this).offset().top - $('.div_scroll').offset().top + $('.div_scroll').scrollTop();
			$("#quick_datepicker").css( { 'left':leftNow,'top':topNow,'width':$(this).width(),"display":"block"} );
			$("#quick_datepicker").focus();
		}
		// 时间
		if ( $(this).attr('aqtpk')=='1' ) {
			$('.td_qtpk_now').removeClass('td_qtpk_now');
			$(this).addClass('td_qtpk_now');
			$("#quick_timepicker").val($(this).text());
			var leftNow = $(this).offset().left - $('.div_scroll').offset().left + 1,
				topNow = $(this).offset().top - $('.div_scroll').offset().top + $('.div_scroll').scrollTop();
			$("#quick_timepicker").css( { 'left':leftNow,'top':topNow,'width':$(this).width(),"display":"block"} );
			$("#quick_timepicker").focus();
		}
	});
	// 保存快速编辑文本
	$("#quick_edit").keydown(function(event){
		// 回车键提交
		if ( event.keyCode == 13 ) {
			var tdNow = $(".td_qe_now");
			var url = URL + "/quickUpdateText/";
			var param = {};
			param['id'] = tdNow.attr('idnow');
			param[tdNow.attr('colm')] = $(this).val();
			my_ajax_sub(url, param);
		}
		// Esc键取消
		if ( event.keyCode == 27 ) {
			$(".td_qe_now").removeClass('td_qe_now');
			$(this).val('');
			$(this).css("display","none");
		}
	});
	// 保存快速编辑日期
	$("#quick_datepicker").keydown(function(event){
		// 回车键提交
		if ( event.keyCode == 13 ) {
			var tdNow = $(".td_qdpk_now");
			var url = URL + "/quickUpdateDate/";
			var param = {};
			param['id'] = tdNow.attr('idnow');
			param[tdNow.attr('colm')] = $(this).val();
			my_ajax_sub(url, param);
		}
		// Esc键取消
		if ( event.keyCode == 27 ) {
			$(".td_qdpk_now").removeClass('td_qdpk_now');
			$(this).val('');
			$(this).css("display","none");
		}
	});
	// 保存快速编辑时间
	$("#quick_timepicker").keydown(function(event){
		// 回车键提交
		if ( event.keyCode == 13 ) {
			var tdNow = $(".td_qtpk_now");
			var url = URL + "/quickUpdateDate/";
			var param = {};
			param['id'] = tdNow.attr('idnow');
			param[tdNow.attr('colm')] = $(this).val();
			my_ajax_sub(url, param);
		}
		// Esc键取消
		if ( event.keyCode == 27 ) {
			$(".td_qtpk_now").removeClass('td_qtpk_now');
			$(this).val('');
			$(this).css("display","none");
		}
	});
	
	// 图片展示
	if ( $(".fancybox")[0] && !fancyBoxed ) {
		fancyBoxed = true;
		//
		$(".fancybox").fancybox({
			fitToView	: false,
			autoSize	: true,
			openEffect: 'elastic',
	        closeEffect: 'elastic',
			closeClick	: false,
			closeEffect	: 'none'
		});
	}
	
	// 弹出明细
	$("td a.pop").click(function(){
		my_show_dialog($(this).attr('cnt'));
	});
	
	// 固定位日期控件
	if ( $("#datepicker")[0] ) {
		$("#datepicker").datepicker({
			showAnim: 'slideDown',
			onClose: function(){ $("#datepicker").focus(); }
		});
	}
	//
	if ( $("#datepicker2")[0] ) {
		$("#datepicker2").datepicker({
			showAnim: 'slideDown',
			onClose: function(){ $("#datepicker2").focus(); }
		});
	}
	
	// 鼠标经过变色
	$(".main table.list tr").mouseover(function(){
		$(this).css('background','#DDEEFF');
	});
	//
	$(".main table.list tr").mouseout(function(){
		$(this).css('background','#FFFFFF');
	});
});