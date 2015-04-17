var startDate 	= "",
	endDate 	= "";
Alloy.Collections.selectedDeals = [];
var indicator = Alloy.Globals.indicator;



function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){
	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;		
	var id = e.source.id;
	switch(id)
	{		
		case "deals": {openDeals(); break;}
		case "send": {send(); break;}
	}
}

function openDeals()
{
	var view = Alloy.createController('account/reports/deals',{callback: 
		function(){
			var selectedDeals = Alloy.Collections.selectedDeals;
			if(selectedDeals)
			{
				$.selectedCategories.text = '';
				for (var i=0; i < selectedDeals.length; i++) {
					var deal = selectedDeals[i];
					if($.selectedCategories.text === '')
						$.selectedCategories.text += deal.title;
					else
						$.selectedCategories.text += ', ' + deal.title;
				};
			}
	}}).getView();
	Alloy.Globals.tabGroup.activeTab.open(view);
}

function send()
{
	if(Alloy.Collections.selectedDeals.length == 0)
	{	
		Alloy.Globals.core.showErrorDialog(L("choose_deals"));
		return;
	}
	indicator.openIndicator();
	var items = [];
	for (var i=0; i < Alloy.Collections.selectedDeals.length; i++) {
		var deal = Alloy.Collections.selectedDeals[i];
		items.push(deal.id);
	};
	var report = Alloy.createModel('report', {items: items, from: startDate, to: endDate});
	if(report.localValidate(errorHandler))
	{
		report.save({},{
			success: function(model, response, options){ indicator.closeIndicator(); Alloy.Globals.core.showErrorDialog(L(response));},
			error: function (xhr, options){ indicator.closeIndicator(); if(xhr && xhr.Message) Alloy.Globals.core.showErrorDialog(L(xhr.Message));}
		});
	}
	else
		indicator.closeIndicator();
}

function errorHandler(err) {	
	Alloy.Globals.core.showError(err);
}

function setStartDate() {	
	var datePicker = Alloy.createController('picker/date', {
			minDate: new Date(2014,7,1,0,0,0,0),
			callback: function(datePost,close) {
				startDate = datePost; 
				
				$.startDate.value = datePost.toLocaleDateString(); 
				if(close){
					$.pickerWrap.removeAllChildren();
				}
			},
			
		}).getView();	
	
	
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(datePicker);	
}

function setEndDate() {	
	var datePicker = Alloy.createController('picker/date', {
			minDate: new Date(2014,7,1,0,0,0,0),
			callback: function(datePost,close) {
				endDate = datePost; 
				
				$.endDate.value = datePost.toLocaleDateString(); 
				if(close){
					$.pickerWrap.removeAllChildren();
				}
			},
			
		}).getView();	
	
	
	$.pickerWrap.removeAllChildren();
	$.pickerWrap.add(datePicker);	
}
