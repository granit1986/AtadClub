
if($.dir.text == 'in'){
	// bubbleWrap
	$.bubbleWrap.left = '12dp';
	// bubble
	$.bubble.backgroundColor = '#ff5555';
	$.bubble.borderColor = '#ff5555';
	$.bubble.left = "0dp";
	// message
	$.message.color = '#1b1b1b';
	// arrow
	$.arrow.image = 'images/messageIn.png';
	$.arrow.left = '12dp';
}else{
	// bubbleWrap
	$.bubbleWrap.right = '12dp';
	// bubble
	$.bubble.backgroundColor = '#007aff';
	$.bubble.borderColor = '#007aff';
	$.bubble.right = "0dp";
	// message
	$.message.color = '#fff';
	// arrow
	$.arrow.image = 'images/messageOut.png';
	$.arrow.right = '12dp';
}
