/**
*
* @factory
*/
function _ClassHelper() {

  /**
  * @worker
  */
  return Object.create(null, {
      "add": {
          "enumerable": true
          , "value": function (el, cls) {
              if (!this.has(el, cls)) {
                  el.className += (!!el.className && ' ' || '') + cls;
              }
              return this;
          }
      }
      , "remove": {
          "enumerable": true
          , "value": function (el, cls) {
              if (this.has(el, cls)) {
                  el.className =
                      el.className
                      .split(' ')
                      .map(function (val) {
                          return val !== cls && val || null;
                      })
                      .join(' ')
                      .trim();
              }
              return this;
          }
      }
      , "toggle": {
          "enumerable": true
          , "value": function (el, cls) {
              if (!this.has(el, cls)) {
                  this.add(el, cls);
              }
              else {
                  this.remove(el, cls);
              }
              return this;
          }
      }
      , "has": {
          "enumerable": true
          , "value": function (el, cls) {
              //test for the class
              return el.className.split(' ').indexOf(cls) !== -1;
          }
      }
  });
}
