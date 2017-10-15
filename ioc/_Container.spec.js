/**[@test({ "title": "TruJS.ioc._Container: resolve a functions dependencies" })]*/
function testIocContainer1(arrange, assert, act, callback, module) {
    var insp, resolvePath, container, dependencies, func, args;

    arrange(function () {
        //create a mock dependency object
        dependencies = {
            "test": {}
            , "test1": {}
            , "test3": {}
        };
        //create the mock function inspector
        insp = callback({ "params": ['test', 'test3'] });
        resolvePath = callback(function (obj, name) {
            return obj[name];
        }, true);
        //create the container with a mock dependency object
        container = module(['TruJS.ioc._Container', [insp, resolvePath]])(dependencies);
        //create a fake function
        func = function (test, test3) {

        };
    });

    act(function () {
        //resolve for func
        args = container.resolveFn(func);
    });

    assert(function (test) {
        test('The args count should be 2').value(args).hasMemberCountOf(2);
        test('The first arg should equal the value for "test"').value(args, '[0]').equals(dependencies.test);
        test('The second arg should equal the value for "test3"').value(args, '[1]').equals(dependencies.test3);
        test('The function inspector should have been called once').value(insp).hasBeenCalled(1);
    });
}
/**[@test({ "title": "TruJS.ioc._Container: addDependency" })]*/
function testIocContainer2(arrange, assert, act, callback, module) {
    var insp, container, dependencies, newDep1, newDep2;

    arrange(function () {
        //create a mock dependency object
        dependencies = {};
        //create the container with a mock dependency object
        container = module(['TruJS.ioc._Container', []])(dependencies);
        //create the newDep values
        newDep1 = 'test';
        newDep2 = {};
    });

    act(function () {
        container.addDependency('test', newDep1);
        container.addDependency('test2', newDep2);
    });

    assert(function (test) {
        test('The dependency object should have a "test" property').value(dependencies).hasProperty('test');
        test('The dependency object should have a "test2" property').value(dependencies).hasProperty('test2');
    });
}
/**[@test({ "title": "TruJS.ioc.Container: resolveEntry" })]*/
function testIocContainer3(arrange, act, assert, module) {
    var deps, cont, bar, func1, res1, func2, res2, res3, cont;

    arrange(function () {
        //create the mock function
        func1 = function (test, value, bar) { };
        func2 = function () { };
        //create the mock dependencies
        deps = {
            "test": 12345
            , "root": {}
            , "value": 'string'
            , "func": function (value) {
                return value;
            }
        };
        cont = module(['TruJS.ioc._Container', []])(deps);
        bar = {};
    });

    act(function () {
        res1 = cont.resolveEntry(['.func', []]);
        res2 = cont.resolveEntry(['.func', [], false]);
        res3 = cont.resolveEntry(['.missing', [], { "default": 'default' }]);
    });

    assert(function (test) {
        test('The res1 should be').value(res1).equals(deps.value);
        test('The res2 should be').value(res2).equals(deps.func);
        test('The res3 value should be').value(res3).equals('default');
    });
}
/**[@test({ "title": "TruJS.ioc.Container: functional test" })]*/
function testIocContainer4(arrange, act, assert, module) {
    var deps, cont, bar, func1, res1, func2, res2, cont;

    arrange(function () {
        //create the mock function
        func1 = function (test, value, bar) { };
        func2 = function () { };
        //create the mock dependencies
        deps = {
            "test": 12345
            , "value": 'string'
        };
        bar = {};
    });

    act(function () {
        cont = module(['TruJS.ioc._Container', []])(deps);
        cont.addDependency('bar', bar);
        res1 = cont.resolveFn(func1);
        res2 = cont.resolveFn(func2);
    });

    assert(function (test) {
        test('The res1 array should have 3 members').value(res1).hasMemberCountOf(3);
        test('The res2 array should have 0 members').value(res2).hasMemberCountOf(0);

        test('The first member of res1 should equal deps.test').value(res1, '[0]').equals(deps.test);
        test('The first member of res1 should equal deps.value').value(res1, '[1]').equals(deps.value);
        test('The first member of res1 should equal bar').value(res1, '[2]').equals(bar);
    });
}
