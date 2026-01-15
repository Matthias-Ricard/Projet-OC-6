const form = document.querySelector("#login-form");


form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Récupération des valeurs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Création de l'objet utilisateur
  const user = {
    email: email,
    password: password
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    // Login incorrect
    if (!response.ok) {
      throw new Error("Erreur dans l’identifiant ou le mot de passe");
    }

    const data = await response.json();

    // Login réussi
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";

  } catch (error){
    const errorMessage = document.querySelector("#p_erreur");
    errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe !";
    errorMessage.style.color = "red";
  }
});