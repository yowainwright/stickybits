/*
  QUnit Tests
  ----
  -  tests multiples
*/

QUnit.module('multiple', (hooks) => {

  // default StickyBits test
  // ensures StickyBits is working 
  QUnit.test('Test multiple stickbits', (assert) => {
    ['1', '2', '3'].forEach((num) => generateTestContent(num));

    var stickies = stickybits('.child');
    var stickyItems = document.querySelectorAll('[style*="position"]');
    assert.equal(stickyItems.length, 3, 'There are 3 stick items');
  });
});
