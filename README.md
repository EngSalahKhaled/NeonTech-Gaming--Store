<p align="center">
  <img src="https://img.shields.io/badge/⚡-NeonTech-39FF14?style=for-the-badge&logo=lightning&logoColor=black" alt="NeonTech Badge" />
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-blue?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Auth-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</p>

<h1 align="center">⚡ NeonTech — Premium Gaming Store</h1>

<p align="center">
  <strong>A fully responsive, neon-themed e-commerce web application for gaming peripherals & gear.</strong><br/>
  Built with pure HTML, CSS & JavaScript — no frameworks, no dependencies, just raw performance.
</p>

---

## 🎬 Live Demo

🔗 **[Visit NeonTech Live](#)** *(Add your Netlify URL here after deployment)*

---

## ✨ Features Overview

### 🏠 Homepage & Navigation
- **Sticky Navbar** with animated logo, live search bar, notification bell, user account, and cart icon with dynamic badge counter
- **Scroll Progress Bar** — a neon green progress indicator at the top that fills as you scroll
- **Scroll-to-Top Button** — appears after scrolling with smooth scroll behavior

### 🛍️ Product Catalog (70+ Products)
- **7 Categories**: Keyboards, Mice, Headsets, Controllers, Monitors, Gaming Chairs, Laptops
- **Dynamic Product Grid** with animated card entry (cards fade/slide in as they enter the viewport)
- **Featured Banner** — a highlighted deal section with countdown-style urgency
- **Category Sidebar** with real-time product counts, price range filter, brand filter, and rating filter
- **Catalog Controls** — grid/list view toggle and sort dropdown (Featured, Price Low/High, Newest, Rating)
- **Product Search** — real-time filtering of products by name

### 📄 Product Detail Pages
- **9 Dedicated Product Pages** for each product type with:
  - High-res image gallery with thumbnail navigation
  - Color & variant option selectors
  - Quantity selector with +/- buttons
  - Interactive star rating system
  - "Add to Cart" with fly-to-cart animation
  - Related products carousel

### 🛒 Shopping Cart System
- **Slide-in Cart Drawer** with overlay backdrop
- **Full Cart Management**: Add, remove, increase/decrease quantity
- **Persistent Cart** — saved to `localStorage`, survives page refresh
- **Live Price Calculation** — subtotal and total update in real-time
- **Empty State** with "Shop Now" call-to-action

### 📱 WhatsApp Checkout (No Payment Gateway!)
- Clicking **"Proceed to Checkout"** composes a pre-formatted Arabic WhatsApp message with:
  - All product names, quantities, and prices
  - Grand total calculation
  - Payment preference prompt (Instapay / Cash on Delivery)
- Auto-redirects to WhatsApp via `wa.me` API
- Cart auto-clears after checkout

### 🔐 Authentication System (Supabase)
- **Sign Up** with display name, email, password + real-time validation
- **Login** with email & password
- **Google OAuth** — "Continue with Google" button on Login & Signup
- **Forgot Password** — sends reset link via email
- **Update Password** — form appears after clicking reset link
- **Session Persistence** — logged-in state auto-detected on page load
- **Logout** functionality

### 🔔 Notifications & UX
- **Neon Toast Notifications** for all actions
- **Sound Effect** on checkout
- **Exit-Intent Modal** — discount code popup (`SALAH10` — 10% off)

### ⚖️ Product Comparison
- Compare up to **3 products** side by side in a modal table

### ⭐ Star Rating System
- Interactive per-card ratings (1–5 stars), isolated per product

### 📬 Newsletter & Footer
- Email subscription with perks list
- Rich 4-column footer with social links, payment badges, and legal links

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5 (Semantic) |
| **Styling** | Vanilla CSS3 (Custom Properties, Flexbox, Grid, Animations) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Authentication** | [Supabase Auth](https://supabase.com/) (Email/Password + Google OAuth) |
| **Data** | JSON (`products.json`) + Supabase REST API |
| **Cart Storage** | localStorage |
| **Checkout** | WhatsApp Business API (`wa.me`) |
| **Deployment** | Netlify (Static Hosting) |

---

## 📁 Project Structure

```
NeonTech/
├── index.html                    # Main homepage & catalog
├── main.js                       # All JavaScript logic (2400+ lines)
├── products.json                 # Product data (70 products, fetched dynamically)
├── css/
│   └── main.css                  # Complete stylesheet (4100+ lines)
├── images/                       # 24 product images (PNG/JPG)
├── product-details.html          # Generic product detail page
├── product-keyboard.html         # Keyboard detail page
├── product-mouse.html            # Mouse detail page
├── product-headset.html          # Headset detail page
├── product-controller.html       # Controller detail page
├── product-monitor.html          # Monitor detail page
├── product-laptop.html           # Laptop detail page
├── product-gpu.html              # GPU detail page
├── product-vr.html               # VR headset detail page
├── product-chair.html            # Gaming chair detail page
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- [Git](https://git-scm.com/) installed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/NeonTech-Gaming-Store.git

# 2. Navigate to the project folder
cd NeonTech-Gaming-Store

# 3. Open in browser (pick one):
# Option A: Open index.html directly
# Option B: Use VS Code Live Server extension
# Option C: Python server:
python -m http.server 8080
# Then visit http://localhost:8080
```

### Supabase Setup (For Authentication)
1. Create a free account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to **Settings → API** and copy your Project URL + `anon` key
4. Replace values in `main.js` (lines 2-3)
5. Enable **Google OAuth** in Dashboard → Authentication → Providers → Google

---

## 🌐 Deployment on Netlify

### Method 1: Drag & Drop
1. Go to [app.netlify.com](https://app.netlify.com/)
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the entire project folder onto the page
4. Done! ✨

### Method 2: Connect to GitHub (Auto-Deploy)
1. Push repo to GitHub
2. Go to Netlify → **"Import an existing project"** → Select GitHub repo
3. Build command: *(leave empty)*  |  Publish directory: `.`
4. Every push to `main` auto-deploys! 🚀

### After Deployment
- Add your Netlify URL to Supabase → Authentication → URL Configuration → Redirect URLs
- Add Netlify URL to Google Cloud Console authorized redirect URIs

---

## 🎨 Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--neon` | `#39FF14` | Primary accent (Neon Green) |
| `--bg-body` | `#0a0a0f` | Page background (Deep Black) |
| `--bg-card` | `#12121a` | Card backgrounds |
| `--text-primary` | `#e8e8e8` | Main text |
| `--danger` | `#ff4757` | Error states |

---

## 🔧 Configuration

### WhatsApp Number
```javascript
// In main.js — WhatsApp checkout section
let whatsappNumber = "966500438424"; // Change to your number
```

### Supabase Credentials
```javascript
const SUPABASE_URL = "your-project-url";
const SUPABASE_ANON_KEY = "your-anon-key";
```

### Adding Products
Add to `products.json`:
```json
{
  "id": 71,
  "title": "Product Name",
  "price": 99.99,
  "image": "./images/product.png",
  "category": "Category"
}
```

---

## 👤 Author

**Salah Khaled** — [salahkhaled.com](https://salahkhaled.com)

---

<p align="center">
  Made with ⚡ and 💚 by <a href="https://salahkhaled.com">Salah Khaled</a></p>
