Alloy.Globals.chat.openChatId = false;
var subjects = [{title: L("complaint"), data: {id: 1}},{title: L("bug_report"), data: {id: 2}},{title: L("investment"), data: {id: 3}},
				{title: L("features_suggestion"), data: {id: 4}},{title: L("improvement_suggestion"), data: {id: 5}},{title: L("affiliate_request"), data: {id: 6}},
				{title: L("blocked_account"), data: {id: 7}}, {title: L("other"), data: {id: 8}},];
$.subject.value = subjects[0].title;
var blockedUser = false;
var email;
var indicator = Alloy.Globals.indicator;

function blur(e)
{
	hideKeyboard(e);
}

function hideKeyboard(e)
{
	if(e.source.id !== $.subject.id)
		$.pickerWrap.removeAllChildren();
	if(e.source.id !== $.message.id)
		$.message.blur();
	if(e.source.id !== $.contactName.id)
		$.contactName.blur();
	if(e.source.id !== $.contactPhone.id)
		$.contactPhone.blur();
	if(e.source.id !== $.contactMail.id)
		$.contactMail.blur();
}

Ti.App.addEventListener("open:contactus", tabOpen);

function tabOpen()
{
	if(Alloy.Globals.profile)
	{
		var profile = Alloy.Globals.profile;
		var name = "";
		if(profile.firstName)
			name = profile.firstName;
		if(profile.lastName)
		{
			if(name.length > 0)
				name = name + " " + profile.lastName;
			else
				name = profile.lastName;
		}
		$.contactName.value = name;
		$.contactMail.value = profile.email;
		$.contactPhone.value = profile.phone;		
	}	
}

function focus(e)
{
	hideKeyboard(e);
}

Ti.App.addEventListener("app:userblocked", function(data){
	email = data.email;	
	subjectRowIndex = 6;
	$.subject.value = subjects[6].title;
	blockedUser = true;
});

function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}


function buttonTouchEnd(e){
	indicator.openIndicator();
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id == $.send.id)
		send();
}

function send() {	
    var contactUs = Alloy.createModel(
    	'contactUs', {
    		subject			: $.subject.value, 
    		message			: $.message.value,
    		name			: $.contactName.value,
    		email			: $.contactMail.value,
    		phone			: $.contactPhone.value
		}
	);
	if(contactUs.localValidate(errorHandler)) {
		contactUs.attributes["message"] = "Name: "+contactUs.attributes["name"] +"\n"+ "Phone: "+contactUs.attributes["phone"] +"\n"+ "Email: "+contactUs.attributes["email"] +"\n"+ "Message: " + contactUs.attributes["message"] + "\n" + L("version") + ": " + Ti.App.version;
		// if(blockedUser)
			// contactUs.attributes["message"] = "User login: " +email + "\n" +  contactUs.attributes["message"];
		indicator.openIndicator();
		contactUs.save({}, {
	        success: function(model, response, options) {
	        	Alloy.Globals.core.showErrorDialog(L('success_contact_us'));	        		        	
	        	$.message.value = '';
	        	indicator.closeIndicator();
	        },
	        error: function(model, xhr, options) { indicator.closeIndicator(); }
		});
	}
}

function errorHandler(err) {

	switch(err) {
		case errors.NO_MESSAGE:
			$.message.focus();
			break;
		case errors.NO_NAME:
			$.contactName.focus();
			break;
		case errors.NO_PHONE:
			$.contactPhone.focus();
			break;
		case errors.NO_EMAIL:
			$.contactMail.focus();
			break;

	}
	indicator.closeIndicator();
	Alloy.Globals.core.showError(err);
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