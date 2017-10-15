/**
* Helper methods for regex
* @factory
*/
function _RegEx() {

  var self = {};

  return self = Object.create(self, {
    /**
    * Returns an array of matches when evaluating `val` with `patt`
    * Each match is an array with the first member being the entire matched text
    *   and each subsequent match being match groups
    * @function
    */
    "getMatches": {
        "enumerable": true
        , "value": function getMatches(patt, val) {
            var matches = [];

            self.forEachMatch(patt, val, function (match) {
              matches.push(match);
            });

            return matches;
        }
    }
    /**
    * Executes the `fn` for each match when evaluating `val` with `patt`
    * @function
    */
    , "forEachMatch": {
      "enumerable": true
      , "value": function forEachMatch(patt, val, fn) {
        var match
        , pos
        ;
        if (val == null) {
            return matches;
        }
        while ((match = patt.exec(val)) !== null) {
            //see if we need to stop the loop
            if (patt.global && pos === patt.lastIndex) {
                break;
            }

            //get the position
            pos = match.index + match[0].length;
            //set the end
            match.end = pos - 1;

            //call the handler
            fn(match);

            //if this isn't global then exit
            if (!patt.global){
              break;
            }
        }
      }
    }
  });

}
