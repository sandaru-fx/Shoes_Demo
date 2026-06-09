(function () {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const currentPage = document.body.dataset.page || "home";
  const bagCount = document.querySelector("[data-bag-count]");
  const CART_KEY = "skaraCart";
  const CHAT_REPLIES = [
    "Thank you for reaching out. How may I assist with your footwear selection today?",
    "Our concierge can help with private fittings, rare sourcing, and size guidance.",
    "A style director will follow up shortly. Is there a particular pair you are looking for?"
  ];

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (Array.isArray(saved)) return saved;
    } catch (error) {
      return [];
    }
    return [];
  }

  let cart = loadCart();
  let cartDrawer = null;
  let chatReplyIndex = 0;

  function setActiveNav() {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === currentPage) {
        link.classList.add("is-active");
      }
    });
  }

  function closeMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!toggle) return;
    const defaultIcon = toggle.dataset.defaultIcon || "☰";
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = defaultIcon;
  }

  function setupMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    if (!toggle) return;
    const defaultIcon = toggle.textContent;
    toggle.dataset.defaultIcon = defaultIcon;
    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "✕" : defaultIcon;
    });

    const navLinks = document.querySelector(".nav-links");

    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.addEventListener("click", closeMenu);
      link.addEventListener("touchend", (event) => {
        if (!document.body.classList.contains("nav-open")) return;
        const href = link.getAttribute("href");
        if (!href) return;
        event.preventDefault();
        closeMenu();
        window.location.assign(href);
      }, { passive: false });
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("nav-open")) return;
      const nav = document.querySelector(".nav");
      const toggle = document.querySelector("[data-menu-toggle]");
      const insideMenu = (navLinks && navLinks.contains(event.target))
        || (nav && nav.contains(event.target))
        || (toggle && toggle.contains(event.target));
      if (!insideMenu) closeMenu();
    });
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    localStorage.setItem("skaraCartCount", String(cart.length));
    updateBag();
    renderCartDrawer();
  }

  function updateBag() {
    document.querySelectorAll("[data-bag-count]").forEach((badge) => {
      badge.textContent = String(cart.length);
    });
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }

  function addToCart(product, size) {
    const sizes = getProductSizes(product);
    const chosenSize = size || sizes[Math.floor(sizes.length / 2)];
    cart.push({
      id: `${product.name}-${chosenSize}-${Date.now()}`,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: chosenSize
    });
    saveCart();
    showToast(`${product.name} (Size ${chosenSize}) added to your bag.`);
  }

  function removeFromCart(itemId) {
    cart = cart.filter((item) => item.id !== itemId);
    saveCart();
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

  function findProduct(name) {
    return SKARA_PRODUCTS.find((product) => product.name === name);
  }

  function getProductDescription(product) {
    const audienceCopy = {
      men: "executive wardrobes and travel-ready rotations",
      women: "curated evening edits and daily luxury",
      kids: "growing feet with fit-first comfort"
    };
    return `A signature ${product.category.toLowerCase()} from ${product.brand}, finished for ${audienceCopy[product.audience]}. Boutique-selected materials, refined silhouette, and discreet worldwide delivery for private clients.`;
  }

  function getProductSizes(product) {
    if (product.audience === "kids") return ["28", "29", "30", "31", "32", "33", "34"];
    if (product.audience === "women") return ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5"];
    return ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];
  }

  function productCard(product) {
    return `
      <article class="product-card" data-reveal data-product="${product.name}" data-category="${product.category}" data-audience="${product.audience}" data-brand="${product.brand}" data-price="${product.price}">
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

    const dotsContainer = document.querySelector("[data-hero-dots]");
    const prevBtn = document.querySelector("[data-hero-prev]");
    const nextBtn = document.querySelector("[data-hero-next]");
    let index = 0;
    let timer;

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll("[data-hero-dot]").forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function goTo(nextIndex) {
      slides[index].classList.remove("is-active");
      index = (nextIndex + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      updateDots();
    }

    function nextSlide() {
      goTo(index + 1);
    }

    function prevSlide() {
      goTo(index - 1);
    }

    function resetAutoplay() {
      window.clearInterval(timer);
      timer = window.setInterval(nextSlide, 5200);
    }

    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((_, dotIndex) => `
        <button type="button" class="hero-dot${dotIndex === 0 ? " is-active" : ""}" aria-label="Go to slide ${dotIndex + 1}" data-hero-dot="${dotIndex}"></button>
      `).join("");

      dotsContainer.addEventListener("click", (event) => {
        const dot = event.target.closest("[data-hero-dot]");
        if (!dot) return;
        goTo(Number(dot.dataset.heroDot));
        resetAutoplay();
      });
    }

    prevBtn?.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });

    resetAutoplay();
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

    const urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery) search.value = urlQuery;

    [category, audience, sort].forEach((control) => control.addEventListener("change", applyFilters));
    search.addEventListener("input", applyFilters);
    applyFilters();
  }

  function lockScroll() {
    document.body.classList.add("modal-open");
  }

  function unlockScroll() {
    if (
      !document.querySelector(".quick-view-overlay.is-open") &&
      !document.querySelector(".search-overlay.is-open") &&
      !document.querySelector(".cart-drawer.is-open")
    ) {
      document.body.classList.remove("modal-open");
    }
  }

  function setupCartDrawer() {
    const backdrop = document.createElement("div");
    backdrop.className = "cart-backdrop";
    backdrop.setAttribute("data-cart-backdrop", "");

    const drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.setAttribute("aria-label", "Shopping bag");
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <h2>Your Bag</h2>
        <button class="cart-drawer-close" type="button" aria-label="Close bag">×</button>
      </div>
      <div class="cart-drawer-body" data-cart-items></div>
      <div class="cart-drawer-footer">
        <div class="cart-total">
          <span>Total</span>
          <strong data-cart-total>$0</strong>
        </div>
        <button class="button" type="button" data-cart-checkout>Checkout</button>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
    cartDrawer = drawer;

    function closeCart() {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      unlockScroll();
    }

    function openCart() {
      renderCartDrawer();
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      lockScroll();
    }

    drawer.querySelector(".cart-drawer-close").addEventListener("click", closeCart);
    backdrop.addEventListener("click", closeCart);

    drawer.addEventListener("click", (event) => {
      const removeBtn = event.target.closest("[data-cart-remove]");
      if (removeBtn) {
        removeFromCart(removeBtn.dataset.cartRemove);
        return;
      }

      if (event.target.closest("[data-cart-checkout]")) {
        if (!cart.length) {
          showToast("Your bag is empty. Add a pair to continue.");
          return;
        }
        showToast("Checkout demo complete. A concierge will finalize your order.");
        closeCart();
      }
    });

    document.querySelectorAll(".bag-button").forEach((button) => {
      button.addEventListener("click", openCart);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) closeCart();
    });

    renderCartDrawer();
  }

  function renderCartDrawer() {
    if (!cartDrawer) return;

    const itemsEl = cartDrawer.querySelector("[data-cart-items]");
    const totalEl = cartDrawer.querySelector("[data-cart-total]");

    if (!cart.length) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <p>Your bag is currently empty.</p>
          <a class="button secondary" href="collections.html">Explore collections</a>
        </div>
      `;
      totalEl.textContent = money.format(0);
      return;
    }

    itemsEl.innerHTML = cart.map((item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.brand} ${item.name}">
        <div class="cart-item-copy">
          <strong>${item.name}</strong>
          <span>${item.brand} · Size ${item.size}</span>
          <em>${money.format(item.price)}</em>
        </div>
        <button class="cart-item-remove" type="button" aria-label="Remove ${item.name}" data-cart-remove="${item.id}">×</button>
      </article>
    `).join("");

    totalEl.textContent = money.format(getCartTotal());
  }

  function setupQuickView() {
    const overlay = document.createElement("div");
    overlay.className = "quick-view-overlay";
    overlay.innerHTML = `
      <div class="quick-view-modal" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
        <button class="quick-view-close" type="button" aria-label="Close product details">×</button>
        <div class="quick-view-grid">
          <div class="quick-view-media">
            <img src="" alt="" data-quick-image>
          </div>
          <div class="quick-view-body">
            <span class="eyebrow" data-quick-brand></span>
            <h2 id="quick-view-title" data-quick-name></h2>
            <p class="quick-view-meta" data-quick-meta></p>
            <p class="quick-view-desc" data-quick-desc></p>
            <p class="quick-view-price" data-quick-price></p>
            <div class="quick-view-sizes">
              <span class="eyebrow">Select size</span>
              <div class="size-row" data-quick-sizes></div>
            </div>
            <button class="button quick-view-add" type="button" data-quick-add>Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector(".quick-view-close");
    const image = overlay.querySelector("[data-quick-image]");
    const brand = overlay.querySelector("[data-quick-brand]");
    const name = overlay.querySelector("[data-quick-name]");
    const meta = overlay.querySelector("[data-quick-meta]");
    const desc = overlay.querySelector("[data-quick-desc]");
    const price = overlay.querySelector("[data-quick-price]");
    const sizes = overlay.querySelector("[data-quick-sizes]");
    const addBtn = overlay.querySelector("[data-quick-add]");
    let activeProduct = null;
    let selectedSize = "";

    function closeQuickView() {
      overlay.classList.remove("is-open");
      unlockScroll();
      activeProduct = null;
      selectedSize = "";
    }

    function renderSizes(product) {
      const options = getProductSizes(product);
      selectedSize = options[Math.floor(options.length / 2)];
      sizes.innerHTML = options.map((size) => `
        <button class="size-chip${size === selectedSize ? " is-active" : ""}" type="button" data-size="${size}">${size}</button>
      `).join("");
    }

    function openQuickView(productName) {
      const product = findProduct(productName);
      if (!product) return;

      activeProduct = product;
      image.src = product.image;
      image.alt = `${product.brand} ${product.name}`;
      brand.textContent = product.brand;
      name.textContent = product.name;
      meta.textContent = `${product.category} · ${product.audience}`;
      desc.textContent = getProductDescription(product);
      price.textContent = money.format(product.price);
      renderSizes(product);
      overlay.classList.add("is-open");
      lockScroll();
    }

    closeBtn.addEventListener("click", closeQuickView);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeQuickView();
    });

    sizes.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-size]");
      if (!chip) return;
      selectedSize = chip.dataset.size;
      sizes.querySelectorAll(".size-chip").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.size === selectedSize);
      });
    });

    addBtn.addEventListener("click", () => {
      if (!activeProduct) return;
      addToCart(activeProduct, selectedSize);
      closeQuickView();
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-add]")) return;
      const card = event.target.closest(".product-card[data-product]");
      if (!card) return;
      openQuickView(card.dataset.product);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) closeQuickView();
    });
  }

  function navigateToSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (currentPage === "collections") {
      const searchInput = document.querySelector("[data-filter-search]");
      if (searchInput) {
        searchInput.value = trimmed;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return;
    }

    window.location.href = `collections.html?q=${encodeURIComponent(trimmed)}`;
  }

  function setupSearch() {
    const overlay = document.createElement("div");
    overlay.className = "search-overlay";
    overlay.innerHTML = `
      <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search collection">
        <div class="search-panel-header">
          <input type="search" placeholder="Search brands, pairs, categories..." aria-label="Search collection" data-global-search>
          <button class="search-close" type="button" aria-label="Close search">×</button>
        </div>
        <div class="search-results" data-search-results></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector("[data-global-search]");
    const results = overlay.querySelector("[data-search-results]");
    const closeBtn = overlay.querySelector(".search-close");

    function closeSearch() {
      overlay.classList.remove("is-open");
      input.value = "";
      results.innerHTML = "";
      unlockScroll();
    }

    function openSearch() {
      overlay.classList.add("is-open");
      lockScroll();
      window.setTimeout(() => input.focus(), 60);
      renderResults("");
    }

    function renderResults(query) {
      const normalized = query.trim().toLowerCase();
      let matches = SKARA_PRODUCTS;

      if (normalized) {
        matches = SKARA_PRODUCTS.filter((product) => (
          `${product.name} ${product.brand} ${product.category} ${product.audience}`.toLowerCase().includes(normalized)
        ));
      } else {
        matches = SKARA_PRODUCTS.slice(0, 6);
      }

      if (!matches.length) {
        results.innerHTML = `<p class="search-empty">No pieces found. Try another brand, category, or pair name.</p>`;
        return;
      }

      const items = matches.slice(0, 8).map((product) => `
        <button class="search-result" type="button" data-search-pick="${product.name}">
          <img src="${product.image}" alt="">
          <span>
            <strong>${product.name}</strong>
            <small>${product.brand} · ${product.category}</small>
          </span>
          <em>${money.format(product.price)}</em>
        </button>
      `).join("");

      const footer = normalized
        ? `<button class="search-view-all button secondary" type="button" data-search-submit>View all ${matches.length} results</button>`
        : `<p class="search-hint">Start typing to search the full collection.</p>`;

      results.innerHTML = items + footer;
    }

    document.querySelectorAll(".icon-button[aria-label='Search']").forEach((button) => {
      button.addEventListener("click", openSearch);
    });

    closeBtn.addEventListener("click", closeSearch);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeSearch();
    });

    input.addEventListener("input", () => renderResults(input.value));

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSearch();
      if (event.key === "Enter") {
        event.preventDefault();
        navigateToSearch(input.value);
        closeSearch();
      }
    });

    results.addEventListener("click", (event) => {
      const pick = event.target.closest("[data-search-pick]");
      if (pick) {
        navigateToSearch(pick.dataset.searchPick);
        closeSearch();
        return;
      }

      if (event.target.closest("[data-search-submit]")) {
        navigateToSearch(input.value);
        closeSearch();
      }
    });
  }

  function closeFilters() {
    const toggle = document.querySelector("[data-filter-toggle]");
    if (!toggle) return;
    const defaultIcon = toggle.dataset.defaultIcon || "☷";
    document.body.classList.remove("filters-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = defaultIcon;
  }

  function matchesPillFilter(product, filterValue) {
    if (filterValue === "all") return true;
    if (filterValue === "Mules") {
      return product.category === "Sandals" || product.name.toLowerCase().includes("mule");
    }
    if (filterValue === "Trainers") {
      return product.category === "Sport" || product.category === "Sneakers";
    }
    return product.category === filterValue;
  }

  function setActivePill(pill) {
    const row = pill.closest(".chip-row");
    if (!row) return;
    row.querySelectorAll("[data-filter-pill]").forEach((button) => {
      button.classList.toggle("is-active", button === pill);
    });
  }

  function setupCategoryPills() {
    document.querySelectorAll("[data-filter-pill]").forEach((pill) => {
      pill.addEventListener("click", () => {
        const filterValue = pill.dataset.filterPill;
        const shopGrid = document.querySelector("[data-shop-grid]");
        const categorySelect = document.querySelector("[data-filter-category]");

        if (shopGrid && categorySelect) {
          const row = pill.closest(".chip-row");
          if (pill.classList.contains("is-active")) {
            categorySelect.value = "all";
            row.querySelectorAll("[data-filter-pill]").forEach((button) => button.classList.remove("is-active"));
          } else {
            categorySelect.value = filterValue;
            setActivePill(pill);
          }
          categorySelect.dispatchEvent(new Event("change"));
          return;
        }

        const grid = document.querySelector("[data-products]:not([data-limit])");
        if (!grid || grid.dataset.products === "all") return;

        const audience = grid.dataset.products;
        let products = SKARA_PRODUCTS.filter((product) => product.audience === audience);

        if (filterValue !== "all") {
          products = products.filter((product) => matchesPillFilter(product, filterValue));
        }

        setActivePill(pill);
        grid.innerHTML = products.map(productCard).join("");
        setupReveal();
      });
    });
  }

  function setupFilterToggle() {
    const toggle = document.querySelector("[data-filter-toggle]");
    if (!toggle) return;
    const defaultIcon = toggle.textContent;
    toggle.dataset.defaultIcon = defaultIcon;
    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("filters-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "✕" : defaultIcon;
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("filters-open")) return;
      const panel = document.querySelector(".filter-panel");
      const toolbar = document.querySelector(".shop-toolbar");
      if (panel && !panel.contains(event.target) && toolbar && !toolbar.contains(event.target)) {
        closeFilters();
      }
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
      event.stopPropagation();
      const product = findProduct(button.dataset.add);
      if (!product) return;
      addToCart(product);
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
        <div class="chat-body" data-chat-body>
          <div class="chat-message agent">Welcome to SKARA. How may I assist you today?</div>
        </div>
        <div class="chat-footer">
          <input type="text" placeholder="Type a message..." aria-label="Chat input" data-chat-input>
          <button type="button" data-chat-send>Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(chatContainer);

    const toggle = chatContainer.querySelector(".chat-toggle");
    const close = chatContainer.querySelector(".chat-close");
    const windowEl = chatContainer.querySelector(".chat-window");
    const bodyEl = chatContainer.querySelector("[data-chat-body]");
    const input = chatContainer.querySelector("[data-chat-input]");
    const sendBtn = chatContainer.querySelector("[data-chat-send]");

    function appendChatMessage(text, role) {
      const message = document.createElement("div");
      message.className = `chat-message ${role}`;
      message.textContent = text;
      bodyEl.appendChild(message);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function sendChatMessage() {
      const text = input.value.trim();
      if (!text) return;

      appendChatMessage(text, "user");
      input.value = "";

      window.setTimeout(() => {
        appendChatMessage(CHAT_REPLIES[chatReplyIndex % CHAT_REPLIES.length], "agent");
        chatReplyIndex += 1;
      }, 850);
    }

    toggle.addEventListener("click", () => windowEl.classList.add("is-open"));
    close.addEventListener("click", () => windowEl.classList.remove("is-open"));
    sendBtn.addEventListener("click", sendChatMessage);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendChatMessage();
      }
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
  setupCategoryPills();
  setupQuickView();
  setupSearch();
  setupCartDrawer();
  setupTilt();
  setupCart();
  setupForms();
  setupReveal();
  setupCustomCursor();
  setupLiveChat();
})();
