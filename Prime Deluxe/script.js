// ==========================================================================
// PRIME DELUXE - INTERACTIVE FUNCTIONALITY
// ==========================================================================

// --------------------------------------------------------------------------
// PAYMENT CONFIG (placeholder — fill this in when you're ready to go live)
// --------------------------------------------------------------------------
// This site is "payment-ready": the cart, subtotal math, and checkout button
// are fully wired up. It does NOT charge anyone yet, because that requires
// a backend you control (Stripe/PayPal secret keys must never live in
// front-end JS). To finish the integration:
//
//   1. Stand up a small backend endpoint (Node/Express, a serverless
//      function, etc.) that creates a Checkout Session with your payment
//      provider using your SECRET key.
//   2. Set CHECKOUT_ENDPOINT below to that endpoint's URL.
//   3. Set PUBLISHABLE_KEY if your provider's client SDK needs it.
//   4. That's it — proceedToCheckout() below already POSTs the cart to
//      CHECKOUT_ENDPOINT and redirects the browser to whatever URL the
//      response returns (Stripe Checkout, PayPal approval link, etc).
const PAYMENT_CONFIG = {
  provider: 'stripe',                                   // 'stripe' | 'paypal' | 'custom'
  publishableKey: 'PLACEHOLDER_PUBLISHABLE_KEY',        // TODO: your Stripe/PayPal publishable (public) key
  checkoutEndpoint: '/api/create-checkout-session',      // TODO: point this at your backend
  currency: 'usd',
};

// TODO: point this at wherever contact-form submissions should go
// (a serverless function, Formspree, your own backend, etc.)
const CONTACT_FORM_ENDPOINT = '/api/contact';

const CART_STORAGE_KEY = 'primedeluxe_cart_v1';

document.addEventListener('DOMContentLoaded', () => {
  let cart = loadCart();

  const cartCountElement = document.getElementById('cart-count');
  const cartBtn = document.getElementById('cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsEl = document.getElementById('cart-items');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const checkoutBtn = document.getElementById('checkout-btn');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn:not([disabled])');
  const contactForm = document.getElementById('contact-form');

  renderCart();

  // ------------------------------------------------------------------
  // 1. Add to Cart
  // ------------------------------------------------------------------
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        image: card.querySelector('img') ? card.querySelector('img').src : '',
      };
      addToCart(product);

      const originalText = button.textContent;
      button.textContent = 'ADDED';
      button.style.backgroundColor = 'var(--accent-gold)';
      button.style.color = '#ffffff';
      button.style.borderColor = 'var(--accent-gold)';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
        button.style.borderColor = '';
      }, 1200);

      openCartDrawer();
    });
  });

  // ------------------------------------------------------------------
  // 2. Cart Drawer open/close
  // ------------------------------------------------------------------
  cartBtn.addEventListener('click', openCartDrawer);
  cartCloseBtn.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  function openCartDrawer() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }

  // ------------------------------------------------------------------
  // 3. Cart state (persisted to localStorage so it survives a refresh)
  // ------------------------------------------------------------------
  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn('Could not read cart from storage:', err);
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Could not save cart to storage:', err);
    }
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    renderCart();
  }

  function updateQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
  }

  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElement.textContent = totalCount;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty-msg">Your bag is empty.</p>';
    } else {
      cartItemsEl.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-line-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <p class="cart-line-name">${item.name}</p>
            <div class="cart-line-controls">
              <button class="qty-decrease" aria-label="Decrease quantity">-</button>
              <span>${item.qty}</span>
              <button class="qty-increase" aria-label="Increase quantity">+</button>
              <span>${formatPrice(item.price * item.qty)}</span>
            </div>
          </div>
          <button class="cart-line-remove">Remove</button>
        </div>`
        )
        .join('');

      // Wire up per-line controls (re-rendered each time, so bind fresh)
      cartItemsEl.querySelectorAll('.cart-line-item').forEach((line) => {
        const id = line.dataset.id;
        line.querySelector('.qty-increase').addEventListener('click', () => updateQty(id, 1));
        line.querySelector('.qty-decrease').addEventListener('click', () => updateQty(id, -1));
        line.querySelector('.cart-line-remove').addEventListener('click', () => removeFromCart(id));
      });
    }

    cartSubtotalEl.textContent = formatPrice(getSubtotal());
    checkoutBtn.disabled = cart.length === 0;
  }

  // ------------------------------------------------------------------
  // 4. Checkout (payment-ready stub — see PAYMENT_CONFIG at the top)
  // ------------------------------------------------------------------
  checkoutBtn.addEventListener('click', proceedToCheckout);

  async function proceedToCheckout() {
    if (cart.length === 0) return;

    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Redirecting…';
    checkoutBtn.disabled = true;

    try {
      const response = await fetch(PAYMENT_CONFIG.checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.qty,
          })),
          currency: PAYMENT_CONFIG.currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Checkout endpoint responded with ${response.status}`);
      }

      const data = await response.json();

      // Expecting your backend to return { url: 'https://checkout.stripe.com/...' }
      // (or the equivalent redirect URL for whichever provider you use).
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout endpoint did not return a redirect URL.');
      }
    } catch (err) {
      // This is expected until CHECKOUT_ENDPOINT points at a real backend.
      console.warn('Checkout not yet connected:', err.message);
      alert(
        'Checkout isn\u2019t connected to a payment provider yet.\n\n' +
        'To finish setup: add your backend endpoint to PAYMENT_CONFIG.checkoutEndpoint ' +
        'in script.js, and have it create a Stripe/PayPal Checkout Session for this cart.'
      );
    } finally {
      checkoutBtn.textContent = originalText;
      checkoutBtn.disabled = cart.length === 0;
    }
  }

  // ------------------------------------------------------------------
  // 5. Contact form (placeholder — connect to your backend / form service)
  // ------------------------------------------------------------------
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('contact-status');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const payload = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value,
      };

      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      try {
        // TODO: replace CONTACT_FORM_ENDPOINT with a real endpoint (a
        // serverless function, Formspree, your own backend, etc.) that
        // emails you / stores the submission.
        const response = await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Contact endpoint responded with ${response.status}`);
        }

        statusEl.textContent = 'Thank you — your message has been sent.';
        contactForm.reset();
      } catch (err) {
        // Expected until CONTACT_FORM_ENDPOINT points at a real backend.
        console.warn('Contact form not yet connected:', err.message);
        statusEl.textContent =
          'Placeholder: this form isn\u2019t connected to a backend yet ' +
          '(see CONTACT_FORM_ENDPOINT in script.js). Your message was not sent.';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ------------------------------------------------------------------
  // 6. Smooth scrolling for in-page nav links
  // ------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
