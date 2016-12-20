$(function() {
	//
	$( "#sortable" ).sortable();
	$( "#sortable" ).disableSelection();
	//
	$("#btn_submit").click(function(){
		var seqNoList = '';
		$("#sortable .ui-state-default").each(function(idx,domEle){
			seqNoList += $(domEle).attr('myid') + ':' + (idx+1) + ",";
		});
		seqNoList = seqNoList.substr(0, seqNoList.length-1);
		//
		var topSort = $("#topSort").val();
		//
		var url = $("#url").val() + "/saveSort/";
		var param = { 'seqNoList':seqNoList,'topSort':topSort };
		//
		my_ajax_sub(url, param);
	});
	
});