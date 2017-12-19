var player = '';
var image = [];

$(document).ready(function (){
	confirm_restart_game();
	player = new Player();
	var is_player_loaded = player.load_player();
	
	if (is_player_loaded){
		calculateEverythingFromLastUpdate();
		displayNavBarStat();
		
		if ($("#resource").length){
			displayResources();
		}
	
	}
});

function confirm_restart_game(){
	var page = document.location.href.split('/').pop();
	
	if (page == 'start.html' && localStorage.player){
		//if the player does have an existing file, asks the player if they would like to start over
		var confirmation = confirm("Player already exists, do you want to start over? (If not, you will be moved to home)");
		//clears localStorage if they want to restart
		if (confirmation)
			localStorage.clear();
		//otherwise, it moves them to the homepage
		else
			document.location.href="home.html";
		
	}
}

//Called when the player presses "Restart" on navigation menu
//Will clear the localStorage so the player can start over
function restartGame(){
	var confirmation = confirm ("Would you like to restart the game? This removes all progress!");
	if (confirmation){
		player = 0;
		localStorage.clear();
		document.location.href="start.html";
	}
}

//Checks if the population has decreased to 0. If it has, moves user to the game over page
function gameOver(){
	if (player.playerResource[0].totalCapacity == 0 || (player.timeElapsed / 12) >= player.timeLimit && player.timeLimit != 0)
		document.location.href = "gameover.html";
}


//Empties and appends everything in the navigation bar
function displayNavBarStat(){
	$("#playerName").empty();
	$("#pollution").empty();
	$("#happiness").empty();
	$("#population").empty();
	$("#timeElapsed").empty();
	$("#playerName").append("Player: " + player.name);
	$("#pollution").append("<font color='green'> Pollution: " + player.playerStats[0].level + "</font>");
	$("#happiness").append("<font color='green'> Happiness: " +player.playerStats[1].level + "</font>");
	$("#population").append("<font color='green'> Population: " + player.playerResource[0].currentAmount + " / " + player.playerResource[0].totalCapacity + "</font>");
	$("#timeElapsed").append("<font color='green'>" + Math.floor(player.timeElapsed / 12) + " Y " + player.timeElapsed % 12 + " M </font>");
}

//Displays all the player resources as rows of a table
function displayResources(){
	$("#resource").empty();
	for (var i in player.playerResource){
		//convertPlayerResourceToInt(i);
		$("#resource").append("<tr><td>" + player.playerResource[i].name + ":</td><td>&nbsp;" + player.playerResource[i].currentAmount + " / " + player.playerResource[i].totalCapacity + "</td></tr>");
	}
}
//calculates everything that needs progression based on time from the last time an update was performed
function calculateEverythingFromLastUpdate(){
	//save the date of last update, current date and the difference in milliseconds between the two.
	var oldtime = Date.parse(player.lastUpdate);
	var newtime = new Date();
	var timeDifference = newtime.getTime() - oldtime;
	var oneMonth = 300000;
	
	//add in the left over milliseconds from the last update
	//e.g., if the last update was 1 and a half minute, the left over milliseconds would be 30000
	timeDifference += player.timeFromLastUpdateToNow;
	
	console.log(timeDifference);
	//timeDifference = 30000000;
	//add the timeDifference to populationGrowthTime, which is for population growth, every 9 minutes or 2700000 milliseconds
	player.populationGrowthTimer += timeDifference;
	if (timeDifference >= oneMonth){
		//create an array to save the indexes of job to remove
		var indexesToRemove = [];
		//convert the time difference from milliseconds to minutes
		timeDifference = Math.floor(timeDifference / oneMonth);
		//save the minutes to timeElapsed, which stores how long the player has been playing the game for
		player.timeElapsed += timeDifference;
		
		//if timeDifference is greater than the amount specified, it will display an alert
		if (timeDifference >= 5)
			displayAlert(0, timeDifference);
		
		//job calculation start
		//loop through all the jobs, calling playerJobProgress()
		for (var i in player.jobs)
			playerJobProgress(i, timeDifference, indexesToRemove, oneMonth);
		
		//display an alert. if more than one job has been completed, than it displays an alert saying how many jobs have been completed
		if (indexesToRemove.length > 1)
			displayAlert(1, indexesToRemove.length);
		//if only one job has been completed, it displays an alert with the job name and that it has been completed
		else if (indexesToRemove.length == 1)
			displayAlert(2, player.jobs[indexesToRemove].name);
		
		//create an array of resources that need to be removed from the map
		var jobCompleteForResourceRemoval = [];
		for (var i in indexesToRemove)
			//add each job in indexes to remove to the array
			jobCompleteForResourceRemoval.push(player.jobs[indexesToRemove[i]]);
		if (jobCompleteForResourceRemoval.length > 0){
			//sort the array from highest index to lowest
			sortFinishedJobByResourceIndex(jobCompleteForResourceRemoval);
			while (jobCompleteForResourceRemoval.length > 0)
				//pops each index and removes it if the resource is 0
				removeResourceIfZero(jobCompleteForResourceRemoval.pop());
		}
		//loop through the indexesToRemove and pop it, sending the value to End() which will remove the job from player.jobs[]
		while (indexesToRemove.length > 0){
			End(indexesToRemove.pop(), true);
		} //job calculation end
		
		
		//calculates how much the population will grow
		//calculate population growth before food, otherwise, if a player has been away for long periods of time
		//the population growth will exceed the starvation, even though the player cannot support the large population
		var totalPopulationIncrease = 0;
		var totalPopulationWithoutFood = 0;
		
		if (player.populationGrowthTimer >= oneMonth * 9){
			totalPopulationIncrease = calculatePopulationGrowth();
		}
			
		for (var i = 0; i < timeDifference; i++){
			// food calculation start
			//Increments the food only since that is the only resource that can be incremented
			player.playerResource[1].currentAmount += player.playerResource[1].amountPerLevel * player.playerStats[6].level;
		
		
			//remove food if player has enough food to sustain population
			if (player.playerResource[1].currentAmount >= player.playerResource[0].currentAmount * 2){
				player.playerResource[1].currentAmount -= player.playerResource[0].currentAmount * 2;
				//increase happiness due to having enough food
				player.playerStats[1].level += Math.floor(player.playerResource[0].currentAmount * .3);
				
				//if the currentAmount of food left over after feeding the population is > the totalCapacity, set currentAmount = totalCapacity
				if (player.playerResource[1].currentAmount > player.playerResource[1].totalCapacity)
					player.playerResource[1].currentAmount = player.playerResource[1].totalCapacity;
			}
			//otherwise, the population that the food cannot support will be removed
			else{
				//number of people with enough food that will survive in the entire population
				var populationWithFood = Math.floor( player.playerResource[1].currentAmount / 2);
				//number of people without food for one iteration of the loop
				var populationWithoutFood = player.playerResource[0].currentAmount - populationWithFood;
				//total number of people without food for all iteration of the loop
				totalPopulationWithoutFood += populationWithoutFood;
				//remove happiness due to starvation
				player.playerStats[1].level -= Math.floor((populationWithoutFood) * .5)
				//change the currentAmount and totalCapacity of the population
				player.playerResource[0].currentAmount = populationWithFood;
				player.playerResource[0].totalCapacity = populationWithFood;
				//set current amount of food to 0 because there is not enough food
				player.playerResource[1].currentAmount = 0;
			}
		}//food and population calculation end
		
		//display alert if there was population growth with the amount of growth
		if (totalPopulationIncrease > totalPopulationWithoutFood)
			displayAlert(4, totalPopulationIncrease - totalPopulationWithoutFood);
		//display alert if there was more starvation than population growth
		else if (totalPopulationIncrease < totalPopulationWithoutFood)
			displayAlert(3, totalPopulationWithoutFood - totalPopulationIncrease);
		
		
		//increase pollution by 10% of population in town (currentAmount variable, not totalCapacity)
		player.playerStats[0].level += Math.floor(player.playerResource[0].currentAmount * .1) * timeDifference;
		//decrease happiness by 1% of pollution
		player.playerStats[1].level -= Math.floor(player.playerStats[0].level * .01) * timeDifference;
		
		//prevent the happiness level from dropping below 0
		//otherwise, once it becomes negative, it DRASTICALLY increases the chance of a riot
		if (player.playerStats[1].level < 0)
			player.playerStats[1].level = 0;
		
		//if the random number generated is >= (100 - happiness / 1000) then riot occurs
		var unhappiness = player.playerResource[0].totalCapacity - player.playerStats[1].level;
		if (unhappiness > 0){
			if ( (Math.random() * 100) >= (100 - (unhappiness/ 100)) )
				riot();
		}
		
		//if random number generated is >= 100 - pollution level / 1000 then a storm will occur
		if ( (Math.random() * 100) >= (100 - (player.playerStats[0].level / 1000)) )
			storm();
		
		//call game over after calculating the surviving population based on food
		gameOver();
	}
	//save the remainder of the timeDifference variable / oneMonth for the next update
	player.timeFromLastUpdateToNow = timeDifference % oneMonth;
	//save the time of this update (current time) to lastUpdate for the next time the function is called
	player.lastUpdate = newtime;
}

//function to generate a storm
function storm(){
	//calculate the power of the storm.
	var stormPower = Math.floor(Math.random() * (player.playerStats[0].level / 1000));
	//randomize the resource destroyed in the storm
	var resourceToDestroy = Math.floor(Math.random() * 8);
	
	
	if (stormPower > 0){
		//check if there is any resource to destroy
		if (player.playerResource[resourceToDestroy].currentAmount > 0){
			//decrease the amount of resources by the storm power
			player.playerResource[resourceToDestroy].currentAmount -= stormPower;
			//sets the resource amount to 0 if it becomes < 0
			if (player.playerResource[resourceToDestroy].currentAmount < 0){
				//display an alert that shows how many resources were destroyed
				//The stormPower + currentAmount will display the amount of resources that were lost, otherwise, it would display an amount > the amount of resources the player has
				var alert = [player.playerResource[resourceToDestroy].name, stormPower + player.playerResource[resourceToDestroy].currentAmount];
				displayAlert(8, alert);
				//sets the resource to 0
				player.playerResource[resourceToDestroy].currentAmount = 0;
			}
			else{
				//if the currentAmount does not become < 0, then there is no calculation needed.
				var alert = [player.playerResource[resourceToDestroy].name, stormPower];
				displayAlert(8, alert);
			}
			
			//SPECIAL CASE
			//if the population gets decreased due to storm, then decrease total amount of population
			if (resourceToDestroy == 0){
				//remove the amount the population decreased by from the totalCapacity
				player.playerResource[resourceToDestroy].totalCapacity -= stormPower;
				//sets totalCapacity to 0 if it decreases below 0
				if (player.playerResource[resourceToDestroy].totalCapacity < 0)
					player.playerResource[resourceToDestroy].totalCapacity = 0;
			}
		}
		//displays an alert saying the player lost no resources if the player had no resources to lose
		else
			displayAlert(9, "");
	}
	//displays an alert saying the player lost no resources if the storm power was not > 0
	else
		displayAlert(9, "");
}

//function to generate a riot
function riot(){
	//randomize the resource to lose in the riot
	var resourceForRiot = Math.floor((Math.random() * 9));
	//checks if the currentAmount of resources is equal to 0
	if (player.playerResource[resourceForRiot].currentAmount == 0)
		//display an alert saying no resources are lost
		displayAlert(10, "no resources");
	else {
		//calculate the amount of resources lost
		var resourcesLost = Math.floor((Math.random() * (player.playerResource[resourceForRiot].currentAmount - player.playerStats[1].level)));
		//removes the amount of resources that are lost in the riot
		player.playerResource[resourceForRiot].currentAmount -= resourcesLost;
		
		//if currentAmount of resources is < 0, set resourcesLost to the amount of resources that was lost to riot by adding the negative amount of resources
		if (player.playerResource[resourceForRiot].currentAmount < 0){
			resourcesLost += player.playerResource[resourceForRiot].currentAmount;
			//set currentAmount to 0
			player.playerResource[resourceForRiot].currentAmount = 0;
		}
		
		//population is a special case, so we need to to an additional check to remove the totalCapacity (total population)
		if (resourceForRiot == 0 && resourcesLost > 0){
			player.playerResource[0].totalCapacity -= resourcesLost;
			//display a alert for the amount of deaths in the riot
			displayAlert(11, resourcesLost);
		}
		//for resources other than population
		else if (resourceForRiot != 0 && resourcesLost > 0)
			//Display an alert for the resource lost and the amount lost
			displayAlert(7, resourcesLost + " " + player.playerResource[resourceForRiot].name);
	}
}

//calculates the population growth, if any
//returns the total amount the population increases by
function calculatePopulationGrowth(){
	//Amount of times to calculate the population growth. Every 45 minutes = 1
	var populationGrowthAmount = Math.floor(player.populationGrowthTimer / 2700000);
	//keep track of how much the population increases, used to display an alert
	var totalPopulationIncrease = 0;
	//loop through to calculate the total population increase
	for (var i = 0; i < populationGrowthAmount; i++){
		//save how much the population increases
		var populationIncrease = Math.floor((Math.random() + 1) * (player.playerResource[0].currentAmount * .5));
		//increment currentAmount and totalCapacity as necessary
		player.playerResource[0].currentAmount += populationIncrease;
		player.playerResource[0].totalCapacity += populationIncrease;
		//increment totalPopulationIncrease with populationIncrease
		totalPopulationIncrease += populationIncrease;
	}
	//increment happiness
	player.playerStats[1].level += totalPopulationIncrease * .5;
	//save the leftover milliseconds for the next update
	player.populationGrowthTimer %= 2700000;
	//returns the total amount the population increases by
	return totalPopulationIncrease;
}

/*calculates the job progress
Input: index - the index of the job
	   timeDifference - the timeDifference found and calculated in calculateEverythingFromLastUpdate. Tells me how many months (in-game) has passed
	   indexesToRemove - an array used to store the indexes of jobs in the jobs array that are completed
	   oneMonth - variable that holds how long one month in-game is in real-time (stores it as milliseconds)
*/
function playerJobProgress(index, timeDifference, indexesToRemove, oneMonth){
	//Increment the job by how much it has progressed by
	player.jobs[index].completion += player.jobs[index].totalWorkers * (timeDifference * oneMonth);
	//If the job has been completed
	if ((player.jobs[index].completion / player.jobs[index].totalTimeRequired) >= 1){
		//If the job is an exploration, calls explorationComplete(index)
		if (player.jobs[index].name == 'Exploration')
			explorationComplete(index);
		//Otherwise, it calls addResourceOnJobComplete and passes the resource index and the index of the job
		else
			addResourceOnJobComplete(player.jobs[index].resource.type, index);
		//adds the job to the array indexesToRemove
		indexesToRemove.push(index);
	}
}

//adds resources on job completion
//only called when job is completed
function addResourceOnJobComplete(resourceIndex, jobIndex){
	//increment the currentAmount with the amount of resources gained from the harvest
	player.playerResource[resourceIndex].currentAmount += player.jobs[jobIndex].resource.amount * player.jobs[jobIndex].resourceHarvesting;
	//if the resources exceed the totalCapacity, the excess will be removed
	if (player.playerResource[resourceIndex].currentAmount > player.playerResource[resourceIndex].totalCapacity){
		player.playerResource[resourceIndex].currentAmount = player.playerResource[resourceIndex].totalCapacity;
	}
	
	//Randomizes the chances if workers should die or not. More workers = less chance
	if (Math.random() > player.jobs[jobIndex].totalWorkers * .001){
		//Calculates the amount of workers that can die. At most, it will be 25% of the total amount of workers
		var workerDeath = Math.floor(Math.random() * (player.jobs[jobIndex].totalWorkers * .25));
		//remove the total amount of workers from the job
		player.jobs[jobIndex].totalWorkers -= workerDeath;
		//remove the total amount of workers from the total capacity of the population
		player.playerResource[0].totalCapacity -= workerDeath;
		if (workerDeath > 0)
			//display an alert for the amount of workers that died
			displayAlert(6, workerDeath);
	}
}

//called if a map exploration job is completed

function explorationComplete(index){
	//grab the job data from the jobs array
	var map = player.jobs[index];
	//sets player.entireMap[x][y].explored to true, unshading it on the map
	player.entireMap[map.xpos][map.ypos].explored = true;
	//sets isExploring to false
	player.entireMap[map.xpos][map.ypos].isExploring = false;
}

/*Removes the job from the jobs array
Also returns the worker to the population pool
Input: index - the index of the job
	   jobComplete - boolean value, true if the job is completed, false if the job was ended prematurely
*/
function End(index, jobComplete){
	//Check if the job is completed alread
	if (jobComplete == false){
		if (player.jobs[index].name == 'Exploration')
			player.entireMap[player.jobs[index].xpos][player.jobs[index].ypos].isExploring = false;
		else{
			var resourcesHarvested = Math.floor(player.jobs[index].resourceHarvesting * player.jobs[index].completion/player.jobs[index].totalTimeRequired);
			player.entireMap[player.jobs[index].xpos][player.jobs[index].ypos].resource[player.jobs[index].resourceIndex].totalResourceCount += player.jobs[index].resourceHarvesting - resourcesHarvested;

			player.playerResource[player.jobs[index].resource.type].currentAmount += resourcesHarvested * player.jobs[index].resource.amount;
			//save the index of the resource that was harvested
			
		}
	}
	//Returns the workers assigned to the job back to the population pool
	player.playerResource[0].currentAmount += player.jobs[index].totalWorkers;
	//Remove the job from the jobs array
	player.jobs.splice(index,1);
	//call displayNavBarStat() and displayResources() to refresh the navigation bar and resources table
	displayNavBarStat();
	displayResources();
}

//Remove a resource from the map if it has been decreased to 0
function removeResourceIfZero(job){
	//Makes sure that the job is not an exploration first
	if (job.name != 'Exploration'){
		//Checks if the resource count has been decreased to 0
		if (player.entireMap[job.xpos][job.ypos].resource[job.resourceIndex].totalResourceCount == 0){
			//remove the resource from the map
			player.entireMap[job.xpos][job.ypos].resource.splice(job.resourceIndex, 1);
		}
		//if all the resources in the map are depleted
		if (player.entireMap[job.xpos][job.ypos].resource.length == 0){
			//set the map type to 3 (desert) if the area is a land
			if (player.entireMap[job.xpos][job.ypos].type == 0)
				player.entireMap[job.xpos][job.ypos].type = 3;
				
			//clearing an entire area of its resources will result in the player losing happiness equal to the amount of population
			if (player.playerStats[1].level >= player.playerResource[0].totalCapacity)
				player.playerStats[1].level -= player.playerResource[0].totalCapacity;
			//sets happiness level to 0 if the amount of happiness lost is > the happiness of the population
			else
				player.playerStats[1].level = 0;
		}
	}
}

//sorts the array from highest index to lowest index.
function sortFinishedJobByResourceIndex(resourceAtZero){
	resourceAtZero.sort(function (a, b){
		return (a.resourceIndex - b.resourceIndex);
	});
}

//Used for the text field in the modal box
//Displays the numeric value for the slider onto the text field
function insertTextFromSlider(id, value){
	$("#"+id.id).val(value);
}

//Math.floor((harvestamount * resource.amount) / player.playerStats[2].level)

//Calculates how long each job will take
function displayTotalTimeForJob(resourceToBeGained, workerAmount, resourceAmount){
	//retrieve the value of workerAmount and resourceAmount
	resourceAmount = resourceAmount.value;
	workerAmount = workerAmount.value;
	var timeTotal = Math.floor(((resourceAmount * resourceToBeGained) / player.playerStats[2].level) / workerAmount);
	
	//Displays a message depending on how long it will take for the job to finish
	if (timeTotal >= 1)
		$("#totalTimeForJob").val(timeTotal);
	else
		$("#totalTimeForJob").val("Less than 1");
}

//Displays an alert message
//the alertIndex is used in the switch statement and the message holds a customized part of the message
function displayAlert(alertIndex, message){
	switch(alertIndex){
		case 0:
			$("#alert").append("<div class='alert alert-info alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button><strong>" + message + " month ("+message * 5+" minutes)</strong> has passed. Your resources and jobs have progressed</div>");
			break;
		case 1:
			$("#alert").append("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button><strong>"+ message + "</strong> jobs have been completed while you were away</div>");
			break;
		case 2:
			$("#alert").append("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>Your job <strong>"+ message +"</strong> have been completed</div>");
			break;
		case 3:
			$("#alert").append("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>You did not have enough food to sustain your population. Your population has decreased by <strong>"+message+"</strong></div>");
			break;
		case 4:
			$("#alert").append("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>Congratulations! Your population has increased by <strong>"+message+"</strong></div>");
			break;
		case 5:
			$("#alert").append("<div class='alert alert-info alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>Game Over! <strong>"+message+"</strong></div>");
			break;
		case 6:
			$("#alert").append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button><strong>"+message+"</strong> workers have passed away during the job.</div>");
			break;
		case 7:
			$("#alert").append("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>Your people have rioted due to being unhappy! You have lost <strong>"+message+"</strong>.</div>");
			break;
		case 8:
			$("#alert").append("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>A storm has passed. Your <strong>"+message[0]+"</strong> have decreased by <strong>"+message[1]+"</strong>. <a href='facts.html'>Why did storms start occuring?</a> </div>");
			break;
		case 9:
			$("#alert").append("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>A <strong>storm</strong> has passed. but you have lost no resources. <a href='facts.html'>Why did storms start occuring?</a></div>");
			break;
		case 10:
			$("#alert").append("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>Your people have rioted due to being unhappy! But you have lost <strong>"+message+"</strong></div>");
			break;
		case 11:
			$("#alert").append("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>"+
						"&times;</span></button>The riot has resulted in <strong>"+message+"</strong> deaths</div>");
			break;
	}
}