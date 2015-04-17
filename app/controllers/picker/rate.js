var callback = arguments[0].callback;
/*
$.rate1.addEventListener('click', function(e) {onRateCLick('1');});
$.rate2.addEventListener('click', function(e) {onRateCLick('2');});
$.rate3.addEventListener('click', function(e) {onRateCLick('3');});
$.rate4.addEventListener('click', function(e) {onRateCLick('4');});
$.rate5.addEventListener('click', function(e) {onRateCLick('5');});
*/

$.rating.backgroundImage = "images/rate_0.png";

var rating = 0;

function onRate(e) {
	rating = e.source.id;
	rating = parseInt(rating.replace('rate',''));
	switch(rating){
		case 1:
			$.rating.backgroundImage = "images/rate_1.png";
			break;
		case 2:
			$.rating.backgroundImage = "images/rate_2.png";
			break;
		case 3:
			$.rating.backgroundImage = "images/rate_3.png";
			break;
		case 4:
			$.rating.backgroundImage = "images/rate_4.png";
			break;
		case 5:
			$.rating.backgroundImage = "images/rate_5.png";
			break;
		default:
			break;
	};

	 //$.ratewin.close();
	 
	 //if(callback) callback(e.source.title);
	 //date = .value;	
}


function send() {
	 $.ratewin.close();
	 if(callback) callback(rating);
}

function onClose() {
	return 0;	
}


function buttonTouchStart(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBgOnTap;
}

function buttonTouchEnd(e){	
	e.source.backgroundColor = Alloy.Globals.Styles.buttonBg;
	send();
}
