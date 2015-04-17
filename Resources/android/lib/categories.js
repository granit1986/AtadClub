var categories = {
    select: function(category) {
        var key = "_" + category.id;
        if (key in Alloy.Globals.core.selectedCategories) return;
        Alloy.Globals.core.selectedCategories[key] = {};
    },
    clear: function(category) {
        var key = "_" + category.id;
        if (!(key in Alloy.Globals.core.selectedCategories)) return;
        delete Alloy.Globals.core.selectedCategories[key];
    },
    selected: function(category) {
        var key = "_" + category.id;
        if (!(key in Alloy.Globals.core.selectedCategories)) return false;
        return Alloy.Globals.core.selectedCategories[key].length == category.subCategories.length;
    }
};