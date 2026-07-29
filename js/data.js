const STORAGE_KEYS = {
  products: 'products',
  settings: 'settings'
};

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Royal Dark Chocolate Box', price: 850, category: 'Dark', description: 'A luxurious collection of 70% Belgian dark chocolate truffles, ganaches, and pralines. Perfect for true dark chocolate connoisseurs.', image: 'https://img.freepik.com/free-photo/different-chocolate-candies-wooden-box_651396-1573.jpg?w=400', inStock: true, stock: 50, metaTitle: 'Royal Dark Chocolate Box – ChocoDelight BD', metaDesc: 'Buy premium Belgian dark chocolate box online in Bangladesh. 70% cocoa truffles, ganaches & pralines. Perfect gift for chocolate lovers.', metaKeywords: 'dark chocolate, Belgian chocolate, premium chocolate, chocolate box Bangladesh', height: 8, width: 20, weight: 350 },
  { id: 2, name: 'Milk Chocolate Delight', price: 650, category: 'Milk', description: 'Smooth and creamy milk chocolate made with the finest Swiss recipe. A timeless favorite for all ages.', image: 'https://img.freepik.com/free-photo/milk-chocolate_1339-1707.jpg?w=400', inStock: true, stock: 50, height: 1.5, width: 16, weight: 120 },
  { id: 3, name: 'Premium Gift Hamper', price: 2500, category: 'Gift Hampers', description: 'An exquisite gift hamper featuring our finest chocolates, elegantly packaged in a handcrafted box with a personalized message card.', image: 'https://img.freepik.com/free-photo/chocolate-gift-basket-wooden-table_23-2147985557.jpg?w=400', inStock: true, stock: 50, height: 25, width: 30, weight: 800 },
  { id: 4, name: 'Dark Chocolate Orange', price: 680, category: 'Dark', description: 'Dark chocolate infused with real orange oil and candied orange peel. A classic combination.', image: 'https://img.freepik.com/free-photo/close-up-orange-chocolate_23-2148349245.jpg?w=400', inStock: true, stock: 50, height: 6, width: 12, weight: 200 },
  { id: 5, name: 'Milk Chocolate Almond Crunch', price: 550, category: 'Milk', description: 'Crunchy roasted almonds enveloped in smooth milk chocolate. A satisfying texture combination.', image: 'https://img.freepik.com/free-photo/milk-chocolate-almonds-crunch_23-2147908327.jpg?w=400', inStock: true, stock: 50, height: 1.5, width: 16, weight: 130 },
  { id: 6, name: 'Chocolate Lovers Hamper', price: 3500, category: 'Gift Hampers', description: 'The ultimate chocolate lover\'s gift! Includes 6 premium boxes, a chocolate bar, and a certificate.', image: 'https://img.freepik.com/free-photo/chocolate-christmas-concept_23-2147985555.jpg?w=400', inStock: true, stock: 50, height: 30, width: 25, weight: 1500 },
  { id: 7, name: 'White Chocolate Dream', price: 720, category: 'Milk', description: 'Creamy white chocolate infused with Madagascar vanilla and real strawberry pieces. A dreamy treat.', image: 'https://img.freepik.com/free-photo/white-chocolate-bar-isolated-white-background_23-2147908319.jpg?w=400', inStock: true, stock: 50, height: 1.5, width: 16, weight: 110 },
  { id: 8, name: 'Belgian Chocolate Collection', price: 1800, category: 'Dark', description: 'Imported Belgian chocolate collection with 12 handcrafted pralines. The epitome of chocolate luxury.', image: 'https://img.freepik.com/free-photo/sweet-chocolate-assortment-dark-board_23-2148553156.jpg?w=400', inStock: true, stock: 50, height: 5, width: 20, weight: 400 },
  { id: 9, name: 'Dark Chocolate Truffle Box', price: 950, category: 'Dark', description: 'Rich dark chocolate truffles dusted with cocoa powder. A luxurious indulgence.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlzqdLMNLWR1L8jVY3zUHmfeHP6rg2o9zU1RbutMgj2g&s=10', inStock: true, stock: 50, height: 10, width: 10, weight: 250 },
  { id: 10, name: 'Hazelnut Milk Chocolate Bar', price: 480, category: 'Milk', description: 'Creamy milk chocolate packed with crunchy hazelnut pieces. A perfect anytime treat.', image: 'https://img.freepik.com/free-photo/chocolate-bar-with-hazelnuts_23-2147908330.jpg?w=400', inStock: true, stock: 50, height: 1.5, width: 16, weight: 100 },
  { id: 11, name: 'Assorted Chocolate Box', price: 1200, category: 'Gift Hampers', description: 'A beautiful assortment of milk, dark, and white chocolates in a premium gift box.', image: 'https://img.freepik.com/free-photo/chocolate-box-with-assorted-truffles_23-2148553160.jpg?w=400', inStock: true, stock: 50, height: 8, width: 22, weight: 600 },
  { id: 12, name: 'Dark Chocolate Mint', price: 620, category: 'Dark', description: 'Refreshing mint-infused dark chocolate. Cool and sophisticated flavors.', image: 'https://img.freepik.com/free-photo/dark-chocolate-mint-candy_23-2148349240.jpg?w=400', inStock: true, stock: 50, height: 1.5, width: 16, weight: 120 },
  { id: 13, name: 'Milk Chocolate Caramel Crunch', price: 580, category: 'Milk', description: 'Smooth milk chocolate with a crunchy caramel center. A delightful texture contrast.', image: 'https://img.freepik.com/free-photo/milk-chocolate-caramel-bar_23-2147908325.jpg?w=400', inStock: true, stock: 50, height: 1.5, width: 16, weight: 115 },
  { id: 14, name: 'Luxury Chocolate Hamper', price: 4200, category: 'Gift Hampers', description: 'Ultimate luxury hamper with premium chocolates, truffles, and a handwritten note.', image: 'https://img.freepik.com/free-photo/luxury-chocolate-gift-box_23-2147985556.jpg?w=400', inStock: true, stock: 50, height: 35, width: 28, weight: 2000 },
  { id: 15, name: 'Dark Chocolate Sea Salt', price: 700, category: 'Dark', description: 'Premium dark chocolate sprinkled with Himalayan sea salt. A sweet-savory masterpiece.', image: 'https://img.freepik.com/free-photo/dark-chocolate-sea-salt_23-2148349248.jpg?w=400', inStock: true, stock: 50, height: 1.5, width: 16, weight: 110 },
  { id: 16, name: 'Strawberry White Chocolate', price: 750, category: 'Milk', description: 'Creamy white chocolate blended with real freeze-dried strawberries.', image: 'https://bitesbybianca.com/wp-content/uploads/2024/03/chick-strawberry-cover-1.jpg', inStock: true, stock: 50, height: 1.5, width: 16, weight: 120 },
  { id: 17, name: 'Corporate Gift Box', price: 3000, category: 'Gift Hampers', description: 'Elegant corporate gift box with a curated selection of premium chocolates.', image: 'https://img.freepik.com/free-photo/corporate-chocolate-gift-box_23-2147985558.jpg?w=400', inStock: true, stock: 50, height: 10, width: 25, weight: 750 },
  { id: 18, name: 'Chocolate Fondue Set', price: 1600, category: 'Dark', description: 'Complete chocolate fondue set with premium dark chocolate and dipping treats.', image: 'https://img.freepik.com/free-photo/chocolate-fondue-set_23-2148553165.jpg?w=400', inStock: true, stock: 50, height: 15, width: 20, weight: 500 },
];

const DEFAULT_CATEGORIES = [
  { value: 'Dark', label: 'Dark Chocolate' },
  { value: 'Milk', label: 'Milk Chocolate' },
  { value: 'Gift Hampers', label: 'Gift Hampers' }
];

const DEFAULT_SETTINGS = {
  logo: 'ChocoDelight BD',
  menu: ['Home', 'Shop', 'About', 'Contact'],
  footer: '42 Gulshan Avenue, Dhaka 1212, Bangladesh | +880 1712-345678 | hello@chocodelightbd.com | Sat-Thu: 9AM - 9PM',
  footerAddress: '42 Gulshan Avenue, Dhaka 1212, Bangladesh',
  footerPhone: '+880 1712-345678',
  footerEmail: 'hello@chocodelightbd.com',
  footerHours: 'Sat-Thu: 9AM - 9PM',
  footerQuickLinks: ['Home', 'Shop', 'About Us', 'Contact'],
  footerCategoryLinks: ['Dark Chocolate', 'Milk Chocolate', 'Gift Hampers', 'All Products'],
  footerFacebook: '#',
  footerInstagram: '#',
  footerYoutube: '#',
  footerWhatsapp: '#',
  home: {
    heroTitle: 'Premium Chocolates,<br><span>Crafted with Love</span>',
    heroDesc: 'Sweet Moments Delivered Across Bangladesh. Experience the finest handcrafted chocolates made from premium ingredients, perfect for every occasion.',
    featuredTitle: 'Our Best Sellers',
    featuredSubtitle: 'Handpicked premium chocolates loved by our customers',
    categoriesTitle: 'Shop by Category',
    categoriesSubtitle: 'Explore our range of exquisite chocolate collections',
    testimonialsTitle: 'What Our Customers Say',
    testimonialsSubtitle: 'Real reviews from chocolate lovers across Bangladesh',
    offerTag: 'Limited Time Offer',
    offerTitle: 'Summer Sale: 25% OFF',
    offerDesc: 'On all gift hampers and premium chocolate boxes. Use code <strong style="color: var(--accent);">CHOCO25</strong> at checkout. Valid until August 31, 2026.',
    newsletterTitle: 'Sweet Updates',
    newsletterDesc: 'Subscribe for exclusive offers, new arrivals, and chocolate tasting events in Bangladesh.'
  },
  shop: {
    shopTitle: 'Our Collection',
    shopDesc: 'Discover handcrafted premium chocolates for every occasion'
  },
  about: {
    aboutTitle: 'About ChocoDelight BD',
    aboutDesc: 'Our story of passion, quality, and sweet moments',
    aboutSectionTitle: 'Handcrafted with Passion',
    aboutPara1: '<strong>ChocoDelight BD</strong> was founded by <strong>Amina Begum</strong> with a simple vision: to bring world-class chocolate experiences to Bangladesh. What started as a small home kitchen experiment in Dhaka has grown into one of the country\'s most beloved chocolate brands.',
    aboutPara2: 'We use only the finest Belgian cocoa beans, pure dairy from local farms, and natural ingredients to create chocolates that rival international standards. Every piece is handcrafted with care by our expert chocolatiers.',
    aboutPara3: 'From our signature dark chocolate bars to elegant gift hampers, each product tells a story of passion, quality, and the rich flavors of Bangladesh.',
    aboutWhyTitle: 'Why Choose ChocoDelight BD?',
    aboutWhySubtitle: "We're committed to excellence in every bite"
  },
  contact: {
    contactTitle: 'Get in Touch',
    contactDesc: "We'd love to hear from you",
    contactFormTitle: 'Send Us a Message',
    contactLocationLabel: 'Our Location',
    contactLocationValue: '42 Gulshan Avenue, Dhaka 1212, Bangladesh',
    contactPhoneLabel: 'Phone',
    contactPhoneValue: '+880 1712-345678<br>+880 1987-654321',
    contactEmailLabel: 'Email',
    contactEmailValue: 'hello@chocodelightbd.com<br>orders@chocodelightbd.com',
    contactHoursLabel: 'Business Hours',
    contactHoursValue: 'Saturday - Thursday: 9:00 AM - 9:00 PM<br>Friday: Closed'
  }
};

let productsCache = null;
let settingsCache = null;

function getProducts() {
  if (productsCache) return productsCache;
  const data = localStorage.getItem(STORAGE_KEYS.products);
  console.log('[data.js] getProducts() - raw data from localStorage:', data);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (parsed.length < DEFAULT_PRODUCTS.length) {
          console.log('[data.js] Migrating products to new defaults');
          seedDefaultProducts();
          productsCache = null;
          return getProducts();
        }
        const defaultImageMap = {};
        DEFAULT_PRODUCTS.forEach(p => { defaultImageMap[p.id] = p.image; });
        let needsSave = false;
        parsed.forEach(p => {
          if (defaultImageMap[p.id] && p.image !== defaultImageMap[p.id]) {
            p.image = defaultImageMap[p.id];
            needsSave = true;
          }
          if (p.inStock === undefined) { p.inStock = true; needsSave = true; }
          if (p.stock === undefined) { p.stock = 50; needsSave = true; }
          if (p.metaTitle === undefined) { p.metaTitle = p.name; needsSave = true; }
          if (p.metaDesc === undefined) { p.metaDesc = p.description; needsSave = true; }
          if (p.metaKeywords === undefined) { p.metaKeywords = p.category + ' chocolate, chocolate Bangladesh'; needsSave = true; }
          if (p.weight === undefined) {
            p.weight = p.category === 'Gift Hampers' ? [600,800,1500,2000,750][p.id % 5] : p.name.toLowerCase().includes('bar') ? 120 : 250;
            p.height = p.category === 'Gift Hampers' ? 25 : p.name.toLowerCase().includes('bar') ? 1.5 : 10;
            p.width = p.category === 'Gift Hampers' ? 28 : p.name.toLowerCase().includes('bar') ? 16 : 15;
            needsSave = true;
          }
        });
        if (needsSave) {
          console.log('[data.js] Saving migrated product data');
          localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(parsed));
        }
        productsCache = parsed;
        return productsCache;
      }
    } catch (e) {
      console.error('[data.js] Failed to parse products from localStorage:', e);
    }
  }
  console.log('[data.js] No valid products found, seeding defaults');
  seedDefaultProducts();
  return getProducts();
}

function saveProducts(products) {
  console.log('[data.js] saveProducts() - saving:', JSON.stringify(products));
  productsCache = products;
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  console.log('[data.js] Products saved to localStorage under key: "' + STORAGE_KEYS.products + '"');
  dispatchProductsChanged();
}

function seedDefaultProducts() {
  console.log('[data.js] Seeding default products');
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
  productsCache = null;
}

const HOME_KEYS = ['heroTitle', 'heroDesc', 'featuredTitle', 'featuredSubtitle', 'categoriesTitle', 'categoriesSubtitle', 'testimonialsTitle', 'testimonialsSubtitle', 'offerTag', 'offerTitle', 'offerDesc', 'newsletterTitle', 'newsletterDesc'];
const SHOP_KEYS = ['shopTitle', 'shopDesc'];
const ABOUT_KEYS = ['aboutTitle', 'aboutDesc', 'aboutSectionTitle', 'aboutPara1', 'aboutPara2', 'aboutPara3', 'aboutWhyTitle', 'aboutWhySubtitle'];
const CONTACT_KEYS = ['contactTitle', 'contactDesc', 'contactFormTitle', 'contactLocationLabel', 'contactLocationValue', 'contactPhoneLabel', 'contactPhoneValue', 'contactEmailLabel', 'contactEmailValue', 'contactHoursLabel', 'contactHoursValue'];

function migrateSettings(settings) {
  if (settings.home && settings.shop && settings.about && settings.contact) {
    return settings;
  }
  const hasFlat = HOME_KEYS.some(k => settings[k] !== undefined) ||
                  SHOP_KEYS.some(k => settings[k] !== undefined) ||
                  ABOUT_KEYS.some(k => settings[k] !== undefined) ||
                  CONTACT_KEYS.some(k => settings[k] !== undefined);
  if (!hasFlat) return settings;

  const migrated = {
    logo: settings.logo || DEFAULT_SETTINGS.logo,
    menu: Array.isArray(settings.menu) ? settings.menu : DEFAULT_SETTINGS.menu,
    footer: settings.footer || DEFAULT_SETTINGS.footer,
    footerAddress: settings.footerAddress || DEFAULT_SETTINGS.footerAddress,
    footerPhone: settings.footerPhone || DEFAULT_SETTINGS.footerPhone,
    footerEmail: settings.footerEmail || DEFAULT_SETTINGS.footerEmail,
    footerHours: settings.footerHours || DEFAULT_SETTINGS.footerHours,
    footerQuickLinks: Array.isArray(settings.footerQuickLinks) ? settings.footerQuickLinks : DEFAULT_SETTINGS.footerQuickLinks,
    footerCategoryLinks: Array.isArray(settings.footerCategoryLinks) ? settings.footerCategoryLinks : DEFAULT_SETTINGS.footerCategoryLinks,
    footerFacebook: settings.footerFacebook || DEFAULT_SETTINGS.footerFacebook,
    footerInstagram: settings.footerInstagram || DEFAULT_SETTINGS.footerInstagram,
    footerYoutube: settings.footerYoutube || DEFAULT_SETTINGS.footerYoutube,
    footerWhatsapp: settings.footerWhatsapp || DEFAULT_SETTINGS.footerWhatsapp
  };
  const groups = { home: HOME_KEYS, shop: SHOP_KEYS, about: ABOUT_KEYS, contact: CONTACT_KEYS };
  Object.keys(groups).forEach(group => {
    migrated[group] = {};
    groups[group].forEach(key => {
      migrated[group][key] = settings[key] !== undefined ? settings[key] : DEFAULT_SETTINGS[group][key];
    });
  });
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(migrated));
  console.log('[data.js] Settings migrated from flat to nested:', JSON.stringify(migrated));
  return migrated;
}

function fillMissingDefaults(s) {
  const groups = ['home', 'shop', 'about', 'contact'];
  groups.forEach(group => {
    if (!s[group] || typeof s[group] !== 'object') {
      s[group] = { ...DEFAULT_SETTINGS[group] };
    } else {
      Object.keys(DEFAULT_SETTINGS[group]).forEach(key => {
        if (s[group][key] === undefined || s[group][key] === '') {
          s[group][key] = DEFAULT_SETTINGS[group][key];
        }
      });
    }
  });
  const footerFields = ['footerAddress', 'footerPhone', 'footerEmail', 'footerHours', 'footerQuickLinks', 'footerCategoryLinks', 'footerFacebook', 'footerInstagram', 'footerYoutube', 'footerWhatsapp'];
  footerFields.forEach(key => {
    if (s[key] === undefined || s[key] === '') {
      s[key] = DEFAULT_SETTINGS[key];
    }
    if ((key === 'footerQuickLinks' || key === 'footerCategoryLinks') && !Array.isArray(s[key])) {
      s[key] = DEFAULT_SETTINGS[key];
    }
  });
  return s;
}

function getSettings() {
  if (settingsCache) return settingsCache;
  const data = localStorage.getItem(STORAGE_KEYS.settings);
  console.log('[data.js] getSettings() - raw data from localStorage:', data);
  if (data) {
    try {
      let parsed = JSON.parse(data);
      if (parsed && parsed.logo) {
        parsed = migrateSettings(parsed);
        parsed = fillMissingDefaults(parsed);
        settingsCache = parsed;
        return settingsCache;
      }
    } catch (e) {
      console.error('[data.js] Failed to parse settings from localStorage:', e);
    }
  }
  console.log('[data.js] No valid settings found, seeding defaults');
  seedDefaultSettings();
  return getSettings();
}

function saveSettings(settings) {
  console.log('[data.js] saveSettings() - saving:', JSON.stringify(settings));
  settingsCache = settings;
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  console.log('[data.js] Settings saved to localStorage under key: "' + STORAGE_KEYS.settings + '"');
  dispatchSettingsChanged();
}

function seedDefaultSettings() {
  console.log('[data.js] Seeding default settings');
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
  settingsCache = null;
}

function getCategories() {
  const data = localStorage.getItem('categories');
  if (data) {
    try { return JSON.parse(data); } catch (e) { return DEFAULT_CATEGORIES; }
  }
  localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
}

function saveCategories(cats) {
  localStorage.setItem('categories', JSON.stringify(cats));
}

function getProductById(id) {
  return getProducts().find(p => p.id === Number(id));
}

function generateId() {
  const products = getProducts();
  const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
  return maxId + 1;
}

function labelToUrl(label) {
  const map = { 'Home': 'index.html' };
  return map[label] || label.toLowerCase().replace(/\s+/g, '-') + '.html';
}

function dispatchProductsChanged() {
  window.dispatchEvent(new CustomEvent('custom:productsChanged'));
}

function dispatchSettingsChanged() {
  window.dispatchEvent(new CustomEvent('custom:settingsChanged'));
}

function applySettings() {
  const s = getSettings();
  console.log('[data.js] applySettings() - applying:', JSON.stringify(s));

  const logoEls = document.querySelectorAll('[data-dynamic="logo"]');
  logoEls.forEach(el => { el.textContent = s.logo || 'ChocoDelight BD'; });

  const menuContainer = document.querySelector('[data-dynamic="menu"]');
  if (menuContainer) {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = Array.isArray(s.menu) ? s.menu : DEFAULT_SETTINGS.menu;
    menuContainer.innerHTML = menuItems.map(label => {
      const url = labelToUrl(label);
      const isActive = currentPath === url;
      return `<li><a href="${url}" class="${isActive ? 'active' : ''}">${label}</a></li>`;
    }).join('');
  }

  const footerEl = document.querySelector('[data-dynamic="footer"]');
  if (footerEl) footerEl.textContent = s.footer || '';

  const footerAddr = document.querySelector('[data-dynamic="footer-address"]');
  if (footerAddr) footerAddr.textContent = s.footerAddress || footerAddr.textContent;
  const footerPhone = document.querySelector('[data-dynamic="footer-phone"]');
  if (footerPhone) footerPhone.textContent = s.footerPhone || footerPhone.textContent;
  const footerEmail = document.querySelector('[data-dynamic="footer-email"]');
  if (footerEmail) footerEmail.textContent = s.footerEmail || footerEmail.textContent;
  const footerHours = document.querySelector('[data-dynamic="footer-hours"]');
  if (footerHours) footerHours.textContent = s.footerHours || footerHours.textContent;

  const socialMap = { facebook: 'footerFacebook', instagram: 'footerInstagram', youtube: 'footerYoutube', whatsapp: 'footerWhatsapp' };
  document.querySelectorAll('[data-dynamic^="footerSocial-"]').forEach(el => {
    const key = el.dataset.dynamic.replace('footerSocial-', '');
    const settingKey = socialMap[key];
    if (settingKey && s[settingKey]) el.href = s[settingKey];
  });

  const qlContainer = document.querySelector('[data-dynamic="footerQuickLinks"]');
  if (qlContainer) {
    const items = Array.isArray(s.footerQuickLinks) ? s.footerQuickLinks : ['Home','Shop','About Us','Contact'];
    const urlMap = { 'home': 'index.html', 'shop': 'shop.html', 'about us': 'about.html', 'contact': 'contact.html' };
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    qlContainer.innerHTML = items.map(label => {
      const slug = label.toLowerCase().replace(/[^a-z0-9]/g, '');
      const url = urlMap[slug] || (slug + '.html');
      const isActive = currentPath === url;
      return `<li><a href="${url}" class="${isActive ? 'active' : ''}">${label}</a></li>`;
    }).join('');
  }

  const catContainer = document.querySelector('[data-dynamic="footerCategoryLinks"]');
  if (catContainer) {
    const items = Array.isArray(s.footerCategoryLinks) ? s.footerCategoryLinks : ['Dark Chocolate','Milk Chocolate','Gift Hampers','All Products'];
    const cats = typeof getCategories === 'function' ? getCategories() : [];
    catContainer.innerHTML = items.map(label => {
      const isAll = label.toLowerCase() === 'all products';
      const matched = cats.find(c => c.label.toLowerCase() === label.toLowerCase());
      const href = isAll ? 'shop.html' : (matched ? 'shop.html?category=' + encodeURIComponent(matched.value) : 'shop.html?category=' + encodeURIComponent(label));
      return `<li><a href="${href}">${label}</a></li>`;
    }).join('');
  }

  const catGrid = document.querySelector('[data-dynamic="categories"]');
  if (catGrid) {
    const cats = typeof getCategories === 'function' ? getCategories() : [];
    const emojis = ['🍫','🍬','🎁'];
    const descs = ['Rich & Intense','Smooth & Creamy','Perfect for Gifting'];
    catGrid.innerHTML = cats.map((c, i) => {
      const idx = i % emojis.length;
      const cls = c.value.toLowerCase().replace(/[^a-z]/g, '');
      return `<a href="shop.html?category=${encodeURIComponent(c.value)}" class="category-card fade-in">
        <div class="category-bg ${cls}">${emojis[idx]}<h3>${c.label}</h3><p>${descs[idx]}</p></div>
        <div class="category-overlay"></div>
      </a>`;
    }).join('');
  }

  const copyrightEl = document.querySelector('[data-dynamic="copyright"]');
  if (copyrightEl) {
    copyrightEl.innerHTML = copyrightEl.innerHTML.replace(/\d{4}/, new Date().getFullYear());
  }

  const flatLookup = {};
  ['home', 'shop', 'about', 'contact'].forEach(group => {
    if (s[group] && typeof s[group] === 'object') {
      Object.keys(s[group]).forEach(key => { flatLookup[key] = s[group][key]; });
    }
  });

  document.querySelectorAll('[data-dynamic]').forEach(el => {
    const key = el.dataset.dynamic;
    if (['logo','menu','footer','footer-address','footer-phone','footer-email','footer-hours','footerQuickLinks','footerCategoryLinks','copyright','categories'].includes(key) || key.startsWith('footerSocial-')) return;
    if (flatLookup[key] !== undefined) {
      el.innerHTML = flatLookup[key] || el.innerHTML;
    }
  });
}

function formatBDT(amount) {
  return 'BDT ' + Number(amount).toLocaleString('en-BD');
}

window.addEventListener('storage', (e) => {
  console.log('[data.js] storage event detected - key:', e.key, 'newValue:', e.newValue);
  if (e.key === STORAGE_KEYS.products) {
    productsCache = null;
    dispatchProductsChanged();
  }
  if (e.key === STORAGE_KEYS.settings) {
    settingsCache = null;
    dispatchSettingsChanged();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const existingProducts = localStorage.getItem(STORAGE_KEYS.products);
  const existingSettings = localStorage.getItem(STORAGE_KEYS.settings);
  console.log('[data.js] DOMContentLoaded - existing products:', existingProducts ? 'found' : 'not found');
  console.log('[data.js] DOMContentLoaded - existing settings:', existingSettings ? 'found' : 'not found');
  if (!existingProducts) seedDefaultProducts();
  if (!existingSettings) seedDefaultSettings();
});
