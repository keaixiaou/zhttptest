$(function(){
	// jquery.form
	var options = {
        beforeSubmit:  showRequest,  // pre-submit callback
        success:       showResponse	 // post-submit callback
    };
	// pre-submit callback
	function showRequest(formData, jqForm, options) {
	    var queryString = $.param(formData);
	    //alert('About to submit: \n\n' + queryString);
	    return true;
	}
	// post-submit callback
	function showResponse(responseText, statusText, xhr, $form)  {
		if ( responseText.status ) {
			$(".content").animate({
				opacity: 'hide'
			}, 200, function(){ 
				$(".content").html(responseText.data);
				$(this).animate({
					opacity: 'show'
				}, { duration: 300 });
			}); 
		}
	}

	// 查询
	$("#btn_search").click(function(){
		$("#frm_sch").ajaxSubmit(options);
	});
	
});