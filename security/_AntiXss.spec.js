/**[@test({ "title": "TruJS.security.AntiXss: throw some stuff at it" })]*/
function testAntiXss(arrange, act, assert, module) {
    var antiXss, html1, html2, val1, res1, val2, res2;

    arrange(function () {
      antiXss = module(["TruJS.security._AntiXss", []]);
      html1 = '<div onclick="window.alert(\'msg\');">Some Content with onload in it</div>';
      html2 = '<a href="javascript:alert(\'msg\');">My Link</a>';
      val1 = null;
      res1 = '<div>Some Content with onload in it</div>';
      val2 = null;
      res2 = '<a>My Link</a>';
    });

    act(function () {
      //run the first html snippet
      val1 = antiXss(html1);
      //run the second html snippet
      val2 = antiXss(html2);
    });

    assert(function (test) {
      test('The val1 variable should match res1')
        .value(val1)
        .equals(res1);

      test('The val2 variable should match res2')
        .value(val2)
        .equals(res2);

    });
}
