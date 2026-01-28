let allWorks = [];
const modalOverlay = document.querySelector(".modal-overlay");
const modalClose = document.querySelector(".modal-close");
const editButton = document.querySelector(".edit-projects button");
const backArrow = document.querySelector(".modal-back");
const addPhotoBtn = document.querySelector(".modal-add-btn");
const modalGallery = document.querySelector(".modal-gallery-grid");
const galleryView = document.querySelector(".modal-gallery");
const loginLink = document.querySelector("a[href='login.html']");
const editBanner = document.querySelector(".edit-banner");
const editProjects = document.querySelector(".edit-projects");
const filters = document.querySelector(".filters");
const formView = document.querySelector(".modal-form");
const uploadBtn = document.querySelector(".upload-zone button")
const addPhotoForm = document.querySelector("#add-photo-form");
const fileInput = document.querySelector("#image");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");
const uploadZone = document.querySelector(".upload-zone");
const previewContainer = document.querySelector(".preview-container");
const placeholder = document.querySelector(".upload-placeholder");
const submitBtn = document.querySelector(".modal-submit-btn");

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

// Vérifie si on est connecté
const token = sessionStorage.getItem("token");

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


// Ouvrir la modale et remplir la galerie
async function openModal() {
  resetAddPhotoForm();
  showGalleryView();
  modalOverlay.style.display = "flex";
  const works = await getWorks();
  displayModalWorks(works);
}

// Fermer la modale
function closeModal() {
  modalOverlay.style.display = "none";
}

// Aller vers le formulaire
function showFormView() {
  galleryView.style.display = "none";
  formView.style.display = "block";
  backArrow.style.visibility = "visible";

  // Réinitialiser le formulaire et l'aperçu
  addPhotoForm.reset();
  fileInput.value = "";
  const oldPreview = uploadZone.querySelector("img");
  if (oldPreview) oldPreview.remove();

  // Remplir la liste des catégories
  populateCategories();
  resetAddPhotoForm();
}

// Retour à la galerie
function showGalleryView() {
  formView.style.display = "none";
  galleryView.style.display = "block";
  backArrow.style.visibility = "hidden";
}

// Afficher les travaux dans la modale
function displayModalWorks(works) {
  modalGallery.innerHTML = "";
  
  for (const work of works) {
    const figure = document.createElement("figure");
    figure.classList.add("modal-work");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "modal-delete");

    deleteIcon.addEventListener("click", async () => {
      await deleteWork(work.id);
    });

    figure.appendChild(img);
    figure.appendChild(deleteIcon);
    modalGallery.appendChild(figure);
  }
}

async function deleteWork(workId) {
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(
      `http://localhost:5678/api/works/${workId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    // Mise à jour des données
    allWorks = allWorks.filter(work => work.id !== workId);

    // Mise à jour DOM
    displayWorks(allWorks);
    displayModalWorks(allWorks);

  } catch (error) {
    console.error(error);
  }
}



function handleNewWork(newWork) {
  //  Mise à jour des données globales
  allWorks.push(newWork);

  //  Mise à jour des galeries
  displayWorks(allWorks);
  displayModalWorks(allWorks);

  //  Retour à la galerie
  showGalleryView();

  //  Reset du formulaire
  addPhotoForm.reset();
  fileInput.value = "";
}


async function populateCategories() {
  const select = document.querySelector("#category");
  select.innerHTML = "";

  const categories = await getCategories();

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  }
}

function resetAddPhotoForm() {
    addPhotoForm.reset();
    fileInput.value = "";
    previewContainer.innerHTML = "";
    previewContainer.style.display = "none";
    placeholder.style.display = "flex";

    updateSubmitButton();
}

function updateSubmitButton() {
  console.log("updateSubmitButton appelée");
  console.log("file :", fileInput.files.length);
  console.log("title :", titleInput.value);

  if (
    fileInput.files.length > 0 &&
    titleInput.value.trim() !== ""
  ) {
    submitBtn.classList.add("active");
    submitBtn.disabled = false;
  } else {
    submitBtn.classList.remove("active");
    submitBtn.disabled = true;
  }
}

// =======================
// LISTENERS
// =======================

// Ouvrir modale
editButton.addEventListener("click", openModal);

// Fermer modale avec croix
modalClose.addEventListener("click", closeModal);

// Fermer modale en cliquant sur l’overlay
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Aller vers le formulaire
addPhotoBtn.addEventListener("click", showFormView);

// Retour à la galerie
backArrow.addEventListener("click", showGalleryView);




addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = sessionStorage.getItem("token");

  if (!fileInput.files[0] || !titleInput.value || !categorySelect.value) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l’envoi");
    }

    const newWork = await response.json();

    
    handleNewWork(newWork);

  } catch (error) {
    console.error(error);
  }
});

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  previewContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.alt = "Aperçu";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";

  const removeBtn = document.createElement("span");
  removeBtn.classList.add("remove-preview");
  removeBtn.innerHTML = "✕";

  removeBtn.addEventListener("click", () => {
    fileInput.value = "";
    previewContainer.innerHTML = "";
    previewContainer.style.display = "none";
    placeholder.style.display = "flex";
  });
  

  previewContainer.appendChild(img);
  previewContainer.appendChild(removeBtn);

  placeholder.style.display = "none";
  previewContainer.style.display = "block";

  updateSubmitButton();

});

// Gestion du clic sur login/logout
loginLink.addEventListener("click", (e) => {
  if (loginLink.textContent === "logout") {
    e.preventDefault(); // empêche la navigation
    sessionStorage.removeItem("token");
    setModePublic();
  }
  // sinon, c’est “login”, le lien fonctionne normalement
});

titleInput.addEventListener("input", updateSubmitButton);
