let ducks = [];
let duckCount = 1;
let duckImageNames = ["duck-left.gif", "duck-right.gif"];
let duckWidth = 96;
let duckHeight = 93;
let duckVelocityX = 5;
let duckVelocityY = 5;

let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight * 3 / 4;

let score = 0;
let highScore = 0;
let timer = 500;

let gameInterval;
let timerInterval;
let isPaused = false;

window.onload = function() {
    document.getElementById("play-btn").onclick = startGame;
    document.getElementById("pause-btn").onclick = togglePause;
};

// Démarre le jeu
function startGame() {
    document.getElementById("play-btn").style.display = "none";
    score = 0;
    timer = 500;
    updateHUD();
    addDucks();

    gameInterval = setInterval(moveDucks, 1000 / 60);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timer--;
            document.getElementById("timer").innerText = `Temps : ${timer}s`;
            if (timer <= 0) endGame();
        }
    }, 1000);
}

// Pause / reprendre
function togglePause() {
    isPaused = !isPaused;
    document.getElementById("pause-btn").innerText = isPaused ? "Reprendre" : "Pause";
}

// Génère des canards
function addDucks() {
    ducks = [];
    duckCount = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < duckCount; i++) {
        let duckImageName = duckImageNames[Math.floor(Math.random() * 2)];
        let duckImage = document.createElement("img");
        duckImage.src = duckImageName;
        duckImage.width = duckWidth;
        duckImage.height = duckHeight;
        duckImage.draggable = false;
        duckImage.style.position = "absolute";
        duckImage.style.left = `${randomPosition(gameWidth - duckWidth)}px`;
        duckImage.style.top = `${randomPosition(gameHeight - duckHeight)}px`;

        duckImage.onclick = function() {
            if (!isPaused) {
                let duckShotSound = new Audio("duck-shot.mp3");
                duckShotSound.play();
                score += 1;
                if (score > highScore) highScore = score;
                updateHUD();
                document.body.removeChild(this);
                ducks = ducks.filter(d => d.image !== this);
                if (ducks.length == 0) addDog(duckCount);
            }
        }

        document.body.appendChild(duckImage);

        let duck = {
            image: duckImage,
            x: parseInt(duckImage.style.left),
            y: parseInt(duckImage.style.top),
            velocityX: duckImage.src.includes(duckImageNames[0]) ? -duckVelocityX : duckVelocityX,
            velocityY: duckVelocityY
        };
        ducks.push(duck);
    }
}

// Déplace les canards
function moveDucks() {
    if (isPaused || ducks.length === 0) return;

    for (let duck of ducks) {
        duck.x += duck.velocityX;
        duck.y += duck.velocityY;

        if (duck.x < 0 || duck.x + duckWidth > gameWidth) {
            duck.velocityX *= -1;
            duck.image.src = duck.velocityX < 0 ? duckImageNames[0] : duckImageNames[1];
        }

        if (duck.y < 0 || duck.y + duckHeight > gameHeight) {
            duck.velocityY *= -1;
        }

        duck.image.style.left = `${duck.x}px`;
        duck.image.style.top = `${duck.y}px`;
    }
}

// Chien qui attrape les canards
function addDog(duckCount) {
    let dogImage = document.createElement("img");
    dogImage.src = duckCount == 1 ? "dog-duck1.png" : "dog-duck2.png";
    dogImage.width = duckCount == 1 ? 172 : 224;
    dogImage.height = 152;
    dogImage.draggable = false;
    dogImage.style.position = "fixed";
    dogImage.style.bottom = "0px";
    dogImage.style.left = "50%";
    dogImage.style.transform = "translateX(-50%)";
    document.body.appendChild(dogImage);

    let dogScoreSound = new Audio("dog-score.mp3");
    dogScoreSound.play();

    setTimeout(() => {
        document.body.removeChild(dogImage);
        addDucks();
    }, 3000);
}

// Génère position aléatoire
function randomPosition(limit) {
    return Math.floor(Math.random() * limit);
}

// Met à jour l’HUD
function updateHUD() {
    document.getElementById("score").innerText = `Score : ${score}`;
    document.getElementById("highscore").innerText = `Meilleur score : ${highScore}`;
}

// Fin du jeu
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    alert(`Temps écoulé ! Score final : ${score}`);
    document.getElementById("play-btn").style.display = "block";
}
