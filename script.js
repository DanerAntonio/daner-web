(() => {
  const config = window.BUSINESS_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { if ($(id) && value) $(id).textContent = value; };
  const phone = String(config.whatsapp || "").replace(/\D/g, "");
  const whatsappUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent("Hola, quisiera información sobre el menú.")}` : "#";

  document.title = `${config.name || "Mi Restaurante"} | Menú y pedidos`;
  document.documentElement.style.setProperty("--primary", config.primaryColor || "#173b2a");
  document.documentElement.style.setProperty("--accent", config.accentColor || "#e9a23b");
  setText("business-name", config.name);
  setText("footer-name", config.name);
  setText("footer-name-small", config.name);
  setText("brand-mark", config.logoEmoji);
  setText("footer-mark", config.logoEmoji);
  setText("hero-eyebrow", config.heroEyebrow);
  setText("hero-title", config.heroTitle);
  setText("hero-copy", config.heroDescription);
  setText("about-title", config.aboutTitle);
  setText("about-copy", config.aboutDescription);
  setText("business-address", config.address);
  setText("business-hours", config.hours);
  setText("business-phone", config.phoneDisplay);
  setText("footer-tagline", config.tagline);
  setText("year", new Date().getFullYear());

  if (config.heroImage) $("inicio").style.backgroundImage = `url("${config.heroImage}")`;
  if (config.aboutImage) $("intro-photo").style.backgroundImage = `url("${config.aboutImage}")`;

  ["nav-whatsapp", "hero-whatsapp", "banner-whatsapp", "contact-whatsapp"].forEach(id => {
    if ($(id)) $(id).href = whatsappUrl;
  });

  const menuGrid = $("menu-grid");
  (config.menu || []).forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    const image = document.createElement("img");
    image.src = item.image || config.aboutImage || "";
    image.alt = item.name || "Plato del menú";
    image.loading = "lazy";
    const body = document.createElement("div");
    body.className = "menu-card-body";
    const title = document.createElement("h3");
    title.textContent = item.name || "Plato";
    const description = document.createElement("p");
    description.textContent = item.description || "";
    const bottom = document.createElement("div");
    bottom.className = "menu-card-bottom";
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = item.price || "Consultar";
    const link = document.createElement("a");
    link.className = "order-link";
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Pedir ↗";
    bottom.append(price, link);
    body.append(title, description, bottom);
    card.append(image, body);
    menuGrid.append(card);
  });

  const toggle = $("menu-toggle");
  const nav = $("nav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
})();
