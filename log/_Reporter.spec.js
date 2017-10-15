/**[@test({ "title": "TruJS.log._Reporter: test default log levels" })]*/
function testReporter1(arrange, act, assert, callback, module) {
  var reporter, handler;

  arrange(function () {
    reporter = module(["TruJS.log._Reporter", []]);
    handler = callback();

  });

  act(function () {
    reporter.addHandler(handler);
    reporter.info("info"); //should fire
    reporter.extended("extended");
    reporter.metric("metric");
    reporter.warning("warning");
    reporter.error("error"); //should fire
    reporter.error(new Error("error")); //should fire twice
  });

  assert(function (test) {
    test("The handler should be called 4 times")
      .value(handler)
      .hasBeenCalled(4);

    test("The 1st handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(0, 0, "info");

    test("The 2nd handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(1, 0, "error");

    test("The 3rd handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(2, 0, "error");

    test("The 3rd handler call should be")
      .run(handler.getArgs, [3])
      .value("{value}", "[0]")
      .contains("Error: error");

  });
}

/**[@test({ "title": "TruJS.log._Reporter: multiple handlers" })]*/
function testReporter1(arrange, act, assert, callback, module) {
  var reporter, handler1, handler2;

  arrange(function () {
    reporter = module(["TruJS.log._Reporter", []]);
    handler1 = callback();
    handler2 = callback();
  });

  act(function () {
    reporter.addHandler(handler1);
    reporter.info("info1"); //should fire
    reporter.addHandler(handler2);
    reporter.info("info2"); //should fire
  });

  assert(function (test) {
    test("The handler1 should be called 2 times")
      .value(handler1)
      .hasBeenCalled(2);

    test("The handler2 should be called 1 time")
      .value(handler2)
      .hasBeenCalled(1);

  });
}

/**[@test({ "title": "TruJS.log._Reporter: setting levels, comma delimeted" })]*/
function testReporter1(arrange, act, assert, callback, module) {
  var reporter, handler;

  arrange(function () {
    reporter = module(["TruJS.log._Reporter", []]);
    handler = callback();
  });

  act(function () {
    reporter.addHandler(handler);
    reporter.setLevels("info,extended,metric");
    reporter.info("info"); //should fire
    reporter.extended("extended"); //should fire
    reporter.metric("metric"); //should fire
    reporter.warning("warning");
    reporter.error("error");
  });

  assert(function (test) {
    test("The handler should be called 3 times")
      .value(handler)
      .hasBeenCalled(3);

    test("The 1st handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(0, 0, "info");

    test("The 2nd handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(1, 0, "extended");

    test("The 3rd handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(2, 0, "metric");

  });
}

/**[@test({ "title": "TruJS.log._Reporter: setting level to all" })]*/
function testReporter1(arrange, act, assert, callback, module) {
  var reporter, handler;

  arrange(function () {
    reporter = module(["TruJS.log._Reporter", []]);
    handler = callback();
  });

  act(function () {
    reporter.addHandler(handler);
    reporter.setLevels("all");
    reporter.info("info"); //should fire
    reporter.extended("extended"); //should fire
    reporter.metric("metric"); //should fire
    reporter.warning("warning"); //should fire
    reporter.error("error"); //should fire
  });

  assert(function (test) {
    test("The handler should be called 5 times")
      .value(handler)
      .hasBeenCalled(5);

    test("The 1st handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(0, 0, "info");

    test("The 2nd handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(1, 0, "extended");

    test("The 3rd handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(2, 0, "metric");

    test("The 4th handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(3, 0, "warning");

    test("The 5th handler call should be")
      .value(handler)
      .hasBeenCalledWithArg(4, 0, "error");

  });
}
