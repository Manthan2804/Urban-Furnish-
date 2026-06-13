const storageProducts = [
  { name: '2-Door Wardrobe', brand: 'Urban Living', price: 899, img: 'wardrobe.jpg', color: 'Walnut', material: 'Laminate' },
  { name: '3-Door Wardrobe', brand: 'HomeStyle', price: 1199, img: 'wardrobe.jpg', color: 'Birch', material: 'Laminate' },
  { name: 'Shoe Rack', brand: 'FurniCo', price: 499, img: 'wardrobe.jpg', color: 'Brown', material: 'Wood' },
  { name: 'Bookshelf', brand: 'Urban Living', price: 599, img: 'sofa.jpg', color: 'Oak', material: 'Wood' },
  { name: 'Chest of Drawers', brand: 'HomeStyle', price: 699, img: 'wardrobe.jpg', color: 'Teak', material: 'Wood' },
  { name: 'Storage Box', brand: 'FurniCo', price: 299, img: 'wardrobe.jpg', color: 'Grey', material: 'Plastic' },
  { name: 'Closet Organizer', brand: 'Urban Living', price: 399, img: 'wardrobe.jpg', color: 'White', material: 'Fabric' },
  { name: 'Filing Cabinet', brand: 'HomeStyle', price: 499, img: 'wardrobe.jpg', color: 'Black', material: 'Metal' },
  { name: 'Plastic Storage', brand: 'FurniCo', price: 199, img: 'wardrobe.jpg', color: 'Blue', material: 'Plastic' },
  { name: 'Metal Rack', brand: 'Urban Living', price: 599, img: 'wardrobe.jpg', color: 'Silver', material: 'Metal' }
];

function renderStorageProducts(products) {
  const grid = document.getElementById('storageProducts');
  grid.innerHTML = '';
  products.forEach(prod => {
    const imageUrl = getStorageImage(prod.name);
    grid.innerHTML += `<div class="product-card">
      <img src="${imageUrl}" alt="${prod.name}" loading="lazy">
      <h3>${prod.name}</h3>
      <p>Brand: ${prod.brand}</p>
      <p>Color: ${prod.color}</p>
      <p>Material: ${prod.material}</p>
      <div class="price">₹${prod.price}/month</div>
    </div>`;
  });
}

function getStorageImage(productName) {
  const imageMap = {
    '2-Door Wardrobe': 'amirah1.webp',
    '3-Door Wardrobe': 'img18.webp',
    'Shoe Rack': 'img19.jpg',
    'Bookshelf': 'img20.jpg',
    'Chest of Drawers': 'img21.webp',
    'Storage Box': 'img22.webp',
    'Closet Organizer': 'img23.jpg',
    'Filing Cabinet': 'img24.webp',
    'Plastic Storage': 'img25.webp',
    'Metal Rack': 'img26.jpg'
  };
  return imageMap[productName] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop';
}

function filterStorageProducts() {
  const brand = document.getElementById('brandFilter').value;
  const price = document.getElementById('priceFilter').value;
  let filtered = storageProducts;
  if (brand) filtered = filtered.filter(p => p.brand === brand);
  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  renderStorageProducts(filtered);
}

document.getElementById('brandFilter').addEventListener('change', filterStorageProducts);
document.getElementById('priceFilter').addEventListener('change', filterStorageProducts);
window.onload = () => renderStorageProducts(storageProducts);
