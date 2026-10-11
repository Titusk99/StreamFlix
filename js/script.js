// StreamFlix — interactions (Bootstrap 5 est chargé avant via CDN)

document.addEventListener('DOMContentLoaded', () => {
  // Tooltips Bootstrap (désactivés par défaut, il faut les initialiser)
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    bootstrap.Tooltip.getOrCreateInstance(element);
  });

  // Navbar : fond opaque dès que l'on quitte le haut de la page
  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Bouton "Ma Liste" : bascule ajouté / non ajouté
  document.querySelectorAll('.btn-mylist').forEach((button) => {
    button.addEventListener('click', () => {
      const added = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(added));
      button.textContent = added ? '✓ Dans Ma Liste' : '+ Ma Liste';
    });
  });

  // Menu mobile : se referme après un clic sur un lien
  const menu = document.getElementById('menu-principal');
  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      bootstrap.Collapse.getInstance(menu)?.hide();
    });
  });
});
