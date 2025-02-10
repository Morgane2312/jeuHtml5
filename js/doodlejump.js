let board;
let boardWidth = 380;
let boardHeight = 650;
let context;

// Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImg, doodlerLeftImg, doodlerDefaultImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight,
};

// Physique
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -5;
let gravity = 0.1;

// Plateformes
let platformArray = [];
let platformWidth = 60;
let platformHeight = 20;
let platformImg;

// Gestion du jeu
let score = 0;
let gameOver = false;
let jeuDemarre = false;

let backgroundImg, backgroundImg2, backgroundImg3, backgroundImg4, backgroundImg5;
let platformImg2;

let touchThreshold = 10;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight - 60;
    board.width = boardWidth;
    context = board.getContext("2d");

    const chosenSkin = localStorage.getItem("chosenSkin") || "buzz";

    doodlerRightImg = new Image();
    doodlerLeftImg = new Image();
    doodlerDefaultImg = new Image();

    if (chosenSkin === "buzz") {
        doodlerRightImg.src = "./assets/buzz-right.png";
        doodlerLeftImg.src = "./assets/buzz-left.png";
        doodlerDefaultImg.src = "./assets/buzz.png";
    } else if (chosenSkin === "buzz2") {
        doodlerRightImg.src = "./assets/buzz2-right.png";
        doodlerLeftImg.src = "./assets/buzz2-left.png";
        doodlerDefaultImg.src = "./assets/buzz2.png";
    } else if (chosenSkin === "buzz3") {
        doodlerRightImg.src = "./assets/buzz3-right.png";
        doodlerLeftImg.src = "./assets/buzz3-left.png";
        doodlerDefaultImg.src = "./assets/buzz3.png";
    } else if (chosenSkin === "buzz4") {
        doodlerRightImg.src = "./assets/buzz4-right.png";
        doodlerLeftImg.src = "./assets/buzz4-left.png";
        doodlerDefaultImg.src = "./assets/buzz4.png";
    }

    doodler.img = doodlerDefaultImg;

    platformImg = new Image();
    platformImg.src = "./assets/foot.png";

    platformImg2 = new Image();
    platformImg2.src = "./assets/foot2.png";

    platformImg3 = new Image();
    platformImg3.src = "./assets/foot3.png";

    platformImg4 = new Image();
    platformImg4.src = "./assets/foot4.png";

    platformImg5 = new Image();
    platformImg5.src = "./assets/foot5.png";

    backgroundImg = new Image();
    backgroundImg.src = "./assets/bg.png";

    backgroundImg2 = new Image();
    backgroundImg2.src = "./assets/bg2.png";

    backgroundImg3 = new Image();
    backgroundImg3.src = "./assets/bg3.png";

    backgroundImg4 = new Image();
    backgroundImg4.src = "./assets/bg4.png";

    backgroundImg5 = new Image();
    backgroundImg5.src = "./assets/bg5.png";



    velocityY = initialVelocityY;
    placePlatforms();

    afficherMessageDemarrage();

    board.addEventListener("mousedown", handleMouseClick);
    board.addEventListener("touchend", handleTouchClick, { passive: true });


    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    board.addEventListener("touchstart", handleTouchStart, { passive: true });
    board.addEventListener("touchmove", handleTouchMove, { passive: false });
    board.addEventListener("touchend", handleTouchEnd); 

    const media1 = window.matchMedia("(max-width:1000px)");
    const media2 = window.matchMedia("(min-width:1000px)");
     
    window.addEventListener('resize', function(){

        console.log("Je me resize");
        
        if(media1.matches){

            board.style.height = "100%"
            board.style.width = "100%"

        }else if(media2.matches){

            board.style.height = "100%"
            board.style.width = "100%"
        }
    })
};

let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isTouching = true;
}

function handleTouchMove(e) {
    if (!isTouching) return;

    touchCurrentX = e.touches[0].clientX;
    let moveDistance = touchCurrentX - touchStartX;

    if (moveDistance > touchThreshold) {
        velocityX = Math.min(6, moveDistance / 10);
        doodler.img = doodlerRightImg;
    } else if (moveDistance < -touchThreshold) {
        velocityX = Math.max(-6, moveDistance / 10);
        doodler.img = doodlerLeftImg;
    } else {
        velocityX = 0;
        doodler.img = doodlerDefaultImg;
    }

    e.preventDefault(); 
}

function handleTouchEnd(e) {
    isTouching = false; 
    velocityX = 0; 
    doodler.img = doodlerDefaultImg; 

    e.preventDefault();
}



afficherMessageDemarrage = function () {
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.font = "20px sans-serif";
    context.fillText(
        "Touche l'écran pour jouer !",
        (boardWidth - context.measureText("Touche l'écran pour jouer !").width) / 2,
        boardHeight / 2
    );
};

function handleMouseClick() {
    if (!jeuDemarre || gameOver) {
        resetGame();
        jeuDemarre = true;
        gameOver = false;
        requestAnimationFrame(update);
    }
}

function handleTouchClick() {
    if (!jeuDemarre || gameOver) {
        resetGame();
        jeuDemarre = true;
        gameOver = false;
        requestAnimationFrame(update);
    }
}


function update() {
    if (!jeuDemarre || gameOver) return;

    requestAnimationFrame(update);

    const gameContainer = document.getElementById('game-container');

    if (score >= 600) {
        gameContainer.style.backgroundColor = "#621F51";
    } else if (score >= 400) {
        gameContainer.style.backgroundColor = "#486220";
    } else if (score >= 200) {
        gameContainer.style.backgroundColor = "#621F20";
    } else {
        gameContainer.style.backgroundColor = "#29235C";
    }

    if (score >= 200) {
        backgroundImg = backgroundImg2;
    }
    if (score >= 140) {
        platformImg = platformImg2;
    }

    if (score >= 400) {
        backgroundImg2 = backgroundImg3;
    }
    if (score >= 340) {
        platformImg2 = platformImg3;
    }

    if (score >= 600) {
        backgroundImg3 = backgroundImg4;
    }
    if (score >= 540) {
        platformImg3 = platformImg4;
    }

    if (score >= 800) {
        backgroundImg4 = backgroundImg5;
    }

    if (score >= 740) {
        platformImg3 = platformImg4;
    }


    context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

    doodler.x += velocityX;
    if (doodler.x > boardWidth) doodler.x = 0;
    if (doodler.x + doodler.width < 0) doodler.x = boardWidth;

    velocityY += gravity;
    doodler.y += velocityY;

    if (velocityY < 0 && doodler.y < boardHeight / 2) {
        doodler.y = boardHeight / 2;

        for (let i = 0; i < platformArray.length; i++) {
            platformArray[i].y -= velocityY;
        }

        while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
            platformArray.shift();
            newPlatform();
        }
    }

    if (doodler.y > boardHeight) {
        gameOver = true;
        afficherGameOver();
        return;
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY;
            if (!platform.scored) {
                score += 20;
                platform.scored = true;
            }
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    context.fillStyle = "white";
    context.font = "16px sans-serif";
    context.fillText("Score: " + score, 5, 20);
}



function handleKeyDown(e) {
    if (jeuDemarre && !gameOver) {
        if (e.code === "ArrowRight" || e.code === "KeyD") {
            velocityX = 4;
            doodler.img = doodlerRightImg;
        }
        else if (e.code === "ArrowLeft" || e.code === "KeyA") {
            velocityX = -4;
            doodler.img = doodlerLeftImg;
        }
    }

    if (e.code === "Space") {
        if (!jeuDemarre || gameOver) {
            resetGame();
            jeuDemarre = true;
            gameOver = false;
            requestAnimationFrame(update);
        }
    }
}

function handleKeyUp(e) {
    if (jeuDemarre && !gameOver) {
        if (
            e.code === "ArrowRight" || e.code === "KeyD" || 
            e.code === "ArrowLeft" || e.code === "KeyA"
        ) {
            velocityX = 0;
            doodler.img = doodlerDefaultImg;
        }
    }
}

function resetGame() {
    const chosenSkin = localStorage.getItem("chosenSkin") || "buzz";
    if (chosenSkin === "buzz") {
        doodlerRightImg.src = "./assets/buzz-right.png";
        doodlerLeftImg.src = "./assets/buzz-left.png";
        doodlerDefaultImg.src = "./assets/buzz.png";
    } else if (chosenSkin === "buzz2") {
        doodlerRightImg.src = "./assets/buzz2-right.png";
        doodlerLeftImg.src = "./assets/buzz2-left.png";
        doodlerDefaultImg.src = "./assets/buzz2.png";
    } else if (chosenSkin === "buzz3") {
        doodlerRightImg.src = "./assets/buzz3-right.png";
        doodlerLeftImg.src = "./assets/buzz3-left.png";
        doodlerDefaultImg.src = "./assets/buzz3.png";
    } else if (chosenSkin === "buzz4") {
        doodlerRightImg.src = "./assets/buzz4-right.png";
        doodlerLeftImg.src = "./assets/buzz4-left.png";
        doodlerDefaultImg.src = "./assets/buzz4.png";
    }
    doodler = {
        img: doodlerDefaultImg,
        x: doodlerX,
        y: doodlerY,
        width: doodlerWidth,
        height: doodlerHeight,
    };
    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    gameOver = false;

    platformImg = new Image();
    platformImg.src = "./assets/foot.png";

    platformImg2 = new Image();
    platformImg2.src = "./assets/foot2.png";

    backgroundImg = new Image();
    backgroundImg.src = "./assets/bg.png";

    backgroundImg2 = new Image();
    backgroundImg2.src = "./assets/bg2.png";

    backgroundImg3 = new Image();
    backgroundImg3.src = "./assets/bg3.png";

    backgroundImg4 = new Image();
    backgroundImg4.src = "./assets/bg4.png";

    backgroundImg5 = new Image();
    backgroundImg5.src = "./assets/bg5.png";;

    refreshPlatforms(platformImg);
    placePlatforms();
}

function refreshPlatforms(newImage) {
    for (let i = 0; i < platformArray.length; i++) {
        platformArray[i].img = newImage;
    }
}

function placePlatforms() {
    platformArray = []; 
    let platform = {
        img: platformImg,
        x: boardWidth / 2 - platformWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight,
        scored: false,
    };
    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(boardWidth / 4 + Math.random() * boardWidth / 2);
        let previousPlatformY = platformArray[i].y;
        let platform = {
            img: platformImg,
            x: randomX,
            y: previousPlatformY - 80 - Math.floor(Math.random() * 20),
            width: platformWidth,
            height: platformHeight,
            scored: false,
        };
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(boardWidth / 4 + Math.random() * boardWidth / 2);
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight,
        scored: false,
    };
    platformArray.push(platform);
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function enregistrerScore(score) {
    const email = localStorage.getItem('email');
    if (!email) {
        console.error("Impossible d'enregistrer le score : aucun email trouvé.");
        return;
    }

    fetch('./jeu.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
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
            afficherMessageScore(`🎉 Nouveau highscore ! Score : ${data.highscore}`);
        } else if (data.status === 'info') {
            console.warn(`Score non mis à jour : ${data.message}`);
            afficherMessageScore(`😕 Votre score (${score}) est inférieur ou égal au highscore actuel (${data.highscore}).`);            
        } else {
            console.error("Erreur :", data.message);
            afficherMessageScore("❌ Erreur : " + data.message);
        }
    })
    .catch(error => {
        console.error("Erreur de connexion au serveur :", error);
        afficherMessageScore("❌ Problème de connexion au serveur.");
    });
}

function afficherMessageScore(message) {
    let messageDiv = document.getElementById("messageScore");

    if (!messageDiv) {
        messageDiv = document.createElement("div");
        messageDiv.id = "messageScore";
        messageDiv.style.position = "absolute";
        messageDiv.style.top = "20px";
        messageDiv.style.left = "50%";
        messageDiv.style.transform = "translateX(-50%)";
        messageDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        messageDiv.style.color = "white";
        messageDiv.style.padding = "10px 20px";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.zIndex = "1000";
        document.body.appendChild(messageDiv);
    }

    messageDiv.innerText = message;

    setTimeout(() => {
        messageDiv.remove();
    }, 3000); // Supprime le message après 3 secondes
}

// 📌 Mets-la juste AVANT cette fonction :
function afficherGameOver() {
    console.log("Email récupéré depuis le localStorage :", localStorage.getItem('email'));

    enregistrerScore(score);

    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.font = "bold 32px Arial";
    const gameOverText = "Game Over";
    context.fillText(
        gameOverText,
        (board.width - context.measureText(gameOverText).width) / 2,
        board.height / 2 - 50
    );

    context.font = "20px Arial";
    context.fillStyle = "white";
    const scoreMessage = `Votre score : ${score} points`;
    context.fillText(
        scoreMessage,
        (board.width - context.measureText(scoreMessage).width) / 2,
        board.height / 2
    );

    context.font = "16px Arial";
    context.fillStyle = "lightgray";
    const restartMessage = "Appuyez sur 'Espace' pour recommencer";
    context.fillText(
        restartMessage,
        (board.width - context.measureText(restartMessage).width) / 2,
        board.height / 2 + 30
    );
}
