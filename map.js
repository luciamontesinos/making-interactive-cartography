// ***************************************************************************
// 🗺️⁀જ✈︎⊹˖𖤓 map.js, this is your playground for the workshop!
// Here you can:
//   1. Add your own media markers to the map
//   2. Change the colors of the map elements
//   3. Change how markers look when you navigate into them on the map
// ***************************************************************************


// ***************************************************************************
// ⚲ SECTION 1: Defining your own
// Add your own locations here!
// Each marker needs a lat, lon, label, type and path.
// Types can be: "image" or "audio"
// ***************************************************************************

let markers = [
  {
    id: 0,
    lat: 55.7215,
    lon: 12.6686,
    label: "The sky",
    type: "image",
    // here we define the path to the image, meaning what file in the assets folder should this connect to this marker? 
    mediaPath: "assets/sky.jpg",
    iconPath: "assets/blue.png",
  },
  {
    id: 1,
    lat: 55.7218,
    lon: 12.6676,
    label: "The sea",
    type: "audio",
    mediaPath: "assets/sea.mp3",
    iconPath: "assets/blue.png",
  },
];


// ***************************************************************************
// 🎨 SECTION 2: MAP COLORS
// Change the colors of the map elements here!
// stroke() = outline color, fill() = inside color
// ***************************************************************************

function setBackgroundStyle(){
    background("#fbaaff");
}

function setBuildingStyle(tags) {
    // setting the color and outline of the bunkers on the map
  if (tags.building === "bunker") {
    stroke(150, 100, 50);
    fill("#C89664");
    strokeWeight(4 / zoomLevel);
    // setting the color and outline of other types of buildings on the map
  } else if (tags.building) {
    stroke("#bc6004");
    fill("#754e28");
    strokeWeight(0.5 / zoomLevel);
  }
}

function setPathStyle(tags) {
    // setting the color of the bicycle paths on the map
  if (tags.cycleway || tags.highway === "cycleway") {
    stroke('#ff8c00');
    strokeWeight(1);
    noFill();
    // setting the color of the footways on the map
  } else if (tags.footway || tags.highway === "footway" || tags.highway === "path") {
    stroke('#e004f9');
    strokeWeight(1 / zoomLevel);
    noFill();
  }
}

function setNatureStyle(tags) {
    // setting the color of the water on the map
  if (tags.waterway || tags.natural === "water") {
    stroke("#6496dc");
    fill("#6496dc");
    strokeWeight(1 / zoomLevel);
    // setting the color of the coastline of the map
  } else if (tags.natural === "coastline") {
    stroke("#a712d9");
    strokeWeight(1);
    // setting the color of the grass of the map
  } else if (tags.landuse === "grass") {
    stroke('#64b964');
    fill("#9fffb5");
    strokeWeight(1 / zoomLevel);
  }
}

function setShelterStyle() {
// setting the color of the shelters on the map
  fill("#ef0c0c");
  stroke("#991515");
  strokeWeight(2 / zoomLevel);
}


// ***************************************************************************
// ⋆✴︎🎨˚｡⋆ SECTION 3: Update the looks of the location icon and markers
// Change how your markers appear on the map!
// x, y = position on the map
// ***************************************************************************

// Define the image you want to use for the location icon
function setLocationIcon() {
   return loadImage("assets/location.png");
}

function drawMarker(marker, x, y) {
  noStroke();

  if (marker.type === "image") {
    marker.width = 20 / zoomLevel;
    marker.height = 20 / zoomLevel;
    image(marker.iconPath, x, y, marker.width, marker.height);

  } else if (marker.type === "audio") {
    marker.width = 10 / zoomLevel;
    marker.height = 10 / zoomLevel;
    fill("#1cde7a");
    rect(x, y, marker.width, marker.height);

  // Draw the label
  if (marker.label) {
    fill(0);
    textSize(10 / zoomLevel);
    text(marker.label, x + 12 / zoomLevel, y - 5 / zoomLevel);
  }
}
}


// ***************************************************************************
// ⋆⭒˚𖠋𖠋𖠋*.⋆ SECTION 4: Playing with the marker interactions
// What happens when you walk into a marker?
// ***************************************************************************

function onMarkerCollision(marker, markerX, markerY) {
  if (marker.type === "image" && marker.image) {
    push();
    resetMatrix();
    let screenX = markerX * zoomLevel + panX;
    let screenY = markerY * zoomLevel + panY;
    image(marker.image, screenX, screenY, 100, 100);
    pop();

  } else if (marker.type === "audio" && marker.audio && !marker.isPlaying) {
    marker.isPlaying = true;
    marker.audio.play();
    setTimeout(() => {
      marker.isPlaying = false;
      marker.audio.stop();
    }, 5000);
  }
}