<?php
session_start();

ob_start();
require_once './bdd/bdd.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données.']);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;
    $pseudo = trim($_POST['pseudo'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($action === 'inscription') {
        try {
            if (!$pseudo || !$email || !$password) {
                echo json_encode(['status' => 'error', 'message' => 'Champs invalides ou manquants.']);
                exit;
            }
    
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['status' => 'error', 'message' => 'Adresse email invalide.']);
                exit;
            }
    
            $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                echo json_encode(['status' => 'error', 'message' => 'Cet email est déjà utilisé.']);
                exit;
            }
    
            $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE pseudo = ?");
            $stmt->execute([$pseudo]);
            if ($stmt->fetch()) {
                echo json_encode(['status' => 'error', 'message' => 'Ce pseudo est déjà pris.']);
                exit;
            }
    
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO utilisateurs (pseudo, email, password, highscore) VALUES (?, ?, ?, 0)");
            $stmt->execute([$pseudo, $email, $passwordHash]);
    
            echo json_encode(['status' => 'success', 'message' => 'Inscription réussie !']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'inscription : ' . $e->getMessage()]);
        }
        exit;
    }
    
    
    if ($action === 'connexion') {
        try {
            if (!$email || !$password) { 
                echo json_encode(['status' => 'error', 'message' => 'Champs invalides ou manquants.']);
                exit;
            }
    
            $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
    
            if ($user && password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['utilisateur'] = [
                    'pseudo' => $user['pseudo'],
                    'email' => $user['email']
                ];
                echo json_encode(['status' => 'success', 'message' => 'Connexion réussie !', 'pseudo' => $user['pseudo']]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Email ou mot de passe incorrect.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la connexion : ' . $e->getMessage()]);
        }
        exit;
    }
    
    
    if ($action === 'deconnexion') {
        session_unset();
        session_destroy();
    
        if (session_status() === PHP_SESSION_NONE) {
            echo json_encode(['status' => 'success', 'message' => 'Déconnexion réussie.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Impossible de détruire la session.']);
        }
        exit;
    }
    
}
ob_end_clean();
?>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jeu Bleuebuzz - Connexion</title>
    <link rel="stylesheet" href="./css/styles.css">
    <link class="logo" rel="icon" type="image/png" href="./assets/logo.png"/>
</head>
<body>
    <div class="conteneur">
        <div id="section-formulaire">
            <div id="message-erreur" class="hidden"></div>
            
            <form id="formulaire-connexion">
                <h2>Connexion</h2>
                
                <label for="connexion-email"></label>
                <input type="email" id="connexion-email" placeholder="Email" required autocomplete="email">
                
                <label for="connexion-password"></label>
                <div class="password-container">
                    <input type="password" id="connexion-password" placeholder="Mot de passe" required autocomplete="current-password">
                    <img src="./assets/eye.png" alt="Voir mot de passe" class="eye-icon" id="toggle-password-connexion">
                </div>
                
                <button type="submit">Se connecter</button>
                
                <p class="texte-liens">
                    Pas de compte ? <a href="#" id="lien-vers-inscription">Inscrivez-vous</a>
                </p>
                <p class="texte-liens">
                    <a href="#" id="lien-mdp-oublie">Mot de passe oublié ?</a>
                </p>
            </form>

            <form id="formulaire-inscription" class="hidden">
                <h2>Inscription</h2>
                
                <label for="inscription-pseudo"></label>
                <input type="text" id="inscription-pseudo" placeholder="Pseudo" required autocomplete="username">
                
                <label for="inscription-email"></label>
                <input type="email" id="inscription-email" placeholder="Email" required autocomplete="email">
                
                <label for="inscription-password"></label>
                <div class="password-container">
                    <input type="password" id="inscription-password" placeholder="Mot de passe" required autocomplete="new-password">
                    <img src="./assets/eye.png" alt="Voir mot de passe" class="eye-icon" id="toggle-password-inscription">
                </div>
                
                <button type="submit">S'inscrire</button>
                
                <p class="texte-liens">
                    Déjà un compte ? <a href="#" id="lien-vers-connexion">Connectez-vous</a>
                </p>
            </form>

            <form id="formulaire-mot-de-passe-oublie" class="hidden">
                <h2>Mot de passe oublié</h2>
                
                <label for="mdp-oublie-email"></label>
                <input type="email" id="mdp-oublie-email" placeholder="Votre email" required autocomplete="email">
                
                <button type="submit">Envoyer un lien de réinitialisation</button>
                
                <p class="texte-liens">
                    <a href="#" id="lien-retour-connexion">Retour à la connexion</a>
                </p>
            </form>
        </div>

        <div id="message-bienvenue" class="hidden">
            <img src="./assets/buzz.png" alt="Buzz" class="buzz">
            <h2>Bienvenue, <span id="nom-joueur"></span>!</h2>
        </div>
    </div>

    <script src="./js/script.js"></script>
    <script src="./js/eye.js"></script>
</body>
</html>





