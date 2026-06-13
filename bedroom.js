const bedroomProducts = [
  { name: 'Queen Size Bed', brand: 'Urban Living', price: 1299, img: 'bed.png', color: 'Walnut', material: 'Wood + Upholstery' },
  { name: 'King Size Bed', brand: 'HomeStyle', price: 1499, img: 'bed.png', color: 'Oak', material: 'Solid Wood' },
  { name: 'Single Bed', brand: 'FurniCo', price: 799, img: 'bed.png', color: 'White', material: 'Engineered Wood' },
  { name: 'Bunk Bed', brand: 'Urban Living', price: 999, img: 'bed.png', color: 'Pine', material: 'Solid Wood' },
  { name: 'Mattress', brand: 'HomeStyle', price: 499, img: 'bed.png', color: 'White', material: 'Memory Foam' },
  { name: 'Bedside Table', brand: 'FurniCo', price: 299, img: 'bed.png', color: 'Teak', material: 'Wood' },
  { name: 'Wardrobe', brand: 'Urban Living', price: 999, img: 'wardrobe.jpg', color: 'Brown', material: 'Laminate' },
  { name: 'Dresser', brand: 'HomeStyle', price: 799, img: 'bed.png', color: 'Espresso', material: 'Wood' },
  { name: 'Nightstand', brand: 'FurniCo', price: 399, img: 'bed.png', color: 'Grey', material: 'MDF' },
  { name: 'Kids Bed', brand: 'Urban Living', price: 899, img: 'bed.png', color: 'Blue', material: 'Plywood' }
];

function renderBedroomProducts(products) {
  const grid = document.getElementById('bedroomProducts');
  grid.innerHTML = '';
  products.forEach(prod => {
    const imageUrl = getBedroomImage(prod.name);
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

function getBedroomImage(productName) {
  const imageMap = {
    'Queen Size Bed': 'img9.jpg',
    'King Size Bed': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop',
    'Single Bed': 'img10.jpg',
    'Bunk Bed': 'img11.webp',
    'Mattress': 'img12.jpg',
    'Bedside Table': 'img13.jpg',
    'Wardrobe': 'img18.webp',
    'Dresser': 'img15.avif',
    'Nightstand': 'img16.jpg',
    'Kids Bed': 'img17.avif'
  };
  return imageMap[productName] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=200&fit=crop';
}

function filterBedroomProducts() {
  const brand = document.getElementById('brandFilter').value;
  const price = document.getElementById('priceFilter').value;
  let filtered = bedroomProducts;
  if (brand) filtered = filtered.filter(p => p.brand === brand);
  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  renderBedroomProducts(filtered);
}

document.getElementById('brandFilter').addEventListener('change', filterBedroomProducts);
document.getElementById('priceFilter').addEventListener('change', filterBedroomProducts);
window.onload = () => renderBedroomProducts(bedroomProducts);
