var errors = Alloy.Globals.errors;
var currency;

var indicator = Alloy.Globals.indicator;

function blur(e)
{
	hideKeyboard(e);
}

function hideKeyboard(e)
{
	if(e.source.id !== $.login.id)
		$.login.blur();
	if(e.source.id !== $.password.id)
		$.password.blur();
}

function focus(e)
{
	hideKeyboard(e);
}

function buttonTouchStart(e){	
	if(e.source.id==="facebookSignIn"){
		e.source.backgroundColor = "#193776";
	}else{
		e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
	}
}

function buttonTouchEnd(e){
	indicator.openIndicator();
	if(e.source.id==="facebookSignIn"){
		e.source.backgroundColor = "#3b5998";
	}else{
		e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	}	
	authorize(e);
}
function linkTouchStart(e){
	e.source.color = '#008aa9';
}
function linkTouchEnd(e){
	indicator.openIndicator();
	e.source.color = '#00accb';	
	if(e.source.id == "resetPassword")
		resetPassword();
}


function contactClick()
{	
	var email = $.login.value;
	Ti.App.fireEvent("app:userblocked", {email: email});
	Alloy.Globals.tabGroup.setActiveTab(Alloy.CFG.tabContact);
	$.sendAdmin.visible = false;
	$.sendAdmin.height = 0;
}

function authorize(e)
{	
	switch(e.source.id)
	{
		//case "facebookSignIn": {dofacebookSignIn(); break;}
		case "facebookSignIn": {dofacebookSignIn(); break;}
		case "signIn": {doSignIn(e); break;}
		case "signUp": {showSignUp(e); break;}
		//case "resetPassword": {resetPassword(); break;}
	}
}

function chooseCurrency(){
	var modal = Ti.UI.createWindow({
		top:0,
		left:0,    
		layout:'absolute',
        backgroundColor:  'rgba(255,255,255,0.7)',
	});
	var pickerWrap = Ti.UI.createView({
		 layout			:	"vertical",
		 width			:	Ti.UI.FILL,
		 height			:	Ti.UI.SIZE,
		 bottom			:	"0"
	});
	var currencyItems = Alloy.Globals.core.currencyItems;
	var currencyRowIndex = 0;
	var currencyPicker = Alloy.createController('picker/genericPicker', {
			items: currencyItems,
			rowIndex: currencyRowIndex,
			callback: function(item, close, index) {				
				if(item.data)
					currency = item.data.id;									
				if(close){
					if(Alloy.Globals.profile.supplier)
						Ti.App.fireEvent('account:itIsSupplier');
					Alloy.Globals.chat.openConnect();
					modal.close();
					profile.set('currencyCode', currency);
					profile.save({},{});
				}
			}
		}).getView();
		pickerWrap.add(currencyPicker);
		modal.add(pickerWrap);
	modal.open();
}

function resetPassword()
{
	var reset = Alloy.createModel('reset', {email: $.login.value});
	if(reset.localValidate(errorHandler))
	{
		reset.save({},{
			success: function(model, responce, options){
				Alloy.Globals.core.showErrorDialog(L(responce)); 
				indicator.closeIndicator();
				$.resetPasswordWrap.visible = false;
	        	$.resetPasswordWrap.height = 0;
			},
			error: function(model, xhr, options){
				if(xhr && xhr.Message)
				  Alloy.Globals.core.showErrorDialog(L(xhr.Message));
				 indicator.closeIndicator();
			}
		});
	}
}


function dofacebookSignIn(){
	Ti.Facebook.appid = '1437623056473639';
	Ti.Facebook.permissions = ['publish_stream','offline_access','email']; // Permissions your app needs
	Ti.Facebook.addEventListener('login', facebookLogin);
	Ti.Facebook.authorize();
}

function facebookLogin(e) {
	    if (e.success) {
	    	if (!e.data.email)
	    		e.data.email = e.data.username + '@facebook.com';	
    		signFacebook(e.data);
	    } else if (e.error) {
	        Alloy.Globals.core.showErrorDialog(e.error);
	        indicator.closeIndicator();
	    } else if (e.cancelled) {
	        Alloy.Globals.core.showErrorDialog("Canceled");
	        indicator.closeIndicator();
	    }
	    Ti.Facebook.removeEventListener("login", facebookLogin);
	}

var profile;
var signFacebook = function(data) {

    var signup = Alloy.createModel(
    	'facebooklogin', {
    		firstName		: data.first_name, 
    		lastName		: data.last_name,
    		email			: data.email,
    		facebookId		: data.id,
			appInstallId	: Alloy.Globals.core.installId, //Ti.App.installId,
			appVersion		: Ti.App.version,
			platformModel	: Ti.Platform.model,
			platformVersion	: Ti.Platform.version,
			platformOSName	: Ti.Platform.osname,
			language		: Ti.Locale.currentLanguage,
    		currency		: currency,
		}
	);
	
	if(signup.localValidate(errorHandler)) {
		signup.save({}, {
	        success: function(model, response, options) {
	        	Alloy.Globals.core.apiToken(response.UUID);
				profile = Alloy.createModel('profile');
				profile.fetch({
					success: function () {
						$.resetPasswordWrap.visible = false;
	        			$.resetPasswordWrap.height = 0;
						$.sendAdmin.visible = false;
						$.sendAdmin.height = 0;
						indicator.closeIndicator();
						Alloy.Globals.profile = profile.toJSON();
						if(Alloy.Globals.profile.supplier)
							Ti.App.fireEvent('account:itIsSupplier');
						if(!Alloy.Globals.profile.currency && Alloy.Globals.profile.currency === null)
							chooseCurrency();
						else{
							Ti.App.fireEvent('account:updateProfile');
						}
					},
					error: function(){
						indicator.closeIndicator();
					}	
				});
	        	Alloy.Collections.adverts = Alloy.createCollection('advert');
				Ti.App.fireEvent('account:showAccount');
	        },
	        error: function(model, xhr, options) {
	        	indicator.closeIndicator();
	        	if(xhr && !xhr.blocked)
	        		errorHandler(errors.CAN_NOT_CREATE_ACCOUNT);
	        	else
	        		$.sendAdmin.visible = true;
					$.sendAdmin.height = Ti.UI.SIZE;
	        }
		});
	}
};


function doSignIn(e) {
	
    var signin = Alloy.createModel(
    	'signin', {
    		login			: $.login.value, 
    		password		: $.password.value,
			appInstallId	: Alloy.Globals.core.installId, //Ti.App.installId,
			appVersion		: Ti.App.version,
			platformModel	: Ti.Platform.model,
			platformVersion	: Ti.Platform.version,
			platformOSName	: Ti.Platform.osname,
			language		: Ti.Locale.currentLanguage,
		}
	);
	if(signin.localValidate(errorHandler)) {
		signin.save({}, {
	        success: function(model, response, options) {
	        	$.sendAdmin.visible = false;
	        	$.sendAdmin.height = 0;
	        	Alloy.Globals.core.apiToken(response.UUID);
	        	
	        	indicator.closeIndicator();
	        	$.resetPasswordWrap.visible = false;
	        	$.resetPasswordWrap.height = 0;
				Ti.App.fireEvent('account:updateProfile');
	        	Alloy.Collections.adverts = Alloy.createCollection('advert');
	        	Ti.App.fireEvent('account:showAccount');
	        	
	        },
	        error: function(model, xhr, options) {
	        	indicator.closeIndicator();
	        	if(xhr && xhr.Message)
	        	{
	        		Alloy.Globals.core.showErrorDialog(L(xhr.Message));
	        		$.resetPasswordWrap.visible = true;
	        		$.resetPasswordWrap.height = Ti.UI.SIZE;
	        	}
	        	else if(xhr && !xhr.blocked)
	        		Alloy.Globals.core.showErrorDialog(L('not_signed'));
	        	else if(xhr && xhr.blocked)
	        	{
	        		$.sendAdmin.visible = true; 
	        		$.sendAdmin.height = Ti.UI.SIZE;
	        	} 
	        }
		});
	}
}

function errorHandler(err) {
	switch(err) {
		case errors.NO_EMAIL:
		case errors.INVALID_EMAIL:
			$.login.focus();
			break;
		case errors.NO_PASSWORD:
			$.password.focus();
			break;
		case errors.NOT_SIGNED:
			$.login.focus();
			break;
	}
	indicator.closeIndicator();
	Alloy.Globals.core.showError(err);
}

function showSignUp (e) {
	indicator.closeIndicator();
	Ti.App.fireEvent('account:showSignUp');
}
