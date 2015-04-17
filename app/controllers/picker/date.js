var callback = arguments[0].callback;
var minDate = arguments[0].minDate || false;
var date = new Date();
$.picker.minDate = date;
if(minDate)
	$.picker.minDate = minDate;
$.picker.value = date;
$.picker.maxDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());

function onChange(e) {
	date = e.value;	
	date.setSeconds(0);
	if(callback) callback(date,0);
}
function onClose() {
	if(callback) callback(date, 1);
}
