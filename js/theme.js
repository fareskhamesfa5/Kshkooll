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

  // Pages without a header still get a compact route back to the student area.
  if (!document.body.classList.contains("landing") &&
      !document.querySelector("a.kshkooll-brand")) {
    const main = document.querySelector("main");
    if (main) {
      const brand = document.createElement("a");
      brand.href = new URL("../pages/dashboard.html", scriptUrl).href;
      brand.className = "kshkooll-brand page-brand";
      const img = document.createElement("img");
      img.src = logoUrl;
      img.alt = "Kshkooll";
      img.className = "brand-logo-mark";
      const name = document.createElement("span");
      name.className = "brand-name";
      name.textContent = "Kshkooll";
      brand.append(img, name);
      main.prepend(brand);
    }
  }

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

  // Shared student sidebar on learning pages (authentication screens stay focused).
  const pagePath = window.location.pathname;
  if (!/\/auth\//.test(pagePath) && !document.body.classList.contains("landing")) {
    const rootUrl = new URL("../", scriptUrl);
    const routes = [
      { label: "الرئيسية", href: "pages/dashboard.html", icon: "⌂", match: "/pages/dashboard.html" },
      { label: "اللغة العربية", href: "subjects/arabic/index.html", icon: "ع", match: "/subjects/arabic/" },
      { label: "اللغة الإنجليزية", href: "subjects/english/index.html", icon: "EN", match: "/subjects/english/" },
      { label: "التاريخ", href: "subjects/history/index.html", icon: "ت", match: "/subjects/history/" },
      { label: "البرمجة", href: "subjects/programming/index.html", icon: "</>", match: "/subjects/programming/" },
      { label: "الامتحانات", href: "pages/exams.html", icon: "▤", match: "/pages/exams.html" },
      { label: "التقدم الدراسي", href: "pages/progress.html", icon: "↗", match: "/pages/progress.html" },
      { label: "الملف الشخصي", href: "pages/profile.html", icon: "◎", match: "/pages/profile.html" },
      { label: "الإعدادات", href: "pages/settings.html", icon: "⚙", match: "/pages/settings.html" }
    ];
    const sidebar = document.createElement("aside");
    sidebar.className = "student-sidebar";
    sidebar.id = "studentSidebar";
    sidebar.setAttribute("aria-label", "القائمة الجانبية");
    sidebar.innerHTML = `
      <div class="sidebar-head">
        <a class="sidebar-brand" href="${new URL("pages/dashboard.html", rootUrl).href}">
          <img src="${logoUrl}" alt="" /> <span>Kshkooll</span>
        </a>
        <button class="sidebar-close" type="button" aria-label="إغلاق القائمة">×</button>
      </div>
      <p class="sidebar-caption">مساحة التعلم</p>
      <nav class="sidebar-nav"></nav>
      <div class="sidebar-bottom"><span class="sidebar-dot"></span> YOUR LEARNING SPACE</div>
    `;
    const nav = sidebar.querySelector(".sidebar-nav");
    routes.forEach((item) => {
      const link = document.createElement("a");
      link.className = "sidebar-link";
      link.href = new URL(item.href, rootUrl).href;
      link.innerHTML = `<span class="sidebar-link-icon" aria-hidden="true">${item.icon}</span><span>${item.label}</span>`;
      if (pagePath.includes(item.match)) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
      nav.appendChild(link);
    });
    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.hidden = true;
    const menuButton = document.createElement("button");
    menuButton.className = "sidebar-menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "فتح القائمة الجانبية");
    menuButton.setAttribute("aria-controls", "studentSidebar");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
    document.body.append(sidebar, backdrop, menuButton);
    const closeButton = sidebar.querySelector(".sidebar-close");
    function closeSidebar() {
      document.body.classList.remove("sidebar-open");
      backdrop.hidden = true;
      menuButton.setAttribute("aria-expanded", "false");
    }
    function openSidebar() {
      document.body.classList.add("sidebar-open");
      backdrop.hidden = false;
      menuButton.setAttribute("aria-expanded", "true");
    }
    menuButton.addEventListener("click", () => {
      document.body.classList.contains("sidebar-open") ? closeSidebar() : openSidebar();
    });
    closeButton.addEventListener("click", closeSidebar);
    backdrop.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSidebar();
    });
  }

})();