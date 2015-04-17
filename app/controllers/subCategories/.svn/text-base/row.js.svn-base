var core = Alloy.Globals.core;

var categoryKey = '_' + $.row.categoryId;
var subCategoryKey = '_' + $.row.subCategoryId;
 
if(categoryKey in core.currentSectionCategories() && subCategoryKey in core.currentSectionCategories()[categoryKey])
	$.row.hasCheck = true;
	
function onClick() {
	this.hasCheck = !this.hasCheck;
	if(this.hasCheck) {
		core.subCategories.select({categoryId: this.categoryId, id: this.subCategoryId }, core.currentSectionCategories());	
	}
	else {
		core.subCategories.clear({categoryId: this.categoryId, id: this.subCategoryId}, core.currentSectionCategories());	
	}
}
