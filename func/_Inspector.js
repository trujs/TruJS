/**
* A module to inspect a function and return it's meta data
*    Only partially ES6 compliant. Any parameter declaration that uses parenthesis will cause issues.
*
* @factory
*/
function _Inspector() {
    //**************************************************
    // static variables
    /**
    * RegEx used to extract the name, parameters, and body from a function
    * @property PARAM_LOOKUP
    * @private
    * @static
    */
    var FN_LOOKUP = /^[\s\r\n\t ]*function[\s\r\n\t ]*([\s\r\n\t ]*[A-z0-9_-]+[\s\r\n\t ]*)?[\s\r\n\t ]*\(((?:.|\r|\n)*?)\)[^{]*\{((?:.|\r|\n)*)\}[\s\r\n\t ]*$/i
    /**
    * RegEx used to remove the comments from a function
    * @property COM_PATT
    * @private
    * @static
    */
    , COM_PATT = /(?:\/\/.*)|(?:\/[*](?:.|\r?\n)*?[*]\/)/gm
    /**
    * RegEx used to remove line endings
    * @property COM_PATT
    * @private
    * @static
    */
    , LN_END_PATT = /\r?\n/g
    ;

    /**
    * Remove all comments from the function text
    * @function
    */
    function removeComments(fn) {
        return fn.toString().replace(COM_PATT, "");
    }

    /**
    * @worker
    */
    return function FunctionInspector(fn) {
        var fnText = removeComments(fn)
        , match = fnText.match(FN_LOOKUP)
        , name = !!match && match[1]
        , params = !!match && match[2]
        , body = !!match && match[3];

        if (!match) {
            throw new Error("The function is not in a valid format");
        }

        //see if the result is an empty string
        if (params.length === 0) {
            params = [];
        }
        else {
            //split the result
            params = params.split(',');
            //remove comments
            params = params.map(function (val) {
                return val.replace(COM_PATT, "").trim();
            });
        }

        /**
        * An object that holds the function meta data
        * @type FunctionMeta
        * @member {array} params The array of function parameters
        * @member {string} name The name of the function, or 'anonymous' if it's omitted
        */
        return Object.create(null, {
            "params": {
                "enumerable": true
                , "value": params
            }
            , "name": {
                "enumerable": true
                , "value": name
            }
            , "body": {
                "enumerable": true
                , "value": body
            }
        });
    };
}
