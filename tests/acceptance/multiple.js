/*
  QUnit Tests
  ----
  -  tests multiples
*/

QUnit.module('multiple', (hooks) => {

  // ensure QUnit is working
  QUnit.test('hello test', (assert) => {
    assert.ok(1 == '1', 'Passed!');
  });

  // default StickyBits test
  // ensures StickyBits is working 
  QUnit.test('Test multiple stickbits', (assert) => {
    ['1', '2', '3'].forEach((num) => generateTestContent(num));

    var stickies = stickybits('.child');
    var stickyItems = document.querySelectorAll('[style*="position"]');
    assert.equal(stickyItems.length, 3, 'There are 3 stick items');
  });
});
