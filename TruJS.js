/**[@naming({ "skip": true, "namespace": "TruJS" })]*/
/**
* Resolves an object from a path in dot notation
* @function resolvePath
* @param {string} name The path in dot notation
* @param {object} scope The starting point.
* @param {boolean} create Identifies if the missing paths should be created
*/
function resolvePath(name, scope, create) {
    var orig = scope
    , ns
    , match
    , parent
    , index
    , path = ""
    , found
    , indexKeys = [];

    //pre-compile the indexers
    name = name.replace(INDXR_PATT, function(match, val) {
        //if this is not a literal then resolve it
        if (!LITERAL_PATT.test(val)) {
            indexKeys.push(val);
            val = resolvePath(val, orig).value;
            if (isNill(val)) {
                val = "";
            }
            if (!isNumeric(val)) {
                val = '"' + val + '"';
            }
        }
        return "." + val + "";
    });

    //split the name using the dot notation
    ns = name.split(SPLIT_PATH);

    //loop through the names
    found =
    ns.every(function (val, pos) {
        //if we still have a scope
        if (!!scope && !!val) {
            //update the path
            if (isNumeric(val)) {
                pos < ns.length && (path = path + "[" + val + "]");
            }
            else {
                pos < ns.length && (path = path + (!!path && "." || "") + val);
            }

            //remove any quotes
            if (STR_PATT.test(val)) {
                val = val.substring(1, val.length - 1);
            }

            parent = scope;
            index = val;


            if (typeof scope === "object") {
                if (val in scope) {
                    scope = scope[val];
                    return true;
                }
                else if (create) {
                    if (isNumeric(ns[pos + 1])) {
                        scope[val] = [];
                    }
                    else {
                        scope[val] = {};
                    }
                    return true;
                }
            }

            scope = undefined;
            return false;
        }
        else {
            return false;
        }
    });

    //return the scope
    return {
        "value": scope
        , "parent": parent
        , "index": index
        , "path": path
        , "indexKeys": indexKeys
        , "found": found
    };
}
var SPLIT_PATH = /[.]/g
, INDXR_PATT = /\[(.+?)\]/g
, LITERAL_PATT = /^[0-9]+$|^'.*'$|^".*"$/
, STR_PATT = /^'.*'$|^".*"$/;
TruJS.resolvePath = resolvePath;

/**
 * Applies one objects members to another
 * @function
 * @param {Object} obj The object to get members from
 * @param {Object} target The object to add the members to
 * @param {Object} [defaults] Optional; The object that holds the defaults
 * @param {Boolean} [RemoveNulls] Optional; True to remove null members from the target object
 * @return {Object}
 */
function apply(o, t, d, rn) {
    if (!t) {
        t = {};
    }
    if (!o && !d) {
        return t;
    }
    //if we have o then loop through the members
    if (!!o) {
        for (var k in o) {
            //if we are not removing nulls or if the prop of o is not null
            if (!rn || !!o[k]) {
                t[k] = o[k];
            }
        }
    }
    //if there are defaults then apply them
    if (!!d) {
        t = applyIf(d, t);
    }
    //if we are removing nulls
    if (!!rn) {
        removeNulls(t);
    }
    return t;
}
TruJS.apply = apply;

/**
 * Applies one objects members to another if they don't already exist
 * @function
 * @param {Object} obj The object to get members from
 * @param {Object} target The object to add the members to
 * @param {Object} [defaults] Optional; The object that holds the defaults
 * @param {Boolean} [RemoveNulls] Optional; True to remove null members from the target object
 * @return {Object}
 */
function applyIf(o, t, d, rn) {
    if (!t) {
        t = {};
    }
    if (!o && !d) {
        return t;
    }
    //if we have o then loop through it's properties
    if (!!o) {
        for (var k in o) {
            if (isNill(t[k]) && (!rn || !isNill(o[k]))) {
                t[k] = o[k];
            }
        }
    }
    //if we have defaults then apply them
    if (!!d) {
        t = applyIf(d, t);
    }
    //if we are removing nulls
    if (!!rn) {
        removeNulls(t);
    }
    return t;
}
TruJS.applyIf = applyIf;

/**
* Removes all null members from the object
* @function removeNulls
* @param {Object} obj The object that will have it's null members removed
*/
function removeNulls(o) {
    for (var k in o) {
        if (o[k] === null) {
            delete o[k];
        }
    }
}
TruJS.removeNulls = removeNulls;

/**
* Merges two objects. When they share the same property and the value is a
* primitive, the value from the first object is used. If the shared property
* value is an object, then the objects are merged
* @function
*/
function merge(o1, o2) {
    var o3 = copy(o1);
    //loop through the first objects properties
    Object.keys(o1).forEach(function forEachKey(key) {
        if (o2.hasOwnProperty(key)) {
            if (isObject(o1[key]) && isObject(o2[key])) {
                o3[key] = merge(o1[key], o2[key]);
                return;
            }
        }
    });
    //loop through the second objects properties
    Object.keys(o2).forEach(function forEachKey(key) {
        if (!o1.hasOwnProperty(key)) {
            if (isObject(o2[key])) {
                o3[key] = copy(o2[key]);
            }
            else {
                o3[key] = o2[key];
            }
        }
    });

    return o3;
}
TruJS.merge = merge;

/**
* Updates o1 with any properties on o2 that don't exist on o1. If the property
* on o1 is an object and the property on o2 is an object, then it will run an
* update with those properties
* @function
*/
function update(o1, o2) {
    //loop through the first objects properties
    Object.keys(o1).forEach(function forEachKey(key) {
        if (o2.hasOwnProperty(key)) {
            if (isObject(o1[key]) && isObject(o2[key])) {
                update(o1[key], o2[key]);
                return;
            }
        }
    });
    //loop through the second objects properties
    Object.keys(o2).forEach(function forEachKey(key) {
        if (!o1.hasOwnProperty(key)) {
            o1[key] = o2[key];
        }
    });

    return o1;
}
TruJS.update = update;

/**
* Creates a deep copy of the object
* @function
*/
function copy(o) {
    return JSON.parse(JSON.stringify(o));
}
TruJS.copy = copy;

/**
* An empty function
* @function emFn
*/
function emFn() { }
TruJS.emFn = emFn;

/**
* Extracts the second portion of the toString call
* @function getType
*/
function getType(o) {
    var type = typeof o;
    if (!!o && type === 'object') {
        //test for promise
        if (isPromise(o)) {
            type = 'promise';
        }
        else {
            type = Object.prototype.toString.call(o).replace('[object ', '').replace(']', '');
        }
    }
    return type.toLowerCase();
}
TruJS.getType = getType;

/**
* Tests the value toString result for Array
* @function isArray
*/
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}
TruJS.isArray = isArray;

/**
* Tests String, Array, or Object to see if it's empty
* @function isEmpty
* @param {object} o The object to test
*/
function isEmpty(o) {
    if (o === undefined || o === null) {
        return true;
    }
    else if (isArray(o) || typeof o === 'string') {
        return o.length === 0;
    }
    else if (typeof o === 'object') {
        for (var key in o) {
            return false;
        }
        return true;
    }
    return false;
}
TruJS.isEmpty = isEmpty;

/**
* Tests the value for Element in the toString result
* @function isElement
* @param {object} o The object to test
*/
function isElement(o) {
    return !!o && /^\[object\s((HTML|SVG)[A-z]*Element|Text)\]$/.test(Object.prototype.toString.call(o));
}
TruJS.isElement = isElement;

/**
* Tests the value for Event in the toString result
* @function isEvent
* @param {object} o The object to test
*/
function isEvent(o) {
    return !!o && /^\[object\s[A-z]*Event\]$/g.test(Object.prototype.toString.call(o));
}
TruJS.isEvent = isEvent;

/**
* Tests the value for Error in the toString result
* @function isError
* @param {object} o The object to test
*/
function isError(o) {
    return !!o && /^\[object\s([A-z]*Error|DOMException)\]$/g.test(Object.prototype.toString.call(o));
}
TruJS.isError = isError;

/**
* Tests the value for tpye of function
* @function isFunc
* @param {object} o The object to test
*/
function isFunc(o) {
    return typeof o === 'function';
}
TruJS.isFunc = isFunc;

/**
* Test the value for undefined or null
* @function isNill
* @param {object} o The object to test
*/
function isNill(o) {
    return o === undefined || o === null;
}
TruJS.isNill = isNill;

/**
* Test the toString value for RegExp
* @function isRegEx
* @param {object} o The object to test
*/
function isRegEx(o) {
    return Object.prototype.toString.call(o) === '[object RegExp]';
}
TruJS.isRegEx = isRegEx;

/**
* Test the toString value for Arguments
* @function isArguments
* @param {object} o The object to test
*/
function isArguments(o) {
    return Object.prototype.toString.call(o) === '[object Arguments]';
}
TruJS.isArguments = isArguments;

/**
* Test the toString value for object
* @function
* @param {object} o The object to test
*/
function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}
TruJS.isObject = isObject;

/**
* Test the toString value for Collection
* @function isArguments
* @param {object} o The object to test
*/
function isCollection(o) {
    return Object.prototype.toString.call(o).indexOf('Collection') !== -1;
}
TruJS.isCollection = isCollection;

/**
* Test the toString value for List
* @function isArguments
* @param {object} o The object to test
*/
function isList(o) {
    return Object.prototype.toString.call(o).indexOf('List') !== -1;
}
TruJS.isList = isList;

/**
* Test the obj to see if it is a Promise
* @function isPromise
* @param {object} o The object to test
*/
function isPromise(o) {
    return typeof o === 'object' && (o instanceof Promise || Object.getPrototypeOf(o) === Promise || Promise.resolve(o) === o) || false;
}
TruJS.isPromise = isPromise;

/**
* Checks to see if the key is a property of the object
* @function
* @param {value} v The value to test
*/
function isProp(o, k) {
    return isObject(o) && o.hasOwnProperty(k) || false;
}
TruJS.isProp = isProp;

/**
* Checks to see if the key `k` is a prototype property of object `o`
* @function isPrototypeKey
* @param {object} o The object to test
* @param {string} k The object to test
*/
function isPrototypeKey(o, k) {
    if (!Object.prototype.hasOwnProperty.apply(o, [k]) && k in o) {
        return true;
    }
    return false;
}
TruJS.isPrototypeKey = isPrototypeKey;

/**
* Checks to see if the value is numeric
* @function
* @param {value} v The value to test
*/
function isNumeric(v) {
    return NUM_PATT.test(v);
}
var NUM_PATT = /^[0-9]+(?:[.][0-9]+)?$/

/**
* Checks to see if the valu is a string
* @function
* @param {value} v The value to test
*/
function isString(v) {
    return typeof v === "string";
}
TruJS.isString = isString;

/**
* Checks to see if the valu is a boolean
* @function
* @param {value} v The value to test
*/
function isBool(v) {
    return typeof v === "boolean";
}
TruJS.isBool = isBool;