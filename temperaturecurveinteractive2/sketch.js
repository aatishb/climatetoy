let xaxis = [];
let solarflux = 160;
let planetTemp = 50;
let paused = false;

function setup() {
  createCanvas(600, 320);
  
  for (let x = 50; x <= 550; x+= 1) {
    xaxis.push(x);
  }
  
  strokeWeight(5);
  textSize(25);
  textFont('Fugaz One');

}

function draw() {
  background(85, 56, 100);
  
  noFill();

  stroke(202, 124, 152);
  beginShape();
    for (let t of xaxis) {
      vertex(t, heatflux(t));
    }
  endShape();

  stroke(255, 190, 137);
  beginShape();
    for (let t of xaxis) {
      vertex(t, solarflux);
    }
  endShape();
  
  noStroke();
  fill(255, 190, 137);
  text('INCOMING FLUX', 50, solarflux - 10);

  fill(202, 124, 152);
  text('HEAT FLUX', 50, 280);

 
  fill(255, 161, 155);
  circle(planetTemp, heatflux(planetTemp), 50);

  fill(85, 56, 100);
  push();
    textSize(30);
    textAlign(CENTER, CENTER);
    translate(planetTemp,heatflux(planetTemp));
    rotate(PI/2);
    if(abs(heatflux(planetTemp) - solarflux) > 5 ) {
      text(':(', 0, 0);
    }
    else {
      text(':)', 0, 0);
    }
  pop();
    
  
  if(mouseIsPressed) {
    if(mouseX > 50 && mouseX < 550 && mouseY > 30 && mouseY < 292) {
      solarflux = mouseY;
    }
  }
  else {
    planetTemp += -0.05 * (solarflux - heatflux(planetTemp));
  }
}

function heatflux(t) {
  return height - pow(t - 50,4)/pow(125,4) - 30;
}