/**[@test({ "title": "TruJS.func._Async: functional test" })]*/
function testAsync1(arrange, assert, act, callback, module) {
    var async, fn, args, scope, res;

    arrange(function () {
        async = module(['TruJS.func._Async', []]);
        args = [1];
        scope = {};
        fn = callback();
        res="";
    });

    act(function (done) {
        fn = callback(function () {
            res+= "2";
            done();
        });
        async(fn, args, scope);
        res+= "1";
    });

    assert(function (test) {
        test('The 1st arg should be')
        .value(fn)
        .hasBeenCalledWithArg(0, 0, 1);

        test('The scope should be')
        .value(fn)
        .hasBeenCalledWithScope(scope);

        test("res should be")
        .value(res)
        .equals("12");

    });
}
