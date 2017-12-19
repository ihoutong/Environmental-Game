
function Map() {
	this.image_sources = ['images/RPG Tileset/FILES/PNG/land.png', 'images/RPG Tileset/FILES/PNG/water.png', 'images/house/house_rip.png', 'images/pastel_resources/desert.png'];
}

//create an array of images and instantiate them with a specific image
Map.prototype.create_map_image = function(){
	var image_source_length = this.image_sources.length;
	
	for (var i = 0; i < image_source_length; i++){
		image[i] = new Image();
		image[i].src = this.image_sources[i];
	}
}

//Creates the horizontal and vertical black lines shown on the map. Makes it easier to separate sections of the map for the user
Map.prototype.create_grid = function() {
	// create vertical lines
	for (var x = 80; x < initialStart.width; x += 80){
		//console.log(x);
		initialStartContext.moveTo(x, 0);
		initialStartContext.lineTo(x, 400);
		initialStartContext.stroke();
	}
	//create horizontal lines
	for (var y = 40; y < initialStart.height; y+= 40){
		initialStartContext.moveTo(0, y);
		initialStartContext.lineTo(800, y);
		initialStartContext.stroke();
	}
}

//returns the position of the mouse and divides the x by 80 and y by 40
//Used to detect specific click events
Map.prototype.get_mouse_pos = function(event) {
	var rect = $("#initialStart")[0].getBoundingClientRect();
	var currentx = Math.floor((event.clientX - rect.left) / (rect.right - rect.left)*$("#initialStart")[0].width);
	var currenty = Math.floor((event.clientY - rect.top) / (rect.bottom - rect.top)*$("#initialStart")[0].height);
	//The +1 is unnecessary but is included since some previous code accounted for the +1.
	return {
		x: (Math.floor(currentx/80) + 1 ),
		y: (Math.floor(currenty/40) + 1)
	};
}

//Draws the map for the game
//If player data exists, then the map data will be pulled and drawn
//Otherwise, a new map will be generated
Map.prototype.draw = function() {
	this.create_map_image();
	//using image[0] to call the onload function, the one used doesnt matter the important part is to ensure the code gets run after one of the image variable is instantiated
	
	var this_map = this;
	image[0].onload = function (){
		//check if player exists
		if (localStorage.player){
			//grab the entire map data from localStorage
			entireMap = (JSON.parse(localStorage.player)).entireMap;
			//Loop through the entire two dimensional array
			for (var x = 0; x < 10; x ++){
				for (var y = 0; y < 10; y++){
					//draws the image (water/land) onto the map
					initialStartContext.drawImage(image[entireMap[x][y].type], x * 80, y * 40);
					//If the place isn't explored, it becomes grayed out
					if (entireMap[x][y].explored == false){
						initialStartContext.fillStyle = "rgba(0,0,0,.5)";
						initialStartContext.fillRect(x * 80, y * 40, 80, 40)
					}
				}
			}
			//Draws player starting location.
			//type is not set to 2 (which is a different image in the image array) because the image is transparent, allowing for an overlay
			initialStartContext.drawImage(image[2], player.baseXPos * 80, player.baseYPos * 40);
		}
		//if player does not exist, then a map will need to be generated
		else {
			player.entireMap = [];
			for (var x = 0; x < 10; x ++){
				//create two dimensional array
				player.entireMap[x] = [];
				for (var y = 0; y < 10; y++){
					//randomize for land/water that will be used
					var random = Math.floor(Math.random() * 2);
					//draw the land/water
					initialStartContext.drawImage(image[random], x * 80, y * 40);
					//if the image drawn is water, then grey out the image
					if (random == 1){
						initialStartContext.fillStyle = "rgba(0,0,0,.5)";
						initialStartContext.fillRect(x * 80, y * 40, 80, 40)
					}
					//create an empty array for the npcMessages. Necessary, due to localStorage
					player.npcMessages = [];
					//Save all the upgrades to the player Object itself. This is so the upgrades can be removed as the player obtains them
					player.allUpgrades = upgrade;
					
					//call the Map constructor to create a Map object
					player.entireMap[x][y] = new map_block(random);
					
				}
			}
		}
		this_map.create_grid();
	}
}




