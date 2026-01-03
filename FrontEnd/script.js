fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(works => {
    const gallery = document.querySelector(".gallery");

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

  });

const filtersContainer = document.querySelector(".filters");

fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {

    // bouton Tous
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    filtersContainer.appendChild(allButton);

    // boutons catégories
    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name;
      filtersContainer.appendChild(button);
    });
  });

