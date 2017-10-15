/**
* Runs a function asynchronously and returns a promise
* @factory
*/
function _Async(promise, setTimeout) {

    /**
    * Executes a function asynchronously
    * @worker
    * @param {function} fn The function to be ran
    * @param {array} [args] Optional. The argument array
    * @param {scope} [scope] Optional. The scope
    */
    return function Async(fn, args, scope) {

        return new Promise(function (resolve, reject) {
            setTimeout(asyncFn, 0);

            function asyncFn() {
                try {
                    resolve(fn.apply(scope, args));
                }
                catch(ex) {
                    reject(ex);
                }
            }
        });
    };
}
