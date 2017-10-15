/**
* **The Factory**
* This factory module creates a worker module. This is generally done once, to setup the dependencies, and
* the resulting worker is used globally.
*
* **The Worker**
* The worker module is called with a name(optional) and returns an object that is wired to wrap an external
* function
*
* **The FunctionWrapper**
* The `wrap` method receives a function to be wrapped, inspects the function and stores the meta data along
* with the function itself
*
* The meta data can be accessed through the `name` and,  the more relevant, `params` properties. Use the
* parameter names to determine the function's dependencies.
*
* Finally, the `exec` function can be called at anytime, with the proper arguments, to run the wrapped
* function
*
* **Details**
*     The cfg object is used to pass in dependencies that will be used by the worker module
*         @member {function} [fnInspector] Optional. The function used to get the `FunctionMeta`
*            object for a function
*
*    example:
*        //Imagine we've already created a worker module from the TruJS.utils._FunctionWrapper factory, called
         //functionWrapper. Now we'll use the worker module to create a wrapper object
*        var myFuncWrapper = functionWrapper("myFunc"); //the name "myFunc" is optional
*        //call some external function with `myFuncWrapper`'s wrap function
*        externalFunction(myFuncWrapper.wrap);
*        //now call the wrapped function
*        myFuncWrapper.exec(); // the console outputs: 'different lexical scope'
*
*        ---- some different lexical scope ---
*
*        function externalFunction(wrapper) {
*            var externalVar = 'different lexical scope';
*            //call the wrap method with a function declaration
*            wrapper(function () {
*                console.log(externalVar);
*            });
*        };
*
* @factory
*/
function _Wrapper(functionInspector, performance) {

    /**
    * @worker
    */
    return function (fn) {

        /**
        * The storage for the wrapped function and it's meta data
        * @property wrapped
        * @private
        */
        var wrapped = {
            fn: fn || emFn
            , params: []
            , runtime: 0
        }
        ;
        /**
        * Wraps the function for execute later
        * @function wrap
        * @param {function} fn The function to be wrapped
        */
        function wrap(fn) {
            //inspect the function
            var fnObj = functionInspector(fn);
            //store the function with it's meta data
            wrapped.fn = fn;
            wrapped.name = fnObj.name || name;
            wrapped.params = fnObj.params;
            return this;
        };

        // initialize
        if (!!fn) {
            wrap(fn)
        }

        /**
        * @type FunctionWrapper
        */
        return Object.create(null, {
            "wrap": {
                "enumerable": true
                , "value": wrap
            }
            /**
            * The name of the function, anonymous if the function has no name
            * @property name
            */
            , "name": {
                "enumerable": true
                , "get": function () { return wrapped.name; }
            }
            /**
            * An array of parameter names from the function signature
            * @property params
            */
            , "params": {
                "enumerable": true
                , "get": function () { return wrapped.params; }
            }
            /**
            * Executes the wrapped function with the params argument
            * @function exec
            * @param {array} params An array of parameters to call the wrapped function with
            */
            , "exec": {
                "enumerable": true
                , "value": function exec(params) {
                    var start = performance.now();
                    wrapped.fn.apply(null, params);
                    wrapped.runtime = performance.now() - start;
                }
            }
            /**
            * The runtime from the last execution
            * @property runtime
            */
            , "runtime": {
                "enumerable": true
                , "get": function () { return wrapped.runtime; }
            }
        }); //end FunctionWrapper
    }; // end worker module
}
