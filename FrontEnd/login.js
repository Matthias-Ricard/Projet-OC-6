const form = document.querySelector("form")


form.addEventListener("submit", async (event) =>{
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let user = {
        email: email,
        password: password
    }

    console.log(email, password)

    
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        heasers: {"Content-Type": "application/json"},
        body: JSON.stringify({user})
    })

    .then(response => response.json())

    .then(data => {
        if(data.token) {
            localStorage.setItem("Token", data.token)
            window.location.href = "index.html"
        }
        else {
            let loginErreur = document.querySelector("#login-form")
            let mdp = document.querySelector(".forgot-password")
            let pErreur = document.querySelector(".error-message")

            if (!pErreur) {
                pErreur = document.createElement("p")
                pErreur.classList.add("error-message")
                loginErreur.insertBefore(pErreur, mdp)
            }

            pErreur.innerHTML = "Erreur dans l’identifiant ou le mot de passe !"
        }
    })
})