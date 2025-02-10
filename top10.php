<?php
require_once './config/bdd.php';

try {
    $stmt = $pdo->prepare("
        SELECT pseudo, email, highscore AS score, date_score
        FROM utilisateurs
        WHERE highscore > 0
        ORDER BY highscore DESC, date_score ASC
        LIMIT 10
    ");
    $stmt->execute();
    $topScores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $pdo->exec("TRUNCATE TABLE highscores");
    $insertStmt = $pdo->prepare("
        INSERT INTO highscores (pseudo, email, score, date_score)
        VALUES (:pseudo, :email, :score, :date_score)
    ");
    foreach ($topScores as $score) {
        $insertStmt->execute([
            ':pseudo' => $score['pseudo'],
            ':email' => $score['email'],
            ':score' => $score['score'],
            ':date_score' => $score['date_score']
        ]);
    }

    $stmt = $pdo->prepare("SELECT pseudo, score, date_score FROM highscores ORDER BY score DESC, date_score ASC");
    $stmt->execute();
    $highScores = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    die("Erreur lors de la synchronisation ou récupération des scores : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link class="logo" rel="icon" type="image/png" href="./assets/logo.png"/>
    <title>Top 10 Scores</title>
    <link rel="stylesheet" href="./css/top10.css">
    <link rel="stylesheet" href="./css/menu2.css">
</head>
<body>
    <header>
        <?php
            include('menu.php');
        ?>
    </header>
    <div class="conteneur">
        <h1>Top 10 des meilleurs scores</h1>
        <table border="1">
            <thead>
                <tr>
                    <th>Rang</th>
                    <th>Pseudo</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($highScores)): ?>
                    <?php foreach ($highScores as $index => $row): ?>
                        <tr>
                            <td><?= $index + 1 ?></td>
                            <td><?= htmlspecialchars($row['pseudo']) ?></td>
                            <td><?= htmlspecialchars($row['score']) ?></td>
                            <td><?= htmlspecialchars($row['date_score']) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="4">Aucun score trouvé</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <script src="./js/menu.js"></script>
    <script src="./js/deconnexion.js"></script>
</body>
</html>
