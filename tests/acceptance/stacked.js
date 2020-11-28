/*
  QUnit Tests
  ----
  - monitors multiple stickybits
  - TODO: test stacked feature (currently duplicate of "multiple sticky classes" test)

*/

QUnit.module('stacked', (hooks) => {

  // default StickyBits test
  // ensures StickyBits is working 
  QUnit.test('Test multiple stickybits', function(assert) {
    ['1', '2', '3'].forEach((num) => generateTestContent(num));

    var stickies = stickybits('.child', {useStickyClasses: true});
    var stickyItems = document.querySelectorAll('[style*="position"]');
    assert.equal(stickyItems.length, 3, 'There are 3 sticky items');
  });
})
