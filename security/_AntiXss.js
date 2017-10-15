/**
* A module that provides cleansing to protect against XSS
* @factory
*/
function _AntiXss() {
  var pattTag = /[<]([^>]+)[>]?/
  , pattOnx = /on[A-z]+\s?=\s?('|").*?(\1)/g
  , pattSrc = /(src|href)\s?=\s?("|')javascript:.+\2/gi
  ;

  /**
  * Finds all tag and inspects each one
  * @function iterateTags
  * @private
  */
  function iterateTags(value) {
    return value.replace(pattTag, function (match, grp1, indx) {
      var val = inspectTag(grp1);
      return '<' + val + '>';
    });
  }
  /**
  * Runs various inspections on the tag
  * @function inspectTag
  * @private
  */
  function inspectTag(tag) {
    tag = removeInlineJs(tag);
    tag = removeSrcJs(tag);
    return tag;
  }
  /**
  * Removes any inline JavaScript; onclick, etc...
  * @function removeInlineJs
  * @private
  */
  function removeInlineJs(tag) {
    //look for on....
    return tag.replace(pattOnx, function (val) {
        return '';
    }).trim();
  }
  /**
  * Removes any links and JavaScript; src="javascript:..."
  * @function removeSrcJs
  * @private
  */
  function removeSrcJs(tag) {
    return tag.replace(pattSrc, function (val) {
      return '';
    }).trim();
  }

  /**
  * @worker
  */
  return function cleanse(value) {
      return iterateTags(value);
  };
}
