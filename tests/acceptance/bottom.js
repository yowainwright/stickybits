/*
  QUnit Tests
  ----
  -  Acceptance test oriented

*/

QUnit.module('bottom', (hooks) => {

  QUnit.test('stickbits adds `js-is-stuck`', async (assert) => {
    generateTestContent(1);

    // tests StickyBits test
    // ensures StickyBits offset is working
    var selector = document.querySelector('.child-1');
    stickybits(selector, {useStickyClasses: true});

    $('html, body').animate({scrollTop: '+=1000px'}, 300);
    await pause(300);

    assert.equal(selector.classList.contains('js-is-stuck'), true, 'The stickybit should have a stucky class');

    $('html, body').animate({scrollTop: '0px'}, 0);
  });
});
