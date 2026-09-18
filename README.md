
---

# Prime Deluxe

A minimalist, high-end, cream-and-gold luxury landing page designed around the **Prime Deluxe** brand identity. The project is built completely with vanilla front-end web technologies and features a hero showcase, product grid, brand story section, executive spotlight, fully working shopping cart, and a responsive contact interface.

## Tech Stack

* **HTML5** — Semantic, responsive markup structure.
* **CSS3** — Custom properties (variables) for theme management and styling; fully responsive layout.
* **Vanilla JavaScript (ES6+)** — Client-side cart logic, DOM manipulation, persistent state via `localStorage`, smooth scrolling, and form handler stubs.
* **Dependencies:** None (Pure HTML/CSS/JS with zero build steps).

---

## File Structure

```text
├── index.html          # Main HTML entry point containing all section markups
├── style.css           # Global stylesheet and CSS variables (colors, typography)
├── script.js           # Client-side state (cart management, UI interactions, API stubs)
└── assets/
    └── logo.jpeg       # Official Prime Deluxe brand logo

```

---

## Getting Started

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/prime-deluxe.git
cd prime-deluxe

```


2. **Run locally:**
Open `index.html` directly in your preferred web browser, or launch it using a local development server like Live Server (VS Code extension).

---

## Customization & Template Guide

If you are cloning or adapting this project for a new store deployment, update the following section content and media assets:

### 1. Replacing Photography & Assets

* **Logo:** Replace or update `assets/logo.jpeg` directly with your high-resolution brand mark.
* **Product Media:** Update product images inside the `.product-card` containers in `index.html`.
* **Executive Media:** Update the CEO portrait image and digital signature image located within the `#ceo` section.

### 2. Product Data & Attributes

Product items rely on HTML5 `data-*` attributes for front-end shopping cart functionality. When modifying products in `index.html`, keep the following attributes in sync:

```html
<div class="product-card" 
     data-id="prod-001" 
     data-name="Your Product Name" 
     data-price="250.00">
     <!-- Product image and details go here -->
</div>

```

### 3. Copy & Contact Details

* **Hero Section:** Headline and tagline.
* **Brand Story:** Narrative copy and key metrics/statistical callouts.
* **CEO Section:** Name, executive title, quote, and professional bio.
* **Contact & Footer:** Email addresses, phone numbers, physical address, social media links, and copyright statements.

---

## Design System & Theme Customization

The color scheme and typography are controlled via CSS custom properties at the top of `style.css`. You can adjust these variables to modify the overall visual theme:

```css
:root {
  --bg-main: #f6efe2;          /* Cream background */
  --accent-gold: #b8892e;      /* Primary luxury gold */
  --accent-gold-dark: #8c6a23; /* Dark gold hover state */
  --accent-wine: #7a2e2e;      /* Secondary accent (badges/highlights) */
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'Montserrat', sans-serif;
}

```

---

## Backend Integration

### 1. Shopping Cart & Payment Gateway

The client-side shopping cart persists item selection and quantity changes using browser `localStorage`. Payment processing requires an external backend endpoint to securely handle API keys.

To integrate a backend payment system (e.g., Stripe, PayPal):

1. Locate `PAYMENT_CONFIG` in `script.js`:
```javascript
const PAYMENT_CONFIG = {
  checkoutEndpoint: '/api/checkout', // Replace with your server endpoint
  publishableKey: 'pk_test_...'      // Optional client key
};

```


2. Build a backend endpoint that accepts the cart payload from the client, initializes a payment session, and returns a redirect payload:
```json
{ "url": "https://checkout.paymentprovider.com/pay/session_id" }

```



### 2. Contact Form Processing

The contact form submits `POST` data containing `name`, `email`, `subject`, and `message` fields.

To connect a backend or third-party service:

1. Locate `CONTACT_FORM_ENDPOINT` in `script.js`.
2. Set the endpoint URL to point to a serverless function, custom backend handler, or form service (e.g., Formspree, Getform).

---

## Deployment Checklist

* [ ] Update product images, titles, and `data-*` attributes in `index.html`.
* [ ] Replace contact details, social links, and legal document targets (`Shipping`, `Privacy Policy`).
* [ ] Connect a backend server endpoint for payment processing (`PAYMENT_CONFIG`).
* [ ] Connect a functional form handler endpoint (`CONTACT_FORM_ENDPOINT`).
* [ ] Test layout across desktop, tablet, and mobile viewports.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
