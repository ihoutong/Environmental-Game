//used by start.html create a player
function Player(){
	this.name;
	//hold x and y for player starting location
	this.baseXPos;
	this.baseYPos;
	this.timeLimit;
	//holds the time the player has been playing the game for. Used as months, rather than milliseconds
	this.timeElapsed;
	//array of map
	this.entireMap;
	
	//array of playerresource
	this.playerResource;
	//array of playerstats
	this.playerStats;
	//array of jobs
	this.jobs;
	//array of 10 messages
	//used to simulate as if the world is alive, and the npc talks to the player
	this.npcMessages;
	//Holds the date when resources and jobs were last updated
	this.lastUpdate;
	//holds a numeric value from 0-59999.
	this.timeFromLastUpdateToNow;
	//array that holds all possible upgrades in the game
	this.allUpgrades;
	this.populationGrowthTimer;
	
	this.bind_events();
}

Player.prototype.new_player = function (){
	this.reset_player_stats();
	this.reset_player_resource();
	this.jobs = [];
	this.timeElapsed = 0;
	this.populationGrowthTimer = 0;
	this.lastUpdate = new Date();
	this.timeFromLastUpdateToNow = 0;
}

Player.prototype.set_start_position = function (x, y){
	this.baseXPos = x;
	this.baseYPos = y;
	this.entireMap[x][y].explored = true;
}

Player.prototype.set_name = function (name){
	this.name = name;
}

Player.prototype.set_time_limit = function (time_limit){
	this.timeLimit = time_limit;
}

Player.prototype.save_player = function (){
	localStorage.player = JSON.stringify(this);
}

Player.prototype.load_player = function (){
	var player_data = localStorage.player;
	if (typeof player_data !== "undefined"){
		player_data = JSON.parse(player_data);
		for (var key in player_data){
			this[key] = player_data[key];
		}
		return true;
	}
	return false;
}


Player.prototype.bind_events = function (){
	var this_player = this;
	$(window).on('beforeunload', function (){
		if (this_player.player == 0){
			return;
		}
		this_player.save_player();
	});	
}

Player.prototype.generate_chatter = function (){
	if (player.npcMessages.length > 15){
		player.npcMessages.splice(14, 1);
	}
	
	if (typeof messages === 'object' && messages.length > 0){
		player.npcMessages.unshift(messages[Math.floor(Math.random() * 13)]);
	}
}

Player.prototype.reset_player_stats = function (){
	this.playerStats = [
		{
			"name":"Pollution",
			//"type":"Pollution",
			"level":0
		},
		{
			"name":"Happiness",
			//"type":"Happiness",
			"level":30
		},
		{
			"name":"Harvest",
			//"type":"Harvest",
			"level":1
		},
		{
			"name":"Hunt",
		//	"type":"Hunt",
			"level":1
		},
		{
			"name":"Sea Exploration",
			//"type":"Sea Exploration",
			"level":0
		},
		{
			"name":"Land Exploration",
			//"type":"Land Exploration",
			"level":1
		},
		{
			"name":"Food Per Month",
			//"type":"Food",
			"level":1
		},
		{
			"name":"Food Capacity",
			//"type":"",
			"level":1
		},
		{
			"name":"Wood Capacity",
			//"type":"",
			"level":1
		},
			{
			"name":"Rocks Capacity",
			//"type":"",
			"level":1
		},
			{
			"name":" Copper Capacity",
			//"type":"",
			"level":1
		},
			{
			"name":"Iron Capacity",
			//"type":"",
			"level":1
		},
			{
			"name":"Coal Capacity",
			//"type":"",
			"level":1
		},
			{
			"name":"Gold Capacity",
			//"type":"",
			"level":1
		},
			{
			"name":"Oil Capacity",
			//"type":"",
			"level":1
		},
		/* skeleton for future
		{
			"name":"",
			//"type":"",
			"level":""
		},
		*/
	];
}

Player.prototype.reset_player_resource = function (){
	this.playerResource = [
		{
			"name":"Population",
			"type":0,
			"currentAmount":30,
			"totalCapacity":30,
			"amountPerLevel":0
		},
		{
			"name":"Food",
			"type":1,
			"currentAmount":1000,
			"totalCapacity":1000,
			"amountPerLevel":20
		},
		{
			"name":"Wood",
			"type":2,
			"currentAmount":1000,
			"totalCapacity":1000,
			"amountPerLevel":0
		},
		{
			"name":"Rocks",
			"type":3,
			"currentAmount":0,
			"totalCapacity":1000,
			"amountPerLevel":0
		},
		{
			"name":"Copper",
			"type":4,
			"currentAmount":0,
			"totalCapacity":1000,
			"amountPerLevel":0
		},
		{
			"name":"Iron",
			"type":5,
			"currentAmount":0,
			"totalCapacity":1000,
			"amountPerLevel":0
		},
		{
			"name":"Coal",
			"type":6,
			"currentAmount":0,
			"totalCapacity":1000,
			"amountPerLevel":0
		},
		{
			"name":"Gold",
			"type":7,
			"currentAmount":0,
			"totalCapacity":1000,
			"amountPerLevel":0
		},
		{
			"name":"Oil",
			"type":8,
			"currentAmount":0,
			"totalCapacity":1000,
			"amountPerLevel":0
		}
		/* skeleton in case it is needed in the future
		{
			"name":"",
			"type":"",
			"currentAmount":"",
			"totalCapacity":"",
			"amountPerLevel":""
		},*/
	];
}