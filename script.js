(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const dotsWrap = document.querySelector('.slider-dots');
  const counter = document.querySelector('.slide-counter strong');
  let current = 0;
  let timer;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `查看第 ${index + 1} 张`);
    dot.addEventListener('click', () => showSlide(index));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.children];
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    counter.textContent = String(current + 1).padStart(2, '0');
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 6000);
  }

  document.querySelector('.slider-arrow.prev').addEventListener('click', () => showSlide(current - 1));
  document.querySelector('.slider-arrow.next').addEventListener('click', () => showSlide(current + 1));
  showSlide(0);

  const previewTitle = document.querySelector('#previewTitle');
  const previewDesc = document.querySelector('#previewDesc');
  document.querySelectorAll('.school-item').forEach((item) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.school-item').forEach((other) => other.classList.remove('active'));
      item.classList.add('active');
      previewTitle.textContent = `${item.dataset.school} · ${item.dataset.play}`;
      previewDesc.textContent = item.dataset.desc;
    });
  });

  const form = document.querySelector('#messageForm');
  const messageInput = document.querySelector('#visitorMessage');
  const messageWall = document.querySelector('#messageWall');
  const charCount = document.querySelector('#charCount');
  const toast = document.querySelector('#toast');
  const storageKey = 'xingju-messages';

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = value;
    return node.innerHTML;
  }

  function renderMessage(entry) {
    const card = document.createElement('div');
    card.className = 'message-card';
    const initial = [...entry.name][0] || '访';
    card.innerHTML = `<div><span class="avatar">${escapeHtml(initial)}</span><strong>${escapeHtml(entry.name)}</strong><time>${escapeHtml(entry.date)}</time></div><p>${escapeHtml(entry.message)}</p>`;
    messageWall.prepend(card);
  }

  try {
    JSON.parse(localStorage.getItem(storageKey) || '[]').forEach(renderMessage);
  } catch (_) {
    localStorage.removeItem(storageKey);
  }

  messageInput.addEventListener('input', () => {
    charCount.textContent = `${messageInput.value.length} / 120`;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const entry = {
      name: String(data.get('name')).trim(),
      message: String(data.get('message')).trim(),
      date: '刚刚'
    };
    if (!entry.name || !entry.message) return;
    renderMessage(entry);
    try {
      const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
      entries.unshift(entry);
      localStorage.setItem(storageKey, JSON.stringify(entries.slice(0, 10)));
    } catch (_) { /* The message remains visible for this session. */ }
    form.reset();
    charCount.textContent = '0 / 120';
    showToast('留言已化作一束星火，保存在您的浏览器中');
  });

  document.querySelectorAll('[data-demo-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast('这是 Demo 占位链接，正式上线后将跳转到新闻原文');
    });
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  }
})();
