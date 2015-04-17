var callback = arguments[0].callback;
var maxValue = arguments[0].maxValue;
item  = 1; 
var data = [];
/*

var data = [];
for (i = 1; i<=maxValue; i++)
	data[i-1]=Ti.UI.createPickerRow({title:i});
 * */

for (i = 1; i<=maxValue; i++)
	data[i-1]=Ti.UI.createPickerRow({title:i.toString(),custom_item: i.toString()});

//$.picker.selectionIndicator = true;
$.picker.add(data);



function onChange(e) {
	item = e.selectedValue[0];
	if(callback) callback(item,0);
}

function onClose() {
	if(callback) callback(item, 1);
}