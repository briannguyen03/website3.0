let hand; 
let video;
let hands = [];
let connections;
let painting;
let px = 0;
let py = 0;
let sw = 8;
let red = '#fa0000';
let green = '#00ff00';
let blue = '#0000ff';
let color = '#ff00ff';
let running = false;
let modelReady = false;


function gotResult(results) {
    if (running) {
        hands = results;
    }
}


function setup() {
    let canvas = createCanvas(640, 480);
    canvas.parent('sketch-holder');
    hand = ml5.handPose({ flipped: true }, () => {
      document.getElementById("status").innerText = "Model loaded.";
      modelReady = true;
    });
    noLoop(); // Don't draw until started
  
}

function draw() {
  image(video, 0, 0, width, height); 

  if(hands.length> 0){
    let rhand, lhand;
  for(let hand of hands){
    //Drawing key points
      if(hand.handedness == 'Left'){
        let thumb = hand.keypoints[4];
        let index = hand.keypoints[8];
        let middlef = hand.keypoints[12];
        let ringf = hand.keypoints[16];
        let pinkief = hand.keypoints[20];
        lhand = {thumb, index, middlef, ringf, pinkief};
      }

      if(hand.handedness == 'Right'){
        let thumb = hand.keypoints[4];
        let index = hand.keypoints[8];
        rhand = {thumb, index};

      }
    }

      //Right Hand
      if(rhand){
      let index = rhand.index;
      let thumb = rhand.thumb
      let x = (index.x + thumb.x) * 0.5;
      let y = (index.y + thumb.y) * 0.5;
      sw = dist(index.x, index.y, thumb.x, thumb.y);
      fill(255, 0, 255);
      noStroke();
      circle(x, y, sw);
      }
      

      //Right Hand
      if(lhand){
        let index = lhand.index;
        let thumb = lhand.thumb;
 
        let x = (index.x + thumb.x) *0.5;
        let y = (index.y + thumb.y) *0.5;
      

        fill(130,130,130);
        circle(x,y,12);

        painting.noStroke();
        painting.fill(255,0,255);
        let d = dist(thumb.x, thumb.y, index.x, index.y);

        if(d < 20){
        painting.stroke(255,0,0);
        painting.strokeWeight(sw * 0.5);
        painting.line(px, py, x, y);
        }

        px = x; 
        py = y;
      }

  }
  image(painting, 0,0);
}

function startVision() {
    if (!modelReady || running) return;
  
    // Start video capture and detection
    video = createCapture(VIDEO, { flipped: true });
    video.size(640, 480);
    video.hide();

    painting = createGraphics(640,480);
    painting.clear();
  
    hand.detectStart(video, gotResult);
    connections = hand.getConnections();
  
    running = true;
    loop();
}
  
function stopVision() {
    if (!running) return;
  
    // Stop detection and camera
    running = false;
    noLoop();
    hands = [];
  
    if (video && video.elt && video.elt.srcObject) {
      video.elt.srcObject.getTracks().forEach(track => track.stop());
    }
  
    clear(); // Clear the canvas
    painting.clear();
}
  


    
   


