tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#6D28D9',
        secondary: '#8B5CF6',
      }
    }
  },
  darkMode: 'class' // pour toggle jour/nuit
};

document.addEventListener("DOMContentLoaded", function () {

  // ==================== Toggle Jour/Nuit ====================
  const themeToggle = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });

  // ==================== Fonction d'achat ====================
  window.buyProduct = function(productName, price) {
  const message = `Je souhaite acheter ${productName} (${price}€).`;
  const phoneNumber = "33751235073"; // Sans le +, ni espace
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Ouvre le lien dans un nouvel onglet
  const newTab = window.open(whatsappUrl, "_blank");

  if (!newTab) {
    alert("Veuillez autoriser les popups pour ouvrir WhatsApp !");
  }
};



  // ==================== Charger les articles ====================
  let allArticles = [];
  fetch("articles.json")
    .then(response => response.json())
    .then(data => {
      allArticles = data;
      displayArticles(data);
      animateHeader();
      animateCoffeeButton();
      initFilters();
    })
    .catch(err => console.error("Erreur de chargement :", err));

  // ==================== Affichage des articles ====================
  function displayArticles(articles) {
    const container = document.getElementById("articles-container");
    container.innerHTML = "";

    articles.forEach((article, index) => {
      const card = document.createElement("div");
      card.className = "card bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300";

      card.innerHTML = `
        <div class="h-56 overflow-hidden">
          <img src="${article.image}" alt="${article.titre}" 
            class="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110">
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">${article.titre}</h3>
          <p class="text-gray-600 dark:text-gray-300 mt-2">${article.description}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-lg font-bold text-primary">${article.prix}€</span>
           <button 
            onclick="buyProduct('${article.titre}', ${article.prix})" 
            class="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <i data-feather="message-circle" class="w-5 h-5"></i>
            <span>WhatsApp</span>
          </button>

          </div>
        </div>
      `;

      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      setTimeout(() => {
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100 * index);

      container.appendChild(card);
    });

    feather.replace();
  }

  // ==================== Animation header ====================
  function animateHeader() {
    const logo = document.getElementById("site-logo");
    const title = document.getElementById("site-title");
    const subtitle = document.getElementById("site-subtitle");
    const header = document.getElementById("site-header");

    setTimeout(() => {
      header.classList.remove("opacity-0", "translate-y-6");
      logo.classList.remove("opacity-0", "scale-75");
      title.classList.remove("opacity-0", "translate-y-4");
      subtitle.classList.remove("opacity-0", "translate-y-4");
    }, 500);
  }

  // ==================== Bouton Paye ton café ====================
  function animateCoffeeButton() {
    const btn = document.getElementById("coffee-btn");
    setTimeout(() => {
      btn.classList.remove("opacity-0", "translate-x-20");
      btn.classList.add("opacity-100", "translate-x-0");
    }, 1000);
  }

  // ==================== Filtres ====================
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-categorie');
        const filtered = cat === "Tous" ? allArticles : allArticles.filter(a => a.categorie === cat);
        displayArticles(filtered);

        // Style du bouton actif
        filterBtns.forEach(b => b.classList.remove('bg-primary', 'text-white'));
        btn.classList.add('bg-primary', 'text-white');
      });
    });
  }
  // ==================== Recherche en temps réel ====================
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allArticles.filter(article =>
      article.titre.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query)
    );
    displayArticles(filtered);
  });


}); // FIN DOMContentLoaded
