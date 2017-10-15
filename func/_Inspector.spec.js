/**[@test({ "title": "TruJS.func.Inspector: create a function and inspect it" })]*/
function testInspector1(arrange, act, assert, module) {
    var fnInspector, func1, func2, func3, insp1, insp2, insp3;

    arrange(function arrangeFunc() {
        fnInspector = module(['TruJS.func._Inspector', []]);
        func1 = function func1(arg1) {
            //some fake stuff
            if (arg1 === '') {
                console.log('test');
            }
        };
        func2 = function () {

            if (arg1 === undefined) {

            }
            //no args here
        };
        func3 = function (param1, arg2, arg3) {
            arg1 = { "test": 'test' };
            if (arg2 == arg3) {

            }
        };
    });

    act(function actFunc() {
        insp1 = fnInspector(func1);
        insp2 = fnInspector(func2);
        insp3 = fnInspector(func3);
    });

    assert(function assertFunc(test) {
        test('The func1 name should be func1').value(insp1, 'name').equals('func1');
        test('The func1 param count should be 1').value(insp1, 'params').hasMemberCountOf(1);
        test('The func1 first param should be "arg1"').value(insp1, 'params[0]').equals('arg1');

        test('The func2 name should be anonymous').value(insp2, 'name').equals('anonymous');
        test('The func2 param count should be 0').value(insp2, 'params').hasMemberCountOf(0);

        test('The func3 name should be anonymous').value(insp3, 'name').equals('anonymous');
        test('The func3 param count should be 3').value(insp3, 'params').hasMemberCountOf(3);
        test('The func3 first param should be "param1"').value(insp3, 'params[0]').equals('param1');
        test('The func3 third param should be "arg3"').value(insp3, 'params[2]').equals('arg3');
    });
}
/**[@test({ "title": "TruJS.func.Inspector: getBody" })]*/
function testInspector2(arrange, act, assert, module) {
  var fnInspector, func1, insp1, func2, insp2, body1, body2;

  arrange(function arrangeFunc() {
    fnInspector = module(['TruJS.func._Inspector', []]);
    func1 = function test(var1, var2) {
      var a = {}
      ;
      //comments with { }
      a = "string with {  }";
    };

    func2 = "function(){var b='1234 { }'; }";
    insp1 = fnInspector(func1);
    insp2 = fnInspector(func2);
  });

  act(function actFunc() {
    body1 = insp1.body;
    body2 = insp2.body;
  });

  assert(function assertFunc(test) {
    test('body1 should be')
      .value(body1)
      .equals('var a = {}\r\n      ;\r\n      //comments with { }\r\n      a = \"string with {  }\";');

    test('body2 should be')
      .value(body2)
      .equals("var b='1234 { }';");
  });
}
/**[@test({ "title": "TruJS.func.Inspector: regression, no space between ) and {" })]*/
function testInspector3(arrange, act, assert, module) {
    var fnInspector, func, insp;

    arrange(function arrangeFunc() {
        fnInspector = module(['TruJS.func._Inspector', []]);
        func = 'function (var1){\nconsole.log("test"); \n}';
    });

    act(function actFunc() {
        insp = fnInspector(func);
    });

    assert(function assertFunc(test) {
        test('The func param count should be 1').value(insp, 'params').hasMemberCountOf(1);
        test('The func first param should be "var1"').value(insp, 'params[0]').equals('var1');
    });
}
/**[@test({ "title": "TruJS.func.Inspector: regression, \/**\/ in params" })]*/
function testInspector4(arrange, act, assert, module) {
    var fnInspector, func, insp;

    arrange(function arrangeFunc() {
        fnInspector = module(['TruJS.func._Inspector', []]);
        func = 'function (var1\n/**/){\nconsole.log("test"); \n}';
    });

    act(function actFunc() {
        insp = fnInspector(func);
    });

    assert(function assertFunc(test) {
        test('The func param count should be 1').value(insp, 'params').hasMemberCountOf(1);
        test('The func first param should be "var1"').value(insp, 'params[0]').equals('var1');
    });
}
