(function(){

$(document).on('pageshow','#start', function(){
	am.setCurrentTime(document.getElementById('start_timeDiv'));
	setInterval(function(){
		am.setCurrentTime(document.getElementById('start_timeDiv'));
	}, 1000);
	$('#start_createIdAnchor').click(am.createNewAlarm);
	var alarmSettings = am.getAllAlarmSettings();
	jQuery.each(alarmSettings, function(key, val){
		if(key == "NaN") return true;
		var alarmElem = $('#start_alarmList').find('#start_alarmId-' + key);
		if(alarmElem.length > 0) return true;
		var $parsedDOM = $.parseHTML(
			"<li class='ui-btn ui-li'>\n\
				<a href='#alarmSetting' class='ui-link-inherit'>\n\
					<div><h1 id='start_alarmTime' class='ui-li-heading'></h1></div>\n\
					<div class='ui-grid-b'>\n\
						<div class='ui-block-a'><p id='start_sleepingTimeText'></p></div>\n\
						<div class='ui-block-b'><p id='start_titleText'></p></div>\n\
						<div class='ui-block-c'><p id='start_soundText'></p></div>\n\
					</div>\n\
				</a>\n\
			</li>"
		);
		$($parsedDOM).attr('id', 'start_alarmId-' + key);
		var alarmTimeStr = val['time'];
		$($parsedDOM).find('#start_alarmTime').append(alarmTimeStr);
		$($parsedDOM).find('#start_sleepingTimeText').append(calcSleepTime(alarmTimeStr));
		$($parsedDOM).find('#start_titleText').append(val['title']);
		$($parsedDOM).find('#start_soundText').append(val['sound']);
		$($parsedDOM).find('a').click(function(){
			am.setWorkingAlarmId(key);
		});
		$('#start_alarmList').append($parsedDOM);
	});
});

var calcSleepTime = function(alarmTimeStr){
	var splitStr = alarmTimeStr.split(':');
	var alarmHour = parseInt(splitStr[0], 10);
	var alarmTotalMin = alarmHour * 60 + parseInt(splitStr[1], 10);
	var now = new Date();
	var nowTotalMin = now.getHours() * 60 + now.getMinutes();
	var sleepingHour = 0, sleepingMin = 0;
	if(nowTotalMin > alarmTotalMin) nowTotalMin -= 24 * 60;
	var sleepingMin = alarmTotalMin - nowTotalMin;
	return Math.floor(sleepingMin / 60) + ":" + am.zeroPadding((sleepingMin % 60), 2);
}

$(document).on('pageinit', '#alarmSetting', function(){
	$('#alarmSetting_saveAnchor').click(function(){
		var settingDict = {	'time': $('#alarmSetting_timeFlipbox').val(),
							'title': $('#alarmSetting_titleInput').val(), 
							'snooze': $('#alarmSetting_snoozeFlip').val(),
							'bs': $('#alarmSetting_bestSleep').val()}
		am.updateWorkingAlarmSetting(settingDict);
	});
	$('#alarmSetting_deleteAnchor').click(am.removeWorkingAlarmSetting);
});
$(document).on('pageshow', '#alarmSetting', function(){
	var alarmSetting = am.loadCurrentAlarmSetting();
	if('time' in alarmSetting)
		$('#alarmSetting_timeFlipbox').val(alarmSetting['time']);
	else{
		var now = new Date();
		$('#alarmSetting_timeFlipbox').val(now.getHours() + ':' + now.getMinutes());
	}
	if('title' in alarmSetting)
		$('#alarmSetting_titleInput').attr('value', alarmSetting['title']);
	if('sound' in alarmSetting)
		$('#alarmSetting_soundText').text(alarmSetting['sound']);
	if('repeat' in alarmSetting)
		$('#alarmSetting_repeatText').text(am.weekdayDict[alarmSetting['repeat']]);
	else
		$('#alarmSetting_repeatText').text(am.weekdayDict['nev']);
		
	if('snooze' in alarmSetting && alarmSetting['snooze'] == 'on')
		$('#alarmSetting_snoozeFlip').val('on').slider('refresh');
	if(!('bs' in alarmSetting) || alarmSetting['bs'] == 'on')
		$('#alarmSetting_bestSleepFlip').val('on').slider('refresh');
});

$(document).on('pageinit', '#repeatSetting', function(){
	$('ul#repeatSettingList_weekList li').each(function(idx, elem){
		$(elem).children('a').click(function(){
			am.updateWorkingAlarmSetting({'repeat': $(this).attr('id')});
		});
	});
});
})();
