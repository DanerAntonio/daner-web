
(() => {
  const config = window.BUSINESS_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => {
    const element = $(id);
    if (element && value) element.textContent = value;
  };

  const money = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(value);

  const phone = String(config.whatsapp || "").replace(/\D/g, "");
  const menu = Array.isArray(config.menu) ? config.menu : [];
  const cart = new Map();

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

  const hero = $("inicio");
  if (hero && config.heroImage) {
    hero.style.backgroundImage = `url("${config.heroImage}")`;
  }

  const aboutPhoto = $("intro-photo");
  if (aboutPhoto && config.aboutImage) {
    aboutPhoto.style.backgroundImage = `url("${config.aboutImage}")`;
  }

  const generalMessage = `Hola, quiero hacer un pedido en ${config.name || "el restaurante"}.`;
  const generalWhatsAppUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(generalMessage)}`
    : "#";

  ["nav-whatsapp", "hero-whatsapp", "banner-whatsapp", "contact-whatsapp"].forEach((id) => {
    const link = $(id);
    if (link) {
      link.href = generalWhatsAppUrl;
      link.target = "_blank";
      link.rel = "noopener";
    }
  });

  // Estilos del catálogo y del carrito
  const styles = document.createElement("style");
  styles.textContent = `
    .menu-card img {
      width: 100%;
      height: 220px;
      object-fit: cover;
    }
    .order-link, .add-to-cart, .cart-action, .send-order {
      display: inline-block;
      border: 0;
      border-radius: 9px;
      padding: 11px 15px;
      background: var(--primary, #173b2a);
      color: white;
      font: inherit;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
    }
    .menu-card-bottom {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .price { font-weight: 800; }
    .add-to-cart { width: 100%; margin-top: 12px; }
    #order-cart {
      margin: 35px auto;
      padding: 22px;
      border: 1px solid #ddd;
      border-radius: 16px;
      max-width: 900px;
      background: #fff;
      color: #222;
    }
    #order-cart h2 { margin-top: 0; }
    .cart-line {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .cart-line img {
      width: 76px;
      height: 76px;
      object-fit: cover;
      border-radius: 10px;
    }
    .cart-line-title { font-weight: 800; }
    .cart-line-controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }
    .cart-action {
      padding: 5px 12px;
      min-width: 36px;
    }
    .remove-item {
      background: #8b2525;
    }
    #order-comments {
      display: block;
      box-sizing: border-box;
      width: 100%;
      min-height: 90px;
      margin: 12px 0;
      padding: 12px;
      border: 1px solid #bbb;
      border-radius: 9px;
      font: inherit;
    }
    .cart-total {
      margin: 20px 0;
      font-size: 1.35rem;
      font-weight: 800;
    }
    .cart-empty { color: #555; }
    .send-order { width: 100%; padding: 14px; }
    .cart-note { font-size: .9rem; color: #555; }
    @media (max-width: 480px) {
      #order-cart { padding: 15px; }
      .menu-card img { height: 190px; }
    }
  `;
  document.head.appendChild(styles);

  const menuGrid = $("menu-grid");
  if (!menuGrid) {
    console.error("No se encontró el elemento menu-grid en index.html.");
    return;
  }

  // Crear la sección del carrito debajo del catálogo
  const cartSection = document.createElement("section");
  cartSection.id = "order-cart";
  cartSection.innerHTML = `
    <h2>Tu pedido</h2>
    <p class="cart-note">Agrega los platos que quieras, ajusta las cantidades y revisa el total.</p>
    <div id="cart-items" aria-live="polite"></div>
    <p id="cart-empty" class="cart-empty">Todavía no has agregado platos.</p>
    <label for="order-comments"><strong>Comentarios del pedido</strong></label>
    <textarea id="order-comments" placeholder="Ej.: sin ensalada, indicaciones de entrega o alguna solicitud especial."></textarea>
    <div class="cart-total">Total: <span id="cart-total-value">$0</span></div>
    <button type="button" class="send-order" id="send-order">Enviar pedido por WhatsApp</button>
    <p class="cart-note">El pedido se enviará a WhatsApp para que puedas revisarlo antes de enviarlo.</p>
  `;
  menuGrid.insertAdjacentElement("afterend", cartSection);

  // Mostrar platos y precios
  menu.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "menu-card";

    const image = document.createElement("img");
    image.src = item.image || config.aboutImage || "";
    image.alt = item.name || "Plato del menú";
    image.loading = "lazy";
    image.onerror = () => {
      image.alt = `Fotografía no disponible: ${item.name || "plato"}`;
    };

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
    price.textContent = money(Number(item.priceValue) || 0);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-to-cart";
    addButton.textContent = "Agregar al pedido";
    addButton.addEventListener("click", () => {
      const current = cart.get(index) || 0;
      cart.set(index, current + 1);
      renderCart();
      cartSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    bottom.append(price);
    body.append(title, description, bottom, addButton);
    card.append(image, body);
    menuGrid.append(card);
  });

  function renderCart() {
    const container = $("cart-items");
    const emptyMessage = $("cart-empty");
    const totalElement = $("cart-total-value");
    container.replaceChildren();

    let total = 0;

    cart.forEach((quantity, index) => {
      const item = menu[index];
      if (!item || quantity <= 0) return;

      const price = Number(item.priceValue) || 0;
      const subtotal = price * quantity;
      total += subtotal;

      const line = document.createElement("div");
      line.className = "cart-line";

      const image = document.createElement("img");
      image.src = item.image || config.aboutImage || "";
      image.alt = item.name || "Plato";
      image.loading = "lazy";

      const details = document.createElement("div");
      const title = document.createElement("div");
      title.className = "cart-line-title";
      title.textContent = item.name;

      const subtotalText = document.createElement("div");
      subtotalText.textContent = `${quantity} × ${money(price)} = ${money(subtotal)}`;

      const controls = document.createElement("div");
      controls.className = "cart-line-controls";

      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.className = "cart-action";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Quitar una unidad de ${item.name}`);
      decrease.addEventListener("click", () => {
        const next = (cart.get(index) || 0) - 1;
        if (next <= 0) cart.delete(index);
        else cart.set(index, next);
        renderCart();
      });

      const quantityText = document.createElement("span");
      quantityText.textContent = `Cantidad: ${quantity}`;

      const increase = document.createElement("button");
      increase.type = "button";
      increase.className = "cart-action";
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Agregar una unidad de ${item.name}`);
      increase.addEventListener("click", () => {
        cart.set(index, (cart.get(index) || 0) + 1);
        renderCart();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cart-action remove-item";
      remove.textContent = "Eliminar";
      remove.addEventListener("click", () => {
        cart.delete(index);
        renderCart();
      });

      controls.append(decrease, quantityText, increase, remove);
      details.append(title, subtotalText, controls);
      line.append(image, details);
      container.append(line);
    });

    emptyMessage.hidden = cart.size > 0;
    totalElement.textContent = money(total);
  }

  $("send-order").addEventListener("click", () => {
    if (!phone) {
      alert("Falta configurar el número de WhatsApp del restaurante.");
      return;
    }

    if (cart.size === 0) {
      alert("Primero agrega al menos un plato a tu pedido.");
      return;
    }

    let total = 0;
    const lines = [
      `¡Hola! Quiero hacer un pedido en ${config.name || "el restaurante"}.`,
      "",
      "MI PEDIDO:"
    ];

    cart.forEach((quantity, index) => {
      const item = menu[index];
      if (!item) return;

      const price = Number(item.priceValue) || 0;
      const subtotal = price * quantity;
      total += subtotal;

      lines.push(
        "",
        `${quantity} x ${item.name}`,
        `Precio unitario: ${money(price)}`,
        `Subtotal: ${money(subtotal)}`
      );

      if (item.image) {
        const imageUrl = new URL(item.image, window.location.href).href;
        lines.push(`Foto del plato: ${imageUrl}`);
      }
    });

    lines.push("", `TOTAL DE LOS PLATOS: ${money(total)}`);

    const comments = $("order-comments").value.trim();
    lines.push("", `Comentarios: ${comments || "Sin comentarios adicionales."}`);

    lines.push("", "Por favor, confirmen mi pedido. ¡Muchas gracias!");

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });

  // Menú de navegación para móviles
  const toggle = $("menu-toggle");
  const nav = $("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  renderCart();
})();