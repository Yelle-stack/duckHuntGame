// ---------- Canards ----------
let ducks = [];
let duckCount = 1;
let duckImageNames = ["duck-left.gif", "duck-right.gif"];
let duckWidth = 96;
let duckHeight = 93;
let duckVelocityX = 5;
let duckVelocityY = 5;

// ---------- Zone de jeu ----------
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight * 3 / 4;

// ---------- Score et temps ----------
let score = 0;
let highScore = loadHighScore();
let timer = 200;

// ---------- État du jeu ----------
let gameInterval;
let timerInterval;
let dogTimeout;
let dogImage = null;
let isPaused = false;
let gameActive = false;

window.onload = function () {
    document.getElementById("play-btn").onclick = startGame;
    document.getElementById("pause-btn").onclick = togglePause;
    updateHUD();
};

// Adapte la zone de jeu si la fenêtre change de taille
window.addEventListener("resize", () => {
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight * 3 / 4;

    // Remet les canards dans la zone visible
    for (let duck of ducks) {
        duck.x = Math.max(0, Math.min(duck.x, gameWidth - duckWidth));
        duck.y = Math.max(0, Math.min(duck.y, gameHeight - duckHeight));
    }
});

// ---------- Meilleur score sauvegardé ----------
function loadHighScore() {
    try {
        return Number(localStorage.getItem("duckHighScore")) || 0;
    } catch (e) {
        return 0;
    }
}

function saveHighScore() {
    try {
        localStorage.setItem("duckHighScore", highScore);
    } catch (e) {
        // Stockage indisponible : on ignore
    }
}

// ---------- Sons ----------
function playSound(file) {
    let sound = new Audio(file);
    sound.play().catch(() => {
        // Le navigateur peut bloquer le son : on ignore l'erreur
    });
}

// ---------- Démarrage ----------
function startGame() {
    if (gameActive) return;

    gameActive = true;
    isPaused = false;
    score = 0;
    timer = 200;

    document.getElementById("play-btn").style.display = "none";
    document.getElementById("pause-btn").innerText = "Pause";
    hideMessage();
    updateHUD();
    addDucks();

    gameInterval = setInterval(moveDucks, 1000 / 60);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timer--;
            updateHUD();
            if (timer <= 0) endGame();
        }
    }, 1000);
}

// ---------- Pause / reprendre ----------
function togglePause() {
    if (!gameActive) return;
    isPaused = !isPaused;
    document.getElementById("pause-btn").innerText = isPaused ? "Reprendre" : "Pause";
}

// ---------- Génère des canards ----------
function addDucks() {
    if (!gameActive) return;

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

        duckImage.onclick = function () {
            if (isPaused || !gameActive) return;

            playSound("duck-shot.mp3");
            score += 1;
            if (score > highScore) {
                highScore = score;
                saveHighScore();
            }
            updateHUD();

            this.remove();
            ducks = ducks.filter(d => d.image !== this);
            if (ducks.length === 0) addDog(duckCount);
        };

        document.body.appendChild(duckImage);

        let duck = {
            image: duckImage,
            x: parseInt(duckImage.style.left),
            y: parseInt(duckImage.style.top),
            velocityX: duckImageName === duckImageNames[0] ? -duckVelocityX : duckVelocityX,
            velocityY: duckVelocityY
        };
        ducks.push(duck);
    }
}

// ---------- Déplace les canards ----------
function moveDucks() {
    if (isPaused || ducks.length === 0) return;

    for (let duck of ducks) {
        duck.x += duck.velocityX;
        duck.y += duck.velocityY;

        // Rebond horizontal
        if (duck.x < 0 || duck.x + duckWidth > gameWidth) {
            duck.velocityX *= -1;
            duck.x = Math.max(0, Math.min(duck.x, gameWidth - duckWidth));
            duck.image.src = duck.velocityX < 0 ? duckImageNames[0] : duckImageNames[1];
        }

        // Rebond vertical
        if (duck.y < 0 || duck.y + duckHeight > gameHeight) {
            duck.velocityY *= -1;
            duck.y = Math.max(0, Math.min(duck.y, gameHeight - duckHeight));
        }

        duck.image.style.left = `${duck.x}px`;
        duck.image.style.top = `${duck.y}px`;
    }
}

// ---------- Chien qui attrape les canards ----------
function addDog(count) {
    if (!gameActive) return;

    dogImage = document.createElement("img");
    dogImage.src = count === 1 ? "dog-duck1.png" : "dog-duck2.png";
    dogImage.width = count === 1 ? 172 : 224;
    dogImage.height = 152;
    dogImage.draggable = false;
    dogImage.style.position = "fixed";
    dogImage.style.bottom = "0px";
    dogImage.style.left = "50%";
    dogImage.style.transform = "translateX(-50%)";
    document.body.appendChild(dogImage);

    playSound("dog-score.mp3");

    dogTimeout = setTimeout(() => {
        if (dogImage) {
            dogImage.remove();
            dogImage = null;
        }
        addDucks();
    }, 3000);
}

// ---------- Position aléatoire ----------
function randomPosition(limit) {
    return Math.floor(Math.random() * Math.max(limit, 0));
}

// ---------- Met à jour l'affichage (HUD) ----------
function updateHUD() {
    document.getElementById("score").innerText = `Score : ${score}`;
    document.getElementById("highscore").innerText = `Meilleur score : ${highScore}`;
    document.getElementById("timer").innerText = `Temps : ${timer}s`;
}

// ---------- Message de fin ----------
function showMessage(text) {
    let message = document.getElementById("message");
    message.innerText = text;
    message.style.display = "block";
}

function hideMessage() {
    document.getElementById("message").style.display = "none";
}

// ---------- Fin du jeu ----------
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearTimeout(dogTimeout);

    // Nettoie l'écran : canards et chien
    ducks.forEach(d => d.image.remove());
    ducks = [];
    if (dogImage) {
        dogImage.remove();
        dogImage = null;
    }

    isPaused = false;
    timer = 0;
    updateHUD();
    document.getElementById("pause-btn").innerText = "Pause";
    document.getElementById("play-btn").style.display = "block";
    showMessage(`Temps écoulé ! Score final : ${score}`);
}