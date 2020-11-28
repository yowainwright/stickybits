/*
  QUnit Tests
  ----
  - monitors multiple stickybits

*/

QUnit.module('multiple sticky classes', (hooks) => {

  hooks.beforeEach(() => {
    generateStyle(`
    .parent-1 {
      margin-top: 100px;
    }
    .parent-3 {
      margin-top: 300px;
    }`);
  });

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
