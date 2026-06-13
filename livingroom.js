const livingroomProducts = [
  { name: 'Classic Sofa', brand: 'Urban Living', price: 499, img: 'sofa.jpg', color: 'Grey', material: 'Fabric', rating: 5 },
  { name: 'Modern Sectional', brand: 'HomeStyle', price: 899, img: 'sofa.jpg', color: 'Blue', material: 'Leather', rating: 4 },
  { name: 'Recliner Chair', brand: 'FurniCo', price: 599, img: 'sofa.jpg', color: 'Brown', material: 'Leather', rating: 4 },
  { name: 'Lounge Bean Bag', brand: 'Urban Living', price: 299, img: 'beanbag.avif', color: 'Beige', material: 'Fabric', rating: 3 },
  { name: 'Ottoman Set', brand: 'HomeStyle', price: 399, img: 'sofa.jpg', color: 'Grey', material: 'Fabric', rating: 5 },
  { name: 'Wooden Coffee Table', brand: 'FurniCo', price: 349, img: 'table1.jpg', color: 'Brown', material: 'Wood', rating: 4 },
  { name: 'TV Stand', brand: 'Urban Living', price: 499, img: 'sofa.jpg', color: 'Brown', material: 'Wood', rating: 3 },
  { name: 'Accent Chair', brand: 'HomeStyle', price: 399, img: 'sofa.jpg', color: 'Blue', material: 'Fabric', rating: 5 },
  { name: 'Bookshelf', brand: 'FurniCo', price: 599, img: 'sofa.jpg', color: 'Beige', material: 'Wood', rating: 4 },
  { name: 'Corner Sofa', brand: 'Urban Living', price: 999, img: 'sofa.jpg', color: 'Grey', material: 'Leather', rating: 5 }
];

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += `<i class='fa${i <= rating ? 's' : 'r'} fa-star' style='color:#088178;'></i>`;
  }
  return stars;
}

function renderLivingroomProducts(products) {
  const grid = document.getElementById('livingroomProducts');
  grid.innerHTML = '';
  products.forEach(prod => {
    const imageUrl = getProductImage(prod.name);
    grid.innerHTML += `<div class="product-card">
      <img src="${imageUrl}" alt="${prod.name}" loading="lazy">
      <h3>${prod.name}</h3>
      <p>Brand: ${prod.brand}</p>
      <p>Color: ${prod.color}</p>
      <p>Material: ${prod.material}</p>
      <div>Rating: ${renderStars(prod.rating)}</div>
      <div class="price">₹${prod.price}/month</div>
    </div>`;
  });
}

function getProductImage(productName) {
  const imageMap = {
    'Classic Sofa': 'sofa.jpg',
    'Modern Sectional': 'img1.jpg',
    'Recliner Chair': 'img2.jpg',
    'Lounge Bean Bag': 'beanbag.avif',
    'Ottoman Set': 'img3.webp',
    'Wooden Coffee Table': 'img4.webp',
    'TV Stand': 'img5.jpg',
    'Accent Chair': 'img6.webp',
    'Bookshelf': 'img7.webp',
    'Corner Sofa': 'img8.jpg'
  };
  return imageMap[productName] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop';
}


function filterLivingroomProducts() {
  const brand = document.getElementById('brandFilter').value;
  const price = document.getElementById('priceFilter').value;
  let filtered = livingroomProducts;
  if (brand) filtered = filtered.filter(p => p.brand === brand);
  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  renderLivingroomProducts(filtered);
}

document.getElementById('brandFilter').addEventListener('change', filterLivingroomProducts);
document.getElementById('priceFilter').addEventListener('change', filterLivingroomProducts);

window.onload = () => {
  renderLivingroomProducts(livingroomProducts);
};
