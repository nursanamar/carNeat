var im_car_green;
var im_car_red;
var im_boom;
var im_heart;
var font;
var playerSpeed = 10;
var opponents = [];
var roadMarkings = [];
var score = 0;
var lives = 5;


let Ga = new GA(100,0.1,Brain);
let players = [];
let diedCount = 0;
let scorePanel;
let generationCount;
let isLoop = false;

function preload() {
    im_car_green = loadImage('assets/Car_Green.png');
    im_car_red = loadImage('assets/Car_Red.png');
    im_boom = loadImage('assets/boom.png');
    im_heart = loadImage('assets/heart.png');
    font = loadFont('assets/8-bit.ttf');
}

function setup() {
    createCanvas(400, 600);
    //frameRate(50);
    scorePanel = createP('Hight score :' + Ga.highScore);
    generationCount = createP('Generation :' + Ga.generation);
    roadMarkings.push(new roadMarking());
    opponents.push(new Opponent());
    
    Ga.population.forEach(brain => {
        players.push(new Player(brain));
    })
}

function draw() {
    background(44, 44, 44);

    // New road markings appear after certain number of frames
    if (frameCount % 25 === 0) {
        roadMarkings.push(new roadMarking());
    }

    // Show road markings
    for (var i = roadMarkings.length-1 ; i >= 0 ; i--) {
        roadMarkings[i].show();
        roadMarkings[i].update();

        // Remove road markings once the are off the screen
        if (roadMarkings[i].offscreen()) {
            roadMarkings.splice(i, 1);
        }
    }

    // New opponents appear after certain number of frames
    if (frameCount % 130 === 0) {
        opponents.push(new Opponent());
    }

    // Show opponents
    for (var i = opponents.length-1 ; i >= 0 ; i--) {
        opponents[i].show();
        opponents[i].update();

        // Remove opponents once the are off the screen
        if (opponents[i].offscreen()) {
            opponents.splice(i, 1);
        }
    }

    // Show the player
    players.forEach(player => {
        if (!player.died) {
            player.show();
            player.see(opponents);
            player.think();

            if (player.died) {
                diedCount += 1;
            }
        }
    })


    // Check if game is over
    if (players.length <= diedCount) {
        noLoop();
        diedCount = 0;
       newGame();
    }
}

function newGame() {
    opponents = [];
    // roadMarkings = [];

    // roadMarkings.push(new roadMarking());
    opponents.push(new Opponent());

    Ga.newGeneration();

    players = [];

    Ga.population.forEach(brain => {
        players.push(new Player(brain));
    })

    scorePanel.html('Hight score :' + Ga.highScore);
    generationCount.html('Generation  :' + Ga.generation);

    loop();
}

function keyPressed() {
    if (keyCode === ENTER) {
        if (isLoop) {
            noLoop();
        }else{
            loop();
        }

        isLoop = !isLoop;
    }
}