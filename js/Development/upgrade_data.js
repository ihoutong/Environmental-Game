//Array that holds all the possible upgrades in the game
var upgrade =[
	{
		"name":"Stone Tools", 
		"description":"Research Stone Tools. Harvest Level + 1", 
		"cost":100,
		"typeOfResource": 3,
		"upgradeBenefitType":2,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Copper Tools",
		"description":"Research Copper Tools. Harvest Level + 1",
		"cost":100,
		"typeOfResource": 4,
		"upgradeBenefitType":2,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Iron Tools",
		"description":"Research Iron Tools. Harvest Level + 1",
		"cost":100,
		"typeOfResource": 5,
		"upgradeBenefitType": 2,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Transport: Horses",
		"description":"Use horses as transportation. Harvest Level + 1",
		"cost":100,
		"typeOfResource": 5,
		"upgradeBenefitType":2,
		"upgradeBenefitAmount": 1,
		"pollution": 100,
		"happiness": 150
	},
	{
		"name":"Transport: Cars",
		"description":"Uses cars as transportation. Harvest Level + 1",
		"cost":100,
		"typeOfResource": 8,
		"upgradeBenefitType":2,
		"upgradeBenefitAmount": 1,
		"pollution": 200,
		"happiness": 250
	},
	{
		"name":"Ring",
		"description":"Research Ring. Happiness + 100",
		"cost": 100,
		"typeOfResource": 7,
		"upgradeBenefitType":0,
		"upgradeBenefitAmount": 0,
		"pollution": 10,
		"happiness": 100
	},
	{
		"name":"Necklace",
		"description":"Research Necklace. Happiness + 100",
		"cost":100,
		"typeOfResource": 7,
		"upgradeBenefitType":0,
		"upgradeBenefitAmount": 0,
		"pollution": 10,
		"happiness": 100
	},
	{
		"name":"Boat",
		"description":"Allows exploring ocean and land across the ocean. Sea Exploration + 1",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":4,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Copper Boat",
		"description":"Allows faster exploration ocean and land across the ocean. Sea Exploration + 1",
		"cost":100,
		"typeOfResource": 4,
		"upgradeBenefitType":4,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Iron Boat",
		"description":"Allows faster exploration ocean and land across the ocean. Sea Exploration + 1",
		"cost":100,
		"typeOfResource": 5,
		"upgradeBenefitType":4,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Farming",
		"description":"Research farming. Increases Food Production level by 1. Monthly Food Production + 20",
		"cost":100,
		"typeOfResource": 1,
		"upgradeBenefitType":6,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Livestock: Pig",
		"description":"Domesticate Pigs. Increases Food Production level by 1. Monthly Food Production + 20",
		"cost":100,
		"typeOfResource": 1,
		"upgradeBenefitType":6,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Livestock: Cow",
		"description":"Domesticate Cow. Increases Food Production level by 1. Monthly Food Production + 20",
		"cost":100,
		"typeOfResource": 1,
		"upgradeBenefitType":6,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Livestock: Lamb",
		"description":"Domesticate Lamb. Increases Food Production level by 1. Monthly Food Production + 20",
		"cost":100,
		"typeOfResource": 1,
		"upgradeBenefitType":6,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Livestock: Chicken",
		"description":"Domesticate Chicken. Increases Food Production level by 1. Monthly Food Production + 20",
		"cost":100,
		"typeOfResource": 1,
		"upgradeBenefitType":6,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Food Storage",
		"description":"Upgrade food capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":7,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Wood Storage",
		"description":"Upgrade wood capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":8,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Rocks Storage",
		"description":"Upgrade rocks capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":9,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Copper Storage",
		"description":"Upgrade copper capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":10,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Iron Storage",
		"description":"Upgrade iron capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":11,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Coal Storage",
		"description":"Upgrade coal capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":12,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Gold Storage",
		"description":"Upgrade gold capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":13,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	{
		"name":"Upgrade Oil Storage",
		"description":"Upgrade oil capacity by 1000",
		"cost":100,
		"typeOfResource": 2,
		"upgradeBenefitType":14,
		"upgradeBenefitAmount": 1,
		"pollution": 5,
		"happiness": 5
	},
	/*,
	{
		"name":"",
		"description":"",
		"cost":,
		"typeOfResource": ,
		"upgradeBenefitType":,
		"upgradeBenefitAmount": ,
		"pollution": ,
		"happiness": 
	},*/
];