(function() {
	yahoo.data = {};
	
	var db = Titanium.Database.open('dramas');
	
	yahoo.data.init = function() {
		var favdb = Titanium.Database.open('favoritesdb');
		favdb.execute('CREATE TABLE IF NOT EXISTS favorites (id VARCHAR, name VARCHAR, introduction VARCHAR, eps_num_str VARCHAR, poster_url VARCHAR, release_date VARCHAR, views VARCHAR);');
		favdb.close();
		yahoo.data.updateDB();
	};

	yahoo.data.updateDB = function() {
		//http://106.187.40.45/api/v1/dramas/dramas_with_views_v2.json
		var url = drama.app.serverURL + '/api/v1/dramas/dramas_with_views_v2.json';
		Ti.API.info(url);
		drama.network.uploadData(url, function(result){
			if(result != 'error'){
				db.execute('UPDATE dramas SET is_show = ?;', 'f');
				
				var rows = db.execute('SELECT * FROM dramas;');
				var totalIDArray = [];
				while(rows.isValidRow()){
					totalIDArray.push(rows.fieldByName('id'));
					rows.next();
				}
				rows.close();

				var tempIdArray = [];
				
				var updateViews = "UPDATE dramas SET views = CASE";
				var updateEps = "UPDATE dramas SET eps_num_str = CASE";
				var updateIsShow = "UPDATE dramas SET is_show = CASE";
				for(var i in result){
					var needPush = true;
					for(var j in totalIDArray){
						if(result[i].id == totalIDArray[j]){
							needPush = false;
						}
					}

					if(needPush){
						tempIdArray.push(result[i].id);
					}
					else{
		        		updateViews = updateViews + " WHEN id = " + result[i].id + " THEN " + result[i].views.toString() + " ";
		        		updateEps = updateEps + " WHEN id = " + result[i].id + " THEN '" + result[i].eps_num_str.toString() + "' ";
		        		updateIsShow = updateIsShow + " WHEN id = " + result[i].id + " THEN 't' ";
					}
				}
		        updateViews = updateViews + "END ;";
		        updateEps = updateEps + "END ;";
		        updateIsShow = updateIsShow + "ELSE 'f' END ;";
		        
		        db.execute(updateViews);
		        db.execute(updateEps);
		        db.execute(updateIsShow);
				
				if(tempIdArray.length > 0){
					yahoo.data.insertDB(tempIdArray);
				}
				else{
					drama.ui.init();
				}
			}
			else{
				drama.ui.init();
			}
		});
	};
	
	yahoo.data.insertDB = function(tempIdArray) {
		//http://106.187.40.45/api/v1/dramas/new_dramas_info.json?dramas_id=
		var url = drama.app.serverURL + '/api/v1/dramas/new_dramas_info.json?dramas_id=' + tempIdArray;
		Ti.API.info(url);
		drama.network.uploadData(url, function(result){
			if(result != 'error'){
				for(var i in result){
					yahoo.data.insertDrama(result[i]);
				}
				drama.ui.init();
			}
			else{
				drama.ui.init();
			}
		});
	};

	yahoo.data.insertDrama = function(data){
		db.execute('INSERT INTO dramas (area_id, eps_num_str, id, introduction, name, poster_url, release_date, views, is_show) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', data.area_id, data.eps_num_str, data.id, data.introduction, data.name, data.poster_url, data.release_date, 0, 't');
	}
	
	yahoo.data.updateOneDrama = function(drama_id, str_array) {
		//http://106.187.40.45/api/v1/dramas/new_dramas_info.json?dramas_id=
		var url = drama.app.serverURL + '/api/v1/dramas/new_dramas_info.json?dramas_id=' + drama_id;
		Ti.API.info(url);
		drama.network.getData(url, function(result){
			db.close();
			db = Titanium.Database.open('dramas');
			if(result != 'error'){
				if(str_array != result[0].eps_num_str){
					db.execute('UPDATE dramas SET eps_num_str = ?, introduction = ?, poster_url = ? WHERE id = ?', result[0].eps_num_str, result[0].introduction, result[0].poster_url, drama_id);
					Ti.API.info(result[0].eps_num_str);
					db.close();
					db = Titanium.Database.open('dramas');
					var alertDialog = Ti.UI.createAlertDialog({
						title : '訊息',
						message : '列表已更新，請重新進入本頁面。'
					});
					alertDialog.show();
				}
				else{
					var alertDialog = Ti.UI.createAlertDialog({
						title : '訊息',
						message : '已經是最新內容。'
					});
					alertDialog.show();
				}
			}
			else{
				var alertDialog = Ti.UI.createAlertDialog(drama.style.networkErrorAlert);
				alertDialog.show();
			}
		});
	};
	
	/*
	 * 
	 */
	
	yahoo.data.getDramaList = function(area_id, callback){
		var rows = db.execute('SELECT * FROM dramas WHERE area_id = ? AND is_show = ? AND eps_num_str is NOT NULL ORDER BY views DESC;', area_id, 't');
		
		var data = [];
		while(rows.isValidRow()){
			var obj = {
				id:rows.fieldByName('id'),
				name:rows.fieldByName('name'),
				introduction:rows.fieldByName('introduction'),
				eps_num_str:rows.fieldByName('eps_num_str'),
				poster_url:rows.fieldByName('poster_url'),
				release_date:rows.fieldByName('release_date'),
				views:rows.fieldByName('views')
			};
			data.push(obj);
			rows.next();
		}
		
		rows.close();
	    callback(data);
	}
	
	yahoo.data.searchDramaList = function(keyword, callback){
		var rows = db.execute('SELECT * FROM dramas WHERE name like ? AND is_show = ? AND eps_num_str is NOT NULL ORDER BY views DESC;', '%' + keyword + '%', 't');
		
		var data = [];
		while(rows.isValidRow()){
			var obj = {
				id:rows.fieldByName('id'),
				name:rows.fieldByName('name'),
				introduction:rows.fieldByName('introduction'),
				eps_num_str:rows.fieldByName('eps_num_str'),
				poster_url:rows.fieldByName('poster_url'),
				release_date:rows.fieldByName('release_date'),
				views:rows.fieldByName('views')
			};
			data.push(obj);
			rows.next();
		}
		
		rows.close();
	    callback(data);
	}
	
	yahoo.data.getEpsStr = function(id, callback){
		var rows = db.execute('SELECT eps_num_str FROM dramas WHERE id = ?;', id);
		var data = rows.fieldByName('eps_num_str');
		rows.close();
	    callback(data);
	}
	
	/*
	 * Sort
	 */
	
	yahoo.data.sortByYear = function(area_id, year, callback){
		if(year == 2011){
			var rows = db.execute('SELECT * FROM dramas WHERE area_id = ? AND is_show = ? AND eps_num_str is NOT NULL AND release_date < ? ORDER BY views DESC;', area_id, 't', year.toString());
		}
		else{
			var rows = db.execute('SELECT * FROM dramas WHERE area_id = ? AND is_show = ? AND eps_num_str is NOT NULL AND release_date = ? ORDER BY views DESC;', area_id, 't', year.toString());
		}

		var data = [];
		while(rows.isValidRow()){
			var obj = {
				id:rows.fieldByName('id'),
				name:rows.fieldByName('name'),
				introduction:rows.fieldByName('introduction'),
				eps_num_str:rows.fieldByName('eps_num_str'),
				poster_url:rows.fieldByName('poster_url'),
				release_date:rows.fieldByName('release_date'),
				views:rows.fieldByName('views')
			};
			data.push(obj);
			rows.next();
		}
		
		rows.close();
	    callback(data);
	}
	
	yahoo.data.sortTableDataByYear = function(table, area_id, year, callback){
		var tableData = [];
		
		yahoo.data.sortByYear(area_id, year, function(result){ //area_id = 1 => 台灣
			var i = 0;
			var totalCount = 30;
			if(result.length <= 30){
				totalCount = result.length;
			}
			while(i < totalCount){
				var row = Ti.UI.createTableViewRow({
					height:150
				});
				var view1 = drama.ui.createDramaCoverView(result[i++], 'L');
				row.add(view1);
				
				if(i < result.length){
					var view2 = drama.ui.createDramaCoverView(result[i++], 'R');
					row.add(view2);
				}
				
				tableData.push(row);
			}
			table.setData(tableData);
			callback(result);
		});
	}
	
	yahoo.data.sortByView = function(area_id, callback){
		var rows = db.execute('SELECT * FROM dramas WHERE area_id = ? AND is_show = ? AND eps_num_str is NOT NULL ORDER BY views DESC;', area_id, 't');

		var data = [];
		while(rows.isValidRow()){
			var obj = {
				id:rows.fieldByName('id'),
				name:rows.fieldByName('name'),
				introduction:rows.fieldByName('introduction'),
				eps_num_str:rows.fieldByName('eps_num_str'),
				poster_url:rows.fieldByName('poster_url'),
				release_date:rows.fieldByName('release_date'),
				views:rows.fieldByName('views')
			};
			data.push(obj);
			rows.next();
		}
		
		rows.close();
	    callback(data);
	}
	
	yahoo.data.sortTableDataByView = function(table, area_id, callback){
		var tableData = [];
		
		yahoo.data.sortByView(area_id, function(result){ //area_id = 1 => 台灣
			var i = 0;
			var totalCount = 30;
			if(result.length <= 30){
				totalCount = result.length;
			}
			while(i < totalCount){
				var row = Ti.UI.createTableViewRow({
					height:150
				});
				var view1 = drama.ui.createDramaCoverView(result[i++], 'L');
				row.add(view1);
				
				if(i < result.length){
					var view2 = drama.ui.createDramaCoverView(result[i++], 'R');
					row.add(view2);
				}
				
				tableData.push(row);
			}
			table.setData(tableData);
			callback(result);
		});
	}
	
	yahoo.data.sortByUpdate = function(area_id, callback){
		var rows = db.execute('SELECT * FROM dramas WHERE area_id = ? AND is_show = ? AND eps_num_str is NOT NULL ORDER BY id DESC;', area_id, 't');

		var data = [];
		while(rows.isValidRow()){
			var obj = {
				id:rows.fieldByName('id'),
				name:rows.fieldByName('name'),
				introduction:rows.fieldByName('introduction'),
				eps_num_str:rows.fieldByName('eps_num_str'),
				poster_url:rows.fieldByName('poster_url'),
				release_date:rows.fieldByName('release_date'),
				views:rows.fieldByName('views')
			};
			data.push(obj);
			rows.next();
		}
		
		rows.close();
	    callback(data);
	}
	
	yahoo.data.sortTableDataByUpdate = function(table, area_id, callback){
		var tableData = [];
		
		yahoo.data.sortByUpdate(area_id, function(result){ //area_id = 1 => 台灣
			var i = 0;
			var totalCount = 30;
			if(result.length <= 30){
				totalCount = result.length;
			}
			while(i < totalCount){
				var row = Ti.UI.createTableViewRow({
					height:150
				});
				var view1 = drama.ui.createDramaCoverView(result[i++], 'L');
				row.add(view1);
				
				if(i < result.length){
					var view2 = drama.ui.createDramaCoverView(result[i++], 'R');
					row.add(view2);
				}
				
				tableData.push(row);
			}
			table.setData(tableData);
			callback(result);
		});
	}
	
	/*
	 * 
	 */
	
	yahoo.data.isFavorite = function(name){
		var favdb = Titanium.Database.open('favoritesdb');
		var rows = favdb.execute('SELECT * FROM favorites WHERE name = ?', name);
		returnData = rows.fieldByName('name');
		rows.close();
		favdb.close();
		
		if(returnData == null){
			return false;
		}
		else{
			return true;
		}
	};
	
	yahoo.data.saveToFav = function(id, name, introduction, eps_num_str, poster_url, release_date, views ){
		var favdb = Titanium.Database.open('favoritesdb');
		favdb.execute('INSERT INTO favorites (id, name, introduction, eps_num_str, poster_url, release_date, views) VALUES (?, ?, ?, ?, ?, ?, ?)', id, name, introduction, eps_num_str, poster_url, release_date, views);
		favdb.close();
	};
	
	yahoo.data.deleteFromFav = function( name ){
		var favdb = Titanium.Database.open('favoritesdb');
		favdb.execute('DELETE FROM favorites WHERE name = ?', name);
		favdb.close();
	}
	
	yahoo.data.getFav = function(callback){
		var favdb = Titanium.Database.open('favoritesdb');
		var rows = favdb.execute('SELECT * FROM favorites;');
		
		var data = [];
		while(rows.isValidRow()){
			var obj = {
				id:rows.fieldByName('id'),
				name:rows.fieldByName('name'),
				introduction:rows.fieldByName('introduction'),
				//eps_num_str:rows.fieldByName('eps_num_str'),
				poster_url:rows.fieldByName('poster_url'),
				release_date:rows.fieldByName('release_date'),
				views:rows.fieldByName('views')
			};
			
			obj.eps_num_str = yahoo.data.getDramaStr(obj.id);
			//Ti.API.info(obj.eps_num_str);
			
			data.push(obj);
			rows.next();
		}
		
		rows.close();
		favdb.close();
	    callback(data);
	}
	
	yahoo.data.getDramaStr = function(id){
		var rows = db.execute('SELECT * FROM dramas WHERE id = ? ;', id);
		
		var str = rows.fieldByName('eps_num_str');
		rows.close();
	    
		return str;
	}
})();
