var leftButton = Ti.UI.createButton({title: L("back")});
leftButton.addEventListener('click', function(){$.window.close();});
$.window.setLeftNavButton(leftButton);
