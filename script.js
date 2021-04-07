console.log("ml5 version:", ml5.version);

let cam;
let poseNet;
let kp;

let poses = [], lpose, rpose;

let sign_color = 40, time = 0, colorc = 1, start_time = 0, turn_green, flash_time=0, pause_time = 12;
let ratio = 660/480;
let stage = 0;
//0: haven't in position 1: light blinking 2:outcome divided 3:someone break the rule x+0.5:transition
let fg = 0, winner = 0;

function preload() {
  fontWild = loadFont('font/Freakshow.ttf');
  fontWest = loadFont('font/RioGrande.ttf');
  sign = loadImage('image/sign.png');
  bar = loadImage('image/crossbar.png');
  cover = loadImage('image/cover.png');
  bh = loadImage('image/bh.png');
  bgm = loadSound('audio/theme.mp3');
  turn_green = 5;
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
  //console.log(cam.width);
  if (cam.loadedmetadata){
  image(cam, 0, 0, 880, 660);
  image(cam, 560, 0, 880, 660);}
  fill(0);
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
  
  
  let x1 = 0,y1 = 0,x2 = 0,y2 = 0;
  let cof = 0;
  let lh,rh,lw,rw,ls,rs = new Array(2); //left/right hand/waist/shoulder
  
  if (poses.length > 1) {

    if (poses[0].pose.rightWrist.confidence > 0.70) {
      x1 = projection(ratio*poses[0].pose.rightWrist.x);
      y1 = ratio*poses[0].pose.rightWrist.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x1, y1, 10, 10);
      cof += 1;
    }
    if (poses[1].pose.rightWrist.confidence > 0.70) {
      x2 = projection(ratio*poses[1].pose.rightWrist.x);
      y2 = ratio*poses[1].pose.rightWrist.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x2, y2, 10, 10);
      cof += 1;
    }

    //console.log(x1,y1,x2,y2);

    if (x1>x2){
      lh = [x2,y2];
      rh = [x1,y1];
    }
    else{
      rh = [x2,y2];
      lh = [x1,y1];
    }

    if (poses[0].pose.rightHip.confidence > 0.60) {
      x1 = projection(ratio*poses[0].pose.rightHip.x);
      y1 = ratio*poses[0].pose.rightHip.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x1, y1, 10, 10);
      cof += 1;
    }
    if (poses[1].pose.rightHip.confidence > 0.60) {
      x2 = projection(ratio*poses[1].pose.rightHip.x);
      y2 = ratio*poses[1].pose.rightHip.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x2, y2, 10, 10);
      cof += 1;
    }

    //console.log(x1,y1,x2,y2);

    if (x1>x2){
      lw = [x2,y2];
      rw = [x1,y1];
    }
    else{
      rw = [x2,y2];
      lw = [x1,y1];
    }

    if (poses[0].pose.rightShoulder.confidence > 0.70) {
      x1 = projection(ratio*poses[0].pose.rightShoulder.x);
      y1 = ratio*poses[0].pose.rightShoulder.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x1, y1, 10, 10);
      cof += 1;
    }
    if (poses[1].pose.rightShoulder.confidence > 0.70) {
      x2 = projection(ratio*poses[1].pose.rightShoulder.x);
      y2 = ratio*poses[1].pose.rightShoulder.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x2, y2, 10, 10);
      cof += 1;
    }

    //console.log(x1,y1,x2,y2);

    if (x1>x2){
      ls = [x2,y2];
      rs = [x1,y1];
    }
    else{
      rs = [x2,y2];
      ls = [x1,y1];
    }
    if (cof == 6 && stage == 0){
      stage = 1;
    }

  }else if (poses.length > 0) {
    if (poses[0].pose.rightWrist.confidence > 0.70) {
      let x1 = projection(ratio*poses[0].pose.rightWrist.x);
      let y1 = ratio*poses[0].pose.rightWrist.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x1, y1, 10, 10);
      cof += 1;
    }
    if (poses[0].pose.rightHip.confidence > 0.70) {
      let x1 = projection(ratio*poses[0].pose.rightHip.x);
      let y1 = ratio*poses[0].pose.rightHip.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x1, y1, 10, 10);
      cof += 1;
    }
    if (poses[0].pose.rightShoulder.confidence > 0.70) {
      let x1 = projection(ratio*poses[0].pose.rightShoulder.x);
      let y1 = ratio*poses[0].pose.rightShoulder.y;
      
      noStroke();
      fill(0, 255, 0);
      ellipse(x1, y1, 10, 10);
      cof += 1;
    }
  }

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
    text("  as the light turns GREEN", 500, 380);
    text("  Whoever reacts first wins the game", 500, 420);
    text("5.Drawing the gun before a green light", 500, 460);
    text("  is FOUL and the game would restart.", 500, 500);
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

    if (cof == 6){
      lhw = dis(lh[0],lh[1],lw[0],lw[1]);
      rhw = dis(rh[0],rh[1],rw[0],rw[1]);
  
      lhs = dis(lh[0],lh[1],ls[0],ls[1]);
      rhs = dis(rh[0],rh[1],rs[0],rs[1]);

      console.log(lhw/lhs,rhw/rhs);
      if (lhs<1.5*lhw){
        if (flash_time < turn_green){
          stage = 3;
          fg = -1;
          time = 0;
          flash_time = 0;
          sign_color = 40;
        }
      }
      if (rhs<1.5*rhw){
        if (flash_time < turn_green){
          stage = 3;
          fg = 1;
          time = 0;
          flash_time = 0;
          sign_color = 40;
        }
      }
      //foul
  
      if (lhw>2*lhs){
        if (flash_time >= turn_green){
          stage = 2;
          winner = -1;
        }
      }
      if (rhw>2*rhs){
        if (flash_time >= turn_green){
          stage = 2;
          winner = 1;
        }
      }
      if (lhw>2*lhs && rhw>2*rhs){
        if (flash_time >= turn_green){
          stage = 2;
          winner = 0;
        }
      }
    }
  }

  else if (stage == 2){
    push();
    imageMode(CENTER);
    image(sign, 720, 330);
    pop();
    fill(72,213,72);
    ellipse(639,253,50);
    ellipse(795,252,50);
    if (winner == -1) {
      push();
      textFont(fontWest);
      textSize(60);
      stroke(40,0,0);
      fill(252, 194, 1)
      text("(WINNER!)", 50, 80);
      //image(bh, rn[0], rn[1], 10, 10);
      pop();
    }
    else if (winner == 1){
      push();
      textFont(fontWest);
      textSize(60);
      stroke(40,0,0);
      fill(252, 194, 1)
      text("(WINNER!)", 1050, 80);
      //image(bh, ln[0], ln[1], 10, 10);
      pop();
    }
    else if (winner == 0){
      push();
      textFont(fontWest);
      textSize(60);
      stroke(40,0,0);
      fill(205,0,0)
      text("(DRAW!)", 50, 80);
      text("(DRAW!)", 1050, 80);
      //image(bh, rn[0], rn[1], 10, 10);
      pop();
    }
  }

  else if (stage == 3){
    time += 1;
    push();
    imageMode(CENTER);
    image(sign, 720, 330);
    pop();
    fill(40,0,0);
    ellipse(639,253,50);
    ellipse(795,252,50);
    if (time >= pause_time){
      time = 0;
      stage = 1;
    }
    if (fg == -1) {
      push();
      textFont(fontWest);
      textSize(60);
      stroke(40,0,0);
      fill(205,0,0)
      text("DON'T FOUL", 60, 80);

      pop();
    }
    else{
      push();
      textFont(fontWest);
      textSize(60);
      stroke(40,0,0);
      fill(205,0,0)
      text("DON'T FOUL", 1060, 80);

      pop();
    }
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
