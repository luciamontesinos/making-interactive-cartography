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
    label: "Clouds in the sky",
    type: "image",
    // here we define the path to the image, meaning what file in the assets folder should this connect to this marker? 
    mediaPath: "assets/sky.jpg",
    iconPath: "assets/pin.png",
  },
  {
    id: 1,
    lat: 55.7218,
    lon: 12.6676,
    label: "Sounds of the sea",
    type: "audio",
    mediaPath: "assets/sea.mp3",
    iconPath: "assets/pin.png",
  },
];


// ***************************************************************************
// 🎨 SECTION 2: MAP COLORS
// Change the colors of the map elements here!
// stroke() = outline color, fill() = inside color
// ***************************************************************************

function setBackgroundStyle(){
    // setting the color of the background of the map, the entire screen. 
    // Maybe we consider it to be the ocean or the sky, or maybe you think of it as a digital space that isn't bound to geography. 
    background("#fbaaff");
}

function setBuildingStyle(tags) {
    // setting the color and outline of general buildings on the map
  if (tags.building) {
    stroke("#ababab");
    // currently making them 30% transparent so that you can see the map elements underneath.
    fill("rgb(182, 179, 179) 248, 76, 0.3)");
    strokeWeight(0.5 / zoomLevel);
  }
}

function setMilitaryStyle(tags) {
    // setting the color and outline of the bunkers on the map
  if (tags.military === "bunker" || tags.building === "bunker") {
    //currently making them 30% transparent so that you can see the map elements underneath.
    fill("rgba(2, 248, 76, 0.3)");
    fill("rgba(12, 254, 85, 0.3)");  
    strokeWeight(1 / zoomLevel);
}
}

function setPathStyle(tags) {
  // Reset line dash defaults so regular paths aren't accidentally dashed
  drawingContext.setLineDash([]); 

  if (tags.route === "ferry" || tags.highway === "maritime" || tags.ferry) {
    stroke("rgba(248, 144, 7, 0.8)"); 
    strokeWeight(1.5 / zoomLevel);      
    noFill();                           
    // Wide-spaced dash pattern for the ferry route
    drawingContext.setLineDash([8, 12]); 
  } 
  // Sets the color for the default paths/roads on land
  else if (tags.highway) {
    fill("rgba(192, 13, 237, 0.3)");  
     // Note: if paths are open lines, fill('#ffffff') might create weird artifacts. If that happens, change to noFill();
    strokeWeight(2 / zoomLevel);
  }
}

function setLeisureStyle(tags) {
  if (tags.leisure === "picnic_table" || tags.leisure === "outdoor_seating") {
    stroke("#0206ff"); // Wood brown
    fill("#0206ff");   // Light wood table body
    strokeWeight(1 / zoomLevel);
  } else if (tags.leisure) {
    noFill();   // Default leisure green space
    noStroke();
  }
}

function setNatureStyle(tags) {
  if (tags.natural === "beach") {
    fill("#ece1be"); // Sandy gold
    noStroke();
  } else if (tags.natural === "coastline") {
    stroke("#bb00ff");
    strokeWeight(1);
    // The tag natural = scrub is used to tag areas of uncultivated land covered with shrubs, bushes or stunted trees. herbs, and geophytes.
  } else if (tags.natural === "scrub") {
    stroke("#ace8fe");
    fill("#afe8fc");
    strokeWeight(1 / zoomLevel);
  } else if (tags.landuse === "grass") {
    stroke("rgba(68, 20, 243, 0.8)");  
    fill("rgba(81, 46, 255, 0.8)");  
    strokeWeight(1 / zoomLevel);
  }
}

function setShelterStyle() {
// setting the color of the shelters on the map
  fill("#ff6f15");
  stroke("#ffffff");
  strokeWeight(1 / zoomLevel);
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
    marker.width = 25 / zoomLevel;
    marker.height = 25 / zoomLevel;
    image(marker.icon, x, y, marker.width, marker.height);

  } else if (marker.type === "audio") {
    marker.width = 25 / zoomLevel;
    marker.height = 25 / zoomLevel;
    image(marker.icon, x, y, marker.width, marker.height);

  // Draw the label
  }if (marker.label) {
    fill(0);
    textFont(robotoMono);
    textSize(14 / zoomLevel);
    textStyle(ITALIC);
    text(marker.label, x + 12 / zoomLevel, y - 5 / zoomLevel);
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

