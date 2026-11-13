// Unified theme switch for every Koshkool page.
(() => {
  const KEY = "koshkool_theme";
  const iconBase = new URL("../assets/icons/", document.currentScript.src);
  const icons = {
    light: new URL("moon.svg", iconBase).href,
    dark: new URL("sun.svg", iconBase).href
  };

  const saved = localStorage.getItem(KEY) || "light";
  document.body.classList.toggle("dark", saved === "dark");

  let button = document.querySelector(".theme-toggle");
  if (!button) {
    const nav = document.querySelector(".site-header nav");
    const header = document.querySelector(".site-header");
    button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.id = "themeToggle";
    if (nav) nav.appendChild(button);
    else if (header) header.appendChild(button);
    else {
      Object.assign(button.style, { position: "fixed", top: "18px", left: "18px", zIndex: "99" });
      document.body.appendChild(button);
    }
  }

  const icon = document.createElement("img");
  icon.className = "theme-toggle-icon";
  icon.alt = "";
  icon.draggable = false;
  button.replaceChildren(icon);

  function renderTheme(animate = false) {
    const dark = document.body.classList.contains("dark");
    button.setAttribute("aria-label", dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن");
    button.title = dark ? "الوضع الفاتح" : "الوضع الداكن";
    icon.classList.toggle("is-animating", animate);
    icon.src = dark ? icons.dark : icons.light;
    if (animate) {
      icon.addEventListener("animationend", () => icon.classList.remove("is-animating"), { once: true });
    }
  }

  renderTheme();
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(KEY, document.body.classList.contains("dark") ? "dark" : "light");
    renderTheme(true);
  });
})();