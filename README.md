Hi there! Welcome to Making Interactive Cartography, a workshop organised by Lucía Montesinos and Louie Søs Meyer for Cursor's Creative Coding Camp 2026

# Workshop description
Cartography is the art, science, and technology of making and studying maps. Maps influence our perception of  space as well as our understanding of bodies, ecologies and communities in relation to space. Maps are never objective representations. 

In this workshop we introduce a critical perspective on maps, and highlight creative technological examples of maps that have been queered and/or hacked. 

# Getting started

## Coding environment:
1. Download and open VS code
2. Install the extension "p5.js 2.x Project Generator"

## Code repository:
1. If you have git installed, clone the repository. If not, go to Code > Download ZIP
2. In VS Code, go to File > Open folder 
3. Make sure everything runs: right click into index.html  > Open with live server. A new window should open in your browser, showing the map

## Run the code:
To run the code, right click on index.html. A browser window should open, running the code on a local server.

## The file structure
**assets** - We will upload our data into the assets folder. There you can find the map data (map.json) and is the place where you will upload the media (images, audio, and text files)

**helpers.js** - Contains the helper functions that we use in sketch.js. These functions are programmed to handle mouse events, zooming, panning, and location marker placement. They are essential for the interactive map functionality in the sketch.js file. Feel free to explore them if you want to understand how the interactivity is implemented, but they are not the focus of the workshop.

**index.html** - We are only going to use this file to run the code (see above). It calls all of the js libraries.

**map.js** - This is going to be the playground for the workshop. Here you can add your own media markers to the map, change the colors of the map elements and change how markers look when you navigate into them on the map

**p5.js** - This is the p5js library. To know how to work with p5js check the documentation: https://p5js.org/reference/

**p5.sound.min.js** - Also a p5js library, but with sound-related functions. To know how to work with p5js check the documentation: https://p5js.org/reference/p5.sound/

**sketch.js** - In this file we preload media and setup the p5js canvas, such that is renders the map of Ungdomsøen. This is done by loading the map data from a JSON file and drawing it on the canvas. This is not the focus of the workshop, but you are welcome to explore the code and understand how it works. As a quick summary, there you can see three main default functions: preload(), setup() and draw(). We use preload() to load the media in advance. We use setup() to configure things on the sketch that will remain mostly unchanged. We use draw() to make all of the changes, as it keeps redrawing all the time. This is the place where we calling most of the other functions we are going to be working with. Here we also added showMap(), which  allows you to choose what things to show in the map: outline, paths, nature, buildings, and your media. You can choose how to display them. Explore how to remove boundaries, give more importance to others, and what kind of elements in the map to reveal or hide. showMediaMarkers() allows you to choose how your markers will show. showLocationInMap() allows you to choose how to show the location marker. This is not using real-live location, but it is a marker that you can move using your keyboard and mouse to move around the map. You can explore ways of personalising the movement, and the appearance. onMarkerCollision() allows you to define the behaviour to explore and interact with the media markers. This function is triggered whenever the location marker is nearby a media marker.

## Data
We will upload our data into assets. There you can find the map data (map.js) and is the place where you will upload the media (images, audio, and text files)

### Map data
In assets you will find a file map.js. It contains the geographical information of Ungdomsøen. However, if you would like to work with other locations, here is how to do it. We will be using Open Street Maps and Overpass.


1. Explore the location: Go to https://www.openstreetmap.org/ search for the location, explore the different layers
2. Obtain the bounds: Go to https://tools.geofabrik.de and modify the rectangle size and position so that it includes the location you are interested. Click on the tab Coordinate Display, and copy the numbers under Simple Copy. These are the coordinates of the corners of the rectangle, which we refer to as bounds.
3. Obtain the data: Go to Overpass turbo https://overpass-turbo.eu/# In the left, we need to specify what information we want: bounds + type of information. Here is an example of a query (make sure you substitute the bounds for the ones you want):
[out:json][timeout:25];
(
  way(55.717,12.6555,55.7258,12.6758);
  node(55.717,12.6555,55.7258,12.6758);
  relation(55.717,12.6555,55.7258,12.6758);
);
out geom;

4. Run the command in Overpass and export as raw osm data. 
5. Add the file into the assets folder

### Your media
Include the different types of media into the assets folder. Make sure you tag them correctly based on the type: image/video



