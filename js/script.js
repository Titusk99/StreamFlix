// StreamFlix — interactions JavaScript
// Le script est chargé avec "defer" : le HTML est déjà prêt quand il s'exécute,
// et Bootstrap (chargé juste avant) est disponible via la variable `bootstrap`.

// ===================================
// EXERCICE 1 : Afficher/masquer sections
// ===================================

// Chaque rangée de films a un bouton "Masquer" à côté de son titre
const toggleButtons = document.querySelectorAll('.toggle-section');

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // aria-controls contient l'id de la grille de films à masquer
    const grid = document.getElementById(button.getAttribute('aria-controls'));
    const isHidden = grid.classList.toggle('hidden');

    button.textContent = isHidden ? 'Afficher' : 'Masquer';
    button.setAttribute('aria-expanded', String(!isHidden));
  });
});

// ===================================
// EXERCICE 2 : Compteur de films
// ===================================

const filmCount = document.querySelectorAll('article.movie-card').length;

// On crée un paragraphe et on l'ajoute dans le footer
const counter = document.createElement('p');
counter.className = 'film-counter mt-4 mb-0';
counter.textContent = `Catalogue : ${filmCount} films disponibles`;
document.querySelector('.site-footer .container-fluid').appendChild(counter);

// ===================================
// EXERCICE 3 : Films vus
// ===================================

// + EXERCICE 5 : un même clic sur une carte sert aux deux exercices.
// event.target indique l'élément exact cliqué :
//   - le bouton "Voir la fiche" → ouvre la modal (exercice 5)
//   - n'importe où ailleurs sur la carte → marque le film comme vu
const movieCards = document.querySelectorAll('.movie-card');

movieCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('.btn')) {
      event.preventDefault(); // Le lien ne change pas l'URL
      lastFocusedElement = event.target.closest('.btn'); // Pour y revenir à la fermeture
      openModal(getFilmInfo(card));
      return;
    }

    card.classList.toggle('watched');
  });
});

// ===================================
// EXERCICE 4 : Recherche
// ===================================

const searchInput = document.querySelector('#search');
const noResults = document.querySelector('#no-results');

searchInput.addEventListener('input', function () {
  const searchTerm = this.value.trim().toLowerCase();
  const articles = document.querySelectorAll('article.movie-card');
  let visibleCount = 0;

  articles.forEach((article) => {
    const title = article.querySelector('h3').textContent.toLowerCase();
    const genres = article.querySelector('[aria-label="Genres"]').textContent.toLowerCase();
    const matches = title.includes(searchTerm) || genres.includes(searchTerm);

    // On masque la colonne Bootstrap (<li>) pour ne pas laisser de trou dans la grille
    article.closest('li').style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });

  // Une rangée sans aucun film correspondant disparaît entièrement
  document.querySelectorAll('.content-row').forEach((section) => {
    const hasVisibleFilm = [...section.querySelectorAll('li.col-6')]
      .some((item) => item.style.display !== 'none');
    section.style.display = hasVisibleFilm ? '' : 'none';
  });

  noResults.classList.toggle('hidden', visibleCount > 0);
});

// Valider le formulaire ne recharge pas la page : on descend au catalogue
searchInput.form.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#catalogue').scrollIntoView();
});

// ===================================
// EXERCICE 5 : Modal
// ===================================

const modal = document.querySelector('#modal');
const closeButton = modal.querySelector('.close');
let lastFocusedElement = null;

// Récupère les infos d'un film à partir de sa carte
function getFilmInfo(card) {
  const metadata = [...card.querySelectorAll('.movie-card__metadata dd')]
    .map((dd) => dd.textContent.trim());

  return {
    title: card.querySelector('h3').textContent,
    image: card.querySelector('img').getAttribute('src'),
    year: metadata[0],
    duration: metadata[1],
    rating: metadata[2],
    genres: [...card.querySelectorAll('.badge')].map((badge) => badge.textContent),
  };
}

function openModal(film) {
  const modalBody = document.querySelector('#modal-body');

  modalBody.innerHTML = `
    <div class="d-flex gap-3">
      <img src="${film.image}" alt="Affiche du film ${film.title}">
      <div>
        <h2 id="modal-title" class="fs-3">${film.title}</h2>
        <p class="mb-2">${film.year} · ${film.duration} · ${film.rating}</p>
        <p class="mb-0">${film.genres.map((genre) => `<span class="badge text-bg-primary me-1">${genre}</span>`).join('')}</p>
      </div>
    </div>
  `;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Empêche la page de défiler derrière
  closeButton.focus();
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
  lastFocusedElement?.focus(); // Le focus revient sur le bouton "Voir la fiche"
}

// Fermeture : bouton X, clic sur le fond sombre ou touche Échap
closeButton.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') closeModal();
});

// ===================================
// EXERCICE 6 : Changement de thème (bonus)
// ===================================

const themeToggle = document.querySelector('#theme-toggle');

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-theme');

  // Les composants Bootstrap (formulaires, menus…) suivent aussi le thème
  document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀ Mode clair' : '☾ Mode sombre';
});

// ===================================
// BOOTSTRAP : interactions de l'interface
// ===================================

// Tooltips Bootstrap (désactivés par défaut, il faut les initialiser)
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
  bootstrap.Tooltip.getOrCreateInstance(element);
});

// Navbar : fond opaque dès que l'on quitte le haut de la page
const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Bouton "Ma Liste" du hero : bascule ajouté / non ajouté
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
