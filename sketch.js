var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey , monkey_running, restart
var banana ,bananaImage, obstacle, obstacleImage, backgroundImage, cloudImage
var FoodGroup, obstacleGroup, cloudsGroup;
var invisibleGround, restart_img,gameover_img, monkey_collider;
var score = 0; 
var survivalTime = 0;

localStorage["HighestScore"]=0;

//loading images and sounds before the gamestates
function preload(){
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  backgroundImage = loadImage("background0.png");
  monkey_collider= loadAnimation("collided.png");
  restart_img= loadImage("restart.png");
  gameover_img= loadImage("gameOver.png");
  cloudImage = loadImage("clouds.png");
 }

function setup() {
  
  createCanvas(769.5, 453);
   
  background = createSprite(384.75, 226, 20, 20);
  background.addImage("background",backgroundImage);
  background.scale = 1.5;
  background.x = background.width /2;
  
  invisibleGround = createSprite(384, 498, 769.5, 100);
  invisibleGround.visible = false;
  
  monkey = createSprite(35,413,20,50);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkey_collider);
  monkey.scale = 0.1;

  monkey.setCollider("rectangle",0,0,300,570);
  
  restart= createSprite(384,226,10,10);
  restart.addImage(restart_img);
  restart.scale=0.7;
  restart.visible=false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  FoodGroup=new Group();

  gameover= createSprite(384,290,10,10);
  gameover.addImage(gameover_img);
  gameover.scale=0.7;
  gameover.visible=false;
  console.log(monkey.y)
}

function draw() {
  
  //when gamestate is play;
  if (gameState === PLAY) {
    survivalTime=survivalTime+ Math.round(getFrameRate()/60);
    survivalTime = survivalTime + Math.round(getFrameRate()/60);

    //adding gravity
    monkey.velocityY=monkey.velocityY+2.5;
    monkey.velocityX = 6;
    
    if (monkey.x > 384.75) {
      monkey.velocityX = 0;
      monkey.x = camera.position.x;
      background.velocityX = -9;
      spawnClouds();
    }
    
    //to make the monkey jump
    if(keyDown("space") && monkey.y >= 400) {
      monkey.velocityY = -30;
    }
    
    //resetting the background
    if (background.x < 0){
      background.x = background.width/2;
    }
    
    Banana();
    spawnObstacles();

    switch(score){
      case 10: monkey.scale = 0.12;
      break;
      case 20 : monkey.scale = 0.14;
      break;
      case 30 : monkey.scale = 0.16;
      break;
      case 40 : monkey.scae = 0.18;
      break;
      default : break;
    }

    //when monkey touches the banana
    if (monkey.isTouching(FoodGroup)){
    FoodGroup.destroyEach();
    score=score+1;
    }
    
    //when monkey hits the stone
    if (monkey.isTouching(obstaclesGroup)){
      gameState=END;
    }
  }
  //when gamestate is on end state
  else {
     monkey.velocityY = 0;
     monkey.velocityX = 0;
     FoodGroup.setVelocityEach(0,0);
     obstaclesGroup.setVelocityEach(0,0);
     cloudsGroup.setVelocityEach(0,0);
     background.velocityX=0;
     restart.visible=true;
     gameover.visible=true;
    
      //to stop the bananas, obstacles and clouds from disappearing
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     FoodGroup.setLifetimeEach(-1);
      monkey.changeAnimation("collided", monkey_collider);
    
      //when clicked on restart sprite
    if (mousePressedOver(restart)){
      reset(); 
      score=0;
      survivalTime=0;
   }
  } 
  
  //when high score is less than the present survival time
  if(localStorage["HighestScore"]<survivalTime){
    localStorage["HighestScore"] = survivalTime;
  }
  
  //to stop the monkey from going further down because of gravity 
  monkey.collide(invisibleGround);

  drawSprites();
  
  //to display the scores on the canvas
  textSize(22);
  fill("red");
  textFont("Rockwell Condensed");
  text("Score: "+score,600,50);
  text("Survival Time : "+survivalTime,560,30);
  text("High Score-: "+localStorage["HighestScore"],10,30);
}

//to display the banana on the screen after a uniform time
function Banana(){
  if (frameCount % 60 === 0) {
  banana=createSprite(769.5,226,20,20)
  banana.addImage(bananaImage);
  banana.velocityX=-8;
  banana.scale=0.1;
  banana.lifetime = 96;
  banana.y = Math.round(random(170,210));
  //adding the bananas after to a group
  FoodGroup.add(banana);
  console.log(banana.y)
  }
}

//to display the clouds after a time period
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 90 === 0) {
    var cloud = createSprite(769.5,120,40,10);
    cloud.y = Math.round(random(50,180));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 256.6;
    
    //adjust the depth
    cloud.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

//to spawn the obstacles
function spawnObstacles() {
  if(frameCount % 300 === 0) {
   obstacle = createSprite(769.5,422,10,40);
   obstacle.addImage(obstacleImage);
    obstacle.velocityX = -9;
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = 128.5;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

//to reset everything 
function reset(){
    score = 0;
    survivalTime = 0;
    monkey.changeAnimation("running",monkey_running);
    FoodGroup.destroyEach();
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    gameState=PLAY;
    restart.visible=false;
    gameover.visible=false;
    background.visible=true;
    monkey.visible=true;
    monkey.x = 35;
  
}



