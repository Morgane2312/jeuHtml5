<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link class="logo" rel="icon" type="image/png" href="./assets/logo.png"/>
    <title>Choisissez votre Skin</title>
    <link rel="stylesheet" href="./css/skin.css">
    <link rel="stylesheet" href="./css/menu2.css">
    <link rel="stylesheet" href="./css/bootstrap.css">
    <link rel="stylesheet" href="./css/bootstrap.min.css">
</head>
<body>
    <header>
        <?php
			include('menu.php');
		?>
    </header>

    <div class="container">
        <h1>Choisissez votre Skin</h1>
        <div class="skin-selection">
            <div class="skin" data-skin="buzz">
                <img src="./assets/buzz.png" alt="Skin Buzz">
                <button class="choose-skin">Choisir</button>
            </div>
            <div class="skin" data-skin="buzz2">
                <img src="./assets/buzz2.png" alt="Skin Buzz vert">
                <button class="choose-skin">Choisir</button>
            </div>
            <div class="skin" data-skin="buzz3">
                <img src="./assets/buzz3.png" alt="Skin Buzz rose">
                <button class="choose-skin">Choisir</button>
            </div>
            <div class="skin" data-skin="buzz4">
                <img src="./assets/buzz4.png" alt="Skin Buzz Jaune">
                <button class="choose-skin">Choisir</button>
            </div>
        </div>
    </div>

    <script>
        document.querySelectorAll(".choose-skin").forEach(button => {
            button.addEventListener("click", () => {
                const chosenSkin = button.parentElement.getAttribute("data-skin");
                localStorage.setItem("chosenSkin", chosenSkin);
                alert("Skin sélectionné !");
                window.location.href = "jeu.php";
            });
        });
    </script>
     <script src="./js/doodlejump.js"></script>
     <script src="./js/menu.js"></script>
     <script src="./js/deconnexion.js"></script>
     <script src="./js/bootstrap.bundle.js"></script>
    <script src="./js/bootstrap.min.js"></script>
    <script src="./js/bootstrap.js"></script>
</body>
</html>
