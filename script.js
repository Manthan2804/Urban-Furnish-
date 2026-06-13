//for deals of the day slider to work
const slider = document.getElementById('dealSlider');
const slideAmountDesktop = 880; // approx width of 4 cards + gaps
const slideAmountTablet = 460;  // approx width of 2 cards + gaps
const slideAmountMobile = 230;  // approx width of 1 card + gaps

function getSlideAmount() {
  const width = window.innerWidth;
  if (width <= 480) return slideAmountMobile;
  if (width <= 768) return slideAmountTablet;
  return slideAmountDesktop;
}

function slideLeft() {
  slider.scrollBy({ left: -getSlideAmount(), behavior: 'smooth' });
}

function slideRight() {
  slider.scrollBy({ left: getSlideAmount(), behavior: 'smooth' });
}
const reviewSlider = document.getElementById('reviewSlider');

function getReviewSlideAmount() {
  const width = window.innerWidth;
  if (width <= 480) return 250; // mobile
  if (width <= 768) return 350; // tablet
  return 450; // desktop
}

function slideLeftReview() {
  reviewSlider.scrollBy({ left: -getReviewSlideAmount(), behavior: 'smooth' });
}

function slideRightReview() {
  reviewSlider.scrollBy({ left: getReviewSlideAmount(), behavior: 'smooth' });
}

// ---------- Quick View Modal (shared) ----------
function ensureModal() {
  if (document.getElementById('quickViewOverlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'quickViewOverlay';
  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="modal-title" id="modalTitle">Product</div>
        <button class="modal-close" id="modalClose" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        <img id="modalImg" alt="product image" />
        <div class="modal-details">
          <p id="modalBrand"></p>
          <p id="modalColor"></p>
          <p id="modalMaterial"></p>
          <p class="price" id="modalPrice"></p>
          <div class="option-row">
            <select id="optColor"></select>
            <select id="optSize"></select>
          </div>
          <div class="option-row">
            <input id="optQty" type="number" min="1" value="1" />
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-ghost" id="addToWishlist">Wishlist</button>
        <button class="btn-primary" id="addToCart">Add to Cart</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
  document.getElementById('modalClose').addEventListener('click', () => overlay.classList.remove('active'));
}

function openQuickView(product) {
  ensureModal();
  const overlay = document.getElementById('quickViewOverlay');
  document.getElementById('modalTitle').textContent = product.name;
  const imgEl = document.getElementById('modalImg');
  imgEl.src = product.img;
  imgEl.alt = product.name;
  document.getElementById('modalBrand').textContent = `Brand: ${product.brand || '-'}`;
  document.getElementById('modalColor').textContent = `Color: ${product.color || '-'}`;
  document.getElementById('modalMaterial').textContent = `Material: ${product.material || '-'}`;
  document.getElementById('modalPrice').textContent = `₹${product.price}/month`;

  // Populate options
  const colorSelect = document.getElementById('optColor');
  const sizeSelect = document.getElementById('optSize');
  colorSelect.innerHTML = '';
  sizeSelect.innerHTML = '';
  const colors = [product.color, 'Black', 'White', 'Grey'].filter(Boolean);
  const sizes = ['S', 'M', 'L', 'XL'];
  colors.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = `Color: ${c}`; colorSelect.appendChild(opt);
  });
  sizes.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = `Size: ${s}`; sizeSelect.appendChild(opt);
  });

  // Bind Add to Cart
  document.getElementById('addToCart').onclick = () => {
    const selection = {
      id: `${product.name}-${colorSelect.value}-${sizeSelect.value}`,
      name: product.name,
      price: product.price,
      color: colorSelect.value,
      size: sizeSelect.value,
      quantity: Math.max(1, parseInt(document.getElementById('optQty').value || '1', 10)),
      img: product.img
    };
    addToCart(selection);
    overlay.classList.remove('active');
  };

  document.getElementById('addToWishlist').onclick = () => {
    addToWishlist({
      id: `${product.name}-${colorSelect.value}`,
      name: product.name,
      price: product.price,
      color: colorSelect.value,
      img: product.img
    });
  };

  overlay.classList.add('active');
}

// Delegate clicks on product cards
document.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  const inGrid = e.target.closest('#livingroomProducts, #bedroomProducts, #storageProducts, #appliancesProducts, #studyProducts');
  if (!inGrid) return; // avoid triggering on navigational cards

  const name = card.querySelector('h3')?.textContent?.trim();
  const priceText = card.querySelector('.price')?.textContent || '';
  const priceMatch = priceText.match(/₹(\d+)/);
  const price = priceMatch ? parseInt(priceMatch[1], 10) : undefined;
  const img = card.querySelector('img')?.getAttribute('src');

  // Robustly read labeled lines
  const paraMap = {};
  card.querySelectorAll('p').forEach(p => {
    const t = (p.textContent || '').trim();
    if (t.startsWith('Brand:')) paraMap.brand = t.replace('Brand: ', '').trim();
    if (t.startsWith('Color:')) paraMap.color = t.replace('Color: ', '').trim();
    if (t.startsWith('Material:')) paraMap.material = t.replace('Material: ', '').trim();
  });

  if (name && img) {
    e.preventDefault();
    openQuickView({
      name,
      img,
      price: price || 0,
      brand: paraMap.brand,
      color: paraMap.color,
      material: paraMap.material,
    });
  }
});

// ---------- Cart (localStorage) ----------
const CART_KEY = 'rentalHubCart';

function getUserCartKey() {
  const user = getCurrentUser();
  return user ? `${CART_KEY}_${user.id}` : CART_KEY;
}

function readCart() {
  const user = getCurrentUser();
  if (!user) return [];
  try { return JSON.parse(localStorage.getItem(getUserCartKey()) || '[]'); } catch { return []; }
}

function writeCart(items) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(getUserCartKey(), JSON.stringify(items));
  updateCartBadge();
}

function addToCart(item) {
  const items = readCart();
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    items[idx].quantity += item.quantity;
  } else {
    items.push(item);
  }
  writeCart(items);
  openCartDrawer();
}

function removeFromCart(id) {
  writeCart(readCart().filter(i => i.id !== id));
  renderCart();
}

function updateCartQty(id, qty) {
  const items = readCart();
  const it = items.find(i => i.id === id);
  if (it) { it.quantity = Math.max(1, qty); }
  writeCart(items);
  renderCart();
}

function ensureCartDrawer() {
  if (document.getElementById('cartOverlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'cartOverlay';
  overlay.innerHTML = `
    <div class="cart-panel">
      <div class="cart-header">
        <div class="cart-title">Your Cart</div>
        <button class="cart-close" id="cartClose">×</button>
      </div>
      <div class="cart-body" id="cartBody"></div>
      <div class="cart-footer">
        <div class="subtotal-row"><span>Subtotal</span><strong id="cartSubtotal">₹0</strong></div>
        <button class="checkout-btn" id="checkoutBtn">Proceed to Checkout</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
  document.getElementById('cartClose').addEventListener('click', () => overlay.classList.remove('active'));
}

function renderCart() {
  ensureCartDrawer();
  const items = readCart();
  const body = document.getElementById('cartBody');
  body.innerHTML = '';
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <div class="ci-name">${item.name}</div>
        <div class="ci-meta">${item.color} • ${item.size}</div>
        <div class="ci-price">₹${item.price}/month</div>
      </div>
      <div class="ci-actions">
        <input class="ci-qty" type="number" min="1" value="${item.quantity}">
        <button class="ci-remove">Remove</button>
      </div>`;
    row.querySelector('.ci-qty').addEventListener('change', (e) => updateCartQty(item.id, parseInt(e.target.value || '1', 10)));
    row.querySelector('.ci-remove').addEventListener('click', () => removeFromCart(item.id));
    body.appendChild(row);
  });
  document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
}

function openCartDrawer() {
  ensureCartDrawer();
  renderCart();
  const overlay = document.getElementById('cartOverlay');
  overlay.classList.add('active');
}

function ensureCartBadge() {
  const cartLink = document.querySelector('.nav-links a[href="#"] .fa-cart-shopping')?.parentElement
    || document.querySelector('.nav-links a .fa-cart-shopping')?.parentElement;
  if (!cartLink) return;
  cartLink.classList.add('cart-link');
  if (!cartLink.querySelector('.cart-badge')) {
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = '0';
    cartLink.appendChild(badge);
  }
  cartLink.addEventListener('click', (e) => { e.preventDefault(); openCartDrawer(); });
}

function updateCartBadge() {
  ensureCartBadge();
  const count = readCart().reduce((sum, i) => sum + i.quantity, 0);
  const badge = document.querySelector('.cart-link .cart-badge');
  if (badge) badge.textContent = String(count);
}

window.addEventListener('DOMContentLoaded', updateCartBadge);

// ---------- Wishlist (localStorage) ----------
const WISHLIST_KEY = 'rentalHubWishlist';

function getUserWishlistKey() {
  const user = getCurrentUser();
  return user ? `${WISHLIST_KEY}_${user.id}` : WISHLIST_KEY;
}

function readWishlist() {
  const user = getCurrentUser();
  if (!user) return [];
  try { return JSON.parse(localStorage.getItem(getUserWishlistKey()) || '[]'); } catch { return []; }
}

function writeWishlist(items) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(getUserWishlistKey(), JSON.stringify(items));
  updateWishlistBadge();
}

function addToWishlist(item) {
  const items = readWishlist();
  if (!items.some(i => i.id === item.id)) items.push(item);
  writeWishlist(items);
  openWishlistDrawer();
}

function removeFromWishlist(id) {
  writeWishlist(readWishlist().filter(i => i.id !== id));
  renderWishlist();
}

function ensureWishlistDrawer() {
  if (document.getElementById('wishlistOverlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'wishlistOverlay';
  overlay.innerHTML = `
    <div class="wishlist-panel">
      <div class="wishlist-header">
        <div class="wishlist-title">Your Wishlist</div>
        <button class="wishlist-close" id="wishlistClose">×</button>
      </div>
      <div class="wishlist-body" id="wishlistBody"></div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
  document.getElementById('wishlistClose').addEventListener('click', () => overlay.classList.remove('active'));
}

function renderWishlist() {
  ensureWishlistDrawer();
  const items = readWishlist();
  const body = document.getElementById('wishlistBody');
  body.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'wishlist-item';
    row.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <div class="ci-name">${item.name}</div>
        <div class="ci-meta">${item.color || ''}</div>
      </div>
      <div class="wi-actions">
        <button class="btn-primary move-to-cart">Move to Cart</button>
        <button class="ci-remove">Remove</button>
      </div>`;
    row.querySelector('.ci-remove').addEventListener('click', () => removeFromWishlist(item.id));
    row.querySelector('.move-to-cart').addEventListener('click', () => {
      addToCart({
        id: `${item.id}-cart`,
        name: item.name,
        price: item.price || 0,
        color: item.color || 'Default',
        size: 'M',
        quantity: 1,
        img: item.img
      });
      removeFromWishlist(item.id);
    });
    body.appendChild(row);
  });
}

function openWishlistDrawer() {
  ensureWishlistDrawer();
  renderWishlist();
  const overlay = document.getElementById('wishlistOverlay');
  overlay.classList.add('active');
}

function ensureWishlistBadge() {
  // try to find a heart icon in navbar
  const heartIcon = document.querySelector('.nav-links a .fa-heart')?.parentElement;
  if (!heartIcon) return;
  heartIcon.classList.add('wishlist-link');
  if (!heartIcon.querySelector('.wishlist-badge')) {
    const badge = document.createElement('span');
    badge.className = 'wishlist-badge';
    badge.textContent = '0';
    heartIcon.appendChild(badge);
  }
  heartIcon.addEventListener('click', (e) => { e.preventDefault(); openWishlistDrawer(); });
}

function updateWishlistBadge() {
  ensureWishlistBadge();
  const count = readWishlist().length;
  const badge = document.querySelector('.wishlist-link .wishlist-badge');
  if (badge) badge.textContent = String(count);
}

window.addEventListener('DOMContentLoaded', updateWishlistBadge);

// ---------- Footer Button Handlers ----------
function handleFooterButtons() {
  // View Cart buttons
  document.querySelectorAll('a[href="#"]').forEach(link => {
    if (link.textContent.trim() === 'View Cart') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    }
    if (link.textContent.trim() === 'Track My Order') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Order tracking feature coming soon! Please contact us for order status.');
      });
    }
    if (link.textContent.trim() === 'Help') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'contact.html';
      });
    }
  });
}

window.addEventListener('DOMContentLoaded', handleFooterButtons);

// ---------- Authentication State Management ----------
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('rentalHubCurrentUser') || 'null'); } catch { return null; }
}

function logout() {
  localStorage.removeItem('rentalHubCurrentUser');
  updateNavbarAuth();
  updateCartBadge();
  updateWishlistBadge();
  window.location.href = 'main.html';
}

function updateNavbarAuth() {
  const user = getCurrentUser();
  const authLink = document.querySelector('.nav-links a[href="auth.html"]');
  
  if (user && authLink) {
    authLink.innerHTML = `<span class="username">${user.fullName}</span> <button onclick="logout()" class="logout-btn">Logout</button>`;
    authLink.href = '#';
    authLink.onclick = (e) => e.preventDefault();
  } else if (authLink) {
    authLink.innerHTML = '<i class="fa-regular fa-circle-user"></i>';
    authLink.href = 'auth.html';
    authLink.onclick = null;
  }
}

window.addEventListener('DOMContentLoaded', updateNavbarAuth);