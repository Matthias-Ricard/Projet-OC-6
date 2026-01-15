let allWorks = [];

// Fonction appel api

async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    
    return works;
    
  } catch (error) {
    console.log("error");
  }
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.log("error");
  }
}

// fonction apparaître api

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML="";

  for(const work of works) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);

  }
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".filters button");

  for (const button of buttons) {
    button.classList.remove("active");
  }

  activeButton.classList.add("active");
}

function displayCategories(categories, allWorks) {
  const filtersContainer = document.querySelector(".filters");

  const allButton = document.createElement("button")
  allButton.textContent = "Tous";
  allButton.classList.add("active");
  filtersContainer.appendChild(allButton);

  allButton.addEventListener("click", () =>{
    displayWorks(allWorks);
    setActiveButton(allButton);
  })

  for(const category of categories) {
    const button = document.createElement("button");
    button.textContent = category.name;

    button.addEventListener("click", () => {
      const filtereWorks = allWorks.filter(
        work => work.categoryId === category.id
      );
      displayWorks(filtereWorks);
      setActiveButton(button);
    });
    filtersContainer.appendChild(button);
  }
}

async function init() {
   allWorks = await getWorks();
   console.log(allWorks)
  if (allWorks) {
    displayWorks(allWorks);
  }

  const categories = await getCategories();
  if (categories) {
    displayCategories(categories, allWorks);
  }
}

init()

const loginLink = document.querySelector("a[href='login.html']");
const editBanner = document.querySelector(".edit-banner");
const editProjects = document.querySelector(".edit-projects");
const filters = document.querySelector(".filters");

// Vérifie si on est connecté
const token = localStorage.getItem("token");

function setModeEdition() {
  // Afficher éléments admin
  editBanner.style.display = "flex";
  editProjects.style.display = "flex";
  if (filters) filters.style.display = "none";

  // Changer le lien en logout
  loginLink.textContent = "logout";
  loginLink.removeAttribute("href"); // retire le href pour éviter de suivre le lien
}

function setModePublic() {
  // Masquer éléments admin
  editBanner.style.display = "none";
  editProjects.style.display = "none";
  if (filters) filters.style.display = "flex";

  // Remettre le lien login
  loginLink.textContent = "login";
  loginLink.href = "login.html";
}

// Initialisation selon token
if (token) {
  setModeEdition();
}

// Gestion du clic sur login/logout
loginLink.addEventListener("click", (e) => {
  if (loginLink.textContent === "logout") {
    e.preventDefault(); // empêche la navigation
    localStorage.removeItem("token");
    setModePublic();
  }
  // sinon, c’est “login”, le lien fonctionne normalement
});


