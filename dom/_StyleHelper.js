/**
*
* @factory
*/
function _StyleHelper() {

    /**
    * converts the css text to a css object
    * @function
    */
    function createCssObj(el) {
        var css = el.style.cssText.split(";")
        , cssObj = {};

        for (var i = 0, l = css.length; i < l; i++) {
            var keyVal = css[i].split(":");
            cssObj[keyVal[0]] = keyVal[1];
        }

        return cssObj;
    }
    /**
    * Converts the css object into css text
    * @function
    */
    function createCssText(cssObj) {
        var cssText = "";

        Object.keys(cssObj).forEach(function forEachKey(key) {
            cssText+= key + ":" + cssObj[key] + ";";
        });

        return cssText;
    }

    /**
    * @worker
    */
    return Object.create(null, {
        /**
        * Attempts to find the style with name
        * @function
        * @param {Element} el The element to inspect
        * @param {String} name The name of the style to find
        */
        "get": {
            "enumerable": true
            , "value": function (el, name) {
                var cssObj = createCssObj(el);
                return cssObj[name];
            }
        }
        /**
        * Returns the CSS object
        * @function
        * @param {Element} el The element to inspect
        */
        , "getAll": {
            "enumerable": true
            , "value": function (el) {
                return createCssObj(el);
            }
        }
        /**
        * Adds or updates the elements style
        * @function
        * @param {Element} el The element to inspect
        * @param {Object} styles A name/value pair representing the styles to add/update
        */
        , "update": {
            "enumerable": true
            , "value": function (el, styles) {
                var cssObj = createCssObj(el);
                apply(styles, cssObj);
                el.style.cssText = createCssText(cssObj);
            }
        }
        /**
        * Removes the element styles
        * @function
        * @param {Element} el The element to inspect
        * @param {Array} names The array of style names to remove
        */
        , "remove": {
            "enumerable": true
            , "value": function (el, names) {
                var cssObj = createCssObj(el);
                if (!isArray(names)) {
                    names = [names];
                }
                for(var i = 0, l = names.length; i < l; i++) {
                    delete cssObj[names[i]];
                }
                el.style.cssText = createCssText(cssObj);
            }
        }
    });
}