// ************************************************************************************************************
// ✎ᝰ.ᐟ⋆⑅˚₊ sketch.js, in this file we preload media and setup the P5.js canvas, 
// such that is renders the map of Ungdomsøen. This is done by loading the map data from a JSON file and drawing it on the canvas.
// This is not the focus of the workshop, but you are welcome to expore the code and understand how it works. 
// ************************************************************************************************************


let data = null;

const BOUNDS = {
  minLat: 55.717,
  minLon: 12.6555,
  maxLat: 55.7258,
  maxLon: 12.6758,
};

const latRad = (55.72 * Math.PI) / 180;
const geoAspectRatio =
  ((BOUNDS.maxLon - BOUNDS.minLon) * Math.cos(latRad)) /
  (BOUNDS.maxLat - BOUNDS.minLat);

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
let locationIcon;

function preload() {
  // Load map:
  data = loadJSON("assets/map.json", gotData, gotError);

  // Load location icon
  locationIcon = setLocationIcon();

  // Load marker paths
  for (let marker of markers) {
    console.log(marker);
    marker.iconPath = loadImage(marker.iconPath);
    if (marker.type === "image") {
      console.log(marker.mediaPath);
      marker.image = loadImage(marker.mediaPath);
    } else if (marker.type === "audio") {
      marker.audio = loadSound(marker.mediaPath);
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
  setBackgroundStyle();

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


function showMap(
  outline = true,
  buildings = true,
  paths = true,
  nature = true,
  shelters = true,
) {
  if (!data.elements) return;

  for (let el of data.elements) {
    if (el.type !== "way" || !el.geometry) continue;

    const tags = el.tags || {};

    if (buildings)  setBuildingStyle(tags);
    if (paths)      setPathStyle(tags);
    if (nature)     setNatureStyle(tags);
    else            { noStroke(); noFill(); }

    beginShape(); 
    for (let pt of el.geometry) {
      vertex(lonToX(pt.lon), latToY(pt.lat));
    }
    endShape(CLOSE);
  }

  if (shelters) {
    push();
    for (let el of data.elements) {
      if (el.type !== "node" || el.tags?.amenity !== "shelter") continue;
      setShelterStyle();
      circle(lonToX(el.lon), latToY(el.lat), 10 / zoomLevel);
    }
    pop();
  }
}

function showLocationInMap() {
  // Maybe update this to move diagonally?
  var speed = 5 / zoomLevel;
  if (keyIsPressed) {
    if (key === "W" || key === "w" || keyCode === UP_ARROW) {
      locationY -= speed;
    }

    if (key === "A" || key === "a" || keyCode === LEFT_ARROW) {
      locationX -= speed;
    }
    if (key === "S" || key === "s" || keyCode === DOWN_ARROW) {
      locationY += speed;
    }
    if (key === "D" || key === "d" || keyCode === RIGHT_ARROW) {
      locationX += speed;
    }
  }
  noStroke();
  fill("#ffd700");
  image(
    locationIcon,
    locationX,
    locationY,
    locationImgHeight,
    locationImgWidth,
  );
  noFill();
}

function showMediaMarkers() {
  // Convert real-world coordinates to screen coordinates
  for (let marker of markers) {
    // Convert lat/lon to screen x/y using the same method as the map
    let x = map(marker.lon, BOUNDS.minLon, BOUNDS.maxLon, 0, width);
    let y = map(
      marker.lat,
      BOUNDS.maxLat,
      BOUNDS.minLat,
      0,
      width / geoAspectRatio,
    );

    // Draw marker based on type
    noStroke();
    if (marker.type === "image") {
      // setting the height/width of this type of marker
      marker.height = 20 / zoomLevel;
      marker.width = 20 / zoomLevel;
      image(marker.iconPath, x, y, marker.width, marker.height);
    } else if (marker.type === "audio") {
      // setting the height/width of this type of marker
      marker.height = 10 / zoomLevel;
      marker.width = 10 / zoomLevel;
      fill("#1cde7a");
      rect(x, y, marker.width, marker.height);
    } else if (marker.type === "text") {
      // setting the height/width of this type of marker
      marker.height = 10 / zoomLevel;
      marker.width = 10 / zoomLevel;
      fill("#1cde7a");
      triangle(x, y, x + marker.width, y + marker.height);
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

// Collision detection by creating a bounding box
function checkCollision(marker, markerX, markerY, markerWidth, markerHeight) {
  if (
    locationX + locationImgWidth >= markerX && // r1 right edge past r2 left
    locationX <= markerX + markerWidth && // r1 left edge past r2 right
    locationY + locationImgHeight >= markerY && // r1 top edge past r2 bottom
    locationY <= markerY + markerHeight
  ) {
    // r1 bottom edge past r2 top
    onMarkerCollision(marker, markerX, markerY);
  }
}

// Marker interaction 
function onMarkerCollision(marker, markerX, markerY) {
  if (marker.type === "image" && marker.image) {
    push(); // Save the current transformed context
    // Reset to screen space so image draws at screen coordinates
    resetMatrix();
    let screenX = markerX * zoomLevel + panX;
    0;
    let screenY = markerY * zoomLevel + panY;
    image(marker.image, screenX, screenY, 100, 100);
    pop();
    // Restore the transformed context
  } else if (marker.type === "audio" && marker.audio && !marker.isPlaying) {
    marker.isPlaying = true;
    marker.audio.play();
    // Stop it after 5 seconds.
    setTimeout(() => {
      marker.isPlaying = false;
      marker.audio.stop();
    }, 5000);
  }
}

