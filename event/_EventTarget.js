/**
*
* @factory
* @requires
*/
function _EventTarget(customEvent, resolvePath, objectIsMatch, global) {

    /**
    * A list of standard events
    * @property standardEvents
    * @private
    */
    var standardEvents = [
        { eventName: 'abort', eventType: 'UIEvent', objType: 'Element' }, { eventName: 'abort', eventType: 'ProgressEvent', objType: 'XMLHttpRequest' }, { eventName: 'abort', eventType: 'Event' }, { eventName: 'afterprint', eventType: 'Event' }, { eventName: 'animationend', eventType: 'AnimationEvent' }, { eventName: 'animationiteration', eventType: 'AnimationEvent' }, { eventName: 'animationstart', eventType: 'AnimationEvent' }, { eventName: 'audioprocess', eventType: 'AudioProcessingEvent' }, { eventName: 'beforeprint', eventType: 'Event' }, { eventName: 'beforeunload', eventType: 'BeforeUnloadEvent' }, { eventName: 'beginEvent', eventType: 'TimeEvent' }, { eventName: 'blocked', eventType: 'Event' }, { eventName: 'blur', eventType: 'FocusEvent' }, { eventName: 'cached', eventType: 'Event' }, { eventName: 'canplay', eventType: 'Event' }, { eventName: 'canplaythrough', eventType: 'Event' }, { eventName: 'change', eventType: 'Event' }, { eventName: 'chargingchange', eventType: 'Event' }, { eventName: 'chargingtimechange', eventType: 'Event' }, { eventName: 'checking', eventType: 'Event' }, { eventName: 'click', eventType: 'MouseEvent' }, { eventName: 'close', eventType: 'Event' }, { eventName: 'complete', eventType: 'OfflineAudioCompletionEvent' }, { eventName: 'compositionend', eventType: 'CompositionEvent' }, { eventName: 'compositionstart', eventType: 'CompositionEvent' }, { eventName: 'compositionupdate', eventType: 'CompositionEvent' }, { eventName: 'contextmenu', eventType: 'MouseEvent' }, { eventName: 'copy', eventType: 'ClipboardEvent' }, { eventName: 'cut', eventType: 'ClipboardEvent' }, { eventName: 'dblclick', eventType: 'MouseEvent' }, { eventName: 'devicemotion', eventType: 'DeviceMotionEvent' }, { eventName: 'deviceorientation', eventType: 'DeviceOrientationEvent' }, { eventName: 'dischargingtimechange', eventType: 'Event' }, { eventName: 'DOMActivate ', eventType: 'UIEvent' }, { eventName: 'DOMAttributeNameChanged ', eventType: 'MutationNameEvent' }, { eventName: 'DOMAttrModified ', eventType: 'MutationEvent' }, { eventName: 'DOMCharacterDataModified ', eventType: 'MutationEvent' }, { eventName: 'DOMContentLoaded', eventType: 'Event' }, { eventName: 'DOMElementNameChanged ', eventType: 'MutationNameEvent' }, { eventName: 'DOMFocusIn  Unimplemented', eventType: 'FocusEvent' }, { eventName: 'DOMFocusOut  Unimplemented', eventType: 'FocusEvent' }, { eventName: 'DOMNodeInserted ', eventType: 'MutationEvent' }, { eventName: 'DOMNodeInsertedIntoDocument ', eventType: 'MutationEvent' }, { eventName: 'DOMNodeRemoved ', eventType: 'MutationEvent' }, { eventName: 'DOMNodeRemovedFromDocument ', eventType: 'MutationEvent' }, { eventName: 'DOMSubtreeModified ', eventType: 'MutationEvent' }, { eventName: 'downloading', eventType: 'Event' }, { eventName: 'drag', eventType: 'DragEvent' }, { eventName: 'dragend', eventType: 'DragEvent' }, { eventName: 'dragenter', eventType: 'DragEvent' }, { eventName: 'dragleave', eventType: 'DragEvent' }, { eventName: 'dragover', eventType: 'DragEvent' }, { eventName: 'dragstart', eventType: 'DragEvent' }, { eventName: 'drop', eventType: 'DragEvent' }, { eventName: 'durationchange', eventType: 'Event' }, { eventName: 'emptied', eventType: 'Event' }, { eventName: 'ended', eventType: 'Event' }, { eventName: 'endEvent', eventType: 'TimeEvent' }, { eventName: 'error', eventType: 'UIEvent', objType: 'Element' }, { eventName: 'error', eventType: 'ProgressEvent', objType: 'XMLHttpRequest' }, { eventName: 'error', eventType: 'Event' }, { eventName: 'focus', eventType: 'FocusEvent' }, { eventName: 'focusin', eventType: 'FocusEvent' }, { eventName: 'focusout', eventType: 'FocusEvent' }, { eventName: 'fullscreenchange', eventType: 'Event' }, { eventName: 'fullscreenerror', eventType: 'Event' }, { eventName: 'input', eventType: 'Event' }, { eventName: 'invalid', eventType: 'Event' }, { eventName: 'keydown', eventType: 'KeyboardEvent' }, { eventName: 'keypress', eventType: 'KeyboardEvent' }, { eventName: 'keyup', eventType: 'KeyboardEvent' }, { eventName: 'languagechange', eventType: 'Event' }, { eventName: 'levelchange', eventType: 'Event' }, { eventName: 'load', eventType: 'UIEvent', objType: 'Element' }, { eventName: 'load', eventType: 'ProgressEvent', objType: 'XMLHttpRequest' }, { eventName: 'loadeddata', eventType: 'Event' }, { eventName: 'loadedmetadata', eventType: 'Event' }, { eventName: 'loadend', eventType: 'ProgressEvent' }, { eventName: 'loadstart', eventType: 'ProgressEvent' }, { eventName: 'message', eventType: 'MessageEvent' }, { eventName: 'mousedown', eventType: 'MouseEvent' }, { eventName: 'mouseenter', eventType: 'MouseEvent' }, { eventName: 'mouseleave', eventType: 'MouseEvent' }, { eventName: 'mousemove', eventType: 'MouseEvent' }, { eventName: 'mouseout', eventType: 'MouseEvent' }, { eventName: 'mouseover', eventType: 'MouseEvent' }, { eventName: 'mouseup', eventType: 'MouseEvent' }, { eventName: 'noupdate', eventType: 'Event' }, { eventName: 'obsolete', eventType: 'Event' }, { eventName: 'offline', eventType: 'Event' }, { eventName: 'online', eventType: 'Event' }, { eventName: 'open', eventType: 'Event' }, { eventName: 'orientationchange', eventType: 'Event' }, { eventName: 'pagehide', eventType: 'PageTransitionEvent' }, { eventName: 'pageshow', eventType: 'PageTransitionEvent' }, { eventName: 'paste', eventType: 'ClipboardEvent' }, { eventName: 'pause', eventType: 'Event' }, { eventName: 'pointerlockchange', eventType: 'Event' }, { eventName: 'pointerlockerror', eventType: 'Event' }, { eventName: 'play', eventType: 'Event' }, { eventName: 'playing', eventType: 'Event' }, { eventName: 'popstate', eventType: 'PopStateEvent' }, { eventName: 'progress', eventType: 'ProgressEvent' }, { eventName: 'ratechange', eventType: 'Event' }, { eventName: 'readystatechange', eventType: 'Event' }, { eventName: 'repeatEvent', eventType: 'TimeEvent' }, { eventName: 'reset', eventType: 'Event' }, { eventName: 'resize', eventType: 'UIEvent' }, { eventName: 'scroll', eventType: 'UIEvent' }, { eventName: 'seeked', eventType: 'Event' }, { eventName: 'seeking', eventType: 'Event' }, { eventName: 'select', eventType: 'UIEvent' }, { eventName: 'show', eventType: 'MouseEvent' }, { eventName: 'stalled', eventType: 'Event' }, { eventName: 'storage', eventType: 'StorageEvent' }, { eventName: 'submit', eventType: 'Event' }, { eventName: 'success', eventType: 'Event' }, { eventName: 'suspend', eventType: 'Event' }, { eventName: 'timeout', eventType: 'ProgressEvent' }, { eventName: 'timeupdate', eventType: 'Event' }, { eventName: 'touchcancel', eventType: 'TouchEvent' }, { eventName: 'touchend', eventType: 'TouchEvent' }, { eventName: 'touchenter', eventType: 'TouchEvent' }, { eventName: 'touchleave', eventType: 'TouchEvent' }, { eventName: 'touchmove', eventType: 'TouchEvent' }, { eventName: 'touchstart', eventType: 'TouchEvent' }, { eventName: 'transitionend', eventType: 'TransitionEvent' }, { eventName: 'unload', eventType: 'UIEvent' }, { eventName: 'updateready', eventType: 'Event' }, { eventName: 'upgradeneeded', eventType: 'Event' }, { eventName: 'versionchange', eventType: 'Event' }, { eventName: 'visibilitychange', eventType: 'Event' }, { eventName: 'volumechange', eventType: 'Event' }, { eventName: 'waiting', eventType: 'Event' }, { eventName: 'wheel', eventType: 'WheelEvent' }
    ]
    ;

    /**
    * A function to create an event object
    * @function createEventObject
    * @private
    */
    function createEventObject(evnt, data) {
        //see if this is a standard event
        var stdEvent = getStandardEvent(evnt)
        , eventObj;
        //if we found this as a standard event then create the event object
        if (!!stdEvent) {
            eventObj = createStdEvent(stdEvent, data);
        }
        //otherwise we'll create a custom event
        else {
            eventObj = new customEvent(evnt, { detail: data });
        }
        //add our stopPropigation
        setPropagation(eventObj);
        //return the event object
        return eventObj;
    };
    /**
    * Changes the stopPropagation function to ensure cancelBubble gets set to true
    * @function setPropagation
    * @private
    */
    function setPropagation(eventObj) {
        var stopFunc = eventObj.stopPropagation;
        eventObj.stopPropagation = function () {
            if (!!stopFunc) {
                stopFunc.apply(this, arguments);
            }
            eventObj.cancelBubble = true;
        };
    };
    /**
    *
    * @function createStdEvent
    * @private
    */
    function createStdEvent(stdEvent, data) {
        //get the event constructor
        var eventObj = resolvePath(stdEvent.eventType, global).value;
        //if the event constructor is a function then let's instantiate
        if (isFunc(eventObj)) {
            eventObj = new eventObj(stdEvent.eventName);
            eventObj.detail = data;
        }
        //return the event
        return eventObj;
    };
    /**
    *
    * @function getStandardEvent
    * @private
    */
    function getStandardEvent(evnt) {
        //search for a match
        var ev = [], i, nm = evnt;
        for (i = 0; i < standardEvents.length; i++) {
            if (standardEvents[i].eventName === evnt) {
                ev.push(standardEvents[i]);
            }
        }
        if (ev.length === 0) {
            return null;
        }
        else if (ev.length === 1) {
            return ev[0];
        }
        else {
            for (i = 0; i < ev.length; i++) {
                if (typeof (obj) === ev[i].objType) {
                    return ev[i];
                }
            }
        }
        return null;
    };
    /**
    * Checks for the presence of `name` in the `handlers` collection
    * @function getHandler
    * @private
    */
    function getHandler(handlers, name) {
        //check for the handler
        if (!handlers.hasOwnProperty(name)) {
            handlers[name] = [];
        }
        return handlers[name];
    };
    /**
    *
    * @function getEntryIndex
    * @private
    */
    function getEntryIndex(entries, handler, options) {
        //loop through the handlers and check for a match
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].handler === handler && objectIsMatch(entries[i].options, options)) {
                return i;
            }
        }
        return null;
    };
    /**
    *
    * @function addHandler
    * @private
    */
    function addHandler(name, handler, options) {
        //get the handler array
        var entries = getHandler(this, name);
        //see if there is already an entry for this func with these options
        if (getEntryIndex(entries, handler, options) !== null) {
            return;
        }
        //add the event to our list
        entries.push({ handler: handler, options: options });
    };
    /**
    *
    * @function removeHandler
    * @private
    */
    function removeHandler(name, handler, options) {
        //get the handler
        var entries = getHandler(this, name)
        , indx = getEntryIndex(entries, handler, options)
        ;
        //if we found an index then remove the entry
        if (indx !== null) {
            entries.splice(indx, 1);
        }
    };
    /**
    *
    * @function runEventHandlers
    * @private
    */
    function runEventHandlers(handler, e) {
        //loop through the event functions
        for (var i = 0; i < handler.length; i++) {
            handler[i].func.call(this, e, this);
        }
    };
    /**
    * A function to create an event object and run each handler
    * @function dispatchEvent
    * @private
    */
    function dispatchEvent(name, data) {
        var entries = getHandler(this, name)
        , event, handler, options
        ;
        if (entries.length > 0) {
            //get the event
            event = createEventObject(name, data);
            //run the entries
            setTimeout(dispatch, 1, name, event, entries, 0);
        }
    };
    /**
    *
    * @function
    */
    function dispatch(name, event, entries, indx) {
        //if cancelBubble is not set then we'll continue
        if (event.cancelBubble !== true) {
            var handler = entries[indx].handler;
            var options = entries[indx].options;
            //add the options to the event
            if (!!options) {
                //TODO: do something with the options
            }
            //run the handler
            handler.call(null, event);
            //run the next entry
            indx++;
            if (indx < entries.length) {
                setTimeout(dispatch, 1, name, event, entries, indx);
            }
        }
    }

    /**
    * Creates an event target object
    * @worker
    * @params {object} [listeners] Optional. A collection of event listeners
    */
    return function CreateEventTarget(listeners) {
        //*****************************************
        //private variables
        /**
        * A collection of event handlers that have been registered
        * @property handlers
        */
        var handlers = {}
        ;

        //*****************************************
        //initialize
        //add the listeners
        if (!!listeners) {
            //loop through the listeners collection
            for (var key in listeners) {
                addHandler.apply(handlers, [key, listeners[key].handler || listeners[key], listeners[key].options || null]);
            }
        }

        //*****************************************
        // return the object
        /**
        * @type TruJS.event.EventTarget
        */
        return Object.create(null, {
            /*
            * A function to add an event listener to a DOM element
            * @function addEventListener
            * @params {string} eventName The name of the event to listen on
            * @params {function} handler The function to be called when the event gets fired
            * @params {boolean} [useCapture=false] Option parameter to specify if this function needs to be fired before the event reaches the target
            */
            "addEventListener": {
                "enumerable": true
                , "value": addHandler.bind(handlers)
            }
            /*
            * A function to remove an event listener from the
            * @function removeEventListener
            * @params {string} eventName The name of the event to remove
            * @params {function} handler The function that was added to this event
            * @params {boolean} [useCapture=false] Option The value that was used when adding the listener
            */
            , "removeEventListener": {
                "enumerable": true
                , "value": removeHandler.bind(handlers)
            }
            /*
            * A function to fire an event
            * @function dispatchEvent
            * @params {string/Event} eventName The name of the the event to be fired or the event itself
            * @params {Object} data An object that will be passed to event listeners
            */
            , "dispatchEvent": {
                "enumerable": true
                , "value": dispatchEvent.bind(handlers)
            }
        });
    };
}
