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
    * RegEx used to extract the parameters from a function
    * @property PARAM_LOOKUP
    * @private
    * @static
    */
    var PARAM_LOOKUP = /^function\s*(?:[A-z0-9_-]+\s*)?\((.*?)\)[^{]*{/i
    /**
    * RegEx used to extract the name from a function
    * @property FN_NAME_LOOKUP
    * @private
    * @static
    */
    , FN_NAME_LOOKUP = /^function\s*([^(]*)?\(/i
    ;

    /**
    * Extracts an array of parameters from the function
    * @function getParams
    * @params {function} fn The function to be inspected
    * @private
    * @static
    */
    function getParams(fn) {
        //get the parameter part of the function
        var funcStr = fn.toString().replace(/\r?\n/g, '')
        , params = funcStr.match(PARAM_LOOKUP)
        ;
        if (!params) {
            throw new Error("The function is not in a valid format");
        }
        //get the first group
        params = params[1];
        //see if the result is an empty string
        if (params.length === 0) {
            return [];
        }
        //split the result
        params = params.split(',');
        //remove comments
        params = params.map(function (val) {
            return val.replace(/(\/[^\/]*\/)/, '').trim();
        });
        //return the results
        return params;
    };
    /**
    * Extracts the name of the function, using `anonymous` if a name is missing
    * @function getFnName
    * @params {function} fn The function to be inspected
    * @private
    * @static
    */
    function getFnName(fn) {
        return fn.toString().match(FN_NAME_LOOKUP)[1] || 'anonymous';
    };
    /**
    * Extracts the body of the function.
    * @function _getBody
    * @params {function} fn The function to be inspected
    * @private
    * @static
    */
    function getBody(fn) {
        var body = fn.toString()
        , start = body.indexOf('{')
        , end = body.lastIndexOf('}')
        ;
        //return the body
        return body.substring(start + 1, end).trim();
    };

    /**
    * @worker
    */
    return function FunctionInspector(fn) {
        /**
        * An object that holds the function meta data
        * @type FunctionMeta
        * @member {array} params The array of function parameters
        * @member {string} name The name of the function, or 'anonymous' if it's omitted
        */
        return Object.create(null, {
            "params": {
                "enumerable": true
                , "value": getParams(fn)
            }
            , "name": {
                "enumerable": true
                , "value": getFnName(fn)
            }
            , "body": {
                "enumerable": true
                , "value": getBody(fn)
            }
        });
    };
}
