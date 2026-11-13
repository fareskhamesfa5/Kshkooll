(() => {
  const button = document.getElementById("settingsThemeButton");
  const status = document.getElementById("themeStatus");
  if (!button) return;

  function syncThemeLabel() {
    const dark = document.body.classList.contains("dark");
    button.textContent = dark ? "تفعيل الفاتح" : "تفعيل الداكن";
    button.setAttribute("aria-pressed", String(dark));
    status.textContent = dark ? "المظهر الحالي: داكن" : "المظهر الحالي: فاتح";
  }

  syncThemeLabel();
  button.addEventListener("click", () => {
    const globalToggle = document.querySelector(".theme-toggle");
    if (globalToggle) globalToggle.click();
    else {
      const dark = !document.body.classList.contains("dark");
      document.body.classList.toggle("dark", dark);
      localStorage.setItem("koshkool_theme", dark ? "dark" : "light");
    }
    syncThemeLabel();
  });
})();
