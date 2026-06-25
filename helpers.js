// ************************************************************************************************************
// ִֶָ𓂃 ࣪˖ ִֶָ💻🖱️་༘࿐ helpers.js, is a file that contains the helper functions that we use in sketch.js 
// These functions are programmed to handle mouse events, zooming, panning, and location marker placement. 
// They are essential for the interactive map functionality in the sketch.js file.
// Feel free to explore them if you want to understand how the interactivity is implemented, but they are not the focus of the workshop.
// ************************************************************************************************************

// Handle data loading callbacks
function gotData() {
  console.log("got data");
}

function gotError() {
  console.log("got error");
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
  if (handleOverlayMousePressed && handleOverlayMousePressed()) {
    return false;
  }

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

// Handle mouse drag for panning
function mouseDragged() {
  if (overlayIsActive && overlayIsActive()) {
    return false;
  }

  const deltaX = mouseX - prevMouseX;
  const deltaY = mouseY - prevMouseY;

  panX += deltaX;
  panY += deltaY;

  prevMouseX = mouseX;
  prevMouseY = mouseY;

  return false; // Prevent default behavior
}

// handle double click to set location marker
function doubleClicked() {
  // Convert screen coordinates to world/map coordinates
  locationX = (mouseX - panX) / zoomLevel;
  locationY = (mouseY - panY) / zoomLevel;
  showLocationInMap();
  if (typeof openMarkerUnderLocation === "function") {
    openMarkerUnderLocation();
  }
}

//Converts a longitude coordinate to a canvas X position.
function lonToX(lon) {
  return map(lon, BOUNDS.minLon, BOUNDS.maxLon, 0, width);
}

// Converts a latitude coordinate to a canvas Y position.
function latToY(lat) {
  return map(lat, BOUNDS.maxLat, BOUNDS.minLat, 0, width / geoAspectRatio);
}

