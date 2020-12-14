var bg, bgImg,jumpSound;
var thief, thiefImg;
var road, roadImg, invRoad;
var police, policeImg, policeGroup;
var gameOver,gameOverImg,restart,restartImg;
var score=0,
  hiScore = 0;
var END = 0;
var PLAY = 1;
var STORY = 2;
var gameState = 2;

function preload() {
  bgImg = loadImage("Background.png");
  thiefImg = loadAnimation("Thief.png", "thief 1.png", "thief 2.png", "thief 3.png", "thief 4.png");
  policeImg = loadImage("Police.png");
  roadImg = loadImage("road.png");
  gameOverImg=loadImage("GameOver.png");
  restartImg=loadImage("Restart.png");
  jumpSound=loadSound("JumpSound.wav");
  gameOverSound=loadSound("GameOver.wav");
}

function setup() {
  createCanvas(1000, 500);

  bg = createSprite(800, 250, 1, 400);
  bg.addImage(bgImg);
  bg.x = bg.width / 2;

  thief = createSprite(150, 383, 1, 1);
  thief.addAnimation("thief", thiefImg);
  thief.scale = 0.075;

  road = createSprite(400, 460, 1, 1);
  road.addImage(roadImg);
  road.x = road.width / 2;

  invRoad = createSprite(400, 460, 1000, 1);
  invRoad.visible = false;

  policeGroup = createGroup();
  
  gameOver=createSprite(500,200,1,1);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.6;
  gameOver.visible=false;
  
  restart=createSprite(500,290,1,1);
  restart.addImage(restartImg);
  restart.scale=0.3;
  restart.visible=false;
}

function draw() {
  background("#1cd226");
  
  if (gameState === STORY) {
    thief.depth = road.depth;
    thief.depth = thief.depth + 1;
    drawSprites();
    textSize(30);
    fill("green");
    text("Break Out", 400, 100);
    textSize(29);
    fill("#991a00");
    text("You are a master thief who has just stolen the priceless Koh-i-noor diamond.", 10, 150);
    text("The biggest and skilled squad of police are sent after you.", 110, 200);
    text("Escape them and run as long as you can.", 230, 250);
    fill("yellow");
    text("Remember,the value of the diamond increases as much far you can", 20, 300);
    text("get it from the starting.", 400, 350);
    text("Press space to jump , press S to start.", 270, 400);
    if (keyDown("s")) {
      gameState = PLAY;
    }
  }

  if (gameState === PLAY) {
    
    fill("yellow");
    score = score + Math.round(getFrameRate()/60);
    //to create scrolling background
    bg.velocityX = -(1+score/100);
    if (bg.x < 0) {
      bg.x = bg.width / 2;
    }

    //scrolling road
    road.velocityX = -(3+score/100);
    if (road.x < 0) {
      road.x = road.width / 2;
    }
    thief.velocityY = thief.velocityY + 0.8;

    thief.collide(invRoad);
    thief.depth = road.depth;
    thief.depth = thief.depth + 1;
    //thief.debug = true;
    if (keyDown("space") && thief.y >= 383) {
      thief.velocityY = -(22-score/200);
      jumpSound.play();
    }
    spawnPolice();

    //console.log(thief.y);

    if (policeGroup.isTouching(thief)) {
      policeGroup.destroyEach();
      gameState = END;
      gameOverSound.play();
    }

    drawSprites();
  }

  if (gameState === END) {
    end();
    if(score>hiScore){
      hiScore=score;
    }
    console.log(hiScore);
    if(mousePressedOver(restart)){
      reset();
    }
  }
   fill(0,0,0);
  textSize(20);
  text("Diamond Value :"+score,800,30);
  text("Hi Score :"+hiScore,600,30);
}

function spawnPolice() {
  if (frameCount % 100 === 0) {
    police = createSprite(1000, 400, 1, 1);
    police.addImage(policeImg);
    police.scale = 0.25;
    police.velocityX = -(9+score/100);
    police.lifetime = 112;
    //police.debug = true;
    policeGroup.add(police);
  }
}

function end() {
  bg.velocityX = 0;
  road.velocityX = 0;
  policeGroup.setvelocityXEach = 0;
  thief.velocityY = 0;
  policeGroup.setLifetimeEach = -1;
  gameOver.visible=true;
  restart.visible=true;
  drawSprites();
}

function reset(){
  gameState=PLAY;
  score=0;
  gameOver.visible=false;
  restart.visible=false;
}