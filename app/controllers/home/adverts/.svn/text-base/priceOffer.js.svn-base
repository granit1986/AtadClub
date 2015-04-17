var advert = Alloy.Collections.publicAdverts.where({id: arguments[0].advertId})[0].toJSON();

function blur(e)
{
	//e.cancelBubble = true;
	hideKeyboard(e);
}

function hideKeyboard(e)
{
	if(e.source.id !== $.price.id)
		$.price.blur();
	if(e.source.id !== $.description.id)
		$.description.blur();
	$.scrollView.setContentOffset({x: 0, y: 0});
}

function focus(e)
{
	hideKeyboard(e);
}

function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id == "sendPriceOffer")
		 {
		 	send();
		 }
	
}

function send() {	
		
	var offer = Alloy.createModel('priceOffer',{
		advertId	:advert.id,
		price		:$.price.value,
		description	:$.description.value		
	});

	if(offer.localValidate(errorHandler)) {
		offer.save({}, {
			success: function(model, response, options) {
				$.window.close();
				Alloy.Globals.core.showErrorDialog(L('offer_sent'));				
			},
			error: function(model, xhr, options) {
				if(xhr && xhr.Message)
				{
					var alertDialog = Titanium.UI.createAlertDialog({
						title:L('upgrade_membership'),
						message:L(xhr.Message),
						buttonNames:[L('upgrade'),L('OK')],										
					});
					alertDialog.addEventListener('click', function(e){				
						if(!e.index)
						{
							var view = Alloy.createController("account/upgradeSelect").getView();																				
							Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
							Alloy.Globals.tabGroup.activeTab.open(view);
						}
					});
					alertDialog.show();
				} 
			}
		});
	}	
}


function errorHandler(err) {
	switch(err) {
		case errors.NO_DESCRIPTION:
			$.description.focus();
			break;
		case errors.NO_PRICE:
			$.price.focus();
			break;
		case errors.INVALID_PRICE:
			$.price.focus();
			break;
	}
	
	Alloy.Globals.core.showError(err);	
}
