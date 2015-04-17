if(Alloy.Globals.core.profile && Alloy.Globals.core.profile.supplier)
	$.supplier.title = L('edit_company');
var indicator = Alloy.Globals.indicator;
Alloy.Globals.chat.openChatId = false;


function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}


function buttonTouchEnd(e){
	indicator.openIndicator();
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id)
		openView(e.source.id);
}

function openView(id)
{
	var view;
	switch(id)
	{
		case 'profile':{view = Alloy.createController('account/profile').getView(); break;}
		case 'supplier':{view = Alloy.createController('account/company', {
			callback: function(showAlert){
				if(showAlert)
					Alloy.CFG.tabAccount.open(Alloy.createController('account/products/index',{alert: showAlert}).getView());}}).getView(); 
				break;
			}
		case 'blackList':{view = Alloy.createController('account/blackList/index').getView(); break;}
		case 'adverts':{view = Alloy.createController('account/adverts/index').getView(); break;}
		case 'deals': {
			
			if(!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
				Alloy.Globals.core.showErrorDialog(L('should_be_company_message'));
				indicator.closeIndicator();
				return;
			}
			view = Alloy.createController('account/deals/index').getView(); break;
			
			
		}
		case 'products': {
			if(!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
				Alloy.Globals.core.showErrorDialog(L('should_be_company_message'));
				indicator.closeIndicator();
				return;
			}
			view = Alloy.createController('account/products/index').getView(); break;
		}
		case 'offers': {view = Alloy.createController('account/offers/index').getView(); break;}
		case 'answers': {view = Alloy.createController('account/answers/index').getView(); break;}
		case 'reports': {
			if(!Alloy.Globals.profile || !Alloy.Globals.profile.supplier) {
				Alloy.Globals.core.showErrorDialog(L('should_be_company_message'));
				indicator.closeIndicator();
				return;
			}
			var report = Alloy.createModel('report');
			report.fetch({
				success: function(model, xhr, options){
					view = Alloy.createController('account/reports/index').getView();
					Alloy.CFG.tabAccount.open(view);					
				},
				error: function(model, xhr, options){
					if(xhr && xhr.Message)
					{
						if(xhr.restrict)
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
									Alloy.Globals.tabGroup.activeTab.open(view);
								}
							});
							alertDialog.show();
						}
					}
				}
			});
			break;		
		}
		case 'buyBanner': {view = Alloy.createController('account/buyBanner').getView(); break;}		
	}
	if(view)
		Alloy.CFG.tabAccount.open(view);
	indicator.closeIndicator();
}

function logout() {
	if (Alloy.Globals.profile) 
	{
		var out = Alloy.createModel('signout', {
			appInstallId : Alloy.Globals.core.installId,
			userId : Alloy.Globals.profile.id
		});
		out.save({
			success : function(model, response) {				
				Ti.API.info("destroyed");
			}
		});
		Alloy.CFG.tabAccount.title = L("tab_signin");
	}

	Ti.Facebook.logout();
	Alloy.Globals.profile = null;
	Alloy.Globals.core.apiToken(false);
	if (Alloy.Globals.chat.source)
		Alloy.Globals.chat.source.close();
	Ti.App.fireEvent('account:showSignIn');
}


function refreshCounts(messageId)
{
	var counts = Alloy.createModel('counts');
	counts.fetch({
		success: function(model, option){
			counts = counts.toJSON();
			if(counts.MessagesCount > 0){
				$.answers_badge.text = counts.MessagesCount;
				$.answers_badge.visible = true;
				if(counts.MessagesCount < 10)
					$.answers_badge.width = 20;
				else
					$.answers_badge.width = 'auto';
			}else if(counts.MessagesCount === 0){
				$.answers_badge.text = '';
				$.answers_badge.visible = false;
			}
			if(counts.OffersCount > 0){
				$.offers_badge.text = counts.OffersCount;
				$.offers_badge.visible = true;
				if(counts.OffersCount < 10)
					$.offers_badge.width = 20;
				else
					$.offers_badge.width = 'auto';
			}else if(counts.OffersCount === 0){
				$.offers_badge.text = '';
				$.offers_badge.visible = false;
			}
		}});
	Ti.API.info("Counts refreshed");
}

Ti.App.addEventListener("account:refreshCounts", refreshCounts);
Ti.App.addEventListener('account:itIsSupplier', function(e) { $.supplier.title = L('edit_company'); }); 