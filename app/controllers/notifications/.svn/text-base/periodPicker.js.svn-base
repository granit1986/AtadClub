var callback = arguments[0].callback;
var res = {text: L('_60_min'), value: 60};
function onChange(e) {
	res.text = e.row.text;
	res.value = e.row.value;
	if(callback) callback(res);
}

function onClose(e) {
	if(callback) callback(res,1);
}
