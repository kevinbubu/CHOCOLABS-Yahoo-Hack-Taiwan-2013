(function(){
	yahoo.style = {};
	yahoo.style.color = {};

	yahoo.style.color.PROGRAM_TYPE_0 = 'transparent';
	yahoo.style.color.barColor = '#0062b2';
	yahoo.style.color.tabColor = '#f9ec31';
	
	yahoo.style.ad_height = 50;
	if(Titanium.Platform.osname == 'ipad'){
		yahoo.style.ad_height = 90;
	}
	
	yahoo.style.backButton = {
		backgroundImage:'images/nav/back.png',
		backgroundSelectedImage:'images/nav/back_click.png',
		width:47,
		height:44
	}
	yahoo.style.networkErrorAlert = {
		title : '錯誤',
		message : '網路連線錯誤，請稍候再試'
	}
	
	yahoo.style.noNetworkAlert = {
		title : '錯誤',
		message : '網路連線錯誤，請稍候再試'
	}

	yahoo.style.indicatorContainer = {
		width: '60dp',
		height: '60dp',
		backgroundColor: '#000',
		borderRadius: 10,
		opacity: 0.6
	}
	
	yahoo.style.saving = {
		title:'儲存中...',
		width: '60dp',
		width: '60dp'
	}
}
)();
