// ------------------- CONFIGURATION TAILWIND -------------------
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#6D28D9',    // Couleur principale pour boutons et éléments
        secondary: '#8B5CF6',  // Couleur secondaire pour hover ou accents
      }
    }
  }
};

// ------------------- FONCTION D'ACHAT -------------------
function buyProduct(productName, price) {
  // Message formaté pour WhatsApp
  const whatsappMessage = `Je souhaite acheter ${productName} (${price}€).`;
  const whatsappLink = `https://wa.me/33612345678?text=${encodeURIComponent(whatsappMessage)}`;

  // Choix aléatoire entre WhatsApp et Snapchat (simulation)
  if (Math.random() > 0.5) {
    window.open(whatsappLink, '_blank'); // Ouvre WhatsApp
  } else {
    alert("Ouverture de Snapchat (simulation). Message: " + whatsappMessage);
    // Pour Snapchat réel, on pourrait utiliser un deep link si disponible
    // window.open('snapchat://add/user?text=' + encodeURIComponent(whatsappMessage));
  }
}

// ------------------- VARIABLES GLOBALES -------------------
// Pour stocker tous les articles et pouvoir filtrer facilement
let articlesData = [];

// Conteneur principal des cartes
const container = document.getElementById("articles-container");

// ------------------- FONCTION D'AFFICHAGE DES PRODUITS -------------------
function displayProducts(filteredArticles) {
  container.innerHTML = ""; // Vider le conteneur avant d'ajouter de nouvelles cartes

  filteredArticles.forEach(article => {
    const div = document.createElement("div"); // Crée la carte
    div.className = "card bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300";

    // Contenu HTML de la carte
    div.innerHTML = `
      <div class="card-image overflow-hidden h-48">
        <img src="${article.image}" alt="${article.titre}" class="w-full h-full object-cover transition-transform duration-300">
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-800">${article.titre}</h3>
        <p class="text-gray-600 mt-2">${article.description}</p>
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

    container.appendChild(div); // Ajoute la carte au DOM
  });

  // ------------------- ANIMATION PROGRESSIVE -------------------
  feather.replace(); // Remplace les <i data-feather> par les icônes Feather
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 150 * index);
  });
}

// ------------------- CHARGEMENT DES ARTICLES -------------------
fetch("articles.json")
  .then(response => response.json())
  .then(data => {
    articlesData = data;           // Stocke tous les articles pour pouvoir filtrer
    displayProducts(articlesData); // Affiche tous les articles au chargement

    // ------------------- GESTION DES BOUTONS DE FILTRE -------------------
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const categorie = btn.dataset.categorie;
        // Supprime la classe active de tous les boutons
        filterButtons.forEach(b => b.classList.remove("bg-primary", "text-white", "shadow-md"));
        // Ajoute la classe active au bouton cliqué
        btn.classList.add("bg-primary", "text-white", "shadow-md");
        // Filtre les articles selon la catégorie
        if (categorie === "Tous") {
          displayProducts(articlesData);
        } else {
          const filtered = articlesData.filter(a => a.categorie === categorie);
          displayProducts(filtered);
        }
      });
    });
  })
  .catch(err => console.error("Erreur de chargement :", err)); // Gestion des erreurs
  
  window.addEventListener('DOMContentLoaded', () => {
      // Sélectionne le bouton "Tous" et lui ajoute les classes d'état actif
      document.querySelector('.filter-btn[data-categorie="Tous"]').classList.add('bg-primary', 'text-white', 'shadow-md');
  });
