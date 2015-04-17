var subjects = [{title: L("spam"), data: {id: 1}},{title: L("not_relevant"), data: {id: 2}},{title: L("misleading"), data: {id: 3}},
				{title: L("not_real"), data: {id: 4}},{title: L("other"), data: {id: 5}}];
$.subject.value = subjects[0].title;
var dealWindow = arguments[0].dealWindow || false;
var indicator = Alloy.Globals.indicator;
var deal; 
try{
	deal = Alloy.Collections.publicDeals.where({id: arguments[0].id})[0].toJSON();
}
catch(e)
{
	try
	{
		deal = Alloy.Collections.similarDeals.where({id: arguments[0].id})[0].toJSON();
	}
	catch(e)
	{
		deal = Alloy.Collections.homeDeals.where({id: arguments[0].id})[0].toJSON();
	}
}

function blur(e)
{
	hideKeyboard(e);
}

function hideKeyboard(e)
{
	if(e.source.id !== $.subject.id)
		$.pickerWrap.removeAllChildren();
	if(e.source.id !== $.text.id)
		$.text.blur();
}

function focus(e)
{
	hideKeyboard(e);
}

function sendClick(){
	if (!$.text.value){
		Alloy.Globals.core.showErrorDialog(L("complaint_requited"));
		return;
	}
	var toSupplierId = deal.supplierId;
	var fromUserId = Alloy.Globals.profile ? Alloy.Globals.profile.id : null;
	
	var text = $.text.value;
	var subject = $.subject.value;
	var complain = Alloy.createModel(
			    	'complain', {
			    		toSupplierId	: toSupplierId,
			    		fromUserId		: fromUserId,
			    		subject			: subject,
			    		DealId			: deal.id, 
			    		Text			: text
					}
				);		
	indicator.openIndicator();			
	complain.save({}, {
					        success: function(model, response, options) {
					        	indicator.closeIndicator();
					        	if(dealWindow)
					        		dealWindow();					        	
								$.complainwin.close();
								Alloy.Globals.core.showErrorDialog(L("complaint_sended"));
								
					        },
					        error: function(model, xhr, options) {
					        	indicator.closeIndicator();
					        	if(xhr && xhr.Message) 
					        		Alloy.Globals.core.showErrorDialog(xhr.Message);
					        	else
					        		Alloy.Globals.core.showErrorDialog(L('error'));
	        				}
					});
				
}

function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	sendClick();
}

var subjectRowIndex = 0;
function clickSubject() {
	var subjectPicker = Alloy.createController('picker/genericPicker', {
			items: subjects,
			rowIndex: subjectRowIndex,
			callback: function(item, close, index) {
				if(!item.title)
					$.subject.value = item;
				else
					$.subject.value = item.title;				
				if(index >= 0)
					subjectRowIndex = index;				
				if(close){
					$.pickerWrap.removeAllChildren();
				}
			}
		}).getView();
	
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(subjectPicker);
}
