/*
  QUnit Tests
  ----
  - monitors multiple stickybits

*/

QUnit.module('update', (hooks) => {

  // default StickyBits test
  // ensures StickyBits is working
  QUnit.test('Test multiple stickybits', function (assert) {
    generateTestContent('1');
    const main = document.querySelector('main');

    var stickies = stickybits('.child', { useStickyClasses: true });
    var stickyItems = document.querySelectorAll('[style*="position"]');
    var instance = stickies.instances[0];
    var stickyStart = instance.stickyStart
    assert.equal(stickyItems.length, 1, 'There are 3 sticky items');
    assert.equal(stickyStart, 400, 'The stickyStart is 400');
    main.style.top = 500;
    stickies.update();
    assert.equal(stickyStart, 400, 'The stickyStart is 500');
  });
})
