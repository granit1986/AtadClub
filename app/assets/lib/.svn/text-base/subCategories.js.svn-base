var subCategories = {

	select: function(subCategory, collection) {

		var categoryKey = '_' + subCategory.categoryId;
		if(!(categoryKey in collection))
			collection[categoryKey] = {};
		
		var subCategoryKey = '_' + subCategory.id;
		if(subCategoryKey in collection[categoryKey])
			return; 	
		collection[categoryKey][subCategoryKey] = subCategory.id;
		
	},	
	clear: function(subCategory, collection) {
		
		var categoryKey = '_' + subCategory.categoryId;
		if(!(categoryKey in collection))
			return;
		
		var subCategoryKey = '_' + subCategory.id;
		if(!(subCategoryKey in collection[categoryKey]))
			return;

		delete collection[categoryKey][subCategoryKey];		
	},	
	selected: function(subCategory, collection) {

		var categoryKey = '_' + subCategory.categoryId;
		if(!(categoryKey in collection))
			return false;

		var subCategoryKey = '_' + subCategory.id;
		if(!(subCategoryKey in collection[categoryKey]))
			return false;

		return true;
	},	
};