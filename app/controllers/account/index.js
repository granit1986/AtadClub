var views = {
	
	signUp	: {
		view: Alloy.createController('account/sign/up').getView(),		
		title: "", 
		rightNavButton:{
			btn: Ti.UI.createButton({title: L("signin")}),
			action: "views.show('signIn')"
		}},		
	signIn	: {
		view: Alloy.createController('account/sign/in_').getView(),		
		title: "", 
		// rightNavButton:{ 
			// btn: Ti.UI.createButton({title: L("create_account")}),
			// action: "views.show('signUp')"
		// }
	},
	account	: {view: Alloy.createController('account/account').getView(),		title: L("win_account")},
	adverts	: {view: Alloy.createController('account/adverts/index').getView(),	title: L('adverts')},
	onScreenKey: false,
	show: function(key) {
		if(views.onScreenKey) 
			$.index.remove(views[views.onScreenKey].view);
		$.index.title = L(views[key].title);
		$.index.add(views[key].view);
		if(views[key].rightNavButton) {
			var btn = views[key].rightNavButton.btn;
			btn.addEventListener('click', function(e){
				eval(views[key].rightNavButton.action);
			});
		}else{
			var btn = Titanium.UI.createView({}); // REMOVE RIGHT NAV BUTTON
		}
		$.index.rightNavButton = btn;
		views.onScreenKey = key;	
	}	
};



function focus(e)
{
	if(views.onScreenKey === "account")
	{
		Ti.App.fireEvent("account:refreshCounts");
	}
}

Ti.App.addEventListener('account:showSignUp', function(e) { views.show('signUp'); });
Ti.App.addEventListener('account:showSignIn', function(e) {	views.show('signIn'); });
Ti.App.addEventListener('account:showAccount', function(e) { views.show('account'); });
Ti.App.addEventListener('account:showAdverts', function(e) { views.show('adverts'); });


Ti.App.addEventListener('account:updateProfile', function(e) { profileFetch(e); });

function profileFetch(args) {
	var profile = Alloy.createModel('profile');
	profile.fetch({
		success : function() {
			Alloy.Globals.profile = profile.toJSON();
			if (args.showProducts) {
				Alloy.CFG.tabAccount.open(Alloy.createController('account/products/index').getView());
				Alloy.Globals.core.showErrorDialog(L("can_add_product"));
			}
			Alloy.CFG.tabAccount.title = L("tab_account");
			$.index.title = Alloy.Globals.profile.firstName + ' ' + Alloy.Globals.profile.lastName;
			if (Alloy.Globals.profile.supplier)
				Ti.App.fireEvent('account:itIsSupplier');
			Alloy.Globals.chat.openConnect();
		}
	});
}



if(Ti.Network.online)
{
	if (Alloy.Globals.core.apiToken()) {
		Ti.App.fireEvent('account:updateProfile');
		views.show('account');
	}
	else {
		views.show('signIn');
	}
}
else
{
	views.show('signIn');
}