/*
  QUnit Tests
  ----
  - monitors `useStickyClasses` 

*/

QUnit.module('monitoring', (hooks) => {

  QUnit.test('useStickyClasses is true', async (assert) => {
    generateTestContent(1);
    const selector = document.querySelector('.child-1');
    stickybits(selector, {useStickyClasses: true});

    $('html, body').animate({scrollTop: '+=500px'}, 300);
    await pause(300);
    assert.true(selector.classList.contains('js-is-sticky'), 'adds `js-is-sticky`');

    $('html, body').animate({scrollTop: '0px'}, 0);
    await pause(100);
    assert.false(selector.classList.contains('js-is-sticky'), 'removes `js-is-sticky`');

    $('html, body').animate({scrollTop: '+=1000px'}, 300);
    await pause(300);
    assert.true(selector.classList.contains('js-is-stuck'), 'adds `js-is-stuck`');

    $('html, body').animate({scrollTop: '0px'}, 0);
  });
});
