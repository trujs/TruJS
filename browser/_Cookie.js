/**
* This factory produces a worker object to help with cookie interaction
* @factory
*/
function _Cookie(document, regExGetMatches) {
    var COOKIE_PATT = / ?([^=]+)=([^;]+);?/g

    /**
    * Looks for an instance of `name` in the document.cookie
    * @function
    */
    function getCookie(name) {
        var value;

        regExGetMatches(COOKIE_PATT, decodeURIComponent(document.cookie))
          .every(function everyCookie(match) {
              if (match[1] === name) {
                  value = JSON.parse(match[2]);
                  return false;
              }
              return true;
          });

        return value;
    }
    /**
    * Sets the `name`/`value` pairs to the document cookie
    * @function
    */
    function setCookie(name, value, days, path) {
        var d, expires = "";

        path = path || "/";
        if (!!days) {
            d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + d.toUTCString();
        }

        value = JSON.stringify(value);

        document.cookie = name + "=" + value + expires + ";path=" + path;
    }
    /**
    * Removes the cookie `name` from the document cookies
    * @function
    */
    function deleteCookie(name, path) {
        path = path || "/";
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=' + path;
    }

    /**
    * @worker
    */
    return Object.create(null, {
        "get": {
            "enumerable": true
            , "value": getCookie
        }
        , "set": {
            "enumerable": true
            , "value": setCookie
        }
        , "delete": {
            "enumerable": true
            , "value": deleteCookie
        }
    });
}