(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const toast = (m) => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); };

  addEventListener('load', () => $('#preloader')?.classList.add('hide'));
  setTimeout(() => $('#preloader')?.classList.add('hide'), 2500);

  // Tema claro / oscuro (se recuerda)
  $('#theme-toggle')?.addEventListener('click', () => {
    const n = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) {}
  });

  // Menú móvil
  $('#menu-btn')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $$('.menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  // Scroll: cabecera, barra de progreso y botón subir
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    $('.header')?.classList.toggle('scrolled', y > 30);
    const p = $('#progress'); if (p) p.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    $('#top')?.classList.toggle('show', y > 500);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('#top')?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Efecto de escritura
  $$('.typed').forEach(el => {
    const items = el.dataset.items.split('|').map(s => s.trim()); let i = 0, c = 0, del = false;
    const tick = () => {
      const w = items[i]; el.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; i = (i + 1) % items.length; }
      c += del ? -1 : 1; setTimeout(tick, del ? 40 : 85);
    };
    tick();
  });

  // Revelar al hacer scroll + barras de habilidades
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; e.target.classList.add('in');
    $$('.bar span', e.target).forEach(b => b.style.width = b.dataset.w + '%'); io.unobserve(e.target);
  }), { threshold: .15 });
  $$('[data-reveal]').forEach((el, k) => { el.style.setProperty('--d', (k % 4) * .1 + 's'); io.observe(el); });

  // Inclinación 3D en tarjetas y fondo con efecto de profundidad
  if (matchMedia('(pointer:fine)').matches) {
    $$('.tilt').forEach(c => {
      c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`; });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
    const glow = $('#glow'), bg = $('.hero-bg');
    addEventListener('mousemove', e => {
      if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
      if (bg) bg.style.transform = `translate(${(e.clientX / innerWidth - .5) * -18}px,${(e.clientY / innerHeight - .5) * -18}px)`;
    });
  }

  // Pestañas (currículum)
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => x.classList.toggle('on', x === b));
    $$('.panel').forEach(p => p.classList.toggle('on', p.id === b.dataset.tab));
  }));

  // Copiar datos de contacto
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    navigator.clipboard?.writeText(b.dataset.copy).then(() => toast('Copiado ✓')).catch(() => toast('No se pudo copiar'));
  }));

  // Formulario → WhatsApp (misma lógica y número que tenías)
  $('#whatsappForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => encodeURIComponent($('#' + id).value);
    const telefono = '584243156626';
    const texto = 'Hola, te contacto desde tu web:%0A*Nombre:* ' + v('name') + '%0A*Correo:* ' + v('email') + '%0A*Asunto:* ' + v('subject') + '%0A*Mensaje:* ' + v('message');
    $('#whatsapp-success').style.display = 'block';
    setTimeout(() => window.open('https://wa.me/' + telefono + '?text=' + texto, '_blank'), 500);
  });
})();
