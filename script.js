(function () {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const currentPage = document.body.dataset.page || "home";
  const bagCount = document.querySelector("[data-bag-count]");
  let cartCount = Number(localStorage.getItem("skaraCartCount") || "0");

  function setActiveNav() {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === currentPage) {
        link.classList.add("is-active");
      }
    });
  }

  function setupMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(document.body.classList.contains("nav-open")));
    });
  }

  function updateBag() {
    if (bagCount) bagCount.textContent = String(cartCount);
  }

  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function productCard(product) {
    return `
      <article class="product-card" data-reveal data-category="${product.category}" data-audience="${product.audience}" data-brand="${product.brand}" data-price="${product.price}">
        <div class="product-media">
          <span class="product-badge">${product.badge}</span>
          <img src="${product.image}" alt="${product.brand} ${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-meta"><span>${product.brand}</span><span>${product.category}</span></div>
          <h3>${product.name}</h3>
          <div class="price-row">
            <span class="price">${money.format(product.price)}</span>
            <button class="add-to-cart-btn button" type="button" aria-label="Add ${product.name} to bag" data-add="${product.name}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    document.querySelectorAll("[data-products]").forEach((container) => {
      const audience = container.dataset.products;
      const limit = Number(container.dataset.limit || "0");
      let products = audience === "all" ? SKARA_PRODUCTS : SKARA_PRODUCTS.filter((item) => item.audience === audience);
      if (limit) products = products.slice(0, limit);
      container.innerHTML = products.map(productCard).join("");
    });
  }

  function renderBrands() {
    document.querySelectorAll("[data-brand-marquee]").forEach((container) => {
      const brands = [...SKARA_BRANDS, ...SKARA_BRANDS];
      container.innerHTML = brands.map((brand) => `<span class="brand-chip">${brand}</span>`).join("");
    });
  }

  function setupHero() {
    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    if (slides.length < 2) return;
    let index = 0;
    window.setInterval(() => {
      slides[index].classList.remove("is-active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("is-active");
    }, 5200);
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealItems.forEach((item) => observer.observe(item));
  }

  function setupRailControls() {
    document.querySelectorAll("[data-rail-control]").forEach((button) => {
      button.addEventListener("click", () => {
        const rail = document.querySelector(button.dataset.railControl);
        if (!rail) return;
        const direction = button.dataset.direction === "prev" ? -1 : 1;
        rail.scrollBy({ left: direction * 380, behavior: "smooth" });
      });
    });
  }

  function setupFilters() {
    const grid = document.querySelector("[data-shop-grid]");
    if (!grid) return;
    const category = document.querySelector("[data-filter-category]");
    const audience = document.querySelector("[data-filter-audience]");
    const sort = document.querySelector("[data-filter-sort]");
    const search = document.querySelector("[data-filter-search]");
    const total = document.querySelector("[data-result-count]");

    function applyFilters() {
      const categoryValue = category.value;
      const audienceValue = audience.value;
      const query = search.value.trim().toLowerCase();
      let products = SKARA_PRODUCTS.filter((product) => {
        const inCategory = categoryValue === "all" || product.category === categoryValue;
        const inAudience = audienceValue === "all" || product.audience === audienceValue;
        const inSearch = !query || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query);
        return inCategory && inAudience && inSearch;
      });

      if (sort.value === "high") products = products.sort((a, b) => b.price - a.price);
      if (sort.value === "low") products = products.sort((a, b) => a.price - b.price);
      if (sort.value === "brand") products = products.sort((a, b) => a.brand.localeCompare(b.brand));

      grid.innerHTML = products.map(productCard).join("");
      if (total) total.textContent = `${products.length} pieces`;
      setupReveal();
    }

    [category, audience, sort].forEach((control) => control.addEventListener("change", applyFilters));
    search.addEventListener("input", applyFilters);
    applyFilters();
  }

  function setupFilterToggle() {
    const toggle = document.querySelector("[data-filter-toggle]");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("filters-open");
      toggle.setAttribute("aria-expanded", String(document.body.classList.contains("filters-open")));
    });
  }

  function setupTilt() {
    document.addEventListener("pointermove", (event) => {
      const card = event.target.closest(".product-card");
      if (!card || window.matchMedia("(max-width: 920px)").matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    });
    document.addEventListener("pointerleave", (event) => {
      const card = event.target.closest(".product-card");
      if (card) card.style.transform = "";
    }, true);
  }

  function setupCart() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add]");
      if (!button) return;
      cartCount += 1;
      localStorage.setItem("skaraCartCount", String(cartCount));
      updateBag();
      showToast(`${button.dataset.add} added to your cart.`);
    });
  }

  function setupForms() {
    document.querySelectorAll("[data-concierge-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        showToast("Concierge request received. A style director will contact you shortly.");
        form.reset();
      });
    });
  }

  function setupCustomCursor() {
    if (window.matchMedia("(max-width: 920px)").matches) return; // Disable on mobile
    
    const cursor = document.createElement("div");
    cursor.className = "luxury-cursor";
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });

    // Update hoverables on body so it works for dynamic content
    document.body.addEventListener("mouseover", (e) => {
      const hoverable = e.target.closest("a, button, input, .product-card, .category-tile");
      if (hoverable) cursor.classList.add("is-hovering");
    });
    document.body.addEventListener("mouseout", (e) => {
      const hoverable = e.target.closest("a, button, input, .product-card, .category-tile");
      if (hoverable) cursor.classList.remove("is-hovering");
    });
  }

  function setupLiveChat() {
    const chatContainer = document.createElement("div");
    chatContainer.className = "live-chat-widget";
    chatContainer.innerHTML = `
      <button class="chat-toggle" aria-label="Open Concierge Chat">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
      <div class="chat-window">
        <div class="chat-header">
          <strong>Private Concierge</strong>
          <button class="chat-close" aria-label="Close Chat">×</button>
        </div>
        <div class="chat-body">
          <div class="chat-message agent">Welcome to SKARA. How may I assist you today?</div>
        </div>
        <div class="chat-footer">
          <input type="text" placeholder="Type a message..." aria-label="Chat input">
          <button type="button">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(chatContainer);

    const toggle = chatContainer.querySelector(".chat-toggle");
    const close = chatContainer.querySelector(".chat-close");
    const windowEl = chatContainer.querySelector(".chat-window");

    toggle.addEventListener("click", () => windowEl.classList.add("is-open"));
    close.addEventListener("click", () => windowEl.classList.remove("is-open"));
  }

  function setupHeaderActions() {
    const searchBtns = document.querySelectorAll(".icon-button[aria-label='Search']");
    searchBtns.forEach(btn => {
      btn.addEventListener("click", () => showToast("Search functionality will be available in the full version."));
    });
    
    const bagBtns = document.querySelectorAll(".bag-button");
    bagBtns.forEach(btn => {
      btn.addEventListener("click", () => showToast(cartCount > 0 ? `You have ${cartCount} item(s) in your bag.` : "Your bag is currently empty."));
    });
  }

  setActiveNav();
  setupMenu();
  updateBag();
  renderBrands();
  renderProducts();
  setupHero();
  setupRailControls();
  setupFilters();
  setupFilterToggle();
  setupTilt();
  setupCart();
  setupForms();
  setupReveal();
  setupCustomCursor();
  setupLiveChat();
  setupHeaderActions();
})();
