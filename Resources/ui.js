(function() {
	yahoo.ui = {};
	yahoo.temp = {};

	yahoo.ui.init = function() {
		yahoo.appTabGroup = yahoo.ui.createAppTabGroup();
		yahoo.appTabGroup.open({
		});
	}

	yahoo.ui.createAppTabGroup = function() {
		var appTabGroup = Titanium.UI.createTabGroup({
			barColor : '#0e063e'
		});

		yahoo.dramaTab = Titanium.UI.createTab({
			window : yahoo.ui.createIndexWin()
		});
		
		appTabGroup.addTab(yahoo.dramaTab);

		return appTabGroup;
	}
	
	/*
	 * 
	 */
	
	yahoo.ui.createDramaWin = function(){
		var win = Ti.UI.createWindow({
			tabBarHidden:true,
			navBarHidden:true,
			//backgroundImage:'images/background.png',
			backgroundColor:'#fff'
		});
		
		var b1 = Ti.UI.createButton({
			backgroundColor:'#111',
			title:'藍調',
			width:80,
			height:80,
			top:20,
			left:20
		});
		win.add(b1);
		
		var b2 = Ti.UI.createButton({
			backgroundColor:'red',
			title:'古蹟',
			width:80,
			height:80,
			top:120,
			left:220
		});
		win.add(b2);
		
		var b3 = Ti.UI.createButton({
			backgroundColor:'blue',
			title:'清新',
			width:80,
			height:80,
			top:220,
			left:20
		});
		win.add(b3);
		
		var infoB = Ti.UI.createButton({
			backgroundColor:'blue',
			title:'i',
			width:40,
			height:40,
			top:0,
			right:0
		});
		win.add(infoB);
		
		var label = Ti.UI.createLabel({
			backgroundColor:'#222',
			width:300,
			height:40,
			bottom:0,
			text:278
		});
		win.add(label);
		
		var cover = Ti.UI.createImageView({
			width:320,
			height:480,
			backgroundImage:'url.png',
			opacity:0.7
		});
		win.add(cover);
		
		var table = Ti.UI.createTableView({
			width:320,
			height:480,
			backgroundColor:'transparent'	
		});
		win.add(table);
		
		
		var tableData = [];
		
		//
		
		yahoo.network.getData('http://107.20.224.52/yahoohack/rest/apibus.php?action=stop&lat=25.056327&lng=121.546388', function(result){
			if(result != 'error'){
				for(var i in result){
					var row = Ti.UI.createTableViewRow({
						height:50,
						data:result[i].numberZh
					});
					
					var l = Ti.UI.createLabel({
						left:30,
						text:result[i].numberZh,
						data:result[i].numberZh
					});
					row.add(l);
					
					tableData.push(row);
				}		
				table.setData(tableData);
			}
		}); 
		table.addEventListener('click', function(e){
			cover.hide();
			table.hide();
			label.text = e.source.data.toString();
			yahoo.network.getRdata()
		});
		
		infoB.addEventListener('click', function(){
			var w = yahoo.ui.createDramaDetailWin();
			w.open({
				transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
			//win.animate({view:yahoo.ui.createDramaDetailWin(),transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
		});
		
		
		// drama.appTabGroup.activeTab.open(yahoo.ui.createDramaDetailWin(e.source.data, trackPath));
		
		return win;
	}
	
	////////////////////////////////////////////////////////
	yahoo.ui.createIndexWin = function(){
		var win = Ti.UI.createWindow({
			tabBarHidden:true,
			navBarHidden:true,
			//backgroundImage:'images/background.png',
			backgroundColor:'#000'
		});
		
		var scrollView = Ti.UI.createScrollView({
			top:0,
			bottom:0,
			left:0,
			right:0,
			backgroundColor:'transparent',
			contentHeight:'auto',
			contentWidth:320,
			layout:'horizontal',
		});
		win.add(scrollView);
		
		yahoo.network.getData('http://107.20.224.52/yahoohack/rest/api.php?action=placelist&sid=1', function(result){
			if(result != 'error'){
				for(var i in result){
					if(result[i].imgurl){
						var view = Ti.UI.createImageView({
							image:result[i].imgurl.replace(".jpg", "_q.jpg"),
							width:106,
							height:106,
							top:0,
							left:0,
							placename:result[i].placename,
							intro:result[i].intro,
							tagid:result[i].tagid
						});
						scrollView.add(view);
					}
				}		
			}
		});
		
		scrollView.addEventListener('click', function(e){
			yahoo.ui.openCrossAdWin(e.source.image, e.source.placename, e.source.intro, e.source.tagid);
		});
		
		var tableBg = Ti.UI.createView({
			width:288,
			height:435,
			top:480,
			backgroundImage:'images/busbg_l.png',
			backgroundColor:'transparent',
			opacity:0
		});
		
		var table = Ti.UI.createTableView({
			width:288,
			height:435,
			backgroundColor:'transparent'
		});
		win.add(tableBg);
		tableBg.add(table);
		
		var label = Ti.UI.createLabel({
			backgroundImage:'images/busbg_s.png',
			width:280,
			height:50,
			bottom:-50,
			opacity:0,
			font:{fontSize:35},
			text:'',
			textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		win.add(label);
		
		var tableData = [];
		yahoo.network.getData('http://107.20.224.52/yahoohack/rest/apibus.php?action=stop&lat=25.056327&lng=121.546388', function(result){
			if(result != 'error'){
				var a = ['232紅', '212', '204', '232綠', '262', '919'];
				for(var i in a){
					var row = Ti.UI.createTableViewRow({
						height:50,
						text:a[i]
					});
					
					var l = Ti.UI.createLabel({
						text:a[i],
						font:{fontSize:35} 
					});
					row.add(l);
					
					tableData.push(row);
				}		
				table.setData(tableData);
				
				tableBg.animate({top:45,duration:1500, opacity:1});
			}
		}); 
		table.addEventListener('click', function(e){
			table.hide();
			tableBg.animate({top:480,duration:1500, opacity:0});
			label.text = e.source.text;
			setTimeout(function(){
				label.animate({bottom:0,duration:600, opacity:1});
			}, 1000);
			yahoo.network.getRdata();
		});
		
		return win;
	}

	yahoo.ui.openCrossAdWin = function(image_path, placename, intro, tagid){
		var win = Titanium.UI.createWindow({
			backgroundColor:'transparent',
			transform:Titanium.UI.create2DMatrix({
				scale:0
			})
		});
		
		var bg = Ti.UI.createView({
			//backgroundColor:'#000',
			backgroundImage:'images/transparent.png',
			left:0,
			right:0,
			top:0,
			bottom:0
		});
	
		var shadow = Ti.UI.createImageView({
			image:'images/shadow.png',
			width:320,
			height:45,
			top:0
		});
		var closeButton = Ti.UI.createButton({
			backgroundImage:'images/close.png',
			width:50,
			height:50,
			left:0,
			top:0,
			zIndex:11111
		});
		
		var imageView = Ti.UI.createImageView({
			image:image_path,
			//defaultImage:'images/cross_default.png',
			backgroundColor:'#000',
			width:215,
			height:215,
			top:0,
			left:0
		});
		
		//1 文化 2 夜生活 3 Cafe 4 公園 5 百貨 6 學校
		var categoryLabel = Ti.UI.createLabel({
			left:220,
			top:50,
			font:{fontSize:28},
			text:'',
			color:'#fff'
		});
		if(tagid == '1'){
			categoryLabel.text = '文化';	
		}
		else if(tagid == '2'){
			categoryLabel.text = '夜生活';
		}
		else if(tagid == '3'){
			categoryLabel.text = 'Cafe';
		}
		else if(tagid == '4'){
			categoryLabel.text = '公園';
		}
		else if(tagid == '5'){
			categoryLabel.text = '百貨';
		}
		else if(tagid == '6'){
			categoryLabel.text = '學校';
		}
		
		var placenameText = Ti.UI.createLabel({
			backgroundColor:'transparent',
			color:'#fff',
			text:placename,
			width:257,
			top:235,
			left:30
		});
		
		var introText = Ti.UI.createTextArea({
			backgroundColor:'transparent',
			color:'#fff',
			value:intro,
			width:257,
			top:260,
			height:150
		});
		
		var playButton = Ti.UI.createButton({
			backgroundImage:'images/play.png',
			width:106,
			height:107,
			left:215,
			top:105
		});
		
		win.add(bg);
		win.add(closeButton);
		win.add(imageView);
		win.add(shadow);
		win.add(playButton);
		win.add(categoryLabel);
		win.add(placenameText);
		win.add(introText);
		
		closeButton.addEventListener('click', function(){
			win.close({
				transform:Titanium.UI.create2DMatrix({
				scale:0
				}),duration:300
			});
		});
		
		var a = Titanium.UI.createAnimation({
			transform:Titanium.UI.create2DMatrix({
				scale:1.1
			}),
			duration:200
		});
		a.addEventListener('complete', function(){
			win.animate({
				transform:Titanium.UI.create2DMatrix({
					scale:1.0
				}),
				duration:200
			});
		});
		
		win.open(a);
	}


	/*
	 * 
	 */

	yahoo.ui.createIndicatorWin = function() {
		var win = Titanium.UI.createWindow({
			backgroundColor : 'transparent',
			navBarHidden : false
		});

		var indicatorView = Titanium.UI.createView({
			height : 150,
			width : 150,
			backgroundColor : '#000',
			borderRadius : 10,
			opacity : 0.8
		});
		win.add(indicatorView);

		var indicatorContainer = Titanium.UI.createActivityIndicator({
			style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
			height : 30,
			width : 30
		});

		if (Ti.Platform.osname != 'android') {
			indicatorView.add(indicatorContainer);

			// message
			var message = Titanium.UI.createLabel({
				text : 'Loading',
				color : '#fff',
				width : 'auto',
				height : 'auto',
				font : {
					fontSize : 20,
					fontWeight : 'bold'
				},
				bottom : 20
			});
			indicatorView.add(message);
		} else {
			indicatorContainer.message = "Loading";
		}

		indicatorContainer.show();

		return win;
	};

	Titanium.App.addEventListener('app:show_indicator', function() {
		yahoo.indicatorWin.open();
	});

	Titanium.App.addEventListener('app:hide_indicator', function() {
		yahoo.indicatorWin.close();
	});

})(); 