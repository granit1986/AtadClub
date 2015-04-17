var offers = Alloy.createCollection('offer');
var indicator = Alloy.Globals.indicator;
var offerId = arguments[0].offerId;

function close()
{
	Alloy.Collections.offers.fetch({
		success:function(data) {
		},
		error:function(model, xhr,options){},
	});
}

function blur(e)
{
	if(e.source.id !== $.answer.id)
		$.answer.blur();
}

function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}


function buttonTouchEnd(e){
	indicator.openIndicator();
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	if(e.source.id == "accept")
		onClickAccept();
	else if(e.source.id == "decline")
		 {
		 	onClickDecline();
		 }
}

function open()
{
	indicator.openIndicator();
	offers.fetch({
		data:{id: offerId},
		success: function(data){
			offer = offers.where({id: offerId})[0].toJSON();
			$.advert.text = offer.advert;

			if(offer.imageId)
			{
				$.imageLbl.visible = true;
				image = offer.imageServer + "/" + offer.imageId + Alloy.Globals.imageSizes.supplier.edit();
				$.imageView.image = image;
				$.imageView.height		= Ti.UI.SIZE;
				$.imageView.bottom		= "10dp";			
				$.scrollView.remove($.price);
				$.scrollView.remove($.priceLbl);				
			}
				
			$.user.text = offer.user; 
			$.email.text = offer.email; 
			$.phone.text = offer.phone;
			
			//$.answer.value = offer.phone;
			switch(offer.state) {
				case 1:
				default:
					offer.state = L('new');
					$.accept.visible = true;
					$.decline.visible = true;
					$.answerLbl.visible = true;
					$.answer.visible = true;
					break;
				case 3:
					offer.state = L('declined');
					$.answerLbl.visible = true;
					break;
				case 4:
					offer.state = L('accepted');
					$.answerLbl.visible = true;
					break;
				
			}
			$.state.text = offer.state;
			
			if(offer.price) {
				$.price.visible = true;
				$.priceLbl.visible = true;
				$.price.text = offer.price;
				$.scrollView.remove($.imageLbl);
				$.scrollView.remove($.imageView);				
			} 
			 
			$.description.text = offer.description; 
			if(offer.answer !== "")
			{
				$.answerMsg.text = offer.answer;
				$.answerMsg.show();
				$.scrollView.remove($.answer);
			}

			indicator.closeIndicator();
		},
		error: function(model, xhr,options){
			indicator.closeIndicator();
		}
	});	
}



 
 

function onClickEmail() {

	
	
	/*var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = L('about_you_offer_subject');
	emailDialog.toRecipients = [offer.email];
	emailDialog.messageBody = String.format(L('about_you_offer_message'),offer.user);
	emailDialog.open();	*/
}
function phoneCall() {
	Titanium.Platform.openURL('tel:' + offer.phone);	
}

function onClickAccept() {
	var offer_ = Alloy.createModel('offer',{
		id			:offer.id,
		answer		:$.answer.value, 
		state		:4		
	});
	offer_.save({},{
		success: function() {
			indicator.closeIndicator();
			$.accept.visible = false;
			$.decline.visible = false;			
			$.answerMsg.text = $.answer.value;
			$.scrollView.remove($.answer);
			$.answerMsg.visible = true;
			$.state.text = L('accepted');
			Ti.App.fireEvent('offers:update');
		},
		error: function() {indicator.closeIndicator();},
	});
}

function onClickDecline() {
	var offer_ = Alloy.createModel('offer',{
		id			:offer.id,
		answer		:$.answer.value, 
		state		:3		
	});
	offer_.save({},{
		success: function() {
			indicator.closeIndicator();
			$.accept.visible = false;
			$.decline.visible = false;
			$.state.text = L('declined');
			$.answerMsg.text = $.answer.value;
			$.scrollView.remove($.answer);
			$.answerMsg.visible = true;
			Ti.App.fireEvent('offers:update');
		},
		error: function(){indicator.closeIndicator();},
	});
}


