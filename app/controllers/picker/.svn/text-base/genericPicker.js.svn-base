var items = arguments[0].items;
var callback = arguments[0].callback || null;
var rowIndex = arguments[0].rowIndex || null;
var data = [];
for (i = 0; i<items.length; i++)
{
	var item = items[i];
	data.push(Ti.UI.createPickerRow({title: item.title, data: item.data}));
}


$.picker.add(data);
$.picker.setSelectedRow(0, 0, false);
if(rowIndex)
	$.picker.setSelectedRow(0, rowIndex, false);

var item;
function onChange(e) {
	if(e.row)
		item = e.row;
	else
		item = $.picker.getSelectedRow(0);
	
	if(callback) callback(item,0,e.rowIndex);
}

function onClose() {		
	if(callback) callback(item, 1);
}
