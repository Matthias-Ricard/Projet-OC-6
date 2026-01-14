const form = document.querySelector("#login-form")
const errorMessage = document.querySelector(".error-message")

form.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    let user = {
        email: email,
        password: password
    }

    console.log(email, password)

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            heasers: {"Content-Type": "application/json"},
            body: JSON.stringify({user})
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

