/**
* An IOC Container factory
*
*   In the ContainerFactory dependencies are resolved in two different ways
*   1. Literal
*      Any value not fitting the factory initializer pattern will be preserved as a literal value
*
*   2. Factory
*      Any value matching the factory initializer pattern will be executed using 'factory'(['args'])
*
*   3. Object
*      Any value matching the object initializer patter will be transcended into and members resolved
*
*   4. Name
*      Any value matching the name initializer will be looked up
*
*   Factory Initializer Pattern ['factory', ['args'], {config}]
*       'factory' is the path to a factory function
*       [args] is an array of arguments to use when executing the factory function
*           An empty array assumes that all arguments can be resolved using the ioc container
*           An undefined member of the array will be looked up using the ioc container, e.g. [null,,'test'] the second argument will be resolved using the ioc container based on the name of the second argument in the factory function
*       {config}
*           If the value is false then the config is constructed with the runFactory property set to false. This value defaults to true otherwise
*           config:
*               runFactory: true causes the container to run the factory after resolving it
*               bind: causes the container to bind the factory function with the supplied values
*                   scope: the binding scope, can be an ioc entry pattern
*                   args:the args array, can have ioc entry patterns
*               singleton: true causes the container to store the result of the factory function and never run it again. Default is true
*
*    Object Initializer Pattern [{object}]
*        object is an object who's members need to be resolved using the ioc container
*
*    Name Initializer Pattern ['.name']
*        `.name` is a name from the dependencies

* @module TruJS.ioc._Container
* @param {function} functionInspector A function that inspects a function and returns an object
*/
function (functionInspector, objectLookup, iocEntry) {
    //*******************************************
    // static variables
    var PATH_PATT = /[^.\[\]_]+|\[([0-9]+)\]/g
    , SPLIT_PATT = /[.]|\[|\]/
    ;

    //*******************************************
    // factory function
    /**
    * @function ContainerFactory
    * @param {object} [dependencies] Optional. The object that contains the dependency list
    */
    return function ContainerFactory(dependencies) {
        //*******************************************
        //private variables
        /**
        * An object that the container will use as the name resolution root
        * @property {object} root
        */
        var root
        ;

        //*******************************************
        //initialize
        //ensure we have a dependencies object
        dependencies = dependencies || Object.create(null);

        //*******************************************
        // private static functions
        /**
        * Resolves a dependency entry
        * @function resolveDependency
        * @param {string} depName The name of the dependency to resolve. Names prefixed with a dot are looked up in the dependency list, otherwise the name is looked up in the global
        */
        function resolveDependency(depName, defaultValue) {
            //get the dependency
            var dep, factory, args;
            //if the name starts with a dot then resolve using the dependency list
            if (depName[0] === '.') {
                dep = resolveDepPath(depName.substring(1));
            }
            //if the name starts with : then it needs an eval
            else if (depName[0] === ':') {
              dep = eval(depName.substring(1));
            }
            //otherwise use the global scope to resolve
            else {
                //see if the root has been resolved
                if (!root) {
                    root = resolveDependency('.root') || {};
                }
                dep = objectLookup(root, depName);
                dep = resolveItem(dep);
            }
            //see if it's found
            if (dep === undefined) {
                if (defaultValue !== undefined) {
                    return defaultValue;
                }
                throw new Error("Unable to find the dependency '" + depName + "'");
            }
            //resolve the item and update the dependency entry
            return dep;
        }
        /**
        *
        * @function
        * @param {object} root The root object to resolve the name with
        *
        */
        function resolveDepPath(name) {
            var obj = dependencies, item;
            //the regex should split the name by . or [] or _
            name.match(PATH_PATT).every(function (val, indx, ar) {
                //remove the brackets
                if (val.indexOf('[') === 0) {
                    val = val.substring(1, val.length - 2);
                }

                //get the value from the parent
                item = obj[val];

                //if the item is an object entry and there is more to the path
                // then don't resolve the object, but rather the entry within
                if (iocEntry.getEntryType(item) === 'object' && indx < ar.length -1) {
                  item = item[0];
                }
                // otherwise ust resolve the item
                else {
                  item = resolveItem(item);
                }

                if (obj[val] !== item) {
                    obj[val] = item;
                }
                obj = item;

                //see if the item exists
                if (!obj) {
                    return false;
                }
                return true;
            });
            return obj;
        }
        /**
        * Resolves and runs the factory initializer
        * @function resolveFactory
        */
        function resolveFactory(dep) {
            //standardize the item's config
            setItemConfig(dep);
            //resolve the factory
            var config = dep[2]
            , factory = resolveDependency(dep[0], !!config && config.default);
            //run the bind
            factory = runBind(factory, config);
            //run the factory
            factory = runFactory(factory, dep[1], config);
            //if this is a singleton then update the dependencies
            if (config.singleton === true) {
                if (!!dep.name) {
                    dependencies[dep.name] = factory;
                }
            }
            //return the factory
            return factory;
        }
        /**
        * Checks for a bind config and runs the bind if exists
        * @function runBind
        */
        function runBind(factory, config) {
            //see if there is a bind
            if (!!config.bind) {
                //ensure we have a scope
                config.bind.scope = config.bind.scope || null;
                //if we have a scope then resolve it
                if (!!config.bind.scope) {
                    config.bind.scope = resolveItem(config.bind.scope);
                }
                //resolve the args if we have any
                if (!!config.bind.args && config.bind.args.length) {
                    config.bind.args.forEach(function (val, indx, ar) {
                        val = resolveItem(val);
                        ar[indx] = val;
                    });
                }
                //run the bind
                if (!!config.bind.args && !isEmpty(config.bind.args)) {
                    //with the args
                    actory = factory.bind(config.bind.scope, config.bind.args);
                }
                else {
                    //with just the scope
                    factory = factory.bind(config.bind.scope);
                }
            }
            return factory;
        }
        /**
        * Checks for the runFactory config option and runs the factory
        * @function runFactory
        */
        function runFactory(factory, args, config) {
            //if the runFactory option is set
            if (config.runFactory) {
                //get the factory's arguments
                var fnArgs = functionInspector(factory).params;
                //if there are factory arguments then use them
                if (fnArgs.length > 0) {
                    //combine the item args and the function args
                    fnArgs = fnArgs.map(function (val, indx) {
                        //if the item arg is undefined
                        if (args[indx] === undefined || args[indx] === "\b") {
                            //add an entry using the function's argument name
                            return ['.' + fnArgs[indx]];
                        }
                        return args[indx];
                    });
                    //if the length of arg is bigger
                    if (args.length > fnArgs.length) {
                        fnArgs = fnArgs.concat(args.slice(fnArgs.length));
                    }
                    args = fnArgs;
                }
                //resolve the arguments
                args = resolveEntryArgs(factory, args);
                //process the factory
                factory = factory.apply(null, args);
            }
            return factory;
        }
        /**
        * Resolves the object initializer
        * @function resolveObject
        */
        function resolveObject(dep) {
            //resolve each member of the object
            Object.keys(dep).forEach(function (key) {
                //resolve the val if its an entry
                if (iocEntry.getEntryType(dep[key]) !== 'value') {
                    dep[key] = resolveItem(dep[key]);
                    setKeyReference(dep, key, dep[key]);
                }
            });
            return dep;
        }
        /**
        * sets the `obj` member `name` to `val`. Multi-part names are supported, e.g. test.names[3].value, missing parts of the path will be created
        * @function
        */
        function setKeyReference(obj, name, val) {
            name.split(SPLIT_PATT).forEach(function (key, indx, arr) {
                if (!isNill(key)) {
                    if (indx === arr.length - 1) {
                        obj[key] = val;
                    }
                    else if (isNill(obj[key])) {
                        obj = obj[key] = {};
                    }
                    else {
                        obj = obj[key];
                    }
                }
            });
        }
        /**
        *
        * @function resolveItem
        */
        function resolveItem(dep) {
            var entryType = iocEntry.getEntryType(dep);
            switch (entryType) {
                case "factory":
                    return resolveFactory(dep);
                case "object":
                    return resolveObject(dep[0]);
                case "eval":
                case "name":
                    return resolveDependency(dep[0]);
                default:
                    return dep;
            }
        }
        /**
        * Standardizes the dependency item's config object
        * @function setItemConfig
        * @param {array} dep The dependency item
        */
        function setItemConfig(dep) {
            //if this is not an object then it's the runFactory option
            if (typeof (dep[2]) !== 'object') {
                dep[2] = {
                    "runFactory": dep[2] !== false
                };
            }
            //default the singleton option to true
            if (dep[2].singleton === undefined) {
                dep[2].singleton = true;
            }
        }
        /**
        * Resolves each member of the arguments array
        * @function resolveArgs
        * @param {array} args The arguments array
        */
        function resolveEntryArgs(self, args) {
            //loop through the args and resolve each one
            return args.map(function (val) {
                if (isSelf(val)) {
                    return self;
                }
                return resolveItem(val);
            });
        }
        /**
        * Resolves each member of the arguments array
        * @function resolveArgs
        * @param {array} args The arguments array
        */
        function resolveArgs(self, args, start, count) {
            //loop through the args and resolve each one
            return args.map(function (val, indx) {
                if (isNill(start) || (indx >= start && (isNill(count) || indx < start + count))) {
                    if (isSelf(val)) {
                        return self;
                    }
                    return resolveDependency('.' + val);
                }
                return null;
            });
        }

        /**
        * Tests to see if the value represents the $self built in dependency
        * @function
        * @pram {object|primitive} value The value to test
        */
        function isSelf(value) {
            if (value === '$self') {
                return true;
            }
            if (iocEntry.getEntryType(value) === 'name' && value[0] === '.$self') {
                return true;
            }
            return false;
        }
        /**
        * Inspects a function for it's named arguments and looks those up in the dependency collection
        * @method resolve
        * @param {function} fn The function to resolve dependencies for
        */
        function resolveFn(fn, start, count) {
            //resolve the params
            return resolveArgs(fn, functionInspector(fn).params, start, count);
        }
        /**
        *
        * @function
        * @param {function} fn The function to execute
        */
        function executeFn(fn) {
            fn = typeof (fn) === 'function' ? fn : resolveDependency(fn);
            return fn.apply(null, this.resolveFn(fn));
        }
        /**
        * Adds a dependency to the collection
        * @function
        * @param {function} name The name to give the dependency
        * @param {any} dep The dependency to add to the collection
        */
        function addDependency(name, dep) {
            //check to see if the dependency already exists
            if (dependencies.hasOwnProperty(name)) {
                throw new Error("The name '" + name + "' already exists in the dependency collection");
            }
            //add the dependency
            dependencies[name] = dep;
        }
        /**
        * Checks the dependency collection for the existance of `name`
        * @function
        * @param {string} name The name of the dependency to check exixtance for
        */
        function hasDependency(name) {
            return getEntry(name) !== undefined;
        }
        /**
        * Gets an entry, by `path`, and returns the unresolved dependency
        * @function
        */
        function getEntry(path) {
          var entry = dependencies;
          //loop through the parts of the path
          path.split('.').every(function everyPath(part) {
             entry = entry[part];
             if (entry === undefined) {
               return false;
             }

             if (iocEntry.getEntryType(entry) === 'object') {
               entry = entry[0];
             }

             return true;
          });

          return entry;
        }
        /**
        * Set's an entry value to the dependency collection. The `name` can be a path
        * @function
        */
        function setEntry(name, entry) {
            var parent = dependencies;
            //see if the name is a path
            if (name.indexOf('.') !== -1) {
                var path = name.split('.');
                name = path.pop();
                path = path.join('.');
                parent = objectLookup(dependencies, path);
            }
            //check to see if the dependency already exists
            if (dependencies.hasOwnProperty(name)) {
                throw new Error("The name '" + name + "' already exists in the dependency collection");
            }

            parent[name] = entry;
        }

        /**
        * @type TruJS.ioc.Container
        * @worker
        */
        dependencies["$container"] = Container;
        function Container(entry) {
            if (typeof (entry) === 'string') {
                return resolveDependency(entry, arguments[1]);
            }
            else if (isArray(entry)) {
                return resolveItem(entry);
            }
            else if (isFunction(entry)) {
                return resolveFn(entry, arguments[1], arguments[2]);
            }
        }
        return Object.defineProperties(dependencies["$container"], {
            "resolveFn": {
                "enumerable": true
                , "value": resolveFn
            }
            , "executeFn": {
                "enumerable": true
                , "value": executeFn
            }
            , "resolveName": {
                "enumerable": true
                , "value": resolveDependency
            }
            , "resolveEntry": {
                "enumerable": true
                , "value": resolveItem
            }
            , "getEntry": {
                "enumerable": true
                , "value": getEntry
            }
            , "setEntry": {
                "enumerable": true
                , "value": setEntry
            }
            , "addDependency": {
                "enumerable": true
                , "value": addDependency
            }
            , "hasDependency": {
              "enumerable": true
              , "value": hasDependency
            }
            , "isEntry": {
                "enumerable": true
                , "value": iocEntry.isEntry
            }
        });
    };
};
