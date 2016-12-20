// 宽高
var mainWidth = document.body.clientWidth;
var mainHeight = document.body.clientHeight - 50;
var contentWidth1 = mainWidth - 240;
var contentWidth2 = mainWidth - 60;

// fancyBox 防重复加载
var fancyBoxed = false;

// 显示提示框
function my_show_dialog( msg, delay, height ) {
	if ( height == undefined || height < 30 ) {
		height = 30;
	}
	$("#dialog").html('<div style="min-width:230px;"><span class="ui-icon ui-icon-alert" style="float:left; margin:2px 7px ' + height + 'px 0;"></span>' + msg + '</div>');
	$("#dialog").dialog( "open" );
	if ( delay > 0 ) {
		window.setTimeout(function(){$("#dialog").dialog( "close" );}, delay);
	}
}

// 显示确认框
function my_show_dialog_confirm( msg, url, param ) {
	$("#dialog_confirm").html('<div style="min-width:230px;"><span class="ui-icon ui-icon-info" style="float:left; margin:2px 7px 0 0;"></span><dl style="padding-left:30px;">' + msg + '</dl></div><input type="hidden" id="cfm_url" value="' + url + '" /><input type="hidden" id="cfm_param" value="' + param + '" />');
	$("#dialog_confirm").dialog( "open" );
}

// 显示进度框
function my_show_prograssbar() {
	$("#dialog_prograssbar").dialog( "open" );
}
// 关闭进度框
function my_close_prograssbar() {
	$("#dialog_prograssbar").dialog( "close" );
}

// 分析param
function anaParams( param ) {
	var result = {};
	if ( param != undefined ) {
		var temp = "";
		var ary = param.split("&");
		for (var x in ary) {
			temp = ary[x].split("=");
			result[temp[0]] = temp[1];
		}
	}
	return result;
}

// ajax获取页面
function my_ajax_get(url, param) {
	if ( param == undefined ) {
		param = {};
	}
	//
	url += 'vt/' + new Date().getTime() + "/";
	//
	$.post(url, param, function(data){
		switch( data.act ) {
			case 'reload':	// 页面刷新
				if ( null != data.info ) {
					my_show_dialog(data.info, 0);
				}
				window.location.reload();
				break;
			case 'pop':	// 弹出消息框
				my_show_dialog(data.info, 0);
				break;
			default:	// 页面跳转
				if ( data.status ) {
					$(".content").html(data.data);
//					$(".content").animate({
//						opacity: 'hide'
//					}, 200, function(){ 
//						
//						$(this).animate({
//							opacity: 'show'
//						}, { duration: 300 });
//					});
				}
				else {
					my_show_dialog(data.info, 0);
				}
				break;
		}
	});
}

// ajax提交执行
function my_ajax_sub(url, param) {
	//
	if ( param == undefined ) {
		param = {};
	}
	//
	if ( url.indexOf('create_sn') > 0 ) {
		my_show_prograssbar();
	}
	//
	$.post(url, param, function(data){
		//
		if ( url.indexOf('create_sn') > 0 ) {
			my_close_prograssbar();
		}
		// 页面重载
		if ( data.info == 'reload' ) {
			window.location.reload();
			return;
		}
		// 弹出确认框
		if ( data.info == 'confirm' ) {
			window.setTimeout(function(){
				my_show_dialog_confirm( data.data, data.url );
			}, 300);
			return;
		}
		//
		if ( data.info != null ) {
			if ( data.status )
				my_show_dialog(data.info, 1000);
			else {
				my_show_dialog(data.info);
			}
		}
		//
		if ( data.url != undefined ) {
			my_ajax_get( data.url, anaParams(data.param) );
		}
	});
}


//复选框单击
function zy_checkbox_click( obj, inList ) {
	if (obj.children("span").hasClass("checked")) {
		obj.children("span").removeClass("checked");
		if ( inList ) {
			obj.parents("tr").css("background-color","#FFFFFF");
		}
	}
	else {
		obj.children("span").addClass("checked");
		if ( inList ) {
			obj.parents("tr").css("background-color","#EEEEEE");
		}
	}
}

// 复选框单击
function my_checkbox_click( obj, inList ) {
	if (obj.children("span").children("input:checked").size() == 1) {
		obj.children("span").addClass("checked");
		if ( inList ) {
			obj.parents("tr").css("background-color","#EEEEEE");
		}
	}
	else {
		obj.children("span").removeClass("checked");
		if ( inList ) {
			obj.parents("tr").css("background-color","#FFFFFF");
		}
	}
}

// 单选框单击
function my_radio_click( obj ) {
	obj.children("span").addClass("checked");
	obj.parent("label").siblings("label").children(".radio").children("span").removeClass("checked");
}

// 选中所有
function my_check_all( obj ) {
	if ( obj.children("span").hasClass("checked") ) {
		$("tbody tr").find(".checker").children("span").removeClass("checked");
		$("tbody tr").find(".checker").children("span").children("input").attr("checked", false);
		$("tbody tr").css("background-color","#FFFFFF");
	}
	else {
		$("tbody tr").find(".checker").children("span").addClass("checked");
		$("tbody tr").find(".checker").children("span").children("input").attr("checked", true);
		$("tbody tr").css("background-color","#EEEEEE");
	}
}

// 获取所有选中项id
function get_chekced_ids() {
	var ids = '';
	$("tbody tr .checker span input:checked").each(function(idx,domEle){
		if ( $(domEle).val() != '' ) {
			if ( ids == '' )
				ids = $(domEle).val();
			else
				ids += ',' + $(domEle).val();
		}
	});
	return ids;
}

// loaded
$(function(){
	// 修改资料
	$("#btn_edit_auth").click(function(){
		var url = GROUP + "/User/edit/";
		var param = {};
		param['id'] = $(this).attr("myid"); 
		my_ajax_get(url, param);
	});
	
	// 退出后台
	$("#btn_logout").click(function(){
		my_show_dialog_confirm("确定要退出后台么？",null,null);
	});

	// 提示框
	$( "#dialog" ).dialog({
		modal: true,
		autoOpen: false,
		width: 'auto',
		show: {
			effect: "drop",
			duration: 300
		},
		hide: {
			effect: "drop",
			duration: 300
		},
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
				$("#dialog").html('');
			}
		}
	});
	
	// 确认框
	$( "#dialog_confirm" ).dialog({
		modal: true,
		autoOpen: false,
		width: 'auto',
		show: {
			effect: "drop",
			duration: 300
		},
		hide: {
			effect: "drop",
			duration: 300
		},
		buttons: {
			Ok: function() {
				//
				var cfm_url = $("#cfm_url").val();
				//
				if ( cfm_url == 'null' ) {	// 退出
					window.location.href = GROUP + "/APublic/logout/";
				}
				else {
					var param = anaParams( $("#cfm_param").val() );
					$(this).find(".cfm_param").each(function(index,domEle){
						param[$(domEle).attr('name')] = $(domEle).val();
					});
					//
					if ( param['get'] == 1 ) {
						my_ajax_get(cfm_url, param);
					}
					else {
						my_ajax_sub(cfm_url, param);
					}
				}
				//
				$(this).dialog( "close" );
				$("#dialog_confirm").html('');
			},
			Cancel: function() {
				$(this).dialog( "close" );
				$("#dialog_confirm").html('');
			}
		}
	});
	
	// 进度框
	var progressTimer,
		progressbar = $( "#progressbar" ),
		progressLabel = $( ".progress-label" ),
		dialog_pgb = $("#dialog_prograssbar").dialog({
			modal: true,
			autoOpen: false,
			closeOnEscape: false,
			resizable: false,
			width: '300px',
			show: {
				effect: "drop",
				duration: 300
			},
			hide: {
				effect: "drop",
				duration: 300
			},
			buttons: {
				Cancel: function() {
					$(this).dialog( "close" );
				}
			}
		});
	//
	progressbar.progressbar({
		value: false,
		change: function() {
			progressLabel.text( "Current Progress: " + progressbar.progressbar( "value" ) + "%" );
		},
		complete: function() {
			progressLabel.text( "Complete!" );
			dialog_pgb.dialog( "option", "buttons", [{
				text: "Close",
				click: closeDownload
			}]);
			$(".ui-dialog button").last().focus();
		}
	});

	
	// 进入后台后
	if ( $(".lefter").length ) {
		//
		$(".main").css("height", mainHeight+"px");
		$(".lefter_area").css("height", mainHeight+"px");
		$(".handle_bar").css("height", mainHeight+"px");

		// 设置左栏拉手
		function setHandleBar() {
			if ( $(".lefter").is(":visible") )
				$(".handle_bar").css("background-position", "right 230px").attr("title","收起左栏菜单");
			else
				$(".handle_bar").css("background-position", "-488px 230px").attr("title","打开左栏菜单");
		}

		// 设置正文部分宽度
		function setContentWidth() {
			//
			setHandleBar();
			//
			if ( $(".lefter").width()>70 ) {
				$(".content").animate({width: contentWidth1 + "px"}, 300);
			}
			else {
				$(".content").animate({width: contentWidth2 + "px"}, 300);
			}
		}
		//
		setContentWidth();
		
		// 左栏菜单隐现
		$("#sidebarToggleLG").click(function(){
			//
			setContentWidth();
		});
		
		// 菜单滑动
		$( "#accordion" )
		.accordion({
			header: "> div > h3"
		})
		.sortable({
			axis: "y",
			handle: "h3",
			stop: function( event, ui ) {
				ui.item.children( "h3" ).triggerHandler( "focusout" );
			}
		});
		
		// 菜单点击
		$(".menu_item").click(function(){
			//
			$(".lefter .cur").removeClass("cur").css({"background-color":"#FFFFFF", "background-position":"10px -104px"});
			$(this).addClass("cur").css({"background-color":"#EDEDED", "background-position":"10px -129px"});
			//
			var tag = $(this).attr('tag');
			var url = GROUP + "/" + tag + "/";
			if ( tag == "Index" ) {
				url += "sysinfo/";
			}
			else {
				url += "index/";
			}
			//
			my_ajax_get(url);
		});
		
		// 当前菜单
		var menuNow = $(".lefter .cur");
		if ( !menuNow.is(":visible") ) {
			menuNow.parents("div").siblings("h3").trigger("click");
			menuNow.css({"background-color":"#EDEDED", "background-position":"10px -129px"});
		}
		var url = GROUP + "/" + menuNow.attr("tag") + "/index/";
		var param = anaParams( $("#spk").val() );
		my_ajax_get(url, param);
	}

});