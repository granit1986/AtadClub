var offer = Alloy.createModel('offer');
var offerId = arguments[0].offerId;
var indicator = Alloy.Globals.indicator;
var image = false;


function open()
{
	indicator.openIndicator();
	offer.fetch({
		data:{id: offerId},
		success: function(data){
			offer = offer.toJSON();
			$.advert.text = offer.advert;
			$.user.text = offer.toUser;
			$.email.text = offer.email; 
			$.phone.text = offer.phone;
			
			//$.answer.value = offer.phone;
			switch(offer.state) {
				case 1:
				default:
					offer.state = L('new');
					break;
				case 3:
					offer.state = L('declined');
					if(offer.answer!=="")
					{
						$.answerLbl.show();
						$.answerMsg.text = offer.answer;
						$.scrollView.remove($.answer);
						$.answerMsg.show();
					}
					break;
				case 4:
					offer.state = L('accepted');
					if(offer.answer!=="")
					{
						$.answerLbl.show();
						$.answerMsg.text = offer.answer;
						$.scrollView.remove($.answer);
						$.answerMsg.show();
					}
					break;
				
			}
			$.state.text = offer.state;
			
			if(offer.price) {
				$.price.visible = true;
				$.priceLbl.visible = true;
				$.price.text = offer.price;
				$.imageLbl.bottom =0;
				$.imageView.bottom		= 0;
				
			}
			
			if(offer.imageId)
			{
				$.imageLbl.visible = true;
				image = offer.imageServer + "/" + offer.imageId + Alloy.Globals.imageSizes.supplier.edit();
				$.imageView.image 		= image;
				$.imageView.visible		= true;
				$.imageView.height		= Ti.UI.SIZE;
				$.imageView.bottom		= "10dp";
				$.price.bottom = 0;
				$.priceLbl.bottom = 0;
			} 
			 
			$.description.text = offer.description; 

			indicator.closeIndicator();
		},
		error: function(model, xhr,options){
			indicator.closeIndicator();
		}
	});
}


 
function close()
{
	Alloy.Collections.offers.fetch({
		success:function(data) {
		},
		error:function(model, xhr,options){},
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



