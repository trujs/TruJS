/**[@test({ "title": "TruJS.log._Log: simple test" })]*/
function testLog1(arrange, act, assert, module) {
  var reporter, log, entries;

  arrange(function () {
    reporter = module(["TruJS.log._Reporter", []]);
    log = module(["TruJS.log._Log", [, , reporter]]);
  });

  act(function () {
    reporter.info("message 1");
    reporter.error(new Error("error"));
    reporter.info("message 2");
    entries = log.entries;
  });

  assert(function (test) {
    test("There should be 4 entries")
      .value(entries)
      .hasMemberCountOf(4);

    test("The 4th entry should be info")
      .value(entries, "[3].level")
      .equals("info");

  });
}
