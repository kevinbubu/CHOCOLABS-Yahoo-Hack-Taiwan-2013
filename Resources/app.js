var yahoo = {};
yahoo.app = {};

Titanium.App.idleTimerDisabled = true; // 控制螢幕不鎖定

Titanium.include('data.js');
Titanium.include('network.js');
Titanium.include('ui.js');

yahoo.indicatorWin = yahoo.ui.createIndicatorWin();	
yahoo.ui.init(); 