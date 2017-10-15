/**[@test({ "title": "TruJS.RegEx: unit test" })]*/
function testRegEx1(arrange, act, assert, module) {
    var getMatches, patt, test, res;

    arrange(function () {
      getMatches = module(["TruJS._RegEx", []]).getMatches;

      patt = /<([^\/\s>]+)([^\/>]+)?[\/]?>/g;
      test = '<input data-point value ="{:input:}" class="input:1234px;"/><div></div><span class=\'test\'></span>';
    });

    act(function () {
      res = getMatches(patt, test);
    });

    assert(function (test) {
      test('There should be 3 matches').value(res).hasMemberCountOf(3);
      test('The first match, 1st group should be').value(res, '[0][1]').equals('input');
      test('The first match, 2nd group should be').value(res, '[0][2]').equals(' data-point value ="{:input:}" class="input:1234px;"');
    });
}
