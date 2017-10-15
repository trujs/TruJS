/**[@test({ "title": "TruJS.func._Async: functional test" })]*/
function testAsync1(arrange, assert, act, callback, module) {
    var async, fn, args, scope;

    arrange(function () {
        async = module(['TruJS.func._Async', []]);
        args = [1];
        scope = {};
        fn = callback();
    });

    act(function (done) {
        async(fn, args, scope)
            .then(done);
    });

    assert(function (test) {
        test('The 1st arg should be').value(fn).hasBeenCalledWithArg(0, 0, 1);
        test('The scope should be').value(fn).hasBeenCalledWithScope(scope);
    });
}
