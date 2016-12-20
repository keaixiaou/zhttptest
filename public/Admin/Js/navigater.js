$(function(){
	//
	var str = '';
	$("td[colm='url']").each(function(index,domEle){
		str = $(domEle).text();
		str = str.replace(GROUP, '__GROUP__');
		$(domEle).text(str);
	});
	//
	str = $("input[name='url']").val();
	if ( undefined != str ) {
		str = str.replace(GROUP, '__GROUP__');
		$("input[name='url']").val(str);
	}
});