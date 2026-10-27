/* Content is rendered at build time; this file only enhances navigation and filters. */
(() => {
  const list = document.querySelector('#delivery-list');
  if (!list) return;
  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const rows = [...list.children].map((li) => ({
    li,
    areas: li.dataset.areas.split(' '),
    text: normalize(li.textContent),
  }));
  const search = document.querySelector('#busca');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  let selected = 'todas';
  function filter() {
    const query = normalize(search.value.trim());
    let count = 0;
    for (const row of rows) {
      row.li.hidden = !(
        (selected === 'todas' || row.areas.includes(selected)) &&
        row.text.includes(query)
      );
      if (!row.li.hidden) count++;
    }
    buttons.forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.filter === selected)),
    );
    document.querySelector('#catalog-status').textContent =
      `${count} de ${rows.length} grupos de contribuições`;
    document.querySelector('#empty-state').hidden = count !== 0;
  }
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      selected = button.dataset.filter;
      filter();
    }),
  );
  search.addEventListener('input', filter);
  document.querySelector('#clear-filters').addEventListener('click', () => {
    search.value = '';
    selected = 'todas';
    filter();
    search.focus();
  });
  document.querySelector('.catalog-controls').hidden = false;
  filter();
})();
