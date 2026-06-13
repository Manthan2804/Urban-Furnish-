const studyProducts = [
  { name: 'Study Table', brand: 'Urban Living', price: 499, img: 'study.jpg' },
  { name: 'Office Chair', brand: 'HomeStyle', price: 699, img: 'study.jpg' },
  { name: 'Bookshelf', brand: 'FurniCo', price: 399, img: 'sofa.jpg' },
  { name: 'Desk Lamp', brand: 'Urban Living', price: 199, img: 'study.jpg' },
  { name: 'Laptop Table', brand: 'HomeStyle', price: 299, img: 'study.jpg' },
  { name: 'Filing Cabinet', brand: 'FurniCo', price: 349, img: 'wardrobe.jpg' },
  { name: 'Whiteboard', brand: 'Urban Living', price: 249, img: 'study.jpg' },
  { name: 'Drawer Unit', brand: 'HomeStyle', price: 399, img: 'study.jpg' },
  { name: 'Kids Study Set', brand: 'FurniCo', price: 599, img: 'study.jpg' },
  { name: 'Reading Lamp', brand: 'Urban Living', price: 149, img: 'study.jpg' }
];

function renderStudyProducts(products) {
  const grid = document.getElementById('studyProducts');
  grid.innerHTML = '';
  products.forEach(prod => {
    const imageUrl = getStudyImage(prod.name);
    grid.innerHTML += `<div class="product-card">
      <img src="${imageUrl}" alt="${prod.name}" loading="lazy">
      <h3>${prod.name}</h3>
      <p>Brand: ${prod.brand}</p>
      <p>₹${prod.price}/month</p>
    </div>`;
  });
}

function getStudyImage(productName) {
  const imageMap = {
    'Study Table': 'img33.jpg',
    'Office Chair': 'img27.webp',
    'Bookshelf': 'https://images-cdn.ubuy.co.in/63dc07eb2c44894dcb46d125-tree-bookshelf-9-tier-geometric-tree.jpg',
    'Desk Lamp': 'img28.jpg',
    'Laptop Table': 'img29.webp',
    'Filing Cabinet': 'img30.jpg',
    'Whiteboard': 'img31.jpg',
    'Drawer Unit': 'img32.webp',
    'Kids Study Set': 'img33.jpg',
    'Reading Lamp': 'img34.webp'
  };
  return imageMap[productName] || 'https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=200&fit=crop';
}

function filterStudyProducts() {
  const brand = document.getElementById('brandFilter').value;
  const price = document.getElementById('priceFilter').value;
  let filtered = studyProducts;
  if (brand) filtered = filtered.filter(p => p.brand === brand);
  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  renderStudyProducts(filtered);
}

document.getElementById('brandFilter').addEventListener('change', filterStudyProducts);
document.getElementById('priceFilter').addEventListener('change', filterStudyProducts);
window.onload = () => renderStudyProducts(studyProducts);
