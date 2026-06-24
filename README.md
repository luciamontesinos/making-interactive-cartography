Hi there! Welcome to Making Interactive Cartography, a workshop organised by Lucía Montesinos and Louie Søs Meyer for Cursor's Creative Coding Camp 2026

# Workshop description


# Presentation slides


# Getting started

## Coding environment:
1. Download and open VS code
2. Install the extension "p5.js 2.x Project Generator"

## Code repository:
1. If you have git installed, clone the repository. If not, go to Code > Download ZIP
2. In VS Code, go to File > Open folder 
3. Make sure everything runs: right click into index.html  > Open with live server. A new window should open in your browser, showing the map

## Very basic P5js rundown
The main file you will be working on is sketch.js there you can see three main default functions: preload(), setup() and draw().
We use preload() to load the media in advance. 
We use setup() to configure things on the sketch that will remain mostly unchanged.
We use draw() to make all of the changes. This is the place where we will be calling all of the other functions.

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
Include the different types of media into the assets folder.

## Code 

### The functions we have prepared for you
We have prepared a very typical and basic navigation system.


### The functions you need to focus on

