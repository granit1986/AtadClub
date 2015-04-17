var callback = arguments[0].callback || null;
var rowIndex = arguments[0].rowIndex || null;
var data = [];
for (i = 0; i<Alloy.Globals.core.dealType.length; i++)
{
	var deal = Alloy.Globals.core.dealType[i];
	data.push(Ti.UI.createPickerRow({title: deal.title}));
}

//$.picker.selectionIndicator = true;
$.picker.add(data);
if(rowIndex != null)
	$.picker.setSelectedRow(0, rowIndex, false);
else 
	$.picker.setSelectedRow(0, 0, false);
var item;
function onChange(e) {
	item = e.selectedValue[0];
	if(callback) callback(item,0,e.rowIndex);
}

function onClose() {		
	if(callback) callback(item?item:Alloy.Globals.core.dealType[0].title, 1);
}