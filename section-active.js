// Detecta qué sección está visible y activa el subrayado dorado en el menú
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const map = new Map(
    links.map(a => [a.getAttribute('href').replace('#','') || 'inicio', a])
  );

  const targets = links
    .map(a => document.getElementById(a.getAttribute('href').replace('#','') || 'inicio'))
    .filter(Boolean);

  // Quita el activo actual y aplica al nuevo
  function setActive(id) {
    links.forEach(a => a.classList.remove('active'));
    const el = map.get(id);
    if (el) el.classList.add('active');
  }

  // Observador de intersección para secciones
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id || 'inicio');
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

  targets.forEach(t => io.observe(t));

  // Al hacer click, hace scroll suave y deja activo correcto
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').replace('#','') || 'inicio';
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
      }
    });
  });
})();
