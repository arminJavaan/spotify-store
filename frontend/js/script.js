// frontend/js/script.js

const API_BASE_URL = 'http://localhost:5000/api';

// ۱. تابع عمومی برای فراخوانی API با JWT (اگر نیاز به توکن باشد)
async function apiFetch(endpoint, method = 'GET', body = null, authRequired = false) {
  const headers = { 'Content-Type': 'application/json' };

  if (authRequired) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('کاربر لاگین نیست');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }
  const options = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) {
    const message = data.msg || data.error || 'خطا در ارتباط با سرور';
    throw new Error(message);
  }
  return data;
}


async function loadProductsOnPage() {
  try {
    const productsGrid = document.getElementById('productsGrid');
    // ● واکشی محصولات از سرور
    const products = await apiFetch('/products');

    // ● اگر نمی‌خواهید لوگوی واقعی نشان دهید، می‌توانید حالت placeholder یا emoji قرار دهید
    productsGrid.innerHTML = products.map(prod => `
      <div class="product-card bg-[#212121] text-[#b3b3b3] rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:shadow-2xl hover:scale-105 animate-fadeIn slide-in">
        <div class="h-40 flex items-center justify-center bg-[#121212]">
          <img src="${prod.logoUrl}" alt="${prod.name}" class="h-16 w-16 object-contain" />
        </div>
        <div class="p-4 space-y-2">
          <h3 class="text-lg font-semibold text-[#1db954]">${prod.name}</h3>
          <p class="text-[#b3b3b3] text-sm leading-relaxed">${prod.description}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-[#1db954] font-bold">${Number(prod.price).toLocaleString('fa-IR')} تومان</span>
            <button onclick="addToCart('${prod._id}')" class="px-3 py-1 bg-[#1db954] text-[#121212] rounded hover:bg-[#148c3c] transition duration-200">افزودن به سبد</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    alert('خطا در بارگذاری محصولات: ' + err.message);
  }
}

// ======= بخش سبد خرید =======

// ۳. تابع برای افزودن کالا به سبد
async function addToCart(productId) {
  try {
    await apiFetch('/cart', 'POST', { productId }, true);
    // بعد از افزودن، می‌توان تعداد آیتم‌ها در سبد را بروز کرد یا اعلان ساده داد
    updateCartCount();
    // انیمیشن ساده
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.classList.add('scale-110');
    setTimeout(() => cartIcon.classList.remove('scale-110'), 200);
  } catch (err) {
    if (err.message === 'کاربر لاگین نیست') {
      // اگر لاگین نیست، به صفحه ورود هدایت شود
      window.location.href = 'login.html';
    } else {
      alert('خطا در افزودن به سبد: ' + err.message);
    }
  }
}

// ۴. تابع برای دریافت سبد و نمایش تعداد اجمالی (در header)
async function updateCartCount() {
  try {
    const cart = await apiFetch('/cart', 'GET', null, true);
    const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const cartCountSpan = document.getElementById('cartCount');
    if (cartCountSpan) cartCountSpan.textContent = count;
  } catch {
    // اگر خطا باشد (مثلاً لاگین نکرده)، تعداد صفر بنویسید
    const cartCountSpan = document.getElementById('cartCount');
    if (cartCountSpan) cartCountSpan.textContent = '0';
  }
}

// ۵. تابع برای نمایش آیتم‌های سبد در صفحه cart.html
async function loadCartPage() {
  try {
    const cartContainer = document.getElementById('cartItems');
    const cart = await apiFetch('/cart', 'GET', null, true);
    if (!cart.items.length) {
      cartContainer.innerHTML = `
        <div class="text-center text-[#b3b3b3] py-10">
          <p>سبد خرید شما خالی است.</p>
          <a href="products.html" class="mt-4 inline-block px-4 py-2 bg-[#1db954] text-[#121212] rounded hover:bg-[#148c3c] transition">مشاهده محصولات</a>
        </div>`;
      document.getElementById('cartTotalSection').classList.add('hidden');
      return;
    }

    // جدول یا لیست سبد
    cartContainer.innerHTML = cart.items.map(item => `
      <div class="flex justify-between items-center bg-[#212121] rounded-lg p-4 mb-4 animate-slideIn">
        <div class="flex items-center space-x-4">
          <img src="${item.product.logoUrl}" alt="${item.product.name}" class="h-12 w-12 object-contain rounded" />
          <div>
            <h4 class="text-[#1db954] font-semibold">${item.product.name}</h4>
            <p class="text-[#b3b3b3] text-sm">قیمت واحد: ${Number(item.product.price).toLocaleString('fa-IR')} تومان</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})" class="px-2 py-1 bg-[#535353] text-[#b3b3b3] rounded hover:bg-[#444] transition">-</button>
          <span class="text-[#b3b3b3]">${item.quantity}</span>
          <button onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})" class="px-2 py-1 bg-[#535353] text-[#b3b3b3] rounded hover:bg-[#444] transition">+</button>
          <button onclick="removeFromCart('${item.product._id}')" class="px-2 py-1 bg-[#ff4757] text-white rounded hover:bg-[#e04354] transition">حذف</button>
        </div>
      </div>
    `).join('');

    // به‌روزرسانی مبلغ کل
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    document.getElementById('totalAmount').textContent = Number(total).toLocaleString('fa-IR');
    document.getElementById('cartTotalSection').classList.remove('hidden');
  } catch (err) {
    if (err.message === 'کاربر لاگین نیست') {
      window.location.href = 'login.html';
    } else {
      console.error(err);
      alert('خطا در بارگذاری سبد: ' + err.message);
    }
  }
}

// ۶. به‌روزرسانی تعداد یک آیتم (PUT)
async function updateQuantity(productId, newQuantity) {
  try {
    await apiFetch('/cart', 'PUT', { productId, quantity: newQuantity }, true);
    loadCartPage();
    updateCartCount();
  } catch (err) {
    console.error(err);
    alert('خطا در به‌روزرسانی تعداد: ' + err.message);
  }
}

// ۷. حذف از سبد (DELETE)
async function removeFromCart(productId) {
  try {
    await apiFetch(`/cart/${productId}`, 'DELETE', null, true);
    loadCartPage();
    updateCartCount();
  } catch (err) {
    console.error(err);
    alert('خطا در حذف آیتم: ' + err.message);
  }
}

// ======= بخش ثبت‌نام و ورود =======

// ۸. تابع ثبت‌نام (login.html – form ثبت‌نام)
async function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  try {
    const res = await apiFetch('/auth/register', 'POST', { name, email, password });
    localStorage.setItem('token', res.token);
    window.location.href = 'products.html';
  } catch (err) {
    alert('خطا در ثبت‌نام: ' + err.message);
  }
}

// ۹. تابع ورود (login.html – form ورود)
async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await apiFetch('/auth/login', 'POST', { email, password });
    localStorage.setItem('token', res.token);
    window.location.href = 'products.html';
  } catch (err) {
    alert('خطا در ورود: ' + err.message);
  }
}

// ======= بخش پرداخت (checkout.html) =======

// ۱۰. تابع برای بارگذاری محتویات Checkout و چک کردن لاگین
async function loadCheckoutPage() {
  // اگر توکن نداشته باشد کاربر لاگین نیست → به صفحه ورود هدایت شود
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // دریافت سبد فعلی
  let cart;
  try {
    cart = await apiFetch('/cart', 'GET', null, true);
  } catch (err) {
    console.error(err);
    alert('خطا در بارگذاری اطلاعات سبد خرید');
    return;
  }

  if (!cart.items.length) {
    document.getElementById('checkoutContent').innerHTML = `
      <div class="text-center text-[#b3b3b3] py-10">
        <p>سبد خرید شما خالی است.</p>
        <a href="products.html" class="mt-4 inline-block px-4 py-2 bg-[#1db954] text-[#121212] rounded hover:bg-[#148c3c] transition">مشاهده محصولات</a>
      </div>`;
    return;
  }

  // نمایش خلاصه سفارش
  const orderSummary = document.getElementById('orderSummary');
  orderSummary.innerHTML = cart.items.map(item => `
    <div class="flex justify-between items-center text-[#b3b3b3] mb-2">
      <span>${item.product.name} ×${item.quantity}</span>
      <span>${Number(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
    </div>
  `).join('');
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  document.getElementById('checkoutTotalAmount').textContent = Number(total).toLocaleString('fa-IR');

  // انتخاب روش پرداخت (به طور پیش‌فرض shaparak)
  document.getElementById('paymentMethod').addEventListener('change', (e) => {
    const selected = e.target.value;
    // قسمت‌های مختلف را بسته/باز می‌کنیم
    document.getElementById('shaparakSection').classList.add('hidden');
    document.getElementById('cryptoSection').classList.add('hidden');
    document.getElementById('cardSection').classList.add('hidden');
    document.getElementById('whatsappSection').classList.add('hidden');

    if (selected === 'shaparak') {
      document.getElementById('shaparakSection').classList.remove('hidden');
    } else if (selected === 'crypto') {
      document.getElementById('cryptoSection').classList.remove('hidden');
    } else if (selected === 'card-to-card') {
      document.getElementById('cardSection').classList.remove('hidden');
    } else if (selected === 'whatsapp') {
      document.getElementById('whatsappSection').classList.remove('hidden');
    }
  });

  // در ابتدا shaparak نمایش داده شود
  document.getElementById('shaparakSection').classList.remove('hidden');
}

// ۱۱. تابع ارسال سفارش به سرور
async function submitOrder() {
  try {
    const method = document.getElementById('paymentMethod').value;
    let paymentDetails = {};

    if (method === 'crypto') {
      const cryptoType = document.getElementById('cryptoSelect').value;
      paymentDetails = { cryptoType };
    } else if (method === 'card-to-card') {
      const cardNumber = document.getElementById('cardNumber').value.trim();
      const bankName = document.getElementById('bankName').value.trim();
      paymentDetails = { cardNumber, bankName };
    } else if (method === 'shaparak') {
      // در اینجا می‌توانید فیلدهای موردنیاز شاپرک را بگیرید، اما فعلاً placeholder می‌گذاریم
      paymentDetails = { placeholder: 'پرداخت اینترنتی شاپرک' };
    } 
    // برای whatsapp نیازی به جزئیات نیست چون لینک خودش ساخته می‌شود

    const res = await apiFetch('/orders', 'POST', { paymentMethod: method, paymentDetails }, true);

    if (method === 'whatsapp') {
      // اگر واتساپ، لینک سفارش را باز می‌کنیم
      window.open(res.order.whatsappOrderUrl, '_blank');
    } else {
      alert('سفارش شما با موفقیت ثبت شد.');
      window.location.href = 'orders.html'; // اگر صفحه‌ای برای نمایش سفارشات دارید
    }
  } catch (err) {
    console.error(err);
    alert('خطا در ثبت سفارش: ' + err.message);
  }
}

// ======= بارگذاری Content بسته به هر صفحه =======

document.addEventListener('DOMContentLoaded', () => {
  // اگر صفحه products.html باشد
  if (document.getElementById('productsGrid')) {
    loadProductsOnPage();
    updateCartCount();
  }

  // اگر صفحه cart.html باشد
  if (document.getElementById('cartItems')) {
    loadCartPage();
    updateCartCount();
  }

  // اگر صفحه login.html باشد (ثبت‌نام یا ورود)
  if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', registerUser);
    document.getElementById('loginForm').addEventListener('submit', loginUser);
  }

  // اگر صفحه checkout.html باشد
  if (document.getElementById('checkoutContent')) {
    loadCheckoutPage();
    document.getElementById('checkoutBtn').addEventListener('click', submitOrder);
    updateCartCount();
  }

  // در همه صفحات (یا در header مشترک) به‌روزرسانی تعداد سبد
  if (document.getElementById('cartCount')) {
    updateCartCount();
  }
});
