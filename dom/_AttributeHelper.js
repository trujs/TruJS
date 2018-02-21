/**
*
* @factory
*/
function _AttributeHelper() {
    var cnsts = {
        "value": "$value"
    };

    /**
    * @worker object
    */
    return Object.create(null, {
        /**
        * @constant
        */
        "VALUE": {
            "enumerable": true
            , "get": function () { return cnsts.value; }
        }
        /**
        * @function
        * @method
        */
        , "update": {
            "enumerable": true
            , "value": function updateAttrib(el, attrib, attribValue) {
                var attrObj = attrib;
                if (isString(attrib)) {
                    attrObj = {};
                    attrObj[attrib] = attribValue;
                }
                Object.keys(attrObj)
                .forEach(function forEachKey(key) {
                    var value = attrObj[key], obj;
                    if (typeof value === "object") {
                        obj = value;
                        value = cnsts.value;
                    }
                    el.setAttribute(key, value);
                    if (!!obj) {
                        el.getAttributeNode(key)[cnsts.value] = obj;
                    }
                });
            }
        }
        /**
        * @function
        * @method
        */
        , "toggle": {
            "enumerable": true
            , "value": function toggleAttrib(el, attribNames) {
                ensureArray(attribNames)
                .forEach(function forEachName(name) {
                    if (el.hasAttribute(name)) {
                        el.removeAttribute(name);
                    }
                    else {
                        el.setAttribute(name, true);
                    }
                });
            }
        }
        /**
        * @function
        * @method
        */
        , "remove": {
            "enumerable": true
            , "value": function removeAttrib(el, attribNames) {
                ensureArray(attribNames)
                .forEach(function forEachName(name) {
                    !!el.removeAttribute && el.removeAttribute(name);
                });
            }
        }
        /**
        * @function
        * @method
        */
        , "has": {
            "enumerable": true
            , "value": function hasAttrib(el, attribNames) {
                return ensureArray(attribNames)
                .every(function everyName(name) {
                    return !!el.hasAttribute && el.hasAttribute(name);
                });
            }
        }
    });
}