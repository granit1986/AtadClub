var callback = arguments[0].callback || false;
var minTime = arguments[0].minTime || false;
var maxTime = arguments[0].maxTime || false;

var date = new Date(); 

if(minTime)
	$.picker.setMinDate(minTime);
	
if(maxTime)
	$.picker.setMaxDate(maxTime);

function onChange(e) {
	date = e.value;	
	if(callback) callback(date,0);
}

function onClose() {
	date.setSeconds(0);
	if(callback) callback(date,1);
}
