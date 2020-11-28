/*
  QUnit Tests
  ----
  - monitors useFixed

*/

QUnit.module('useFixed', (hooks) => {

  // default StickyBits test
  // ensures StickyBits is working
  QUnit.test('Test update', async (assert) => {
    generateTestContent('1');

    var stickies = stickybits('.child', { useFixed: true });

    $('html, body').animate({scrollTop: '+=500px'}, 300);
    await pause(300);

    var stickyItems = document.querySelectorAll('[style*="position"]');
    var instance = stickies.instances[0];
    var stickyStart = instance.stickyStart
    assert.equal(stickyItems.length, 1, 'There is 1 sticky item');
    assert.equal(stickyItems[0].style.position, 'fixed', 'The stickybit position is fixed');
    assert.equal(stickyStart, 400, 'stickyStart found');
  });
})
