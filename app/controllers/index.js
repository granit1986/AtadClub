Alloy.Globals.tabGroup		= $.index;
Alloy.CFG.tabDeals			= $.tabDeals;
Alloy.CFG.tabCompanies		= $.tabCompanies;
Alloy.CFG.tabHome			= $.tabHome;
Alloy.CFG.tabAdd			= $.tabAdd;
Alloy.CFG.tabNotifications	= $.tabNotifications;
Alloy.CFG.tabAccount		= $.tabAccount;
Alloy.CFG.tabMore			= $.tabMore;
Alloy.CFG.tabShare			= $.tabShare;
Alloy.CFG.tabAppreciation	= $.tabAppreciation;
Alloy.CFG.tabContact		= $.tabContactUs;

$.tabContactUs.addEventListener('focus', function(e){
	Ti.App.fireEvent("open:contactus");
});
$.tabAdd.addEventListener('focus', function(e){	
	 showLogin(e, 'please_login');
});


function showLogin(e, titleId)
{
	if(!Alloy.Globals.core.apiToken()) {
		
		var alertDialog = Titanium.UI.createAlertDialog({
				title:L('please_login_title'),
				message:L(titleId),
				buttonNames:[L('cancel'),L('OK')],
				cancel:0
			});
			alertDialog.addEventListener('click', function(e){				
				if(e.cancel === e.index || e.cancel === true)				 
					Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabHome); 
				else
					Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabAccount);
			});
			alertDialog.show();		
		return;
	}
}
$.index.open();

