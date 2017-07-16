//used by common.js to generate a random map
function Map(random, x, y){
	//var xpos;
	//var ypos;
	//set type of the area to the randomly generated number (0 for land, 1 for water)
	this.type = random;
	//Create an array of size 10 to hold the resources
	this.resource = new Array(10);
	this.explored = false;
	this.isExploring = false;
	//variable for calculating resource growth
	//var timeFromLastUpdate;
	
	//Depending on if random is land or water, different resources will be loaded
	//resourceToAdd is an array that holds all the resources for either land/water
	//highestArrayIndex holds the array size
	if (random == 0){
		var resourceToAdd = resource.slice(0,25);
		var highestArrayIndex = 25;
	}
	else{
		var resourceToAdd = resource.slice(25);
		var highestArrayIndex = 16;
	}
	//Loop through 10 times to add 10 random resource to one Map instance
	for (var z = 0; z < 10; z++){
		var randomResource = Math.floor(Math.random() * highestArrayIndex);
		this.resource[z] = resourceToAdd[randomResource];
		this.resource[z].totalResourceCount = (Math.floor(Math.random() * 500));
		resourceToAdd.splice(randomResource,1);
		highestArrayIndex--;
	}
	
}