<?php
session_start();
require_once './config/bdd.php';

file_put_contents('debug_log.txt', "Données reçues : " . print_r($_POST, true) . "\n", FILE_APPEND);

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données.']));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? null;
    $pseudo = trim($_POST['pseudo'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($action === 'inscription') {
        try {
            if (!$pseudo || !$email || !$password) {
                die(json_encode(['status' => 'error', 'message' => 'Tous les champs sont obligatoires.']));
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                die(json_encode(['status' => 'error', 'message' => 'Adresse email invalide.']));
            }

            $stmt = $pdo->prepare("SELECT id FROM utilisateurs WHERE email = ? OR pseudo = ?");
            $stmt->execute([$email, $pseudo]);
            if ($stmt->fetch()) {
                die(json_encode(['status' => 'error', 'message' => 'Email ou pseudo déjà utilisé.']));
            }

            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO utilisateurs (pseudo, email, password, highscore) VALUES (?, ?, ?, 0)");
            $stmt->execute([$pseudo, $email, $passwordHash]);

            die(json_encode(['status' => 'success', 'message' => 'Inscription réussie !']));
        } catch (PDOException $e) {
            die(json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'inscription : ' . $e->getMessage()]));
        }
    }

    if ($action === 'connexion') {
        try {
            if (!$email || !$password) { 
                die(json_encode(['status' => 'error', 'message' => 'Tous les champs sont obligatoires.']));
            }

            $stmt = $pdo->prepare("SELECT pseudo, email, password FROM utilisateurs WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['utilisateur'] = [
                    'pseudo' => $user['pseudo'],
                    'email' => $user['email']
                ];
                die(json_encode(['status' => 'success', 'message' => 'Connexion réussie !', 'pseudo' => $user['pseudo']]));
            } else {
                die(json_encode(['status' => 'error', 'message' => 'Email ou mot de passe incorrect.']));
            }
        } catch (PDOException $e) {
            die(json_encode(['status' => 'error', 'message' => 'Erreur lors de la connexion : ' . $e->getMessage()]));
        }
    }

    if ($action === 'deconnexion') {
        session_unset();
        session_destroy();
        die(json_encode(['status' => 'success', 'message' => 'Déconnexion réussie.']));
    }
}

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
                <input type="email" id="connexion-email" placeholder="Email" required autocomplete="email">
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
                <input type="text" id="inscription-pseudo" placeholder="Pseudo" required autocomplete="username">
                <input type="email" id="inscription-email" placeholder="Email" required autocomplete="email">
                <div class="password-container">
                    <input type="password" id="inscription-password" placeholder="Mot de passe" required autocomplete="new-password">
                    <img src="./assets/eye.png" alt="Voir mot de passe" class="eye-icon" id="toggle-password-inscription">
                </div>
                <button type="submit">S'inscrire</button>
                <p class="texte-liens">
                    Déjà un compte ? <a href="#" id="lien-vers-connexion">Connectez-vous</a>
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
