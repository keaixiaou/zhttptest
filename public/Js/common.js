//关闭窗口不警告
function myClose() {
    var browserName = navigator.appName;
    if (browserName=="Netscape") {
        window.open('', '_self', '');
        window.close();
    }
    else {
        if (browserName == "Microsoft Internet Explorer"){
        	var ua = navigator.userAgent;
            var IEversion = parseFloat(ua.substring(ua.indexOf("MSIE ") + 5, ua.indexOf(";", ua.indexOf("MSIE "))));
            if (IEversion < 5.5) {
                var str = '<object id=noTipClose classid="clsid:ADB880A6-D8FF-11CF-9377-00AA003B7A11">';
                str += '<param name="Command" value="Close"></object>';
                document.body.insertAdjacentHTML("beforeEnd", str);
                document.all.noTipClose.Click();
            } else {
            	window.opener = "whocares";
                window.opener = null;
                window.open('', '_top');
                window.close();
            }
        }
        else {
        	window.close();
        }
    }
}

/* cookie */
function getCookie(name) {
	var search;
	search = name + "=";
	offset = document.cookie.indexOf(search);
	if (offset != -1) {
		offset += search.length;
		var end = document.cookie.indexOf(";", offset);
		if (end == -1) end = document.cookie.length;
		return unescape(document.cookie.substring(offset, end));
	} else return "";
}
//
function setCookie(name, value) {
	document.cookie = name + "=" + value + "; path=/;";
}

// 去空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

//加入收藏
function addfavor(title, url) {
	if(confirm("网站名称："+title+"\n网址："+url+"\n确定添加收藏?")){
		var ua = navigator.userAgent.toLowerCase();
		if(ua.indexOf("msie 8")>-1){
			external.AddToFavoritesBar(url,title,'');//IE8
		}else{
			try {
				window.external.addFavorite(url, title);
			} catch(e) {
				try {
					window.sidebar.addPanel(title, url, "");//firefox
				} catch(e) {
					alert("加入收藏失败，请使用Ctrl+D进行添加");
				}
			}
		}
	}
	return false;
}
// <a href="javascript:addfavor('脚本之家','http://www.jb51.net')">加入收藏</a>

// 设为首页
function setHome(url) { 
	if (document.all){ 
		document.body.style.behavior='url(#default#homepage)'; 
		document.body.setHomePage(url); 
	}
	else if (window.sidebar){ 
		if(window.netscape){ 
			try{ 
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
			}catch (e){ 
				alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值改为 true." ); 
			} 
		}
		//
		if(window.confirm("你确定要设置"+url+"为首页吗？")==1){ 
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch); 
			prefs.setCharPref('browser.startup.homepage',url); 
		} 
	} 
}
// <a href="javascript:void(null)" onClick="setHome('http://www.jb51.net');">设为首页</a>

//
$(function(){
	// 图片居中
	function makePicMiddle( obj, width, height ) {
		obj.each(function(index,domEle){
			var wScale = $(domEle).width() / width;
			var hScale = $(domEle).height() / height;
			if ( wScale > hScale ) {
				$(domEle).css("padding-top", (height-$(domEle).height()/wScale)/2);
				$(domEle).width(width);
			}
			else {
				$(domEle).height(height);
			}
		});
	}
	// 重载验证码
	$("#verifyImg").css("cursor","pointer");
	$("#verifyImg").click(function(){
		var timenow = new Date().getTime();
		$(this).attr("src", GROUP+"/verify/" + timenow);
	});
});
