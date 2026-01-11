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