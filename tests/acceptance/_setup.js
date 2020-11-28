function generateTestContent (num) {
  const fixture = document.getElementById('qunit-fixture');
  const content = '<div id="parent-'+ num +'" class="parent parent-'+ num +'"><div id="child-'+ num +'" class="child child-'+ num +'"><p>Child '+ num +'</p></div>';

  if (fixture.querySelector('main')) {
    // test with multiple
    const main = fixture.querySelector('main');
    main.insertAdjacentHTML('beforeend', content);
  } else {
    // first or only one
    const main = document.createElement('main');
    main.innerHTML = content;
    fixture.appendChild(main);
  }
}

function generateStyle(css) {
  const fixture = document.getElementById('qunit-fixture');
  const style = document.createElement('style');
  style.textContent = css;
  fixture.appendChild(style);
}

function pause (delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

QUnit.config.reorder = false;

QUnit.config.urlConfig.push({
  id: "hidefixture",
  label: "Hide fixture afterward",
  tooltip: "By default the last test content remains visible, which can overlap an error message."
});

QUnit.on('runEnd', () => {
  const main = document.querySelector('#qunit-fixture main');
  if (main && QUnit.config.hidefixture) {
    main.style.display = 'none';
  }
});
