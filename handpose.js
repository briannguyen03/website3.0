let hand;
let video;
let hands = [];
let connections;
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
  if (!running) return;

  image(video, 0, 0, width, height);

  if (hands.length > 0) {
    for (let hand of hands) {
      // Draw keypoints
      for (let i = 0; i < hand.keypoints.length; i++) {
        let keypoints = hand.keypoints[i];
        fill(255, 0, 255);
        noStroke();
        circle(keypoints.x, keypoints.y, 12);
      }

      // Draw connections
      for (let i = 0; i < connections.length; i++) {
        let connection = connections[i];
        let a = connection[0];
        let b = connection[1];
        let keypointA = hand.keypoints[a];
        let keypointB = hand.keypoints[b];

        stroke(14, 51, 237);
        strokeWeight(5);
        line(keypointA.x, keypointA.y, keypointB.x, keypointB.y);
      }
    }
  }
}

function startVision() {
  if (!modelReady || running) return;

  // Start video capture and detection
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

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
}
