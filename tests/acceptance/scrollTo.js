/*
  QUnit Tests
  ----
  - monitors multiple stickybits
  - TODO: test scrollTo feature (currently duplicate of "multiple sticky classes" test)

*/

QUnit.module('scrollTo', (hooks) => {

  // ensure QUnit is working
  QUnit.test('hello test', function(assert) {
    assert.ok(1 == '1', 'Passed!');
  });

  // default StickyBits test
  // ensures StickyBits is working 
  QUnit.test('Test multiple stickbits', function(assert) {
    ['1', '2', '3'].forEach((num) => generateTestContent(num));

    var stickies = stickybits('.child', {useStickyClasses: true});
    var stickyItems = document.querySelectorAll('[style*="position"]');
    assert.equal(stickyItems.length, 3, 'There are 3 sticky items');
  });
})
