/*
  QUnit Tests
  ----
  -  Acceptance test oriented

*/

QUnit.module('cleanup', (hooks) => {

  // tests StickyBits test
  // ensures StickyBits offset is working 

  QUnit.test('Checks cleanup method', (assert) => {
    generateTestContent(1)
    const selector = document.querySelector('.child-1');
    var stickybit = stickybits('.child-1', {useStickyClasses: true});
    stickybit.cleanup();
    assert.equal(selector.parentNode.classList.contains('js-stickybit-parent'), false, 'This should work like fixed');
    stickybit = stickybits('.child-1', {useStickyClasses: true});
  });
});
