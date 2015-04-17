function checkBox(specs, checkboxspecs, image, callback) {
    function createCheckBox() {
        "object" != typeof checkboxspecs && (checkboxspecs = {});
        checkboxspecs.width = checkboxspecs.width || 20;
        checkboxspecs.height = checkboxspecs.height || 20;
        checkboxspecs.left = checkboxspecs.left || 0;
        checkboxspecs.top = checkboxspecs.top || 0;
        viw = Ti.UI.createView(checkboxspecs);
        specs.width = checkboxspecs.width;
        specs.height = checkboxspecs.height;
        var outerview = Ti.UI.createView({
            width: specs.width,
            height: specs.height,
            left: checkboxspecs.left,
            top: checkboxspecs.left
        });
        var clickview = Ti.UI.createView({
            width: checkboxspecs.width,
            height: checkboxspecs.height,
            id: "checkbox"
        });
        uncheckStateImageView = Ti.UI.createImageView({
            image: image.uncheck || "images/checkbox.png",
            height: checkboxspecs.height,
            top: 0,
            left: 0,
            opacity: 1
        });
        imageView = Ti.UI.createImageView({
            image: image.select || "images/checkbox_check.png",
            height: checkboxspecs.height,
            width: checkboxspecs.width,
            top: 0,
            left: 0,
            opacity: 0
        });
        undefinedStateImageView = Ti.UI.createImageView({
            image: image.undefine || "images/checkbox_half.png",
            height: checkboxspecs.height,
            top: 0,
            left: 0,
            opacity: 0
        });
        outerview.add(viw);
        outerview.add(undefinedStateImageView);
        outerview.add(uncheckStateImageView);
        outerview.add(imageView);
        outerview.add(clickview);
        outerView = outerview;
        callback && outerView.addEventListener("click", callback);
    }
    function isChecked(e) {
        check(e);
    }
    function check(e) {
        if (e) {
            viw.checked = true;
            undefinedStateImageView.opacity = 0;
            uncheckStateImageView.opacity = 0;
            imageView.opacity = 1;
            return;
        }
        if (false == e) {
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
    this.checkedAll = 2;
    this.undefined = 1;
    this.uncheckedAll = 0;
    this.outerView = function() {
        return outerView;
    };
    this.state = function() {
        if (1 === uncheckStateImageView.opacity) return this.uncheckedAll;
        if (1 === undefinedStateImageView.opacity) return this.undefined;
        if (1 === imageView.opacity) return this.checkedAll;
    };
    this.setIsChecked = function(coll1, coll2) {
        coll1 && coll2.length == Object.keys(coll1).length ? isChecked(true) : coll1 && 0 != Object.keys(coll1).length ? coll1 && coll2.length > Object.keys(coll1).length && isChecked() : isChecked(false);
    };
}