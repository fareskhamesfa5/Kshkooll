// مظهر موحد لكل صفحات Koshkool: يحفظ اختيار الطالب على نفس المتصفح.
(() => {
  const KEY = 'koshkool_theme';
  const saved = localStorage.getItem(KEY) || 'light';
  document.body.classList.toggle('dark', saved === 'dark');

  function updateButton(button) {
    const dark = document.body.classList.contains('dark');
    button.textContent = dark ? '☀️' : '🌙';
    button.setAttribute('aria-label', dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
    button.title = dark ? 'الوضع الفاتح' : 'الوضع الداكن';
  }

  let button = document.querySelector('.theme-toggle');
  if (!button) {
    const nav = document.querySelector('.site-header nav');
    const header = document.querySelector('.site-header');
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.id = 'themeToggle';
    if (nav) nav.appendChild(button);
    else if (header) header.appendChild(button);
    else {
      button.style.position = 'fixed';
      button.style.top = '18px';
      button.style.left = '18px';
      button.style.zIndex = '99';
      document.body.appendChild(button);
    }
  }
  updateButton(button);
  button.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem(KEY, document.body.classList.contains('dark') ? 'dark' : 'light');
    updateButton(button);
  });
})();
