// shop.js
// Sample Products Data
const productsData = [
  // T-Shirts
  {
    id: 1,
    name: "StepUnity Crew T-Shirt Black",
    category: "T-shirts",
    price: 799,
    discountedPrice: 599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    description: "Premium cotton t-shirt with StepUnity logo",
    stock: 50
  },
  {
    id: 2,
    name: "Hip-Hop Dance Tee",
    category: "T-shirts",
    price: 899,
    discountedPrice: 699,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80",
    description: "Comfortable oversized fit for dancers",
    stock: 35
  },
  {
    id: 3,
    name: "Folk Dance Collection Tee",
    category: "T-shirts",
    price: 749,
    discountedPrice: 549,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
    description: "Ethnic design inspired by folk traditions",
    stock: 40
  },
  {
    id: 4,
    name: "Unity Squad T-Shirt White",
    category: "T-shirts",
    price: 799,
    discountedPrice: 599,
    image: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&q=80",
    description: "Classic white tee with crew branding",
    stock: 60
  },

  // Shoes
  {
    id: 5,
    name: "Professional Dance Sneakers",
    category: "Shoes",
    price: 3499,
    discountedPrice: 2799,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    description: "Lightweight sneakers perfect for hip-hop",
    stock: 25
  },
  {
    id: 6,
    name: "Classic Canvas Dance Shoes",
    category: "Shoes",
    price: 2499,
    discountedPrice: 1999,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
    description: "Flexible canvas shoes for all dance styles",
    stock: 30
  },
  {
    id: 7,
    name: "High-Top Street Dancers",
    category: "Shoes",
    price: 4299,
    discountedPrice: 3499,
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&q=80",
    description: "Ankle support for intense dance moves",
    stock: 20
  },
  {
    id: 8,
    name: "Jazz Dance Boots",
    category: "Shoes",
    price: 3999,
    discountedPrice: 3199,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&q=80",
    description: "Premium leather boots for stage performance",
    stock: 15
  },

  // Chains
  {
    id: 9,
    name: "Hip-Hop Gold Chain",
    category: "Chains",
    price: 1299,
    discountedPrice: 999,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
    description: "Stylish gold-plated chain for performers",
    stock: 45
  },
  {
    id: 10,
    name: "Silver Dance Pendant Chain",
    category: "Chains",
    price: 1499,
    discountedPrice: 1199,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    description: "Elegant silver chain with dance motif",
    stock: 35
  },
  {
    id: 11,
    name: "Chunky Street Style Chain",
    category: "Chains",
    price: 1799,
    discountedPrice: 1399,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80",
    description: "Bold chain for street dance aesthetic",
    stock: 30
  },
  {
    id: 12,
    name: "Minimalist Crew Chain",
    category: "Chains",
    price: 999,
    discountedPrice: 799,
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&q=80",
    description: "Simple yet elegant chain for daily wear",
    stock: 50
  },

  // Accessories
  {
    id: 13,
    name: "Dance Crew Cap",
    category: "Accessories",
    price: 599,
    discountedPrice: 449,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80",
    description: "Snapback cap with embroidered logo",
    stock: 70
  },
  {
    id: 14,
    name: "Sweat Wristbands Set",
    category: "Accessories",
    price: 299,
    discountedPrice: 199,
    image: "https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=400&q=80",
    description: "Pack of 2 moisture-wicking wristbands",
    stock: 100
  },
  {
    id: 15,
    name: "Dance Crew Backpack",
    category: "Accessories",
    price: 1999,
    discountedPrice: 1599,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    description: "Spacious backpack for dance gear",
    stock: 40
  },
  {
    id: 16,
    name: "Performance Headband",
    category: "Accessories",
    price: 399,
    discountedPrice: 299,
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&q=80",
    description: "Non-slip headband for practice",
    stock: 80
  }
];

let cart = JSON.parse(localStorage.getItem('stepunityCart')) || [];
let filteredProducts = [...productsData];

// Check if user is a member
function checkMembership() {
  const token = localStorage.getItem('token');
  // In real scenario, you'd verify with backend
  // For now, just check if token exists
  return !!token;
}

// Load products
function loadProducts() {
  const isMember = checkMembership();
  
  if (isMember) {
    document.getElementById('memberBadge').style.display = 'block';
  }

  displayProducts(filteredProducts, isMember);
  updateCartUI();
}

// Display products
function displayProducts(products, isMember = false) {
  const container = document.getElementById('productsContainer');
  
  if (products.length === 0) {
    container.innerHTML = '<p class="no-products">No products found</p>';
    document.getElementById('resultsCount').textContent = 'No products found';
    return;
  }

  document.getElementById('resultsCount').textContent = `Showing ${products.length} products`;

  container.innerHTML = products.map(product => {
    const finalPrice = isMember ? product.discountedPrice : product.price;
    const savings = product.price - product.discountedPrice;

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          ${isMember ? '<span class="member-badge-small">Member Price</span>' : ''}
          ${product.stock < 20 ? '<span class="low-stock-badge">Low Stock</span>' : ''}
        </div>
        <div class="product-details">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">
            ${isMember && savings > 0 ? 
              `<span class="original-price">₹${product.price}</span>
               <span class="discounted-price">₹${finalPrice}</span>
               <span class="savings">Save ₹${savings}</span>` :
              `<span class="price">₹${finalPrice}</span>`
            }
          </div>
          <div class="product-actions">
            <button class="btn-add-cart" onclick="addToCart(${product.id})">
              Add to Cart
            </button>
            <button class="btn-buy-now" onclick="buyNow(${product.id})">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Filter products
function filterProducts() {
  const category = document.querySelector('input[name="category"]:checked').value;
  const priceRange = document.querySelector('input[name="price"]:checked').value;

  filteredProducts = productsData.filter(product => {
    // Category filter
    if (category !== 'all' && product.category !== category) {
      return false;
    }

    // Price filter
    if (priceRange !== 'all') {
      const price = product.discountedPrice;
      if (priceRange === '0-1000' && price >= 1000) return false;
      if (priceRange === '1000-2500' && (price < 1000 || price >= 2500)) return false;
      if (priceRange === '2500-5000' && (price < 2500 || price >= 5000)) return false;
      if (priceRange === '5000+' && price < 5000) return false;
    }

    return true;
  });

  sortProducts();
}

// Sort products
function sortProducts() {
  const sortValue = document.getElementById('sortSelect').value;

  switch(sortValue) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      filteredProducts = [...productsData];
      filterProducts();
      return;
  }

  displayProducts(filteredProducts, checkMembership());
}

// Clear filters
function clearFilters() {
  document.querySelector('input[name="category"][value="all"]').checked = true;
  document.querySelector('input[name="price"][value="all"]').checked = true;
  document.getElementById('sortSelect').value = 'default';
  filteredProducts = [...productsData];
  displayProducts(filteredProducts, checkMembership());
}

// Add to cart
function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      finalPrice: checkMembership() ? product.discountedPrice : product.price
    });
  }

  localStorage.setItem('stepunityCart', JSON.stringify(cart));
  updateCartUI();
  showNotification('Added to cart!');
}

// Update cart UI
function updateCartUI() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cartCount').textContent = cartCount;

  const cartItemsContainer = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    document.getElementById('cartTotal').textContent = '₹0';
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>₹${item.finalPrice}</p>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = `₹${total.toLocaleString()}`;
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  
  if (item) {
    item.quantity += change;
    
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      localStorage.setItem('stepunityCart', JSON.stringify(cart));
      updateCartUI();
    }
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('stepunityCart', JSON.stringify(cart));
  updateCartUI();
  showNotification('Removed from cart');
}

// Toggle cart sidebar
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Buy now
function buyNow(productId) {
  addToCart(productId);
  toggleCart();
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  alert(`Checkout functionality coming soon!\n\nTotal: ₹${total.toLocaleString()}`);
  
  // Clear cart after checkout
  // cart = [];
  // localStorage.removeItem('stepunityCart');
  // updateCartUI();
  // toggleCart();
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);
