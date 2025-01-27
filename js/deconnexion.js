document.addEventListener('DOMContentLoaded', function () {
    const boutonDeconnexion = document.getElementById('bouton-deconnexion');

    if (boutonDeconnexion) {
        boutonDeconnexion.addEventListener('click', function (e) {
            e.preventDefault();

            fetch('./index.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ action: 'deconnexion' })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Réponse serveur :", data);
                if (data.status === 'success') {
                    localStorage.removeItem('utilisateurConnecte');
                    localStorage.removeItem('email');
                    
                    alert("Déconnexion réussie !");
                    window.location.href = "index.php";
                } else {
                    alert("Erreur lors de la déconnexion.");
                }
            })
            .catch(error => {
                console.error("Erreur Fetch :", error);
                alert("Erreur lors de la requête de déconnexion.");
            });
        });
    }
});
