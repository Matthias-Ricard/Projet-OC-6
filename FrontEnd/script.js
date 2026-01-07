async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    
    return works;
    
  } catch (error) {
    console.log("error");
  }
}

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

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.log("error");
  }
}

(async () => {
  const works = await getWorks();
  displayWorks(works);
})();

