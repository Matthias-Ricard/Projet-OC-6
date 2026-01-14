const form = document.querySelector("#login-form")
const errorMessage = document.querySelector(".error-message")

form.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    console.log(email, password)

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method : "POST",
            heasers: { "Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });
        if (!response.ok) {
            throw new Error("Erreur dans l'identifiant ou le mot de passe");
        }
        const data = await response.json();
        localStorage.setItem("token", data.token);

        window.location.href = "index.html";
    } catch (error) {
        errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
    }
})