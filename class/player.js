//used by start.html create a player
function Player(){
	var name;
	//hold x and y for player starting location
	var baseXPos;
	var baseYPos;
	var timeLimit;
	//holds the time the player has been playing the game for. Used as months, rather than milliseconds
	var timeElapsed;
	//array of map
	var entireMap;
	
	//array of playerresource
	var playerResource;
	//array of playerstats
	var playerStats;
	//array of jobs
	var jobs;
	//array of 10 messages
	//used to simulate as if the world is alive, and the npc talks to the player
	var npcMessages;
	//Holds the date when resources and jobs were last updated
	var lastUpdate;
	//holds a numeric value from 0-59999.
	var timeFromLastUpdateToNow;
	//array that holds all possible upgrades in the game
	var allUpgrades;
	var populationGrowthTimer;
}