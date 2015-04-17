var core = Alloy.Globals.core;
var categoryId = $.label.categoryId;
var subcategories = Alloy.Collections.subCategories.where({categoryId:categoryId});
var selectedSubcategories = core.currentSectionCategories()["_"+categoryId];
var item = new Alloy.Globals.checkBox({},{
    width:25,
    height:25,
    left: 10,
    categoryId: $.label.categoryId
},{uncheck: "images/checkbox.png", select: "images/checkbox_check.png", undefine: "images/checkbox_half.png"}, function(e){
	if(!e.row.hasChild)
		return;
	var currentState = item.state();
	if(currentState === item.checkedAll)
	{
		uncheckAll();
	}
	else if(currentState === item.uncheckedAll)
	{
		checkAll();
	}
	else if(currentState === item.undefined)
	{
		checkAll();
	}	
	for (category in core.currentSectionCategories()) {
		if (Object.size(core.currentSectionCategories()[category]) == 0)
			delete core.currentSectionCategories()[category];
	}

	selectedSubcategories = core.currentSectionCategories()["_"+categoryId];
	item.setIsChecked(selectedSubcategories, subcategories);
	Ti.App.fireEvent("blockCategories");
});

 
item.setIsChecked(selectedSubcategories, subcategories);	
$.row.item = item;
$.row.add(item.outerView());

function checkAll()
{		
	for (var i = 0; i < subcategories.length; i++) {
		var subcategory = subcategories[i];
		if (!core.subCategories.selected({categoryId : categoryId,	id : subcategory.id}, core.currentSectionCategories())) {
			core.subCategories.select({categoryId : categoryId,	id : subcategory.id	}, core.currentSectionCategories());
		}
	};
}

function uncheckAll()
{		
	for (var i = 0; i < subcategories.length; i++) {
		var subcategory = subcategories[i];
		if (core.subCategories.selected({categoryId : categoryId,	id : subcategory.id}, core.currentSectionCategories())) {
			core.subCategories.clear({categoryId : categoryId,	id : subcategory.id	}, core.currentSectionCategories());
		}
	};
}

if(!$.forDeals.text){
	$.separate.height = 3;
}

function click(e) {
	if(e.source.id && e.source.id === 'checkbox')
		return;
	if(e.row.hasChild)
	Ti.App.fireEvent('categoryWindow:showSubCategories', {
		categoryId:$.label.categoryId,
		categoryName:$.label.text
	});
}
