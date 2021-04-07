console.log("ml5 version:", ml5.version);

let cam;
let poseNet;
let kp;

let poses = [];

let sign_color = 40, time = 0, colorc = 1, start_time = 0, turn_green, flash_time=0;
let ratio = 660/480;
let lh,rh,lw,rw,ls,rs; //left/right hand/waist/shoulder
let stage = 0;
//0: haven't in position 1: light blinking 2:outcome divided 3:someone break the rule x+0.5:transition
let fg = 0, winner = 0;

function preload() {
  fontWild = loadFont('font/Freakshow.ttf');
  fontWest = loadFont('font/RioGrande.ttf');
  sign = loadImage('image/sign.png');
  bar = loadImage('image/crossbar.png');
  cover = loadImage('image/cover.png');
  bgm = loadSound('audio/theme.mp3');
  turn_green = random(5,13);
}

function musicStart() {
  if (bgm.isPlaying() == false) {
    bgm.loop();
  }
}

function dis(a,b,c,d){
  return(sqrt((a-c)*(a-c)+(b-d)*(b-d)));
}

function projection(a){
  if (a>440) {
    return (a+560);
  }
  return a;
}

function setup() {
  createCanvas(1440, 660);
  background(255);

  cam = createCapture(VIDEO);
  cam.hide();
  textFont(fontWild);
  textSize(20);
  poseNet = ml5.poseNet(cam,'multiple', modelLoaded);
  poseNet.on("pose", gotResults);
}

function draw() {
  background(0);
  image(cam, 0, 0, 880, 660);
  image(cam, 560, 0, 880, 660);
  fill(255);
  noStroke();
  //rect(440,0,560,660);
  image(cover, 440, 0, 560, 660)

  /*time = (millis()-start_time)%4000;
  console.log(time);
  colorc = 1;
  sign_color = 0;
  if (time > 2000) {
    time -= 2000;
    sign_color = 215;
    colorc = -1;
  }
  sign_color += colorc * (max(time, 750)) *0.05;
  if (time>750){
    sign_color += colorc * (max(time-750, 500)) *0.2;
  }
  if (time>1250){
    sign_color += colorc * (max(time-1250, 500)) *0.05;
  }*/
  
  
  if (stage == 0){
    push();
    textFont(fontWest);
    textSize(80);
    stroke(40,0,0);
    fill(205,0,0)
    text('(WANTED)', 490, 80);
    pop();
    
    push();
    textFont(fontWild);
    textSize(30);
    stroke(0);
    fill(100)
    text("1.Stand inside each one's frame", 500, 140);
    text('2.Hold still', 500, 180);
    text("3.Keep your Right hand close to your waist", 500, 220);
    text("  as long as the crossing light is RED,", 500, 260);
    text("  as if there's a gun", 500, 300);
    text("4.Pull out your gun and FIRE as soon", 500,340);
    text("  as the light turn GREEN", 500, 380);
    text("  Whoever react first win the game", 500, 420);
    text("5.Drawing the gun before a green light", 500, 460);
    text("  is foul and the game would restart.", 500, 500);
    pop();
  }

  else if (stage == 1){
    musicStart();
    push();
    imageMode(CENTER);
    image(sign, 720, 330);
    pop();
    if (time < 3 || time > 6){
      sign_color += colorc * 10;
    }else{
      sign_color += colorc * 25;}
    time = (time+1)%10;
    if (sign_color >= 205){
      colorc = -1;
    }else if (sign_color <= 40){
      colorc = 1;
      flash_time += 1;}
    if (flash_time <= turn_green){
      fill(sign_color,0,0);
      ellipse(639,253,50);
      fill(245-sign_color,0,0);
      ellipse(795,252,50);}
    else{
      fill(72,213,72);
      ellipse(639,253,50);
      ellipse(795,252,50);
    }
  }
  else if (stage == 2){
    
  }
  else if (stage == 3){

  }

}

function mousePressed(){
  //console.log(mouseX, mouseY);
  //musicStart();
}

function modelLoaded() {
  console.log("Model Loaded");
}

function gotResults(results) {
  //console.log(results);
  poses = results;
}
/*
    console.log( poses[0].pose.nose );
    if (poses[0].pose.nose.confidence > 0.70) {
      let x = poses[0].pose.nose.x;
      let y = poses[0].pose.nose.y;
      
      noseX = poses[0].pose.nose.x; //***
      noseY = poses[0].pose.nose.x; //***
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x, y, 10, 10);
    }
    */
    //console.log( poses[0].pose.keypoints.length );
    
    /*pl = poses.length;
    for (let k = 0; k<pl; k++){
    let kp = poses[k].pose.keypoints;
    for (let i = 0; i < kp.length; i++) {
      let p = kp[i];
      if (p.score > 0.75) {
        //console.log(p);
        //p.part;
        let x = ratio*p.position.x;
        let y = ratio*p.position.y;
        if (x>440){
          x += 560;
        }
        //p.score;
        fill(0,255, 0);
        noStroke();
        ellipse(x, y, 20, 20);
        textSize(20);
        text(p.part, x, y);
        //text(p.score, x, y + 20);
      }
    }
    }  */