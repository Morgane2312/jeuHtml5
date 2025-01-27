document.addEventListener('DOMContentLoaded', function () {
    const formulaireConnexion = document.getElementById('formulaire-connexion');
    const formulaireInscription = document.getElementById('formulaire-inscription');
    const formulaireMotDePasseOublie = document.getElementById('formulaire-mot-de-passe-oublie');
    const lienVersInscription = document.getElementById('lien-vers-inscription');
    const lienVersConnexion = document.getElementById('lien-vers-connexion');
    const lienMotDePasseOublie = document.getElementById('lien-mdp-oublie');
    const lienRetourConnexion = document.getElementById('lien-retour-connexion');
    const messageErreur = document.getElementById('message-erreur');

    const emailPreRempli = localStorage.getItem('emailPreRempli');
    const passwordPreRempli = localStorage.getItem('passwordPreRempli');
    if (emailPreRempli && passwordPreRempli) {
        document.getElementById('connexion-email').value = emailPreRempli;
        document.getElementById('connexion-password').value = passwordPreRempli;

        localStorage.removeItem('emailPreRempli');
        localStorage.removeItem('passwordPreRempli');
    }

    const estConnecte = localStorage.getItem('utilisateurConnecte') === 'true';
    if (estConnecte) {
        console.log("Utilisateur déjà connecté. Redirection vers jeu.php...");
        window.location.href = "jeu.php";
        return;
    }

    function afficherMessageErreur(message) {
        if (messageErreur) {
            messageErreur.textContent = message;
            messageErreur.classList.remove('hidden');
        } else {
            console.error("L'élément message-erreur est introuvable !");
        }
    }

    function cacherMessageErreur() {
        if (messageErreur) {
            messageErreur.textContent = '';
            messageErreur.classList.add('hidden');
        }
    }

    function estEmailValide(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    lienVersInscription.addEventListener('click', function (e) {
        e.preventDefault();
        formulaireConnexion.classList.add('hidden');
        formulaireMotDePasseOublie.classList.add('hidden');
        formulaireInscription.classList.remove('hidden');
        cacherMessageErreur();
    });

    lienVersConnexion.addEventListener('click', function (e) {
        e.preventDefault();
        formulaireInscription.classList.add('hidden');
        formulaireMotDePasseOublie.classList.add('hidden');
        formulaireConnexion.classList.remove('hidden');
        cacherMessageErreur();
    });

    lienMotDePasseOublie.addEventListener('click', function (e) {
        e.preventDefault();
        formulaireConnexion.classList.add('hidden');
        formulaireInscription.classList.add('hidden');
        formulaireMotDePasseOublie.classList.remove('hidden');
        cacherMessageErreur();
    });

    lienRetourConnexion.addEventListener('click', function (e) {
        e.preventDefault();
        formulaireMotDePasseOublie.classList.add('hidden');
        formulaireInscription.classList.add('hidden');
        formulaireConnexion.classList.remove('hidden');
        cacherMessageErreur();
    });

    formulaireInscription.addEventListener('submit', function (e) {
        e.preventDefault();
        const pseudo = document.getElementById('inscription-pseudo').value.trim();
        const email = document.getElementById('inscription-email').value.trim();
        const password = document.getElementById('inscription-password').value.trim();
        
        if (!pseudo || !email || !password) {
            afficherMessageErreur("Veuillez remplir tous les champs.");
            return;
        }
        
        if (!estEmailValide(email)) {
            afficherMessageErreur("Veuillez entrer une adresse email valide.");
            return;
        }
        
        fetch('./index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'inscription', pseudo, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('emailPreRempli', email);
                localStorage.setItem('passwordPreRempli', password);
                
                alert(data.message);
                lienVersConnexion.click();
            } else {
                afficherMessageErreur(data.message);
            }
        })
        .catch(() => afficherMessageErreur("Erreur lors de l'inscription."));
    });

    formulaireConnexion.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('connexion-email').value.trim();
        const password = document.getElementById('connexion-password').value.trim();
    
        if (!email || !password) {
            afficherMessageErreur("Veuillez remplir tous les champs.");
            return;
        }
    
        fetch('./index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'connexion', email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('utilisateurConnecte', 'true');
                localStorage.setItem('email', email);
    
                formulaireConnexion.classList.add('hidden');
    
                const messageBienvenue = document.getElementById('message-bienvenue');
                const nomJoueur = document.getElementById('nom-joueur');
                nomJoueur.textContent = data.pseudo;
                messageBienvenue.classList.remove('hidden');
    
                setTimeout(() => {
                    messageBienvenue.classList.add('hidden');
                    window.location.href = "jeu.php";
                }, 3000);
            } else {
                afficherMessageErreur(data.message);
            }
        })
        .catch(() => afficherMessageErreur("Erreur lors de la connexion."));
    });

    formulaireMotDePasseOublie.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('mdp-oublie-email').value.trim();
    
        if (!email) {
            afficherMessageErreur("Veuillez entrer votre email.");
            return;
        }
    
        if (!estEmailValide(email)) {
            afficherMessageErreur("Veuillez entrer une adresse email valide.");
            return;
        }
    
        fetch('./reset_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                lienVersConnexion.click();
            } else {
                afficherMessageErreur(data.message);
            }
        })
        .catch(error => {
            console.error("Erreur réseau :", error);
            afficherMessageErreur("Erreur lors de la demande de réinitialisation.");
        });
    });
});
