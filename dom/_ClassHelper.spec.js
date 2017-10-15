/**[@test({ "title": "TruJS.dom.ClassHelper: add, remove and toggle an elements class" })]*/
function testClassHelper1(arrange, act, assert, element, module) {
    var classHelper, el;

    arrange(function arrange() {
      classHelper = module(["TruJS.dom._ClassHelper", []]);
      el = element({
          "className": 'class1'
      });
    });

    act(function act() {
      classHelper.add(el, 'class2');
      classHelper.toggle(el, 'class1');
      classHelper.remove(el, 'class2');
    });

    assert(function assert(test) {
      test('The className should be empty').value(el, 'className').isEmpty();
    });
}
/**[@test({ "title": "TruJS.dom.ClassHelper: add classes to the element" })]*/
function testClassHelper2(arrange, act, assert, element, module) {
    var el, classHelper;

    arrange(function arrange() {
      classHelper = module(["TruJS.dom._ClassHelper", []]);
      el = element({
          "className": ''
      })();
    });

    act(function act() {
      classHelper.add(el, 'class1');
      classHelper.add(el, 'class2');
      classHelper.add(el, 'class3');
    });

    assert(function assert(test) {
      test('The className should be "class1 class2 class3"').value(el, 'className').equals('class1 class2 class3');
    });
}
/**[@test({ "title": "TruJS.dom.ClassHelper: toggle an elements class" })]*/
function testClassHelper3(arrange, act, assert, element, module) {
    var el, classHelper;

    arrange(function arrange() {
      classHelper = module(["TruJS.dom._ClassHelper", []]);
      el = element({
          "className": 'class1'
      })();
    });

    act(function act() {
        classHelper.toggle(el, 'class1');
        classHelper.toggle(el, 'class2');
    });

    assert(function assert(test) {
        test('The className should be "class2"').value(el, 'className').equals('class2');
    });
}
/**[@test({ "title": "TruJS.dom.ClassHelper: remove classes from the element" })]*/
function testClassHelper4(arrange, act, assert, element, module) {
    var el, classHelper;

    arrange(function arrange() {
      classHelper = module(["TruJS.dom._ClassHelper", []]);
      el = element({
          "className": 'class1 class2 class4'
      })();
    });

    act(function act() {
        classHelper.remove(el, 'class2');
        classHelper.remove(el, 'class1');
        classHelper.remove(el, 'class5');
    });

    assert(function assert(test) {
        test('The className should be "class4"').value(el, 'className').equals('class4');
    });
}
/**[@test({ "title": "TruJS.dom.ClassHelper: test for class names" })]*/
function testClassHelper5(arrange, act, assert, element, module) {
    var el, classHelper, has1, has2, has3, has4;

    arrange(function arrange() {
      classHelper = module(["TruJS.dom._ClassHelper", []]);
      el = element({
          "className": 'class1 class2 class4'
      })();
    });

    act(function act() {
      has1 = classHelper.has(el, 'class1');
      has2 = classHelper.has(el, 'class2');
      has3 = classHelper.has(el, 'class3');
      has4 = classHelper.has(el, 'class4');
    });

    assert(function assert(test) {
      test('The el should have a class1').value(has1).isTrue();
      test('The el should have a class2').value(has2).isTrue();
      test('The el should not have a class3').value(has3).isFalse();
      test('The el should have a class4').value(has4).isTrue();
    });
}
