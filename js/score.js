document.addEventListener('DOMContentLoaded', function () {
    const formulaireConnexion = document.getElementById('formulaire-connexion');
    const connexionPseudo = document.getElementById('connexion-pseudo');
    const connexionEmail = document.getElementById('connexion-email');
    const messageErreur = document.getElementById('message-erreur');

    function afficherMessageErreur(message) {
        if (messageErreur) {
            messageErreur.textContent = message;
            messageErreur.classList.remove('hidden');
        } else {
            alert(message);
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

    if (formulaireConnexion && connexionPseudo && connexionEmail) {
        formulaireConnexion.addEventListener('submit', function (e) {
            e.preventDefault();

            const pseudo = connexionPseudo.value.trim();
            const email = connexionEmail.value.trim();

            if (!pseudo || !email) {
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
                body: new URLSearchParams({
                    action: 'connexion',
                    pseudo: pseudo,
                    email: email
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur réseau : ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'success') {
                        localStorage.setItem('utilisateurConnecte', 'true');
                        localStorage.setItem('email', email);
                        alert(data.message);
                        window.location.href = "jeu.php";
                    } else {
                        afficherMessageErreur(data.message);
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la connexion :", error);
                    afficherMessageErreur("Une erreur est survenue. Veuillez réessayer.");
                });
        });
    }

    function enregistrerScore(score) {
        const email = localStorage.getItem('email');
        if (!email) {
            console.error("Impossible d'enregistrer le score : aucun utilisateur connecté.");
            alert("Vous devez être connecté pour enregistrer votre score.");
            return;
        }
    
        fetch('./jeu.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'update_score',
                email: email,
                score: score
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log("Score enregistré avec succès !");
                alert(`🎉 Nouveau highscore ! Score : ${data.highscore}`);
            } else if (data.status === 'info') {
                alert(`😕 Votre score (${score}) est inférieur ou égal au highscore actuel (${data.highscore}).`);
            } else {
                alert("❌ Erreur : " + data.message);
            }
        })
        .catch(error => {
            console.error("Erreur lors de l'enregistrement du score :", error);
            alert("❌ Une erreur est survenue lors de l'enregistrement du score.");
        });
    }
    
    

    function afficherMessageScore(message) {
        const messageZone = document.getElementById('zone-message-score');
        if (messageZone) {
            messageZone.textContent = message;
            messageZone.classList.remove('hidden');
        } else {
            alert(message);
        }
    }

    window.enregistrerScore = enregistrerScore;
});