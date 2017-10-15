/**
* The Watcher worker takes an object `data` and
* @factory
*/
function _Watcher(newGuid, objectAllKeys, objectCopy, log) {
    /**
    * The standard values added to every watcher
    * @property
    */
    var defaults = [
        "$process"
    ],
    /**
    * A reference to the watcher type for type checking
    * @property
    */
    self = this || {}
    ;
    /**
    * Checks for additional keys on the watcher object and updates them with getter/setter properties
    * @function
    * @param {object} token The watcher token, should be bound
    */
    function process(token, supress) {
        var keys = objectAllKeys(token.watcher);

        //see if there are more watcher keys than token keys
        if (keys.length > token.keys.length) {

            //loop through all the watcher keys
            keys.forEach(function forEachKey(key) {

                //see if this key is in the token keys
                if (token.keys.indexOf(key) === -1 && defaults.indexOf(key) === -1) {
                    //get  the value from the watcher and then delete it
                    var value = token.watcher[key];
                    delete token.watcher[key];

                    //add the property to the watcher
                    Object.defineProperty(token.watcher, key, createProperty(token, key));

                    //add the key to the token keys
                    token.keys.push(key);

                    //set the value, which will fire the events
                    if (!supress) {
                        token.watcher[key] = value;
                    }
                    //or add the value to the data collection, creating a watcher if the value is an object
                    else {
                        token.data[key] = value;
                        watchValue(token, key, value);
                    }
                }
            });
        }

        //run the $process on each child watcher
        processChildren(token, supress);
    }
    /**
    * Loops through the watcher's properties and executes $process on each child watcher
    * @function
    */
    function processChildren(token, supress) {
        token.keys.forEach(function forEachKey(key) {
            if (isWatcher(token.watcher[key])) {
                token.watcher[key].$process(supress);
            }
        });
    }
    /**
    * A proxy listener function, called when a child watcher is modified
    * @function
    */
    function childListener(token, parentKey, key, oldValue, newValue) {
        //if this key is a prototype then we'll need to stop the process, deffer the update process, and stop the update
        if (isPrototypeKey(token.data, parentKey)) {
            setTimeout(handleProtoUpdate, 1, token, parentKey, key, newValue);
            return false;
        }
        else if (!!token.listener) {
            //call the listener
            return token.listener(parentKey + '.' + key, oldValue, newValue);
        }
    }
    /**
    * Copies the prototype value, updates the data object, restarts the update
    * @function
    */
    function handleProtoUpdate(token, parentKey, key, value) {
        //copy the prototype value
        var copy = objectCopy(token.data[parentKey]);

        //watch the new value
        watchValue(token, parentKey, copy);

        //update the data with the non-prototype value
        token.data[parentKey] = copy;

        //update the value
        var res = resolvePath(key, token.watchers[parentKey]);
        res.parent[res.index] = value;
    }
    /**
    * Checks to see if the value is an unwatched object, adding a watcher if it is
    * @function
    */
    function watchValue(token, key, value) {
        // add a watcher if the value is an unwatched object
        if (isObject(value) && !isWatcher(value) && !value.hasOwnProperty("_nowatch")) {
            //created the watched value
            var listener = childListener.bind(null, token, key)
            , watched = Watcher(value, listener, key);

            //add the watched value to the watchers
            token.watchers[key] = watched;
        }
        //remove the watcher if the value is not an object
        else if (!isObject(value) && token.watchers.hasOwnProperty(key)) {
            delete token.watchers[key];
        }
    }
    /**
    * Encapsulates all object values
    * @function
    */
    function encapsulate(token) {
        token.keys.forEach(function forEachKey(key) {
            watchValue(token, key, token.data[key]);
        });
    }
    /**
    * Creates a $process property bound to the process function
    * @function
    */
    function addDefaultProperties(token, properties) {
        properties["$process"] = {
            "enumerable": false
            , "value": function (supress) {
                process(token, supress);
            }
        };
    }
    /**
    * Creates a property definition with a getter and setter functions
    * @function
    */
    function createProperty(token, key) {
        // return the property definer
        return {
            "enumerable": true
            , "configurable": true
            , "get": getter
            , "set": setter
        };

        /**
        * Sets the value on the data at `key` and then fires the change event
        * @function
        */
        function setter(value) {
            var oldValue = token.data[key]
            , result;
            if (value !== oldValue) {
                !!log && log.info('WatcherProperty.setter', key);

                //execute the listener now so we can get the feedback
                if (!!token.listener) {
                    result = token.listener(key, oldValue, value);
                }

                //if the return value is not false then we can continue to set the value
                if (result !== false) {
                    //set the value on the data object
                    token.data[key] = value;

                    //create a watched value of the new value is an unwatched object
                    watchValue(token, key, value);
                }
            }
        }

        /**
        * returns the value from the data at `key`
        * @function
        */
        function getter() {
            //if there is a watcher, return that
            if (token.watchers.hasOwnProperty(key)) {
                return token.watchers[key];
            }
            //other wise return the value on the data object
            return token.data[key];
        }
    }
    /**
    * Creates the watcher object adding a getter/setter property for each member of the keys array
    * @function
    */
    function createWatcher(token) {
        var properties = {};

        //create a getter/setter property for each member of the keys array
        token.keys.forEach(function forEachKey(key) {
            properties[key] = createProperty(token, key);
        });

        //add the $process function as a bound method
        addDefaultProperties(token, properties);

        //create the object with the _Watcher function as the prototype for type checking
        return Object.create(self, properties);
    }
    /**
    * Creates the initial token object
    * @function
    */
    function createToken(data, listener, key) {
        return {
            "keys": objectAllKeys(data) // used to track what has been processed
            , "data": data // the underlying data object
            , "watchers": {} // a collection of the watchers created for objects on `data`
            , "listener": listener // a function that will be called when a property has been changed
            , "key": key || 'root' // the external key that represents the `data`
        };
    }

    /**
    * @worker
    * @type {watcher}
    * @function
    * @param {object} data The object that will be encapsulated
    * @param {function} [listener] Optional. A function that will be called when a property value has changed
    * @param {string} [key] Optional. The external key that will reference this watcher. Mainly for logging.
    */
    function Watcher(data, listener, key) {
        //create the token object which will hold the meta data and data reference
        var token = createToken(data, listener, key);
        //setup the watcher on the token
        token["watcher"] = createWatcher(token);
        //encapsulate any members that are objects
        encapsulate(token);
        //return only the watcher
        return token.watcher;
    }

    /**
    * Tests a value to see if it is a Watcher object
    * @function
    * @static
    */
    function isWatcher(obj) {
        return !!obj && Object.getPrototypeOf(obj) === self;
    }

    Watcher.isWatcher = isWatcher;

    return Watcher;
}
