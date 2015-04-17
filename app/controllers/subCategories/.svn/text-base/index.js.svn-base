var categoryId = arguments[0].categoryId;
var categoryName = arguments[0].categoryName;
var closeCallback = arguments[0].closeCallback || null;
var sectionName = arguments[0].sectionName || null;
var win = arguments[0].win || null;
var core = Alloy.Globals.core;
core.currentSection = sectionName;
var selectAll = true;
var btnNew = Ti.UI.createButton({
    titleid: "select_all"
});
$.window.setRightNavButton(btnNew);
var indicator = Alloy.Globals.indicator;
function open()
{
	indicator.openIndicator();
	$.window.title = categoryName; 
	Alloy.Collections.subCategories.fetch({cache:{name:'subCategories',validMinutes:60},
		success: function(){			
			var subcategoriesCount = Alloy.Collections.subCategories.where({categoryId: categoryId}).length;
			var category = Alloy.Globals.core.currentSectionCategories()['_'+categoryId]; 
			if(category && subcategoriesCount == Object.size(category))
				selectAll = false;
			
			btnNew.addEventListener('click',function(e){
				if(selectAll)
				{
					for (var i=0; i < _items.length; i++) {
				    	var item = _items[i];
				    	var row = $.categories.data[0].rows[i];
					    if(!core.subCategories.selected({categoryId: item.attributes["categoryId"], id: item.id }, Alloy.Globals.core.currentSectionCategories()))
					    {
				     		core.subCategories.select({categoryId:item.attributes["categoryId"], id:item.id}, Alloy.Globals.core.currentSectionCategories());
				     		row.hasCheck = true;       	
				     	}
				    };
				    selectAll = false;	    
			    }
			    else
			    {
			    	for (var i=0; i < _items.length; i++) {
				    	var item = _items[i];
				    	var row = $.categories.data[0].rows[i];
					    if(core.subCategories.selected({categoryId: item.attributes["categoryId"], id: item.id }, Alloy.Globals.core.currentSectionCategories()))
					    {
				     		core.subCategories.clear({categoryId:item.attributes["categoryId"], id:item.id}, Alloy.Globals.core.currentSectionCategories());
				     		row.hasCheck = false;       	
				     	}
				    };
				    selectAll = true;	    
			    }
			});
		},
		error: function(){
			indicator.closeIndicator(); 
			Alloy.Globals.core.showErrorDialog(L("xhr_error"));
		}
	});
}

var _items;

function categoryFilter(collection) {
	_items = collection.where({categoryId:categoryId});
	indicator.closeIndicator();
	return _items;
}

function onClose() {
	if (closeCallback)
		closeCallback(categoryId);
}

