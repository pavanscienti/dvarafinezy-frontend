function sortByBranch(value){
	
	$('#portfolioMonitoringTable> tbody > tr').each(function() {
		//alert($(this).find('td:eq(1)').text());
		if(value == 'all' ||$(this).find('td:eq(1)').text() == value){
			$(this).show();
		}else {
			$(this).hide();
		}
	});
}
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});