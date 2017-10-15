/**
* Creates a delay object which wraps a function and delays it with a setTimeout, each time the delay is called the
*   setTimeout is canceled and a new one starts. Scope and parameters can be changed when the function is delayed
* @factory
*/
function _Delay($self, setTimeout, log, performance) {

    /**
    * Creates a `TruJS.func.Delay` object
    * @worker
    * @param {function} fn The function that will be ran after the delay
    */
    return function Delay(fn, args, scope) {
        /**
        * @property {object} token The internal token used to store the args and scope
        * @private
        */
        var token = {
            "id": null
            , "status": 'created'
            , "args": args
            , "scope": scope
        };
        /**
        * Cancels the current `setTimeout` and starts a new one with `ms`, updating the `args` and `scope` when included
        * @function
        * @param {number} ms The number of milliseconds for which to delay the `fn`
        * @param {array} [args] Optional. The array of arguments with which the `fn` will be called
        * @params {object} [scope] Optional. The scope in which the `fn` will be called
        */
        function delay(ms, args, scope) {
            //clear any previous timeouts
            clear();
            token.status = 'delayed';

            updateToken(args, scope);

            token.start = performance.now();
            token.id = setTimeout(run, ms);

            return this;
        }
        /**
        * Clears the timeout if an `id` is present
        * @function
        */
        function cancel() {
            if (!!token.id) {
                clear();
                token.status = 'canceled';
            }

            return this;
        }
        /**
        * Sets the args and scope to what was passed to the Delay worker
        * @function
        */
        function reset() {
            token.args = args;
            token.scope = scope;
        }
        /**
        * Executes the `fn` immediately, clearing the timeout if there's an `id`
        * @function
        * @param {array} [args] Optional. The array of arguments with which the `fn` will be called
        * @params {object} [scope] Optional. The scope in which the `fn` will be called
        */
        function execute(args, scope) {
            if (!!token.id) {
                clear();
            }

            updateToken(args, scope);

            run();

            return this;
        }
        /**
        *
        * @function
        */
        function run() {
            try {
                token.status = 'executed';
                fn.apply(token.scope || null, token.args || []);
            }
            catch (ex) {
                token.exception = ex;
                token.status = 'exception';
                !!log && log.error('Delay.run', ex);
            }
        }
        /**
        * Clears the timeout if there is an `id`
        * @function
        */
        function clear() {
            if (!!token.id) {
                clearTimeout(token.id);
                token.id = null;
            }
        }
        /**
        * Updated the `token` with the `scope` and `args` if not present
        * @function
        */
        function updateToken(args, scope) {
            !!args && (token.args = args);
            !!scope && (token.scope = scope);
        }
        /**
        * @type TruJS.func.Delay
        */
        return Object.create($self, {
            "delay": {
                "enumerable": true
                , "value": delay
            }
            , "execute": {
                "enumerable": true
                , "value": execute
            }
            , "cancel": {
                "enumerable": true
                , "value": cancel
            }
            , "reset": {
                "enumerable": true
                , "value": reset
            }
            , "args": {
                "enumerable": true
                , "get": function () { return token.args; }
            }
            , "scope": {
                "enumerable": true
                , "get": function () { return token.scope; }
            }
            , "status": {
                "enumerable": true
                , "get": function () { return token.status; }
            }
            , "exception": {
                "enumerable": true
                , "get": function () { return token.exception; }
            }
        });
    };
}
