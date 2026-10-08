const products = [
  {
    id: 1,
    name: 'Your Name Heavyweight Tee',
    category: 'Custom Tee',
    categoryKey: 'custom-tee',
    price: 18000,
    tag: 'Made personal',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 2,
    name: 'City Stamp Tee',
    category: 'Custom Tee',
    categoryKey: 'custom-tee',
    price: 22000,
    tag: 'New drop',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 3,
    name: 'DS +234 Jersey',
    category: 'Jerseys',
    categoryKey: 'jerseys',
    price: 25000,
    tag: 'Lagos edition',
    image: 'images/products/DS%20%2B234%20JERSEY%20FRONT.jpg',
    backImage: 'images/products/DS%20%2B234%20JERSEY%20BACK.jpg'
  },
  {
    id: 4,
    name: 'Blue Jersey',
    category: 'Jerseys',
    categoryKey: 'jerseys',
    price: 25000,
    tag: 'New drop',
    image: 'images/products/BLUE%20JERSEY%20FRONT.jpg',
    backImage: 'images/products/BLUE%20JERSEY%20BACK.jpg'
  },
  {
    id: 9,
    name: 'DS Black Jersey',
    category: 'Jerseys',
    categoryKey: 'jerseys',
    price: 25000,
    tag: 'Street staple',
    image: 'images/products/DS%20BLACK%20JERSEY%20FRONT.jpg',
    backImage: 'images/products/DS%20BLACK%20JERSEY%20BACK.jpg'
  },
  {
    id: 10,
    name: 'DS Stripe Blue Jersey',
    category: 'Jerseys',
    categoryKey: 'jerseys',
    price: 25000,
    tag: 'Stripe series',
    image: 'images/products/DS%20STRIPE%20BLUE%20JERSEY%20FRONT.jpg',
    backImage: 'images/products/DS%20STRIPE%20BLUE%20JERSEY%20BACK.jpg'
  },
  {
    id: 11,
    name: 'DS Stripe Green Jersey',
    category: 'Jerseys',
    categoryKey: 'jerseys',
    price: 25000,
    tag: 'Stripe series',
    image: 'images/products/DS%20STRIPE%20GREEN%20JERSEY%20FRONT.jpg',
    backImage: 'images/products/DS%20STRIPE%20GREEN%20JERSEY%20BACK.jpg'
  },
  {
    id: 12,
    name: 'DS White NG Jersey',
    category: 'Jerseys',
    categoryKey: 'jerseys',
    price: 25000,
    tag: 'Naija edition',
    image: 'images/products/DS%20WHITE%20NG%20JERSEY%20FRONT.jpg',
    backImage: 'images/products/DS%20WHITE%20NG%20JERSEY%20BACK.jpg'
  },
  {
    id: 5,
    name: 'Everyday Six-Panel',
    category: 'Caps',
    categoryKey: 'caps',
    price: 14000,
    tag: 'Daily staple',
    image:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 6,
    name: 'Washed Cotton Cap',
    category: 'Caps',
    categoryKey: 'caps',
    price: 16000,
    tag: 'Low-key flex',
    image:
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 7,
    name: 'Everyday Plain Tee',
    category: 'Plain Tee',
    categoryKey: 'plain-tee',
    price: 12000,
    tag: 'Clean essential',
    image:
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 8,
    name: 'Heavyweight Plain Tee',
    category: 'Plain Tee',
    categoryKey: 'plain-tee',
    price: 16000,
    tag: 'Built to layer',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85'
  }
];

let activeCategory = 'all';
let selectedCurrency = 'NGN';
let activeSearch = '';
let activeSort = 'featured';

function restoreCart() {
  try {
    const savedCart = JSON.parse(sessionStorage.getItem('dailyswag-cart') || '[]');
    if (!Array.isArray(savedCart)) return new Map();

    const validEntries = savedCart.filter((entry) => {
      if (!Array.isArray(entry) || entry.length !== 2) return false;
      const productId = Number(entry[0]);
      const quantity = Number(entry[1]);
      return products.some((product) => product.id === productId)
        && Number.isInteger(quantity)
        && quantity > 0
        && quantity <= 10;
    }).map(([productId, quantity]) => [Number(productId), Number(quantity)]);

    return new Map(validEntries);
  } catch {
    return new Map();
  }
}

const cart = restoreCart();
const selectedSizes = new Map();

const productsGrid = document.getElementById('products-grid');
const storeSearch = document.querySelector('.store-search');
const productSearch = document.getElementById('product-search');
const sortSelect = document.getElementById('sort-select');
const catalogCount = document.getElementById('catalog-count');
const cartCountEl = document.getElementById('cart-count');
const categoryFilters = document.querySelectorAll('[data-category-filter]');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const currencySelect = document.getElementById('currency-select');
const checkoutButton = document.getElementById('checkout-button');
const cartButton = document.getElementById('cart-button');
const cartDialog = document.getElementById('cart-dialog');
const cartItemsEl = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const checkoutEmail = document.getElementById('checkout-email');
const cartMessage = document.getElementById('cart-message');
const cartCheckout = document.getElementById('cart-checkout');
const signupDialog = document.getElementById('signup-dialog');
const signupForm = document.getElementById('signup-form');
const signupClose = document.getElementById('signup-close');
const signupSubmit = document.getElementById('signup-submit');
const signupMessage = document.getElementById('signup-message');
const productDialog = document.getElementById('product-dialog');
const productDialogClose = document.getElementById('product-dialog-close');
const productDetailImage = document.getElementById('product-detail-image');
const productDetailTitle = document.getElementById('product-detail-title');
const productDetailCategory = document.getElementById('product-detail-category');
const productDetailPrice = document.getElementById('product-detail-price');
const productSizeSelect = document.getElementById('product-size-select');
const productDetailAdd = document.getElementById('product-detail-add');
const productShareButton = document.getElementById('product-share-button');
const shareLinks = document.getElementById('share-links');
let activeProduct = null;
const heroImage = document.getElementById('hero-image');
const heroPrev = document.getElementById('hero-prev');
const heroNext = document.getElementById('hero-next');
const heroDots = document.querySelectorAll('.slider-dot');

function getCartTotal() {
  return [...cart.entries()].reduce((total, [productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    return total + (product ? product.price * quantity : 0);
  }, 0);
}

function renderCart() {
  const cartEntries = [...cart.entries()].filter(([, quantity]) => quantity > 0);
  const itemCount = cartEntries.reduce((total, [, quantity]) => total + quantity, 0);

  try {
    sessionStorage.setItem('dailyswag-cart', JSON.stringify(cartEntries));
  } catch {}

  document.getElementById('cart-count').textContent = itemCount;
  cartSubtotalEl.textContent = formatPrice(getCartTotal(), 'NGN');
  cartCheckout.disabled = cartEntries.length === 0;

  if (cartEntries.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
    return;
  }

  cartItemsEl.innerHTML = cartEntries.map(([productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return '';

    return `
      <article class="cart-item">
        <div class="cart-item-copy">
          <strong>${product.name}</strong>
          <span>${formatPrice(product.price, 'NGN')} each Â· Size ${selectedSizes.get(product.id) || 'M'}</span>
        </div>
        <div class="cart-item-controls">
      <button type="button" data-cart-action="decrease" data-product-id="${product.id}" aria-label="Remove one ${product.name}">&#8722;</button>
          <span>${quantity}</span>
          <button type="button" data-cart-action="increase" data-product-id="${product.id}" aria-label="Add one ${product.name}">+</button>
          <button class="cart-remove" type="button" data-cart-action="remove" data-product-id="${product.id}">Remove</button>
        </div>
      </article>
    `;
  }).join('');
}

function openCart(productId = null) {
  if (productId !== null && !cart.has(productId)) {
    cart.set(productId, 1);
  }

  renderCart();
  cartDialog.showModal();
}

function openProductDetails(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  activeProduct = product;
  const sizes = product.categoryKey === 'caps' ? ['One size'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  productDetailTitle.textContent = product.name;
  productDetailCategory.textContent = `${product.category} / ${product.tag}`;
  productDetailPrice.textContent = formatPrice(product.price, 'NGN');
  productDetailImage.src = product.image;
  productDetailImage.alt = `${product.name} preview`;
  productSizeSelect.innerHTML = sizes.map((size) => `<option value="${size}">${size}</option>`).join('');
  productSizeSelect.value = selectedSizes.get(product.id) || sizes[0];
  shareLinks.hidden = true;
  productDialog.showModal();
}

function prepareShareLinks() {
  if (!activeProduct) return;
  const url = `${window.location.origin}${window.location.pathname}#product-${activeProduct.id}`;
  const text = `Check out ${activeProduct.name} from DailySwag`;
  document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  document.getElementById('share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  document.getElementById('share-x').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  shareLinks.hidden = false;
}

async function startPaystackCheckout(email) {
  cartCheckout.disabled = true;
  cartCheckout.textContent = 'Connecting to Paystack...';
  cartMessage.textContent = '';

  try {
    const response = await fetch('/api/paystack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        items: [...cart.entries()].map(([id, quantity]) => ({ id, quantity, size: selectedSizes.get(id) || 'M' }))
      })
    });
    const result = await response.json();

    if (!response.ok || !result.authorizationUrl) {
      throw new Error(result.error || 'Paystack could not start checkout. Try again.');
    }

    window.location.assign(result.authorizationUrl);
  } catch (error) {
    cartMessage.textContent = error.message || 'Could not connect to Paystack. Try again.';
    cartCheckout.disabled = false;
    cartCheckout.textContent = 'Continue to payment';
  }
}

async function verifyPaystackReturn() {
  const pageUrl = new URL(window.location.href);
  const reference = pageUrl.searchParams.get('reference');
  if (!reference) return;

  cartDialog.showModal();
  cartMessage.textContent = 'Verifying payment with Paystack...';

  try {
    const response = await fetch(`/api/paystack?reference=${encodeURIComponent(reference)}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Could not verify this payment.');
    }

    if (result.verified) {
      pageUrl.searchParams.delete('reference');
      pageUrl.searchParams.delete('trxref');
      window.history.replaceState({}, document.title, pageUrl.toString());
      cart.clear();
      renderCart();
      cartMessage.textContent = `Payment verified. Reference: ${result.reference}`;
      return;
    }

    cartMessage.textContent = result.status === 'pending'
      ? 'Payment is still pending. Your bag is saved; check again after completing the transfer.'
      : 'Payment was not confirmed. Your bag is saved so you can try again.';
  } catch (error) {
    cartMessage.textContent = error.message || 'Payment verification is unavailable. Your bag is saved.';
  }
}

const heroSlides = [
  'images/products/ng%20image%202.PNG',
  'images/products/ng%20image%203.PNG',
  'images/products/ng%20image%204.PNG',
  'images/products/ng%20image%205.PNG',
  'images/products/ng%20image%206.PNG',
  'images/products/ng%20image%207.PNG',
  'images/products/ng%20image%208.PNG',
  'images/products/ds%20image%209.PNG'
];

let heroSlideIndex = 0;
let heroSlideTimer = null;

const currencyRates = {
  NGN: 1,
  USD: 1500,
  GBP: 2000
};

function formatPrice(value, currency = selectedCurrency) {
  const amount = currency === 'NGN' ? value : value / currencyRates[currency];
  const localeMap = {
    NGN: 'en-NG',
    USD: 'en-US',
    GBP: 'en-GB'
  };

  return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2
  }).format(amount);
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('dailyswag-theme');
} catch {}

try {
  const savedCurrency = localStorage.getItem('dailyswag-currency');
  if (savedCurrency === 'NGN') {
    selectedCurrency = savedCurrency;
  }
} catch {}

function setTheme(theme, save = true) {
  const isDark = theme === 'dark';
  const nextTheme = isDark ? 'dark' : 'light';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  document.documentElement.dataset.theme = nextTheme;
  themeIcon.textContent = isDark ? String.fromCharCode(0x2600) : String.fromCharCode(0x263e);
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
  themeToggle.setAttribute('aria-pressed', String(isDark));

  if (save) {
    try {
      localStorage.setItem('dailyswag-theme', nextTheme);
    } catch {}
  }
}

setTheme(savedTheme === 'dark' ? 'dark' : 'light', false);
currencySelect.value = selectedCurrency;

function updateHeroSlide(index) {
  heroSlideIndex = (index + heroSlides.length) % heroSlides.length;

  if (heroImage) {
    heroImage.src = heroSlides[heroSlideIndex];
    heroImage.alt = `DailySwag hero image ${heroSlideIndex + 1}`;
  }

  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === heroSlideIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-current', String(isActive));
  });
}

function resetHeroRotation() {
  if (heroSlideTimer) {
    clearInterval(heroSlideTimer);
  }

  heroSlideTimer = setInterval(() => {
    updateHeroSlide(heroSlideIndex + 1);
  }, 4000);
}

if (heroPrev && heroNext) {
  heroPrev.addEventListener('click', () => {
    updateHeroSlide(heroSlideIndex - 1);
    resetHeroRotation();
  });

  heroNext.addEventListener('click', () => {
    updateHeroSlide(heroSlideIndex + 1);
    resetHeroRotation();
  });
}

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    updateHeroSlide(index);
    resetHeroRotation();
  });
});

if (heroImage) {
  updateHeroSlide(heroSlideIndex);
  resetHeroRotation();
}

currencySelect.addEventListener('change', (event) => {
  selectedCurrency = event.target.value;
  try {
    localStorage.setItem('dailyswag-currency', selectedCurrency);
  } catch {}
  renderProducts(activeCategory);
  renderCart();
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

function renderProducts(category = 'all') {
  activeCategory = category;
  const query = activeSearch.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.categoryKey === category;
    const searchableText = `${product.name} ${product.category} ${product.tag}`.toLowerCase();
    return matchesCategory && (!query || searchableText.includes(query));
  });

  if (activeSort === 'price-ascending') {
    filteredProducts.sort((first, second) => first.price - second.price);
  } else if (activeSort === 'price-descending') {
    filteredProducts.sort((first, second) => second.price - first.price);
  } else if (activeSort === 'name') {
    filteredProducts.sort((first, second) => first.name.localeCompare(second.name));
  }

  catalogCount.textContent = `Showing ${filteredProducts.length} of ${products.length} pieces`;

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-item" data-category="${product.categoryKey}">
          <div class="product-thumb">
            <span class="tag">${product.tag}</span>
            <img
              src="${product.image}"
              data-front-image="${product.image}"
              data-back-image="${product.backImage || ''}"
              data-product-name="${product.name}"
              alt="${product.name} front view"
              loading="lazy"
            />
            ${product.backImage ? `
              <button class="side-toggle" type="button" aria-label="Show back of ${product.name}" aria-pressed="false" title="Swap front/back view">
                <span aria-hidden="true">&#8644;</span>
              </button>
            ` : ''}
          </div>
          <div class="product-info">
            <div class="product-row">
              <h3 class="product-title">${product.name}</h3>
              <span class="price">${formatPrice(product.price, selectedCurrency)}</span>
            </div>
            <div class="product-meta">
              <span>${product.category}</span>
              <span class="product-code">DS-${String(product.id).padStart(3, '0')}</span>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
          </div>
        </article>
      `
    )
    .join('') || '<p class="empty-results">No pieces match that search. Try another term or category.</p>';

  document.querySelectorAll('.side-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.closest('.product-thumb').querySelector('img');
      const showingBack = button.getAttribute('aria-pressed') !== 'true';
      const side = showingBack ? 'back' : 'front';

      image.src = showingBack ? image.dataset.backImage : image.dataset.frontImage;
      image.alt = `${image.dataset.productName} ${side} view`;
      button.setAttribute('aria-pressed', String(showingBack));
      button.setAttribute('aria-label', `Show ${showingBack ? 'front' : 'back'} of ${image.dataset.productName}`);
      button.innerHTML = '<span aria-hidden="true">&#8644;</span>';
    });
  });

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.id);
      cart.set(productId, (cart.get(productId) || 0) + 1);
      renderCart();
      button.textContent = 'Added';
      button.disabled = true;
      setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Add to cart';
      }, 900);
    });
  });

  const productButtons = document.querySelectorAll('.add-to-cart');
  productButtons.forEach((button) => {
    const productId = Number(button.dataset.id);
    const product = products.find((item) => item.id === productId);

    if (!product) return;

    button.insertAdjacentHTML(
      'afterend',
      `<button class="checkout-inline" type="button" data-product-id="${product.id}">Select options</button>`
    );

    const buyNowButton = document.querySelector(`.checkout-inline[data-product-id="${product.id}"]`);
    buyNowButton.addEventListener('click', () => openProductDetails(product.id));
  });
}

storeSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  activeSearch = productSearch.value;
  renderProducts(activeCategory);
});

productSearch.addEventListener('input', () => {
  activeSearch = productSearch.value;
  renderProducts(activeCategory);
});

sortSelect.addEventListener('change', () => {
  activeSort = sortSelect.value;
  renderProducts(activeCategory);
});

cartButton.addEventListener('click', () => openCart());

productDialogClose.addEventListener('click', () => productDialog.close());
productDialog.addEventListener('click', (event) => {
  if (event.target === productDialog) productDialog.close();
});
productDetailAdd.addEventListener('click', () => {
  if (!activeProduct) return;
  selectedSizes.set(activeProduct.id, productSizeSelect.value);
  cart.set(activeProduct.id, (cart.get(activeProduct.id) || 0) + 1);
  renderCart();
  productDetailAdd.textContent = 'Added to bag';
  window.setTimeout(() => { productDetailAdd.textContent = 'Add to bag'; }, 1000);
});
productShareButton.addEventListener('click', async () => {
  prepareShareLinks();
  if (navigator.share && activeProduct) {
    try { await navigator.share({ title: activeProduct.name, text: `Check out ${activeProduct.name} from DailySwag`, url: window.location.href }); } catch {}
  }
});

document.querySelector('.cart-close').addEventListener('click', () => cartDialog.close());

cartItemsEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;

  const productId = Number(button.dataset.productId);
  const quantity = cart.get(productId) || 0;

  if (button.dataset.cartAction === 'remove' || (button.dataset.cartAction === 'decrease' && quantity <= 1)) {
    cart.delete(productId);
  } else if (button.dataset.cartAction === 'increase') {
    cart.set(productId, quantity + 1);
  } else if (button.dataset.cartAction === 'decrease') {
    cart.set(productId, quantity - 1);
  }

  renderCart();
});

cartCheckout.addEventListener('click', () => {
  cartMessage.textContent = '';

  if (cart.size === 0) {
    cartMessage.textContent = 'Your bag is empty.';
    return;
  }

  if (!checkoutEmail.reportValidity()) return;

  startPaystackCheckout(checkoutEmail.value.trim());
});

if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    openCart();
  });
}

signupClose.addEventListener('click', () => signupDialog.close());

signupDialog.addEventListener('click', (event) => {
  if (event.target === signupDialog) signupDialog.close();
});

signupDialog.addEventListener('close', () => {
  // The prompt should be available again the next time the site opens.
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!signupForm.reportValidity()) return;

  signupMessage.textContent = '';
  signupMessage.classList.remove('is-success');
  signupSubmit.disabled = true;
  signupSubmit.textContent = 'Joining...';

  try {
    const submission = Object.fromEntries(new FormData(signupForm));
    submission.name = String(submission.name || '').trim();
    submission.email = String(submission.email || '').trim();

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
      signal: controller.signal
    });
    window.clearTimeout(timeout);

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Signup could not be saved.');

    try {
      localStorage.setItem('dailyswag-signup-complete-v2', 'yes');
    } catch {}

    signupForm.hidden = true;
    signupMessage.textContent = "You're on the list. Watch your inbox for the next drop.";
    signupMessage.classList.add('is-success');
    signupSubmit.disabled = false;
    signupSubmit.textContent = 'Joined';
  } catch (error) {
    signupMessage.textContent = window.location.protocol === 'file:'
      ? 'This local preview cannot save sign-ups. Open the deployed Cloudflare Pages site to join the list.'
      : error.name === 'AbortError'
        ? 'The signup request timed out. Please try again.'
        : error.message || 'Sign-up could not be saved. Please try again.';
    signupSubmit.disabled = false;
    signupSubmit.textContent = 'Sign me up';
  }
});

function showSignupPrompt() {
  const isPaymentReturn = new URLSearchParams(window.location.search).has('reference');
  if (isPaymentReturn || cartDialog.open) return;

  try {
    if (localStorage.getItem('dailyswag-signup-complete-v2') === 'yes') return;
  } catch {}

  window.setTimeout(() => {
    if (!cartDialog.open && !signupDialog.open) signupDialog.showModal();
  }, 450);
}

categoryFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    categoryFilters.forEach((button) => {
      const isActive = button === filter;
      button.setAttribute('aria-pressed', String(isActive));
      button.classList.toggle('is-active', isActive);
    });
    renderProducts(filter.dataset.categoryFilter);
  });
});

renderProducts();
renderCart();
verifyPaystackReturn();
showSignupPrompt();

