/**
*
* @factory
*/
function _SimpleEvent($self, setTimeout, log, customEvent) {
    /**
    * Adds a `fn` to the handler array at `name`
    * @function
    */
    function addEventListener(handlers, name, fn) {
        getHandler(handlers, name)
            .push(fn);
    }
    /**
    * Removes a `fn` from the handler array at `name`
    * @function
    */
    function removeEventListener(handlers, name, fn) {
        var handler = getHandler(handlers, name)
        , index = handler.indexOf(fn);
        handler.splice(index, 1);
    }
    /**
    * Fires an event `name` with `data`
    * @function
    */
    function dispatchEvent(handlers, name, data, options) {
        var event = createEvent(name, data)
        , handler = getHandler(handlers, name);
        !!log && log.info('SimpleEvent.dispatchEvent', name);
        // execute the first handler synchronously for performance, unless
        //  the async option has been set
        if (!!options && !!options.async) {
            setTimeout(executeHandler, 0, handler, event, 0);
        }
        else {
            executeHandler(handler, event, 0);
        }
    }
    /**
    * Executes the function at `index` passing the `event` as a parameter
    * @function
    */
    function executeHandler(handler, event, index) {
        var fn = handler[index];

        try {
            fn.call(null, event);
        }
        catch (ex) {
            event.exception = ex;
            !!log && log.error('SimpleEvent.executeHandler', ex);
        }
        finally {
            index++;
        }
        if (index < handler.length && event.cancelBubble !== true) {
            setTimeout(executeHandler, 0, handler, event, index);
        }
    }
    /**
    * Returns the handler array at `name`, creating then entry in the collection if it doesn't exist
    * @function
    */
    function getHandler(handlers, name) {
        if (!handlers.hasOwnProperty(name)) {
            handlers[name] = [];
        }
        return handlers[name];
    }
    /**
    * Creates an event object `name` with `data`
    * @function
    */
    function createEvent(name, data) {
        return new customEvent(name, { detail: data });
    }
    /**
    * Creates the properties object with the `addEventHandler`, `removeEventHandler`, and `dispatchEvent` methods
    * @function
    */
    function createProperties() {
        var handlers = {};
        return {
            "addEventListener": {
                "enumerable": true
                , "value": addEventListener.bind(null, handlers)
            }
            , "removeEventListener": {
                "enumerable": true
                , "value": removeEventListener.bind(null, handlers)
            }
            , "dispatchEvent": {
                "enumerable": true
                , "value": dispatchEvent.bind(null, handlers)
            }
        };
    }
    /**
    * Checks an object to see if it's a SimpleEvent
    * @function isSimpleEvent
    * @static
    */
    $self.isSimpleEvent = isSimpleEvent;
    function isSimpleEvent(obj) {
        return Object.getPrototypeOf(obj) === TruJS.object._SimpleEvent;
    }

    /**
    * @mixin SimpleEvent
    */
    return function SimpleEvent(applyTo) {
        return Object.defineProperties(applyTo, createProperties());
    };
}
