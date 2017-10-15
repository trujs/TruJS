/**
*
* @factory
*/
function _HttpRequest(XMLHttpRequest) {
    var EXTENSION_PATT = /\.([^\/#?]+)(?:[#?][^\/]*)?$/
    , TIMEOUT = 120000;

    /**
    * @worker
    */
    return function HttpRequest(request, callback, error) {
        /**
        * Handles the load event for the XMLHttpRequest
        * @function
        */
        function onLoad() {
            if (this.status === 200) {
                callback(getResponse(this));
            }
            else if (!request.processed) {
                error(getResponse(this) || this.statusText);
            }
        }
        /**
        * Handles the error event for the XMLHttpRequest
        * @function
        */
        function onError() {
            request.processed = true;
            error('Failed to load ' + request.url + '\n' + (getResponse(this) || this.statusText));
        }
        /**
        * Returns the response
        * @function
        */
        function getResponse(httpReq) {
            if (request.type === 'xml') {
                return httpReq.responseXml;
            }
            else {
                return httpReq.response;
            }
        }
        /**
        * Determines the request type
        * @function
        */
        function setType() {
            if (!request.type) {
                var ext = getExtension(request.url);
                if (!!ext) {
                    switch (ext) {
                        case 'json':
                            request.type = 'json';
                            break;
                        case 'html':
                            request.type = 'document';
                            break;
                        case 'blob':
                            request.type = 'blob';
                            break;
                        case 'arraybuffer':
                            request.type = 'arraybuffer';
                            break;
                        case 'xml':
                            request.type = 'xml';
                            break;
                    }
                }
            }
        }
        /**
        * Depending on the type, sets the responseType
        * @function
        */
        function setResponseType(httpReq) {
            switch (request.type) {
                case 'json':
                    httpReq.responseType = 'json';
                    break;
                case 'html':
                    httpReq.responseType = 'document';
                    break;
                case 'blob':
                    httpReq.responseType = 'blob';
                    break;
                case 'arraybuffer':
                    httpReq.responseType = 'arraybuffer';
                    break;
            }
        }
        /**
        * Gets the extension part of the url
        * @function
        */
        function getExtension(url) {
            var match = url.match(EXTENSION_PATT);
            return match[1];
        }
        /**
        * If there are headers set them
        * @function
        */
        function setHeaders(httpReq) {
            if (!!request.headers) {
                Object.keys(request.headers).forEach(function (key) {
                    httpReq.setRequestHeader(key, request.headers[key]);
                });
            }
        }
        /**
        * Creates the request, initializes it, and sends
        * @function
        */
        function send() {
            var httpReq = new XMLHttpRequest();
            setHeaders(httpReq);
            setResponseType(httpReq);
            httpReq.timeout = request.timeout || TIMEOUT;
            httpReq.addEventListener("load", onLoad);
            httpReq.addEventListener("error", onError);
            httpReq.open(request.method, request.url);
            httpReq.send(request.payload);
        }
        /**
        *
        * @function
        */
        function initialize() {
            //make the request an object
            if (typeof (request) === 'string') {
                request = {
                    "url": request
                    , "method": "GET"
                };
            }
            //get the type
            setType();
        }

        initialize();
        send();
    };
}
