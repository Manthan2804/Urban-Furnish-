const appliancesProducts = [
  { name: 'Microwave Oven', brand: 'Urban Living', price: 599, img: 'app.png', color: 'Black', material: 'Metal + Glass' },
  { name: 'Refrigerator', brand: 'HomeStyle', price: 999, img: 'app.png', color: 'Silver', material: 'Steel' },
  { name: 'Washing Machine', brand: 'FurniCo', price: 899, img: 'app.png', color: 'White', material: 'Steel + Plastic' },
  { name: 'Air Conditioner', brand: 'Urban Living', price: 1499, img: 'app.png', color: 'White', material: 'Plastic' },
  { name: 'Water Purifier', brand: 'HomeStyle', price: 499, img: 'app.png', color: 'Blue/White', material: 'Plastic' },
  { name: 'Vacuum Cleaner', brand: 'FurniCo', price: 399, img: 'app.png', color: 'Red', material: 'Plastic' },
  { name: 'Geyser', brand: 'Urban Living', price: 699, img: 'app.png', color: 'White', material: 'Metal' },
  { name: 'Mixer Grinder', brand: 'HomeStyle', price: 299, img: 'app.png', color: 'White', material: 'Plastic + Steel' },
  { name: 'Induction Cooktop', brand: 'FurniCo', price: 299, img: 'app.png', color: 'Black', material: 'Glass' },
  { name: 'Fan', brand: 'Urban Living', price: 199, img: 'app.png', color: 'Brown', material: 'Metal' }
];

function renderAppliancesProducts(products) {
  const grid = document.getElementById('appliancesProducts');
  grid.innerHTML = '';
  products.forEach(prod => {
    const imageUrl = getApplianceImage(prod.name);
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

function getApplianceImage(productName) {
  const imageMap = {
    'Microwave Oven': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=200&fit=crop',
    'Refrigerator': 'https://kaydeeelectronics.in/cdn/shop/files/untitled-design-59-66e410cc229bf.webp?v=1726222584&width=1946',
    'Washing Machine': 'https://media3.bsh-group.com/Product_Shots/5120x/25114476_WAJ24209IN_PGA4_def.webp',
    'Air Conditioner': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDUHR8Rib-Uwrwx7pc3BlAZOY2sP-JgiBbIg&s',
    'Water Purifier': 'https://m.media-amazon.com/images/I/71bmk7NQKkL._UF1000,1000_QL80_.jpg',
    'Vacuum Cleaner': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMYS0UpiGWrRsQr_ATzTbBWtPLXo_7WxRQoA&s',
    'Geyser': 'https://superiorsolar.co.in/wp-content/uploads/2023/08/Electrical-Geyser.png',
    'Mixer Grinder': 'https://m.media-amazon.com/images/I/71mL2bdyRdL._UF894,1000_QL80_.jpg',
    'Induction Cooktop': 'https://glenindia.com/cdn/shop/products/1_86730cd7-ee2b-43a4-b928-2befdfc4e64c_1200x1200.jpg?v=1664182290',
    'Fan': 'https://vguard.com/cdn/shop/files/0_c5ed2333-fe30-43c6-b1e4-9160b5ce2575.jpg?v=1752563855'
  };
  return imageMap[productName] || 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=200&fit=crop';
}

function filterAppliancesProducts() {
  const brand = document.getElementById('brandFilter').value;
  const price = document.getElementById('priceFilter').value;
  let filtered = appliancesProducts;
  if (brand) filtered = filtered.filter(p => p.brand === brand);
  if (price) {
    const [min, max] = price.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  renderAppliancesProducts(filtered);
}

document.getElementById('brandFilter').addEventListener('change', filterAppliancesProducts);
document.getElementById('priceFilter').addEventListener('change', filterAppliancesProducts);
window.onload = () => renderAppliancesProducts(appliancesProducts);
