var shareOpened = false;
Alloy.Globals.chat.openChatId = false;
var shareText = L("share_text");
function open()
{
	
}

function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	switch(e.source.id)
	{
		case "sms"		: { openSms(); break;}
		case "email"	: {openEmail(); break;}
		case "twitter"	: {twitter(); break;}
		case "facebook"	: {facebook(); break;}
		case "google"	: {google(); break;}
	}
}

function openSms()
{
	var smsDialog = require("com.omorandi").createSMSDialog({
		messageBody: shareText + "\n" + Alloy.Globals.core.appUrl
	});
	
	smsDialog.open({anumated: true});
}

function openEmail()
{
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "Atad Club Application";
	emailDialog.messageBody = shareText + "\n" + Alloy.Globals.core.appUrl;
	emailDialog.open();
}

function twitter()
{
	var social = require("alloy/social").create({
		consumerKey		: "xtIHOCSPrhXsb1pLni1IyXPzf",
		consumerSecret	: "azL5kQRuSaC85RD9cicA0H56IYp109i3OxDv1gx27OYdbDiz4O"
	});
	
	
	social.share({
		message		: shareText + "\n" +  Alloy.Globals.core.appUrl,
		success		: function (e){ Alloy.Globals.core.showErrorDialog("Share success"); social.deauthorize();},
		error		: function (e){
			Alloy.Globals.core.showErrorDialog("You can't share in twitter"); 
			social.deauthorize();
		}
	});	
	
}

function google()
{
	var win = Ti.UI.createWindow({
	    barColor: '#000',
	    navBarHidden: false
	});
	var textToShare = encodeURIComponent('This text will be shared');
	var urlToShare = encodeURIComponent('http://www.company.com');
	var webView = Ti.UI.createWebView({
	    url: 'https://plus.google.com/share?url='+encodeURIComponent(Alloy.Globals.core.appUrl)        
	});
	win.add(webView);
	
	win.open({modal: true});
	 
	webView.addEventListener('load', function (e) {
	    if (e.url.indexOf('https://accounts.google.com') == -1) {
	        win.hideNavBar();
	    }  
	    if(e.url.indexOf("https://plus.google.com/app/basic/stream") != -1){
	        win.close();
	    }
	});
	webView.addEventListener('error', function (e) {
	    win.close();
	});
}

function facebook()
{	
	Ti.Facebook.forceDialogAuth = false;
	Ti.Facebook.appid = '1437623056473639';
	Ti.Facebook.permissions = ['publish_stream','offline_access','email'];
	Ti.Facebook.addEventListener('login', facebookLogin);
	if(!Ti.Facebook.loggedIn)
		Ti.Facebook.authorize();
	else
		postInFacebook();	
}

function postInFacebook()
{
	var data = {
		name	: shareText,
		link	: Alloy.Globals.core.appUrl		
	};
	
	if(!shareOpened)
		var dialog = Ti.Facebook.dialog("feed", data, showResults);
	shareOpened = true;
	Ti.Facebook.removeEventListener('login', facebookLogin);
}


function facebookLogin(e) {
	if (e.success) {
		if (!e.data.email)
			e.data.email = e.data.username + '@facebook.com';
		postInFacebook();
	} else if (e.error) {
		Alloy.Globals.core.showErrorDialog(e.error);
	} else if (e.cancelled) {
		Alloy.Globals.core.showErrorDialog("Canceled");
	}
}


function showResults(result)
{	
	if(result.result)
	{
		Alloy.Globals.core.showErrorDialog("Share success");
		Ti.Facebook.logout();
		Ti.Facebook.accessToken = null;		
	}
	else if(result.cancelled)
	{		
		Ti.Facebook.logout();
		Ti.Facebook.accessToken = null;
	}
	shareOpened = false;
}
