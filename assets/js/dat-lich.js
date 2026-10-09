// Booking flow: form -> VietQR payment -> confirmation.
// ---------------------------------------------------------------
// FILL THESE IN BEFORE GOING LIVE
var CONFIG = {
  // Where form submissions go. Any endpoint that accepts a POST works:
  // a Google Apps Script web app (writes to a Google Sheet), Formspree, Make/Zapier webhook, or your own API.
  // Leave empty and the form still works on screen, but nothing is saved anywhere.
  FORM_ENDPOINT: '',

  // VietQR (https://vietqr.io). Fill all three and the page generates a QR with amount + transfer note prefilled.
  BANK_ID: '',        // bank code, e.g. 'VCB', 'TCB', 'MB', 'ACB'
  ACCOUNT_NO: '',     // account number, digits only
  ACCOUNT_NAME: '',   // account holder name, UPPERCASE without accents, e.g. 'NGUYEN VAN A'
  BANK_NAME: '',      // name shown on the page, e.g. 'Vietcombank'

  PRICE: 1500000,
  NOTE_PREFIX: 'NHINRO'
};
// ---------------------------------------------------------------

(function () {
  var form = document.getElementById('booking-form');
  var stepForm = document.getElementById('step-form');
  var stepPay = document.getElementById('step-pay');
  var stepDone = document.getElementById('step-done');
  var errorBox = document.getElementById('form-error');
  var data = {};

  function show(step) {
    [stepForm, stepPay, stepDone].forEach(function (s) { s.hidden = s !== step; });
    document.getElementById('done-sun').hidden = step !== stepDone;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function send(payload) {
    if (!CONFIG.FORM_ENDPOINT) return;
    var body = new FormData();
    Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
    // no-cors so it also works with Google Apps Script; the response is not read.
    fetch(CONFIG.FORM_ENDPOINT, { method: 'POST', body: body, mode: 'no-cors' }).catch(function () {});
  }

  function track(event, custom) {
    if (typeof window.fbq === 'function') {
      if (custom) window.fbq('trackCustom', event); else window.fbq('track', event);
    }
    if (typeof window.gtag === 'function') {
      if (event === 'Lead') {
        window.gtag('event', 'generate_lead', { currency: 'VND', value: CONFIG.PRICE });
      } else if (event === 'DaChuyenKhoan') {
        window.gtag('event', 'purchase', { currency: 'VND', value: CONFIG.PRICE });
      }
    }
  }

  function fillPayment() {
    var digits = (data.zalo || '').replace(/\D/g, '');
    var note = CONFIG.NOTE_PREFIX + ' ' + digits;
    document.getElementById('kv-note').textContent = note;
    if (CONFIG.BANK_NAME) document.getElementById('kv-bank').textContent = CONFIG.BANK_NAME;
    if (CONFIG.ACCOUNT_NO) document.getElementById('kv-account').textContent = CONFIG.ACCOUNT_NO;
    if (CONFIG.ACCOUNT_NAME) document.getElementById('kv-name').textContent = CONFIG.ACCOUNT_NAME;
    if (CONFIG.BANK_ID && CONFIG.ACCOUNT_NO) {
      var src = 'https://img.vietqr.io/image/' + encodeURIComponent(CONFIG.BANK_ID) + '-' + encodeURIComponent(CONFIG.ACCOUNT_NO) +
        '-compact2.png?amount=' + CONFIG.PRICE + '&addInfo=' + encodeURIComponent(note) +
        '&accountName=' + encodeURIComponent(CONFIG.ACCOUNT_NAME);
      var qr = document.getElementById('qr');
      qr.innerHTML = '';
      var img = new Image();
      img.alt = 'Mã VietQR chuyển khoản 1.500.000đ';
      img.src = src;
      qr.appendChild(img);
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      errorBox.hidden = false;
      form.reportValidity();
      return;
    }
    errorBox.hidden = true;
    var fd = new FormData(form);
    data = {
      ten: (fd.get('ten') || '').toString().trim(),
      zalo: (fd.get('zalo') || '').toString().trim(),
      coach: (fd.get('coach') || '').toString(),
      tham_gia: (fd.get('tham_gia') || '').toString(),
      chia_se: (fd.get('chia_se') || '').toString().trim()
    };
    send(Object.assign({ buoc: 'dang_ky', thoi_gian: new Date().toISOString() }, data));
    track('Lead');
    fillPayment();
    show(stepPay);
  });

  document.getElementById('btn-back').addEventListener('click', function () { show(stepForm); });

  document.getElementById('btn-paid').addEventListener('click', function () {
    send({ buoc: 'da_chuyen_khoan', thoi_gian: new Date().toISOString(), ten: data.ten, zalo: data.zalo });
    track('DaChuyenKhoan', true);
    document.getElementById('thanks').textContent = 'Cảm ơn em' + (data.ten ? ', ' + data.ten : '') + '.';
    show(stepDone);
  });
})();
