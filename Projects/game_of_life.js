let cellSize = 13;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let rSlider, gSlider, bSlider;

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  let canvas;
  if (windowWidth < 600) {
    // Mobile
    canvas = createCanvas(350, 350);
  } else if (windowWidth < 1024) {
    // Tablet
    canvas = createCanvas(600, 320);
  } else {
    // Desktop
    canvas = createCanvas(720, 400);
  }
  canvas.parent('sketch-holder');

  // Create a div to hold the sliders and button
  let sliderContainer = createDiv().parent('sketch-holder');
  sliderContainer.style('margin-bottom', '10px');

  // Add label + slider for R
  createSpan('R: ').parent(sliderContainer);
  rSlider = createSlider(0, 255, 78);
  rSlider.parent(sliderContainer);

  // Add label + slider for G
  createSpan(' G: ').parent(sliderContainer);
  gSlider = createSlider(0, 255, 138);
  gSlider.parent(sliderContainer);

  // Add label + slider for B
  createSpan(' B: ').parent(sliderContainer);
  bSlider = createSlider(0, 255, 94);
  bSlider.parent(sliderContainer);

  // Add randomize button
  let randomizeButton = createButton('🎲 Randomize Color');
  randomizeButton.parent(sliderContainer);
  randomizeButton.style('margin-left', '15px');

  randomizeButton.mousePressed(() => {
    rSlider.value(floor(random(256)));
    gSlider.value(floor(random(256)));
    bSlider.value(floor(random(256)));
  });

  // Calculate columns and rows
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);

  // Initialize cell arrays
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
    nextCells[column] = [];
  }

  noLoop();
  describe(
    "Grid of squares that switch between white and black, demonstrating a simulation of John Conway's Game of Life. When clicked, the simulation resets."
  );
}

function draw() {
  generate();
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      let cell = currentCells[column][row];
      if (cell === 1) {
        fill(rSlider.value(), gSlider.value(), bSlider.value());
      } else {
        fill(255);
      }
      stroke(0);
      rect(column * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function mousePressed() {
  randomizeBoard();
  loop();
}

function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = random([0, 1]);
    }
  }
}

function generate() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      let left = (column - 1 + columnCount) % columnCount;
      let right = (column + 1) % columnCount;
      let above = (row - 1 + rowCount) % rowCount;
      let below = (row + 1) % rowCount;

      let neighbours =
        currentCells[left][above] +
        currentCells[column][above] +
        currentCells[right][above] +
        currentCells[left][row] +
        currentCells[right][row] +
        currentCells[left][below] +
        currentCells[column][below] +
        currentCells[right][below];

      if (neighbours < 2 || neighbours > 3) {
        nextCells[column][row] = 0;
      } else if (neighbours === 3) {
        nextCells[column][row] = 1;
      } else {
        nextCells[column][row] = currentCells[column][row];
      }
    }
  }

  // Swap states
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
}
