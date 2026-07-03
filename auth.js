document.addEventListener("DOMContentLoaded", async () => {
    
    const authForm = document.getElementById("auth-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const btnSubmit = document.getElementById("btn-submit");
    const authSubtitle = document.getElementById("auth-subtitle");
    const switchAuth = document.getElementById("switch-auth");
    const toggleText = document.getElementById("toggle-text");
    const msgDiv = document.getElementById("msg");

    let isLoginMode = true; // true = Login, false = Registrazione

    // Funzione centralizzata per scambiare la modalità del form senza crash
    function handleSwitch() {
        isLoginMode = !isLoginMode;
        msgDiv.style.display = "none";
        
        if (isLoginMode) {
            authSubtitle.textContent = "Accedi al tuo workspace cloud";
            btnSubmit.textContent = "ACCEDI";
            toggleText.innerHTML = 'Non hai un account? <span id="switch-auth">Registrati</span>';
        } else {
            authSubtitle.textContent = "Crea un account cifrato gratuito";
            btnSubmit.textContent = "REGISTRATI";
            toggleText.innerHTML = 'Hai già un account? <span id="switch-auth">Accedi</span>';
        }
        
        // Riaggancia il click sul nuovo elemento creato dinamicamente nel DOM
        document.getElementById("switch-auth").addEventListener("click", handleSwitch);
    }

    // Collega il primo click iniziale al caricamento della pagina
    if (switchAuth) {
        switchAuth.addEventListener("click", handleSwitch);
    }

    // Gestione dell'invio del modulo (Login o Registrazione)
    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        msgDiv.style.display = "none";
        btnSubmit.disabled = true;
        btnSubmit.textContent = isLoginMode ? "ACCESSO IN CORSO..." : "CREAZIONE ACCOUNT...";

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (isLoginMode) {
            // LOGIN SUL CLOUD
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                showMsg(error.message, "error");
                btnSubmit.disabled = false;
                btnSubmit.textContent = "ACCEDI";
            } else {
                showMsg("Accesso eseguito! Caricamento...", "success");
                setTimeout(() => {
                    window.location.href = "index.html"; // Vai alla dashboard principale
                }, 1000);
            }
        } else {
            // REGISTRAZIONE SUL CLOUD
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                showMsg(error.message, "error");
                btnSubmit.disabled = false;
                btnSubmit.textContent = "REGISTRATI";
            } else {
                showMsg("Account creato con successo! Ora puoi accedere.", "success");
                isLoginMode = true;
                authSubtitle.textContent = "Accedi al tuo workspace cloud";
                btnSubmit.textContent = "ACCEDI";
                toggleText.innerHTML = 'Non hai un account? <span id="switch-auth">Registrati</span>';
                btnSubmit.disabled = false;
                passwordInput.value = "";
                // Riaggancia il listener anche dopo il reset del form
                document.getElementById("switch-auth").addEventListener("click", handleSwitch);
            }
        }
    });

    function showMsg(text, type) {
        msgDiv.textContent = text;
        msgDiv.className = `message ${type}`;
        msgDiv.style.display = "block";
    }
});
