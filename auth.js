document.addEventListener("DOMContentLoaded", async () => {
    // TEST DI CONNESIONE RAPIDO
const { data, error } = await supabase.from('tasks').select('count', { count: 'exact', head: true });
if (error) {
    console.error("❌ Errore di connessione a Supabase:", error.message);
} else {
    console.log("✅ Connessione a Supabase stabilita con successo! Le tabelle rispondono.");
}
    const authForm = document.getElementById("auth-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const btnSubmit = document.getElementById("btn-submit");
    const authSubtitle = document.getElementById("auth-subtitle");
    const switchAuth = document.getElementById("switch-auth");
    const toggleText = document.getElementById("toggle-text");
    const msgDiv = document.getElementById("msg");

    let isLoginMode = true; // true = Login, false = Registrazione

    // Cambia la modalità del form da Accedi a Registrati e viceversa
    switchAuth.addEventListener("click", () => {
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
        // Riclassifica il listener sul nuovo elemento span iniettato dinamicamente
        document.getElementById("switch-auth").addEventListener("click", arguments.callee);
    });

    // Gestione dell'invio del modulo
    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        msgDiv.style.display = "none";
        btnSubmit.disabled = true;
        btnSubmit.textContent = isLoginMode ? "ACCESSO IN CORSO..." : "CREAZIONE ACCOUNT...";

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (isLoginMode) {
            // LOGIN SUL CLOUD
            const { data, error } = await supabase.auth.signInWithPassword({
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
            const { data, error } = await supabase.auth.signUp({
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
            }
        }
    });

    function showMsg(text, type) {
        msgDiv.textContent = text;
        msgDiv.className = `message ${type}`;
    }
});
