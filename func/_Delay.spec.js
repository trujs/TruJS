/**[@test({ "title": "TruJS.func._Delay: functional test with execute and delay" })]*/
function testDelay1(arrange, act, assert, callback, module) {
    var delayWorker, delayObj, fn, args1, args2, scope, ms, cnt;

    arrange(function () {
        delayWorker = module(['TruJS.func._Delay', []]);

        args1 = [1];
        args2 = [2];
        scope = {};
        ms = 20;

        cnt = 0;
    });

    act(function (done) {
        fn = callback(function () {
            cnt++;
            if (cnt == 2) {
                done();
            }
        }, true);

        delayObj =
            delayWorker(fn)
            .execute(args1)
            .delay(ms, args2, scope);
    });

    assert(function (test) {
        test('The fn should be called').value(fn).hasBeenCalled(2);

        test('The 1st fn call 1st arg should be').value(fn).hasBeenCalledWithArg(0, 0, 1);
        test('The 1st fn call scope should be').value(fn.getScope(0)).isNill();

        test('The 2nd fn call 1st arg should be').value(fn).hasBeenCalledWithArg(1, 0, 2);
        test('The 2nd fn call scope should be').value(fn).hasBeenCalledWithScope(1, scope);

        test('The status should be').value(delayObj, 'status').equals('executed');
    });
}
/**[@test({ "title": "TruJS.func._Delay: functional test with cancel" })]*/
function testDelay2(arrange, act, assert, callback, module) {
    var delayWorker, delayObj, fn, args, scope, ms;

    arrange(function () {
        delayWorker = module(['TruJS.func._Delay', []]);

        args = [1];
        scope = {};
        ms = 100;
        fn = callback();
    });

    act(function () {
        delayObj =
            delayWorker(fn)
            .delay(ms, args, scope)
            .cancel();
    });

    assert(function (test) {
        test('The fn should not be called').value(fn).not().hasBeenCalled();
        test('The status should be').value(delayObj, 'status').equals('canceled');
    });
}
