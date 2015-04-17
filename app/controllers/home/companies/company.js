var id = arguments[0].id || null;
var callback = arguments[0].callback || null;
var company = false;
var lat = arguments[0].lat || false;
var lng = arguments[0].lng || false;
var dialog = Ti.UI.createAlertDialog({
	title		: L("block"),
	message		: L("block_supplier"),
	cancel		: 1,
	buttonNames	: [L("ok"), L("cancel")]
});
if(Alloy.Globals.profile)
{
	var blockBtn = Ti.UI.createButton({title: L('block')});
	blockBtn.addEventListener('click',function(e){
		dialog.show();
	});
	$.window.setRightNavButton(blockBtn);
}

dialog.addEventListener('click', function(e){
	switch(e.index)
	{
		case 0:{			
			var item = Alloy.createModel('blackList', {id:id});
			item.save({},{success:function(){
				$.window.close();
				if(callback)
					callback(true);
			},
			error:function(model, xhr, options){
				if(xhr.Message)
					Titanium.UI.createAlertDialog({
									title:xhr.Message
								}).show();
			}});
			break;
		}
		case 1:{
			
			break;
		}
	}
});

if(id) {
	if(!Alloy.Globals.profile || id == Alloy.Globals.profile.id)
		$.send.visible = false;
	var x = Alloy.createModel('publicCompany',{id:id}).fetch({
		success: function(data) {
			company = data.toJSON();
			fill(company);
		}	
	});
}
function fill(company) {
	$.image.image			= company.logo + company.logoId + '/_100_100'; 
	$.nameVal.text			= company.name;
	$.addressVal.text		= company.address;
	$.emailVal.text			= company.email;
	$.phoneVal.text			= company.phone;
	$.aboutVal.text			= company.about;
	$.hoursVal.text			= company.workingHours;
	$.termsVal.text			= company.terms;
	$.window.title      	= company.name;	
	$.companyNumber.text		= company.number;
}


var optionsEmailDialog = {
	options:['Write the company', 'Cancel'],
	cancel:1
};
var emailDialog = Titanium.UI.createOptionDialog(optionsEmailDialog);

emailDialog.addEventListener('click',function(e)
	{
		if (e.index == 0) writeEmail();
	});
function onClickEmail(){
	emailDialog.show();
}

function writeEmail() {
	var emailDialog = Ti.UI.createEmailDialog();
	//emailDialog.subject = L('about_you_advert_subject');
	emailDialog.toRecipients = [company.email];
	//emailDialog.messageBody = String.format(L('about_you_advert_message'),advert.user);
	emailDialog.open();	
}

function onClickAddress() {
	var mapWindow = Alloy.createController('home/companies/companyMap', {company:company}).getView();
	Alloy.CFG.tabHome.open(mapWindow);
}

var indicator = Alloy.Globals.indicator;
function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){
	indicator.openIndicator();
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source && e.source.id)		
		openView(e.source.id);
}

function openView(controlId)
{
	var view = false;
	switch(controlId)
	{
		case "products"	: {view = Alloy.createController('account/products/indexForUser', {supplierId: company.id}).getView(); break;}
		case "deals"	: {view = Alloy.createController('home/companies/allDeals',{id:company.id, supplierName: company.name, lat: lat, lng: lng}).getView(); break;}
		case "send" 	: {
			var chat;
			Alloy.Collections.chats.fetch({
				success:function(){
					chat = Alloy.Collections.chats.where({To: id})[0];
					if(typeof chat !=  "undefined")
					{
						chat = chat.toJSON();
						view = Alloy.createController('account/answers/answer', {id: chat.ChatId, toUser: chat.To, newChat: false}).getView();
						indicator.closeIndicator();
						Alloy.CFG.tabHome.open(view);
					}
					else
					{
						Alloy.createModel('chat', {from: Alloy.Globals.profile.id, to: id}).save({},{
							success	: function (e){
								view = Alloy.createController('account/answers/answer', {id: arguments[1], newChat: true, toUser: id}).getView();
								indicator.closeIndicator();
								Alloy.CFG.tabHome.open(view);
							},
							error	: function (e){
								indicator.closeIndicator();
								Alloy.Globals.core.showErrorDialog(L("chat_open_error"));
							}
						});
					}
				},
				error: function(){
					Alloy.Globals.core.showErrorDialog(L("chat_open_error"));
					indicator.closeIndicator();
				}});
		}
	}
	if(view)
		Alloy.CFG.tabHome.open(view);
	indicator.openIndicator();
}

var optionsPhoneDialog = {
	options:['Call the company', 'Cancel'],
	cancel:1
};
var phoneDialog = Titanium.UI.createOptionDialog(optionsPhoneDialog);

phoneDialog.addEventListener('click',function(e)
	{
		if (e.index == 0) phoneCall();
	});
function onClickPhone(){
	phoneDialog.show();
}
function phoneCall() {
	Titanium.Platform.openURL('tel:' + company.phone);	
}

function clickDeals() {
	Alloy.CFG.tabHome.open(
		Alloy.createController('home/companies/allDeals',{id:company.id, supplierName: company.name}).getView()
	);
}
