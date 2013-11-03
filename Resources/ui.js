(function() {
	yahoo.ui = {};
	yahoo.temp = [];
	// 1. Caff -> Jazz
	// 2. 文化 -> 卡農
	// 3. 校園 -> 盧廣仲
	var sound = Ti.Media.createSound({url:"sound/j.mp3"});
	
	yahoo.ui.init = function() {
		
		yahoo.appTabGroup = yahoo.ui.createAppTabGroup();
		var img = Ti.UI.createImageView({image:'images/Default.png'});
		yahoo.appTabGroup.add(img);
		img.animate({opacity:0.0,duration:1200},function(){
			yahoo.appTabGroup.remove(img);
			img = null;
		});
		yahoo.appTabGroup.open();
	}

	yahoo.ui.createAppTabGroup = function() {
		var appTabGroup = Titanium.UI.createTabGroup({
			barColor : '#0e063e'
		});

		yahoo.indexTab = Titanium.UI.createTab({
			window : yahoo.ui.createIndexWin()
		});
		
		appTabGroup.addTab(yahoo.indexTab);

		return appTabGroup;
	}
	
	/*
	 * 
	 */
	
	yahoo.ui.createIndexWin = function(){
		var win = Ti.UI.createWindow({
			tabBarHidden:true,
			navBarHidden:true,
			//backgroundImage:'images/background.png',
			backgroundColor:'#000'
		});
		
		var shadow = Ti.UI.createImageView({
			image:'images/shadow.png',
			width:320,
			height:45,
			top:0,
			zIndex:11111
		});
		win.add(shadow);
		
		var scrollView = Ti.UI.createScrollView({
			top:0,
			bottom:0,
			left:0,
			right:0,
			backgroundColor:'transparent',
			contentHeight:'auto',
			contentWidth:320,
			layout:'horizontal',
			opacity:0
		});
		win.add(scrollView);
		
		var subViewArray = [];
		yahoo.network.getData_no_indicator('http://107.20.224.52/yahoohack/rest/api.php?action=placelist&sid=1', function(result){
			if(result != 'error'){
				scrollView.animate({duration:1000, opacity:1});
				for(var i in result){
					if(result[i].imgurl){
						subViewArray[i] = Ti.UI.createImageView({
							image:result[i].imgurl.replace(".jpg", "_q.jpg"),
							width:106,
							height:106,
							top:0,
							left:0,
							imageUrl:result[i].imgurl,
							placename:result[i].placename,
							intro:result[i].intro,
							tagid:result[i].tagid,
							isplay:false
						});
						scrollView.add(subViewArray[i]);
					}
				}		
			}
		});
		
		scrollView.addEventListener('click', function(e){
			Ti.API.info(e.source.imageUrl);
			yahoo.ui.openPicDetailWin(e.source.imageUrl, e.source.placename, e.source.intro, e.source.tagid, e.source.isplay, nullf);
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
			textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,
			zIndex:11111
		});
		win.add(label);
		
		var tableData = [];
		/*yahoo.network.getData('http://107.20.224.52/yahoohack/rest/apibus.php?action=stop&lat=25.056327&lng=121.546388', function(result){
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
		}); */
		
		setTimeout(function(){
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
				
				tableBg.animate({top:45,duration:800, opacity:1});
		}, 1600);
		
		table.addEventListener('click', function(e){
			table.hide();
			tableBg.animate({top:480,duration:400, opacity:0});
			label.text = e.source.text;
			setTimeout(function(){
				label.animate({bottom:0,duration:600, opacity:1});
				Titanium.App.fireEvent('app:show_indicator');
			}, 700);
			
			setTimeout(function(){
				var coverView1 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[0].imageUrl,
					placename:scrollView.children[0].placename,
					intro:scrollView.children[0].intro,
					tagid:scrollView.children[0].tagid,
					isplay:true
				});
				var coverView2 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[1].imageUrl,
					placename:scrollView.children[1].placename,
					intro:scrollView.children[1].intro,
					tagid:scrollView.children[1].tagid,
					isplay:true
				});
				var coverView3 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[8].imageUrl,
					placename:scrollView.children[8].placename,
					intro:scrollView.children[8].intro,
					tagid:scrollView.children[8].tagid,
					isplay:true
				});
				var coverView4 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[9].imageUrl,
					placename:scrollView.children[9].placename,
					intro:scrollView.children[9].intro,
					tagid:scrollView.children[9].tagid,
					isplay:true
				});
				var coverView5 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[10].imageUrl,
					placename:scrollView.children[10].placename,
					intro:scrollView.children[10].intro,
					tagid:scrollView.children[10].tagid,
					isplay:true
				});
				var coverView6 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[11].imageUrl,
					placename:scrollView.children[11].placename,
					intro:scrollView.children[11].intro,
					tagid:scrollView.children[11].tagid,
					isplay:true
				});
				var coverView7 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[12].imageUrl,
					placename:scrollView.children[12].placename,
					intro:scrollView.children[12].intro,
					tagid:scrollView.children[12].tagid,
					isplay:true
				});
				scrollView.children[0].add(coverView1);
				scrollView.children[1].add(coverView2);
				scrollView.children[8].add(coverView3);
				scrollView.children[9].add(coverView4);
				scrollView.children[10].add(coverView5);
				scrollView.children[11].add(coverView6);
				scrollView.children[12].add(coverView7);
				Titanium.App.fireEvent('app:hide_indicator');
				
				sound.play();
			}, 2000);
			setTimeout(function(){
				sound.pause();
				Ti.API.info('stop');
				getNewPic();
			}, 20000);
		});
		
		function getNewPic(){
			subViewArray = [];
			yahoo.network.getData('http://107.20.224.52/yahoohack/rest/api.php?action=placelist&sid=2', function(result){
				if(result != 'error'){
					sound = Ti.Media.createSound({url:"sound/cof.mp3"});
					sound.play();
					win.remove(scrollView);
					scrollView = null;
					scrollView = Ti.UI.createScrollView({
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
					
					scrollView.addEventListener('click', function(e){
						Ti.API.info(e.source.imageUrl);
						yahoo.ui.openPicDetailWin(e.source.imageUrl, e.source.placename, e.source.intro, e.source.tagid, e.source.isplay, scrollView);
					});
					
					for(var i in result){
						if(result[i].imgurl){
							subViewArray[i] = Ti.UI.createImageView({
								image:result[i].imgurl.replace(".jpg", "_q.jpg"),
								width:106,
								height:106,
								top:0,
								left:0,
								imageUrl:result[i].imgurl,
								placename:result[i].placename,
								intro:result[i].intro,
								tagid:result[i].tagid,
								isplay:false
							});
							scrollView.add(subViewArray[i]);
						}
					}
					
					setTimeout(function(){
						var coverView1 = Ti.UI.createImageView({
							image:'images/frame.png',
							width:107,
							height:107,
							imageUrl:scrollView.children[0].imageUrl,
							placename:scrollView.children[0].placename,
							intro:scrollView.children[0].intro,
							tagid:scrollView.children[0].tagid,
							isplay:true
						});
						var coverView2 = Ti.UI.createImageView({
							image:'images/frame.png',
							width:107,
							height:107,
							imageUrl:scrollView.children[1].imageUrl,
							placename:scrollView.children[1].placename,
							intro:scrollView.children[1].intro,
							tagid:scrollView.children[1].tagid,
							isplay:true
						});
						var coverView3 = Ti.UI.createImageView({
							image:'images/frame.png',
							width:107,
							height:107,
							imageUrl:scrollView.children[2].imageUrl,
							placename:scrollView.children[2].placename,
							intro:scrollView.children[2].intro,
							tagid:scrollView.children[2].tagid,
							isplay:true
						});
						var coverView4 = Ti.UI.createImageView({
							image:'images/frame.png',
							width:107,
							height:107,
							imageUrl:scrollView.children[4].imageUrl,
							placename:scrollView.children[4].placename,
							intro:scrollView.children[4].intro,
							tagid:scrollView.children[4].tagid,
							isplay:true
						});
						var coverView5 = Ti.UI.createImageView({
							image:'images/frame.png',
							width:107,
							height:107,
							imageUrl:scrollView.children[6].imageUrl,
							placename:scrollView.children[6].placename,
							intro:scrollView.children[6].intro,
							tagid:scrollView.children[6].tagid,
							isplay:true
						});
						var coverView6 = Ti.UI.createImageView({
							image:'images/frame.png',
							width:107,
							height:107,
							imageUrl:scrollView.children[8].imageUrl,
							placename:scrollView.children[8].placename,
							intro:scrollView.children[8].intro,
							tagid:scrollView.children[8].tagid,
							isplay:true
						});
						var coverView7 = Ti.UI.createImageView({
							image:'images/frame.png',
							width:107,
							height:107,
							imageUrl:scrollView.children[9].imageUrl,
							placename:scrollView.children[9].placename,
							intro:scrollView.children[9].intro,
							tagid:scrollView.children[9].tagid,
							isplay:true
						});
						scrollView.children[0].add(coverView1);
						scrollView.children[1].add(coverView2);
						scrollView.children[2].add(coverView3);
						scrollView.children[4].add(coverView4);
						scrollView.children[6].add(coverView5);
						scrollView.children[8].add(coverView6);
						scrollView.children[9].add(coverView7);
						yahoo.temp.push(coverView1);
						yahoo.temp.push(coverView2);
						yahoo.temp.push(coverView3);
						yahoo.temp.push(coverView4);
						yahoo.temp.push(coverView5);
						yahoo.temp.push(coverView6);
						yahoo.temp.push(coverView7);
					}, 600);
				}
			});
		}
		
		return win;
	}

	yahoo.ui.openPicDetailWin = function(image_path, placename, intro, tagid, is_play, scrollView){
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
		if(is_play){
			playButton.backgroundImage = 'images/pause.png';
		}
		playButton.addEventListener('click', function(){
			sound.stop();
			sound = Ti.Media.createSound({url:"sound/s.mp3"});
			sound.play();
			playButton.backgroundImage = 'images/pause.png';
			
			if(scrollView != null){
				var coverView1 = Ti.UI.createImageView({
					image:'images/frame.png',
					width:107,
					height:107,
					imageUrl:scrollView.children[5].imageUrl,
					placename:scrollView.children[5].placename,
					intro:scrollView.children[5].intro,
					tagid:scrollView.children[5].tagid,
					isplay:true
				});
				scrollView.children[5].add(coverView1);
				scrollView.children[0].remove(yahoo.temp[0]);
				scrollView.children[1].remove(yahoo.temp[1]);
				scrollView.children[2].remove(yahoo.temp[2]);
				scrollView.children[4].remove(yahoo.temp[3]);
				scrollView.children[6].remove(yahoo.temp[4]);
				scrollView.children[8].remove(yahoo.temp[5]);
				scrollView.children[9].remove(yahoo.temp[6]);
			}
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