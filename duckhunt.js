let ducks;
let duckCount = 1;
let duckImageNames = ["duck-left.gif", "duck-right.gif"];
let duckWidth = 96;
let duckHeight = 93;
let duckVelocityX = 5;
let duckVelocityY = 5;

let gameWidth = window.screen.width;
let gameHeight = window.screen.height*3/4;

let score = 0;

window.onload = function() {
    // addDucks();
    setTimeout(addDucks, 2000); //wait 2 seconds
    setInterval(moveDucks, 1000/60); //60 frames per second
}

function addDucks() {
    ducks = [];
    duckCount = Math.floor(Math.random()*2) + 1;
    for (let i = 0; i < duckCount; i++) {
        let duckImageName = duckImageNames[Math.floor(Math.random()*2)];
        let duckImage = document.createElement("img");
        duckImage.src = duckImageName;
        duckImage.width = duckWidth;
        duckImage.height = duckHeight;
        duckImage.draggable = false;
        duckImage.style.position = "absolute"; //allows tag to be placed in exact location
        //document.body.appendChild(duckImage);

        duckImage.onclick = function() {
            let duckShotSound = new Audio("duck-shot.mp3");
            duckShotSound.play();
            score += 1;
            document.getElementById("score").innerHTML = score;
            document.body.removeChild(this);
            
            //remove this duck from array
            let remaining_ducks = [];
            for (let i = 0; i < ducks.length; i++) {
                if (ducks[i].image !== this) {
                    remaining_ducks.push(ducks[i]);
                }
            }

            ducks = remaining_ducks;
            if (ducks.length == 0) {
                addDog(duckCount);
            }
        }
        document.body.appendChild(duckImage);

        let duck = {
            image: duckImage,
            // x: 100,
            // y: 50,
            x: randomPosition(gameWidth - duckWidth),
            y: randomPosition(gameHeight - duckHeight),
            velocityX: duckVelocityX, //default positive x move right
            velocityY: duckVelocityY
        };
        duck.image.style.left = String(duck.x) + "px"; //x position
        duck.image.style.top = String(duck.y) + "px"; //y position

        if (duck.image.src.includes(duckImageNames[0])) {
            duck.velocityX = -duckVelocityX; //going left
        }
        ducks.push(duck);
    }
}

function moveDucks() {
    for (let i = 0 ; i < ducks.length; i++) {
        let duck = ducks[i];
        duck.x += duck.velocityX;
        if (duck.x < 0 || duck.x + duckWidth > gameWidth) {
            duck.x -= duck.velocityX;
            duck.velocityX *= -1;
            if (duck.velocityX < 0) {
                duck.image.src = duckImageNames[0]; //left
            } else {
                duck.image.src = duckImageNames[1]; //right
            }
        }
        duck.y += duck.velocityY;
        if (duck.y < 0 || duck.y + duckHeight > gameHeight) {
            duck.y -= duck.velocityY;
            duck.velocityY *= -1;
        }
        duck.image.style.left = String(duck.x) + "px";
        duck.image.style.top = String(duck.y) + "px";
    }
}

function addDog(duckCount) {
    let dogImage = document.createElement("img");
    if (duckCount == 1) {
        dogImage.src = "dog-duck1.png";
        dogImage.width = 172;
    }
    else { //2
        dogImage.src = "dog-duck2.png";
        dogImage.width = 224;
    }
    dogImage.height = 152;
    dogImage.draggable = false;

    dogImage.style.position = "fixed"; //stay in same place even when scrolling
    dogImage.style.bottom = "0px";     //bottom side of image 0px from bottom of page
    dogImage.style.left = "50%";       //left side of image 50% screen width from left side of page
    document.body.appendChild(dogImage);

    let dogScoreSound = new Audio("dog-score.mp3");
    dogScoreSound.play();

    setTimeout(function() {
        document.body.removeChild(dogImage);
        addDucks();
    }, 5000); //5000ms = 5 seconds
}

function randomPosition(limit) {
    return Math.floor((Math.random() * limit));
}