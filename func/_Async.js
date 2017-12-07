/**
* Runs a function asynchronously and returns a promise
* @factory
*/
function _Async(promise) {

    /**
    * Executes a function asynchronously
    * @worker
    * @param {function} fn The function to be ran
    * @param {array} [args] Optional. The argument array
    * @param {scope} [scope] Optional. The scope
    */
    return function Async(fn, args, scope) {
        return promise.resolve()
        .then(function () {
            return new promise(function (resolve, reject) {
                try {
                    resolve(fn.apply(scope || null, args));
                }
                catch(ex) {
                    reject(ex);
                }
            });
        });
    };
}
