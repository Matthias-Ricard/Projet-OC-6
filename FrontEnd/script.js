let allWorks = [];



fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(works => {
    allWorks = works;
    displayWorks(works);

  });

  function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // on vide la galerie

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}


const filtersContainer = document.querySelector(".filters");

fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {

    // bouton Tous
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";

    allButton.addEventListener("click", () => {
    displayWorks(allWorks);
    setActiveButton(allButton);
    });

filtersContainer.appendChild(allButton);


    // boutons catégories
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;

    button.addEventListener("click", () => {
      const filteredWorks = allWorks.filter(
        work => work.categoryId === category.id
      );
      displayWorks(filteredWorks);
      setActiveButton(button);
    });

    filtersContainer.appendChild(button);
    });

    
});

function setActiveButton(clickedButton) {
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach(button => {
    button.classList.remove("active");
  });
  clickedButton.classList.add("active");
}
