/**[@test({ "title": "TruJS.func.Stack: test the stack nested inside 3 functions" })]*/
function testStack1(arrange, act, assert, module) {
    var stack, func, res;

    arrange(function () {
        stack = module(['TruJS.func._Stack', []]);
        func = function outer() {
            (function () {
                (function inner() {
                    res = stack();
                })();
            })();
        };
    });

    act(function () {
      func();
    });

    assert(function (test) {
      test('The method value for the first stack entry should be')
        .value(res, '[0].method')
        .equals('inner');

      test('The method value for the second stack entry should be undefined')
        .value(res, '[1].method')
        .equals('eval');

      test('The method value for the third stack entry should be')
        .value(res, '[2].method')
        .equals('outer');

    });
}
