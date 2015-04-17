
function checkBox(specs,checkboxspecs,image, callback){
	var specs = specs;
	var checkboxspecs = checkboxspecs;
	var image = image;
	var callback = callback;
	var undefinedStateImageView;
	var uncheckStateImageView;
	var viw;
	var imageView;
	var outerView;
	createCheckBox();
	this.checkedAll		= 2;
	this.undefined		= 1;
	this.uncheckedAll 	= 0;
	this.outerView = function()
	{
		return outerView;
	};
	function createCheckBox(){
		 if(typeof checkboxspecs != "object")
	        checkboxspecs = {};	
	        	    
		    checkboxspecs.width = checkboxspecs.width || 20;
		    checkboxspecs.height = checkboxspecs.height || 20;
		    checkboxspecs.left = checkboxspecs.left || 0;
		    checkboxspecs.top = checkboxspecs.top || 0;
		    
		
		    viw = Ti.UI.createView(checkboxspecs);
		    specs.width =  checkboxspecs.width;// * 1.5;
		    specs.height = checkboxspecs.height;// * 1.5;
		
		    var outerview = Ti.UI.createView({
		        width: specs.width,// * 1.5,
		        height: specs.height,// * 1.5,
		        left: checkboxspecs.left,
		        top:checkboxspecs.left,
		        
		    });
		    var clickview = Ti.UI.createView({
		        width:checkboxspecs.width,
		        height:checkboxspecs.height,
		        id: 'checkbox'
		    });
		    
		   	
		    
		    uncheckStateImageView = Ti.UI.createImageView({
		    	image:image.uncheck || "images/checkbox.png",
		        height:checkboxspecs.height,// * 1.5,
		        top:0,//3 + checkboxspecs.height * 0.5,
		        left:0,//3 + checkboxspecs.width * 0.5,
		        opacity:1,		        
		    });
		    imageView = Ti.UI.createImageView({
		        image:image.select || "images/checkbox_check.png",
		        height:checkboxspecs.height,// * 1.5,
		        width:checkboxspecs.width,
		        top:0,//3 + checkboxspecs.height * 0.5,
		        left:0,//3 + checkboxspecs.width * 0.5,
		        opacity:0
		    });
		    undefinedStateImageView = Ti.UI.createImageView({
		    	image:image.undefine || "images/checkbox_half.png",
		        height:checkboxspecs.height,// * 1.5,
		        top:0,//3 + checkboxspecs.height * 0.5,
		        left:0,//3 + checkboxspecs.width * 0.5,
		        opacity:0
		    });
		    outerview.add(viw);
		    outerview.add(undefinedStateImageView);
		    outerview.add(uncheckStateImageView);
		    outerview.add(imageView);
		    outerview.add(clickview);	
		    
		    outerView = outerview;
		    if(callback)
		   	{
		   		outerView.addEventListener('click', callback);
		   	}
		};
	function isChecked(e)
	{
		check(e);
	};
	
	this.state = function()
	{
		if(uncheckStateImageView.opacity===1)
			return this.uncheckedAll;
		if(undefinedStateImageView.opacity===1)
			return this.undefined;
		if(imageView.opacity===1)
			return this.checkedAll;
	};
	
	function check(e)
	{
		if(e)
		{
			viw.checked = true;
			undefinedStateImageView.opacity = 0;
			uncheckStateImageView.opacity = 0;
			imageView.opacity = 1;
			return;
		}
		else if(e == false)
		{
			viw.checked = false;
			undefinedStateImageView.opacity = 0;
			imageView.opacity = 0;
			uncheckStateImageView.opacity = 1;
			return;
		}
		viw.checked = true;
		undefinedStateImageView.opacity = 1;
		imageView.opacity = 0;		
		uncheckStateImageView.opacity = 0;
	}
	
	this.setIsChecked = function(coll1, coll2)
	{
		if(coll1 && coll2.length == Object.keys(coll1).length)	
			isChecked(true);	
		else if(!coll1 || (Object.keys(coll1).length == 0))
			isChecked(false);
		else if(coll1 && coll2.length > Object.keys(coll1).length)
			isChecked();
	};
}
