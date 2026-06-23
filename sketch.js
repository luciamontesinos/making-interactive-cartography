let data = null;
const BOUNDS = { minLat: 55.717, minLon: 12.6555, maxLat: 55.7258, maxLon: 12.6758 };

// Zoom and pan variables
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let prevMouseX = 0;
let prevMouseY = 0;

// Location marker
let locationX = 900;
let locationY = 500;
let locationImgHeight = 50 / zoomLevel;
let locationImgWidth = 50 / zoomLevel;
let locationImg;

// Media markers
let markers = [
{ id: 0, lat: 55.7215, lon: 12.6686, label: 'The sky', type: 'image', path: 'assets/sky.jpg', image: null, isPlaying: false, height: null, width: null},
{ id: 1, lat: 55.7218, lon: 12.6676, label: 'The sea', type: 'audio', path: 'assets/sea.mp3', audio: null, isPlaying: false, height: null, width: null}
];



function preload(){
  // Load map:
   data = loadJSON('assets/map.json', gotData, gotError);

   // load location and marker images
   locationIcon = loadImage('assets/LocationFigure.png');
   markerIcon = loadImage('assets/markerBlue.png');
  
   // Load marker paths
  for (let marker of markers){
    console.log(marker);
    if (marker.type === 'image') {  
      console.log(marker.path);
      marker.image = loadImage(marker.path);
    } else if (marker.type === 'audio') {
      marker.audio = loadSound(marker.path);
    }
  }
}

function setup() {  
    createCanvas(windowWidth, windowHeight);
    noFill();
    strokeWeight(0.5);
    frameRate(50);
}

function draw() {
    background('#B2E8EB');
   
    // Apply zoom and pan transformations
    push();
    translate(panX, panY);  
    scale(zoomLevel);
  
    // Draw map elements
    showMap(true, true, true, true, true, true, true);

    // Draw our navigator
    showLocationInMap();
    
    // Draw our media markers
    showMediaMarkers();
  
    pop();
}


function gotData() {
  console.log('got data');
  
}

function gotError() {
  console.log('got error');
}

// Handle mouse wheel zoom
function mouseWheel(event) {

  // Zoom towards mouse position
  const zoomFactor = 1.1;
  const oldZoom = zoomLevel;
  
  if (event.delta > 0) {
    zoomLevel /= zoomFactor; // Zoom out
  } else {
    zoomLevel *= zoomFactor; // Zoom in
  }
  
  // Keep zoom within bounds
  zoomLevel = constrain(zoomLevel, 0.5, 20);
  
  // Adjust pan to keep zoom centered on mouse
  const zoomChange = zoomLevel - oldZoom;
  panX -= (mouseX - panX) * (zoomChange / oldZoom);
  panY -= (mouseY - panY) * (zoomChange / oldZoom);
  
  return false; // Prevent default scrolling
}

// Handle mouse drag for panning
function mousePressed() {
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function mouseDragged() {
  const deltaX = mouseX - prevMouseX;
  const deltaY = mouseY - prevMouseY;
  
  panX += deltaX;
  panY += deltaY;
  
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  return false; // Prevent default behavior
}

function doubleClicked(){
  // Convert screen coordinates to world/map coordinates
  locationX = (mouseX - panX) / zoomLevel;
  locationY = (mouseY - panY) / zoomLevel;
  showLocationInMap();
}

function showMap(outline=true, buildings=true, paths=true, nature=true, media=true){
  // Decide which elements you want to show in the map

  if (data.elements) {    
  for (let el of data.elements) {
    if (el.type !== 'way' || !el.geometry) continue;

    const tags = el.tags || {};

    if (outline){
      // How to draw the main outline of the island?? figure out the tag
    }
    if (buildings){
      if (tags.building === 'bunker') {
        stroke(150, 100, 50);

        // changed the fill input to HEX, because it will be easier for the participants to understand and modify the color with the color picker. 
        fill('#C89664')
        strokeWeight(4 / zoomLevel);
      } else if (tags.building) {
        stroke(150, 100, 50);
        fill(200, 150, 100, 120);
        strokeWeight(0.5 / zoomLevel);
      } 
    }
    if (paths){
       if (tags.cycleway || tags.highway === 'cycleway') {
        stroke('orange'); 
        strokeWeight(1 / zoomLevel);
        noFill();
      } else if (tags.footway || tags.highway === 'footway' || tags.highway === 'path') {
        stroke('purple'); 
        strokeWeight(1 / zoomLevel);
        noFill();
      }
    }

    if (nature){
      if (tags.waterway || tags.natural === 'water') {
      stroke('lightBlue');
      fill('#6496dc')
      strokeWeight(1 / zoomLevel);
      } else if (tags.landuse === 'grass') {
        stroke(100, 180, 100);
        fill('#9ccfa8')
        strokeWeight(1 / zoomLevel);
      }
    }

    // We don't draw the rest of the data
    else {
      noStroke();
      noFill();
    }

    beginShape();
    for (let pt of el.geometry) {
      let x = map(pt.lon, BOUNDS.minLon, BOUNDS.maxLon, 0, width);
      let y = map(pt.lat, BOUNDS.maxLat, BOUNDS.minLat, 0, height);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
} 

}


function showLocationInMap(){
  // Maybe update this to move diagonally?
  var speed = 5 / zoomLevel;
  if (keyIsPressed){
    
    if(key === 'W' || key === 'w' || keyCode === UP_ARROW){ 
      locationY -= speed; 
    }
    
    if(key === 'A' || key === 'a' || keyCode === LEFT_ARROW){
      locationX -= speed;
    }
    if(key === 'S' || key === 's' || keyCode === DOWN_ARROW){
      locationY += speed;
    }
    if(key === 'D' || key === 'd' || keyCode === RIGHT_ARROW){
      locationX += speed;
    }
  }
  noStroke();
  fill('#ffd700')
  image(locationIcon, locationX, locationY, locationImgHeight, locationImgWidth);
  noFill();
}

function showMediaMarkers(){
  // Convert real-world coordinates to screen coordinates
  for (let marker of markers) {
    // Convert lat/lon to screen x/y using the same method as the map
    let x = map(marker.lon, BOUNDS.minLon, BOUNDS.maxLon, 0, width);
    let y = map(marker.lat, BOUNDS.maxLat, BOUNDS.minLat, 0, height);
    
    // Draw marker based on type
    noStroke();
    if(marker.type === 'image'){
      marker.height = 20 / zoomLevel;
      marker.width = 20 / zoomLevel;
      image(markerIcon, x, y, marker.width, marker.height);
    }else if(marker.type === 'audio'){
      marker.height = 10 / zoomLevel;
      marker.width = 10 / zoomLevel;
      fill('#1cde7a')
      rect(x, y, marker.width, marker.height);
    }
  
    // Draw label 
    if (marker.label) {
      fill(0);
      textSize(10 / zoomLevel);
      text(marker.label, x + 12 / zoomLevel, y - 5 / zoomLevel);
    }

    // Check collision with the location marker and trigger interaction 
     checkCollision(marker, x, y, marker.width, marker.height);
  
  }
}

function checkCollision(marker, markerX, markerY, markerWidth, markerHeight){
  // using the rectRect collision functions defined in this repository: https://github.com/jeffThompson/CollisionDetection/blob/master/CodeExamples/RectRect/RectRect.pde

  if (locationX + locationImgWidth >= markerX &&    // r1 right edge past r2 left
      locationX <= markerX + markerWidth &&    // r1 left edge past r2 right
      locationY + locationImgHeight >= markerY &&    // r1 top edge past r2 bottom
      locationY <= markerY + markerHeight) {    // r1 bottom edge past r2 top
      onMarkerCollision(marker, markerX, markerY);
      }
}


function onMarkerCollision(marker, markerX, markerY){
  if(marker.type === 'image' && marker.image){
   
    // Exit transformed context to draw image at screen scale
    pop();
    let screenX = markerX * zoomLevel + panX;
    let screenY = markerY * zoomLevel + panY;
    image(marker.image, screenX, screenY, 100, 100);
    push(); 
    // Re-enter transformed context
    
  }
  else if(marker.type === 'audio' && marker.audio && !marker.isPlaying){
    marker.isPlaying = true;
    marker.audio.play();
    // Stop it after 5 seconds.
    setTimeout(() => { 
      marker.isPlaying = false; 
      marker.audio.stop(); 
    }, 5000);
  }
}


