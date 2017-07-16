function Job(){
	/*
	These variables was originally used for the Job class. After research and testing, I found out that this was not how classes were created in Javascript
	The two functions on the bottom, Explore and addJob is how jobs are created now
	var name;
	var resourceTypeRequired;
	var minimumWorkersRequired;
	completion rate will be completion / totalTimeNeeded
	var totalTimeRequired;
	var resource;
	var resourceHarvesting
	var completion;
	var totalWorkers;
	var xpos;
	var ypos;
	var resourceIndex
	*/
	
	//resource gained holds the map data rather than a number of the resource gained
	//This is because exploration is special
	this.Explore = function (name, minimum, totalTime, totalWorkers, mapSelection, x, y){
		//Save the name of the job
		this.name = name;
		//save the minimum amount of workers required (always 5)
		this.minimumWorkersRequired = minimum;
		//save the total time required for the job (always 15 minutes)
		this.totalTimeRequired = totalTime;
		//save the total amount of workers to the job (always 5)
		this.totalWorkers = totalWorkers;
		//Set completion to 0
		this.completion = 0;
		//save all information for that part of the map to resourceGained
		this.resourceGained = mapSelection;
		//save the x and y position of where the exploration occurs
		this.xpos = x;
		this.ypos = y;
	}
	
	//function to create a job. Used for everything except for explore
	this.addJob = function(jobdata, workers, resource, harvestamount, x, y, resourceSelected){
		//Save the job name
		this.name = jobdata.name + ": " + resource.name;
		//Grab the minimum amount of workers required and saves it
		this.minimumWorkersRequired = jobdata.minimumWorkersRequired;
		//Calculates the total amount of time required. This depends on the amount of resources the player wants to harvest and the amount of resource the player
		//gains by harvesting each resource
		this.totalTimeRequired = Math.floor((harvestamount * resource.amount) / player.playerStats[2].level);
		//saves the amount of resources being harvested
		this.resourceHarvesting = harvestamount;
		//save the information of the resource itself
		this.resource = resource;
		//save the total amount of workers being assigned to the job
		this.totalWorkers = workers;
		//set completion to 0
		this.completion = 0;
		//save the x and y position of where the job occurs
		this.xpos = x;
		this.ypos = y;
		//save the index of the resource
		this.resourceIndex = resourceSelected
	}
}