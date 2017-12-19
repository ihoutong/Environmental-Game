function map_block(random){
	this.type = random;
	this.resource = new Array(10);
	this.explored = false;
	this.isExploring = false;
	
	if (random == 0){
		var resourceToAdd = resource.slice(0,25);
	}
	else{
		var resourceToAdd = resource.slice(25);
	}
	
	this.populate_resource(resourceToAdd);
}
map_block.prototype.populate_resource = function (resourceToAdd){
	var highestArrayIndex = resourceToAdd.length;
	for (var z = 0; z < 10; z++){
		var randomResource = Math.floor(Math.random() * highestArrayIndex);
		this.resource[z] = resourceToAdd[randomResource];
		this.resource[z].totalResourceCount = (Math.floor(Math.random() * 500));
		resourceToAdd.splice(randomResource,1);
		highestArrayIndex--;
	}
}