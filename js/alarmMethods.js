function AM(){
	this.weekdayDict = {'mon':'Monday', 'tue':'Tuesday', 'wed':'Wednesday', 'thu':'Thursday', 'fri':'Friday',
						'sat':'Saturday', 'sun':'Sunday', 'nev':'Never'}
	
	AM.prototype.getCurrentTime = function(){
		var date = new Date();
		var dateStr = '';
		var Y = date.getFullYear();
		var M = date.getMonth()+1;
		var D = date.getDate();
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var dateStr = Y + '/';
		if(M < 10) dateStr += '0';
		dateStr += M + '/';
		if(D < 10) dateStr += '0';
		dateStr += D + ' ';
		if(h < 10) dateStr += '0';
		dateStr += h + ':';
		if(m < 10) dateStr += '0';
		dateStr += m + ':';
		if(s < 10) dateStr += '0';
		dateStr += s;
		return dateStr;
	}
	AM.prototype.setCurrentTime = function(elem){
		elem.innerHTML = AM.prototype.getCurrentTime();
	}
	AM.prototype.zeroPadding = function (num, digit) {
		var str = String(num);
		while (str.length < digit) {
			str = '0'+str;
		}
		return str;
	}
	// get parameters from url(not used)
	AM.prototype.getUrlParams = function() {
		var paramDict = {};
		var queries = window.location.search.substring(1);
		var params = queries.split('&');
		for(var i=0; i < params.length; i++){
			var keyValue = params[i].split('=');
			paramDict[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
		}
		return paramDict;
	}

	// local storage related methods
	AM.prototype.saveItem = function(key, obj){
		localStorage.setItem(key, JSON.stringify(obj));
	}
	AM.prototype.loadItem = function(key){
		return JSON.parse(localStorage.getItem(key));
	}
	AM.prototype.removeItem = function(key){
		localStorage.removeItem(key);
	}
	AM.prototype.setWorkingAlarmId = function(alarmId){
		localStorage.setItem('workingAlarmId', alarmId);
	}
	AM.prototype.setNewestAlarmId = function(alarmId){
		localStorage.setItem('newestAlarmId', alarmId);
	}

	AM.prototype.createNewAlarm = function(){
		var newAlarmId = -1;
		if('newestAlarmId' in localStorage)
			newAlarmId = AM.prototype.loadItem('newestAlarmId') + 1;
		else
			newAlarmId = 0;
		AM.prototype.setNewestAlarmId(newAlarmId);
		AM.prototype.setWorkingAlarmId(newAlarmId);
	}
	AM.prototype.getAllAlarmSettings = function(){
		var settings = {};
		jQuery.each(localStorage, function(key, val){
			var alarmId = parseInt(key, 10);
			if(typeof alarmId == 'number' && val != undefined){
				settings[alarmId] = AM.prototype.loadItem(alarmId);
			}
		});
		return settings;
	}

	AM.prototype.loadAlarmSetting = function(alarmId){
		if(alarmId == null) return {};
		var alarmSetting = AM.prototype.loadItem(alarmId);
		return (alarmSetting == null) ? {} : alarmSetting;
	}
	AM.prototype.loadCurrentAlarmSetting = function(){
		return AM.prototype.loadAlarmSetting(localStorage.getItem('workingAlarmId'));
	}

	AM.prototype.updateAlarmSetting = function(alarmId, settingDict){
		if(alarmId == null) return;
		var alarmSetting = AM.prototype.loadAlarmSetting(alarmId);
		for(var key in settingDict){
			alarmSetting[key] = settingDict[key];
		}
		AM.prototype.saveItem(alarmId, alarmSetting);
	}
	AM.prototype.updateWorkingAlarmSetting = function(settingDict){
		return AM.prototype.updateAlarmSetting(localStorage.getItem('workingAlarmId'), settingDict);
	}

	AM.prototype.removeAlarmSetting = function(alarmId){
		if(alarmId == null) return;
		AM.prototype.removeItem(alarmId);
	}
	AM.prototype.removeWorkingAlarmSetting = function(){
		AM.prototype.removeAlarmSetting(localStorage.getItem('workingAlarmId'));
	}
}
var am = new AM();
