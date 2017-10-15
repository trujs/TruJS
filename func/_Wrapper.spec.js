/**[@test({ "title": "TruJS.func._Wrapper: create wrapper with mocked inspector" })]*/
function testWrapper1(arrange, act, assert, callback, module) {
    var insp, func, wrapper, args;

    arrange(function () {
        args = ['args1', 'args2'];
        insp = callback({
            "name": 'test'
            , "params": args
        });
        wrapper = module(['TruJS.func._Wrapper', [insp]])();
        func = callback();
    });

    act(function () {
        wrapper.wrap(func);
        wrapper.exec(args);
    });

    assert(function (test) {
        test('The function inspector should have been ran once').value(insp).hasBeenCalled(1);
        test('The wrapper should have 2 params').value(wrapper, 'params').hasMemberCountOf(2);
        test('The wrappers first param should be "args1"').value(wrapper, 'params[0]').equals('args1');
        test('The wrapper name should be "test"').value(wrapper, 'name').equals('test');

        test('The wrapped function should have been called once').value(func).hasBeenCalled(1);
        test('The wrapped function should have 2 args').value(func).hasArgCountOf(2);
    });
}
/**[@test({ "title": "TruJS.func.Wrapper: create a function and wrap it" })]*/
function testWrapper2(arrange, act, assert, callback, module) {
    // This is a functional test of the initialized _Wrapper, TruJS.func.Wrapper
    //
    var wrapper, func1, wrapped1, func2, wrapped2, func3, wrapped3;

    arrange(function () {
        wrapper = module(['TruJS.func._Wrapper', []]);
        //create a function with some arguments
        func1 = function (arg1, _args, moreArgs) {
            console.log('Some stuff');
            var x = {};
            function test() {
                var t = x;
            };
        };
        //create a function with no args
        func2 = function func1() {
            //a function without arguments
            var test = 'test';

            function func(arg1, arg3) {

            };
        };
        //create a named function with some args
        func3 = function func3(arg1) {
            var test = 12345
            , test2 = {
                "object": this
            };
        };
    });

    act(function () {
        wrapped1 = wrapper().wrap(func1);
        wrapped2 = wrapper().wrap(func2);
        wrapped3 = wrapper().wrap(func3);
    });

    assert(function (test) {
        test('The param count for func1 should be 3').value(wrapped1, 'params').hasMemberCountOf(3);
        test('The name for func1 should be anonymous').value(wrapped1, 'name').equals('anonymous');

        test('The param count for func2 should be 0').value(wrapped2,'params').hasMemberCountOf(0);
        test('The name for func2 should be func1').value(wrapped2, 'name').equals('func1');

        test('The param count for func3 should be 1').value(wrapped3, 'params').hasMemberCountOf(1);
        test('The name for func3 should be func3').value(wrapped3, 'name').equals('func3');
    });
}
