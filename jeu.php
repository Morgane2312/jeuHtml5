<?php
session_start();
if (!isset($_SESSION['utilisateur'])) {
    echo "Session non active. Redirection...";
    header("Location: index.php");
    exit;
}

require_once './bdd/bdd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $action = $_POST['action'] ?? null;
    $email = $_POST['email'] ?? null;
    $score = intval($_POST['score'] ?? 0);

    if ($action === 'update_score') {
        if (!$email || !$score || $score <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'Email ou score invalide.']);
            exit;
        }
    
        try {
            $stmt = $pdo->prepare("SELECT highscore, pseudo FROM utilisateurs WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
    
            if ($user) {
                $currentHighscore = $user['highscore'];
                $pseudo = $user['pseudo'];
    
                if ($score > $currentHighscore) {
                    $updateStmt = $pdo->prepare("UPDATE utilisateurs SET highscore = ?, date_score = NOW() WHERE email = ?");
                    $updateStmt->execute([$score, $email]);
    
                    $deleteStmt = $pdo->prepare("DELETE FROM highscores WHERE email = ?");
                    $deleteStmt->execute([$email]);
    
                    $insertStmt = $pdo->prepare("INSERT INTO highscores (email, score, date_score, pseudo) VALUES (?, ?, NOW(), ?)");
                    $insertStmt->execute([$email, $score, $pseudo]);
    
                    $pdo->exec("DELETE FROM highscores WHERE id NOT IN (
                        SELECT id FROM (
                            SELECT id FROM highscores ORDER BY score DESC, date_score ASC LIMIT 10
                        ) AS temp
                    )");
    
                    echo json_encode(['status' => 'success', 'message' => 'Nouveau highscore enregistré !', 'highscore' => $score]);
                } else {
                    echo json_encode([
                        'status' => 'info',
                        'message' => "Score inférieur ou égal au highscore actuel.",
                        'highscore' => $currentHighscore
                    ]);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Utilisateur non trouvé.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur : ' . $e->getMessage()]);
        }
        exit;
    }
    
}
?>


<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link class="logo" rel="icon" type="image/png" href="./assets/logo.png"/>
    <title>Buzz Jump</title>
    <link rel="stylesheet" href="./css/doodlejump.css">
    <link rel="stylesheet" href="./css/menu.css">
    <link rel="stylesheet" href="./css/bootstrap.css">
    <link rel="stylesheet" href="./css/bootstrap.min.css">
</head>
<body>
    <div id="game-container">
        <header>
            <?php include('menu.php'); ?>
        </header>
        <canvas id="board"></canvas>
    </div>

    <script>const email = localStorage.getItem('email');
        if (!email) {
            alert("Vous devez être connecté pour jouer.");
            window.location.href = "index.php";
        }
    </script>

    <script src="./js/doodlejump.js"></script>
    <script src="./js/touch.js"></script>
    <script src="./js/score.js"></script>
    <script src="./js/menu.js"></script>
    <script src="./js/deconnexion.js"></script>
    <script src="./js/bootstrap.bundle.js"></script>
    <script src="./js/bootstrap.min.js"></script>
    <script src="./js/bootstrap.js"></script>
</body>
</html>
