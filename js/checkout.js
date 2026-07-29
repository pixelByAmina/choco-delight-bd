let currentPaymentMethod = 'bkash';

function proceedToCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  document.getElementById('cartSection').style.display = 'none';
  document.getElementById('checkoutSection').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderCheckoutSummary();
  showPaymentForm('bkash');
}

function backToCart() {
  document.getElementById('cartSection').style.display = 'block';
  document.getElementById('checkoutSection').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.payment-option').forEach(el => {
  el.addEventListener('click', function() {
    document.querySelectorAll('.payment-option').forEach(m => {
      m.classList.remove('selected', 'border-[#4E2A1E]', 'bg-[#FFF0E0]');
      m.classList.add('border-[#E8DDD0]');
    });
    this.classList.remove('border-[#E8DDD0]');
    this.classList.add('selected', 'border-[#4E2A1E]', 'bg-[#FFF0E0]');
    const radio = this.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
      showPaymentForm(radio.value);
    }
  });
});

const merchantNumbers = {
  bkash: { number: '01840-000000', label: 'bKash', color: '#E2136E' },
  nagad: { number: '01840-000000', label: 'Nagad', color: '#ED1C24' },
  rocket: { number: '01840-000000', label: 'Rocket', color: '#981B1E' }
};

function showPaymentForm(method) {
  currentPaymentMethod = method;
  const container = document.getElementById('paymentDetails');
  if (!container) return;

  if (method === 'cod') {
    container.innerHTML = `
      <div class="mt-4 p-4 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0]">
        <p class="text-sm text-[#166534]"><i class="fas fa-truck mr-2"></i> Pay when your order is delivered. No advance payment needed.</p>
      </div>
    `;
    return;
  }

  if (method === 'card') {
    container.innerHTML = `
      <div class="mt-4 p-5 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
        <div class="flex items-center gap-2 mb-4">
          <span class="px-3 py-1 rounded text-xs font-bold text-white bg-[#4E2A1E]">Card Payment</span>
          <span class="text-xs text-[#6B6B6B]">Enter your card details below</span>
        </div>
        <div class="flex gap-2 mb-4">
          <span class="px-3 py-1 rounded text-[0.6rem] font-bold text-white bg-[#1A1F71]">Visa</span>
          <span class="px-3 py-1 rounded text-[0.6rem] font-bold text-white bg-[#EB001B]">Mastercard</span>
          <span class="px-3 py-1 rounded text-[0.6rem] font-bold text-white bg-[#0066FF]">Amex</span>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1.5">Card Number</label>
          <input type="text" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxlength="19" class="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg text-sm bg-white outline-none focus:border-[#D4A373] transition" required>
          <p id="cardNumberError" class="text-xs text-red-500 mt-1 hidden">Please enter a valid 16-digit card number.</p>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label class="block text-sm font-medium mb-1.5">Expiry Date</label>
            <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" class="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg text-sm bg-white outline-none focus:border-[#D4A373] transition" required>
            <p id="cardExpiryError" class="text-xs text-red-500 mt-1 hidden">Please enter a valid expiry date.</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">CVV</label>
            <input type="text" id="cardCvv" placeholder="XXX" maxlength="4" class="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg text-sm bg-white outline-none focus:border-[#D4A373] transition" required>
            <p id="cardCvvError" class="text-xs text-red-500 mt-1 hidden">Please enter a valid CVV.</p>
          </div>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1.5">Cardholder Name</label>
          <input type="text" id="cardName" placeholder="Name on card" class="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg text-sm bg-white outline-none focus:border-[#D4A373] transition" required>
          <p id="cardNameError" class="text-xs text-red-500 mt-1 hidden">Please enter the cardholder name.</p>
        </div>
        <div class="mt-4 p-3 bg-[#FEF2F2] rounded-lg border border-[#FECACA]">
          <p class="text-xs text-[#991B1B]"><i class="fas fa-lock mr-1.5"></i> <strong>Secure Payment:</strong> Your card details are encrypted and processed securely. We do not store your card information.</p>
        </div>
      </div>
    `;
    return;
  }

  const merchant = merchantNumbers[method];
  if (!merchant) return;

  const total = getFinalTotal();

  container.innerHTML = `
    <div class="mt-4 p-5 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">

      <!-- Step Indicator -->
      <div class="step-indicator">
        <div class="step active">
          <span class="step-num">1</span>
          <span>Send Money</span>
        </div>
        <div class="step-line active"></div>
        <div class="step">
          <span class="step-num">2</span>
          <span>Enter TrxID</span>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <span class="step-num">3</span>
          <span>Confirm</span>
        </div>
      </div>

      <!-- Merchant Info Card -->
      <div class="bg-white rounded-lg border border-[#E8DDD0] p-4 mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-3 py-1 rounded text-xs font-bold text-white" style="background:${merchant.color};">${merchant.label}</span>
          <span class="text-xs text-[#6B6B6B]">Send payment to our Merchant Number</span>
        </div>
        <p class="text-sm text-[#6B6B6B] mb-2">
          Send <strong class="text-[#4E2A1E]">${formatBDT(total)}</strong> to the ${merchant.label} Merchant Number below.
          After completing payment, enter your Transaction ID.
        </p>
        <div class="flex items-center justify-between bg-[#FFF8F0] rounded p-3 border border-[#E8DDD0]">
          <div>
            <div class="text-xs text-[#6B6B6B]">Merchant Number</div>
            <div class="text-lg font-bold text-[#4E2A1E] tracking-wider">${merchant.number}</div>
          </div>
          <button type="button" onclick="copyMerchantNumber('${merchant.number}')" class="px-3 py-2 rounded-lg bg-[#4E2A1E] text-white text-xs font-medium hover:bg-[#8B5E3C] transition flex items-center gap-1.5">
            <i class="fas fa-copy"></i> Copy
          </button>
        </div>
        <p class="text-xs text-[#6B6B6B] mt-2">
          <i class="fas fa-info-circle text-[#D4A373]"></i>
          Example TrxID: <strong>${method.toUpperCase() === 'BKASH' ? '8A7B6C5D' : method.toUpperCase() === 'NAGAD' ? 'NG7A8B9C' : 'RT5D6E7F'}</strong>
        </p>
      </div>

      <!-- Customer Payment Info -->
      <div class="mb-3">
        <label class="block text-sm font-medium mb-1.5">Your Phone Number (used for payment)</label>
        <input type="tel" id="paymentPhone" placeholder="01XXXXXXXXX" maxlength="11" class="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg text-sm bg-white outline-none focus:border-[#D4A373] transition" required>
        <p id="paymentPhoneError" class="text-xs text-red-500 mt-1 hidden">Please enter a valid 11-digit Bangladeshi phone number.</p>
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium mb-1.5">Transaction ID (TrxID)</label>
        <input type="text" id="paymentTrxID" placeholder="e.g. 8A7B6C5D" class="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg text-sm bg-white outline-none focus:border-[#D4A373] transition" required>
        <p id="paymentTrxIDError" class="text-xs text-red-500 mt-1 hidden">Please enter your transaction ID.</p>
      </div>

      <!-- Optional Screenshot Upload -->
      <div class="mb-2">
        <label class="block text-sm font-medium mb-1.5">Payment Screenshot <span class="text-[#6B6B6B] text-xs">(optional)</span></label>
        <div class="file-upload-area" id="fileUploadArea" onclick="document.getElementById('screenshotInput').click()">
          <i class="fas fa-cloud-upload-alt text-2xl text-[#D4A373] mb-2 block"></i>
          <p class="text-sm text-[#6B6B6B]">Click to upload screenshot</p>
          <p class="text-xs text-[#6B6B6B] mt-1">PNG, JPG, JPEG (max 5MB)</p>
          <input type="file" id="screenshotInput" accept="image/png,image/jpg,image/jpeg" class="hidden" onchange="handleFileUpload(event)">
        </div>
        <div id="filePreview" class="hidden mt-2 flex items-center gap-3 p-3 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0]">
          <i class="fas fa-file-image text-green-600 text-xl"></i>
          <span id="fileName" class="text-sm text-[#166534] flex-1 truncate"></span>
          <button type="button" onclick="removeFile()" class="text-red-500 hover:text-red-700 transition"><i class="fas fa-times"></i></button>
        </div>
      </div>

      <!-- Security reminder -->
      <div class="mt-4 p-3 bg-[#FEF2F2] rounded-lg border border-[#FECACA]">
        <p class="text-xs text-[#991B1B]"><i class="fas fa-shield-alt mr-1.5"></i> <strong>Security Alert:</strong> We never ask for your PIN or OTP. Do not share them with anyone.</p>
      </div>
    </div>
  `;
}

function copyMerchantNumber(number) {
  navigator.clipboard.writeText(number.replace(/-/g, '')).then(() => {
    showToast('Merchant number copied!', 'success');
  }).catch(() => {
    showToast('Failed to copy number.', 'error');
  });
}

let uploadedFile = null;

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('File size must be under 5MB.', 'error');
    return;
  }
  const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (!validTypes.includes(file.type)) {
    showToast('Only PNG, JPG, or JPEG files are allowed.', 'error');
    return;
  }
  uploadedFile = file;
  document.getElementById('fileUploadArea').classList.add('has-file');
  document.getElementById('filePreview').classList.remove('hidden');
  document.getElementById('fileName').textContent = file.name;
}

function removeFile() {
  uploadedFile = null;
  document.getElementById('screenshotInput').value = '';
  document.getElementById('fileUploadArea').classList.remove('has-file');
  document.getElementById('filePreview').classList.add('hidden');
}

function validatePaymentFields(method) {
  if (method === 'cod') return true;

  if (method === 'card') {
    const cardNum = document.getElementById('cardNumber')?.value.trim().replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry')?.value.trim();
    const cvv = document.getElementById('cardCvv')?.value.trim();
    const cardName = document.getElementById('cardName')?.value.trim();
    const numErr = document.getElementById('cardNumberError');
    const expErr = document.getElementById('cardExpiryError');
    const cvvErr = document.getElementById('cardCvvError');
    const nameErr = document.getElementById('cardNameError');

    let valid = true;
    if (!cardNum || cardNum.length < 16 || !/^\d{16}$/.test(cardNum)) {
      numErr?.classList.remove('hidden'); valid = false;
    } else { numErr?.classList.add('hidden'); }
    if (!expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      expErr?.classList.remove('hidden'); valid = false;
    } else { expErr?.classList.add('hidden'); }
    if (!cvv || cvv.length < 3 || !/^\d{3,4}$/.test(cvv)) {
      cvvErr?.classList.remove('hidden'); valid = false;
    } else { cvvErr?.classList.add('hidden'); }
    if (!cardName || cardName.length < 2) {
      nameErr?.classList.remove('hidden'); valid = false;
    } else { nameErr?.classList.add('hidden'); }
    return valid;
  }

  const phone = document.getElementById('paymentPhone')?.value.trim();
  const trxId = document.getElementById('paymentTrxID')?.value.trim();
  const phoneError = document.getElementById('paymentPhoneError');
  const trxError = document.getElementById('paymentTrxIDError');

  let valid = true;

  if (!phone || phone.length !== 11 || !/^01\d{9}$/.test(phone)) {
    phoneError?.classList.remove('hidden');
    valid = false;
  } else {
    phoneError?.classList.add('hidden');
  }

  if (!trxId) {
    trxError?.classList.remove('hidden');
    valid = false;
  } else {
    trxError?.classList.add('hidden');
  }

  return valid;
}

document.getElementById('checkoutForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const city = document.getElementById('custCity').value.trim();
  const district = document.getElementById('custDistrict').value;

  if (!name || !phone || !address || !city || !district) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (phone.length < 11) {
    showToast('Please enter a valid Bangladeshi phone number.', 'error');
    return;
  }

  const paymentRadio = document.querySelector('input[name="payment"]:checked');
  const paymentMethod = paymentRadio ? paymentRadio.value : 'cod';

  if (!validatePaymentFields(paymentMethod)) {
    showToast('Please fix the payment fields.', 'error');
    return;
  }

  const paymentLabels = {
    'bkash': 'bKash',
    'nagad': 'Nagad',
    'rocket': 'Rocket',
    'card': 'Debit/Credit Card',
    'cod': 'Cash on Delivery'
  };

  const orderNo = 'CD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

  document.getElementById('confirmName').textContent = name;
  document.getElementById('confirmOrderNo').textContent = orderNo;
  document.getElementById('confirmPayment').textContent = paymentLabels[paymentMethod] || paymentMethod;
  document.getElementById('confirmTotal').textContent = formatBDT(getFinalTotal());
  document.getElementById('confirmPaymentMethod').textContent = paymentLabels[paymentMethod] || 'payment';

  const trxId = paymentMethod === 'cod' ? '' : (document.getElementById('paymentTrxID')?.value.trim() || '');
  const paymentPhone = paymentMethod === 'cod' || paymentMethod === 'card' ? '' : (document.getElementById('paymentPhone')?.value.trim() || '');
  const orderNotes = document.getElementById('orderNotes')?.value.trim() || '';

  const allProducts = (typeof getProducts === 'function') ? getProducts() : [];
  const orderItems = cart.map(item => {
    const p = allProducts.find(pr => pr.id === Number(item.id));
    return {
      id: item.id,
      name: p ? p.name : 'Unknown Product',
      price: p ? Number(p.price) : 0,
      qty: item.qty
    };
  });

  let orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.unshift({
    orderNo,
    date: new Date().toISOString(),
    customer: { name, phone, address, city, district },
    payment: paymentLabels[paymentMethod] || paymentMethod,
    paymentMethod,
    transactionId: trxId,
    paymentPhone,
    orderNotes,
    total: getFinalTotal(),
    items: orderItems,
    status: 'Pending Verification'
  });
  localStorage.setItem('orders', JSON.stringify(orders));

  const prods = allProducts.slice();
  cart.forEach(item => {
    const prod = prods.find(p => p.id === Number(item.id));
    if (prod && prod.stock !== undefined) {
      prod.stock = Math.max(0, prod.stock - item.qty);
      prod.inStock = prod.stock > 0;
    }
  });
  saveProducts(prods);

  document.getElementById('orderConfirm').classList.add('active');

  cart = [];
  saveCart();
  renderCart();
});

document.getElementById('orderConfirm')?.addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkoutSection')) {
    if (cart.length === 0) {
      document.getElementById('cartSection').style.display = 'block';
      document.getElementById('checkoutSection').style.display = 'none';
    }
  }
});

document.addEventListener('input', function(e) {
  if (e.target.id === 'cardNumber') {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
  }
  if (e.target.id === 'cardExpiry') {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
    e.target.value = val;
  }
  if (e.target.id === 'cardCvv') {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
  }
});
