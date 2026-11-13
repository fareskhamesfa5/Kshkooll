// Shared theme and Kshkooll brand initializer.
(() => {
  const KEY = "koshkool_theme";
  const scriptUrl = document.currentScript.src;
  const iconsBase = new URL("../assets/icons/", scriptUrl);
  const logoUrl = new URL("../assets/images/logo.svg", scriptUrl).href;
  const icons = {
    light: new URL("moon.svg", iconsBase).href,
    dark: new URL("sun.svg", iconsBase).href
  };

  const saved = localStorage.getItem(KEY) || "light";
  document.body.classList.toggle("dark", saved === "dark");

  // Apply one consistent logo and brand name throughout the site.
  document.querySelectorAll("img").forEach((img) => {
    if (img.classList.contains("landing-logo") || /logo/i.test(img.alt || "") || /Koshkool|Kshkooll/i.test(img.alt || "")) {
      img.src = logoUrl;
      img.alt = "Kshkooll";
    }
  });

  document.querySelectorAll("a").forEach((link) => {
    const label = (link.textContent || "").trim();
    const isBrand = link.classList.contains("brand") ||
      link.classList.contains("site-brand") ||
      /^(Koshkool|Kshkooll)\.?$/i.test(label);
    if (!isBrand) return;
    link.classList.add("kshkooll-brand");
    link.setAttribute("aria-label", "Kshkooll");
    if (!link.querySelector("img")) {
      const img = document.createElement("img");
      img.src = logoUrl;
      img.alt = "Kshkooll";
      img.className = "brand-logo-mark";
      link.prepend(img);
    } else {
      const img = link.querySelector("img");
      img.src = logoUrl;
      img.alt = "Kshkooll";
      img.classList.add("brand-logo-mark");
    }
    link.querySelectorAll("strong").forEach((node) => { node.textContent = "Kshkooll"; });
    link.querySelectorAll("small").forEach((node) => {
      node.textContent = "YOUR LEARNING SPACE";
    });
    Array.from(link.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && /Koshkool|Kshkooll/i.test(node.textContent)) node.textContent = "";
    });
    if (!link.querySelector("strong") && !link.querySelector("span")) {
      const name = document.createElement("span");
      name.className = "brand-name";
      name.textContent = "Kshkooll";
      link.append(name);
    }
  });

  // Replace legacy brand spelling in page titles and visible text only.
  document.title = document.title.replace(/Koshkool/gi, "Kshkooll");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    if (/Koshkool/i.test(node.nodeValue)) node.nodeValue = node.nodeValue.replace(/Koshkool/gi, "Kshkooll");
  });

  let button = document.querySelector(".theme-toggle");
  if (!button) {
    const nav = document.querySelector(".site-header nav");
    const header = document.querySelector(".site-header, .topbar");
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
    if (animate) icon.addEventListener("animationend", () => icon.classList.remove("is-animating"), { once: true });
  }
  renderTheme();
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(KEY, document.body.classList.contains("dark") ? "dark" : "light");
    renderTheme(true);
  });
})();