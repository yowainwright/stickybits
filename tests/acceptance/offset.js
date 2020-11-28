/*
  QUnit Tests
  ----
  - tests the `offset`

*/

QUnit.module('offset', (hooks) => {

  // tests StickyBits test
  // ensures StickyBits offset is working 
  QUnit.test('different stickyOffset test', function(assert) {
    generateTestContent(1)
    var selector = document.querySelector('.child-1')
    stickybits('.child-1', {stickyBitStickyOffset: 10})
    assert.equal(selector.style.top, '10px', 'top should be set to 10px')
  })
})
