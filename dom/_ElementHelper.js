/**
* Object initializer for the `TruJS.dom.ElementHelper` object
* @factory
*/
function _ElementHelper(createElement, createTextNode, getElementById, getElementsByTagName, querySelector) {

    /**
    *
    * @function
    */
    function getEl(id) {
        var el;
        //search for the id if the el argument is a string
        if (typeof (id) === 'string') {
            if (id == 'body') {
                el = getElementsByTagName('body')[0];
            }
            else {
                el = getElementById(id);
            }
        }
        //check for erroneous el argument
        else if (!!id && !isElement(id)) {
            throw new Error("The id argument must be a string or an HTMLElement");
        }
        else {
            el = id; //pass through if the id is already an element
        }
        //return the HTMLElement
        return el;
    };
    /**
    *
    * @function
    */
    function setClass(el, cls) {
        if (!!cls) {
            //if the innerHTML is a function then execute it
            if (typeof cls === 'function') {
                cls = cls();
            }
            //if the cls is an array join it
            if (isArray(cls)) {
                cls = cls.join(' ');
            }
            //set the className
            el.className = cls;
        }
    };
    /**
    *
    * @function
    */
    function setStyle(el, style) {
        if (!!style) {
            //if the style is a function then execute it
            if (typeof style === 'function') {
                style = style();
            }
            //if the style is an array then join it
            if (isArray(style)) {
                style = style.join(';');
            }
            //if the style is a string then set the cssText
            if (typeof (style) === 'string') {
                el.style.cssText = style;
            }
            else {
                throw new Error("The configuration style must be an object or a string");
            }
        }
    };
    /**
    *
    * @function
    */
    function applyAttributes(el, attributes) {
        if (!!attributes) {
            //apply the attribute object to the element
            apply(attributes, el);
        }
    };
    /**
    *
    * @function
    */
    function setInnerHtml(el, innerHTML) {
        if (!!innerHTML) {
            //if the innerHTML is a function then execute it
            if (typeof innerHTML === 'function') {
                innerHTML = innerHTML();
            }
            //if this is an array then join it
            if (isArray(innerHTML)) {
                innerHTML = innerHTML.join('');
            }
            //set the text
            el.innerHTML = innerHTML;
        }
    };
    /**
    *
    * @function
    */
    function addToTarget(el, target, insert) {
        if (!!target) {
            //resolve the target
            target = getEl(target);
            //resolve the element
            el = getEl(el);
            //if there isn't an insert value we'll just append
            if (isNill(insert)) {
                target.appendChild(el);
            }
                //if the insert value is an integer then insert before
            else if (Number.isInteger(insert)) {
                target.insertBefore(el, target[insert]);
            }
            else {
                throw new Error("Invalid insert value '" + integer + "', it must be an integer.");
            }
        }
    };
    /**
    *
    * @function
    * @params {HTMLElement} el The HTMLElement to add the listeners to
    */
    function wireListeners(el, listeners) {
        //loop through the listeners
        for (var event in listeners) {
          el.addEventListener(event, listeners[event], false);
        }
    };
    /**
    *
    * @function
    * @params {HTMLElement} el The HTMLElement to add the children to
    */
    function AddChildren(el, children) {
        if (!!children) {
            //ensure array
            if (!isArray(children)) {
                children = [children];
            }
            //loop through the children
            for (var i in children) {
                addChild(el, children[i]);
            }
        }
    };
    /**
    *
    * @function
    */
    function addChild(el, child) {
        //set the target
        child.target = el;
        //run the Element function
        createEl(child);
    };
    /**
    *
    * @function
    */
    function createEl(config) {
        //create the element
        var tag = !!config && config.tag || 'div'
        , el = tag !== 'text' && createElement(tag) || createTextNode(config.value)
        ;
        //if there is a config then we'll do some additional operations
        if (!!config) {
            //set the style
            setStyle(el, config.style);
            //set the class
            setClass(el, config.class);
            //apply the attributes
            applyAttributes(el, config.attributes);
            //set the id
            if (!!config.id) {
                el.id = config.id;
            }
            //set the inner html
            setInnerHtml(el, config.innerHTML);
            //add the listeners
            wireListeners(el, config.listeners);
            //add the items
            AddChildren(el, config.children);
            //append the element to the target
            addToTarget(el, config.target, config.insert);
        }
        //return the element
        return el;
    };

    /**
    * @worker
    */
    return Object.create(null, {
        /**
        * @method create
        * @param {object} definition The element definition object
        * @returns {HTMLElement}
        */
        "create": {
            "enumerable": true
            , "value": function create(definition) {
                return createEl(definition);
            }
        }
        /**
        * Searches for an element by id. The keyword 'body' will return the body element.
        * @method get
        * @param {string} id The id of the element to get, or 'body'.
        * @returns {HTMLElement|null}
        * @throws "The el argument must be a string or an HTMLElement"
        */
        , "get": {
            "enumerable": true
            , "value": function get(id) {
                return getEl(id);
            }
        }
        /**
        * Searches for elements using a selector
        * @method find
        * @param {string} selector The selector string to use when searching for elements
        * @returns {Array}
        */
        , "find": {
            "enumerable": true
            , "value": function find(selector) {
                var el;
                if (typeof (selector) === 'string') {
                    el = querySelector(selector);
                }
                //check for erroneous el argument
                else if (!!id && !isElement(selector)) {
                    throw new Error("The id argument must be a string or an HTMLElement");
                }
                else {
                    el = selector; //pass through if the selector is already an element
                }
                //ensure the return value is an array
                if (!isArray(el)) {
                    el = [el];
                }
                //return the HTMLElement
                return el;
            }
        }
        /**
        * Appends an element to the target
        * @method append
        * @param {HTMLElement|Array|string} el The HTMLElement, Array of HTMLElement or selector string that will be appended to the target. All elements returned by the selector will be appended.
        * @param {HTMLElement|string} target The target HTMLElement or string selector. The first element returned by the selector will become the target
        */
        , "append": {
            "enumerable": true
            , "value": function append(el, target) {
                addToTarget(el, target);
                //return this for chaining
                return this;
            }
        }
        /**
        * Inserts an element(s) using the index to determine the position
        * @method create
        * @param {HTMLElement|Array|string} el The HTMLElement, Array of HTMLElement or selector string that will be appended to the target. All elements returned by the selector will be appended.
        * @param {HTMLElement|string} target The target HTMLElement or string selector. The first element returned by the selector will become the target
        * @param {number} index The index at which to insert the element(s)
        */
        , "insert": {
            "enumerable": true
            , "value": function insert(el, target, index) {
                addToTarget(el, target, insert);
                //return this for chaining
                return this;
            }
        }
        /**
        * Removes the element from the parent
        * @method create
        * @param {HTMLElement|string} el The HTMLElement, Array of HTMLElement or selector string that will be appended to the target. All elements returned by the selector will be appended.
        */
        , "destroy": {
            "enumerable": true
            , "value": function destroy(el) {
                //if the el is a string treat it like an id
                if (typeof el === 'string') {
                    el = this.get(el);
                }
                //if el is not an element
                if (!isElement(el)) {
                    throw new Error("The el argument must be a valid element or element id");
                }
                //remove the element from the parent
                if (!!el.parentElement) {
                    el.parentElement.removeChild(el);
                }
                //return this for chaining
                return this;
            }
        }
    });
}
