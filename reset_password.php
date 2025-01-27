<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require './vendor/autoload.php';
require_once './bdd/bdd.php';

header('Content-Type: application/json');

$error = '';
$success = '';

try {

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $email = trim($_POST['email'] ?? '');

    if (empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Veuillez fournir une adresse email.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'Adresse email non trouvée.']);
        exit;
    }

    $token = bin2hex(random_bytes(50));

    $stmt = $pdo->prepare("REPLACE INTO password_resets (email, token, expiration) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))");
    $stmt->execute([$email, $token]);

    $resetLink = "http://localhost:8888/Buzz%20Jump/reset_password.php?token=$token";
    error_log("Lien de réinitialisation : $resetLink");

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->Host = "smtp.domaine.fr";
        $mail->Port = 587;
        $mail->Username = "nom.nomdefamille@domaine.fr";
        $mail->Password = "motdepasse4321";
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        // Expéditeur
        $mail->setFrom('info@exemple.fr', 'nom');
        // Destinataire dont le nom peut également être indiqué en option
        $mail->addAddress('info@exemple.fr', 'nom');
        // Copie
        $mail->addCC('info@exemple.fr');
        // Copie cachée
        $mail->addBCC('info@exemple.fr', 'nom');

        $mail->isHTML(true);
        $mail->Subject = 'Réinitialisation de votre mot de passe';
        $mail->Body    = "Bonjour,<br><br>
                          Cliquez sur le lien suivant pour réinitialiser votre mot de passe :<br>
                          <a href='$resetLink'>$resetLink</a><br><br>
                          Ce lien est valide pendant 1 heure.<br><br>
                          Merci !";
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Un email de réinitialisation a été envoyé.']);
        exit;

    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "L'email n'a pas pu être envoyé. Erreur : {$mail->ErrorInfo}"]);
        exit;
    }

    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Erreur de base de données : ' . $e->getMessage()]);
        exit;
    }
?>




<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réinitialisation du mot de passe</title>
    <link rel="stylesheet" href="./css/styles.css">
</head>
<body>
    <div class="conteneur">
        <h2>Réinitialisation du mot de passe</h2>

        <?php if (!empty($error)): ?>
            <div style="color: red;"><?= htmlspecialchars($error) ?></div>
        <?php elseif (!empty($success)): ?>
            <div style="color: green;"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>

        <?php if (empty($success) && empty($error)): ?>
            <form method="POST" action="">
                <label for="password">Nouveau mot de passe :</label>
                <input type="password" name="password" id="password" required>

                <label for="confirm_password">Confirmez le mot de passe :</label>
                <input type="password" name="confirm_password" id="confirm_password" required>

                <button type="submit">Réinitialiser le mot de passe</button>
            </form>
        <?php endif; ?>

        <a href="index.php">Retour à la connexion</a>
    </div>
</body>
<script src="./js/script.js"></script>
</html>
